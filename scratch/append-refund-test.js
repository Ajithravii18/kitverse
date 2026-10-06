import fs from 'fs';

const path = 'server/refund.test.js';
let content = fs.readFileSync(path, 'utf8');

const newTest = `
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
`;

content += '\n' + newTest;
fs.writeFileSync(path, content, 'utf8');
