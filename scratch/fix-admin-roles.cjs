const fs = require('fs');

let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/app.js', 'utf8');

if (!content.includes('const requireSuperAdmin')) {
  const adminAnchor = `const requireAdmin = (req, res, next) => {
    if (req.session.userId && req.session.role === 'admin') next();
    else res.status(403).json({ error: 'Forbidden' });
  };`;
  
  const modifiedAdmin = `const requireAdmin = (req, res, next) => {
    if (req.session.userId && (req.session.role === 'admin' || req.session.role === 'staff')) next();
    else res.status(403).json({ error: 'Forbidden' });
  };

  const requireSuperAdmin = (req, res, next) => {
    if (req.session.userId && req.session.role === 'admin') next();
    else res.status(403).json({ error: 'Forbidden: Super Admin only' });
  };`;
  
  if (content.includes(adminAnchor)) {
    content = content.replace(adminAnchor, modifiedAdmin);
  } else {
    // If it doesn't match exactly, fallback to regex
    content = content.replace(/const requireAdmin = \([\s\S]*?res\.status\(403\)[\s\S]*?\};/, modifiedAdmin);
  }
}

fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/app.js', content);
