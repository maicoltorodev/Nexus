'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Zap, 
    Rocket, 
    ShieldCheck, 
    Server, 
    Smartphone, 
    Globe,
    Sparkles,
    Star
} from 'lucide-react';
import Image from 'next/image';

export default function ServicePosterSquarePage() {
    return (
        <main className="bg-[#050505] min-h-screen flex items-center justify-center p-4 selection:bg-[#FFD700] selection:text-black font-[family-name:var(--font-jost)]">
            {/* --- PREMIUM SQUARE POSTER (1:1) --- */}
            <div 
                id="nexus-service-poster-square"
                className="relative w-full max-w-[600px] aspect-square bg-black overflow-hidden rounded-[2.5rem] shadow-[0_0_120px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col group p-8"
            >
                {/* --- TECH BRACKETS --- */}
                <div className="absolute inset-4 z-30 pointer-events-none border border-white/5 rounded-[2rem]">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-cyan-500/40 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-500/40 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-500/40 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-cyan-500/40 rounded-br-xl" />
                </div>

                {/* --- BACKGROUND ATMOSPHERE (Same Style) --- */}
                <div className="absolute inset-0 z-0 bg-[#020617]">
                    <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    
                    {/* Watermark Logos - Enhanced Square Composition */}
                    <div className="absolute top-[-2%] left-[-8%] w-[320px] h-[320px] opacity-[0.06] grayscale brightness-200 blur-[1px] -rotate-12 pointer-events-none">
                        <Image src="/logo-inzidium.webp" alt="" fill className="object-contain" />
                    </div>
                    <div className="absolute bottom-[-4%] right-[-10%] w-[380px] h-[380px] opacity-[0.05] grayscale brightness-200 blur-[2px] rotate-12 pointer-events-none">
                        <Image src="/X.webp" alt="" fill className="object-contain" />
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_70%)] blur-[80px]" />
                </div>

                {/* SEAL: NEXUS VERIFIED - ABSOLUTE CORNER */}
                <div className="absolute top-8 right-8 z-50 w-12 h-12 border border-cyan-500/20 bg-cyan-500/5 rounded-full flex items-center justify-center backdrop-blur-md group-hover:rotate-[360deg] transition-transform duration-[3s]">
                    <ShieldCheck className="w-6 h-6 text-cyan-400 opacity-60" />
                    <div className="absolute inset-0 border border-dashed border-cyan-500/30 rounded-full animate-spin-slow" />
                </div>

                {/* --- TOP HUD (CENTERED BADGE) --- */}
                <div className="relative z-40 flex flex-col items-center mb-6">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5 backdrop-blur-md"
                    >
                        <Sparkles className="w-3 h-3 text-[#FFD700]" />
                        <span className="text-[9px] font-black text-[#FFD700] uppercase tracking-[0.4em] font-[family-name:var(--font-orbitron)]">
                            Inversión Web
                        </span>
                    </motion.div>
                </div>

                {/* --- CORE CONTENT (GRID FOR BETTER VERTICAL USE) --- */}
                <div className="relative z-10 flex-grow grid grid-rows-[auto_1fr_auto] gap-4 h-full">
                    
                    {/* 1. TITLE AREA */}
                    <div className="text-center">
                        <h1 className="text-5xl font-black leading-[0.8] tracking-tighter">
                            <span className="block text-white mb-2 uppercase tracking-[0.1em] text-sm">PÁGINA WEB</span>
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_5px_15px_rgba(34,211,238,0.3)] uppercase">
                                Estándar
                            </span>
                        </h1>
                    </div>

                    {/* 2. CENTER PIECE: FEATURES GIRD WITH COMPACT DESIGN */}
                    <div className="flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-2 w-full max-w-[440px]">
                            {[
                                { icon: <Smartphone />, t: "Mobile" },
                                { icon: <ShieldCheck />, t: "Segura" },
                                { icon: <Server />, t: "Hosting" },
                                { icon: <Globe />, t: "Dominio" },
                                { icon: <Zap />, t: "Rápida" },
                                { icon: <Star />, t: "Premium" }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + (idx * 0.05) }}
                                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-[#FFD700]/30 transition-all group/icon"
                                >
                                    <div className="w-5 h-5 text-white/40 mb-1.5 group-hover/icon:text-[#FFD700] transition-colors scale-90">
                                        {item.icon}
                                    </div>
                                    <span className="text-[7px] font-bold text-white/30 uppercase tracking-widest">{item.t}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* 3. FINAL STACK: PRICE + DELIVERY + FOOTER */}
                    <div className="flex flex-col gap-4">
                        {/* THE RIBBON: PRICE */}
                        <div className="relative w-[calc(100%+4rem)] -mx-8 overflow-hidden py-6">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-700/60 to-transparent" />
                            <motion.div
                                animate={{ x: [-600, 600], opacity: [0, 1, 0] }}
                                transition={{ duration: 4, repeat: Infinity, repeatDelay: 6 }}
                                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-45deg] z-10"
                            />
                            
                            <div className="relative z-10 flex items-center justify-center gap-6">
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] font-bold text-white/30 line-through tracking-widest decoration-red-500/50 decoration-2 mb-1">$800.000</span>
                                    <span className="bg-red-500 text-white text-[7px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">PROMO</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.4)] tracking-tighter">$499</span>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-2xl font-black text-cyan-200">.000</span>
                                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.3em]">COP</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DELIVERY PROMISE (More Horizontal Style) */}
                        <div className="flex items-center justify-center gap-4 py-2 border-y border-cyan-500/10">
                            <Rocket className="w-4 h-4 text-cyan-400 opacity-60" />
                            <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
                                AL AIRE EN 48 HORAS
                            </p>
                            <Rocket className="w-4 h-4 text-cyan-400 opacity-60" />
                        </div>

                        {/* BRAND SIGNATURE */}
                        <div className="flex flex-col items-center">
                            <p className="text-sm tracking-[0.5em] mb-1 font-medium">
                                <span className="font-[family-name:var(--font-jost)] text-white uppercase">NE<span className="text-[#FFD700] font-black">X</span>US</span>
                                <span className="text-white/10 mx-3">|</span>
                                <span className="font-[family-name:var(--font-orbitron)] bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent font-bold">InZidium</span>
                            </p>
                            <span className="text-[7px] text-white/10 italic tracking-widest">Tecnología Digital de Élite</span>
                        </div>
                    </div>
                </div>

                {/* OVERLAYS & FX (Same Style) */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                <motion.div 
                    animate={{ x: [-100, 600], opacity: [0, 1, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 h-full w-[2px] bg-cyan-400/5 blur-sm pointer-events-none z-20"
                />
                
                {/* Floating Particles (Ultra Pulido) */}
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={`p-${i}`}
                        animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.1, 0.4, 0.1],
                        }}
                        transition={{ duration: 4 + i, repeat: Infinity }}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px] z-10"
                        style={{ bottom: i * 20 + '%', right: i * 25 + '%' }}
                    />
                ))}
            </div>
        </main>
    );
}
