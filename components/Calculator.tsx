'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Calculator() {
  return (
    <section id="calculadora" className="relative py-32 overflow-hidden bg-[#0a0a0a]">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 60%)' }}></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-[#FFA500] rounded-full blur-xl md:blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-[#FFD700] rounded-full blur-xl md:blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5"
            >
              <span className="text-sm font-semibold text-[#FFD700] tracking-wider uppercase">Herramienta Técnica</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Calculadora de <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Corte Pro</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed font-light">
              Optimiza tus recursos con nuestra nueva herramienta de imposición profesional. Calcula el aprovechamiento máximo de pliegos, reduce el desperdicio y visualiza tu esquema de corte en tiempo real.
            </p>

            <div className="space-y-4 mb-10">
              {[
                'Algoritmo de optimización de área',
                'Visualización de imposición en vivo',
                'Cálculo automático de mermas y desperdicio',
                'Soporte para múltiples formatos de pliego'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FFD700]/20 flex items-center justify-center border border-[#FFD700]/30">
                    <svg className="w-3 h-3 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 font-light">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="/calculadora"
              className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_10px_40px_rgba(255,215,0,0.3)]group"
            >
              Probar Optimizador
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Visual Teaser */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#FFD700]/20 blur-[100px] rounded-full"></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#FFD700]/20 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="space-y-6">
                <div className="h-4 w-1/2 bg-white/5 rounded-full"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-white/5 rounded-xl border border-white/5"></div>
                  <div className="h-12 bg-white/5 rounded-xl border border-white/5"></div>
                </div>
                <div className="aspect-square bg-black/40 rounded-2xl border border-[#FFD700]/10 flex items-center justify-center relative overflow-hidden">
                  <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full p-4">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-sm"></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#FFD700] font-mono text-xs font-bold tracking-widest px-3 py-1 bg-black/60 rounded-full border border-[#FFD700]/30 backdrop-blur-md">
                    ALGORITMO NEXUS ALPHA
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
