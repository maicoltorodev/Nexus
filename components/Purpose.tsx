'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Zap, ShieldCheck, Rocket } from 'lucide-react';

export default function Purpose() {
    const missionText = "Proporcionamos soluciones de diseño e impresión de alta calidad, superando expectativas mediante innovación, creatividad y excelencia en el servicio al cliente.";
    const visionText = "Liderar la industria publicitaria siendo referentes en creatividad y calidad, expandiendo nuestra presencia global con tecnología de vanguardia y éxito sostenible.";

    return (
        <section id="proposito" className="relative py-24 bg-[#050505] overflow-hidden">
            {/* Cinematic Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#FFD700]/5 rounded-full blur-[140px] opacity-40"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#FFA500]/5 rounded-full blur-[140px] opacity-40"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Visual Side (The Core) */}
                    <div className="w-full lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-square flex items-center justify-center"
                        >
                            {/* Animated Rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-[1px] border-white/5 rounded-full"
                            ></motion.div>
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-8 border-[1px] border-[#FFD700]/10 rounded-full"
                            ></motion.div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-16 border-[1px] border-white/10 rounded-full border-dashed"
                            ></motion.div>

                            {/* Center Logo/Icon */}
                            <div className="relative z-20 w-48 h-48 bg-[#0a0a0a] rounded-[40px] border border-white/10 flex items-center justify-center group shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/10 to-transparent rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Zap className="w-20 h-20 text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]" />

                                {/* Orbiting Dots */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-4"
                                >
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FFD700] rounded-full shadow-[0_0_10px_#FFD700]"></div>
                                </motion.div>
                            </div>

                            {/* Text labels floating */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute top-10 left-0 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl"
                            >
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Innovación</span>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                                className="absolute bottom-10 right-0 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl"
                            >
                                <span className="text-[10px] text-[#FFD700] font-black uppercase tracking-widest">Eficiencia</span>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Content Side (Split Layout) */}
                    <div className="w-full lg:w-1/2 space-y-12">
                        <div className="space-y-4 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="inline-block px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20"
                            >
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#FFD700]">ADN Nexus</span>
                            </motion.div>
                            <h2 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                                Nuestra <span className="text-[#FFD700] block">Esencia</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Mission Compact */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group p-8 bg-[#0a0a0a] border border-white/5 rounded-[32px] hover:border-[#FFD700]/30 transition-all duration-500"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 shrink-0 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#FFD700] transition-colors duration-500">
                                        <Rocket className="w-6 h-6 text-[#FFD700] group-hover:text-black transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">01 / Misión</h3>
                                        <p className="text-xl font-medium text-gray-200 leading-snug tracking-tight">
                                            {missionText}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Vision Compact */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="group p-8 bg-[#0a0a0a] border border-white/5 rounded-[32px] hover:border-[#FFD700]/30 transition-all duration-500"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 shrink-0 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#FFD700] transition-colors duration-500">
                                        <Eye className="w-6 h-6 text-[#FFD700] group-hover:text-black transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">02 / Visión</h3>
                                        <p className="text-xl font-medium text-gray-200 leading-snug tracking-tight">
                                            {visionText}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
