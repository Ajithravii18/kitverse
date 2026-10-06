import express from 'express';
import { Order, Product } from '../models.js';
import { requireAdmin, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin/dashboard', requireAdmin, async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const ordersToday = await Order.find({ createdAt: { $gte: startOfDay }, paymentStatus: 'paid' });
    const salesToday = ordersToday.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = await Order.countDocuments({ paymentStatus: 'paid', fulfilmentStatus: 'unfulfilled' });
    const allProducts = await Product.find().lean();
    const lowStock = allProducts.filter(p => {
      if (!p.stock) return false;
      const vals = Object.values(p.stock);
      return vals.some(qty => qty > 0 && qty <= 5) || vals.every(qty => qty === 0);
    }).map(p => ({ slug: p.slug, name: p.name, stock: p.stock }));
    const paymentsToReview = await Order.countDocuments({ paymentStatus: 'review_required' });
    res.json({ salesToday, pendingOrders, lowStockCount: lowStock.length, lowStockItems: lowStock.slice(0, 10), paymentsToReview });
  } catch (err) { next(err); }
});

router.get('/admin/reports/sales', requireSuperAdmin, async (req, res, next) => {
  try {
    const sales = await Order.aggregate([
      { $match: { paymentStatus: { $in: ['paid', 'partially_refunded', 'review_required', 'refunded', 'legacy_fulfilled'] } } },
      { 
        $addFields: {
          totalRefunds: {
            $sum: {
              $map: {
                input: { $filter: { input: "$refunds", as: "r", cond: { $eq: ["$$r.status", "processed"] } } },
                as: "rf",
                in: "$$rf.amount"
              }
            }
          }
        }
      },
      // We unwind lines to compute cost, but keep the parent order fields like discountAmount and totalRefunds
      { $unwind: "$lines" },
      { 
        $group: {
          _id: { slug: "$lines.slug", productType: "$lines.productType" },
          qty: { $sum: "$lines.qty" },
          // Revenue before discounts and refunds for THIS specific product is hard to decouple if order-level discounts exist,
          // but we can compute the sum of (price * qty) as gross line revenue.
          grossLineRevenue: { $sum: { $multiply: ["$lines.qty", "$lines.price"] } },
          // Calculate known costs exactly; missing costs are not invented
          cost: { $sum: { $multiply: ["$lines.qty", { $ifNull: ["$lines.costPrice", 0] }] } },
          missingCostItems: { $sum: { $cond: [{ $eq: [{ $type: "$lines.costPrice" }, "missing"] }, 1, { $cond: [{ $eq: [{ $type: "$lines.costPrice" }, "null"] }, 1, 0] }] } },
          
          // To get accurate net profit, we should aggregate the whole order level discounts and refunds in a separate stage or just divide proportionally.
          // Let's do a simpler two-pass approach:
        }
      },
      { $sort: { grossLineRevenue: -1 } }
    ]);
    
    // Compute accurate totals from orders directly to avoid unwinding math issues
    const orderTotals = await Order.aggregate([
      { $match: { paymentStatus: { $in: ['paid', 'partially_refunded', 'review_required', 'refunded', 'legacy_fulfilled'] } } },
      { 
        $addFields: {
          processedRefunds: {
            $sum: {
              $map: {
                input: { $filter: { input: "$refunds", as: "r", cond: { $eq: ["$$r.status", "processed"] } } },
                as: "rf",
                in: "$$rf.amount"
              }
            }
          },
          totalCost: {
            $sum: {
              $map: {
                input: "$lines",
                as: "l",
                in: { $multiply: ["$$l.qty", { $ifNull: ["$$l.costPrice", 0] }] }
              }
            }
          },
          missingCostItems: {
            $sum: {
              $map: {
                input: "$lines",
                as: "l",
                in: { $cond: [{ $eq: [{ $type: "$$l.costPrice" }, "missing"] }, 1, { $cond: [{ $eq: [{ $type: "$$l.costPrice" }, "null"] }, 1, 0] }] }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalGross: { $sum: "$subtotal" }, // subtotal is before discounts
          totalDiscounts: { $sum: "$discountAmount" },
          totalRefunds: { $sum: "$processedRefunds" },
          totalCost: { $sum: "$totalCost" },
          totalMissingCostItems: { $sum: "$missingCostItems" },
          totalNetRevenue: { $sum: { $subtract: ["$total", "$processedRefunds"] } }
        }
      }
    ]);

    const totals = orderTotals[0] || { totalGross: 0, totalDiscounts: 0, totalRefunds: 0, totalCost: 0, totalMissingCostItems: 0, totalNetRevenue: 0 };
    
    // Fix: If costs are missing, explicitly mark profit as unavailable rather than reporting false positive profit
    const profit = totals.totalMissingCostItems > 0 ? null : (totals.totalNetRevenue - totals.totalCost);

    res.json({ sales, totals, profit });
  } catch (err) { next(err); }
});

export default router;
