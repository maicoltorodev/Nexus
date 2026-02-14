'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Sparkles, Paintbrush, Code2, Boxes, Hammer, Rocket, Check } from 'lucide-react';

interface ProjectTimelineProps {
    proyecto: any;
}

export default function ProjectTimeline({ proyecto }: ProjectTimelineProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to active step
    useEffect(() => {
        if (proyecto && scrollContainerRef.current) {
            // Find active step index based on progress
            const progress = proyecto.progreso || 0;
            const steps = [0, 20, 40, 60, 80, 100];
            let activeIndex = steps.findIndex(v => progress >= v && progress < v + 20);
            if (activeIndex === -1 && progress >= 100) activeIndex = 5;
            if (activeIndex === -1) activeIndex = 0;

            const element = document.getElementById(`timeline-step-${activeIndex}`);
            if (element) {
                const container = scrollContainerRef.current;
                // Calculate center position
                const scrollLeft = element.offsetLeft - (container.clientWidth / 2) + (element.clientWidth / 2);

                // Small timeout to ensure layout is ready
                setTimeout(() => {
                    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                }, 500);
            }
        }
    }, [proyecto]);

    // Horizontal scroll with wheel (Optional, preserves good UX)
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            const handleWheel = (evt: WheelEvent) => {
                if (evt.deltaY !== 0) {
                    evt.preventDefault();
                    scrollContainer.scrollLeft += evt.deltaY;
                }
            };
            scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
            return () => scrollContainer.removeEventListener("wheel", handleWheel);
        }
    }, []);

    const phases = [
        { name: 'Concepto', icon: Sparkles, val: 0, desc: 'Definición' },
        { name: 'Diseño UI', icon: Paintbrush, val: 20, desc: 'Estética' },
        { name: 'Desarrollo', icon: Code2, val: 40, desc: 'Código' },
        { name: 'Funcionalidad', icon: Boxes, val: 60, desc: 'Motores' },
        { name: 'QA & Test', icon: Hammer, val: 80, desc: 'Calidad' },
        { name: 'Lanzamiento', icon: Rocket, val: 100, desc: 'Final' },
    ];

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="relative z-20 mb-12 md:mb-20 px-4 md:px-0"
        >
            <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] md:rounded-[3rem] p-4 md:p-12 shadow-[0_0_50px_-20px_rgba(0,0,0,0.5)] max-w-7xl mx-auto overflow-hidden relative group">
                {/* Background Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[100px] bg-[#FFD700]/5 blur-[80px] rounded-full pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />

                {/* --- MOBILE VERSION (Scrollable) --- */}
                <div className="block md:hidden">
                    <div ref={scrollContainerRef} className="overflow-x-auto custom-scrollbar pb-8 -mb-8 touch-pan-x snap-x snap-mandatory">
                        <div className="min-w-[1000px] flex justify-between items-center relative px-8 py-12">
                            {/* Track Background */}
                            <div className="absolute top-1/2 left-0 w-full h-2 bg-white/5 -z-20 rounded-full" />

                            {/* Active Progress Line */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.max(5, proyecto.progreso)}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 -z-10 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                            >
                                <div className="absolute top-0 right-0 w-4 h-full bg-white/50 blur-[4px]" />
                            </motion.div>

                            {phases.map((phase, idx) => {
                                const isCompleted = proyecto.progreso > phase.val;
                                const isActive = proyecto.progreso >= phase.val && proyecto.progreso < (phase.val + 20);

                                return (
                                    <div key={idx} id={`timeline-step-${idx}`} className="relative flex flex-col items-center group/node snap-center">
                                        {(isActive || isCompleted) && (
                                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-500/20 blur-xl rounded-full -z-10 transition-all duration-500 ${isActive ? 'scale-100 opacity-100 animate-pulse' : 'scale-75 opacity-0 group-hover/node:opacity-50'}`} />
                                        )}
                                        <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center border transition-all duration-500 relative z-10 backdrop-blur-md ${isCompleted
                                            ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_5px_20px_rgba(34,211,238,0.3)] scale-100'
                                            : isActive
                                                ? 'bg-black/80 border-cyan-400 text-cyan-400 scale-110 shadow-[0_0_30px_rgba(34,211,238,0.4)]'
                                                : 'bg-black/40 border-white/5 text-gray-700 hover:border-white/10'
                                            }`}>
                                            <phase.icon className={`w-6 h-6 transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover/node:scale-110'}`} />
                                            {isCompleted && (
                                                <div className="absolute -top-2 -right-2 bg-black text-cyan-400 rounded-full p-0.5 border border-cyan-400 shadow-sm scale-0 animate-[scale-in_0.3s_ease-out_forwards]">
                                                    <Check className="w-2.5 h-2.5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className={`mt-6 text-center transition-all duration-500 ${isActive ? 'transform translate-y-0 opacity-100' : 'transform translate-y-2 opacity-60 group-hover/node:translate-y-0 group-hover/node:opacity-100'}`}>
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isCompleted || isActive ? 'text-white' : 'text-gray-600'}`}>
                                                {phase.name}
                                            </p>
                                            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest opacity-0 group-hover/node:opacity-100 transition-opacity absolute w-full left-0">
                                                {phase.desc}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* --- DESKTOP VERSION (No Scroll, Full Width) --- */}
                <div className="hidden md:block pt-8">
                    <div className="w-full flex justify-between items-center relative px-12 pb-12">
                        {/* Track Background */}
                        <div className="absolute top-1/2 left-0 w-full h-2 bg-white/5 -z-20 rounded-full" />

                        {/* Active Progress Line */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(5, proyecto.progreso)}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 -z-10 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                        >
                            <div className="absolute top-0 right-0 w-4 h-full bg-white/50 blur-[4px]" />
                        </motion.div>

                        {phases.map((phase, idx) => {
                            const isCompleted = proyecto.progreso > phase.val;
                            const isActive = proyecto.progreso >= phase.val && proyecto.progreso < (phase.val + 20);

                            return (
                                <div key={idx} className="relative flex flex-col items-center group/node">
                                    {(isActive || isCompleted) && (
                                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan-500/20 blur-xl rounded-full -z-10 transition-all duration-500 ${isActive ? 'scale-100 opacity-100 animate-pulse' : 'scale-75 opacity-0 group-hover/node:opacity-50'}`} />
                                    )}
                                    <div className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center border transition-all duration-500 relative z-10 backdrop-blur-md cursor-default ${isCompleted
                                        ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_5px_20px_rgba(34,211,238,0.3)] scale-100'
                                        : isActive
                                            ? 'bg-black/80 border-cyan-400 text-cyan-400 scale-110 shadow-[0_0_30px_rgba(34,211,238,0.4)]'
                                            : 'bg-black/40 border-white/5 text-gray-700 hover:border-white/10'
                                        }`}>
                                        <phase.icon className={`w-7 h-7 transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover/node:scale-110'}`} />
                                        {isCompleted && (
                                            <div className="absolute -top-3 -right-3 bg-black text-cyan-400 rounded-full p-0.5 border border-cyan-400 shadow-sm scale-0 animate-[scale-in_0.3s_ease-out_forwards]">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                    <div className={`mt-8 text-center transition-all duration-500 ${isActive ? 'transform translate-y-0 opacity-100' : 'transform translate-y-2 opacity-60 group-hover/node:translate-y-0 group-hover/node:opacity-100'}`}>
                                        <p className={`text-xs font-black uppercase tracking-[0.2em] mb-1 ${isCompleted || isActive ? 'text-white' : 'text-gray-600'}`}>
                                            {phase.name}
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest opacity-0 group-hover/node:opacity-100 transition-opacity absolute w-full left-0">
                                            {phase.desc}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
