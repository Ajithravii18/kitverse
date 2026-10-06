const fs = require('fs');
let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/order-service.js', 'utf8');

// Inject the import at the top
if (!content.includes('sendNotification')) {
  content = content.replace("import {randomUUID,createHash,createHmac,timingSafeEqual} from 'node:crypto';", "import {randomUUID,createHash,createHmac,timingSafeEqual} from 'node:crypto';\nimport { sendNotification } from './notification-service.js';");
}

// Order confirmation (in 'captured')
content = content.replace(/order\.paymentStatus='paid';await tx\.save\(order\);/, "order.paymentStatus='paid';await tx.save(order);\n        // Background notification\n        Promise.resolve(sendNotification('order_confirmation', order)).catch(console.error);");

// Shipment (in 'ship')
content = content.replace(/order\.fulfilmentStatus='shipped';await tx\.save\(order\);/, "order.fulfilmentStatus='shipped';await tx.save(order);\n        Promise.resolve(sendNotification('shipment', order, { courier, trackingNumber })).catch(console.error);");

// Cancellation (in 'cancel')
content = content.replace(/order\.paymentStatus='cancelled';order\.fulfilmentStatus='failed';/, "order.paymentStatus='cancelled';order.fulfilmentStatus='failed';\n        Promise.resolve(sendNotification('cancellation', order)).catch(console.error);");

// Refund (in 'finalizeRefund' - which doesn't exist, we just have 'refund' and 'reconcilePayment'. Let's hook into 'refund')
content = content.replace(/refundRecord\.status='processed';\s*await tx\.save\(order\);/g, "refundRecord.status='processed';\n          await tx.save(order);\n          Promise.resolve(sendNotification('refund', order, { amount: refundRecord.amount, reason: refundRecord.reason })).catch(console.error);");
// also inside reconcilePayment success:
content = content.replace(/refundRecord\.status='processed';await tx\.save\(order\);/g, "refundRecord.status='processed';await tx.save(order);\n          Promise.resolve(sendNotification('refund', order, { amount: refundRecord.amount, reason: refundRecord.reason })).catch(console.error);");


fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/order-service.js', content);
