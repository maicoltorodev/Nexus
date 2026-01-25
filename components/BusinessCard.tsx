'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'framer-motion';
import { QrCode } from 'lucide-react';

const BusinessCard = () => {
    const [isRotating, setIsRotating] = useState(false);
    const rotateX = useMotionValue(10);
    const rotateY = useMotionValue(25);
    const autoX = useMotionValue(0);
    const autoY = useMotionValue(0);

    const springX = useSpring(useTransform([rotateX, autoX], ([x, a]) => (x as number) + (a as number)), { stiffness: 60, damping: 20 });
    const springY = useSpring(useTransform([rotateY, autoY], ([y, a]) => (y as number) + (a as number)), { stiffness: 60, damping: 20 });

    useAnimationFrame((time) => {
        if (!isRotating) {
            autoX.set(Math.sin(time / 1500) * 8);
            autoY.set(Math.cos(time / 2000) * 12);
        } else {
            autoX.set(0); autoY.set(0);
        }
    });

    const handlePan = (_: any, info: any) => {
        rotateX.set(rotateX.get() - info.delta.y * 0.4);
        rotateY.set(rotateY.get() + info.delta.x * 0.4);
    };

    return (
        <section id="tarjeta" className="relative py-32 px-4 overflow-hidden bg-[#050505]">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-[#FFD700] rounded-full blur-[150px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-[#FFA500] rounded-full blur-[150px]" />
            </div>

            <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div className="inline-block mb-4 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5">
                        <span className="text-sm font-semibold text-[#FFD700] tracking-wider uppercase">Identidad Profesional</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Tu tarjeta dice <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">quién eres...</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        No es solo un papel, es tu marca en manos de otros. En <span className="text-white font-medium">Nexus</span> diseñamos tarjetas inolvidables y materiales premium.
                    </p>
                </motion.div>
            </div>

            <div className="flex justify-center items-center h-[500px] perspective-[3000px] relative z-10">
                <motion.div onPan={handlePan} onPanStart={() => setIsRotating(true)} onPanEnd={() => setIsRotating(false)}
                    style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
                    className="relative w-full max-w-[500px] aspect-[1.6/1] cursor-grab active:cursor-grabbing touch-none select-none"
                >
                    {/* Front */}
                    <div className="absolute inset-0 rounded-[2.5rem] bg-[#0a0a0a] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:24px_24px]" />
                        <img src="/X.webp" className="absolute right-[-10%] top-[-10%] w-[80%] h-[120%] opacity-20 rotate-12 filter brightness-200" alt="" />
                        <div className="relative h-full p-10 flex flex-col justify-between">
                            <div className="flex justify-between items-start" style={{ transform: "translateZ(60px)" }}>
                                <div className="flex items-center gap-3">
                                    <img src="/X.webp" className="w-12 h-12 filter drop-shadow-gold" alt="Nexus" />
                                    <div>
                                        <h3 className="text-2xl font-black text-white tracking-widest uppercase leading-tight">NEXUS</h3>
                                        <p className="text-[10px] text-[#FFD700] font-bold tracking-[0.4em] opacity-80">EST. {new Date().getFullYear()}</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-lg text-[10px] text-[#FFD700] font-black uppercase tracking-widest">
                                    Diseño Exclusivo
                                </div>
                            </div>

                            <div className="grid grid-cols-2 items-center" style={{ transform: "translateZ(80px)" }}>
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#FFD700]/60 font-bold">Impulsa tu Marca</span>
                                    <h4 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">DISEÑO A MEDIDA</h4>
                                </div>
                                <div className="flex justify-end pr-4">
                                    <div className="w-24 h-24 rounded-full border border-[#FFD700]/20 overflow-hidden bg-black/50 backdrop-blur-sm p-2">
                                        <img src="/nexus.webp" className="w-full h-full object-contain opacity-80" alt="Profile" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end" style={{ transform: "translateZ(50px)" }}>
                                <div className="flex gap-10">
                                    <div className="space-y-1">
                                        <p className="text-[8px] text-gray-400 font-bold tracking-widest uppercase">Acabados</p>
                                        <p className="text-xs text-white font-bold text-[#FFD700]">PREMIUM UV</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] text-gray-400 font-bold tracking-widest uppercase">Material</p>
                                        <p className="text-xs text-white font-bold underline underline-offset-4 decoration-[#FFD700]/40">PROPALCOTE 300G</p>
                                    </div>
                                </div>
                                <div className="relative p-2 bg-white rounded-xl shadow-xl"><QrCode className="w-12 h-12 text-black" /></div>
                            </div>
                        </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 rounded-[2.5rem] bg-[#0a0a0a] border border-[#FFD700]/10 flex flex-col items-center justify-center gap-6"
                        style={{ transform: "rotateY(180deg) translateZ(1px)", backfaceVisibility: "hidden" }}
                    >
                        <img src="/X.webp" className="w-32 h-32 filter drop-shadow-gold-big" alt="" />
                        <div className="text-center px-10">
                            <p className="text-base text-[#FFD700] tracking-[0.5em] uppercase font-black opacity-60 leading-relaxed">Creatividad Sin Límites</p>
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent mt-6" />
                        </div>
                    </div>
                </motion.div>
            </div>
            <style jsx global>{`
                .drop-shadow-gold { filter: drop-shadow(0 0 10px rgba(255,215,0,0.5)); }
                .drop-shadow-gold-big { filter: drop-shadow(0 0 30px rgba(255,215,0,0.3)); }
            `}</style>
        </section>
    );
};

export default BusinessCard;
