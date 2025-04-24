const User = require('../models/User');
const authMiddleware = async (req, res, next) => {
  const { username, password } = req.headers;
  if (!username || !password) return res.status(401).json({ message: 'Missing credentials' });

  const user = await User.findOne({ username, password });
  if (!user) return res.status(403).json({ message: 'Invalid credentials' });

  req.user = user;
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'owner') return next();
  res.status(403).json({ message: 'Admin access required' });
};

const requireOwner = (req, res, next) => {
  if (req.user.role === 'owner') return next();
  res.status(403).json({ message: 'Owner access required' });
};

module.exports = { authMiddleware, requireAdmin, requireOwner };
