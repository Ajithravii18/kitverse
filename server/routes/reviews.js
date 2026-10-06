import express from 'express';
import { Review, Product, Order, Discount } from '../models.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/reviews', async (req, res, next) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: 'Must be logged in to review' });
    const { productId, rating, text } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Invalid rating' });
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Enforce Verified Purchase
    const boughtOrders = await Order.find({ 
      userId: req.session.userId, 
      paymentStatus: { $in: ['paid', 'legacy_fulfilled'] },
      'lines.slug': product.slug 
    }).lean();
    
    if (!boughtOrders.length) {
      return res.status(403).json({ error: 'You must have purchased this product to leave a review.' });
    }
    
    const review = new Review({
      productId,
      userId: req.session.userId,
      rating,
      text,
      status: 'pending'
    });
    await review.save();
    res.json({ success: true, review });
  } catch (err) { next(err); }
});

router.get('/admin/reviews', requireAdmin, async (req, res, next) => {
  try {
    const reviews = await Review.find().populate('userId', 'email').populate('productId', 'name slug image').sort({ createdAt: -1 }).lean();
    res.json({ reviews });
  } catch (err) { next(err); }
});

router.put('/admin/reviews/:id', requireAdmin, async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id },
      { 
        $set: { 
          status, 
          ...(adminNotes !== undefined ? { adminNotes } : {}) 
        }
      },
      { new: true }
    );
    if (!review) return res.status(404).json({ error: 'Not found' });
    
    let discount = null;
    if (status === 'approved' && !review.rewardIssued) {
      const mongoose = (await import('mongoose')).default;
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const freshReview = await Review.findOne({ _id: review._id, rewardIssued: { $ne: true } }).session(session);
          if (!freshReview) return;
          
          freshReview.rewardIssued = true;
          await freshReview.save({ session });
          
          const code = 'RVW-' + Math.random().toString(36).substr(2, 6).toUpperCase();
          discount = new Discount({
            code,
            type: 'fixed',
            value: 15000,
            usageLimit: 1,
            active: true
          });
          await discount.save({ session });
        });
      } finally {
        session.endSession();
      }
    }
    
    res.json({ success: true, review, generatedDiscount: discount?.code });
  } catch (err) { next(err); }
});

export default router;
