'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestAPI, createPoller } from '@/services/api';
import type { DonationRequest } from '@/services/api';
import dynamic from 'next/dynamic';
import { MapPin, Phone, Heart, Activity } from 'lucide-react';

// Use dynamic import to prevent SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/dom/MapComponent'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#0A0A0F] flex items-center justify-center border-l border-white/10"><div className="w-8 h-8 rounded-full border-2 border-[#FF2E63] border-t-transparent animate-spin" /></div>
});

export default function MapPage() {
    const [requests, setRequests] = useState<DonationRequest[]>([]);
    const [selectedReq, setSelectedReq] = useState<DonationRequest | null>(null);
    const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Get user location conditionally
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
                () => console.log('Location rejected')
            );
        }

        const cleanup = createPoller(fetchApprovedRequests, 30000);
        return cleanup;
    }, []);

    const fetchApprovedRequests = async () => {
        try {
            const data = await requestAPI.getApproved();
            if (data && data.length > 0) setRequests(data);
            else throw new Error("No real data");
        } catch (e) {
            // Mock Data 
            setRequests([
                { _id: '1', patientName: 'Emma Watson', bloodGroup: 'B-', donationType: 'Platelets', urgency: 'Critical', status: 'approved', hospitalName: 'Mercy Gen', city: 'NYC', contactNumber: '555-0100', createdAt: new Date().toISOString() } as any,
                { _id: '2', patientName: 'James Holden', bloodGroup: 'O-', donationType: 'Whole Blood', urgency: 'High', status: 'approved', hospitalName: 'Central Point', city: 'NYC', contactNumber: '555-0199', createdAt: new Date().toISOString() } as any,
                { _id: '3', patientName: 'Naomi Nagata', bloodGroup: 'AB+', donationType: 'Plasma', urgency: 'Medium', status: 'approved', hospitalName: 'St. Judes', city: 'NYC', contactNumber: '555-0188', createdAt: new Date().toISOString() } as any,
            ]);
        }
    };

    if (!mounted) return null;

    return (
        <div className="flex h-screen bg-[#0A0A0F] text-white pt-20 overflow-hidden">

            {/* Sidebar Panel */}
            <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full md:w-[360px] h-full flex flex-col bg-[#111116] border-r border-white/5 z-20 absolute md:static shrink-0"
            >
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF2E63] animate-pulse" />
                        <h2 className="text-xl font-bold tracking-tight">Live Requests</h2>
                    </div>
                    <p className="text-white/50 text-sm">
                        <span className="text-white font-bold">{requests.length}</span> active patients waiting for donors
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {requests.map(req => (
                        <button
                            key={req._id}
                            onClick={() => setSelectedReq(req)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${selectedReq?._id === req._id ? 'bg-[#FF2E63]/10 border-[#FF2E63] shadow-[0_0_15px_rgba(255,46,99,0.2)]' : 'bg-black/40 border-white/10 hover:border-white/30'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{req.patientName}</h3>
                                    <span className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20 uppercase font-medium">{req.donationType}</span>
                                </div>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold font-mono text-sm border ${req.urgency === 'Critical' ? 'bg-[#FF2E63]/20 text-[#FF2E63] border-[#FF2E63]/50' : 'bg-[#08D9D6]/20 border-[#08D9D6]/50 text-[#08D9D6]'}`}>
                                    {req.bloodGroup}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 text-xs text-white/50">
                                <MapPin size={12} />
                                <span className="truncate">{req.hospitalName}, {req.city}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </motion.aside>

            {/* Map Content */}
            <main className="flex-1 relative h-full bg-[#0A0A0F]">
                <MapComponent
                    requests={requests}
                    selectedId={selectedReq?._id || null}
                    onSelect={setSelectedReq}
                    userLocation={userLoc}
                />

                {/* Bottom Overlay Card */}
                <AnimatePresence>
                    {selectedReq && (
                        <motion.div
                            initial={{ y: 150, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 150, opacity: 0 }}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-[380px] md:bottom-10 z-[1000] w-[90%] md:w-[450px]"
                        >
                            <div className="bg-[#111116]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                                {selectedReq.urgency === 'Critical' && (
                                    <div className="absolute top-0 left-0 w-full h-1 bg-[#FF2E63] shadow-[0_0_15px_rgba(255,46,99,1)]" />
                                )}
                                <button
                                    onClick={() => setSelectedReq(null)}
                                    className="absolute top-4 right-4 text-white/40 hover:text-white"
                                >
                                    ✕
                                </button>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-xl border border-white/20">
                                        {selectedReq.bloodGroup}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedReq.patientName}</h3>
                                        <p className="text-[#08D9D6] text-sm font-medium">{selectedReq.donationType} needed</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6 text-sm text-white/70 bg-black/40 p-3 rounded-lg border border-white/5">
                                    <div className="flex justify-between">
                                        <span className="text-white/40">Hospital:</span>
                                        <span className="font-medium text-white">{selectedReq.hospitalName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/40">Urgency:</span>
                                        <span className={`font-medium ${selectedReq.urgency === 'Critical' ? 'text-[#FF2E63]' : 'text-white'}`}>{selectedReq.urgency}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <a
                                        href={`tel:${selectedReq.contactNumber}`}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/20 rounded-xl hover:bg-white/5 transition-colors font-bold text-sm"
                                    >
                                        <Phone size={16} /> Call Hospital
                                    </a>
                                    <button className="flex-[2] flex items-center justify-center gap-2 py-3 bg-[#FF2E63] hover:bg-[#ff1a53] text-white rounded-xl shadow-[0_0_20px_rgba(255,46,99,0.3)] font-bold text-sm transition-colors">
                                        <Heart size={16} /> I Can Help
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

        </div>
    );
}
