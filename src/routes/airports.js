const express = require('express');
const router = express.Router();
const { Airport } = require('../models'); 
const { Sequelize } = require("sequelize");


// GET endpoint for airport autocomplete
router.get('/airports', async (req, res) => {
    try {
        const searchTerm = req.query.search;

        if (!searchTerm || searchTerm.length < 3) {
            return res.status(400).json({
                error: 'Search term must be at least 3 characters long',
            });
        }

        // Fetch airports matching the search term
        const airports = await Airport.findAll({
            where: {
                name: {
                    [Sequelize.Op.like]: `%${searchTerm}%`, 
                },
            },
            attributes: ['id', 'name', 'code', 'latitude', 'longitude'], 
        });

        res.json(airports);
    } catch (error) {
        console.error('Error fetching airports:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
