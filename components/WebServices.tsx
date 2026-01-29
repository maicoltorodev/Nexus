'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
    Code,
    Smartphone,
    Zap,
    Search,
    ShieldCheck,
    Rocket,
    ArrowRight,
    Terminal,
    MousePointer2
} from 'lucide-react';
import Link from 'next/link';



const MobileMockup = () => {
    return (
        <div className="lg:hidden relative w-full max-w-[280px] mx-auto mb-16 px-4">
            {/* Floating Performance Badge for Mobile */}
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: 2, ease: "easeInOut" }}
                className="absolute -top-6 -right-4 z-40 bg-black/90 backdrop-blur-xl border border-green-500/30 p-2.5 rounded-xl flex items-center gap-2 shadow-[0_10px_30px_rgba(34,197,94,0.3)]"
            >
                <div className="w-8 h-8 rounded-full border-2 border-[#22c55e] flex items-center justify-center font-black text-[#22c55e] text-xs">99</div>
                <div className="leading-tight">
                    <p className="text-[7px] text-gray-400 uppercase font-black tracking-tighter">Google Core</p>
                    <p className="text-[10px] text-white font-bold">Vitals</p>
                </div>
            </motion.div>

            {/* Marco del Celular Premium */}
            <div className="relative aspect-[9/19] bg-[#050505] rounded-[3rem] border-[8px] border-[#1a1a1a] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden ring-1 ring-white/10">
                {/* Notch / Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2">
                    <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                </div>

                {/* Botones laterales (simulados) */}
                <div className="absolute top-24 -left-[10px] w-[2px] h-12 bg-white/10 rounded-r-full" />
                <div className="absolute top-40 -left-[10px] w-[2px] h-12 bg-white/10 rounded-r-full" />
                <div className="absolute top-32 -right-[10px] w-[2px] h-16 bg-white/10 rounded-l-full" />

                {/* Contenido de la Pantalla - Mini Web UI */}
                <div className="h-full flex flex-col pt-8 bg-[#0a0a0a]">
                    {/* Mini Navbar */}
                    <div className="px-4 py-3 flex justify-between items-center border-b border-white/5">
                        <div className="w-12 h-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full" />
                        <div className="flex gap-1.5">
                            <div className="w-4 h-0.5 bg-white/40 rounded-full" />
                            <div className="w-3 h-0.5 bg-white/40 rounded-full" />
                        </div>
                    </div>

                    {/* Mini Hero Section */}
                    <div className="px-4 py-6 space-y-3">
                        <div className="h-2 w-20 bg-[#FFD700]/20 rounded-full" />
                        <div className="space-y-1.5">
                            <div className="h-4 w-full bg-white/10 rounded-md" />
                            <div className="h-4 w-[90%] bg-white/10 rounded-md" />
                            <div className="h-4 w-[60%] bg-white/10 rounded-md" />
                        </div>
                        <div className="pt-2">
                            <div className="h-8 w-28 bg-[#FFD700] rounded-full shadow-[0_5px_15px_rgba(255,215,0,0.2)]" />
                        </div>
                    </div>

                    {/* Mini Image/Banner Area */}
                    <div className="px-4 py-2">
                        <div className="w-full aspect-video bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                    </div>

                    {/* Mini Features Grid */}
                    <div className="px-4 py-6 grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl space-y-2">
                            <div className="w-6 h-6 rounded-lg bg-[#22c55e]/20" />
                            <div className="w-full h-1 bg-white/10 rounded-full" />
                        </div>
                        <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl space-y-2">
                            <div className="w-6 h-6 rounded-lg bg-[#FFD700]/20" />
                            <div className="w-full h-1 bg-white/10 rounded-full" />
                        </div>
                    </div>

                    {/* Floating Info Overlay */}
                    <div className="absolute bottom-6 left-4 right-4 z-40">
                        <motion.div
                            initial={{ y: 0 }}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 3, repeat: 2, ease: "easeInOut" }}
                            className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] p-3 rounded-2xl text-black font-black text-[9px] flex items-center justify-center gap-2 shadow-2xl"
                        >
                            <Smartphone className="w-3.5 h-3.5" /> 100% RESPONSIVE
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Efecto de Brillo de Fondo sutil */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 -z-10 bg-[#FFD700]/10 blur-[100px] rounded-full" />
        </div>
    );
};

const BrowserMockup = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const rotateX = useSpring(useTransform(scrollYProgress, [0, 1], [15, -15]), { stiffness: 100, damping: 30 });
    const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -50]), { stiffness: 100, damping: 30 });

    return (
        <motion.div
            ref={ref}
            style={{ rotateX, y, transformStyle: "preserve-3d" }}
            className="hidden lg:block relative w-full max-w-[600px] h-[400px] mx-auto mb-20 group"
        >
            {/* Floating Performance Badges */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -left-10 z-20 bg-black/80 backdrop-blur-xl border border-green-500/30 p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
            >
                <div className="w-12 h-12 rounded-full border-4 border-[#22c55e] flex items-center justify-center font-black text-[#22c55e]">99</div>
                <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Performance</p>
                    <p className="text-white font-bold">Google Core Web Vitals</p>
                </div>
            </motion.div>

            {/* Browser Frame */}
            <div className="absolute inset-0 bg-[#111] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Browser Top Bar */}
                <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-6 gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="mx-auto w-1/2 h-5 bg-white/5 rounded-full border border-white/5 flex items-center px-3">
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-1/2 h-full bg-[#FFD700]/40"
                            />
                        </div>
                    </div>
                </div>

                {/* Browser Content (Mini Web UI Section) */}
                <div className="p-0 flex h-full relative" style={{ height: 'calc(100% - 40px)' }}>
                    {/* Navigation Sidebar sutil */}
                    <div className="w-16 h-full bg-white/[0.02] border-r border-white/5 p-4 space-y-4">
                        <div className="w-8 h-8 rounded-lg bg-[#FFD700]/20 antialiased" />
                        <div className="w-8 h-2 bg-white/10 rounded-full" />
                        <div className="w-8 h-2 bg-white/10 rounded-full" />
                        <div className="w-8 h-2 bg-white/10 rounded-full" />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-8 space-y-6">
                        {/* Header Area */}
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <div className="h-6 w-48 bg-gradient-to-r from-white/20 to-transparent rounded-lg" />
                                <div className="h-2 w-32 bg-white/5 rounded-full" />
                            </div>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/5" />
                                <div className="w-8 h-8 rounded-full bg-white/5" />
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-24 bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-2">
                                <div className="w-1/2 h-2 bg-[#FFD700]/30 rounded-full" />
                                <div className="w-full h-1 bg-white/10 rounded-full" />
                                <div className="w-full h-1 bg-white/10 rounded-full" />
                            </div>
                            <div className="h-24 bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-2">
                                <div className="w-1/2 h-2 bg-[#FFA500]/30 rounded-full" />
                                <div className="w-full h-1 bg-white/10 rounded-full" />
                                <div className="w-full h-1 bg-white/10 rounded-full" />
                            </div>
                            <div className="h-24 bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-2">
                                <div className="w-1/2 h-2 bg-[#FFD700]/30 rounded-full" />
                                <div className="w-full h-1 bg-white/10 rounded-full" />
                                <div className="w-full h-1 bg-white/10 rounded-full" />
                            </div>
                        </div>

                        {/* Footer-like element */}
                        <div className="h-20 w-full bg-gradient-to-br from-[#FFD700]/5 to-transparent rounded-2xl border border-[#FFD700]/10" />
                    </div>

                    {/* Floating CTA integrated in UI */}
                    <div className="absolute bottom-8 right-8">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] px-4 py-2 rounded-xl text-black font-black text-[10px] flex items-center gap-2 shadow-xl"
                        >
                            <Smartphone className="w-3 h-3" /> 100% RESPONSIVE
                        </motion.div>
                    </div>

                    {/* Cursor effect (Se mantiene para la interactividad) */}
                    <motion.div
                        animate={{ x: [100, 300, 150], y: [100, 50, 200] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute pointer-events-none z-50"
                    >
                        <MousePointer2 className="w-5 h-5 text-[#FFD700] fill-[#FFD700] drop-shadow-lg" />
                    </motion.div>
                </div>
            </div>

            {/* Rear perspective panels */}
            <div className="absolute inset-0 bg-[#FFD700]/5 -z-10 rounded-3xl blur-2xl group-hover:bg-[#FFD700]/10 transition-colors" />
        </motion.div>
    );
};

const features = [
    { icon: <Zap className="text-[#FFD700]" />, text: "Velocidad Ultra Rápida", desc: "< 1s Carga" },
    { icon: <Smartphone className="text-[#FFD700]" />, text: "100% Mobile Friendly", desc: "Adaptive UI" },
    { icon: <Search className="text-[#FFD700]" />, text: "SEO Optimizado", desc: "Google Ready" },
    { icon: <ShieldCheck className="text-[#FFD700]" />, text: "Seguridad SSL", desc: "HTTPS Active" }
];

const WebServices = () => {

    return (
        <section id="web-design" className="relative py-32 px-4 overflow-hidden bg-[#0a0a0a]">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#FFD700]/5 rounded-full blur-[80px] md:blur-[150px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#FFA500]/5 rounded-full blur-[80px] md:blur-[150px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20 text-balance px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-block mb-4 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5">
                            <span className="text-sm font-semibold text-[#FFD700] tracking-wider uppercase flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> Desarrollo Web
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                            Tu Ventana al <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Mundo Digital</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light mb-16">
                            No solo hacemos páginas, construimos experiencias digitales de alto impacto que impulsan el crecimiento de tu negocio bajo el sello de calidad de <span className="text-white font-medium italic-none">NE<span className="text-[#FFD700] font-black">X</span>US</span> y la ingeniería de vanguardia de <span className="font-[family-name:var(--font-orbitron)] bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent font-bold">InZidium</span>.
                        </p>
                    </motion.div>
                </div>

                {/* MOCKUP VIVO SECTION */}
                <BrowserMockup />
                <MobileMockup />

                {/* Features Row - Reimagined */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 max-w-5xl mx-auto">
                    {features.map((item, idx) => (
                        <motion.div
                            key={item.text}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.5,
                                delay: idx * 0.1,
                                ease: [0.21, 0.47, 0.32, 0.98]
                            }}
                            className="group flex flex-col items-center p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] backdrop-blur-md hover:bg-white/[0.05] hover:border-[#FFD700]/30 transition-colors duration-300"
                        >
                            <div className="mb-4 p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                            <span className="text-white text-sm font-bold text-center mb-1">{item.text}</span>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{item.desc}</span>
                        </motion.div>
                    ))}
                </div>



                {/* CTA to Plans Page */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                >
                    <Link
                        href="/planes"
                        className="group w-full sm:w-auto px-8 md:px-16 py-6 md:py-7 rounded-full flex items-center justify-center gap-4 font-black tracking-[0.1em] md:tracking-[0.2em] uppercase text-[10px] md:text-xs transition-all duration-500 glass-panel-inz text-white hover:bg-white/10 hover:scale-[1.05] hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] font-[family-name:var(--font-orbitron)] border border-white/20 hover:border-[#FFD700]/50 hover:text-[#FFD700]"
                    >
                        Ver Planes de Desarrollo <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
                    </Link>

                </motion.div>
            </div>
        </section>
    );
};

export default WebServices;
