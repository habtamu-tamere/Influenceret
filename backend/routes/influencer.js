const express = require('express');
const User = require('../models/User');
const router = express.Router();

// List Influencers
router.get('/', async (req, res) => {
  const { niche, minRate, maxRate } = req.query;
  try {
    const query = { role: 'influencer' };
    if (niche) query['profile.niche'] = niche;
    if (minRate) query['profile.rate'] = { $gte: Number(minRate) };
    if (maxRate) query['profile.rate'] = { ...query['profile.rate'], $lte: Number(maxRate) };
    const influencers = await User.find(query).select('profile');
    res.json(influencers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
