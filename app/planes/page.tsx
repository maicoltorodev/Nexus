'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Rocket,
    CheckCircle2,
    Terminal,
    ArrowRight,
    Search,
    Zap,
    ShieldCheck,
    Globe,
    MessageSquare,
    Clock,
    Image as ImageIcon,
    MousePointerClick,
    Server,
    Lock,
    Smartphone
} from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButton from '@/components/FloatingButton';

const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export default function PlansPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const openWhatsApp = () => {
        const msg = encodeURIComponent(`Hola NEXUS, quiero lanzar mi web con el Plan Estándar.`);
        window.open(`https://wa.me/573184022999?text=${msg}`, '_blank');
    };

    return (
        <main className="bg-[#020617] min-h-screen text-white overflow-x-hidden selection:bg-cyan-500 selection:text-black">
            <Navbar isMenuOpen={isMenuOpen} onMenuToggle={setIsMenuOpen} />

            {/* --- HERO: LA ALIANZA --- */}
            <section className="relative pt-48 pb-32 px-4 bg-[#01030e]">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-cyan-600/10 blur-[120px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-xs font-bold text-cyan-400 uppercase tracking-[0.3em]">
                            <Zap className="w-4 h-4 animate-pulse" /> Solución de Alto Rendimiento
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter">
                            Inversión <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">Web Inteligente</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light mb-12">
                            Hemos fusionado el diseño creativo de <span className="text-white font-bold">NEXUS</span> con la infraestructura de alta velocidad de <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent font-black tracking-[0.2em] uppercase font-[family-name:var(--font-orbitron)]">InZidium</span>.
                        </p>

                        <div className="flex justify-center mb-16">
                            <div className="relative inline-flex items-center gap-6 md:gap-12 px-10 py-7 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-md hover:border-cyan-500/30 transition-all duration-700 group">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#020617] px-6 py-1.5 rounded-full border border-white/10 z-20">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 font-[family-name:var(--font-orbitron)]">Alianza Tech</span>
                                </div>
                                <div className="relative w-12 h-12 md:w-16 md:h-16 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                    <Image src="/X.webp" alt="Nexus" fill className="object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]" />
                                </div>
                                <span className="text-2xl text-white/20 font-light">✕</span>
                                <div className="relative w-12 h-12 md:w-16 md:h-16 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                    <Image src="/logo-inzidium.webp" alt="InZidium" fill className="object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- PLAN SHOWCASE: PREMIUM RIBBON THEME --- */}
            <section className="pb-40 relative">
                {/* PREMIUM RIBBON TITLE */}
                <div className="relative w-full py-16 mb-24 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-blue-700 to-[#020617] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.25),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_rgba(35,113,235,0.8)]" />

                    <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                        <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
                            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-[0.3em] mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                PÁGINA WEB ESTÁNDAR
                            </h2>
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-xl md:text-2xl font-bold text-white/30 line-through decoration-red-500/60 decoration-2 italic tracking-widest">$800.000</span>
                                    <motion.span
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] tracking-widest uppercase"
                                    >
                                        PROMO LANZAMIENTO
                                    </motion.span>
                                </div>
                                <div className="flex items-center justify-center gap-5">
                                    <span className="text-7xl md:text-9xl font-black text-cyan-200 drop-shadow-[0_0_40px_rgba(34,211,238,0.6)] tracking-tighter">$499.000</span>
                                    <span className="text-white/60 text-base font-bold uppercase tracking-[0.4em] mt-8">COP</span>
                                </div>
                                <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.5em] mt-4 opacity-70">Hacemos tu pagina web en menos de 48 horas</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative">
                    {/* --- 3 COLUMN POCKETS: RIBBON STYLE --- */}
                    <div className="grid md:grid-cols-3 gap-10 mb-24">
                        {[
                            {
                                title: "Presencia Visual",
                                bg: "from-indigo-500/30",
                                border: "group-hover:border-indigo-500/40",
                                icon: <ImageIcon className="w-9 h-9" />,
                                items: [
                                    { t: "Configuración de Marca", d: "Adaptamos tu logo y colores corporativos de forma profesional." },
                                    { t: "Portafolio de Oferta", d: "Hasta 6 servicios o productos destacados con su fotografía respectiva." },
                                    { t: "Arquitectura UX", d: "Diseño pensado para que el usuario navegue sin fricción." }
                                ]
                            },
                            {
                                title: "Infraestructura Pro",
                                bg: "from-cyan-500/30",
                                border: "group-hover:border-cyan-500/40",
                                icon: <Server className="w-9 h-9" />,
                                items: [
                                    { t: "Dominio x 1 Año", d: "Tu dirección propia (.com o .co) sin costos extra iniciales." },
                                    { t: "Cloud Hosting x 1 Año", d: "Infraestructura de carga ultra rápida incluida por el primer año." },
                                    { t: "Seguridad SSL", d: "Encriptación de datos para la confianza de tus clientes." }
                                ]
                            },
                            {
                                title: "Lanzamiento & Soporte",
                                bg: "from-emerald-500/30",
                                border: "group-hover:border-emerald-500/40",
                                icon: <Rocket className="w-9 h-9" />,
                                items: [
                                    { t: "WhatsApp Integrado", d: "Botón flotante directo a tu línea de atención." },
                                    { t: "Web al Aire en 48h", d: "Identidad digital inmediata tras la entrega de tus insumos." },
                                    { t: "Garantia de Calidad", d: "Garantizamos que tu sitio web sea estable, rápido y seguro." }
                                ]
                            }
                        ].map((box, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative p-1 rounded-[3.5rem] overflow-hidden group"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${box.bg} via-transparent to-transparent`} />
                                <div className={`relative bg-[#020617] rounded-[3.4rem] p-12 h-full border border-white/5 ${box.border} transition-all duration-700`}>
                                    <div className="w-18 h-18 rounded-3xl bg-white/5 flex items-center justify-center text-white mb-10 group-hover:scale-110 transition-all">
                                        {box.icon}
                                    </div>
                                    <h4 className="text-white font-black uppercase tracking-widest text-sm mb-10 border-b border-white/10 pb-4">{box.title}</h4>
                                    <ul className="space-y-6">
                                        {box.items.map((item, i) => (
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
                        ))}
                    </div>

                    {/* --- LARGE INFO BANNER: PREMIUM RIBBON STYLE --- */}
                    {/* --- EFECTO DE LUZ DINÁMICA (SPOTLIGHT) --- */}
                    <div className="relative overflow-hidden rounded-[4rem] group/banner shadow-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-700">
                        {/* El Spotlight */}
                        <div className="absolute inset-0 opacity-0 group-hover/banner:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = ((e.clientX - rect.left) / rect.width) * 100;
                                const y = ((e.clientY - rect.top) / rect.height) * 100;
                                e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                                e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
                            }}
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(34,211,238,0.15),transparent_80%)]" />
                        </div>

                        {/* Barrido Láser Superior/Inferior */}
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent translate-x-[-100%] group-hover/banner:translate-x-[100%] transition-transform duration-[2000ms] ease-in-out" />
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent translate-x-[100%] group-hover/banner:translate-x-[-100%] transition-transform duration-[3000ms] ease-in-out" />

                        <div className="grid lg:grid-cols-12 relative z-10">
                            <div className="lg:col-span-8 p-14 bg-gradient-to-br from-[#020617] to-[#01030e] relative border-r border-white/5 overflow-hidden">
                                {/* Carbon Texture */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

                                <div className="flex items-center gap-4 mb-10 text-amber-500 font-black uppercase tracking-[0.4em] text-xs relative z-10">
                                    <ShieldCheck className="w-7 h-7 animate-pulse group-hover/banner:rotate-[360deg] transition-transform duration-1000" /> AVISO IMPORTANTE: REGLAS DEL SOFTWARE
                                </div>
                                <div className="grid md:grid-cols-2 gap-x-14 gap-y-12">
                                    {[
                                        { t: "Personalización", d: "Inyectamos tu marca (Logo, fotos, textos y colores) en nuestra estructura probada." },
                                        { t: "Plazo de 48 Horas", d: "Inicia únicamente cuando entregas la totalidad de insumos (Logo, colores, textos e imagenes de tus mejores servicios/productos). max (6)" },
                                        { t: "Garantía de Contenido", d: "Cuentas con 1 semana de soporte para ajustes menores de tus propios datos (corrección de textos, cambio de fotos o teléfonos)." },
                                        { t: "Arquitectura Fija", d: "Este es un plan basado en plantilla. La estructura de la pagina, el diseño y orden de secciones NO se pueden modificar." },
                                        { t: "Anualidad Renovación", d: "Pasado el primer año, la renovación de Dominio + Hosting tiene un costo fijo de $250.000 COP." },
                                        { t: "Escalabilidad", d: "Si buscas diseño desde cero o funciones extras, cotiza un Proyecto Premium ($1.8M+)." }
                                    ].map((rule, i) => (
                                        <div key={i}>
                                            <h5 className="text-white font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-amber-500" /> 0{i + 1}. {rule.t}
                                            </h5>
                                            <p className="text-slate-400 text-sm leading-relaxed">{rule.d}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-4 p-14 bg-gradient-to-br from-blue-700 to-blue-900 flex flex-col justify-center text-center relative overflow-hidden group/cta">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.2),transparent_70%)]" />
                                <Smartphone className="w-16 h-16 text-cyan-200 mx-auto mb-10 animate-pulse" />
                                <h5 className="text-2xl font-black text-white mb-8 uppercase tracking-tighter leading-none">MIRA EL <br />MODELO REAL <br />CON UN NEGOCIO FICTICIO</h5>
                                <button
                                    onClick={() => window.open('/demo-estandar', '_blank')}
                                    className="w-full py-7 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-[0.25em] hover:bg-cyan-400 transition-all duration-500 shadow-2xl mb-6 relative z-10"
                                >
                                    Página de Prueba
                                </button>
                                <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.3em]">Demo en Vivo 24/7</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PROCESS STEPS: LAUNCH PROTOCOL --- */}
            <section className="py-40 relative overflow-hidden bg-[#01030e] border-t border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col items-center text-center mb-32">
                        <div className="w-px h-24 bg-gradient-to-b from-transparent via-cyan-500 to-transparent mb-12" />
                        <h4 className="text-cyan-400 font-black uppercase tracking-[0.6em] text-xs mb-6">Protocolo de Ingeniería</h4>
                        <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8">DESPEGUE EN 48H</h2>
                        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {[
                            { s: "01", t: "Sincronización", d: "Fijamos objetivos y coordinamos el inicio técnico.", icon: <MessageSquare className="w-7 h-7" /> },
                            { s: "02", t: "Ingesta Data", d: "Envías fotos, textos y logo a través de nuestro portal.", icon: <Zap className="w-7 h-7" /> },
                            { s: "03", t: "Arquitectura", d: "NEXUS e InZidium ensamblan tu página web.", icon: <Server className="w-7 h-7" /> },
                            { s: "04", t: "Ignición", d: "¡Web Live! Tu portafolio digital listo para mostrar al mundo.", icon: <Rocket className="w-7 h-7" /> }
                        ].map((step, i) => (
                            <div key={i} className="group relative p-10 rounded-[3rem] bg-[#020617] border border-white/5 hover:border-cyan-500/50 transition-all duration-700 overflow-hidden">
                                <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="text-8xl font-black text-white/[0.03] absolute -top-4 -right-2 uppercase group-hover:text-cyan-500/10 transition-all duration-700 select-none">{step.s}</div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-8 border border-cyan-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        {step.icon}
                                    </div>
                                    <h5 className="text-white font-black text-xl uppercase mb-4 tracking-widest">{step.t}</h5>
                                    <p className="text-slate-400 text-sm leading-relaxed font-light">{step.d}</p>
                                </div>

                                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 w-0 group-hover:w-full transition-all duration-1000" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA: THE VOID PORTAL --- */}
            <section className="relative py-60 overflow-hidden bg-black group">
                {/* Background FX */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_70%)]" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                        <h2 className="text-5xl md:text-[10rem] font-black leading-none tracking-[ -0.05em] mb-16 uppercase">
                            TU MARCA <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10">DIGITALIZADA</span>
                        </h2>
                        <div className="flex flex-col items-center">
                            <p className="text-cyan-400 font-black uppercase tracking-[0.8em] text-sm mb-16 animate-pulse">¿ESTÁS LISTO?</p>
                            <button
                                onClick={openWhatsApp}
                                className="group/btn relative px-20 py-10 rounded-full overflow-hidden transition-all duration-500 hover:scale-110 active:scale-95"
                            >
                                <div className="absolute inset-0 bg-blue-600 group-hover/btn:bg-cyan-500 transition-colors duration-500" />
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20" />
                                <span className="relative flex items-center gap-4 text-white font-black uppercase tracking-[0.4em] text-sm">
                                    INICIAR DESPLIEGUE <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-3 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </section>

            <Footer />
            <FloatingButton isMenuOpen={isMenuOpen} />
        </main>
    );
}
