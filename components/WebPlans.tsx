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
        color: "from-[#FFD700] to-[#FFA500]",
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
        color: "from-[#FFA500] to-[#FF8C00]",
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
        color: "from-[#FFD700] via-[#FFA500] to-[#FF4500]",
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
        color: "from-blue-500 to-purple-600",
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
        color: "from-gray-700 to-gray-900",
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
        <section id="planes" className="relative py-32 px-4 overflow-hidden bg-[#050505]">
            {/* Fondo decorativo consistente */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#FFD700] rounded-full blur-[100px] md:blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FFA500] rounded-full blur-[100px] md:blur-[150px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block mb-6 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5">
                            <span className="text-sm font-semibold text-[#FFD700] tracking-wider uppercase flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> Tarifas de Desarrollo
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Nuestros <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Planes Web</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light px-4">
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
                            className={`relative group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border transition-all duration-500 rounded-3xl p-6 flex flex-col justify-between hover:border-[#FFD700]/50 hover:shadow-[0_20px_60px_rgba(255,215,0,0.1)] ${plan.popular ? 'border-[#FFD700]/40 ring-1 ring-[#FFD700]/20 shadow-[0_0_40px_rgba(255,215,0,0.1)]' : 'border-[#FFD700]/10'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-[8px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-xl whitespace-nowrap z-20">
                                    Más Recomendado
                                </div>
                            )}

                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-black shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                        {React.cloneElement(plan.icon as React.ReactElement<any>, { className: 'w-7 h-7' })}
                                    </div>
                                    <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{plan.time}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-[#FFD700] transition-colors">{plan.title}</h3>
                                <div className="mb-4">
                                    <p className="text-[#FFD700] font-black text-2xl tracking-wide">{plan.price}</p>
                                    <p className="text-[10px] text-gray-500 font-medium">Anual: <span className="text-gray-300">{plan.annual}</span></p>
                                </div>
                                <p className="text-gray-400 mb-6 leading-tight font-light text-xs min-h-[40px]">
                                    {plan.description}
                                </p>

                                <div className="space-y-3 mb-8">
                                    {plan.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-start gap-2 text-[11px] text-gray-300 group/item">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD700] shrink-0 mt-0.5" />
                                            <span className="group-hover/item:text-white transition-colors">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="mb-4 p-2 bg-black/40 rounded-lg border border-white/5">
                                    <p className="text-[9px] text-gray-500 leading-tight text-center italic">
                                        {plan.maintenance}
                                    </p>
                                </div>
                                <button
                                    onClick={() => openWhatsApp(plan.title)}
                                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black tracking-[0.1em] uppercase text-[10px] transition-all duration-500 ${plan.popular
                                        ? 'bg-[#FFD700] text-black hover:bg-white shadow-[0_15px_30px_rgba(255,215,0,0.3)]'
                                        : 'border border-[#FFD700]/30 text-white hover:bg-[#FFD700] hover:text-black'
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
                        <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4 hover:border-[#FFD700]/20 transition-all duration-300">
                            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700]">{item.icon}</div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                                <p className="text-gray-500 text-xs font-light">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WebPlans;
