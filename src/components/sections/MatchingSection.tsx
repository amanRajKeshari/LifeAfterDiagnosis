'use client';

import { motion } from 'framer-motion';

export default function MatchingSection() {
    return (
        <section id="matching" className="relative w-full min-h-screen py-32 flex flex-col items-center justify-center overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">

                <motion.div
                    className="max-w-3xl mb-20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">AI ranks donors by compatibility and proximity.</h2>
                    <p className="text-white/60 text-lg">Our neural network evaluates millions of data points instantly to find the perfect stem cell match.</p>
                </motion.div>

                {/* Neural Network Visualization */}
                <div className="relative w-full max-w-4xl h-[400px] flex items-center justify-between">
                    {/* Input Nodes */}
                    <div className="flex flex-col justify-between h-full py-10 z-10">
                        {['Blood Type', 'HLA Markers', 'Location', 'Availability'].map((label, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="text-xs text-white/50 text-right w-24">{label}</span>
                                <motion.div
                                    className="w-4 h-4 rounded-full bg-white/20"
                                    animate={{ backgroundColor: ['rgba(255,255,255,0.2)', '#08D9D6', 'rgba(255,255,255,0.2)'] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Hidden SVG Lines */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                        <svg className="w-full h-full">
                            <motion.path
                                d="M 120 80 C 300 80, 500 200, 700 200"
                                stroke="#08D9D6" strokeWidth="1" fill="none"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                            <motion.path
                                d="M 120 160 C 300 160, 500 200, 700 200"
                                stroke="#ff2e63" strokeWidth="1" fill="none"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.path
                                d="M 120 240 C 300 240, 500 200, 700 200"
                                stroke="#08D9D6" strokeWidth="1" fill="none"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                            />
                            <motion.path
                                d="M 120 320 C 300 320, 500 200, 700 200"
                                stroke="#white" strokeWidth="1" fill="none" opacity={0.2}
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 1.8, repeat: Infinity, delay: 0.1 }}
                            />
                        </svg>
                    </div>

                    {/* Output Node */}
                    <div className="flex items-center gap-6 z-10">
                        <motion.div
                            className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border border-primary text-primary text-xl font-bold shadow-[0_0_50px_rgba(255,46,99,0.4)]"
                            animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 30px rgba(255,46,99,0.4)', '0 0 60px rgba(255,46,99,0.8)', '0 0 30px rgba(255,46,99,0.4)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            99.8%
                            <div className="absolute -top-8 text-xs text-primary/80 uppercase tracking-widest whitespace-nowrap">Top Match</div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
