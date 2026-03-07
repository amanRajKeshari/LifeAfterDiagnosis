'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const stats = [
    { label: 'Lives Saved', value: '14,289', suffix: '+' },
    { label: 'Donors Registered', value: '2.5', suffix: 'M' },
    { label: 'Hospitals Connected', value: '1,450', suffix: '' },
    { label: 'Avg Match Time', value: '12', suffix: 'hrs' },
];

export default function ImpactSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [150, -150]);

    return (
        <section ref={containerRef} id="impact" className="relative w-full min-h-screen py-32 flex flex-col items-center justify-center">
            <div className="container mx-auto px-6 relative z-10">

                <div className="text-center mb-24">
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        The Global Impact
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
                            style={{ y: idx % 2 === 0 ? y1 : y2 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                        >
                            <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-2 font-mono">
                                {stat.value}<span className="text-primary text-3xl">{stat.suffix}</span>
                            </div>
                            <div className="text-white/60 font-medium tracking-wide uppercase text-sm text-center">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>

            {/* World Map Background Image */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" alt="World Map" className="w-[120%] h-auto invert mix-blend-screen" />
            </div>
        </section>
    );
}
