'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

export default function MapSection() {
    return (
        <section id="network" className="relative w-full min-h-[140vh] py-32 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-10 w-full max-w-3xl px-6">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    Live Donation Network
                </motion.h2>
                <motion.p
                    className="text-white/60 text-lg"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Real-time visualization of verified requests and nearby available donors.
                </motion.p>
            </div>

            {/* Pseudo-3D Map visualization using Framer Motion (Fallback for when actual WebGL isn't needed) */}
            <div className="relative w-full max-w-5xl aspect-video perspective-[1000px] mt-32">
                <motion.div
                    className="w-full h-full relative"
                    initial={{ rotateX: 60, rotateZ: -20, scale: 0.8, opacity: 0 }}
                    whileInView={{ rotateX: 45, rotateZ: 10, scale: 1, opacity: 1 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Base grid/map */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center rounded-3xl opacity-20 sepia hue-rotate-180 brightness-50 border border-white/20 shadow-[0_0_100px_rgba(8,217,214,0.1)]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent rounded-3xl" />

                    {/* Pulse Points */}
                    <motion.div
                        className="absolute top-[40%] left-[30%] -translate-x-1/2 -translate-y-1/2"
                        style={{ transform: 'translateZ(50px)' }}
                    >
                        <div className="relative flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/20 absolute animate-ping" />
                            <div className="w-8 h-8 rounded-full bg-primary/40 absolute animate-pulse" />
                            <MapPin className="text-primary relative z-10" fill="#FF2E63" size={32} />
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute top-[60%] left-[60%] -translate-x-1/2 -translate-y-1/2"
                        style={{ transform: 'translateZ(30px)' }}
                    >
                        <div className="relative flex items-center justify-center text-secondary">
                            <div className="w-12 h-12 rounded-full bg-secondary/20 absolute animate-pulse" />
                            <MapPin fill="#08D9D6" size={24} />
                        </div>
                    </motion.div>

                    {/* Connecting Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'translateZ(10px)' }}>
                        <motion.line
                            x1="30%" y1="40%" x2="60%" y2="60%"
                            stroke="#08D9D6"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        />
                    </svg>
                </motion.div>
            </div>
        </section>
    );
}
