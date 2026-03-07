'use client';

import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export default function AlertsSection() {
    return (
        <section className="relative w-full min-h-screen py-32 flex flex-col items-center justify-center overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">

                <div className="flex flex-col md:flex-row items-center gap-16 justify-center">
                    {/* Phone Mockup */}
                    <motion.div
                        className="relative w-72 h-[600px] rounded-[3rem] border-4 border-[#2A2A35] bg-[#0A0A0F] shadow-2xl overflow-hidden shrink-0"
                        initial={{ y: 100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ type: "spring", damping: 20 }}
                    >
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2A2A35] rounded-b-2xl z-20" />

                        <div className="p-6 pt-16 h-full flex flex-col relative z-10">
                            {/* Map Background for Context */}
                            <div className="absolute inset-0 bg-[#111116] z-0" />
                            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/10 blur-2xl z-0" />

                            {/* Push Notification */}
                            <motion.div
                                className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-lg mt-8"
                                initial={{ y: -50, opacity: 0, scale: 0.9 }}
                                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                                viewport={{ once: false, margin: "-200px" }}
                                transition={{ type: "spring", bounce: 0.5, delay: 0.4 }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                                        <Bell size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-bold">L.A.D. Alert</span>
                                        <span className="text-white/50 text-xs">Just now</span>
                                    </div>
                                </div>
                                <p className="text-white/90 text-sm font-medium">Urgent: A verified patient 12 miles away needs a stem cell match immediately.</p>
                                <button className="w-full mt-3 py-2 bg-primary text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                                    Respond Now
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>

                    <div className="max-w-md">
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold mb-6"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            Instant Alerts. <br /> Immediate Impact.
                        </motion.h2>
                        <motion.p
                            className="text-white/60 text-lg mb-8"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            When a match is found, available donors receive a secure push notification with location data and hospital directions.
                        </motion.p>

                        <motion.div
                            className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="w-12 h-12 rounded-full border border-secondary flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                            </div>
                            <div>
                                <div className="text-white font-bold">Ripple Effect</div>
                                <div className="text-white/50 text-sm">Multiple donors alerted simultaneously</div>
                            </div>
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    );
}
