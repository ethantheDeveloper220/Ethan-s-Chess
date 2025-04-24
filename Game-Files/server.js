const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

// Initialize owner if not present
(async () => {
  const existingOwner = await User.findOne({ username: 'Owner' });
  if (!existingOwner) {
    const owner = new User({
      username: 'Owner',
      password: 'Compass15!', // plaintext for demo — should hash in production
      role: 'owner'
    });
    await owner.save();
    console.log('Default owner account created.');
  }
})();

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
