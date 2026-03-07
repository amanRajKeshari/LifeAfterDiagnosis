'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CtaSection() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-[#FF2E63] text-white">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_60%)]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                {/* Pulsing Human Silhouettes or Network Dots */}
                {mounted && [...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 md:w-4 md:h-4 rounded-full bg-white/30"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                <motion.h2
                    className="text-5xl md:text-7xl font-bold mb-8 tracking-tight max-w-4xl leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    You could be someone's <br /><span className="italic font-light">second chance.</span>
                </motion.h2>

                <motion.div
                    className="flex flex-col sm:flex-row gap-6 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <Link href="/donor/register" className="px-10 py-5 text-center rounded-full bg-white text-primary font-bold tracking-wide hover:bg-white/90 transition-colors text-lg shadow-xl interactive">
                        Register as Donor
                    </Link>
                    <Link href="/patient/register" className="px-10 py-5 text-center rounded-full border border-white/30 text-white font-bold tracking-wide hover:bg-white/10 transition-colors text-lg interactive">
                        Request Support
                    </Link>
                </motion.div>
            </div>

            <footer className="absolute bottom-6 left-0 w-full text-center text-white/50 text-sm">
                &copy; {mounted ? new Date().getFullYear() : ''} Life After Diagnosis. All rights reserved.
            </footer>
        </section>
    );
}
