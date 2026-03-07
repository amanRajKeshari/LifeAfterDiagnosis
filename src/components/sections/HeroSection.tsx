'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center mt-20 md:mt-0">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase"
                >
                    Real-time Matchmaking
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-tight max-w-5xl"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                >
                    One Match Can <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff6b95]">Save A Life.</span>
                </motion.h1>

                <motion.p
                    className="text-white/60 text-lg md:text-xl max-w-2xl mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    AI-powered donor matching platform helping cancer patients find life-saving stem cell donors in real time.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    <Link href="/donor/register" className="px-8 py-4 text-center rounded-full bg-primary text-white font-bold tracking-wide hover:bg-[#ff1a53] transition-colors interactive shadow-[0_0_30px_rgba(255,46,99,0.3)] hover:shadow-[0_0_40px_rgba(255,46,99,0.5)]">
                        Become Donor
                    </Link>
                    <Link href="/patient/register" className="px-8 py-4 text-center rounded-full border border-white/20 text-white font-bold tracking-wide hover:bg-white/10 transition-colors interactive">
                        Find Donor
                    </Link>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
        </section>
    );
}
