import fs from 'fs';

const path = 'server/app.js';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
  app.post('/api/admin/orders/:id/ship', requireAdmin, async (req, res, next) => {
    try {
      const order = await orderService.ship(req.params.id, { ...req.body, adminUser: req.session.userId });
      res.json({ success: true, order });
    } catch (error) { next(error); }
  });

  app.post('/api/admin/orders/:id/refund', requireAdmin, async (req, res, next) => {
    try {
      const order = await orderService.refund(req.params.id, { ...req.body, adminUser: req.session.userId });
      res.json({ success: true, order });
    } catch (error) { next(error); }
  });

  app.post('/api/admin/orders/:id/reconcile', requireAdmin, async (req, res, next) => {
    try {
      const order = await orderService.reconcilePayment(req.params.id, req.session.userId);
      res.json({ success: true, order });
    } catch (error) { next(error); }
  });

  app.put('/api/admin/orders/:id/status',
`;

content = content.replace(/app\.put\('\/api\/admin\/orders\/:id\/status',/, replacement);

fs.writeFileSync(path, content, 'utf8');
