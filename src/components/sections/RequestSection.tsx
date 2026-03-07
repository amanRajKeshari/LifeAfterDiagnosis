'use client';

import { motion } from 'framer-motion';
import { Database, Hospital, FileText, Cross as HospitalCross } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RequestSection() {
    const [time, setTime] = useState('');
    useEffect(() => {
        setTime(new Date().toLocaleTimeString());
    }, []);
    return (
        <section className="relative w-full min-h-screen py-32 flex flex-col items-center justify-center border-t border-white/5 bg-gradient-to-b from-transparent to-secondary/5">
            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center max-w-4xl">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold mb-16 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    Patient Submits Request
                </motion.h2>

                <div className="relative w-full max-w-lg">
                    {/* Card */}
                    <motion.div
                        className="relative z-20 bg-[#111116] border border-secondary/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(8,217,214,0.1)] text-left"
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    >
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                <FileText />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">New Urgency Request</h3>
                                <p className="text-sm text-white/50">Timestamp: {time}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                <span className="text-white/60 text-sm">Blood Group</span>
                                <span className="font-bold text-lg">A+</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                <span className="text-white/60 text-sm">Hospital</span>
                                <span className="font-mono text-secondary text-sm">MEMORIAL_HOSPITAL_NYC</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                <span className="text-white/60 text-sm">Urgency</span>
                                <span className="font-bold text-primary flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    CRITICAL
                                </span>
                            </div>
                        </div>

                        <button className="w-full mt-8 py-3 rounded-lg bg-secondary/10 border border-secondary text-secondary font-bold hover:bg-secondary hover:text-background transition-colors interactive">
                            Transmit to Network
                        </button>
                    </motion.div>

                    {/* Floating Icons */}
                    <motion.div
                        className="absolute -left-16 top-10 text-white/20"
                        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <HospitalCross size={48} />
                    </motion.div>

                    <motion.div
                        className="absolute -right-16 bottom-10 text-white/20"
                        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Database size={48} />
                    </motion.div>

                    {/* Data Flow Lines Background */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center blur-[2px] opacity-50">
                        {/* Particles would go here, simulated with CSS for now */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(8,217,214,0.15)_0%,transparent_70%)] rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        </section>
    );
}
