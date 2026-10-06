import { Notification } from './models.js';
import nodemailer from 'nodemailer';
import { randomUUID } from 'node:crypto';

export function notificationTransport(env = process.env) {
  if (!env.SMTP_HOST || !env.SMTP_FROM || /\.invalid[>\s]*$/.test(env.SMTP_FROM)) {
    throw new Error('Configure SMTP_HOST and a verified SMTP_FROM for notifications.');
  }
  return nodemailer.createTransport({host:env.SMTP_HOST, port:Number(env.SMTP_PORT || 587),
    secure:Number(env.SMTP_PORT || 587) === 465,
    auth:env.SMTP_USER ? {user:env.SMTP_USER, pass:env.SMTP_PASS} : undefined,
    connectionTimeout:15000, greetingTimeout:15000, socketTimeout:60000});
}

export async function processNotifications({transport, from=process.env.SMTP_FROM, now=()=>new Date(), leaseMs=300000} = {}) {
  const sender = transport || notificationTransport();
  if (!from) throw new Error('SMTP_FROM is required.');
  // Reclaim expired leases; a token prevents stale workers from changing a new claim.
  await Notification.updateMany({status:'processing', leaseUntil:{$lte:now()}},
    {$set:{status:'pending'}, $unset:{leaseToken:1,leaseUntil:1}});
  await Notification.updateMany({status:'processing',leaseUntil:{$exists:false},lastAttemptAt:{$lte:new Date(+now()-leaseMs)}},
    {$set:{status:'pending'}, $unset:{leaseToken:1}});
  for (let i=0; i<50; i++) {
    const token=randomUUID();
    const notif=await Notification.findOneAndUpdate({status:{$in:['pending','failed']},attempts:{$lt:3},
      $or:[{nextAttemptAt:{$exists:false}},{nextAttemptAt:{$lte:now()}}]},
      {$set:{status:'processing',lastAttemptAt:now(),leaseToken:token,leaseUntil:new Date(+now()+leaseMs)},$inc:{attempts:1}}, {new:true});
    if (!notif) break;
    const claim={_id:notif._id,status:'processing',leaseToken:token};
    try {
      await sender.sendMail({from,to:notif.email,subject:notif.subject,text:notif.body,
        messageId:`<${notif._id}@kitverse.notifications>`});
      await Notification.updateOne(claim,{$set:{status:'sent'},$unset:{error:1,leaseToken:1,leaseUntil:1,nextAttemptAt:1}});
    } catch(error) {
      await Notification.updateOne(claim,{$set:{status:'failed',error:error.message,nextAttemptAt:new Date(+now()+60000*notif.attempts)},
        $unset:{leaseToken:1,leaseUntil:1}});
    }
  }
}

export async function sendNotification(type, order, data = {}, session = null) {
  const email=order?.customer?.email;
  if (!email) return;
  let subject = `Update on your order ${order?.orderRef || 'N/A'}`;
  let body = '';

  switch(type) {
    case 'order_confirmation':
      subject = `Order Confirmation - ${order.orderRef}`;
      body = `Thank you for your order! Total: ₹${(order.total / 100).toFixed(2)}`;
      break;
    case 'shipment':
      subject = `Your order has shipped! - ${order.orderRef}`;
      body = `Courier: ${data.courier}, Tracking: ${data.trackingNumber}`;
      break;
    case 'cancellation':
      subject = `Order Cancelled - ${order.orderRef}`;
      body = `Your unpaid order has been cancelled. No refund is required.`;
      break;
    case 'refund':
      subject = `Refund Processed - ${order.orderRef}`;
      body = `We have processed a refund of ₹${(data.amount / 100).toFixed(2)}. Reason: ${data.reason}`;
      break;
  }
  

  const notif=new Notification({type,orderId:order._id,email,subject,body,status:'pending'});
  await notif.save(session ? {session} : {});
}
