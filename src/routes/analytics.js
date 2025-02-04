const express = require('express');
const router = express.Router();
const { analyticsLimiter } = require('../middleware/rateLimiter');

// Get analytics count - No rate limit on this endpoint
router.get('/count', async (req, res) => {
    try {
        const count = await Analytics.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Apply rate limiter to POST analytics only
router.post('/', analyticsLimiter, async (req, res) => {
    try {
        const { widget_name, browser_type } = req.body;
        const analytics = new Analytics({
            widget_name,
            browser_type,
            created_at: new Date()
        });
        await analytics.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Handle rate limit exceeded
router.use((err, req, res, next) => {
    if (err.statusCode === 429) {
        return res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'Please upgrade to continue using analytics',
            redirectTo: '/upgrade-analytics'
        });
    }
    next(err);
});

module.exports = router;