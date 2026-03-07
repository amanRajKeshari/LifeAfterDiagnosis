'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, Activity, MapPin, LogOut } from 'lucide-react';
import dynamic from 'next/dynamic';

// Map functionality has been migrated elsewhere

export default function PatientDashboard() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [activeRequest] = useState({
        _id: 'req123',
        patientName: 'Emma Watson',
        bloodGroup: 'B-',
        donationType: 'Platelets',
        status: 'approved',
        hospitalName: 'Mercy Gen Hospital',
        city: 'New York',
        createdAt: new Date().toISOString()
    });

    const handleLogout = () => {
        localStorage.removeItem('patientToken');
        router.push('/patient/login');
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-white pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-6xl">

                <header className="mb-12 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Patient Dashboard</h1>
                        <p className="text-white/50">Tracking your real-time blood request status</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-white/5 border border-white/20 text-white/60 hover:text-[#FF2E63] hover:bg-white/10 hover:border-[#FF2E63]/30 transition-all px-4 py-2 font-bold rounded-xl text-sm"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </header>

                <div className="max-w-xl mx-auto space-y-6">

                    {/* Status Panel */}
                    <div className="bg-[#111116] border border-[#FF2E63]/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(255,46,99,0.15)]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2E63]/10 rounded-full blur-[50px] pointer-events-none" />

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-[#FF2E63]/20 flex items-center justify-center rounded-full border border-[#FF2E63]/50">
                                <span className="text-2xl font-bold text-[#FF2E63]">{activeRequest.bloodGroup}</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{activeRequest.patientName}</h2>
                                <span className="text-xs font-mono text-white/50 px-2 py-1 bg-white/5 rounded mt-1 inline-block">ID: {activeRequest._id}</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="mt-1"><CheckCircle2 className="text-[#08D9D6]" size={20} /></div>
                                <div>
                                    <div className="font-bold text-lg text-white">Request Approved</div>
                                    <div className="text-white/50 text-sm">Verified by {activeRequest.hospitalName}</div>
                                </div>
                            </div>
                            <div className="w-[2px] h-8 bg-gradient-to-b from-[#08D9D6] to-[#FF2E63] ml-2.5 my-2" />
                            <div className="flex items-start gap-4">
                                <div className="mt-1"><Activity className="text-[#FF2E63] animate-pulse" size={20} /></div>
                                <div>
                                    <div className="font-bold text-lg text-[#FF2E63]">AI Matching Active</div>
                                    <div className="text-white/50 text-sm">Scanning nearby donors for {activeRequest.donationType}</div>
                                </div>
                            </div>
                            <div className="w-[2px] h-8 bg-white/10 ml-2.5 my-2" />
                            <div className="flex items-start gap-4 opacity-50">
                                <div className="mt-1"><Clock size={20} /></div>
                                <div>
                                    <div className="font-bold text-lg">Donor Accepted</div>
                                    <div className="text-sm">Awaiting donor confirmation</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><MapPin size={18} className="text-[#08D9D6]" /> Request Location</h3>
                        <p className="text-sm text-white/70 mb-1">{activeRequest.hospitalName}</p>
                        <p className="text-sm text-white/50">{activeRequest.city}</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
