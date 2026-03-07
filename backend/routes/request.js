const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const DonationRequest = require('../models/DonationRequest');

// CREATE NEW REQUEST (Usually open for patients, could be unprotected for now)
router.post('/', async (req, res) => {
    try {
        const newRequest = new DonationRequest(req.body);
        const request = await newRequest.save();
        res.status(201).json({ message: 'Request submitted successfully', request });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET REQUESTS BY STATUS (Hospital only)
router.get('/:status', auth, async (req, res, next) => {
    try {
        // Prevent collision with specific routes
        if (!['pending', 'approved', 'rejected', 'completed'].includes(req.params.status)) {
            return next();
        }

        if (req.user.role !== 'hospital') return res.status(403).json({ message: 'Access denied' });

        const requests = await DonationRequest.find({ 
            hospitalId: req.user.id, 
            status: req.params.status 
        }).sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// APPROVE REQUEST
router.put('/:id/approve', auth, async (req, res) => {
    try {
        if (req.user.role !== 'hospital') return res.status(403).json({ message: 'Access denied' });

        const request = await DonationRequest.findOneAndUpdate(
            { _id: req.params.id, hospitalId: req.user.id },
            { status: 'approved' },
            { new: true }
        );

        if (!request) return res.status(404).json({ message: 'Request not found or unauthorized' });

        res.json({ message: 'Request approved', request });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// REJECT REQUEST
router.put('/:id/reject', auth, async (req, res) => {
    try {
        if (req.user.role !== 'hospital') return res.status(403).json({ message: 'Access denied' });

        const request = await DonationRequest.findOneAndUpdate(
            { _id: req.params.id, hospitalId: req.user.id },
            { status: 'rejected', rejectionReason: req.body.reason || '' },
            { new: true }
        );

        if (!request) return res.status(404).json({ message: 'Request not found or unauthorized' });

        res.json({ message: 'Request rejected', request });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// COMPLETE REQUEST
router.put('/:id/complete', auth, async (req, res) => {
    try {
        if (req.user.role !== 'hospital') return res.status(403).json({ message: 'Access denied' });

        const request = await DonationRequest.findOneAndUpdate(
            { _id: req.params.id, hospitalId: req.user.id },
            { status: 'completed' },
            { new: true }
        );

        if (!request) return res.status(404).json({ message: 'Request not found or unauthorized' });

        res.json({ message: 'Request completed', request });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
