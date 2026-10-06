import express from 'express';
import bcrypt from 'bcrypt';
import { randomInt } from 'node:crypto';
import { User, Order } from '../models.js';
import { problem } from '../order-service.js';
import { consumeOtp } from '../otp.js';
import { sendOtpEmail } from '../utils/email.js';
import { loginLimiter, verifyLimiter, otpLimiter } from '../middleware/rate-limit.js';
import { checkDb } from '../middleware/db.js';

const router = express.Router();
export const REMEMBERED_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const generateOTP = () => randomInt(100000, 1000000).toString();

router.post('/customer/resend-verification', otpLimiter, checkDb, async (req, res, next) => {
  try {
    const email = typeof req.body?.email==='string' ? req.body.email.trim().toLowerCase() : '';
    if(!email)throw problem(400,'Email is required.');
    const user = await User.findOne({ email, role:'customer' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'User is already verified' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 15 * 60000);
    user.otpAttempts = 0;
    user.otpPurpose = 'verification';
    await user.save();

    try {
      await sendOtpEmail(email, otp, 'Verification');
      res.json({ success: true, message: 'Verification code sent.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
    }
  } catch (err) { next(err); }
});

router.post('/customer/register', otpLimiter, checkDb, async (req, res, next) => {
  try {
    const {username,password}=req.body || {};
    const email=typeof req.body?.email==='string'?req.body.email.trim().toLowerCase():'';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof username!=='string'||!username.trim()||typeof password!=='string'||password.length<8||Buffer.byteLength(password)>72)throw problem(400,'Enter a valid email, username and password (at least 8 characters, at most 72 bytes).');
    if (!email || !username || !password) return res.status(400).json({ error: 'Missing required fields' });
    
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ error: 'Email or username already in use' });

    const otp = generateOTP();
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = new User({
      email, username, passwordHash, role: 'customer',
      otp, otpExpires: new Date(Date.now() + 15 * 60000), otpPurpose:'verification', otpAttempts: 0 // 15 mins
    });
    await user.save();

    await sendOtpEmail(email, otp, 'Sign Up');

    res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) { next(err); }
});

router.post('/customer/verify', verifyLimiter, checkDb, async (req,res,next)=>{
  try {await consumeOtp({...req.body,purpose:'verification',changes:{isVerified:true}});res.json({success:true});}catch(error){next(error);}
});

router.post('/customer/login', loginLimiter, checkDb, async (req, res, next) => {
  try {
    const {password,rememberMe}=req.body || {};
    const email=typeof req.body?.email==='string'?req.body.email.trim().toLowerCase():'';
    if(typeof password!=='string')throw problem(400,'Password is required.');
    const user = await User.findOne({ email, role: 'customer' });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Account not verified. Please request a new OTP.' });
    }

    await new Promise((resolve,reject)=>req.session.regenerate(error=>error?reject(error):resolve()));
    req.session.userId = user._id;
    req.session.role = 'customer';
    if (rememberMe) {
      req.session.cookie.maxAge = REMEMBERED_SESSION_TTL_MS;
    } else {
      req.session.cookie.expires = false;
    }
    req.session.save(err => {
      if (err) return next(err);
      res.json({ success: true, email: user.email, username: user.username });
    });
  } catch (err) { next(err); }
});

router.post('/customer/forgot-password', otpLimiter, checkDb, async (req, res, next) => {
  try {
    const email = typeof req.body?.email==='string' ? req.body.email.trim().toLowerCase() : '';
    if(!email)throw problem(400,'Email is required.');
    const user = await User.findOne({ email, role: 'customer' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 15 * 60000);
    user.otpAttempts = 0;
    user.otpPurpose = 'password-reset';
    await user.save();

    await sendOtpEmail(email, otp, 'Password Reset');

    res.json({ success: true, message: 'Password reset OTP sent to email' });
  } catch (err) { next(err); }
});

router.post('/customer/reset-password', verifyLimiter, checkDb, async(req,res,next)=>{
  try {
    const {email,otp,newPassword}=req.body || {};
    if(typeof newPassword!=='string'||newPassword.length<8||Buffer.byteLength(newPassword)>72)throw problem(400,'Use a password of 8–72 bytes.');
    const passwordHash=await bcrypt.hash(newPassword,10);
    await consumeOtp({email,otp,purpose:'password-reset',changes:{passwordHash}});
    res.json({success:true});
  }catch(error){next(error);}
});

router.get('/customer/me', async (req, res, next) => {
  if (req.session.userId && req.session.role === 'customer') {
    try {
      const user = await User.findById(req.session.userId);
      if(!user){req.session.destroy(()=>{});return res.status(401).json({authenticated:false});}
      const pastOrders = await Order.find({ userId: user._id, paymentStatus: { $nin: ['pending', 'cancelled'] } }).sort({ createdAt: -1 });
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

router.put('/customer/profile', async (req, res, next) => {
  if (!req.session.userId || req.session.role !== 'customer') {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (newPassword || (email && email !== user.email)) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change email or password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) return res.status(403).json({ error: 'Incorrect current password' });
    }

    if (username) user.username = username;
    
    if (newPassword) {
      if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    if (email && email !== user.email) {
      user.email = email;
      user.isVerified = false;
    }

    await user.save();
    res.json({ success: true, email: user.email, username: user.username, isVerified: user.isVerified });
  } catch (err) { 
    if (err.code === 11000) return res.status(400).json({ error: 'Email or username already exists' });
    next(err); 
  }
});

router.post('/customer/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

router.post('/admin/login', loginLimiter, checkDb, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: { $in: ['admin', 'staff'] } });
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      await new Promise((resolve,reject)=>req.session.regenerate(error=>error?reject(error):resolve()));
      req.session.userId = user._id;
      req.session.role = user.role;
      req.session.permissions = user.permissions || [];
      req.session.save((err) => {
        if (err) return next(err);
        res.json({ success: true, email: user.email });
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) { next(error); }
});

router.post('/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

router.get('/admin/me', (req, res) => {
  if (req.session.userId && ['admin','staff'].includes(req.session.role)) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

export default router;
