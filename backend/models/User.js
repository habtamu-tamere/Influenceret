const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['advertiser', 'influencer'], required: true },
  profile: {
    name: String,
    niche: { type: String, enum: ['fashion', 'tech', 'food', 'travel', 'other'] },
    rate: { type: Number, default: 0 }, // Rate per post (in USD or ETB)
    location: { type: String, default: 'Ethiopia' },
    followers: { type: Number, default: 0 },
    portfolio: [String], // Links to previous work
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
