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

const webPlans = [
    {
        title: "Lanzamiento Web",
        price: "$600.000",
        annual: "$250.000",
        time: "2–4 días",
        description: "Negocios que quieren estar online rápido.",
        features: [
            "Inicio, Servicios, Contacto",
            "100% Responsive",
            "WhatsApp & Google Maps",
            "Certificado SSL",
            "Hosting y Dominio inc."
        ],
        maintenance: "Cambios se cotizan aparte",
        icon: <Rocket className="w-10 h-10" />,
        color: "from-cyan-400 to-blue-500",
        popular: false
    },
    {
        title: "Sitio Funcional",
        price: "$1.300.000",
        annual: "$400.000",
        time: "4–6 días",
        description: "Empresas que necesitan un sitio completo.",
        features: [
            "Todo lo anterior",
            "Secciones personalizadas",
            "Formulario avanzado",
            "Backups automáticos",
            "Soporte 2 meses"
        ],
        maintenance: "Soporte técnico 2 meses inc.",
        icon: <Zap className="w-10 h-10" />,
        color: "from-blue-500 to-indigo-600",
        popular: true
    },
    {
        title: "Experiencia Cliente",
        price: "$2.800.000",
        annual: "$500.000",
        time: "5–7 días",
        description: "Mejora la interacción y reservas.",
        features: [
            "Todo lo anterior",
            "Reservas online",
            "Optimización avanzada",
            "Google Analytics",
            "Soporte 3 meses"
        ],
        maintenance: "Soporte técnico 3 meses inc.",
        icon: <CheckCircle2 className="w-10 h-10" />,
        color: "from-indigo-500 via-purple-500 to-pink-500",
        popular: false
    },
    {
        title: "Crecimiento Pro",
        price: "$4.000.000",
        annual: "$600.000",
        time: "7–10 días",
        description: "Estrategia para atraer y convertir.",
        features: [
            "Todo lo anterior",
            "SEO Avanzado",
            "Campaña Marketing",
            "Pasarela de pagos",
            "Soporte completo"
        ],
        maintenance: "Optimización y soporte pro",
        icon: <Terminal className="w-10 h-10" />,
        color: "from-purple-600 to-fuchsia-600",
        popular: false
    },
    {
        title: "A tu Medida",
        price: "A cotizar",
        annual: "A cotizar",
        time: "Variable",
        description: "Funcionalidad y diseño único.",
        features: [
            "Sitio flexible 100%",
            "Integraciones especiales",
            "Marketing avanzado",
            "Accesibilidad web",
            "Mantenimiento a medida"
        ],
        maintenance: "Según alcance del contrato",
        icon: <Smartphone className="w-10 h-10" />,
        color: "from-slate-700 to-slate-900",
        popular: false
    }
];

const WebPlans = () => {
    const openWhatsApp = (planTitle: string) => {
        const phoneNumber = '573184022999';
        const message = encodeURIComponent(`Hola Nexus, me gustaría obtener información detallada sobre el plan de Desarrollo Web: ${planTitle}.`);
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    return (
        <section id="planes" className="relative py-32 px-4 overflow-hidden bg-[#030712]">
            {/* Fondo decorativo consistente */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500 rounded-full blur-[100px] md:blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[100px] md:blur-[150px]" />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block mb-6 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm">
                            <span className="text-sm font-semibold text-cyan-400 tracking-wider uppercase flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> Tarifas de Desarrollo
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Nuestros <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Planes Web</span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light px-4">
                            Inversiones inteligentes para negocios que buscan escalabilidad y diseño de primer nivel.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-24">
                    {webPlans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            className={`relative group bg-slate-900/50 backdrop-blur-xl border transition-all duration-500 rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] ${plan.popular 
                                ? 'border-cyan-500/40 ring-1 ring-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]' 
                                : 'border-white/5'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-cyan-500/20 whitespace-nowrap z-20">
                                    Más Recomendado
                                </div>
                            )}

                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white shadow-lg shadow-cyan-500/10 group-hover:scale-110 transition-transform duration-500`}>
                                        {React.cloneElement(plan.icon as React.ReactElement<any>, { className: 'w-7 h-7' })}
                                    </div>
                                    <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{plan.time}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-cyan-400 transition-colors">{plan.title}</h3>
                                <div className="mb-4">
                                    <p className="text-white font-bold text-2xl tracking-wide">{plan.price}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Anual: <span className="text-slate-400">{plan.annual}</span></p>
                                </div>
                                <p className="text-slate-400 mb-6 leading-tight font-light text-xs min-h-[40px]">
                                    {plan.description}
                                </p>

                                <div className="space-y-3 mb-8">
                                    {plan.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-start gap-2 text-[11px] text-slate-300 group/item">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                                            <span className="group-hover/item:text-white transition-colors">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="mb-4 p-2 bg-black/40 rounded-lg border border-white/5">
                                    <p className="text-[9px] text-slate-500 leading-tight text-center italic">
                                        {plan.maintenance}
                                    </p>
                                </div>
                                <button
                                    onClick={() => openWhatsApp(plan.title)}
                                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold tracking-[0.1em] uppercase text-[10px] transition-all duration-500 ${plan.popular
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02]'
                                        : 'border border-white/10 text-white hover:border-cyan-500/50 hover:bg-cyan-500/10'
                                        }`}
                                >
                                    Elegir Plan <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <Zap className="w-5 h-5" />, title: "Hyper Speed", desc: "Optimización Lighthouse Pro." },
                        { icon: <Smartphone className="w-5 h-5" />, title: "Mobile First", desc: "Adaptabilidad total." },
                        { icon: <Search className="w-5 h-5" />, title: "SEO Ready", desc: "Estructura para Google." },
                        { icon: <ShieldCheck className="w-5 h-5" />, title: "Next-Gen Tech", desc: "Stack tecnológico 2025." }
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-white/5 flex flex-col gap-4 hover:border-cyan-500/30 hover:bg-slate-900/80 transition-all duration-300 group">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/20 transition-colors">{item.icon}</div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                                <p className="text-slate-500 text-xs font-light group-hover:text-slate-400 transition-colors">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WebPlans;
