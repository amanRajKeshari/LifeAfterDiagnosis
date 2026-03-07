const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Hospital = require('../models/Hospital');
const Donor = require('../models/Donor');
const Patient = require('../models/Patient');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
};

// HOSPITAL REGISTER
router.post('/hospital/register', async (req, res) => {
    try {
        const { name, email, password, phone, city, address, licenseNumber, location } = req.body;
        
        let hospital = await Hospital.findOne({ email });
        if (hospital) return res.status(400).json({ message: 'Hospital already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        hospital = new Hospital({
            name, email, password: hashedPassword, phone, city, address, licenseNumber,
            location: location || { type: 'Point', coordinates: [0,0] } // Default fallback
        });

        await hospital.save();
        const token = generateToken(hospital._id, 'hospital');
        
        res.status(201).json({ token, hospital: { id: hospital._id, name: hospital.name, email: hospital.email }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// HOSPITAL LOGIN
router.post('/hospital/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const hospital = await Hospital.findOne({ email });
        if (!hospital) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, hospital.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(hospital._id, 'hospital');
        res.json({ token, hospital: { id: hospital._id, name: hospital.name, email: hospital.email }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DONOR REGISTER
router.post('/donor/register', async (req, res) => {
    try {
        const { name, email, password, phone, age, bloodGroup, donationTypes, city, lat, lng } = req.body;
        
        let donor = await Donor.findOne({ email });
        if (donor) return res.status(400).json({ message: 'Donor already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        donor = new Donor({
            name, email, password: hashedPassword, phone, age, bloodGroup, donationTypes, city,
            location: { type: 'Point', coordinates: [lng || 0, lat || 0] }
        });

        await donor.save();
        const token = generateToken(donor._id, 'donor');
        
        res.status(201).json({ token, donor: { id: donor._id, name: donor.name, email: donor.email }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DONOR LOGIN
router.post('/donor/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const donor = await Donor.findOne({ email });
        if (!donor) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, donor.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(donor._id, 'donor');
        res.json({ token, donor: { id: donor._id, name: donor.name, email: donor.email }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATIENT REGISTER
router.post('/patient/register', async (req, res) => {
    try {
        const { name, email, password, phone, city } = req.body;
        
        let patient = await Patient.findOne({ email });
        if (patient) return res.status(400).json({ message: 'Patient already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        patient = new Patient({
            name, email, password: hashedPassword, phone, city
        });

        await patient.save();
        const token = generateToken(patient._id, 'patient');
        
        res.status(201).json({ token, patient: { id: patient._id, name: patient.name, email: patient.email }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATIENT LOGIN
router.post('/patient/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const patient = await Patient.findOne({ email });
        if (!patient) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(patient._id, 'patient');
        res.json({ token, patient: { id: patient._id, name: patient.name, email: patient.email }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
