const express = require('express');
const router = express.Router();
const { Analytic } = require('../models/analytic');
const xml2js = require('xml2js');

router.get('/export-xml', async (req, res) => {
  try {
    const analytics = await Analytic.findAll();
    const builder = new xml2js.Builder();
    const xml = builder.buildObject({ analytics });
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting XML', error });
  }
});

module.exports = router;
