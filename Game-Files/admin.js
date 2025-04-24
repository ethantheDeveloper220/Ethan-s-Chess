const express = require('express');
const router = express.Router();
const { authMiddleware, requireAdmin, requireOwner } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.use(authMiddleware);

router.get('/users', requireAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.delete('/user/:username', requireOwner, async (req, res) => {
  const { username } = req.params;
  if (username === 'Owner') return res.status(400).json({ message: 'Cannot delete owner' });
  await User.deleteOne({ username });
  res.json({ message: `User ${username} deleted` });
});

module.exports = router;
