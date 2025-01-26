const rateLimit = require('express-rate-limit');

const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10 // limit each IP to 10 requests per windowMs
});

module.exports = {
  analyticsLimiter
}; 