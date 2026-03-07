'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '@/services/api';
import { Building2, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HospitalRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        name: '', email: '', password: '',
        phone: '', city: '', address: '', licenseNumber: ''
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            // Mock backend save delay if real API is missing
            await new Promise(r => setTimeout(r, 1000));
            // Simulate auto-login on register
            localStorage.setItem("hospitalToken", "dummy-hospital-token");
            localStorage.setItem("hospitalName", formData.name);
            router.push('/hospital/dashboard');
        } catch (err: any) {
            setErrorMsg("Registration failed");
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0A0A0F] text-white overflow-hidden py-24 flex items-center justify-center">
            {/* Floating Particle Background */}
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#FF2E63]/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-2xl px-6">
                <div className="mb-10 w-full text-center">
                    <div className="w-16 h-16 bg-[#FF2E63]/20 text-[#FF2E63] flex items-center justify-center rounded-2xl border border-[#FF2E63]/50 mb-4 mx-auto shadow-[0_0_20px_rgba(255,46,99,0.3)]">
                        <Building2 size={32} />
                    </div>
                    <div className="flex justify-center items-center mb-4">
                        <h1 className="text-3xl font-bold">Register Hospital</h1>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden relative min-h-[500px]">

                    {errorMsg && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-400 font-medium text-center">
                            {errorMsg}
                        </div>
                    )}

                    <form
                        className="space-y-6"
                        onSubmit={handleRegister}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Hospital Name</label>
                                <input required type="text" className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] transition-colors" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Memorial General" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Institutional Email</label>
                                <input required type="email" className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] transition-colors" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="admin@hospital.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Password</label>
                                <input required type="password" minLength={6} className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] transition-colors" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">License Number</label>
                                <input required type="text" className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] transition-colors" value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })} placeholder="HL-12345678" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">City</label>
                                <input required type="text" className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] transition-colors" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="New York" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Phone</label>
                                <input required type="tel" className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] transition-colors" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Full Address</label>
                            <input required type="text" className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] transition-colors" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="123 Health Ave, Medical District" />
                        </div>

                        <div className="pt-6">
                            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-white text-black font-bold tracking-wide transition-all interactive hover:bg-gray-200 disabled:opacity-50">
                                {loading ? 'Creating Dashboard...' : 'Create Hospital Dashboard'}
                            </button>
                            <div className="text-center mt-4">
                                <span className="text-white/50 text-sm">Already registered? </span>
                                <Link href="/hospital/login" className="text-[#FF2E63] text-sm hover:underline">Log in</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
