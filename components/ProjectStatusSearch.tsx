'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';
import Link from 'next/link';

export default function ProjectStatusSearch() {
    return (
        <section className="py-32 px-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#FFD700] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5 text-xs font-black text-[#FFD700] uppercase tracking-[0.3em]">
                        <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                        Portal del Cliente
                    </div>

                    {/* Título */}
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        ¿Tienes un proyecto <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">con nosotros?</span>
                    </h2>

                    {/* Descripción */}
                    <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                        Si ya eres parte de la familia Nexus, consulta el estado completo de tu proyecto en tiempo real.
                        Revisa avances, archivos, etapas y mantente al tanto de cada detalle.
                    </p>

                    {/* CTA Button */}
                    <Link
                        href="/seguimiento"
                        className="inline-flex items-center gap-3 bg-[#FFD700] text-black px-12 py-6 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-transform shadow-[0_20px_40px_-10px_rgba(255,215,0,0.4)] group/btn"
                    >
                        <Eye className="w-6 h-6" />
                        Ver Estado del Proyecto
                        <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    {/* Trust Badges */}
                    <div className="mt-12 flex items-center justify-center gap-8 opacity-50">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Actualizado en Tiempo Real
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Acceso Seguro
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
