'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { donorAPI } from '@/services/api';
import type { Donor, MatchedDonor } from '@/services/api';
import { useRouter } from 'next/navigation';
import { Droplet, Users, CalendarDays, Bell, MapPin, CheckCircle, BarChart2, Zap, AlertTriangle, Hospital as HospitalIcon, LogOut } from 'lucide-react';
import dynamic from 'next/dynamic';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const EmbeddedMap = dynamic(() => import('@/components/dom/MapComponent'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#111116] flex items-center justify-center border border-white/10 rounded-2xl"><div className="w-8 h-8 rounded-full border-2 border-[#FF2E63] border-t-transparent animate-spin" /></div>
});

export default function DonorDashboard() {
    const router = useRouter();
    const [donor, setDonor] = useState<Donor | null>(null);
    const [requests, setRequests] = useState<MatchedDonor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAnalytics, setShowAnalytics] = useState(false);

    // Mock analytics data
    const impactData = [
        { month: 'Jan', lives: 0 },
        { month: 'Feb', lives: 0 },
        { month: 'Mar', lives: 3 },
        { month: 'Apr', lives: 3 },
        { month: 'May', lives: 6 },
        { month: 'Jun', lives: 9 }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const profile = await donorAPI.getProfile();
            setDonor(profile);

            // Fetch mocked/matched requests nearby
            if (profile.location?.coordinates.length === 2) {
                const matches = await donorAPI.getMatches({
                    bloodGroup: profile.bloodGroup,
                    donationType: profile.donationTypes[0],
                    lat: profile.location.coordinates[0],
                    lng: profile.location.coordinates[1],
                    city: profile.city
                });
                setRequests(matches.matches || []);
            }
        } catch (err) {
            console.warn("Backend unavailable, using mock data", err);
            // Fallback dummy data for visual testing since backend might not exist
            setDonor({
                _id: '1', name: localStorage.getItem('donorName') || 'Alex Donor', email: '', phone: '', age: 25,
                bloodGroup: 'O+', donationTypes: ['Whole Blood'], city: 'New York',
                isAvailable: true, lastDonationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                totalDonations: 4, location: { coordinates: [40, -73] }
            });
            setRequests([
                { _id: 'r1', name: 'Sarah Connor', bloodGroup: 'O+', donationTypes: ['Whole Blood'], email: '', phone: '', age: 40, city: 'New York', isAvailable: false, lastDonationDate: null, totalDonations: 0, location: { coordinates: [40, -73] }, matchScore: 99, matchPercent: 99.8, distanceKm: 2.4, breakdown: {} },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async () => {
        if (!donor) return;
        const nextState = !donor.isAvailable;
        setDonor({ ...donor, isAvailable: nextState });
        try {
            await donorAPI.setAvailability(nextState);
        } catch (err) {
            console.warn("Availability set failed, reverting...", err);
            setDonor({ ...donor, isAvailable: !nextState }); // Revert on failure
        }
    };

    const acceptRequest = async (id: string) => {
        try {
            await donorAPI.acceptRequest(id);
            setRequests(requests.filter(r => r._id !== id));
            alert("Request accepted! The hospital will contact you shortly.");
        } catch (err) {
            console.warn("Could not accept request via backend...", err);
            alert("Could not accept request.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('donorToken');
        localStorage.removeItem('donorName');
        router.push('/donor/login');
    };

    if (loading || !donor) {
        return (
            <div className="min-h-screen bg-[#0A0A0F] text-white flex justify-center items-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-[#FF2E63] border-t-transparent rounded-full" />
            </div>
        );
    }

    const daysSince = donor.lastDonationDate
        ? Math.floor((Date.now() - new Date(donor.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24))
        : 1000;

    const isEligible = daysSince >= 56;

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-white py-24 pb-32">
            <div className="container mx-auto px-6 max-w-6xl">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#FF2E63]/20 rounded-full blur-[100px]" />

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-20 h-20 rounded-2xl bg-[#FF2E63]/20 border border-[#FF2E63] flex items-center justify-center shadow-[0_0_30px_rgba(255,46,99,0.3)]">
                            <span className="text-3xl font-bold text-[#FF2E63]">{donor.bloodGroup}</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-1">Welcome back, {donor.name.split(' ')[0]}</h1>
                            <div className="text-white/60 flex items-center gap-2 text-sm uppercase tracking-widest">
                                <MapPin size={14} /> {donor.city} Hero
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center gap-3">
                        <button
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            className={`flex items-center gap-2 px-4 py-2 h-12 rounded-xl border transition-all text-sm font-bold ${showAnalytics ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-white/5 border-white/20 text-white/60 hover:text-white'}`}
                        >
                            <BarChart2 size={16} />
                            {showAnalytics ? 'Hide Impact' : 'View Impact Stats'}
                        </button>
                        <button
                            onClick={toggleAvailability}
                            className={`relative flex items-center gap-3 px-6 h-12 rounded-full border transition-all ${donor.isAvailable ? 'bg-[#08D9D6]/10 border-[#08D9D6] text-[#08D9D6] shadow-[0_0_20px_rgba(8,217,214,0.3)]' : 'bg-white/5 border-white/20 text-white/60'}`}
                        >
                            <div className={`w-3 h-3 rounded-full ${donor.isAvailable ? 'bg-[#08D9D6] animate-pulse' : 'bg-white/30'}`} />
                            <span className="font-bold">{donor.isAvailable ? "I'm Available" : "Not Available"}</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            title="Logout"
                            className="bg-white/5 border border-white/20 text-white/60 hover:text-[#FF2E63] hover:bg-white/10 hover:border-[#FF2E63]/30 transition-all flex items-center justify-center h-12 w-12 rounded-xl"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Donations', value: donor.totalDonations, icon: <Droplet className="text-[#08D9D6]" />, color: '#08D9D6' },
                        { label: 'Lives Impacted', value: donor.totalDonations * 3, icon: <Users className="text-[#FF2E63]" />, color: '#FF2E63' },
                        { label: 'Days Since Last', value: donor.lastDonationDate ? daysSince : 'N/A', icon: <CalendarDays className="text-yellow-400" />, color: isEligible ? '#4ade80' : '#FF2E63', extra: !isEligible ? 'Not Eligible Yet' : 'Eligible to Donate' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-white/60 font-medium">{stat.label}</span>
                                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="flex items-end gap-3">
                                <span className="text-5xl font-bold font-mono text-white" style={{ textShadow: `0 0 20px ${stat.color}40` }}>{stat.value}</span>
                                {stat.extra && <span className="text-sm pb-1 mb-1 font-medium" style={{ color: stat.color }}>{stat.extra}</span>}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {showAnalytics && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-12 bg-[#111116] border border-[#FF2E63]/20 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF2E63]/10 rounded-full blur-[100px] pointer-events-none" />
                        <h2 className="text-2xl font-bold mb-8">Your Lifesaving Journey</h2>
                        <div className="h-[350px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={impactData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorLives" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF2E63" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#FF2E63" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111116', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#FF2E63', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="lives" stroke="#FF2E63" strokeWidth={3} fillOpacity={1} fill="url(#colorLives)" name="Lives Impacted" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Emergency Alerts Section */}
                        <div className="bg-[#111116] border border-orange-500/30 rounded-3xl p-8 relative overflow-hidden mb-6 shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
                            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 relative z-10">
                                <Zap className="text-orange-500" /> Emergency Alerts
                            </h2>
                            
                            <div className="bg-gradient-to-br from-[#1A1A24] to-[#111116] border border-orange-500/40 rounded-xl p-6 shadow-2xl relative z-10 w-full animate-pulse-slow">
                                <div className="flex items-center gap-2 mb-4 text-orange-500">
                                    <AlertTriangle size={20} className="animate-pulse" />
                                    <span className="font-bold uppercase tracking-wider text-sm">Targeted Broadcast</span>
                                </div>
                                <h4 className="text-xl font-bold mb-2 text-white">Platelet Donation Needed</h4>
                                <div className="space-y-1 mb-6">
                                    <p className="text-white/70 text-sm flex items-center gap-2"><HospitalIcon size={16} /> Tata Memorial Hospital</p>
                                    <p className="text-white/70 text-sm flex items-center gap-2"><MapPin size={16} /> Distance: 5km away</p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="flex-1 py-3 bg-[#FF2E63] hover:bg-[#ff1a53] text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(255,46,99,0.3)]">
                                        Accept Request
                                    </button>
                                    <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-[#FF2E63] animate-pulse" />
                            Active Requests Nearby
                        </h2>

                        {requests.length === 0 ? (
                            <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl p-12 text-center text-white/50 space-y-4">
                                <CheckCircle className="w-12 h-12 mx-auto text-white/20" />
                                <p>No nearby requests match your blood profile right now.</p>
                                <p className="text-sm">We'll alert you via push notification when you're needed.</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {requests.map((req, i) => (
                                    <motion.div
                                        key={req._id}
                                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-[#111116] border border-[#FF2E63]/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(255,46,99,0.1)] hover:border-[#FF2E63]/60 transition-colors group"
                                    >
                                        <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-3 py-1 bg-[#FF2E63]/20 text-[#FF2E63] text-xs font-bold rounded-full uppercase tracking-widest border border-[#FF2E63]/50">
                                                        Critical Match
                                                    </span>
                                                    <span className="text-sm text-white/50">{req.distanceKm} km away</span>
                                                </div>
                                                <h3 className="text-2xl font-bold">{req.name}</h3>
                                                <p className="text-[#08D9D6] text-sm mt-1">{req.donationTypes.join(', ')} Needed</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-4xl font-bold font-mono text-white mb-1 group-hover:text-[#FF2E63] transition-colors">
                                                    {req.matchPercent}%
                                                </div>
                                                <div className="text-xs text-white/50 uppercase tracking-widest">Compatibility</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                                            <div className="flex items-center gap-2 text-white/70">
                                                <MapPin size={18} />
                                                <span>{req.city} Memorial Hospital</span>
                                            </div>
                                            <button
                                                onClick={() => acceptRequest(req._id)}
                                                className="w-full sm:w-auto px-8 py-3 bg-[#FF2E63] hover:bg-[#ff1a53] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(255,46,99,0.4)] interactive transition-all"
                                            >
                                                Accept & Help
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white/80">
                            <Bell size={20} />
                            Recent Alerts
                        </h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-[#08D9D6] uppercase tracking-widest">Network Update</span>
                                        <span className="text-xs text-white/40">{i * 12} mins ago</span>
                                    </div>
                                    <p className="text-sm text-white/80 leading-relaxed">
                                        {i === 1 ? 'A new patient (A+ Whole Blood) was verified in your city.' :
                                            i === 2 ? 'Your profile was successfully updated.' :
                                                'Thank you for being part of the life-saving network.'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-[600px] lg:h-auto rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
                        <EmbeddedMap
                            requests={requests as any}
                            selectedId={null}
                            onSelect={() => { }}
                            userLocation={donor.location?.coordinates as [number, number] || null}
                        />
                    </div>

                </div>

            </div>
        </div>
    );
}
