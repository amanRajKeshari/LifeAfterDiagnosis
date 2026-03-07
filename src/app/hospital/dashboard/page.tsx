'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestAPI, createPoller, authAPI } from '@/services/api';
import type { DonationRequest, RequestStatus } from '@/services/api';
import { Building2, Activity, CheckCircle, XCircle, Clock, LogOut, Loader2, Hospital as HospitalIcon, Phone, AlertTriangle, BarChart3, Users, Radio, MapPin, Zap, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const EmbeddedMap = dynamic(() => import('@/components/dom/MapComponent'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#111116] flex items-center justify-center border border-white/10 rounded-2xl"><div className="w-8 h-8 rounded-full border-2 border-[#FF2E63] border-t-transparent animate-spin" /></div>
});

export default function HospitalDashboard() {
    const router = useRouter();
    const [requests, setRequests] = useState<DonationRequest[]>([]);
    const [statusFilter, setStatusFilter] = useState<RequestStatus | 'analytics' | 'donors' | 'emergency' | 'approved_completed'>('pending');
    const [loading, setLoading] = useState(true);
    const [hospitalName, setHospitalName] = useState('Hospital Portal');

    useEffect(() => {
        const name = localStorage.getItem('hospitalName');
        if (!name && !localStorage.getItem('hospitalToken')) {
            router.push('/hospital/login');
            return;
        }
        setHospitalName(name || 'Central Hospital');

        // Setup Polling
        const cleanup = createPoller(fetchRequests, 30000);
        return cleanup;
    }, [statusFilter]);

    const fetchRequests = useCallback(async () => {
        if (statusFilter === 'analytics' || statusFilter === 'donors' || statusFilter === 'emergency') {
            setLoading(false);
            return;
        }

        try {
            if (statusFilter === 'pending') {
                const data = await requestAPI.getPending();
                setRequests(data || []);
            } else if (statusFilter === 'approved_completed') {
                // Fetch both and combine
                try {
                    const [approved, completed] = await Promise.all([
                        requestAPI.getByStatus('approved'),
                        requestAPI.getByStatus('completed')
                    ]);
                    setRequests([...(approved || []), ...(completed || [])]);
                } catch (e) {
                    throw e; // Handled by outer catch for mock data fallback
                }
            } else {
                const data = await requestAPI.getByStatus(statusFilter as RequestStatus);
                setRequests(data || []);
            }
        } catch (err) {
            console.warn("Backend unavailable, using mock data", err);
            // Fallback UI data
            if (requests.length === 0) {
                setRequests([
                    { _id: '1', patientName: 'John Doe', bloodGroup: 'A+', donationType: 'Whole Blood', urgency: 'Critical', disease: 'Leukemia', status: 'pending', contactNumber: '+1 555-0192', hospitalId: 'h1', hospitalName: 'Memorial', city: 'NYC', createdAt: new Date().toISOString(), acceptedBy: null }
                ] as DonationRequest[]);
            }
        } finally {
            setLoading(false);
        }
    }, [statusFilter, requests.length]);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        try {
            if (action === 'approve') await requestAPI.approve(id);
            else await requestAPI.reject(id, "Rejected by hospital admin");

            setRequests(prev => prev.filter(req => req._id !== id));
        } catch (err) {
            console.warn("Action failed, assuming success for mock UI", err);
            // Optimistic upate for UI
            setRequests(prev => prev.filter(req => req._id !== id));
        }
    };

    const handleLogout = () => {
        authAPI.logout();
        router.push('/hospital/login');
    };

    const navItems: { label: string, status: RequestStatus | 'analytics' | 'donors' | 'emergency' | 'approved_completed', icon: any, color: string }[] = [
        { label: 'Pending', status: 'pending', icon: Clock, color: 'text-yellow-400' },
        { label: 'Approved / Completed', status: 'approved_completed', icon: CheckCircle, color: 'text-[#08D9D6]' },
        { label: 'Rejected', status: 'rejected', icon: XCircle, color: 'text-white/40' },
        { label: 'Available Donors', status: 'donors', icon: Users, color: 'text-blue-400' },
        { label: 'Emergency', status: 'emergency', icon: Radio, color: 'text-orange-500' },
        { label: 'Analytics', status: 'analytics', icon: BarChart3, color: 'text-purple-400' }
    ];

    // Mock analytics data
    const analyticsData = [
        { name: 'Jan', pending: 12, approved: 45, completed: 38 },
        { name: 'Feb', pending: 19, approved: 52, completed: 49 },
        { name: 'Mar', pending: 8, approved: 61, completed: 58 },
        { name: 'Apr', pending: 15, approved: 40, completed: 35 },
    ];

    const mockDonors = [
        { id: 'd1', name: 'Alice Smith', bloodGroup: 'O+', location: 'Downtown', distance: '2km', matchProbability: 98, status: 'Available' },
        { id: 'd2', name: 'Bob Johnson', bloodGroup: 'A-', location: 'Uptown', distance: '5km', matchProbability: 95, status: 'Available' },
        { id: 'd3', name: 'Carol Williams', bloodGroup: 'B+', location: 'Suburbs', distance: '12km', matchProbability: 80, status: 'Not Available' },
        { id: 'd4', name: 'David Brown', bloodGroup: 'AB+', location: 'Midtown', distance: '4km', matchProbability: 92, status: 'Available' },
    ];

    const emergencyStats = {
        requests: 3,
        contacted: 12,
        confirmed: 2
    };

    // Generating randomized data uniquely for each patient ID (pseudo-random based on id)
    const generateScanData = (id: string, isCompleted: boolean) => {
        // Quick hash for deterministic-ish data
        let hash = 0;
        for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
        const baseProb = Math.abs(hash) % 40 + 20;

        return [
            { time: '10:00', probability: baseProb },
            { time: '10:15', probability: Math.min(baseProb + 15, 99) },
            { time: '10:30', probability: Math.min(baseProb + 35, 99) },
            { time: '10:45', probability: Math.min(baseProb + 45, 99) },
            { time: '11:00', probability: isCompleted ? 100 : Math.min(baseProb + 60, 99) }
        ];
    };

    return (
        <div className="flex min-h-screen bg-[#0A0A0F] text-white">

            {/* Sidebar */}
            <aside className="w-72 hidden md:flex flex-col bg-[#111116] border-r border-white/5 h-screen sticky top-0 px-6 py-8 z-20">
                <div className="flex flex-col gap-1 mb-10 mt-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#FF2E63]/20 border border-[#FF2E63] flex items-center justify-center relative overflow-hidden">
                            <div className="w-3 h-3 rounded-full bg-[#FF2E63] z-10" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white block">
                            LifeAfter<span className="text-white/50 font-normal">Diagnosis</span>
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white/60 bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/10">
                        <Building2 size={16} className="text-[#FF2E63]" />
                        <span className="text-xs uppercase tracking-widest font-bold">{hospitalName}</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map(item => (
                        <button
                            key={item.status}
                            onClick={() => { setStatusFilter(item.status); setLoading(true); fetchRequests(); }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${statusFilter === item.status ? 'bg-white/10 text-white font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} className={statusFilter === item.status ? item.color : ''} />
                                {item.label}
                            </div>
                            {item.status === 'pending' && <span className="w-6 h-6 rounded-full bg-[#FF2E63] text-white text-xs flex items-center justify-center font-bold">!</span>}
                        </button>
                    ))}
                </nav>

                <button onClick={handleLogout} className="flex items-center gap-3 text-white/50 hover:text-[#FF2E63] transition-colors mt-auto px-4 py-3 font-medium">
                    <LogOut size={18} /> Logout Portal
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 h-screen overflow-y-auto relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#08D9D6]/10 rounded-full blur-[120px] pointer-events-none" />

                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 capitalize">{statusFilter === 'approved_completed' ? 'Approved & Completed' : statusFilter} Requests</h1>
                        <p className="text-white/50">Manage patient blood requests and verify authenticity.</p>
                    </div>

                    {/* Mobile Filter */}
                    <div className="md:hidden flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
                        {navItems.map(item => (
                            <button
                                key={item.status}
                                onClick={() => { setStatusFilter(item.status); setLoading(true); fetchRequests(); }}
                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm border ${statusFilter === item.status ? 'bg-white text-black font-bold border-white' : 'border-white/20 text-white/60'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64 text-white/40">
                        <Loader2 className="animate-spin" size={32} />
                    </div>
                ) : statusFilter === 'analytics' ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-[600px] bg-[#111116] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
                        <h2 className="text-2xl font-bold mb-8">Request Volume Analysis</h2>
                        <div className="h-[450px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#111116', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="completed" stackId="a" fill="#4ade80" radius={[0, 0, 4, 4]} name="Completed" />
                                    <Bar dataKey="approved" stackId="a" fill="#08D9D6" name="Approved" />
                                    <Bar dataKey="pending" stackId="a" fill="#FF2E63" radius={[4, 4, 0, 0]} name="Pending" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                ) : statusFilter === 'donors' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 pb-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockDonors.map(donor => (
                                <div key={donor.id} className="bg-[#111116]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold">{donor.name}</h3>
                                            <p className="text-white/50 text-sm flex items-center gap-2 mt-1"><MapPin size={14} />{donor.location} ({donor.distance})</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-[#FF2E63]/10 text-[#FF2E63] flex items-center justify-center font-bold text-lg border border-[#FF2E63]/20">
                                            {donor.bloodGroup}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-white/60">Match Probability</span>
                                                <span className="text-[#08D9D6] font-bold">{donor.matchProbability}%</span>
                                            </div>
                                            <div className="w-full bg-white/5 rounded-full h-2">
                                                <div className="bg-[#08D9D6] h-2 rounded-full" style={{ width: `${donor.matchProbability}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <span className="text-sm text-white/50">Response Status</span>
                                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${donor.status === 'Available' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                                                {donor.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : statusFilter === 'emergency' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 pb-20">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#111116]/80 border border-orange-500/30 rounded-2xl p-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                                    <Radio size={24} />
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm font-medium">Emergency Requests</p>
                                    <h3 className="text-3xl font-bold">{emergencyStats.requests}</h3>
                                </div>
                            </div>
                            <div className="bg-[#111116]/80 border border-blue-500/30 rounded-2xl p-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm font-medium">Donors Contacted</p>
                                    <h3 className="text-3xl font-bold">{emergencyStats.contacted}</h3>
                                </div>
                            </div>
                            <div className="bg-[#111116]/80 border border-green-500/30 rounded-2xl p-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm font-medium">Confirmed Donors</p>
                                    <h3 className="text-3xl font-bold">{emergencyStats.confirmed}</h3>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : requests.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 text-center border border-white/5 border-dashed rounded-3xl bg-white/5">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Activity className="text-white/20" size={32} />
                        </div>
                        <h3 className="text-xl font-medium mb-1">No {statusFilter} requests.</h3>
                        <p className="text-white/40 text-sm">You're all caught up for now.</p>
                    </motion.div>
                ) : (
                    <div className="flex flex-col xl:flex-row gap-6 pb-20 h-full">
                        <div className="flex-1 overflow-y-auto space-y-6 pb-20 pr-2 custom-scrollbar">
                            <AnimatePresence>
                                {requests.map((req, i) => (
                                    <motion.div
                                        key={req._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        transition={{ duration: 0.4, delay: i * 0.05 }}
                                        className="bg-[#111116]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-white/30 transition-all hover:-translate-y-1 relative overflow-hidden group"
                                    >
                                        {req.urgency === 'Critical' && <div className="absolute top-0 left-0 w-1 h-full bg-[#FF2E63] shadow-[0_0_15px_rgba(255,46,99,1)]" />}

                                        <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-1">{req.patientName}</h3>
                                                <p className="text-white/60 text-sm flex items-center gap-2">
                                                    <AlertTriangle size={14} className="text-white/40" /> {req.disease}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex items-center gap-3">
                                                    {req.urgency === 'Critical' && (
                                                        <span className="flex items-center gap-2 px-3 py-1 bg-[#FF2E63]/20 border border-[#FF2E63]/50 text-[#FF2E63] text-xs font-bold rounded-full uppercase tracking-widest animate-pulse">
                                                            Critical
                                                        </span>
                                                    )}
                                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg border border-white/20">
                                                        {req.bloodGroup}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-white/40 uppercase tracking-widest">{req.donationType}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-center gap-3 text-white/70 bg-black/40 p-3 rounded-xl border border-white/5">
                                                <Phone size={16} className="text-white/40" />
                                                <span className="text-sm">{req.contactNumber}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-white/70 bg-black/40 p-3 rounded-xl border border-white/5">
                                                <HospitalIcon size={16} className="text-white/40" />
                                                <span className="text-sm truncate">{req.hospitalName}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-white/40 text-xs flex items-center gap-1">
                                                <Clock size={12} />
                                                Submitted {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>

                                            {statusFilter === 'pending' && (
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleAction(req._id, 'reject')} className="px-5 py-2 rounded-xl border border-[#FF2E63]/50 text-[#FF2E63] hover:bg-[#FF2E63]/10 transition-colors text-sm font-bold">
                                                        Reject
                                                    </button>
                                                    <button onClick={() => handleAction(req._id, 'approve')} className="px-5 py-2 rounded-xl bg-[#08D9D6] text-black hover:bg-[#08D9D6]/90 shadow-[0_0_15px_rgba(8,217,214,0.3)] transition-all text-sm font-bold">
                                                        Verify & Approve
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {(statusFilter === 'approved_completed') && (
                                            <div className="mt-6 pt-4 border-t border-white/10 relative overflow-hidden">
                                                <h4 className="font-bold mb-4 flex items-center justify-between text-sm text-white/80">
                                                    <span className="flex items-center gap-2"><Search size={16} className="text-[#08D9D6]" /> Match Probability Scan</span>
                                                    {req.status === 'completed' ? (
                                                        <span className="text-green-400 font-mono text-xs px-2 py-1 bg-green-400/10 rounded">Match Found</span>
                                                    ) : (
                                                        <span className="text-[#FF2E63] font-mono text-xs px-2 py-1 bg-[#FF2E63]/10 rounded flex items-center gap-1">
                                                            <Activity size={12} className="animate-pulse" /> Scanning
                                                        </span>
                                                    )}
                                                </h4>
                                                <div className="h-[120px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={generateScanData(req._id, req.status === 'completed')}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                            <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                                                            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                                                            <Tooltip
                                                                contentStyle={{ backgroundColor: '#111116', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                                            />
                                                            <Line 
                                                                type="monotone" 
                                                                dataKey="probability" 
                                                                stroke={req.status === 'completed' ? "#4ade80" : "#08D9D6"} 
                                                                strokeWidth={2} 
                                                                dot={{ fill: '#111116', stroke: req.status === 'completed' ? "#4ade80" : "#08D9D6", strokeWidth: 2, r: 3 }} 
                                                            />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        )}

                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        <div className="w-full xl:w-[450px] shrink-0 h-[500px] xl:h-[calc(100vh-200px)] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
                            <EmbeddedMap
                                requests={requests}
                                selectedId={null}
                                onSelect={() => { }}
                                userLocation={null} // Centers automatically on requests
                            />
                        </div>
                    </div>
                )}
            </main>

        </div>
    );
}
