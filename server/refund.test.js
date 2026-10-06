import test from 'node:test';
import assert from 'node:assert';
import { createOrderService } from './order-service.js';

function createMockRepo() {
  const orders = [];
  return {
    orders,
    transaction: async (work) => {
      const session = {};
      return work({
        find: async (query) => {
          let o;
          if (query._id) o = orders.find(o => o._id === query._id);
          else if (query.paymentIntentId) o = orders.find(o => o.paymentIntentId === query.paymentIntentId);
          if (o) return JSON.parse(JSON.stringify(o));
          return null;
        },
        save: async (order) => {
          const idx = orders.findIndex(o => o._id === order._id);
          if (idx >= 0) orders[idx] = JSON.parse(JSON.stringify(order));
          else orders.push(JSON.parse(JSON.stringify(order)));
          order.save = async () => order;
          return order;
        },
        create: async (data) => {
          const order = { _id: 'test-id', ...data };
          orders.push(JSON.parse(JSON.stringify(order)));
          order.save = async () => order;
          return order;
        }
      });
    }
  };
}

test('refund finalization ignores false local failure if provider succeeded', async () => {
  const repo = createMockRepo();
  repo.orders.push({
    _id: '1',
    total: 1000,
    paymentStatus: 'paid',
    paymentId: 'pay_123',
    refunds: [],
    activityHistory: []
  });

  const gateway = {
    payments: {
      refund: async () => {
        // Simulate a race condition: While gateway is processing, a rogue process or reconciliation falsely marks it failed
        repo.orders[0].refunds[0].status = 'failed';
        return { id: 'ref_123', status: 'processed' };
      }
    }
  };

  const service = createOrderService({ repository: repo, gateway, now: () => new Date() });
  await service.refund('1', { amount: 500, reason: 'test', idempotencyKey: 'idem-1', adminUser: 'admin-1' });
  
  assert.strictEqual(repo.orders[0].refunds[0].status, 'processed');
  assert.strictEqual(repo.orders[0].paymentStatus, 'partially_refunded');
});

test('reconciliation does not falsely fail unmatched in-progress refunds', async () => {
  const repo = createMockRepo();
  const time = new Date('2024-01-01T12:00:00Z');
  repo.orders.push({
    _id: '1',
    total: 1000,
    paymentIntentId: 'order_123',
    paymentId: 'pay_123',
    paymentStatus: 'paid',
    refunds: [{
      amount: 500,
      status: 'pending',
      idempotencyKey: 'idem-1',
      createdAt: time
    }],
    activityHistory: []
  });

  const gateway = {
    orders: {
      fetchPayments: async () => ({ items: [{ id: 'pay_123', status: 'captured', amount: 1000, currency: 'INR' }] })
    },
    payments: {
      fetchRefunds: async () => ({ items: [] }) // provider hasn't seen it yet
    }
  };

  const service = createOrderService({ repository: repo, gateway, now: () => new Date(time.getTime() + 60000) }); // 1 min later
  await service.reconcilePayment('1', 'admin');
  
  // It should remain pending because 1 min < 15 mins
  assert.strictEqual(repo.orders[0].refunds[0].status, 'pending');

  const futureService = createOrderService({ repository: repo, gateway, now: () => new Date(time.getTime() + 20 * 60000) }); // 20 mins later
  await futureService.reconcilePayment('1', 'admin');
  
  // NOW it should STILL stay pending, never auto-fail
  assert.strictEqual(repo.orders[0].refunds[0].status, 'pending');
});

test('retrying a failed refund enforces idempotency immutability and recalculates limits', async () => {
  const repo = createMockRepo();
  repo.orders.push({
    _id: '1',
    total: 1000,
    paymentStatus: 'paid',
    paymentId: 'pay_123',
    refunds: [{
      amount: 800,
      status: 'failed',
      idempotencyKey: 'idem-1'
    }],
    activityHistory: []
  });

  const gateway = {
    payments: {
      refund: async () => ({ id: 'ref_123', status: 'processed' })
    }
  };

  const service = createOrderService({ repository: repo, gateway, now: () => new Date() });
  
  // Re-using key with different amount is blocked
  await assert.rejects(service.refund('1', { amount: 200, reason: 'test', idempotencyKey: 'idem-1' }), /Idempotency key reused with different amount/);
  
  // Try a second refund of 300 to max out the limit
  await service.refund('1', { amount: 300, reason: 'test', idempotencyKey: 'idem-2' });
  
  // Now retrying the failed 800 should hit the limit (800 + 300 = 1100 > 1000)
  await assert.rejects(service.refund('1', { amount: 800, reason: 'test', idempotencyKey: 'idem-1' }), /Refund amount exceeds order total/);
});


test('uncertain requests are reserved and reconcile handles original success after long delays without double-refunding', async () => {
  const repo = createMockRepo();
  repo.orders.push({
    _id: '1',
    total: 1000,
    paymentIntentId: 'order_123',
    paymentId: 'pay_123',
    paymentStatus: 'paid',
    refunds: [{
      amount: 1000,
      status: 'pending',
      idempotencyKey: 'idem-1',
      createdAt: new Date('2024-01-01T12:00:00Z')
    }],
    activityHistory: []
  });

  const gateway = {
    orders: {
      fetchPayments: async () => ({ items: [{ id: 'pay_123', status: 'captured', amount: 1000, currency: 'INR' }] })
    },
    payments: {
      fetchRefunds: async () => ({
        items: [
          { id: 'ref_123', status: 'processed', notes: { idempotencyKey: 'idem-1' } }
        ],
        has_more: false
      })
    }
  };

  const service = createOrderService({ repository: repo, gateway, now: () => new Date('2024-01-02T12:00:00Z') }); // 1 Day later
  
  // Since the original 1000 is pending, admin CANNOT issue another 1000 because total is 1000.
  await assert.rejects(service.refund('1', { amount: 1000, reason: 'retry', idempotencyKey: 'idem-2', adminUser: 'admin' }), /Refund amount exceeds order total/);

  // Reconciliation will correctly find the delayed original success and finalize it
  await service.reconcilePayment('1', 'admin');
  
  assert.strictEqual(repo.orders[0].refunds[0].status, 'processed');
  assert.strictEqual(repo.orders[0].refunds[0].providerRefundId, 'ref_123');
  assert.strictEqual(repo.orders[0].paymentStatus, 'refunded');
});
