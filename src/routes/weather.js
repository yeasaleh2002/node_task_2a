const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  const { lat, lon } = req.query; // Get latitude and longitude from the query parameters
  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and Longitude are required" });
  }

  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lon}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Weather API error" });
  }
});

module.exports = router;
