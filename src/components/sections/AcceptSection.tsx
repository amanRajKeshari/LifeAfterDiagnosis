'use client';

import { motion } from 'framer-motion';
import { HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AcceptSection() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <section className="relative w-full min-h-[120vh] py-32 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-transparent to-primary/5">
            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">

                <motion.div
                    className="relative w-48 h-48 mb-16 flex items-center justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ type: "spring", duration: 1.5 }}
                >
                    {/* Expanding success rings */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/50"
                        animate={{ scale: [1, 2], opacity: [1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/30"
                        animate={{ scale: [1, 2], opacity: [1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
                    />

                    <div className="relative z-10 w-full h-full rounded-full bg-primary/20 backdrop-blur-xl border border-primary text-primary flex items-center justify-center shadow-[0_0_80px_rgba(255,46,99,0.5)]">
                        <HeartHandshake size={64} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-6 text-green-400">
                        <CheckCircle2 />
                        <span className="font-bold tracking-widest uppercase text-sm">Match Confirmed</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">A life-saving connection is <span className="text-primary italic">made</span>.</h2>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Within minutes, a willing donor nearby accepts the request. The hospital is notified, and logistics are put into motion. Hope becomes reality.
                    </p>
                </motion.div>

                {/* Rising Particles */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white)]">
                    {mounted && [...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-white/20"
                            style={{
                                left: `${Math.random() * 100}%`,
                                bottom: '-10px'
                            }}
                            animate={{
                                y: [0, -600],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
