const fs = require('fs');
let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/app.js', 'utf8');

// Fix aggregation
content = content.replace(
  /\{ \$sum: "\$\$this.refunds.amount" \}/g, 
  '{ $sum: { $map: { input: { $filter: { input: "$$this.refunds", as: "r", cond: { $eq: ["$$r.status", "processed"] } } }, as: "rf", in: "$$rf.amount" } } }'
);

// Add missing Review and Discount to imports if not there
if(!content.includes('Discount')) {
  content = content.replace("import {Order, Product, User, InventoryHistory, Content}", "import {Order, Product, User, InventoryHistory, Content, Review, Discount}");
}

// Write the role-based middleware
const rolesMiddleware = `
const requireAdmin = (req, res, next) => {
  if (!req.session.userId || (req.session.role !== 'admin' && req.session.role !== 'staff')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Super Admin only' });
  }
  next();
};
`;

// Replace requireAdmin if it exists, or inject it
content = content.replace(/const requireAdmin = \([\s\S]*?next\(\);\s*\};\s*/, rolesMiddleware);

// Now update Customers and Reports routes to use requireSuperAdmin
content = content.replace(/app\.get\('\/api\/admin\/customers'/g, "app.get('/api/admin/customers', requireSuperAdmin, (req, res, next) => { req.query._preventMatch=true; next(); });\n  app.get('/api/admin/customers'"); // Actually just replace requireAdmin with requireSuperAdmin in these routes:
content = content.replace(/app\.get\('\/api\/admin\/customers', requireAdmin/g, "app.get('/api/admin/customers', requireSuperAdmin");
content = content.replace(/app\.get\('\/api\/admin\/customers\/:id', requireAdmin/g, "app.get('/api/admin/customers/:id', requireSuperAdmin");
content = content.replace(/app\.put\('\/api\/admin\/customers\/:id\/notes', requireAdmin/g, "app.put('/api/admin/customers/:id/notes', requireSuperAdmin");

fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/app.js', content);
