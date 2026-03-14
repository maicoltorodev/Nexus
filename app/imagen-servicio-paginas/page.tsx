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
    ChevronRight,
    Star
} from 'lucide-react';
import Image from 'next/image';

export default function ServicePosterPage() {
    return (
        <main className="bg-[#050505] min-h-screen flex items-center justify-center p-6 selection:bg-[#FFD700] selection:text-black font-[family-name:var(--font-jost)]">
            {/* --- PREMIUM POSTER CONTAINER --- */}
            <div 
                id="nexus-service-poster"
                className="relative w-full max-w-[480px] aspect-[9/16] bg-black overflow-hidden rounded-[2.5rem] shadow-[0_0_120px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col group"
            >
                {/* --- TECH BRACKETS (FRAME ASSET) --- */}
                <div className="absolute inset-4 z-30 pointer-events-none border border-white/5 rounded-[2rem]">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t font-black border-l border-cyan-500/40 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-cyan-500/40 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-cyan-500/40 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-cyan-500/40 rounded-br-xl" />
                </div>

                {/* --- FLOATING ENERGY NODES --- */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ 
                            y: [-20, 20, -20],
                            x: [-10, 10, -10],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{ 
                            duration: 5 + i, 
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5
                        }}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px] z-10"
                        style={{ 
                            top: `${20 + (i * 15)}%`, 
                            left: `${15 + (i * 20)}%` 
                        }}
                    />
                ))}

                {/* --- BASE ATMOSPHERE: PLANS PAGE STYLE --- */}
                <div className="absolute inset-0 z-0 bg-[#020617]">
                    {/* Carbon Texture */}
                    <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    
                    {/* Watermark Logos (Wow Effect) */}
                    <div className="absolute top-[-5%] left-[-15%] w-80 h-80 opacity-[0.07] grayscale brightness-200 blur-[1px] -rotate-12 pointer-events-none">
                        <Image src="/logo-inzidium.webp" alt="" fill className="object-contain" />
                    </div>
                    <div className="absolute bottom-[5%] right-[-15%] w-96 h-96 opacity-[0.05] grayscale brightness-200 blur-[2px] rotate-12 pointer-events-none">
                        <Image src="/X.webp" alt="" fill className="object-contain" />
                    </div>

                    {/* Dynamic Atmosphere */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-cyan-600/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                </div>

                {/* SEAL: NEXUS VERIFIED */}
                <div className="absolute top-10 right-10 z-50 w-12 h-12 border border-cyan-500/20 bg-cyan-500/5 rounded-full flex items-center justify-center backdrop-blur-md group-hover:rotate-[360deg] transition-transform duration-[3s]">
                    <ShieldCheck className="w-6 h-6 text-cyan-400 opacity-60" />
                    <div className="absolute inset-0 border border-dashed border-cyan-500/30 rounded-full animate-spin-slow" />
                </div>

                {/* --- TOP BRANDING LAYER --- */}
                <div className="relative z-10 pt-12 px-10 flex flex-col items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 mb-8 px-4 py-1 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5 backdrop-blur-md"
                    >
                        <Sparkles className="w-3 h-3 text-[#FFD700]" />
                        <span className="text-[9px] font-black text-[#FFD700] uppercase tracking-[0.3em] font-[family-name:var(--font-orbitron)]">
                            Inversión Web
                        </span>
                    </motion.div>

                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-black leading-[0.9] tracking-tight">
                            <span className="block text-white mb-3 uppercase tracking-[0.1em]">PÁGINA WEB</span>
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_5px_15px_rgba(34,211,238,0.3)] uppercase pr-1">
                                Estándar
                            </span>
                        </h1>
                    </div>

                </div>

                {/* --- PRICING SECTION: PREMIUM RIBBON STYLE (INSPIRED BY PLANS) --- */}
                <div className="relative z-10 w-full mt-auto mb-10 overflow-hidden group/price py-8">
                    {/* Ribbon Background Logic */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-700/80 to-transparent shadow-[inset_0_0_50px_rgba(0,0,0,0.3)]" />
                    
                    {/* ANAMORPHIC LENS FLARE */}
                    <motion.div
                        animate={{ x: [-500, 500], opacity: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-45deg] pointer-events-none z-20"
                    />

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.2),transparent_70%)] opacity-0 group-hover/price:opacity-100 transition-opacity duration-1000" />
                    
                    {/* Energy Lines (Top & Bottom) */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(35,113,235,0.8)]" />

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-[10px] font-bold text-white/40 line-through tracking-[0.2em] decoration-red-500/50 decoration-2">$800.000</span>
                            <span className="bg-red-500 text-white text-[7px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                                PROMO LANZAMIENTO
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <span className="text-8xl font-black text-white drop-shadow-[0_0_40px_rgba(34,211,238,0.5)] tracking-tighter">
                                $499
                            </span>
                            <div className="flex flex-col items-start leading-none mt-2">
                                <span className="text-3xl font-black text-cyan-200">.000</span>
                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.4em]">COP</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* --- FEATURES GRID --- */}
                <div className="relative z-10 px-10 mb-8">
                    <div className="grid grid-cols-3 gap-2">
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
                                transition={{ delay: 0.4 + (idx * 0.05) }}
                                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-[#FFD700]/30 transition-all group/icon"
                            >
                                <div className="w-5 h-5 text-white/60 mb-2 group-hover/icon:text-[#FFD700] transition-colors scale-75">
                                    {item.icon}
                                </div>
                                <span className="text-[7px] font-bold text-white/40 uppercase tracking-widest group-hover/icon:text-white transition-colors">{item.t}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* --- DELIVERY PROMISE: SECOND RIBBON --- */}
                <div className="relative z-10 w-full mb-12 overflow-hidden group/promise py-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-950/40 to-transparent" />
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

                    <div className="relative z-10 flex items-center justify-center gap-4">
                        <Rocket className="w-4 h-4 text-cyan-400 group-hover/promise:translate-y-[-2px] transition-transform" />
                        <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">
                            AL AIRE EN 48 HORAS
                        </p>
                        <Rocket className="w-4 h-4 text-cyan-400 group-hover/promise:translate-y-[-2px] transition-transform" />
                    </div>
                </div>

                {/* --- FOOTER: SIGNATURE --- */}
                <div className="relative z-10 pb-12 px-10 flex flex-col items-center">
                    <div className="flex items-center gap-4 w-full opacity-10 mb-6">
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-white" />
                        <div className="w-1 h-1 rounded-full bg-white" />
                        <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-white" />
                    </div>
                    
                    <div className="text-center group-hover:translate-y-[-2px] transition-transform duration-500 relative">
                        <p className="text-base tracking-[0.4em] mb-4 font-medium">
                            <span className="font-[family-name:var(--font-jost)] text-white uppercase">NE<span className="text-[#FFD700] font-black">X</span>US</span>
                            <span className="text-white/20 mx-3">|</span>
                            <span className="font-[family-name:var(--font-orbitron)] bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent font-bold">InZidium</span>
                        </p>
                        <div className="flex items-center justify-center gap-1.5 text-white/20">
                            <span className="text-[8px] italic font-light">Elegancia & Tecnología Digital</span>
                        </div>
                    </div>
                </div>

                {/* --- OVERLAYS & FX --- */}
                {/* Subtle Grain Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                {/* Ambient Light Move */}
                <motion.div 
                    animate={{ 
                        x: [-100, 480],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ 
                        duration: 8, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                    className="absolute top-0 h-full w-[2px] bg-[#FFD700]/20 blur-sm pointer-events-none z-20"
                />
            </div>
        </main>
    );
}
