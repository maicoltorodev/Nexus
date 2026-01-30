'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ExternalLink } from 'lucide-react';
import { NAV_LINKS, SOCIAL_LINKS } from '@/data/navigation';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-0 left-0 w-full h-[100dvh] z-[70] lg:hidden bg-[#0a0a0a] flex flex-col pointer-events-auto"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md">
                        <Link href="/" onClick={onClose} className="group flex items-center gap-2">
                            <span className="text-xl font-black tracking-tighter text-white">
                                NE<span className="text-[#FFD700]">X</span>US
                            </span>
                        </Link>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#FFD700] text-black shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-transform hover:scale-95 active:scale-90"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-[10%] -right-[10%] w-[70%] h-[70%] bg-[#FFD700]/5 rounded-full blur-[120px]" />
                        <div className="absolute -bottom-[10%] -left-[10%] w-[70%] h-[70%] bg-[#FFD700]/5 rounded-full blur-[120px]" />
                    </div>

                    <div className="relative flex-1 min-h-0 flex flex-col px-8 pt-12 pb-12 overflow-y-auto">
                        <div className="flex flex-col space-y-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD700]/60 mb-2">Navegación</p>
                            {NAV_LINKS.map((link, idx) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={onClose}
                                        className="group flex items-center justify-between py-2"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-3xl font-bold text-white group-hover:text-[#FFD700] transition-colors">{link.label}</span>
                                            <span className="text-xs text-gray-500 mt-1">{link.desc}</span>
                                        </div>
                                        <ArrowRight className="w-6 h-6 text-[#FFD700] opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-auto space-y-8">
                            <div className="pt-8 border-t border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD700]/60 mb-6">Conecta con nosotros</p>
                                <div className="flex gap-6">
                                    {SOCIAL_LINKS.map((social, idx) => (
                                        <motion.a
                                            key={social.label}
                                            href={social.href}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 + idx * 0.1 }}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#FFD700] hover:text-black transition-all"
                                            aria-label={social.label}
                                        >
                                            {social.icon}
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="p-6 rounded-[2rem] bg-gradient-to-br from-[#FFD700]/10 to-transparent border border-[#FFD700]/20"
                            >
                                <h4 className="text-lg font-bold text-white mb-2">¿Listo para empezar?</h4>
                                <p className="text-sm text-gray-400 mb-4">Transformamos tus ideas en realidades visuales impactantes.</p>
                                <Link
                                    href="/planes"
                                    onClick={onClose}
                                    className="flex items-center justify-center gap-2 py-4 bg-[#FFD700] text-black rounded-xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
                                >
                                    Ver Planes <ExternalLink className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

