const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// GET ALL VERIFIED HOSPITALS
router.get('/', async (req, res) => {
    try {
        const { city } = req.query;
        let query = {};
        if (city) query.city = city;

        const hospitals = await Hospital.find(query).select('-password');
        res.json(hospitals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET HOSPITAL BY ID
router.get('/:id', async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id).select('-password');
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
        
        res.json(hospital);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
