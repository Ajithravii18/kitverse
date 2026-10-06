import { problem } from '../order-service.js';
import { User } from '../models.js';

export const requireAdmin = (req, res, next) => {
  if (req.session.userId && (req.session.role === 'admin' || req.session.role === 'staff')) next();
  else res.status(403).json({ error: 'Forbidden' });
};

export const requireSuperAdmin = (req, res, next) => {
  if (req.session.userId && req.session.role === 'admin') next();
  else res.status(403).json({ error: 'Forbidden: Super Admin only' });
};

export const requireFinance = (req, res, next) => {
  if (req.session.userId && (req.session.role === 'admin' || (req.session.role === 'staff' && req.session.permissions?.includes('finance')))) next();
  else res.status(403).json({ error: 'Forbidden: Finance permission required' });
};

export const requireInventory = (req, res, next) => {
  if (req.session.userId && (req.session.role === 'admin' || (req.session.role === 'staff' && req.session.permissions?.includes('inventory')))) next();
  else res.status(403).json({ error: 'Forbidden: Inventory permission required' });
};

export const requireCustomer = async (req, res, next) => {
  try {
    if(!req.session.userId || req.session.role!=='customer')throw problem(401,'Authentication required to checkout');
    const user=await User.findById(req.session.userId);
    if(!user?.isVerified)throw problem(403,'Verify your email before checkout.');
    next();
  }catch(error){next(error);}
};
