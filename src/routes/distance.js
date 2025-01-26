const express = require('express');
const router = express.Router();

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

router.get('/distance', (req, res) => {
  const airport = req.query.airport;
  const airportData = {
    'London Heathrow': { latitude: 51.4700, longitude: -0.4543 },
    'John F. Kennedy': { latitude: 40.6413, longitude: -73.7781 },
    'Lagos Murtala Muhammed': { latitude: 6.5777, longitude: 3.3236 },
    'Karachi Jinnah': { latitude: 24.8998, longitude: 67.1595 },
  };

  if (airportData[airport]) {
    const arcticCircleLat = 66.5633; // Latitude of Arctic Circle
    const arcticCircleLon = 0;
    const { latitude, longitude } = airportData[airport];
    const distance = haversine(arcticCircleLat, arcticCircleLon, latitude, longitude);
    res.json({ distance });
  } else {
    res.status(404).send('Airport not found');
  }
});

module.exports = router;
