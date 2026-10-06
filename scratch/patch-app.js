import fs from 'fs';

const path = 'server/app.js';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
  app.post('/api/admin/inventory/adjust', requireAdmin, async (req, res, next) => {
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
      
      await mongoose.model('Product').updateOne({ slug: productSlug }, { $inc: { [\`stock.\${size}\`]: quantityChange } }, { session });
      
      await InventoryHistory.create([{ productSlug, size, quantityChange, reason, adminUser: req.session.userId, idempotencyKey }], { session });
      
      await session.commitTransaction(); session.endSession();
      res.json({ success: true });
    } catch (error) {
      await session.abortTransaction(); session.endSession();
      next(error);
    }
  });

  app.put('/api/admin/products/:slug', requireAdmin, async (req, res, next) => {
    try {
      delete req.body.stock; // Prevent direct stock overwrite
      const updated = await Product.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true, runValidators: true });
`;

content = content.replace(/app\.put\('\/api\/admin\/products\/:slug',\s*requireAdmin,\s*async\s*\(req,\s*res,\s*next\)\s*=>\s*\{\s*try\s*\{\s*const updated = await Product\.findOneAndUpdate\(\{ slug: req\.params\.slug \}, req\.body, \{ new: true, runValidators: true \}\);/g, replacement);

fs.writeFileSync(path, content, 'utf8');
