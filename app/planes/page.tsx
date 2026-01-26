'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Code,
    Smartphone,
    Rocket,
    ShieldCheck,
    ArrowRight,
    Terminal,
    CheckCircle2,
    Zap,
    Search
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const webPlans = [
    {
        title: "Lanzamiento Web",
        price: "$600.000",
        annual: "$250.000",
        time: "2–4 días",
        description: "Para negocios que quieren estar en internet rápidamente.",
        features: [
            "Página de inicio, servicios y contacto",
            "Se ve bien en celulares y computadores",
            "Botón de WhatsApp y ubicación en Google Maps",
            "Sitio seguro con candado verde",
            "Formulario para que te escriban",
            "Incluye alojamiento web y dirección del sitio"
        ],
        maintenance: "Cambios adicionales se cobran aparte",
        icon: <Rocket className="w-10 h-10" />,
        color: "from-[#FFD700] to-[#FFA500]",
        popular: false
    },
    {
        title: "Sitio Funcional",
        price: "$1.300.000",
        annual: "$400.000",
        time: "4–6 días",
        description: "Para empresas que necesitan un sitio web completo y profesional.",
        features: [
            "Todo lo del plan anterior",
            "Secciones diseñadas especialmente para tu negocio",
            "Formulario con más opciones de contacto",
            "Copias de seguridad automáticas",
            "Mejoras para que cargue más rápido",
            "Ayuda técnica durante 2 meses"
        ],
        maintenance: "Incluye ayuda técnica por 2 meses",
        icon: <Zap className="w-10 h-10" />,
        color: "from-[#FFA500] to-[#FF8C00]",
        popular: true
    },
    {
        title: "Experiencia Cliente",
        price: "$2.800.000",
        annual: "$500.000",
        time: "5–7 días",
        description: "Para mejorar cómo tus clientes interactúan y reservan contigo.",
        features: [
            "Todo lo del plan anterior",
            "Sistema de reservas o cotizaciones en línea",
            "Mejoras avanzadas de velocidad y rendimiento",
            "Estadísticas de visitantes de tu sitio",
            "Informes básicos de rendimiento",
            "Ayuda técnica durante 3 meses"
        ],
        maintenance: "Incluye ayuda técnica por 3 meses",
        icon: <CheckCircle2 className="w-10 h-10" />,
        color: "from-[#FFD700] via-[#FFA500] to-[#FF4500]",
        popular: false
    },
    {
        title: "Crecimiento Pro",
        price: "$4.000.000",
        annual: "$600.000",
        time: "7–10 días",
        description: "Sitio estratégico para atraer más clientes y hacer crecer tu negocio.",
        features: [
            "Todo lo del plan anterior",
            "Optimización para aparecer en Google",
            "Sistema de pagos en línea / Gestión de clientes",
            "Sitio 100% personalizado a tu marca",
            "Seguridad máxima contra ataques",
            "Soporte y ayuda completa"
        ],
        maintenance: "Optimización continua y soporte profesional",
        icon: <Terminal className="w-10 h-10" />,
        color: "from-blue-500 to-purple-600",
        popular: false
    },
    {
        title: "A tu Medida",
        price: "A cotizar",
        annual: "A cotizar",
        time: "Variable",
        description: "Para proyectos especiales con funciones únicas y diseño exclusivo.",
        features: [
            "Sitio completamente flexible y personalizado",
            "Conexiones especiales con otras plataformas",
            "Estrategias avanzadas de publicidad digital",
            "Informes personalizados para tu negocio",
            "Sitio accesible para todos los usuarios",
            "Mantenimiento diseñado para tus necesidades"
        ],
        maintenance: "Según lo que necesite tu proyecto",
        icon: <Smartphone className="w-10 h-10" />,
        color: "from-gray-700 to-gray-900",
        popular: false
    }
];

export default function PlansPage() {
    const openWhatsApp = (planTitle: string) => {
        const phoneNumber = '573143855079'; // Número de InZidium/Maicol Toro del sitio
        const message = encodeURIComponent(`Hola InZidium, me interesa el plan de Desarrollo Web: ${planTitle}. Vengo desde Nexus.`);
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    return (
        <main className="bg-[#0a0a0a] min-h-screen selection:bg-[#FFD700]/30">
            <Navbar />

            {/* Nexus Identity Hero */}
            <section className="relative pt-40 pb-24 px-4 overflow-hidden">
                {/* Background Decorative Elements Consistentes con Nexus */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#FFD700] rounded-full blur-[150px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FFA500] rounded-full blur-[150px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block mb-6 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5">
                            <span className="text-sm font-semibold text-[#FFD700] tracking-wider uppercase flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> Planes de Desarrollo
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Eleva tu <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Presencia Digital</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light px-4 text-balance">
                            Soluciones web de alto rendimiento con el sello de calidad <span className="text-white font-medium">Nexus</span> e impulsadas por nuestro aliado tecnológico <span className="text-white font-medium">InZidium</span>.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* InZidium Official Branding Plans Grid */}
            <section className="py-20 px-4 relative">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {webPlans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            className={`relative group bg-[#050505]/80 backdrop-blur-xl border transition-all duration-500 rounded-[2.5rem] p-7 flex flex-col justify-between hover:shadow-[0_0_50px_rgba(188,19,254,0.15)] ${plan.popular ? 'border-[#bc13fe]/40 ring-1 ring-[#06b6d4]/20' : 'border-white/5 hover:border-[#06b6d4]/30'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#bc13fe] to-[#06b6d4] text-white text-[8px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-[0_0_20px_rgba(188,19,254,0.4)] whitespace-nowrap z-20">
                                    Más Popular
                                </div>
                            )}

                            <div>
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-[#bc13fe]/20 to-[#06b6d4]/20 border border-white/10 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform duration-500 relative overflow-hidden group-hover:border-[#bc13fe]/50`}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#bc13fe]/10 to-[#06b6d4]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {React.cloneElement(plan.icon as React.ReactElement<any>, { className: 'w-8 h-8 relative z-10 text-[#06b6d4] group-hover:text-white transition-colors' })}
                                    </div>
                                    <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{plan.time}</span>
                                    </div>
                                </div>

                                <h2 className="text-xl font-black text-white mb-2 tracking-tight group-hover:bg-gradient-to-r group-hover:from-[#bc13fe] group-hover:to-[#06b6d4] group-hover:bg-clip-text group-hover:text-transparent transition-all uppercase italic">{plan.title}</h2>
                                <div className="mb-4">
                                    <p className="text-2xl font-black text-white tracking-tight">{plan.price}</p>
                                    <p className="text-[9px] font-mono text-slate-500">Mantenimiento anual: <span className="text-cyan-500/70">{plan.annual}</span></p>
                                </div>

                                <p className="text-slate-400 mb-6 leading-tight font-light text-[11px] min-h-[40px]">
                                    {plan.description}
                                </p>

                                <div className="space-y-3 mb-8">
                                    {plan.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-start gap-2 text-[10px] text-slate-300 group/item">
                                            <div className="w-1 h-1 rounded-full bg-cyan-500 mt-1.5 shrink-0 group-hover/item:scale-150 transition-transform" />
                                            <span className="group-hover/item:text-white transition-colors capitalize">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="mb-6 p-3 bg-white/[0.03] rounded-2xl border border-white/5 relative overflow-hidden group/maint">
                                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#bc13fe] to-[#06b6d4] opacity-50" />
                                    <p className="text-[9px] text-slate-500 leading-tight pl-2 font-mono italic">
                                        // {plan.maintenance}
                                    </p>
                                </div>
                                <button
                                    onClick={() => openWhatsApp(plan.title)}
                                    className={`w-full py-4.5 rounded-2xl flex items-center justify-center gap-3 font-black tracking-[0.15em] uppercase text-[10px] transition-all duration-500 relative overflow-hidden shadow-xl ${plan.popular
                                        ? 'bg-gradient-to-r from-[#bc13fe] to-[#06b6d4] text-white hover:scale-[1.02] active:scale-95'
                                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-[#06b6d4]/50'
                                        }`}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Solicitar Plan <ArrowRight className="w-4 h-4" />
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
