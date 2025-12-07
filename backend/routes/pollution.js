const express = require('express');
const PollutionReading = require('../models/PollutionReading');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// ADMIN: add pollution data
// body: { location, sox, nox, co, pm, vocs }
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const { location, sox, nox, co, pm, vocs } = req.body;

    if (
      !location ||
      sox == null ||
      nox == null ||
      co == null ||
      pm == null ||
      vocs == null
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const reading = await PollutionReading.create({
      location:location.trim().toLowerCase(),
      sox,
      nox,
      co,
      pm,
      vocs,
      createdBy: req.user.id
    });

    res.status(201).json(reading);
  } catch (err) {
    console.error('add pollution error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// USER: get latest pollution for THEIR location
router.get('/my-location', auth, async (req, res) => {
  try {
    if (!req.user.location) {
      return res.status(400).json({ message: 'User location not set' });
    }

    const latest = await PollutionReading.findOne({
      location: req.user.location
    }).sort({ createdAt: -1 });

    if (!latest) {
      return res
        .status(404)
        .json({ message: 'No data available for your region' });
    }

    res.json(latest);
  } catch (err) {
    console.error('get my-location error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
