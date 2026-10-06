const fs = require('fs');

const appJsFile = 'C:/Users/AJITH/OneDrive/Documents/New project/server/app.js';
let appJsContent = fs.readFileSync(appJsFile, 'utf8');

const newRoutes = `

  // ---- ADMIN CUSTOMERS ----
  app.get('/api/admin/customers', requireAdmin, async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      
      const match = {};
      if (req.query.search) {
        match.$or = [
          { email: new RegExp(req.query.search, 'i') }
        ];
      }
      if (req.query.verified !== undefined && req.query.verified !== '') {
        match.isVerified = req.query.verified === 'true';
      }
      
      // Calculate refund-aware lifetime spend
      const customers = await User.aggregate([
        { $match: match },
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'userId',
            as: 'orders'
          }
        },
        {
          $addFields: {
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
                        { $in: ["$$this.paymentStatus", ["paid", "partially_refunded", "review_required", "refunded"]] },
                        { 
                          $subtract: [
                            "$$this.total", 
                            { $sum: "$$this.refunds.amount" }
                          ] 
                        },
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

  app.get('/api/admin/customers/:id', requireAdmin, async (req, res, next) => {
    try {
      const customer = await User.findById(req.params.id, '-passwordHash -otp -otpAttempts -otpExpires').lean();
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      
      const orders = await Order.find({ userId: customer._id }).sort({ createdAt: -1 }).lean();
      res.json({ customer, orders });
    } catch (err) { next(err); }
  });

  app.put('/api/admin/customers/:id/notes', requireAdmin, async (req, res, next) => {
    try {
      const customer = await User.findByIdAndUpdate(req.params.id, { supportNotes: req.body.notes }, { new: true, select: '-passwordHash -otp -otpAttempts -otpExpires' });
      res.json({ success: true, customer });
    } catch (err) { next(err); }
  });


  // ---- ADMIN CONTENT ----
  const CONTENT_ALLOWLIST = ['homepage-hero', 'announcement-bar', 'shipping-info', 'returns-info', 'size-guide', 'featured-products'];
  
  app.get('/api/admin/content', requireAdmin, async (req, res, next) => {
    try {
      const contentList = await Content.find().lean();
      res.json({ content: contentList, allowlist: CONTENT_ALLOWLIST });
    } catch (err) { next(err); }
  });

  app.put('/api/admin/content/:key/draft', requireAdmin, async (req, res, next) => {
    try {
      if (!CONTENT_ALLOWLIST.includes(req.params.key)) return res.status(400).json({ error: 'Invalid content key' });
      
      let item = await Content.findOne({ key: req.params.key });
      if (!item) {
        item = new Content({ key: req.params.key });
      }
      
      item.draftValue = req.body.value;
      item.history.push({ action: 'draft_saved', adminUser: req.session.userId, timestamp: new Date() });
      await item.save();
      
      res.json({ success: true, content: item });
    } catch (err) { next(err); }
  });

  app.post('/api/admin/content/:key/publish', requireAdmin, async (req, res, next) => {
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

  // ---- PUBLIC CONTENT ----
  app.get('/api/content', async (req, res, next) => {
    try {
      const keys = req.query.keys ? req.query.keys.split(',') : CONTENT_ALLOWLIST;
      const contentList = await Content.find({ key: { $in: keys } }).lean();
      
      const payload = {};
      contentList.forEach(c => {
        payload[c.key] = c.publishedValue;
      });
      
      res.json({ content: payload });
    } catch (err) { next(err); }
  });

`;

// Find where to inject (before the final catch-all route or error handler)
// App.js usually ends with app.use(express.static(...)) and app.use((err...))
appJsContent = appJsContent.replace("app.use('/api', (req, res) => {", newRoutes + "\n  app.use('/api', (req, res) => {");

// Also import Content from models.js
if (!appJsContent.includes('Content')) {
  appJsContent = appJsContent.replace("import {Order, Product, User, InventoryHistory} from './models.js';", "import {Order, Product, User, InventoryHistory, Content} from './models.js';");
}

fs.writeFileSync(appJsFile, appJsContent);
