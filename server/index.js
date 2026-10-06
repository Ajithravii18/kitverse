import {processNotifications, notificationTransport} from './notification-service.js';
import mongoose from 'mongoose';
import {createApp} from './app.js';
import {Order} from './models.js';
const uri=process.env.MONGODB_URI;
if(uri){try{await mongoose.connect(uri,{serverSelectionTimeoutMS:8000});console.log('MongoDB connected');}catch{console.error('MongoDB connection failed. Check MONGODB_URI and database access.');process.exit(1)}}
if(uri && process.env.RAZORPAY_KEY_ID){
  const topology=await mongoose.connection.db.admin().command({hello:1});
  
  await Order.init();
}
if(process.env.NODE_ENV==='production') notificationTransport();
const app=createApp({hasDatabase:Boolean(uri),databaseReady:()=>mongoose.connection.readyState===1});
let reconciling=false;
const timer=app.locals.paymentsReady ? setInterval(async()=>{
  if(reconciling)return;
  reconciling=true;
  try{await app.locals.orderService.reconcileExpired();}
  catch(error){console.error('Order reconciliation failed:',error.message);}
  finally{reconciling=false;}
},60000) : null;
timer?.unref();
let notifying=false;
const runNotifications=async()=>{
  if(notifying || !uri || mongoose.connection.readyState!==1 || !process.env.SMTP_HOST || !process.env.SMTP_FROM)return;
  notifying=true;
  try{await processNotifications();}catch(error){console.error('Notification delivery failed:',error.message);}
  finally{notifying=false;}
};
const notificationTimer=setInterval(runNotifications,15000);
notificationTimer.unref();
void runNotifications();

const host=process.env.HOST||'127.0.0.1';
const server=app.listen(Number(process.env.PORT)||4000,host,()=>console.log(`Kitverse API: http://${host}:${Number(process.env.PORT)||4000} (${uri?'MongoDB':'sample catalogue'})`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{clearInterval(timer);clearInterval(notificationTimer);server.close(async()=>{await mongoose.disconnect();process.exit(0)});});
