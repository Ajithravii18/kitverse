import nodemailer from 'nodemailer';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { fileURLToPath } from 'node:url';
import { Product, User, Order } from './models.js';
import { products, qualities } from '../shared/catalog.js';
import { isListedProduct, publicProduct, productTypes, styleTagsList } from '../shared/product.js';

export function createApp({ databaseReady = () => false, hasDatabase = false, readProducts = () => Product.find({}).lean() } = {}) {
  const app = express();
  app.disable('x-powered-by');
  
  // CSRF token generation (simple custom CSRF)
  const generateCsrf = () => crypto.randomBytes(32).toString('hex');
  
  
  app.use('/api/webhooks/razorpay', express.raw({ type: 'application/json' }));
  app.use(express.json());


  if (process.env.NODE_ENV === 'production' && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === 'fallback-secret-do-not-use-in-prod')) {
    throw new Error('SESSION_SECRET is missing or unsafe in production');
  }

  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-do-not-use-in-prod',
    resave: false,
    saveUninitialized: false,
    store: (hasDatabase && mongoose.connection.readyState === 1 && mongoose.connection.client) ? MongoStore.create({ client: mongoose.connection.getClient(), collectionName: 'sessions' }) : undefined,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  }));

  const csrfProtection = (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    const token = req.headers['x-csrf-token'];
    if (!token || token !== req.session.csrfToken) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    next();
  };

  app.get('/api/csrf-token', (req, res) => {
    if (!req.session.csrfToken) {
      req.session.csrfToken = generateCsrf();
    }
    res.json({ csrfToken: req.session.csrfToken });
  });

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // reasonable limit, not 1000
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
      let items = hasDatabase ? await readProducts() : products;
      items = items.filter(isListedProduct);
      
      const { category, quality, productType, styleTags, query, sort, minPrice, maxPrice, size } = req.query;
      
      if (category && !['club', 'national'].includes(category)) return res.status(400).json({ error: 'Unknown team category.' });
      if (quality && !qualities.includes(quality)) return res.status(400).json({ error: 'Unknown quality option.' });
      if (productType && !productTypes.includes(productType)) return res.status(400).json({ error: 'Unknown product type.' });
      const requestedTags = styleTags ? styleTags.split(',').filter(Boolean) : [];
      if (requestedTags.some(tag => !styleTagsList.includes(tag))) return res.status(400).json({ error: 'Unknown style tag.' });
      const parsedMinPrice = minPrice === undefined ? null : Number(minPrice);
      const parsedMaxPrice = maxPrice === undefined ? null : Number(maxPrice);
      if (parsedMinPrice !== null && (!Number.isSafeInteger(parsedMinPrice) || parsedMinPrice < 0)) return res.status(400).json({ error: 'Invalid minimum price.' });
      if (parsedMaxPrice !== null && (!Number.isSafeInteger(parsedMaxPrice) || parsedMaxPrice < 0)) return res.status(400).json({ error: 'Invalid maximum price.' });
      if (parsedMinPrice !== null && parsedMaxPrice !== null && parsedMinPrice > parsedMaxPrice) return res.status(400).json({ error: 'Invalid price range.' });
      
      if (category) items = items.filter(p => p.category === category);
      if (quality) items = items.filter(p => p.quality === quality);
      if (productType) items = items.filter(p => p.productType === productType);
      if (styleTags) {
        items = items.filter(p => requestedTags.every(t => p.styleTags?.includes(t)));
      }
      if (query) {
        const q = query.toLowerCase();
        items = items.filter(p => p.name.toLowerCase().includes(q) || (p.team && p.team.toLowerCase().includes(q)));
      }
      if (parsedMinPrice !== null) items = items.filter(p => p.price >= parsedMinPrice);
      if (parsedMaxPrice !== null) items = items.filter(p => p.price <= parsedMaxPrice);
      if (size) items = items.filter(p => (p.stock && p.stock[size] > 0));

      if (sort === 'low') items.sort((a, b) => a.price - b.price || a.slug.localeCompare(b.slug));
      else if (sort === 'high') items.sort((a, b) => b.price - a.price || a.slug.localeCompare(b.slug));
      else if (sort === 'az') items.sort((a, b) => a.name.localeCompare(b.name) || a.slug.localeCompare(b.slug));
      else {
        // default featured
        items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.slug.localeCompare(b.slug));
      }

      const total = items.length;
      let page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 24);
      if (!Number.isSafeInteger(page) || page < 1) return res.status(400).json({ error: 'Invalid page.' });
      if (!Number.isSafeInteger(limit) || limit < 1 || limit > 48) return res.status(400).json({ error: 'Invalid page size.' });
      const totalPages = Math.ceil(total / limit) || 1;
      
      if (page > totalPages) page = totalPages;
      
      items = items.slice((page - 1) * limit, page * limit);
      
      res.json({ products: items.map(publicProduct), total, page, totalPages, demo: !hasDatabase, checkoutEnabled: hasDatabase });
    } catch (error) { next(error); }
  });

  app.post('/api/bag/reconcile', checkDb, async (req, res, next) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) return res.json({ cart: [] });

      const cart = [];
      for (const item of items) {
        if (!item.slug || !item.size || !item.qty) continue;
        const p = await Product.findOne({ slug: item.slug }).lean();
        if (p && p.published) {
          const maxQty = p.stock?.[item.size] || 0;
          cart.push({
            key: `${p.slug}:${item.size}`,
            slug: p.slug,
            name: p.name,
            quality: p.quality || 'N/A',
            price: p.price,
            image: p.image || '/images/jersey-placeholder.svg',
            size: item.size,
            qty: Math.min(item.qty, maxQty),
            maxQty
          });
        }
      }
      res.json({ cart: cart.filter(i => i.qty > 0) });
    } catch (err) { next(err); }
  });

  // Customer Auth
  

const emailAdapter = {
  async sendEmail(to, subject, text) {
    if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
      console.log(`\n=================================================`);
      console.log(`[MOCK EMAIL to ${to}] ${subject}\n${text}`);
      console.log(`=================================================\n`);
    } else {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      await transporter.sendMail({ from: process.env.SMTP_FROM || 'no-reply@kitverse.local', to, subject, text });
    }
  }
};

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  app.post('/api/customer/register', csrfProtection, loginLimiter, checkDb, async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      if (!email || !username || !password) return res.status(400).json({ error: 'Missing required fields' });
      if (password.length < 12 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(password)) {
        return res.status(400).json({ error: 'Password must be at least 12 characters and contain uppercase, lowercase, number, and special character' });
      }
      
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) return res.status(400).json({ error: 'Email or username already in use' });

      const otp = generateOTP();
      const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
      const passwordHash = await bcrypt.hash(password, 10);
      
      const user = new User({
        email, username, passwordHash, role: 'customer',
        otpHash, otpExpires: new Date(Date.now() + 15 * 60000) // 15 mins
      });
      await user.save();

      await emailAdapter.sendEmail(email, 'Your KITVERSE Verification Code', `Your verification code is: ${otp}`);

      res.json({ success: true, message: 'OTP sent to email (check terminal)' });
    } catch (err) { next(err); }
  });

  app.post('/api/customer/verify', csrfProtection, loginLimiter, checkDb, async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      if (!otp) return res.status(400).json({ error: 'OTP is required' });
      
      const user = await User.findOne({ email, role: 'customer' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (user.isVerified) return res.status(400).json({ error: 'Already verified' });
      
      const hashedOtp = crypto.createHash('sha256').update(otp.toString()).digest('hex');
      if (!user.otpHash || user.otpHash !== hashedOtp || !user.otpExpires || user.otpExpires < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      user.isVerified = true;
      user.otpHash = undefined;
      user.otpExpires = undefined;
      await user.save();

      req.session.regenerate(err => {
        if (err) return next(err);
        req.session.userId = user._id;
        req.session.role = 'customer';
        req.session.csrfToken = generateCsrf(); // Ensure token is ready
        req.session.save(err => {
          if (err) return next(err);
          res.json({ success: true, email: user.email, username: user.username, csrfToken: req.session.csrfToken });
        });
      });
    } catch (err) { next(err); }
  });

  app.post('/api/customer/login', csrfProtection, loginLimiter, checkDb, async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email, role: 'customer' });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      if (!user.isVerified) {
        return res.status(403).json({ error: 'Account not verified. Please request a new OTP.' });
      }

      req.session.regenerate(err => {
        if (err) return next(err);
        req.session.userId = user._id;
        req.session.role = 'customer';
        req.session.csrfToken = generateCsrf();
        req.session.save(err => {
          if (err) return next(err);
          res.json({ success: true, email: user.email, username: user.username, csrfToken: req.session.csrfToken });
        });
      });
    } catch (err) { next(err); }
  });

  app.post('/api/customer/forgot-password', csrfProtection, loginLimiter, checkDb, async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email, role: 'customer' });
      // Don't leak if email exists
      if (!user) {
        return res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
      }

      const otp = generateOTP();
      const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
      user.otpHash = otpHash;
      user.otpExpires = new Date(Date.now() + 15 * 60000);
      await user.save();

      await emailAdapter.sendEmail(email, 'Your KITVERSE Password Reset Code', `Your password reset code is: ${otp}`);

      res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
    } catch (err) { next(err); }
  });

  app.post('/api/customer/reset-password', csrfProtection, loginLimiter, checkDb, async (req, res, next) => {
    try {
      const { email, otp, newPassword } = req.body;
      if (!otp) return res.status(400).json({ error: 'OTP is required' });
      if (!newPassword || newPassword.length < 12 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(newPassword)) {
        return res.status(400).json({ error: 'Password must be at least 12 characters and contain uppercase, lowercase, number, and special character' });
      }

      const user = await User.findOne({ email, role: 'customer' });
      if (!user) return res.status(400).json({ error: 'Invalid request' });
      
      const hashedOtp = crypto.createHash('sha256').update(otp.toString()).digest('hex');
      if (!user.otpHash || user.otpHash !== hashedOtp || !user.otpExpires || user.otpExpires < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      user.otpHash = undefined;
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

  app.put('/api/customer/profile', csrfProtection, async (req, res, next) => {
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

  app.post('/api/customer/logout', csrfProtection, (req, res) => {
    req.session.destroy();
    res.json({ success: true });
  });

  // Admin Auth
  app.post('/api/admin/login', csrfProtection, loginLimiter, checkDb, async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email, role: 'admin' });
      if (user && await bcrypt.compare(password, user.passwordHash)) {
        req.session.regenerate(err => {
          if (err) return next(err);
          req.session.userId = user._id;
          req.session.role = user.role;
          req.session.csrfToken = generateCsrf();
          req.session.save((err) => {
            if (err) return next(err);
            res.json({ success: true, email: user.email, csrfToken: req.session.csrfToken });
          });
        });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) { next(error); }
  });

  app.post('/api/admin/logout', csrfProtection, (req, res) => {
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

  app.post('/api/admin/products', csrfProtection, requireAdmin, async (req, res, next) => {
    try {
      // Allowlist fields
      const { slug, name, team, category, tag, image, images, quality, productType, styleTags, price, stock, season, published, featured, description, specifications } = req.body;
      const newProduct = new Product({ slug, name, team, category, tag, image, images, quality, productType, styleTags, price, stock, season, published, featured, description, specifications });
      await newProduct.save();
      res.json({ success: true, product: newProduct });
    } catch (error) { 
      res.status(400).json({ error: error.message }); 
    }
  });

  app.put('/api/admin/products/:slug', csrfProtection, requireAdmin, async (req, res, next) => {
    try {
      const { slug, name, team, category, tag, image, images, quality, productType, styleTags, price, stock, season, published, featured, description, specifications } = req.body;
      const updated = await Product.findOneAndUpdate(
        { slug: req.params.slug },
        { slug, name, team, category, tag, image, images, quality, productType, styleTags, price, stock, season, published, featured, description, specifications },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: 'Product not found' });
      res.json({ success: true, product: updated });
    } catch (error) { 
      res.status(400).json({ error: error.message }); 
    }
  });

  app.get('/api/admin/orders', requireAdmin, async (req, res, next) => {
    try {
      const allOrders = await Order.find().sort({ createdAt: -1 }).lean();
      res.json({ orders: allOrders });
    } catch (error) { next(error); }
  });

  app.put('/api/admin/orders/:id/status', csrfProtection, requireAdmin, async (req, res, next) => {
    try {
      const { status } = req.body;
      if (['paid', 'pending_payment'].includes(status)) {
         return res.status(403).json({ error: 'Payment status transitions are managed automatically.' });
      }
      if (!['fulfilled', 'cancelled', 'payment_review'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      
      if (order.status === 'cancelled' && status !== 'cancelled') {
         return res.status(400).json({ error: 'Cannot manually un-cancel a cancelled order.' });
      }

      if (order.status !== 'cancelled' && status === 'cancelled') {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          const currentOrder = await Order.findById(req.params.id).session(session);
          if (currentOrder.status !== 'cancelled') {
             for (const line of currentOrder.lines) {
               const p = await Product.findOne({ slug: line.slug }).session(session);
               if (p) {
                 p.stock[line.size] = (p.stock[line.size] || 0) + line.qty;
                 await p.save({ session });
               }
             }
             currentOrder.status = 'cancelled';
             await currentOrder.save({ session });
          }
          await session.commitTransaction();
          return res.json({ success: true, order: currentOrder });
        } catch (e) {
          await session.abortTransaction();
          throw e;
        } finally {
          session.endSession();
        }
      }
      
      const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
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
    if (req.session.userId) next();
    else res.status(401).json({ error: 'Authentication required to checkout' });
  };


  app.post('/api/orders', csrfProtection, checkDb, requireCustomer, async (req, res, next) => {
    try {
      const { customer, items } = req.body;
      if (!customer || !items || !items.length) return res.status(400).json({ error: 'Invalid order data' });
      
      if (!hasDatabase) return res.status(503).json({ error: 'Checkout disabled in demo mode' });
      
      if (!razorpay) return res.status(503).json({ error: 'Payment system is not configured. Checkout is unavailable.' });

      const aggregatedItems = {};
      for (const item of items) {
        if (!item.slug || !item.size || !item.qty || !Number.isSafeInteger(item.qty) || item.qty < 1) {
          return res.status(400).json({ error: 'Invalid item data' });
        }
        const key = `${item.slug}:${item.size}`;
        if (!aggregatedItems[key]) {
          aggregatedItems[key] = { ...item };
        } else {
          aggregatedItems[key].qty += item.qty;
        }
      }
      const finalItems = Object.values(aggregatedItems);

      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        let total = 0;
        const lines = [];

        for (const item of finalItems) {
          const product = await Product.findOne({ slug: item.slug }).session(session);
          if (!product || product.published === false) throw new Error(`Product ${item.slug} not found or unpublished`);
          
          if (!product.stock || (product.stock[item.size] || 0) < item.qty) {
            throw new Error(`Insufficient stock for ${product.name} (Size: ${item.size})`);
          }

          product.stock[item.size] -= item.qty;
          await product.save({ session });

          total += product.price * item.qty;
          lines.push({
            slug: product.slug, name: product.name, quality: product.quality || 'N/A', size: item.size,
            price: product.price, qty: item.qty
          });
        }

        const orderRef = crypto.randomBytes(8).toString('hex').toUpperCase();
        
        const rzpOrder = await razorpay.orders.create({
          amount: total, 
          currency: 'INR',
          receipt: orderRef
        });
        const paymentIntentId = rzpOrder.id;

        const order = new Order({
          orderRef, customer, lines, total, status: 'pending_payment', paymentIntentId,
          userId: req.session.userId,
          expiresAt: new Date(Date.now() + 15 * 60000)
        });
        await order.save({ session });
        await session.commitTransaction();

        res.json({ success: true, orderRef, paymentIntentId, razorpayKeyId: process.env.RAZORPAY_KEY_ID });
      } catch (error) {
        await session.abortTransaction();
        if (error.message.includes('Insufficient stock') || error.message.includes('not found')) {
           return res.status(400).json({ error: error.message });
        }
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) { next(error); }
  });


  app.post('/api/webhooks/razorpay', checkDb, async (req, res, next) => {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      if (!signature || !webhookSecret) return res.status(400).json({ error: 'Webhook signature/secret missing' });

      const expectedSignature = crypto.createHmac('sha256', webhookSecret)
                                      .update(req.body)
                                      .digest('hex');
                                      
      if (expectedSignature !== signature) {
        return res.status(400).json({ error: 'Invalid signature' });
      }

      const event = JSON.parse(req.body.toString('utf8'));
      if (event.event === 'order.paid' || event.event === 'payment.captured') {
        const payloadOrder = event.payload?.order?.entity;
        const paymentAmount = event.payload?.payment?.entity?.amount;
        const paymentCurrency = event.payload?.payment?.entity?.currency;
        const orderId = event.payload?.payment?.entity?.order_id || payloadOrder?.id;

        if (orderId) {
          const session = await mongoose.startSession();
          session.startTransaction();
          try {
            const order = await Order.findOne({ paymentIntentId: orderId }).session(session);
            if (order) {
              if (paymentCurrency !== 'INR' || paymentAmount !== order.total) {
                if (order.status === 'pending_payment' || order.status === 'cancelled') {
                   order.status = 'payment_review';
                   await order.save({ session });
                }
              } else if (order.status === 'pending_payment') {
                order.status = 'paid';
                order.expiresAt = undefined;
                await order.save({ session });
              } else if (order.status === 'cancelled') {
                let stockAvailable = true;
                for (const line of order.lines) {
                  const p = await Product.findOne({ slug: line.slug }).session(session);
                  if (!p || (p.stock[line.size] || 0) < line.qty) {
                    stockAvailable = false;
                    break;
                  }
                }
                if (stockAvailable) {
                  for (const line of order.lines) {
                    const p = await Product.findOne({ slug: line.slug }).session(session);
                    p.stock[line.size] -= line.qty;
                    await p.save({ session });
                  }
                  order.status = 'paid';
                } else {
                  order.status = 'payment_review';
                }
                order.expiresAt = undefined;
                await order.save({ session });
              }
            }
            await session.commitTransaction();
          } catch (err) {
            await session.abortTransaction();
            throw err;
          } finally {
            session.endSession();
          }
        }
      }
      res.json({ status: 'ok' });
    } catch (err) { next(err); }
  });

  app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }));
  app.use(express.static(fileURLToPath(new URL('../client/dist', import.meta.url))));
  app.get('/{*path}', (req, res) => res.sendFile(fileURLToPath(new URL('../client/dist/index.html', import.meta.url))));
  
  app.use((error, req, res, next) => {
    console.error(error.message);
    res.status(500).json({ error: 'Unable to complete the request.' });
  });
  
  // Expiry / Release Job
  if (hasDatabase) {
    setInterval(async () => {
      try {
        const expiredOrders = await Order.find({ status: 'pending_payment', expiresAt: { $lt: new Date() } });
        for (const order of expiredOrders) {
          const session = await mongoose.startSession();
          session.startTransaction();
          try {
            const currentOrder = await Order.findById(order._id).session(session);
            if (currentOrder && currentOrder.status === 'pending_payment') {
              currentOrder.status = 'cancelled';
              // Release stock
              for (const line of currentOrder.lines) {
                const p = await Product.findOne({ slug: line.slug }).session(session);
                if (p) {
                  p.stock[line.size] = (p.stock[line.size] || 0) + line.qty;
                  await p.save({ session });
                }
              }
              await currentOrder.save({ session });
            }
            await session.commitTransaction();
          } catch (err) {
            await session.abortTransaction();
          } finally {
            session.endSession();
          }
        }
      } catch (err) {}
    }, 60000);
  }

  return app;
}



