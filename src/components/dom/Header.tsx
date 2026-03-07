'use client';

import { motion } from 'framer-motion';
import { Menu, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide global header on the hospital dashboard to avoid overlapping the sidebar logo.
    if (pathname?.includes('/hospital/dashboard')) return null;

    return (
        <header
            className={clsx(
                'fixed top-0 left-0 w-full z-50 transition-all duration-500',
                scrolled ? 'py-4 bg-background/80 backdrop-blur-md border-b border-white/5' : 'py-6 bg-transparent'
            )}
        >
            <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                <Link href="/" className="group flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-primary"
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                        <div className="w-3 h-3 rounded-full bg-primary z-10" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white group-hover:text-primary transition-colors">
                        LifeAfter<span className="text-white/50 font-normal">Diagnosis</span>
                    </span>
                </Link>

                <nav className="hidden md:flex gap-8 items-center text-sm font-medium tracking-wide">
                    <Link href="#problem" className="text-white/70 hover:text-white transition-colors uppercase text-xs">The Problem</Link>
                    <Link href="#network" className="text-white/70 hover:text-white transition-colors uppercase text-xs">Network</Link>
                    <Link href="#matching" className="text-white/70 hover:text-secondary transition-colors uppercase text-xs">AI Matching</Link>
                    <Link href="#impact" className="text-white/70 hover:text-white transition-colors uppercase text-xs">Impact</Link>
                    
                    <div 
                        className="relative"
                        onMouseEnter={() => setLoginDropdownOpen(true)}
                        onMouseLeave={() => setLoginDropdownOpen(false)}
                    >
                        <button className="flex items-center gap-1 px-5 py-2.5 rounded-full bg-white text-background hover:bg-primary hover:text-white transition-colors interactive text-xs uppercase font-bold tracking-wider">
                            Login Portal <ChevronDown size={14} className={`transition-transform duration-300 ${loginDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {loginDropdownOpen && (
                            <div className="absolute top-full right-0 pt-2 w-48">
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#111116] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                                >
                                    <div className="flex flex-col">
                                        <Link href="/patient/login" className="px-4 py-3 text-center text-white/70 hover:text-white hover:bg-white/5 transition-colors uppercase text-xs border-b border-white/5 font-medium">Patient Login</Link>
                                        <Link href="/hospital/login" className="px-4 py-3 text-center text-white/70 hover:text-white hover:bg-white/5 transition-colors uppercase text-xs border-b border-white/5 font-medium">Hospital Login</Link>
                                        <Link href="/donor/login" className="px-4 py-3 text-center text-primary hover:text-[#ff1a53] hover:bg-primary/10 transition-colors uppercase text-xs font-bold">Donor Login</Link>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </nav>

                <button className="md:hidden text-white interactive p-2">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
}
