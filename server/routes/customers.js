import express from 'express';
import { User, Order } from '../models.js';
import { requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin/customers', requireSuperAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const match = { role: 'customer' };
    if (req.query.search) match.$or = [{ email: new RegExp(req.query.search, 'i') }];
    if (req.query.verified !== undefined && req.query.verified !== '') match.isVerified = req.query.verified === 'true';
    
    const customers = await User.aggregate([
      { $match: match },
      { $lookup: { from: 'orders', localField: '_id', foreignField: 'userId', as: 'orders' } },
      { $addFields: {
          orderCount: { $size: "$orders" },
          lifetimeSpend: {
            $reduce: {
              input: "$orders",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  {
                    $cond: [
                      { $in: ["$$this.paymentStatus", ["paid", "partially_refunded", "review_required", "refunded", "legacy_fulfilled"]] },
                      { $subtract: [
                          "$$this.total", 
                          { $sum: { $map: { input: { $filter: { input: "$$this.refunds", as: "r", cond: { $eq: ["$$r.status", "processed"] } } }, as: "rf", in: "$$rf.amount" } } }
                      ]},
                      0
                    ]
                  }
                ]
              }
            }
          }
        }
      },
      { $project: { passwordHash: 0, otp: 0, otpAttempts: 0, otpExpires: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);
    const total = await User.countDocuments(match);
    res.json({ customers, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

router.get('/admin/customers/:id', requireSuperAdmin, async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id, '-passwordHash -otp -otpAttempts -otpExpires').lean();
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    const orders = await Order.find({ userId: customer._id }).sort({ createdAt: -1 }).lean();
    res.json({ customer, orders });
  } catch (err) { next(err); }
});

router.put('/admin/customers/:id/notes', requireSuperAdmin, async (req, res, next) => {
  try {
    const customer = await User.findByIdAndUpdate(req.params.id, { supportNotes: req.body.notes }, { new: true, select: '-passwordHash -otp -otpAttempts -otpExpires' });
    res.json({ success: true, customer });
  } catch (err) { next(err); }
});

export default router;
