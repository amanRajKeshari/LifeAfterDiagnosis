const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Donor = require('../models/Donor');
const DonationRequest = require('../models/DonationRequest');

// GET CURRENT DONOR PROFILE
router.get('/me', auth, async (req, res) => {
    try {
        if (req.user.role !== 'donor') return res.status(403).json({ message: 'Access denied' });
        
        const donor = await Donor.findById(req.user.id).select('-password');
        if (!donor) return res.status(404).json({ message: 'Donor not found' });
        
        res.json(donor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// TOGGLE AVAILABILITY
router.put('/availability', auth, async (req, res) => {
    try {
        if (req.user.role !== 'donor') return res.status(403).json({ message: 'Access denied' });

        const donor = await Donor.findByIdAndUpdate(
            req.user.id,
            { isAvailable: req.body.isAvailable },
            { new: true }
        ).select('-password');

        res.json({ donor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET MATCHES
router.get('/match', auth, async (req, res) => {
    try {
        // Find pending requests within city for this donor's bloodGroup and donationType
        // Simple mock matching algorithm for demonstration based on the frontend layout
        const { city, bloodGroup, donationType } = req.query;

        let query = { status: 'pending' };
        if (city) query.city = city;
        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (donationType) query.donationType = donationType;

        const requests = await DonationRequest.find(query)
            .populate('hospitalId', 'name location')
            .limit(10);

        // Map it to look exactly like the MatchedDonor frontend expects
        const matches = requests.map(req => ({
            _id: req._id,
            name: req.patientName,
            bloodGroup: req.bloodGroup,
            donationTypes: [req.donationType],
            city: req.city,
            matchPercent: Math.floor(Math.random() * (99 - 85 + 1) + 85),
            distanceKm: (Math.random() * 10 + 1).toFixed(1)
        }));

        res.json({ matches });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ACCEPT REQUEST
router.post('/accept/:requestId', auth, async (req, res) => {
    try {
        if (req.user.role !== 'donor') return res.status(403).json({ message: 'Access denied' });

        const request = await DonationRequest.findById(req.params.requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        if (request.status !== 'pending') return res.status(400).json({ message: 'Request is no longer pending' });

        // Update request status
        request.acceptedBy = req.user.id;
        // Keep it pending until hospital verifies, but you could add a "responded" status if desired
        await request.save();

        res.json({ message: 'Request accepted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
