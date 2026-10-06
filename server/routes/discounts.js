import express from 'express';
import { Discount } from '../models.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin/discounts', requireAdmin, async (req, res, next) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 }).lean();
    res.json({ discounts });
  } catch (err) { next(err); }
});

router.post('/admin/discounts', requireAdmin, async (req, res, next) => {
  try {
    const discount = new Discount(req.body);
    await discount.save();
    res.json({ success: true, discount });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Discount code already exists' });
    next(err);
  }
});

router.post('/checkout/validate-discount', async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const discount = await Discount.findOne({ code: code.toUpperCase(), active: true });
    
    if (!discount) return res.status(404).json({ error: 'Invalid or expired code' });
    if (discount.expiry && discount.expiry < new Date()) return res.status(400).json({ error: 'Code expired' });
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) return res.status(400).json({ error: 'Code usage limit reached' });
    if (discount.minSpend && subtotal < discount.minSpend) return res.status(400).json({ error: `Minimum spend is ₹${discount.minSpend / 100}` });
    
    let amount = 0;
    if (discount.type === 'fixed') {
      amount = discount.value;
    } else if (discount.type === 'percentage') {
      amount = Math.round(subtotal * (discount.value / 100));
    }
    
    res.json({ success: true, discountAmount: amount, code: discount.code });
  } catch (err) { next(err); }
});

export default router;
