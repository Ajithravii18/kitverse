import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import Razorpay from 'razorpay';
import mongoose from 'mongoose';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { createOrderService } from './order-service.js';
import { Product } from './models.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import customerRoutes from './routes/customers.js';
import contentRoutes from './routes/content.js';
import reviewRoutes from './routes/reviews.js';
import discountRoutes from './routes/discounts.js';
import adminRoutes from './routes/admin.js';

export * from './routes/auth.js';
export * from './utils/razorpay.js';

export function createApp({ databaseReady = () => false, hasDatabase = false, readProducts = () => Product.find({}).select('-costPrice').lean(), paymentClient, orderService, sessionStore } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({limit:'100kb', verify(req,res,buffer) {
    if(req.originalUrl.split('?')[0]==='/api/orders/webhook') req.rawBody=buffer;
  }}));
  if(process.env.NODE_ENV==='production' && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length<32)) throw new Error('Set a SESSION_SECRET of at least 32 characters.');
  const gateway=paymentClient || (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET}) : null);
  const orders=orderService || createOrderService({gateway});
  
  app.locals.hasDatabase = hasDatabase;
  app.locals.databaseReady = databaseReady;
  app.locals.readProducts = readProducts;
  app.locals.paymentClient = gateway;
  app.locals.orderService = orders;
  app.locals.paymentsReady = Boolean(gateway && hasDatabase);

  app.set('trust proxy', process.env.TRUST_PROXY_HOPS ? Number(process.env.TRUST_PROXY_HOPS) : false);
  app.use(session({
    store: sessionStore || (hasDatabase && process.env.NODE_ENV !== 'test' ? ((process.env.NODE_ENV === 'test' || !mongoose.connection || !mongoose.connection.getClient()) ? undefined : MongoStore.create({client:mongoose.connection.getClient()})) : undefined),
    secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }
  }));

  app.get('/api/health', (req, res) => res.status(hasDatabase && !databaseReady() ? 503 : 200).json({ status: hasDatabase && !databaseReady() ? 'unavailable' : 'ok', mode: hasDatabase ? 'mongodb' : 'demo' }));

  app.use('/api', authRoutes);
  app.use('/api', productRoutes);
  app.use('/api', orderRoutes);
  app.use('/api', customerRoutes);
  app.use('/api', contentRoutes);
  app.use('/api', reviewRoutes);
  app.use('/api', discountRoutes);
  app.use('/api', adminRoutes);

  app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }));
  app.use(express.static(fileURLToPath(new URL('../client/dist', import.meta.url))));
  app.get('/{*path}', (req, res) => res.sendFile(fileURLToPath(new URL('../client/dist/index.html', import.meta.url))));
  
  app.use((error, req, res, next) => {
    console.error(error.message);
    const status=error.status || (error.name==='ValidationError'?400:500);
    res.status(status).json({error:status<500?error.message:'Unable to complete the request.'});
  });

  return app;
}
