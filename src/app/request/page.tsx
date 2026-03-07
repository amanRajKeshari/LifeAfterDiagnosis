'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { requestAPI, hospitalAPI } from '@/services/api';
import type { BloodGroup, DonationType, UrgencyLevel, Hospital } from '@/services/api';

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DONATION_TYPES: DonationType[] = ["Whole Blood", "Platelets", "Plasma", "Red Cells"];
const URGENCY_LEVELS: UrgencyLevel[] = ["Low", "Medium", "High", "Critical"];

export default function PatientRequestForm() {
    const [mounted, setMounted] = useState(false);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        patientName: '',
        disease: '',
        bloodGroup: '' as BloodGroup,
        donationType: '' as DonationType,
        hospitalId: '',
        urgency: '' as UrgencyLevel,
        contactNumber: '',
        city: ''
    });

    useEffect(() => {
        setMounted(true);
        // Fetch hospitals for dropdown
        hospitalAPI.getAll().then(setHospitals).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');
        setErrorMsg('');

        try {
            const hospitalObj = hospitals.find(h => h._id === formData.hospitalId);
            if (!hospitalObj) throw new Error("Please select a valid hospital");
            // Since city isn't explicitly requested but required by API, use hospital's city
            const submitData = {
                ...formData,
                hospitalName: hospitalObj.name,
                city: hospitalObj.city,
            };

            await requestAPI.submit(submitData);
            setStatus('success');
            setFormData({
                patientName: '', disease: '', bloodGroup: '' as BloodGroup,
                donationType: '' as DonationType, hospitalId: '',
                urgency: '' as UrgencyLevel, contactNumber: '', city: ''
            });
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err?.response?.data?.message || err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="relative min-h-screen bg-[#0A0A0F] text-white overflow-hidden py-24 flex items-center justify-center">
            {/* Floating Particle Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {[...Array(40)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-[#FF2E63]/20"
                        style={{
                            width: Math.random() * 4 + 2 + 'px',
                            height: Math.random() * 4 + 2 + 'px',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="relative z-10 w-full max-w-2xl px-6"
                initial="hidden" animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">Request <span className="text-[#FF2E63]">Support</span></h1>
                    <p className="text-white/60 mb-10 text-lg">Submit a patient blood request. Our network will match you with nearby donors instantly.</p>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl focus-within:shadow-[0_0_30px_rgba(255,46,99,0.15)] transition-shadow duration-500"
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                >
                    {status === 'success' && (
                        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500 text-green-400 font-medium">
                            Request submitted successfully! We are routing it to nearby donors.
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-400 font-medium">
                            {errorMsg}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Patient Name</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] focus:ring-1 focus:ring-[#FF2E63] transition-colors"
                                value={formData.patientName}
                                onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Disease / Condition</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] focus:ring-1 focus:ring-[#FF2E63] transition-colors"
                                value={formData.disease}
                                onChange={e => setFormData({ ...formData, disease: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Blood Group</label>
                            <select
                                required
                                className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] focus:ring-1 focus:ring-[#FF2E63] transition-colors appearance-none"
                                value={formData.bloodGroup}
                                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                            >
                                <option value="" disabled>Select Blood Group</option>
                                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Donation Type</label>
                            <select
                                required
                                className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] focus:ring-1 focus:ring-[#FF2E63] transition-colors appearance-none"
                                value={formData.donationType}
                                onChange={e => setFormData({ ...formData, donationType: e.target.value as DonationType })}
                            >
                                <option value="" disabled>Select Type</option>
                                {DONATION_TYPES.map(dt => <option key={dt} value={dt}>{dt}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Hospital</label>
                            <select
                                required
                                className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] focus:ring-1 focus:ring-[#FF2E63] transition-colors appearance-none"
                                value={formData.hospitalId}
                                onChange={e => setFormData({ ...formData, hospitalId: e.target.value })}
                            >
                                <option value="" disabled>Select Hospital</option>
                                {hospitals.map(h => <option key={h._id} value={h._id}>{h.name} ({h.city})</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Contact Number</label>
                            <input
                                required
                                type="tel"
                                className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] focus:ring-1 focus:ring-[#FF2E63] transition-colors"
                                value={formData.contactNumber}
                                onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="text-sm font-medium text-white/80 block mb-4">Urgency Level</label>
                        <div className="flex flex-wrap gap-4">
                            {URGENCY_LEVELS.map(level => {
                                const isSelected = formData.urgency === level;
                                const isCritical = level === 'Critical';
                                return (
                                    <label
                                        key={level}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all duration-300 ${isSelected
                                                ? isCritical ? 'bg-[#FF2E63]/20 border-[#FF2E63] text-[#FF2E63] shadow-[0_0_15px_rgba(255,46,99,0.5)]' : 'bg-white/20 border-white text-white'
                                                : 'bg-black/40 border-white/20 text-white/60 hover:border-white/40'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="urgency"
                                            value={level}
                                            checked={isSelected}
                                            onChange={() => setFormData({ ...formData, urgency: level })}
                                            className="hidden"
                                        />
                                        {isCritical && isSelected && (
                                            <span className="w-2 h-2 rounded-full bg-[#FF2E63] animate-pulse" />
                                        )}
                                        {level}
                                    </label>
                                )
                            })}
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-4 rounded-xl bg-[#FF2E63] hover:bg-[#ff1a53] text-white font-bold tracking-wide transition-all interactive shadow-[0_0_30px_rgba(255,46,99,0.3)] hover:shadow-[0_0_40px_rgba(255,46,99,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </motion.form>
            </motion.div>
        </div>
    );
}
