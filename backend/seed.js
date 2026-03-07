require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Hospital = require('./models/Hospital');
const Donor = require('./models/Donor');
const DonationRequest = require('./models/DonationRequest');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/life-after-diagnosis');
        console.log("Connected to MongoDB for Seeding...");

        // Clear existing data
        await Hospital.deleteMany();
        await Donor.deleteMany();
        await DonationRequest.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // 1. Seed Hospital
        const hospital = new Hospital({
            name: "Central Hospital",
            email: "admin@centralhospital.com",
            password: hashedPassword,
            phone: "+1 555-0100",
            city: "New York",
            address: "123 Health Ave, NY",
            licenseNumber: "LIC12345678",
            location: { type: 'Point', coordinates: [-73.935242, 40.730610] } // NYC coordinates
        });
        await hospital.save();
        console.log("-> Seeded Hospital");

        // 2. Seed Donors (Scattered around NYC)
        const donorsToInsert = [
            { name: "John Doe", email: "john@example.com", bloodGroup: "O+", donationTypes: ["Whole Blood"], isAvailable: true, lat: 40.7128, lng: -74.0060 },
            { name: "Sarah Smith", email: "sarah@example.com", bloodGroup: "A-", donationTypes: ["Platelets"], isAvailable: true, lat: 40.7589, lng: -73.9851 },
            { name: "Mike Johnson", email: "mike@example.com", bloodGroup: "B+", donationTypes: ["Whole Blood", "Plasma"], isAvailable: false, lat: 40.7829, lng: -73.9654 },
            { name: "Emily Chen", email: "emily@example.com", bloodGroup: "AB+", donationTypes: ["Platelets"], isAvailable: true, lat: 40.6782, lng: -73.9442 },
            { name: "Alex Hero", email: "alex@example.com", bloodGroup: "O-", donationTypes: ["Whole Blood"], isAvailable: true, lat: 40.7282, lng: -73.9942 }
        ];

        const savedDonors = [];
        for (const data of donorsToInsert) {
            const donor = new Donor({
                name: data.name, email: data.email, password: hashedPassword, phone: "+1 555-0200",
                age: 30, bloodGroup: data.bloodGroup, donationTypes: data.donationTypes, city: "New York",
                isAvailable: data.isAvailable, totalDonations: Math.floor(Math.random() * 5),
                location: { type: 'Point', coordinates: [data.lng, data.lat] }
            });
            await donor.save();
            savedDonors.push(donor);
        }
        console.log(`-> Seeded ${savedDonors.length} Donors`);

        // 3. Seed Requests
        const requests = [
            {
                patientName: "Alice Walker", disease: "Leukemia", bloodGroup: "O+", donationType: "Platelets",
                urgency: "Critical", status: "pending", contactNumber: "+1 555-0301",
                hospitalId: hospital._id, hospitalName: hospital.name, city: "New York"
            },
            {
                patientName: "Bob Singer", disease: "Accident Trauma", bloodGroup: "A-", donationType: "Whole Blood",
                urgency: "High", status: "approved", contactNumber: "+1 555-0302",
                hospitalId: hospital._id, hospitalName: hospital.name, city: "New York"
            },
            {
                patientName: "Charlie Brown", disease: "Anemia", bloodGroup: "B+", donationType: "Red Cells",
                urgency: "Medium", status: "completed", contactNumber: "+1 555-0303",
                hospitalId: hospital._id, hospitalName: hospital.name, city: "New York",
                acceptedBy: savedDonors[2]._id // Mike Johnson
            }
        ];
        
        await DonationRequest.insertMany(requests);
        console.log("-> Seeded Requests");

        console.log("Database Seeded Successfully!");
        process.exit();

    } catch (err) {
        console.error("Seeding Failed: ", err);
        process.exit(1);
    }
};

seedData();
