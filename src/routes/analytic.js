const express = require("express");
const router = express.Router();
const { Analytics } = require("../models");
const { js2xml } = require("xml-js");
const rateLimit = require("express-rate-limit");
const xml2js = require("xml2js");
const multer = require("multer");
const upload = multer();

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

// Import API
router.post("/import", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Convert uploaded file to string
    const xmlData = req.file.buffer.toString();
    console.log("Uploaded XML Data:", xmlData); // Log raw XML for debugging

    // Parse XML to JSON
    const parsedData = await xml2js.parseStringPromise(xmlData, {
      explicitArray: false, // Prevent arrays for single elements
      trim: true, // Trim whitespace
      mergeAttrs: true, // Merge attributes into objects
    });
    console.log("Parsed XML Data:", parsedData); // Log parsed JSON for debugging

    // Validate the structure of the parsed data
    if (!parsedData.analytics || !parsedData.analytics.analytic) {
      return res.status(400).json({ message: "Invalid XML format" });
    }

    // Ensure analytics.analytic is an array
    const analyticsArray = Array.isArray(parsedData.analytics.analytic)
      ? parsedData.analytics.analytic
      : [parsedData.analytics.analytic];

    // Map through the analytics data to ensure required fields exist
    const formattedAnalytics = analyticsArray.map((item) => {
      const { widget_name, browser_type, created_at } = item;
      if (!widget_name || !browser_type || !created_at) {
        throw new Error("Missing required fields in one of the analytics entries");
      }
      return { widget_name, browser_type, created_at };
    });

    // Save data to the database or perform additional processing here
    console.log("Formatted Analytics Data:", formattedAnalytics);

    res.status(200).json({
      message: "Analytics imported successfully",
      data: formattedAnalytics,
    });
  } catch (error) {
    console.error("Error processing XML file:", error.message);
    res.status(400).json({
      message: "Error processing XML file",
      error: error.message,
    });
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
