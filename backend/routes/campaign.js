const express = require('express');
const Campaign = require('../models/Campaign');
const Offer = require('../models/Offer');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Create Campaign (Advertiser only)
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'advertiser') return res.status(403).json({ error: 'Unauthorized' });
  const { title, description, niche, budget } = req.body;
  try {
    const campaign = new Campaign({ title, description, niche, budget, advertiser: req.user.userId });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List Campaigns
router.get('/', async (req, res) => {
  const { niche } = req.query;
  try {
    const query = niche ? { niche } : {};
    const campaigns = await Campaign.find(query).populate('advertiser', 'profile.name');
    res.json(campaigns);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create Offer
router.post('/:id/offer', authMiddleware, async (req, res) => {
  if (req.user.role !== 'influencer') return res.status(403).json({ error: 'Unauthorized' });
  const { rate } = req.body;
  try {
    const offer = new Offer({
      campaign: req.params.id,
      influencer: req.user.userId,
      rate,
    });
    await offer.save();
    await Campaign.findByIdAndUpdate(req.params.id, { $push: { offers: offer._id } });
    res.status(201).json(offer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
