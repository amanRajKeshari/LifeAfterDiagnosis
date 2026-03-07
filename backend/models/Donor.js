const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    bloodGroup: { 
        type: String, 
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true 
    },
    donationTypes: [{ 
        type: String, 
        enum: ['Whole Blood', 'Platelets', 'Plasma', 'Red Cells'] 
    }],
    city: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    lastDonationDate: { type: Date, default: null },
    totalDonations: { type: Number, default: 0 },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [lng, lat]
    }
}, { timestamps: true });

donorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Donor', donorSchema);
