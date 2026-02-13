'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Rocket,
    ArrowRight,
    Terminal,
    CheckCircle2,
    Search,
    Clock,
    ShieldCheck,
    Globe,
    Zap,
    MessageSquare,
    ImageIcon,
    MousePointerClick,
    Server,
    Smartphone
} from 'lucide-react';

const WebPlans = () => {
    const openWhatsApp = () => {
        const phoneNumber = '573184022999';
        const message = encodeURIComponent(`Hola Nexus, quiero lanzar mi web con el Plan Estándar de $600.000.`);
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    return (
        <section id="planes" className="relative py-32 overflow-hidden bg-[#020617]">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full opacity-50" />
            </div>

            {/* --- PREMIUM RIBBON TITLE --- */}
            <div className="relative w-full py-12 mb-24 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-blue-700 to-[#030712] shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-[0.3em] mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            PÁGINA WEB ESTÁNDAR
                        </h2>
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-4xl md:text-6xl font-black text-cyan-200 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">$600.000</span>
                            <span className="text-white/60 text-sm font-bold uppercase tracking-[0.3em]">COP</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* --- 3 COLUMN INFO GRID: RIBBON STYLE --- */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">

                    {/* Identity & Visuals */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative p-1 rounded-[3rem] overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-indigo-500/20" />
                        <div className="relative bg-[#020617] rounded-[2.9rem] p-10 h-full border border-white/5 group-hover:border-indigo-500/40 transition-all duration-700">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/20 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8 border-b border-indigo-500/20 pb-4">Presencia Visual</h4>
                            <ul className="space-y-6">
                                {[
                                    { t: "Configuración de Marca", d: "Adaptamos tu logo y colores corporativos de forma profesional." },
                                    { t: "Portafolio de Oferta", d: "Hasta 6 servicios o productos detallados con su fotografía respectiva." },
                                    { t: "Arquitectura UX", d: "Diseño pensado para que el usuario navegue sin fricción." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-1" />
                                        <div>
                                            <p className="text-white text-sm font-bold mb-1">{item.t}</p>
                                            <p className="text-slate-400 text-sm leading-relaxed">{item.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Technical Power */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative p-1 rounded-[3rem] overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-cyan-500/20" />
                        <div className="relative bg-[#020617] rounded-[2.9rem] p-10 h-full border border-white/5 group-hover:border-cyan-500/40 transition-all duration-700">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-8 border border-cyan-500/20 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all">
                                <Server className="w-8 h-8" />
                            </div>
                            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8 border-b border-cyan-500/20 pb-4">Infraestructura Pro</h4>
                            <ul className="space-y-6">
                                {[
                                    { t: "Dominio x 1 Año", d: "Tu dirección propia (.com o .co) sin costos extra iniciales." },
                                    { t: "Cloud Hosting Fast", d: "Infraestructura InZidium de carga ultra rápida." },
                                    { t: "Seguridad SSL", d: "Encriptación de datos para la confianza de tus clientes." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-1" />
                                        <div>
                                            <p className="text-white text-sm font-bold mb-1">{item.t}</p>
                                            <p className="text-slate-400 text-sm leading-relaxed">{item.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Support & Speed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative p-1 rounded-[3rem] overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-emerald-500/20" />
                        <div className="relative bg-[#020617] rounded-[2.9rem] p-10 h-full border border-white/5 group-hover:border-emerald-500/40 transition-all duration-700">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-8 border border-emerald-500/20 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                                <Rocket className="w-8 h-8" />
                            </div>
                            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8 border-b border-emerald-500/20 pb-4">Lanzamiento & Paz Mental</h4>
                            <ul className="space-y-6">
                                {[
                                    { t: "WhatsApp Integrado", d: "Botón flotante directo a tu línea de atención." },
                                    { t: "Web al Aire en 48h", d: "Digitalización inmediata de tus servicios tras recibir insumos." },
                                    { t: "Garantia de Calidad", d: "Garantizamos que tu portal siempre esté online y seguro." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                                        <div>
                                            <p className="text-white text-sm font-bold mb-1">{item.t}</p>
                                            <p className="text-slate-400 text-sm leading-relaxed">{item.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>

                {/* --- RULES & CTA BANNER: RIBBON STYLE --- */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-[4rem] group/banner border border-white/5 transition-all duration-700 hover:border-cyan-500/30"
                >
                    {/* --- EFECTO DE LUZ DINÁMICA (SPOTLIGHT) --- */}
                    <div className="absolute inset-0 opacity-0 group-hover/banner:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(34,211,238,0.15),transparent_80%)]"
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = ((e.clientX - rect.left) / rect.width) * 100;
                                const y = ((e.clientY - rect.top) / rect.height) * 100;
                                e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                                e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
                            }}
                        />
                    </div>

                    {/* Borde de Luz Animado */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent translate-x-[-100%] group-hover/banner:translate-x-[100%] transition-transform duration-[2000ms] ease-in-out" />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent translate-x-[100%] group-hover/banner:translate-x-[-100%] transition-transform duration-[2000ms] ease-in-out" />

                    <div className="grid lg:grid-cols-12 h-full">
                        {/* Rules of the Game */}
                        <div className="lg:col-span-8 p-12 bg-gradient-to-br from-[#020617] to-[#01030e] relative h-full">
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

                            <div className="flex items-center gap-3 mb-10 text-amber-500 font-black uppercase tracking-[0.4em] text-xs relative z-10">
                                <ShieldCheck className="w-6 h-6 animate-pulse group-hover/banner:scale-125 transition-transform" /> REGLAS CRÍTICAS DEL PLAN
                            </div>
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                                <div className="space-y-3">
                                    <h5 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 01. Estructura Fija
                                    </h5>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Para ofrecer este precio y velocidad, usamos una <span className="text-amber-500 font-bold">estructura fija optimizada</span>. El orden de las secciones y el diseño no se pueden cambiar.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h5 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 02. Insumos Web
                                    </h5>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Las 48 horas inician <span className="text-white font-bold">SOLO</span> cuando entregas la información completa (Logo, colores,textos e imagenes de tus mejores 6 servicios/productos).
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h5 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 03. Customización
                                    </h5>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Cambiamos fotos, textos, logo y colores. <span className="text-amber-500 font-bold text-[10px] uppercase block mt-1">No añadimos secciones ni funciones extras.</span>
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h5 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 04. Soporte
                                    </h5>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Renovación anual de <span className="text-white font-bold">$250.000</span> para mantener tu web asegurada y online.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Side: Enhanced Ribbon Style */}
                        <div className="lg:col-span-4 bg-gradient-to-br from-blue-700 to-blue-900 p-12 flex flex-col justify-center items-center text-center relative overflow-hidden group/cta">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.2),transparent_70%)]" />
                            <MousePointerClick className="w-12 h-12 text-white mb-8 group-hover/cta:scale-110 group-hover/cta:rotate-12 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                            <h5 className="text-2xl font-black text-white mb-8 uppercase tracking-tighter leading-none">¿QUIERES VER <br />EL DEMO?</h5>
                            <button
                                onClick={() => window.open('/demo-estandar', '_blank')}
                                className="w-full py-6 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-[0.25em] hover:bg-cyan-400 transition-all duration-500 shadow-2xl active:scale-95 relative z-10"
                            >
                                Página de Prueba
                            </button>
                            <p className="mt-6 text-[10px] text-white/50 font-bold uppercase tracking-[0.3em]">Mira la estructura real</p>
                        </div>
                    </div>
                </motion.div>

                {/* --- PROCESS STEPS: LAUNCH DATA FLOW --- */}
                <div className="mt-40 relative">
                    <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="flex flex-col items-center gap-4 mb-24 relative z-10">
                        <div className="w-px h-20 bg-gradient-to-t from-cyan-500 to-transparent" />
                        <h4 className="text-cyan-400 font-black uppercase tracking-[0.5em] text-xs">Protocolo de Lanzamiento</h4>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">DESPEGUE EN 4 PASOS</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {[
                            { s: "01", t: "Sincronización", d: "Definimos objetivos y aseguramos el inicio del proyecto.", icon: <MessageSquare className="w-6 h-6" /> },
                            { s: "02", t: "Carga de Datos", d: "Envías tus fotos, textos y logo por WhatsApp o Correo.", icon: <Zap className="w-6 h-6" /> },
                            { s: "03", t: "Ensamblaje", d: "Ingeniería Nexus construye tu portal en tiempo récord.", icon: <Server className="w-6 h-6" /> },
                            { s: "04", t: "Ignición", d: "¡PROYECTO ONLINE! Tu negocio ya tiene presencia en el mapa digital.", icon: <Rocket className="w-6 h-6" /> }
                        ].map((step, idx) => (
                            <div key={idx} className="relative group p-8 rounded-[2.5rem] bg-[#030712] border border-white/5 hover:border-cyan-500/50 transition-all duration-500 overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full transition-opacity opacity-0 group-hover:opacity-100" />
                                <div className="text-7xl font-black text-white/5 absolute top-4 right-6 group-hover:text-cyan-500/10 transition-colors uppercase">{step.s}</div>

                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-500 border border-cyan-500/20">
                                        {step.icon}
                                    </div>
                                    <h5 className="text-white font-black text-lg uppercase mb-3 tracking-widest">{step.t}</h5>
                                    <p className="text-slate-400 text-sm leading-relaxed">{step.d}</p>
                                </div>

                                <div className="absolute bottom-0 left-0 w-0 h-1 bg-cyan-500 group-hover:w-full transition-all duration-700" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WebPlans;
