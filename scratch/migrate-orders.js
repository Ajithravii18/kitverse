import mongoose from 'mongoose';
import { Order } from '../server/models.js';

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kitverse');
  
  const orders = await Order.find({ status: { $exists: true } });
  let count = 0;
  for (const order of orders) {
    const oldStatus = order.get('status');
    let pStatus = 'pending';
    let fStatus = 'unfulfilled';

    if (oldStatus === 'pending_payment') { pStatus = 'pending'; fStatus = 'unfulfilled'; }
    if (oldStatus === 'paid') { pStatus = 'paid'; fStatus = 'unfulfilled'; }
    if (oldStatus === 'fulfilled') { pStatus = 'paid'; fStatus = 'legacy_fulfilled'; }
    if (oldStatus === 'cancelled') { pStatus = 'cancelled'; fStatus = 'unfulfilled'; }
    if (oldStatus === 'payment_review') { pStatus = 'review_required'; fStatus = 'unfulfilled'; }

    order.paymentStatus = pStatus;
    order.fulfilmentStatus = fStatus;
    order.set('status', undefined); // remove old status
    await order.save({ strict: false });
    count++;
  }
  console.log(`Migrated ${count} orders.`);
  mongoose.disconnect();
}
migrate().catch(console.error);
