import fs from 'fs';

const path = 'server/app.js';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
  app.post('/api/admin/orders/:id/return', requireAdmin, async (req, res, next) => {
    try {
      const order = await orderService.requestReturn(req.params.id, { ...req.body, adminUser: req.session.userId });
      res.json({ success: true, order });
    } catch (error) { next(error); }
  });

  app.put('/api/admin/orders/:id/return/:returnId', requireAdmin, async (req, res, next) => {
    try {
      const order = await orderService.processReturn(req.params.id, { returnId: req.params.returnId, ...req.body, adminUser: req.session.userId });
      res.json({ success: true, order });
    } catch (error) { next(error); }
  });

  app.put('/api/admin/orders/:id/status',
`;

content = content.replace(/app\.put\('\/api\/admin\/orders\/:id\/status',/, replacement);

fs.writeFileSync(path, content, 'utf8');
