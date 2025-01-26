const express = require("express");
const router = express.Router();
const { Analytics } = require("../models");
const { js2xml } = require("xml-js");
const rateLimit = require("express-rate-limit");

// Create a rate limiter for the analytics routes
const analyticsRateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  message: "Too many requests from this IP, please try again after a minute",
});

// Apply the rate limiter to the /analytics routes
router.use(analyticsRateLimiter);

router.post("/", async (req, res) => {
  const { widget_name, browser_type } = req.body;
  try {
    const analytic = await Analytics.create({ widget_name, browser_type });
    res.status(201).json(analytic);
  } catch (error) {
    res.status(500).json({ message: "Error logging analytic", error });
  }
});

// Fetch count of analytics records
router.get('/count', async (req, res) => {
  try {
    const count = await Analytics.count();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching count:', error);
    res.status(500).json({ message: 'Error fetching count', error });
  }
});

router.get("/export", async (req, res) => {
  try {
    // Fetch all analytics data
    const analytics = await Analytics.findAll();

    if (!analytics || analytics.length === 0) {
      return res
        .status(404)
        .json({ message: "No analytics data found to export." });
    }

    // Convert data to plain JSON format
    const analyticsData = analytics.map((a) => a.toJSON());

    // Convert JSON data to XML format
    const xml = js2xml(
      { analytics: analyticsData },
      { compact: true, ignoreComment: true, spaces: 4 }
    );

    // Send XML response
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Error exporting analytics:", error);
    res.status(500).json({ message: "Error exporting analytics", error });
  }
});

module.exports = router;
