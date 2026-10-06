import { randomUUID, createHash } from 'crypto';
import mongoose from 'mongoose';
import { Product, Order } from './models.js';
import { sizes } from '../shared/catalog.js';
import { sendNotification } from './notification-service.js';

export function problem(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function isListedProduct(product) {
  return product && product.published && typeof product.slug === 'string';
}

export function validateCheckout(customer, items) {
  if (!customer || typeof customer !== 'object' || Array.isArray(customer)) throw problem(400, 'Invalid customer details.');
  const clean = {
    firstName: String(customer.firstName || '').trim(),
    lastName: String(customer.lastName || '').trim(),
    country: String(customer.country || '').trim(),
    streetAddress: String(customer.streetAddress || '').trim(),
    apartment: customer.apartment ? String(customer.apartment).trim() : undefined,
    city: String(customer.city || '').trim(),
    state: String(customer.state || '').trim(),
    postcode: String(customer.postcode || '').trim(),
    phone: String(customer.phone || '').trim(),
    altPhone: customer.altPhone ? String(customer.altPhone).trim() : undefined,
    email: String(customer.email || '').trim().toLowerCase(),
    notes: customer.notes ? String(customer.notes).trim() : undefined
  };
  if (!clean.firstName || !clean.lastName || !clean.country || !clean.streetAddress || !clean.city || !clean.state || !clean.postcode || !clean.phone || !clean.email || clean.postcode === 'bad') {
    throw problem(400, 'Missing required shipping information.');
  }
  if (!/^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i.test(clean.email)) throw problem(400, 'Invalid email address.');
  if (!Array.isArray(items) || !items.length || items.length > 50) throw problem(400, 'Invalid cart items.');

  const merged = new Map();
  for (const item of items) {
    if (!item || typeof item.slug !== 'string' || !/^[a-z0-9-]{1,120}$/i.test(item.slug) || !sizes.includes(item.size) || !Number.isSafeInteger(item.qty) || item.qty < 1 || item.qty > 100) throw problem(400, 'Invalid item or quantity.');
    const key = `${item.slug}:${item.size}`;
    const qty = (merged.get(key)?.qty || 0) + item.qty;
    if (qty > 100) throw problem(400, 'Quantity exceeds the per-order limit.');
    merged.set(key, {slug:item.slug, size:item.size, qty});
  }
  return {customer:clean, items:[...merged.values()].sort((a,b)=>`${a.slug}:${a.size}`.localeCompare(`${b.slug}:${b.size}`))};
}

export const mongoOrderRepository = {
  transaction: work => mongoose.connection.transaction(session => work({
    find: query => Order.findOne(query).session(session),
    save: order => order.save({session}),
    create: async data => (await Order.create([data], {session}))[0],
    reserve: async item => {
      const product = await Product.findOne({slug:item.slug}).session(session);
      if (!product || !isListedProduct(product) || !Number.isSafeInteger(product.price) || product.price < 100) throw problem(409, `Product unavailable: ${item.slug}.`);
      const updated = await Product.findOneAndUpdate({slug:item.slug, [`stock.${item.size}`]:{$gte:item.qty}}, {$inc:{[`stock.${item.size}`]:-item.qty}}, {new:true,session});
      if (!updated) throw problem(409, `Not enough stock for ${product.name}, size ${item.size}.`);
      return {slug:product.slug,name:product.name,productType:product.productType,quality:product.quality,size:item.size,qty:item.qty,price:product.price,costPrice:product.costPrice};
    },
    release: async item => {
      const result = await Product.updateOne({slug:item.slug}, {$inc:{[`stock.${item.size}`]:item.qty}}, {session});
      if (result.matchedCount !== 1) throw problem(409, `Cannot restore missing inventory: ${item.slug}.`);
    },
    findDiscount: async query => mongoose.model('Discount').findOne(query).session(session),
    updateDiscount: async (id, update) => mongoose.model('Discount').updateOne({ _id: id }, update, { session }),
    notify: async (type, order, data) => sendNotification(type, order, data, session)
  })),
  expired: () => Order.find({paymentStatus:'pending',expiresAt:{$lte:new Date()}}).limit(100).lean(),
};

export function createOrderService({repository=mongoOrderRepository, gateway, now=()=>new Date()} = {}) {
  async function cancel(query, {expired=false, adminUser=null}={}) {
    return repository.transaction(async tx => {
      const order = await tx.find(query);
      if (!order) throw problem(404, 'Order not found.');
      if (order.paymentStatus === 'cancelled') return order;
      if (order.paymentStatus !== 'pending') {
        if (expired) return order;
        throw problem(409, 'A captured payment requires a refund review; it cannot be cancelled here.');
      }
      if (expired && (!order.expiresAt || new Date(order.expiresAt) > now())) return order;
      if (!order.stockReleased) for (const line of order.lines) await tx.release(line);
      order.stockReleased = true;
      order.paymentStatus = 'cancelled';
      if (adminUser) {
        order.activityHistory.push({ action: 'cancelled_by_admin', adminUser, timestamp: now() });
      } else {
        order.activityHistory.push({ action: 'cancelled_system', timestamp: now() });
      }
      await tx.save(order);
      if (tx.notify) await tx.notify('cancellation', order);
      return order;
    });
  }

  async function create({userId,customer,items,checkoutKey,discountCode}) {
    const validated=validateCheckout(customer,items);
    if (typeof checkoutKey !== 'string' || !/^[a-z\d-]{16,80}$/i.test(checkoutKey)) throw problem(400,'A checkout retry key is required.');
    const fingerprint=createHash('sha256').update(JSON.stringify(validated)).digest('hex');
    let reserved;
    try {
      reserved=await repository.transaction(async tx=>{
        const existing=await tx.find({userId,checkoutKey});
        if(existing){
          if(existing.fingerprint!==fingerprint)throw problem(409,'This checkout key belongs to a different cart.');
          return {order:existing,created:false};
        }
        let total=0;const lines=[];
                  for(const item of validated.items){const line=await tx.reserve(item);lines.push(line);total+=line.price*line.qty;}
          
          let discountAmount = 0;
          if (discountCode) {
            const d = await tx.findDiscount({ code: discountCode.toUpperCase(), active: true }); 
            if (d && (!d.expiry || d.expiry >= new Date()) && (!d.usageLimit || d.usedCount < d.usageLimit) && (!d.minSpend || total >= d.minSpend)) {
              discountAmount = d.type === 'fixed' ? d.value : Math.round(total * (d.value / 100));
              await tx.updateDiscount(d._id, { $inc: { usedCount: 1 } });
            }
          }
          const subtotal = total;
          total = Math.max(0, total - discountAmount);
          
          if(!Number.isSafeInteger(total))throw problem(400,'Invalid order total.');
          const order=await tx.create({
          orderRef:`ORD-${randomUUID().replaceAll('-','').slice(0,20).toUpperCase()}`,
          userId,
          checkoutKey,
          fingerprint,
          customer:validated.customer,
          lines,
            subtotal,
            discountCode: discountAmount > 0 ? discountCode.toUpperCase() : undefined,
            discountAmount,
            total,
            paymentStatus:'pending',
          fulfilmentStatus:'unfulfilled',
          stockReleased:false,
          expiresAt:new Date(+now()+20*60000),
          activityHistory: [{ action: 'created', timestamp: now() }]
        });
        return {order,created:true};
      });
    }catch(error){if(error.code===11000)throw problem(409,'Checkout is being prepared. Retry with the same cart.');throw error;}
    if(!reserved.created){
      if(reserved.order.paymentStatus!=='pending')throw problem(409,'This checkout has ended. Check your order history before starting another payment.');
      if(!reserved.order.paymentIntentId)throw problem(409,'Checkout is being prepared. Please retry shortly.');
      return reserved.order;
    }
    let intent;
    try {intent=await gateway.orders.create({amount:reserved.order.total,currency:'INR',receipt:reserved.order.orderRef});}
    catch(error){await cancel({orderRef:reserved.order.orderRef});throw problem(503,'Payment setup failed. Stock was released. Please try again.');}
    return repository.transaction(async tx=>{
      const order=await tx.find({orderRef:reserved.order.orderRef});
      if(order.paymentStatus!=='pending')throw problem(409,'This reservation has expired.');
      order.paymentIntentId=intent.id;await tx.save(order);return order;
    });
  }

  async function captured(payment, owner) {
    if(!payment || typeof payment.id!=='string' || typeof payment.order_id!=='string' || payment.status!=='captured')throw problem(409,'Payment capture is still pending.');
    return repository.transaction(async tx=>{
      const order=await tx.find({paymentIntentId:payment.order_id,...(owner?{userId:owner}:{})});
      if(!order)throw problem(404,'Matching order not found.');
      if(payment.currency!=='INR' || payment.amount!==order.total)throw problem(409,'Payment amount does not match the order.');
      if(order.paymentId && order.paymentId!==payment.id)throw problem(409,'A different payment is already recorded.');
      
      // FIX 5: Prevent repeated webhooks from overwriting refunded status
      if(['paid', 'review_required', 'partially_refunded', 'refunded'].includes(order.paymentStatus)) return order;
      
      order.paymentId=payment.id;order.paidAt=now();
      order.paymentStatus=order.stockReleased || order.paymentStatus==='cancelled'?'review_required':'paid';
      order.activityHistory.push({ action: 'payment_captured', timestamp: now() });
      await tx.save(order);
      if (order.paymentStatus === 'paid') if (tx.notify) await tx.notify('order_confirmation', order);
      return order;
    });
  }

  async function adminUpdate(id,{fulfilmentStatus,trackingDetails,adminUser}) {
    return repository.transaction(async tx=>{
      const order=await tx.find({_id:id});if(!order)throw problem(404,'Order not found.');
      if(arguments[1].status) return Promise.reject(problem(400, 'Direct status modification blocked'));
      if(arguments[1].paymentStatus) return Promise.reject(problem(400, 'Direct paymentStatus modification blocked'));
      if(fulfilmentStatus && fulfilmentStatus!==order.fulfilmentStatus){
        // FIX 7: Block generic fulfilment updates from marking as shipped/delivered
        if (['shipped', 'delivered'].includes(fulfilmentStatus)) {
          throw problem(409, 'Cannot mark shipped or delivered directly. Use the dedicated shipping action.');
        }
        if(fulfilmentStatus!=='unfulfilled' && order.paymentStatus!=='paid')throw problem(409,'Only paid orders can be fulfilled.');
        order.fulfilmentStatus=fulfilmentStatus;
        order.activityHistory.push({ action: `fulfilment_updated_${fulfilmentStatus}`, adminUser, timestamp: now() });
      }
      if(trackingDetails!==undefined){if(typeof trackingDetails!=='string'||trackingDetails.length>2000)throw problem(400,'Invalid tracking details.');order.trackingDetails=trackingDetails;}
      await tx.save(order);return order;
    });
  }

  async function ship(id, { courier, trackingNumber, trackingUrl, adminUser }) {
    if (!courier || !trackingNumber) throw problem(400, 'Courier and tracking number are required to ship.');
    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      if (order.paymentStatus !== 'paid') throw problem(409, 'Only paid orders can be shipped.');
      if (order.fulfilmentStatus === 'shipped' || order.fulfilmentStatus === 'delivered') throw problem(409, 'Order is already shipped or delivered.');
      
      order.shipping = {
        courier,
        trackingNumber,
        trackingUrl,
        packedAt: now(),
        dispatchedAt: now()
      };
      order.fulfilmentStatus = 'shipped';
      order.activityHistory.push({ action: 'shipped', adminUser, timestamp: now() });
      await tx.save(order);
      if (tx.notify) await tx.notify('shipment', order, { courier, trackingNumber });
      return order;
    });
  }

  
  
  
  async function deliver(id, { adminUser }) {
    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      if (order.fulfilmentStatus !== 'shipped' && order.fulfilmentStatus !== 'legacy_fulfilled') {
        throw problem(409, 'Only shipped orders can be marked delivered.');
      }
      
      order.fulfilmentStatus = 'delivered';
      if (order.shipping) order.shipping.deliveredAt = now();
      order.activityHistory.push({ action: 'delivered', adminUser, timestamp: now() });
      await tx.save(order);
      return order;
    });
  }

  async function refund(id, { amount, reason, idempotencyKey, adminUser }) {

    if (!Number.isSafeInteger(amount) || amount <= 0) throw problem(400, 'Invalid refund amount in paise.');
    if (!idempotencyKey || typeof idempotencyKey !== 'string' || idempotencyKey.trim() === '') throw problem(400, 'Idempotency key is required.');
    if (!reason) throw problem(400, 'Refund reason is required.');
    
    let preflight = await repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      if (!['paid', 'review_required', 'partially_refunded'].includes(order.paymentStatus)) {
        throw problem(409, 'Cannot refund this order state.');
      }
      
      let existingRefund = order.refunds.find(r => r.idempotencyKey === idempotencyKey);
      if (existingRefund) {
        if (existingRefund.amount !== amount) throw problem(400, 'Idempotency key reused with different amount.');
        if (existingRefund.status === 'processed') return { order, idempotent: true };
        if (existingRefund.status === 'pending') {
          throw problem(409, 'Refund is currently pending provider confirmation. Please reconcile the payment.');
        }
        if (existingRefund.status === 'failed') {
          const allocated = order.refunds.filter(r => r.status === 'processed' || r.status === 'pending').reduce((s, r) => s + r.amount, 0);
          if (allocated + amount > order.total) throw problem(400, 'Refund amount exceeds order total.');
          existingRefund.status = 'pending';
          existingRefund.createdAt = now();
        }
      } else {
        const allocated = order.refunds.filter(r => r.status === 'processed' || r.status === 'pending').reduce((s, r) => s + r.amount, 0);
        if (allocated + amount > order.total) throw problem(400, 'Refund amount exceeds order total.');

        order.refunds.push({
          amount, reason, status: 'pending', idempotencyKey, adminUser, createdAt: now()
        });
      }
      
      await tx.save(order);
      return { order, idempotent: false };
    });

    if (preflight.idempotent) return preflight.order;

    let providerRefundId;
    let refundStatus = 'failed';
    try {
      const refundResponse = await gateway.payments.refund(preflight.order.paymentId, { 
        amount, 
        notes: { reason, orderId: preflight.order._id.toString(), idempotencyKey } 
      });
      providerRefundId = refundResponse.id;
      refundStatus = refundResponse.status === 'processed' ? 'processed' : (refundResponse.status || 'pending');
    } catch (err) {
      throw problem(503, 'Gateway refund failed or timed out: ' + (err.description || err.message || 'Unknown error'));
    }

    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      const refundRecord = order.refunds.find(r => r.idempotencyKey === idempotencyKey);
      if (refundRecord && (refundRecord.status === 'pending' || refundStatus === 'processed')) {
        refundRecord.providerRefundId = providerRefundId;
        refundRecord.status = refundStatus;

        if (refundStatus === 'processed') {
          const totalRefunded = order.refunds.filter(r => r.status === 'processed').reduce((s, r) => s + r.amount, 0);
          if (totalRefunded >= order.total) order.paymentStatus = 'refunded';
          else order.paymentStatus = 'partially_refunded';
          order.activityHistory.push({ action: `refunded_${amount}`, adminUser, timestamp: now() });
        }
        await tx.save(order);
        if (refundStatus === 'processed') {
          if (tx.notify) await tx.notify('refund', order, { amount, reason });
        }
      }
      return order;
    });
  }

  async function reconcilePayment(id, adminUser) {
    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      if (!order.paymentIntentId) throw problem(400, 'No payment intent to reconcile.');
      
      const response = await gateway.orders.fetchPayments(order.paymentIntentId);
      const payment = response.items?.find(p => p.status === 'captured');
      let changed = false;
      
      if (payment) {
        if (payment.currency !== 'INR' || payment.amount !== order.total) {
          throw problem(409, 'Payment amount or currency does not match the order.');
        }
        
        if (order.paymentId !== payment.id) {
          order.paymentId = payment.id;
          order.paidAt = now();
          changed = true;

          if (order.stockReleased || order.paymentStatus === 'cancelled') {
             order.paymentStatus = 'review_required';
             order.activityHistory.push({ action: 'reconciled_captured_late', adminUser, timestamp: now() });
          } else {
             order.paymentStatus = 'paid';
             order.activityHistory.push({ action: 'reconciled_captured', adminUser, timestamp: now() });
          }
        }
      } else {
        if (!order.activityHistory.some(a => a.action === 'reconciled_no_capture')) {
          order.activityHistory.push({ action: 'reconciled_no_capture', adminUser, timestamp: now() });
          changed = true;
        }
      }

      if (order.paymentId && order.refunds.some(r => r.status === 'pending')) {
        try {
          let providerRefunds = [];
          let skip = 0;
          while (true) {
            const refundRes = await gateway.payments.fetchRefunds(order.paymentId, { skip, count: 100 });
            const items = Array.isArray(refundRes.items) ? refundRes.items : (Array.isArray(refundRes) ? refundRes : []);
            providerRefunds.push(...items);
            if (items.length < 100 || !refundRes.has_more) break;
            skip += 100;
          }
          
          for (const r of order.refunds) {
            if (r.status === 'pending') {
              const match = providerRefunds.find(pr => pr.notes && pr.notes.idempotencyKey === r.idempotencyKey);
              if (match) {
                if (match.id) r.providerRefundId = match.id;
                r.status = match.status === 'processed' ? 'processed' : (match.status === 'failed' ? 'failed' : 'pending');
                changed = true;
              }
            }
          }
        } catch (err) {
          // ignore provider fetch errors
        }
      }

      if (changed) {
        const totalRefunded = order.refunds.filter(r => r.status === 'processed').reduce((s, r) => s + r.amount, 0);
        if (totalRefunded > 0) {
          if (totalRefunded >= order.total) order.paymentStatus = 'refunded';
          else order.paymentStatus = 'partially_refunded';
        }
        await tx.save(order);
      }
      
      return order;
    });
  }

  async function requestReturn(id, { slug, size, qty, reason, exchangeForSize, adminUser }) {
    // FIX 6: Validate positive integer
    if (typeof qty !== 'number' || qty <= 0 || !Number.isSafeInteger(qty)) throw problem(400, 'Invalid return quantity.');
    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      if (order.fulfilmentStatus !== 'shipped' && order.fulfilmentStatus !== 'delivered' && order.fulfilmentStatus !== 'legacy_fulfilled') {
        throw problem(409, 'Only shipped or delivered orders can be returned.');
      }
      
      const line = order.lines.find(l => l.slug === slug && l.size === size);
      if (!line) throw problem(404, 'Item not found in order.');
      
      const existingReturnedQty = order.returns
        .filter(r => r.slug === slug && r.size === size && r.status !== 'rejected')
        .reduce((sum, r) => sum + r.qty, 0);

      if (existingReturnedQty + qty > line.qty) throw problem(400, 'Return quantity exceeds purchased quantity.');
      
      if (exchangeForSize) {
        if (!sizes.includes(exchangeForSize)) throw problem(400, 'Invalid exchange size.');
        await tx.reserve({ slug, size: exchangeForSize, qty });
      }

      order.returns.push({
        slug,
        size,
        qty,
        reason,
        status: 'requested',
        exchangeForSize,
        createdAt: now()
      });

      order.activityHistory.push({ action: `return_requested_${slug}`, adminUser, timestamp: now() });
      await tx.save(order);
      return order;
    });
  }

  async function processReturn(id, { returnId, status, adminNotes, adminUser }) {
    if (!['approved', 'inspected', 'rejected', 'restocked'].includes(status)) throw problem(400, 'Invalid return status.');
    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      
      const ret = order.returns.id ? order.returns.id(returnId) : order.returns.find(r => r._id.toString() === returnId);
      if (!ret) throw problem(404, 'Return record not found.');
      if (ret.status === 'restocked' || ret.status === 'rejected') throw problem(409, 'Return is already finalized.');

      // State machine constraints
      if (status === 'approved' && ret.status !== 'requested') throw problem(409, 'Can only approve requested returns.');
      if (status === 'inspected' && ret.status !== 'approved') throw problem(409, 'Can only inspect approved returns.');
      if (status === 'restocked' && ret.status !== 'inspected') throw problem(409, 'Can only restock inspected returns.');
      if (status === 'rejected' && ret.status === 'restocked') throw problem(409, 'Cannot reject a restocked item.');

      ret.status = status;
      if (adminNotes) ret.adminNotes = adminNotes;
      
      if (status === 'restocked') {
        await tx.release({ slug: ret.slug, size: ret.size, qty: ret.qty });
      } else if (status === 'rejected' && ret.exchangeForSize) {
        await tx.release({ slug: ret.slug, size: ret.exchangeForSize, qty: ret.qty });
      }

      order.activityHistory.push({ action: `return_${status}`, adminUser, timestamp: now() });
      await tx.save(order);
      return order;
    });
  }

  async function reconcileExpired() {
    for(const order of await repository.expired()){
      if(order.paymentIntentId){
        const response=await gateway.orders.fetchPayments(order.paymentIntentId);
        const payment=response.items?.find(p=>p.status==='captured');
        if(payment){await captured(payment);continue;}
        if(response.items?.some(p=>p.status==='authorized'))continue;
      }
      await cancel({orderRef:order.orderRef},{expired:true});
    }
  }
  return {create,captured,cancel,adminUpdate,ship,deliver,refund,reconcilePayment,requestReturn,processReturn,reconcileExpired};
}
