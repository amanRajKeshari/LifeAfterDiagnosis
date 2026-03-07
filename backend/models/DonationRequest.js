const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    disease: { type: String, required: true },
    bloodGroup: { 
        type: String, 
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true 
    },
    donationType: { 
        type: String, 
        enum: ['Whole Blood', 'Platelets', 'Plasma', 'Red Cells'],
        required: true 
    },
    urgency: { 
        type: String, 
        enum: ['Low', 'Medium', 'High', 'Critical'],
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    contactNumber: { type: String, required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    hospitalName: { type: String, required: true },
    city: { type: String, required: true },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', default: null },
    rejectionReason: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('DonationRequest', requestSchema);
