const express = require('express');
const router = express.Router();

// Basic analytics routes
router.get('/', async (req, res) => {
    try {
        res.json({ message: "Analytics endpoint" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 