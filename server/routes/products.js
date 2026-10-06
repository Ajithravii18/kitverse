import express from 'express';
import { Product } from '../models.js';
import { products, qualities } from '../../shared/catalog.js';
import { isListedProduct, publicProduct } from '../../shared/product.js';
import { checkDb } from '../middleware/db.js';
import { requireInventory } from '../middleware/auth.js';

const router = express.Router();

router.get('/products', checkDb, async (req, res, next) => {
  try {
    if (req.query.quality && !qualities.includes(req.query.quality)) return res.status(400).json({ error: 'Unknown quality option.' });
    if (req.query.category && !['club', 'national'].includes(req.query.category)) return res.status(400).json({ error: 'Unknown team category.' });
    
    const { hasDatabase, readProducts } = req.app.locals;
    let items = hasDatabase ? await readProducts() : products;
    items = items.filter(isListedProduct);
    
    if (req.query.quality) items = items.filter(p => p.quality === req.query.quality);
    if (req.query.category) items = items.filter(p => p.category === req.query.category);
    
    res.json({ products: items.map(publicProduct), demo: !hasDatabase, checkoutEnabled: req.app.locals.paymentsReady });
  } catch (error) { next(error); }
});

router.get('/admin/products', requireInventory, async (req, res, next) => {
  try {
    const allProducts = await Product.find().lean();
    res.json({ products: allProducts });
  } catch (error) { next(error); }
});

router.post('/admin/products', requireInventory, async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({ success: true, product: newProduct });
  } catch (error) { next(error); }
});

router.post('/admin/inventory/adjust', requireInventory, async (req, res, next) => {
  const mongoose = (await import('mongoose')).default;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { productSlug, size, quantityChange, reason, idempotencyKey } = req.body;
    if (!productSlug || !size || typeof quantityChange !== 'number' || !reason || !idempotencyKey) {
      throw new Error('Missing required fields');
    }
    if (quantityChange === 0) throw new Error('Quantity change must be non-zero');
    const InventoryHistory = mongoose.model('InventoryHistory');
    const existing = await InventoryHistory.findOne({ idempotencyKey }).session(session);
    if (existing) {
      await session.abortTransaction(); session.endSession();
      return res.json({ success: true, message: 'Already processed' });
    }
    
    const product = await mongoose.model('Product').findOne({ slug: productSlug }).session(session);
    if (!product) throw new Error('Product not found');
    
    const currentStock = product.stock[size] || 0;
    if (currentStock + quantityChange < 0) throw new Error('Cannot reduce stock below 0');
    
    await mongoose.model('Product').updateOne({ slug: productSlug }, { $inc: { [`stock.${size}`]: quantityChange } }, { session });
    
    await InventoryHistory.create([{ productSlug, size, quantityChange, reason, adminUser: req.session.userId, idempotencyKey }], { session });
    
    await session.commitTransaction(); session.endSession();
    res.json({ success: true });
  } catch (error) {
    await session.abortTransaction(); session.endSession();
    next(error);
  }
});

router.put('/admin/products/:slug', requireInventory, async (req, res, next) => {
  try {
    delete req.body.stock; // Prevent direct stock overwrite
    const updated = await Product.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true, runValidators: true });

    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, product: updated });
  } catch (error) { next(error); }
});

export default router;
