const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const { Time } = require('../models');

router.get('/', async (req, res) => {
  const times = {
    london: {
      time: moment().tz('Europe/London').format(),
      timezone: 'Europe/London'
    },
    est: {
      time: moment().tz('America/New_York').format(),
      timezone: 'America/New_York'
    },
    nigeria: {
      time: moment().tz('Africa/Lagos').format(),
      timezone: 'Africa/Lagos'
    },
    pakistan: {
      time: moment().tz('Asia/Karachi').format(),
      timezone: 'Asia/Karachi'
    }
  };

  try {
    await Time.create({
      london: times.london.time,
      est: times.est.time,
      nigeria: times.nigeria.time,
      pakistan: times.pakistan.time
    });
    res.json(times);
  } catch (error) {
    console.error('Error saving times:', error);
    res.status(500).json({ message: 'Error saving times' });
  }
});

module.exports = router;
