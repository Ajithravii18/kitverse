import express from 'express';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'node:url';
import { Product, User, Order } from './models.js';
import { products, qualities } from '../shared/catalog.js';
import { isListedProduct, publicProduct } from '../shared/product.js';

export function createApp({ databaseReady = () => false, hasDatabase = false, readProducts = () => Product.find({}).lean() } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());

  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-do-not-use-in-prod',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }
  }));

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: { error: 'Too many login attempts. Try again later.' }
  });

  const checkDb = (req, res, next) => {
    if (hasDatabase && !databaseReady()) {
      return res.status(503).json({ error: 'The catalogue is temporarily unavailable. Please try again shortly.' });
    }
    next();
  };

  app.get('/api/health', (req, res) => res.status(hasDatabase && !databaseReady() ? 503 : 200).json({ status: hasDatabase && !databaseReady() ? 'unavailable' : 'ok', mode: hasDatabase ? 'mongodb' : 'demo' }));

  app.get('/api/products', checkDb, async (req, res, next) => {
    try {
      if (req.query.quality && !qualities.includes(req.query.quality)) return res.status(400).json({ error: 'Unknown quality option.' });
      if (req.query.category && !['club', 'national'].includes(req.query.category)) return res.status(400).json({ error: 'Unknown team category.' });
      
      let items = hasDatabase ? await readProducts() : products;
      items = items.filter(isListedProduct);
      
      if (req.query.quality) items = items.filter(p => p.quality === req.query.quality);
      if (req.query.category) items = items.filter(p => p.category === req.query.category);
      
      res.json({ products: items.map(publicProduct), demo: !hasDatabase, checkoutEnabled: hasDatabase });
    } catch (error) { next(error); }
  });

  // Customer Auth
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  app.post('/api/customer/register', loginLimiter, checkDb, async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      if (!email || !username || !password) return res.status(400).json({ error: 'Missing required fields' });
      
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) return res.status(400).json({ error: 'Email or username already in use' });

      const otp = generateOTP();
      const passwordHash = await bcrypt.hash(password, 10);
      
      const user = new User({
        email, username, passwordHash, role: 'customer',
        otp, otpExpires: new Date(Date.now() + 15 * 60000) // 15 mins
      });
      await user.save();

      console.log(`\n=================================================`);
      console.log(`[MOCK EMAIL] OTP for ${email}: ${otp}`);
      console.log(`=================================================\n`);

      res.json({ success: true, message: 'OTP sent to email (check terminal)' });
    } catch (err) { next(err); }
  });

  app.post('/api/customer/verify', checkDb, async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email, role: 'customer' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (user.isVerified) return res.status(400).json({ error: 'Already verified' });
      if (user.otp !== otp || user.otpExpires < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      req.session.userId = user._id;
      req.session.role = 'customer';
      req.session.save(err => {
        if (err) return next(err);
        res.json({ success: true, email: user.email, username: user.username });
      });
    } catch (err) { next(err); }
  });

  app.post('/api/customer/login', loginLimiter, checkDb, async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email, role: 'customer' });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      if (!user.isVerified) {
        return res.status(403).json({ error: 'Account not verified. Please request a new OTP.' });
      }

      req.session.userId = user._id;
      req.session.role = 'customer';
      req.session.save(err => {
        if (err) return next(err);
        res.json({ success: true, email: user.email, username: user.username });
      });
    } catch (err) { next(err); }
  });

  app.post('/api/customer/forgot-password', loginLimiter, checkDb, async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email, role: 'customer' });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 15 * 60000);
      await user.save();

      console.log(`\n=================================================`);
      console.log(`[MOCK EMAIL] Password Reset OTP for ${email}: ${otp}`);
      console.log(`=================================================\n`);

      res.json({ success: true, message: 'Password reset OTP sent to email (check terminal)' });
    } catch (err) { next(err); }
  });

  app.post('/api/customer/reset-password', checkDb, async (req, res, next) => {
    try {
      const { email, otp, newPassword } = req.body;
      const user = await User.findOne({ email, role: 'customer' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (user.otp !== otp || user.otpExpires < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      res.json({ success: true, message: 'Password has been reset' });
    } catch (err) { next(err); }
  });
  app.get('/api/customer/orders', async (req, res, next) => {
    if (!req.session.userId || req.session.role !== 'customer') {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
      const orders = await Order.find({ userId: req.session.userId }).sort({ createdAt: -1 });
      res.json({ orders });
    } catch (err) { next(err); }
  });

  app.get('/api/tracking/:orderRef', checkDb, async (req, res, next) => {
    try {
      const order = await Order.findOne({ orderRef: req.params.orderRef.toUpperCase() });
      if (!order) return res.status(404).json({ error: 'Order not found.' });
      
      res.json({
        orderRef: order.orderRef,
        status: order.status,
        trackingDetails: order.trackingDetails,
        createdAt: order.createdAt,
        total: order.total
      });
    } catch (err) { next(err); }
  });

  app.get('/api/customer/me', async (req, res, next) => {
    if (req.session.userId && req.session.role === 'customer') {
      try {
        const user = await User.findById(req.session.userId);
        const pastOrders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
        const addresses = [];
        const seen = new Set();
        for (const order of pastOrders) {
          if (!order.customer) continue;
          const c = order.customer;
          const hash = `${c.firstName}|${c.lastName}|${c.streetAddress}|${c.city}|${c.state}|${c.postcode}`.toLowerCase();
          if (!seen.has(hash)) {
            seen.add(hash);
            addresses.push(c);
          }
        }
        res.json({ authenticated: true, email: user.email, username: user.username, savedAddresses: addresses });
      } catch (err) { next(err); }
    } else {
      res.status(401).json({ authenticated: false });
    }
  });

  app.put('/api/customer/profile', async (req, res, next) => {
    if (!req.session.userId || req.session.role !== 'customer') {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
      const { username, email, currentPassword, newPassword } = req.body;
      const user = await User.findById(req.session.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Update email/username
      if (email) user.email = email;
      if (username) user.username = username;

      // Update password if provided
      if (currentPassword && newPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });
        user.passwordHash = await bcrypt.hash(newPassword, 10);
      }

      await user.save();
      res.json({ success: true, email: user.email, username: user.username });
    } catch (err) { 
      if (err.code === 11000) return res.status(400).json({ error: 'Email or username already exists' });
      next(err); 
    }
  });

  app.post('/api/customer/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
  });

  // Admin Auth
  app.post('/api/admin/login', loginLimiter, checkDb, async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user && await bcrypt.compare(password, user.passwordHash)) {
        req.session.userId = user._id;
        req.session.role = user.role;
        req.session.save((err) => {
          if (err) return next(err);
          res.json({ success: true, email: user.email });
        });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) { next(error); }
  });

  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
  });

  app.get('/api/admin/me', (req, res) => {
    if (req.session.userId && req.session.role === 'admin') {
      res.json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });

  const requireAdmin = (req, res, next) => {
    if (req.session.userId && req.session.role === 'admin') next();
    else res.status(403).json({ error: 'Forbidden' });
  };

  // Protected Admin Routes
  app.get('/api/admin/products', requireAdmin, async (req, res, next) => {
    try {
      const allProducts = await Product.find().lean();
      res.json({ products: allProducts });
    } catch (error) { next(error); }
  });

  app.post('/api/admin/products', requireAdmin, async (req, res, next) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.json({ success: true, product: newProduct });
    } catch (error) { next(error); }
  });

  app.put('/api/admin/products/:slug', requireAdmin, async (req, res, next) => {
    try {
      const updated = await Product.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Product not found' });
      res.json({ success: true, product: updated });
    } catch (error) { next(error); }
  });

  app.get('/api/admin/orders', requireAdmin, async (req, res, next) => {
    try {
      const allOrders = await Order.find().sort({ createdAt: -1 }).lean();
      res.json({ orders: allOrders });
    } catch (error) { next(error); }
  });

  app.put('/api/admin/orders/:id/status', requireAdmin, async (req, res, next) => {
    try {
      const { status } = req.body;
      if (!['pending_payment', 'paid', 'fulfilled', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!updated) return res.status(404).json({ error: 'Order not found' });
      res.json({ success: true, order: updated });
    } catch (error) { next(error); }
  });

  // Order Management
  let razorpay = null;
  if (process.env.RAZORPAY_KEY_ID) {
    import('razorpay').then(Rzp => {
      razorpay = new Rzp.default({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }).catch(console.error);
  }

  const requireCustomer = (req, res, next) => {
    if (req.session.userId) next(); // Allow both 'admin' and 'customer' roles if needed, or strictly check role
    else res.status(401).json({ error: 'Authentication required to checkout' });
  };

  app.post('/api/orders', checkDb, requireCustomer, async (req, res, next) => {
    try {
      const { customer, items } = req.body;
      if (!customer || !items || !items.length) return res.status(400).json({ error: 'Invalid order data' });

      const processOrder = async (useTransaction) => {
        let session = null;
        if (useTransaction) {
          session = await mongoose.startSession();
          session.startTransaction();
        }

        try {
          let total = 0;
          const lines = [];

          for (const item of items) {
            const product = session ? await Product.findOne({ slug: item.slug }).session(session) : await Product.findOne({ slug: item.slug });
            if (!product) throw new Error(`Product ${item.name} not found`);
            if (!product.stock || (product.stock[item.size] || 0) < item.qty) {
              throw new Error(`Insufficient stock for ${item.name} (Size: ${item.size})`);
            }

            product.stock[item.size] -= item.qty;
            await product.save(session ? { session } : undefined);

            const linePrice = product.price; 
            total += linePrice * item.qty;
            lines.push({
              slug: product.slug, name: product.name, productType: product.productType || 'jersey', 
              quality: product.quality || '', size: item.size,
              price: linePrice, qty: item.qty
            });
          }

          const orderRef = 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
          let paymentIntentId = '';
          
          if (razorpay) {
            const rzpOrder = await razorpay.orders.create({
              amount: total, 
              currency: 'INR',
              receipt: orderRef
            });
            paymentIntentId = rzpOrder.id;
          }

          const order = new Order({
            orderRef, customer, lines, total, status: 'pending_payment', paymentIntentId,
            userId: req.session.userId
          });

          await order.save(session ? { session } : undefined);
          if (session) await session.commitTransaction();

          return { success: true, orderRef, paymentIntentId, razorpayKeyId: process.env.RAZORPAY_KEY_ID };
        } catch (err) {
          if (session) await session.abortTransaction();
          throw err;
        } finally {
          if (session) session.endSession();
        }
      };

      try {
        // Try atomic transaction first
        const result = await processOrder(true);
        res.json(result);
      } catch (err) {
        if (err.message && (err.message.includes('replica set') || err.message.includes('Transaction numbers'))) {
          console.warn('Transactions not supported. Retrying non-atomically.');
          const fallbackResult = await processOrder(false);
          res.json(fallbackResult);
        } else {
          throw err;
        }
      }
    } catch (error) { next(error); }
  });

  app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }));
  app.use(express.static(fileURLToPath(new URL('../client/dist', import.meta.url))));
  app.get('/{*path}', (req, res) => res.sendFile(fileURLToPath(new URL('../client/dist/index.html', import.meta.url))));
  
  app.use((error, req, res, next) => {
    console.error(error.message);
    res.status(500).json({ error: 'Unable to complete the request.' });
  });
  
  return app;
}



