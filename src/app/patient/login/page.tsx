'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '@/services/api';
import { Activity, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PatientLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [particles, setParticles] = useState<{ width: string, height: string, top: string, left: string, duration: number, delay: number }[]>([]);

    useEffect(() => {
        setParticles(
            [...Array(20)].map(() => ({
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                duration: 4 + Math.random() * 6,
                delay: Math.random() * 5
            }))
        );
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            await authAPI.patientLogin(email, password);
            router.push('/patient/dashboard');
        } catch (err: any) {
            setErrorMsg(err?.response?.data?.message || err.message || "Invalid credentials");
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0A0A0F] text-white overflow-hidden py-24 flex items-center justify-center">
            {/* Floating Particle Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {particles.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-[#FF2E63]/10"
                        style={{
                            width: p.width,
                            height: p.height,
                            top: p.top,
                            left: p.left,
                        }}
                        animate={{ y: [0, -50, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-6"
            >
                <div className="bg-[#111116]/80 border border-[#FF2E63]/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(255,46,99,0.1)] relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#FF2E63]/20 rounded-full blur-[80px]" />

                    <div className="flex flex-col items-center mb-8 relative z-10">
                        <div className="w-16 h-16 bg-[#FF2E63]/20 text-[#FF2E63] flex items-center justify-center rounded-full border border-[#FF2E63]/50 mb-4 shadow-[0_0_20px_rgba(255,46,99,0.3)]">
                            <Activity size={36} />
                        </div>
                        <h1 className="text-2xl font-bold font-mono tracking-tight text-center">Patient Portal</h1>
                        <p className="text-white/50 text-sm mt-1">Track your request status</p>
                    </div>

                    {errorMsg && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-400 font-medium text-sm text-center">
                            {errorMsg}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Email / Request ID</label>
                            <input
                                required type="text"
                                className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E63] focus:ring-1 focus:ring-[#FF2E63] transition-all"
                                value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="Patient Email"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-white/80">Password</label>
                            </div>
                            <div className="relative">
                                <input
                                    required type={showPassword ? 'text' : 'password'}
                                    className="w-full bg-black/60 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-[#FF2E63] focus:ring-1 focus:ring-[#FF2E63] transition-all"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-4 mt-2 rounded-xl bg-[#FF2E63] hover:bg-[#ff1a53] text-white font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(255,46,99,0.3)] disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Secure Login'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium relative z-10 border-t border-white/10 pt-6">
                        <span className="text-white/40">New patient? </span>
                        <Link href="/patient/register" className="text-[#FF2E63] hover:underline">Create Account</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
