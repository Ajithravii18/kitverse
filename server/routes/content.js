import express from 'express';
import { Content } from '../models.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const CONTENT_ALLOWLIST = ['homepage-hero', 'announcement-bar', 'shipping-info', 'returns-info', 'size-guide', 'featured-products'];

router.get('/admin/content', requireAdmin, async (req, res, next) => {
  try {
    const contentList = await Content.find().lean();
    res.json({ content: contentList, allowlist: CONTENT_ALLOWLIST });
  } catch (err) { next(err); }
});

router.put('/admin/content/:key/draft', requireAdmin, async (req, res, next) => {
  try {
    if (!CONTENT_ALLOWLIST.includes(req.params.key)) return res.status(400).json({ error: 'Invalid content key' });
    let item = await Content.findOne({ key: req.params.key });
    if (!item) item = new Content({ key: req.params.key, history: [] });
    item.draftValue = req.body.value;
    item.history.push({ action: 'draft_saved', adminUser: req.session.userId, timestamp: new Date() });
    await item.save();
    res.json({ success: true, content: item });
  } catch (err) { next(err); }
});

router.post('/admin/content/:key/publish', requireAdmin, async (req, res, next) => {
  try {
    if (!CONTENT_ALLOWLIST.includes(req.params.key)) return res.status(400).json({ error: 'Invalid content key' });
    let item = await Content.findOne({ key: req.params.key });
    if (!item || !item.draftValue) return res.status(400).json({ error: 'No draft to publish' });
    item.publishedValue = item.draftValue;
    item.history.push({ action: 'published', adminUser: req.session.userId, timestamp: new Date() });
    await item.save();
    res.json({ success: true, content: item });
  } catch (err) { next(err); }
});

router.get('/content', async (req, res, next) => {
  try {
    const keys = req.query.keys ? req.query.keys.split(',') : CONTENT_ALLOWLIST;
    let payload = {};
    const mongoose = (await import('mongoose')).default;
    
    if (mongoose.connection.readyState === 1) {
      const contentList = await Promise.race([
        Content.find({ key: { $in: keys } }).lean(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
      ]);
      contentList.forEach(c => { payload[c.key] = c.publishedValue; });
    }
    res.json({ content: payload });
  } catch (err) { 
    res.json({ content: {} }); 
  }
});

export default router;
