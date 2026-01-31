'use client';

import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-[#FFD700] selection:text-black">
            {/* Homepage-style Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Subtle golden glow center (as in Hero/Services) */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 60%)' }}
                />

                {/* Decorative background blurs (as in Services) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-72 md:w-[600px] h-72 md:h-[600px] bg-[#FFD700] rounded-full blur-[80px] md:blur-[120px]" />
                    <div className="absolute bottom-0 left-1/4 w-72 md:w-[600px] h-72 md:h-[600px] bg-[#FFA500] rounded-full blur-[80px] md:blur-[120px]" />
                </div>

                {/* Floating Particles (keeping them as they add 'life' consistently with the premium feel) */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    {/* 404 Number */}
                    <motion.div
                        className="relative mb-8"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, type: 'spring' }}
                    >
                        <h1 className="text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter">
                            <span className="relative inline-block">
                                <span className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent blur-2xl opacity-50">
                                    404
                                </span>
                                <span className="relative bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                                    404
                                </span>
                            </span>
                        </h1>
                    </motion.div>

                    <style jsx>{`
                        @keyframes gradient {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                        .animate-gradient {
                            animation: gradient 3s ease infinite;
                        }
                    `}</style>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mb-12"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                            Página <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">No Encontrada</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                            Parece que esta página se perdió en el espacio digital.
                            No te preocupes, te ayudamos a encontrar el camino de regreso.
                        </p>
                    </motion.div>



                    {/* Action Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="flex justify-center"
                    >
                        {/* Home Button */}
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-12 py-5 rounded-full font-bold uppercase text-sm tracking-widest transition-all bg-[#FFD700] text-black hover:shadow-[0_20px_60px_rgba(255,215,0,0.4)] overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <Home className="w-5 h-5" />
                                    Ir al Inicio
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Error Code */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="mt-12 text-xs text-slate-600 font-mono"
                    >
                        ERROR_CODE: NEXUS_404_PAGE_NOT_FOUND
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-[#FFD700]/20 rounded-full animate-pulse" />
            <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-[#FFA500]/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </main>
    );
}
