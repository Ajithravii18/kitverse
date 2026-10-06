import express from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { Order, User } from '../models.js';
import { problem } from '../order-service.js';
import { checkDb } from '../middleware/db.js';
import { requireAdmin, requireFinance, requireCustomer } from '../middleware/auth.js';
import { isValidRazorpaySignature } from '../utils/razorpay.js';

const router = express.Router();

router.get('/customer/orders', async (req, res, next) => {
  if (!req.session.userId || req.session.role !== 'customer') {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const orders = await Order.find({ userId: req.session.userId, paymentStatus: { $nin: ['pending', 'cancelled'] } }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) { next(err); }
});

router.get('/tracking/:orderRef', checkDb, async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderRef: req.params.orderRef.toUpperCase() });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    
    res.json({
      orderRef: order.orderRef,
      paymentStatus: order.paymentStatus, fulfilmentStatus: order.fulfilmentStatus,
      trackingDetails: order.trackingDetails,
      createdAt: order.createdAt,
      total: order.total
    });
  } catch (err) { next(err); }
});

router.get('/admin/orders', requireAdmin, async (req, res, next) => {
  try {
    const allOrders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json({ orders: allOrders });
  } catch (error) { next(error); }
});

router.post('/admin/orders/:id/ship', requireAdmin, async (req, res, next) => {
  try {
    const order = await req.app.locals.orderService.ship(req.params.id, { ...req.body, adminUser: req.session.userId });
    res.json({ success: true, order });
  } catch (error) { next(error); }
});

router.post('/admin/orders/:id/deliver', requireAdmin, async (req, res, next) => {
  try {
    const order = await req.app.locals.orderService.deliver(req.params.id, { adminUser: req.session.userId });
    res.json({ success: true, order });
  } catch (error) { next(error); }
});

router.post('/admin/orders/:id/refund', requireFinance, async (req, res, next) => {
  try {
    const order = await req.app.locals.orderService.refund(req.params.id, { ...req.body, adminUser: req.session.userId });
    res.json({ success: true, order });
  } catch (error) { next(error); }
});

router.post('/admin/orders/:id/reconcile', requireFinance, async (req, res, next) => {
  try {
    const order = await req.app.locals.orderService.reconcilePayment(req.params.id, req.session.userId);
    res.json({ success: true, order });
  } catch (error) { next(error); }
});

router.post('/admin/orders/:id/return', requireAdmin, async (req, res, next) => {
  try {
    const order = await req.app.locals.orderService.requestReturn(req.params.id, { ...req.body, adminUser: req.session.userId });
    res.json({ success: true, order });
  } catch (error) { next(error); }
});

router.put('/admin/orders/:id/return/:returnId', requireAdmin, async (req, res, next) => {
  try {
    const order = await req.app.locals.orderService.processReturn(req.params.id, { returnId: req.params.returnId, ...req.body, adminUser: req.session.userId });
    res.json({ success: true, order });
  } catch (error) { next(error); }
});

router.put('/admin/orders/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const order = await req.app.locals.orderService.adminUpdate(req.params.id, { ...req.body, adminUser: req.session.userId });
    res.json({ success: true, order });
  } catch (error) { next(error); }
});

router.post('/orders', checkDb, requireCustomer, async (req, res, next) => {
  try {
    if(!req.app.locals.paymentsReady) throw problem(503, 'Secure checkout is unavailable.');
    const order = await req.app.locals.orderService.create({...req.body, userId: req.session.userId, checkoutKey: req.get('Idempotency-Key')});
    res.json({success: true, orderRef: order.orderRef, paymentIntentId: order.paymentIntentId, razorpayKeyId: process.env.RAZORPAY_KEY_ID, total: order.total});
  } catch(error) { next(error); }
});

router.get('/orders/:orderRef', checkDb, requireCustomer, async (req, res, next) => {
  try {
    const order = await Order.findOne({orderRef: req.params.orderRef, userId: req.session.userId});
    if(!order) throw problem(404, 'Order not found.');
    res.json({orderRef: order.orderRef, paymentStatus: order.paymentStatus, fulfilmentStatus: order.fulfilmentStatus, total: order.total, paymentIntentId: order.paymentIntentId, paymentId: order.paymentId, razorpayKeyId: process.env.RAZORPAY_KEY_ID});
  } catch(error) { next(error); }
});

router.post('/orders/:orderRef/cancel', checkDb, requireCustomer, async (req, res, next) => {
  try { await req.app.locals.orderService.cancel({orderRef: req.params.orderRef, userId: req.session.userId}); res.json({success: true}); } catch(error) { next(error); }
});

router.post('/orders/webhook', async (req, res, next) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if(!secret) throw problem(503, 'Webhook not configured.');
    const signature = req.get('x-razorpay-signature');
    if(!req.rawBody || !/^[a-f\d]{64}$/i.test(signature || '')) throw problem(400, 'Invalid signature.');
    const expected = createHmac('sha256', secret).update(req.rawBody).digest();
    if(!timingSafeEqual(expected, Buffer.from(signature, 'hex'))) throw problem(400, 'Invalid signature.');
    if(req.body.event === 'payment.captured') await req.app.locals.orderService.captured(req.body.payload?.payment?.entity);
    res.json({success: true});
  } catch(error) { next(error); }
});

router.post('/orders/verify-payment', checkDb, requireCustomer, async (req, res, next) => {
  try {
    const {orderRef, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature} = req.body || {};
    if(!isValidRazorpaySignature(orderId, paymentId, signature, process.env.RAZORPAY_KEY_SECRET)) throw problem(400, 'Invalid payment signature.');
    const gateway = req.app.locals.paymentClient || (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? new (await import('razorpay')).default({key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET}) : null);
    if(!gateway) throw problem(503, 'Payment confirmation unavailable.');
    const payment = await gateway.payments.fetch(paymentId);
    if(payment.order_id !== orderId) throw problem(400, 'Payment order does not match.');
    const order = await req.app.locals.orderService.captured(payment, req.session.userId);
    if(order.orderRef !== orderRef) throw problem(400, 'Order reference does not match.');
    res.json({success: true, orderRef: order.orderRef, paymentStatus: order.paymentStatus, fulfilmentStatus: order.fulfilmentStatus, total: order.total});
  } catch(error) { next(error); }
});

export default router;
