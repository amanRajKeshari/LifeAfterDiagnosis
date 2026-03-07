'use client';

import { motion } from 'framer-motion';

export default function ProblemSection() {
    return (
        <section id="problem" className="relative w-full min-h-[120vh] py-32 flex flex-col items-center justify-center">
            <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 w-full relative h-[600px] flex items-center justify-center">
                    {/* Floating Medical Data Panels */}
                    <motion.div
                        className="absolute z-20 top-20 left-10 w-64 p-4 rounded-xl bg-background/60 backdrop-blur-xl border border-white/10 shadow-2xl"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="text-xs text-white/50 mb-2 font-mono">REQUEST_ID_8472</div>
                        <div className="flex justify-between border-b border-white/10 pb-2 mb-2">
                            <span className="text-white/80">Blood Type</span>
                            <span className="text-primary font-bold">O-Negative</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/80">Status</span>
                            <span className="text-yellow-500">Unmatched</span>
                        </div>
                    </motion.div>

                    {/* Heartbeat Waveform */}
                    <motion.div
                        className="absolute w-full max-w-md"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1 }}
                    >
                        <svg viewBox="0 0 500 150" className="w-full h-auto drop-shadow-[0_0_15px_rgba(255,46,99,0.5)]">
                            <motion.path
                                d="M0,75 L150,75 L170,20 L210,130 L230,75 L500,75"
                                fill="none"
                                stroke="#FF2E63"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: false }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                        </svg>
                    </motion.div>

                    <motion.div
                        className="absolute bottom-20 right-10 z-20 w-56 p-4 rounded-xl bg-background/60 backdrop-blur-xl border border-white/10 shadow-2xl"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="text-xs text-white/50 mb-2 font-mono">CRITICAL_WAITING</div>
                        <div className="text-2xl font-bold text-white mb-1">12,450+</div>
                        <div className="text-sm text-white/70">Patients Currently Waiting</div>
                    </motion.div>
                </div>

                <div className="flex-1 max-w-xl">
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        Every year thousands of cancer patients wait for a donor match.
                    </motion.h2>
                    <motion.p
                        className="text-white/60 text-lg mb-8"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Traditional matching systems are slow, disconnected, and rely on outdated registry data. A delay of weeks can be the difference between life and death.
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
