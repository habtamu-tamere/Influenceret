const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  niche: { type: String, enum: ['fashion', 'tech', 'food', 'travel', 'other'], required: true },
  budget: { type: Number, required: true },
  performanceMetrics: {
    clicks: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
  },
  advertiser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Campaign', campaignSchema);
