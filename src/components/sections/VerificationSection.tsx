'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Server } from 'lucide-react';

export default function VerificationSection() {
    return (
        <section className="relative w-full min-h-[120vh] py-32 flex flex-col items-center justify-center overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row-reverse items-center gap-12">
                <div className="flex-1 w-full relative h-[600px] flex items-center justify-center">

                    <div className="relative w-full max-w-md aspect-square rounded-full border border-secondary/20 flex items-center justify-center">
                        {/* Pulsing rings */}
                        <motion.div
                            className="absolute inset-0 rounded-full border border-secondary/40"
                            animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full border border-secondary/40"
                            animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1, ease: "linear" }}
                        />

                        <div className="relative z-10 w-32 h-32 rounded-full bg-[#0A0A0F] border border-secondary flex flex-col items-center justify-center text-secondary shadow-[0_0_50px_rgba(8,217,214,0.2)]">
                            <ShieldCheck size={48} />
                        </div>

                        {/* Connecting Nodes */}
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute w-16 h-16 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center"
                                style={{
                                    top: i === 0 ? '-10%' : i === 1 ? '70%' : '70%',
                                    left: i === 0 ? '40%' : i === 1 ? '-10%' : '90%',
                                }}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: i }}
                            >
                                <Server className="text-white/50" />
                            </motion.div>
                        ))}

                        {/* Glowing lines linking nodes could be SVGs, omitted for brevity as CSS effects provide the network feel */}
                    </div>
                </div>

                <div className="flex-1 max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Verified hospitals ensure every request is authentic.
                        </h2>
                        <p className="text-white/60 text-lg mb-8">
                            To prevent fraud and maintain the highest ethical standards, every donor request is cryptographically authenticated by our network of partner hospitals before it enters the matching pool.
                        </p>

                        <ul className="space-y-4">
                            {[
                                "Hospital Identity Verification",
                                "Blockchain Immutable Logging",
                                "HIPAA Compliant Data Handling"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-white/80">
                                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                        <ShieldCheck size={14} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
