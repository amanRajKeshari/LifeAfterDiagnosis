'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '@/services/api';
import type { BloodGroup, DonationType } from '@/services/api';
import { MapPin, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DONATION_TYPES: DonationType[] = ["Whole Blood", "Platelets", "Plasma", "Red Cells"];

export default function DonorRegister() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', age: '',
        bloodGroup: '' as BloodGroup, city: '',
        donationTypes: [] as DonationType[],
        isAvailable: true,
        lat: 0, lng: 0
    });

    const toggleDonationType = (type: DonationType) => {
        setFormData(prev => ({
            ...prev,
            donationTypes: prev.donationTypes.includes(type)
                ? prev.donationTypes.filter(t => t !== type)
                : [...prev.donationTypes, type]
        }));
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => setFormData(prev => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude })),
                err => console.error("Location error", err)
            );
        }
    };

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            // Mock registration save
            await new Promise(r => setTimeout(r, 1500));

            // Set dummy fallback tokens
            localStorage.setItem("donorName", formData.name);
            localStorage.setItem("donorToken", "dummy-donor-token");

            setIsSuccess(true);
            setTimeout(() => {
                router.push('/donor/dashboard');
            }, 3000);
        } catch (err: any) {
            setErrorMsg(err?.response?.data?.message || err.message || "Registration failed");
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0F] text-white">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, mass: 0.75 }}
                    className="w-32 h-32 bg-[#FF2E63]/20 rounded-full flex items-center justify-center border border-[#FF2E63] shadow-[0_0_80px_rgba(255,46,99,0.5)] mb-8"
                >
                    <PartyPopper size={64} className="text-[#FF2E63]" />
                </motion.div>
                <h1 className="text-4xl font-bold mb-4">You're Registered!</h1>
                <p className="text-white/60">Redirecting to your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#0A0A0F] text-white overflow-hidden py-24 flex items-center justify-center">
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#FF2E63]/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-2xl px-6">
                {/* Progress Header */}
                <div className="mb-10 w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold">Become a Donor</h1>
                        <span className="text-[#FF2E63] font-bold">Step {step} / 2</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-[#FF2E63]"
                            initial={{ width: "50%" }}
                            animate={{ width: step === 1 ? "50%" : "100%" }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                <form onSubmit={step < 3 ? handleNext : handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden relative min-h-[500px]">

                    {errorMsg && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-400 font-medium">
                            {errorMsg}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/80">Full Name</label>
                                        <input required type="text" className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] transition-colors" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/80">Email</label>
                                        <input required type="email" className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] transition-colors" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/80">Password</label>
                                        <input required type="password" minLength={6} className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] transition-colors" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/80">Age</label>
                                            <input required type="number" min={18} max={65} className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] transition-colors" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/80">Phone</label>
                                            <input required type="tel" className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] transition-colors" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">City</label>
                                    <input required type="text" className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] transition-colors" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-white/80 block">Blood Group</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {BLOOD_GROUPS.map(bg => (
                                            <button
                                                key={bg}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                                                className={`py-3 rounded-lg border text-center font-bold tracking-wider transition-all ${formData.bloodGroup === bg ? 'bg-[#FF2E63]/20 border-[#FF2E63] text-[#FF2E63] shadow-[0_0_15px_rgba(255,46,99,0.3)]' : 'bg-black/40 border-white/20 text-white/60 hover:border-white/40'}`}
                                            >
                                                {bg}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" disabled={!formData.bloodGroup} className="w-full py-4 rounded-xl bg-white text-black font-bold tracking-wide transition-all interactive hover:bg-gray-200 disabled:opacity-50">
                                        Next Step
                                    </button>
                                    <div className="text-center mt-4">
                                        <span className="text-white/50 text-sm">Already a donor? </span>
                                        <Link href="/donor/login" className="text-[#FF2E63] text-sm hover:underline">Log in</Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-white/80 block">Donation Preferences (Select all that apply)</label>
                                    <div className="flex flex-wrap gap-4">
                                        {DONATION_TYPES.map(type => {
                                            const selected = formData.donationTypes.includes(type);
                                            return (
                                                <button
                                                    type="button"
                                                    key={type}
                                                    onClick={() => toggleDonationType(type)}
                                                    className={`px-6 py-3 rounded-full border transition-all ${selected ? 'bg-[#FF2E63] border-[#FF2E63] text-white shadow-[0_0_15px_rgba(255,46,99,0.4)]' : 'bg-black/40 border-white/20 text-white/60 hover:border-white/40'}`}
                                                >
                                                    {type}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-white/80 block">Location Setup</label>
                                    <button
                                        type="button"
                                        onClick={getUserLocation}
                                        className="flex items-center gap-3 w-full p-4 rounded-xl border border-white/20 bg-black/40 text-white/80 hover:bg-white/5 transition-colors"
                                    >
                                        <MapPin className="text-[#08D9D6]" />
                                        <span>{formData.lat !== 0 ? `Location Captured: ${formData.lat.toFixed(4)}, ${formData.lng.toFixed(4)}` : 'Use My Location (Required for AI Matching)'}</span>
                                    </button>
                                </div>

                                <div className="space-y-4 flex justify-between items-center p-6 rounded-xl border border-[#08D9D6]/30 bg-[#08D9D6]/5">
                                    <div>
                                        <div className="font-bold text-lg mb-1">Availability Status</div>
                                        <div className="text-white/60 text-sm">Puts you on the active network to receive alerts.</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                                        className={`w-16 h-8 rounded-full flex items-center p-1 transition-colors ${formData.isAvailable ? 'bg-[#08D9D6]' : 'bg-white/20'}`}
                                    >
                                        <motion.div
                                            className="w-6 h-6 rounded-full bg-white shadow-sm"
                                            animate={{ x: formData.isAvailable ? 32 : 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    </button>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button type="button" onClick={() => setStep(1)} className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/5 transition-colors text-white font-bold">
                                        Back
                                    </button>
                                    <button type="submit" disabled={loading || formData.donationTypes.length === 0} className="flex-1 py-4 rounded-xl bg-[#FF2E63] hover:bg-[#ff1a53] text-white font-bold tracking-wide transition-all interactive shadow-[0_0_30px_rgba(255,46,99,0.3)] disabled:opacity-50">
                                        {loading ? 'Registering...' : 'Complete Registration'}
                                    </button>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
}
