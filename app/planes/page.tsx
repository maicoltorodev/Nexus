'use client';

import React, { useCallback, useMemo, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Rocket, Zap, CheckCircle2, Terminal, Smartphone, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButton from '@/components/FloatingButton';

// --- Types & Data ---
interface Plan {
    id: string;
    title: string;
    price: string;
    annual: string;
    description: string;
    features: string[];
    icon: React.ElementType;
    color: string;
    popular?: boolean;
    idealFor?: string;
    bgGlow: string;
    accentColor: string;
    shadowColor: string;
    splitAt?: number;
}

const webPlans: Plan[] = [
    {
        id: "lanzamiento",
        title: "Lanzamiento Web",
        price: "$600.000",
        annual: "$200.000",
        description: "Presencia digital inmediata para profesionales y pequeños negocios.",
        features: ["Arquitectura One-Page", "Vista Móvil Adaptada", "Google Maps Integrado", "Certificado SSL", "Botón WhatsApp Estratégico", "Hosting y Dominio Incluido x 1 año", "Soporte x 1 semana", "Entrega: 1–3 días"],
        icon: Rocket,
        color: "from-cyan-400 to-blue-500",
        bgGlow: "rgba(34, 211, 238, 0.15)",
        accentColor: "cyan",
        shadowColor: "#22d3ee",
        idealFor: "Emprendedores y Proyectos Rápidos"
    },
    {
        id: "funcional",
        title: "Sitio Funcional",
        price: "$1.300.000",
        annual: "$350.000",
        description: "Diseñado para negocios en crecimiento que requieren una estructura sólida y múltiples secciones.",
        features: ["Todo el Plan Lanzamiento", "Hasta 5 Páginas Internas", "Diseño Personalizado", "Respaldos Automáticos", "Optimización SEO Inicial", "Soporte x 1 mes", "Entrega: 4–6 días"],
        icon: Zap,
        color: "from-emerald-400 to-green-500",
        popular: true,
        idealFor: "Negocios en crecimiento y PYMES",
        bgGlow: "rgba(16, 185, 129, 0.15)",
        accentColor: "emerald",
        shadowColor: "#10b981"
    },
    {
        id: "experiencia",
        title: "Experiencia Cliente",
        price: "$2.800.000",
        annual: "$500.000",
        description: "Transforma tu sitio en una plataforma de gestión. Ideal para agendamiento o procesos automatizados.",
        features: ["Todo el Plan Funcional", "Arquitectura de Conversión", "Agendamiento o Catálogo", "Estrategia SEO Avanzada", "Reportes Mensuales", "Soporte x 2 meses", "Entrega: 5–7 días"],
        icon: CheckCircle2,
        color: "from-purple-600 to-fuchsia-600",
        idealFor: "Clínicas, Agencias y Empresas de Servicios",
        bgGlow: "rgba(232, 121, 249, 0.15)",
        accentColor: "purple",
        shadowColor: "#a855f7"
    },
    {
        id: "crecimiento",
        title: "Crecimiento Pro",
        price: "$4.000.000",
        annual: "$600.000",
        description: "Activo estratégico de alto impacto enfocado 100% en la conversión y liderazgo de mercado.",
        features: ["Todo el Plan Experiencia", "Chatbot con IA 24/7", "Marketing Estratégico", "Pasarela de Pagos o CRM", "Diseño UI/UX Único", "Soporte x 3 meses", "Entrega: 10–13 días"],
        icon: Terminal,
        color: "from-red-500 to-rose-600",
        idealFor: "Inmobiliarias, E-commerce, Academias Digitales y Negocios Escalables",
        bgGlow: "rgba(239, 68, 68, 0.15)",
        accentColor: "red",
        shadowColor: "#ef4444"
    },
    {
        id: "medida",
        title: "A tu Medida",
        price: "A cotizar",
        annual: "A cotizar",
        description: "Para proyectos con requerimientos técnicos específicos o aplicaciones web escalables.",
        features: ["Desarrollo a Medida", "Integraciones vía API", "Marketing Full Stack", "Dashboards de Datos", "Auditoría Accesibilidad"],
        icon: Smartphone,
        color: "from-[#FFD700] to-[#FFA500]",
        bgGlow: "rgba(255, 215, 0, 0.15)",
        accentColor: "yellow",
        shadowColor: "#FFD700",
        idealFor: "Startups y Proyectos Muy Específicos",
        splitAt: 2
    }
];

// --- Sub-components ---

const FeatureItem = React.memo(({ text, colorClass }: { text: string, colorClass: string }) => (
    <div className="flex items-start justify-center lg:justify-start gap-3 group/item text-center lg:text-left">
        <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center p-0.5`}>
            <CheckCircle2 className="w-full h-full text-white" />
        </div>
        <span className="text-sm md:text-base text-slate-300 group-hover/item:text-white transition-colors leading-snug">
            {text}
        </span>
    </div>
));

FeatureItem.displayName = 'FeatureItem';

const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const cardVariants = (isEven: boolean) => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
});

// --- PlanCardVisual Component ---

const PlanCardVisual = ({ plan, isEven }: { plan: Plan, isEven: boolean }) => {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    // Escala suave: 90% en bordes, 100% en el centro.
    // Usamos will-change para optimizar GPU.
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.93, 1.05, 0.93]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.8, 1, 1, 1, 0.8]);
    const borderColor = useTransform(scrollYProgress, [0, 0.5, 1], ['rgba(255, 255, 255, 0.1)', plan.shadowColor, 'rgba(255, 255, 255, 0.1)']);

    return (
        <motion.div
            ref={cardRef}
            style={{
                scale,
                opacity,
                willChange: "transform, opacity"
            }}
            className="flex-1 w-full max-w-xl order-1 lg:order-none"
        >
            <div className="relative aspect-square md:aspect-[4/3] group">
                {/* Glow BG */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-5 rounded-[3rem] md:blur-[80px] md:animate-pulse`} />

                {/* Card Content */}
                <motion.div
                    style={{ borderColor }}
                    className="absolute inset-0 bg-[#0f0b1f]/60 border rounded-[3rem] p-8 md:p-12 flex flex-col justify-center items-center text-center transition-colors duration-500 hover:bg-[#0f0b1f]/80"
                >
                    {plan.popular && (
                        <div className={`absolute -top-1 right-10 bg-gradient-to-r ${plan.color} text-white text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-b-xl shadow-lg font-[family-name:var(--font-orbitron)]`}>
                            Recomendado
                        </div>
                    )}
                    <div className={`w-24 h-24 md:w-32 md:h-32 mb-8 rounded-3xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6`}>
                        <plan.icon className="w-12 h-12 md:w-16 md:h-16" />
                    </div>
                    <div className="relative mb-6">
                        <h3
                            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text tracking-tight bg-[length:200%_auto]"
                            style={{
                                backgroundImage: `linear-gradient(90deg, ${plan.shadowColor}, ${plan.shadowColor}99, ${plan.shadowColor}, ${plan.shadowColor}99, ${plan.shadowColor})`,
                                animation: 'gradient 3s linear infinite'
                            }}
                        >
                            {plan.price}
                        </h3>
                        {/* Glow pulsante detrás del precio */}
                        <div
                            className="absolute inset-0 blur-xl opacity-30 animate-pulse"
                            style={{
                                background: `radial-gradient(circle, ${plan.shadowColor}60 0%, transparent 70%)`
                            }}
                        />
                    </div>

                    <style jsx>{`
                        @keyframes gradient {
                            0% { background-position: 0% 50%; }
                            100% { background-position: 200% 50%; }
                        }
                    `}</style>

                    <div className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm uppercase font-bold tracking-wider text-slate-300">
                        Anualidad: <span className="text-white font-black">{plan.annual}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 uppercase tracking-[0.2em] animate-pulse">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 1er Año Incluido
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

// --- Mobile Plan Card Component (con efecto de foco en scroll) ---
const MobilePlanCard = ({ plan, openWhatsApp }: { plan: Plan, openWhatsApp: (title: string) => void }) => {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "center center", "end start"]
    });

    // Efecto más sutil y optimizado para móvil
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);

    return (
        <motion.div
            ref={cardRef}
            style={{
                scale,
                opacity,
                willChange: "transform, opacity",
                borderColor: plan.shadowColor,
                boxShadow: `0 0 20px -5px ${plan.shadowColor}40`
            }}
            className="relative rounded-[3rem] overflow-hidden border bg-[#0f0b1f]/60"
        >
            {/* Glow de fondo suave */}
            <div className={`absolute inset-0 bg-gradient-to-b ${plan.color} opacity-5 md:opacity-0`} />

            <div className="relative p-8 flex flex-col items-center text-center">
                {/* Badge Recomendado */}
                {plan.popular && (
                    <div className={`absolute top-0 right-0 left-0 mx-auto w-max bg-gradient-to-r ${plan.color} text-white text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-b-xl shadow-lg font-[family-name:var(--font-orbitron)]`}>
                        Recomendado
                    </div>
                )}

                {/* Título */}
                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
                    {plan.title.split(' ').slice(0, plan.splitAt || 1).join(' ')} <span className={`bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>{plan.title.split(' ').slice(plan.splitAt || 1).join(' ')}</span>
                </h3>

                {/* Descripción */}
                <p className="text-sm text-slate-400 font-light leading-relaxed mb-6 max-w-xs mx-auto">
                    {plan.description}
                </p>

                {/* Precio */}
                <div className="mb-2 relative">
                    <span
                        className={`text-5xl font-black text-transparent bg-clip-text tracking-tight animate-gradient bg-[length:200%_auto]`}
                        style={{
                            backgroundImage: `linear-gradient(90deg, ${plan.shadowColor}, ${plan.shadowColor}99, ${plan.shadowColor}, ${plan.shadowColor}99, ${plan.shadowColor})`,
                            animation: 'gradient 3s linear infinite'
                        }}
                    >
                        {plan.price}
                    </span>
                    {/* Glow pulsante detrás del precio */}
                    <div
                        className="absolute inset-0 blur-xl opacity-30 animate-pulse"
                        style={{
                            background: `radial-gradient(circle, ${plan.shadowColor}60 0%, transparent 70%)`
                        }}
                    />
                </div>

                {/* Anualidad */}
                <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-wider text-slate-300 mb-8">
                    Anualidad: <span className="text-white font-black">{plan.annual}</span>
                </div>

                {/* Features */}
                <div className="w-full space-y-3 mb-10 px-2">
                    {plan.features.map((f, i) => (
                        <div key={i} className="flex items-start justify-center gap-3">
                            <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center p-0.5`}>
                                <CheckCircle2 className="w-full h-full text-white" />
                            </div>
                            <span className="text-sm text-slate-300 text-left">{f}</span>
                        </div>
                    ))}
                </div>

                {/* Botón */}
                <button
                    onClick={() => openWhatsApp(plan.title)}
                    className="group w-full py-5 rounded-full flex items-center justify-center gap-3 font-bold uppercase text-[10px] tracking-widest transition-all glass-panel-inz border font-[family-name:var(--font-orbitron)] relative overflow-hidden active:scale-95"
                    style={{
                        '--glow-color': plan.shadowColor,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: `0 0 0 1px ${plan.shadowColor}40`
                    } as React.CSSProperties}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    Solicitar Plan <ArrowRight className="w-5 h-5" />
                    <div className="absolute inset-0 rounded-full opacity-20 pointer-events-none" style={{ boxShadow: `inset 0 0 15px ${plan.shadowColor}` }} />
                </button>
            </div>
        </motion.div>
    );
};

// --- Main Page ---

export default function PlansPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const openWhatsApp = useCallback((planTitle: string) => {
        const msg = encodeURIComponent(`Hola NEXUS, me gustaría obtener información sobre el plan: ${planTitle}.`);
        window.open(`https://wa.me/573184022999?text=${msg}`, '_blank');
    }, []);

    return (
        <main className="bg-[#030712] min-h-screen text-white overflow-x-hidden selection:bg-[#FFD700] selection:text-black">
            <Navbar isMenuOpen={isMenuOpen} onMenuToggle={setIsMenuOpen} />

            {/* Hero */}
            <section className="relative pt-48 pb-32 px-4 bg-[#0a0a0a]">
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.08)_0%,transparent_60%)]" />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
                        <div className="inline-block mb-4 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5 text-sm font-semibold text-[#FFD700] uppercase tracking-wider">
                            Presencia Digital
                        </div>
                        <h1 className="text-4xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight">
                            Estrategias de <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Inversión Web</span>
                        </h1>
                        <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light mb-8 md:mb-12">
                            Fusionamos el diseño de <span className="text-white font-medium">NE<span className="text-[#FFD700] font-black">X</span>US</span> con la tecnología de <span className="font-[family-name:var(--font-orbitron)] bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent font-bold">InZidium</span>.
                        </p>

                        {/* Alliance Visual */}
                        <div className="flex justify-center mb-12">
                            <div className="relative inline-flex items-center gap-6 md:gap-10 px-8 py-5 md:py-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-[#FFD700]/20 hover:bg-white/10 transition-all duration-500 group">
                                {/* Label 'Alianza' flotante */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-4 py-1 rounded-full border border-white/10 shadow-xl z-20">
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] bg-gradient-to-r from-[#FFD700] via-white to-purple-500 bg-clip-text text-transparent">
                                        Alianza
                                    </span>
                                </div>

                                {/* Logo Nexus (X) */}
                                <div className="relative w-10 h-10 md:w-14 md:h-14 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                                    <Image
                                        src="/X.webp"
                                        alt="Nexus"
                                        fill
                                        className="object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.2)]"
                                        sizes="(max-width: 768px) 40px, 56px"
                                    />
                                </div>

                                {/* Separador */}
                                <span className="text-xl md:text-2xl text-white/20 font-light">✕</span>

                                {/* Logo InZidium */}
                                <div className="relative w-10 h-10 md:w-14 md:h-14 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
                                    <Image
                                        src="/logo-inzidium.webp"
                                        alt="InZidium"
                                        fill
                                        className="object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                                        sizes="(max-width: 768px) 40px, 56px"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6">
                            {['Velocidad', 'SEO', 'Conversión', 'Seguridad'].map(tag => (
                                <div key={tag} className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest font-[family-name:var(--font-orbitron)]">
                                    <CheckCircle2 className="w-4 h-4 text-[#FFD700]" /> {tag}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- DESKTOP VIEW (Grandes Secciones) --- */}
            <div className="hidden lg:block">
                {webPlans.map((plan, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                        <section key={plan.id} id={plan.id} className={`py-40 px-4 border-b border-white/5 relative overflow-hidden ${isEven ? 'bg-[#030014]' : 'bg-[#05001a]'}`}>
                            <div className={`absolute inset-0 pointer-events-none opacity-10 blur-[120px] rounded-full w-1/2 h-full ${isEven ? 'right-0' : 'left-0'}`} style={{ backgroundColor: plan.bgGlow }} />

                            <div className="max-w-7xl mx-auto relative z-10">
                                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>

                                    {/* Visual Card (Price) */}
                                    <PlanCardVisual plan={plan} isEven={isEven} />

                                    {/* Content Details */}
                                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInVariants} className="flex-1 text-center lg:text-left order-2 lg:order-none">
                                        {/* Desktop-Only Header */}
                                        <div className="hidden lg:block">
                                            {plan.idealFor && (
                                                <div className="flex items-center justify-start gap-2 mb-4 font-bold text-xs uppercase tracking-widest font-[family-name:var(--font-orbitron)]">
                                                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: plan.shadowColor, boxShadow: `0 0 8px ${plan.shadowColor}` }} />
                                                    <span style={{ color: plan.shadowColor }}>Ideal:</span>
                                                    <span className="text-white">{plan.idealFor}</span>
                                                </div>
                                            )}
                                            <h2 className="text-6xl font-bold mb-6 tracking-tighter">
                                                {plan.title.split(' ').slice(0, plan.splitAt || 1).join(' ')} <span className={`bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>{plan.title.split(' ').slice(plan.splitAt || 1).join(' ')}</span>
                                            </h2>
                                        </div>

                                        <p className="text-lg text-slate-400 font-light leading-relaxed mb-8 font-[family-name:var(--font-orbitron)] max-w-2xl mx-auto lg:mx-0">{plan.description}</p>
                                        <div className="grid grid-cols-2 gap-4 mb-0 text-left">
                                            {plan.features.map(f => <FeatureItem key={f} text={f} colorClass={plan.color} />)}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Plan CTA Centralizado */}
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeInVariants}
                                    className="w-full flex justify-center mt-24 pb-4"
                                >
                                    <button
                                        onClick={() => openWhatsApp(plan.title)}
                                        className="group w-auto px-12 py-6 rounded-full flex items-center justify-center gap-4 font-bold uppercase text-[11px] tracking-widest transition-all glass-panel-inz border hover:scale-105 font-[family-name:var(--font-orbitron)] relative overflow-hidden"
                                        style={{
                                            '--glow-color': plan.shadowColor,
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                            boxShadow: `0 0 0 1px ${plan.shadowColor}40`
                                        } as React.CSSProperties}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        Solicitar Plan <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                        {/* Glow on hover */}
                                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `inset 0 0 20px ${plan.shadowColor}` }} />
                                    </button>
                                </motion.div>
                            </div>
                        </section>
                    );
                })}
            </div>


            {/* --- MOBILE VIEW (Tarjetas Compactas - Visual Similar a Desktop) --- */}
            <div className="lg:hidden flex flex-col gap-32 px-4 pb-24 pt-10">
                {webPlans.map((plan) => (
                    <MobilePlanCard key={plan.id} plan={plan} openWhatsApp={openWhatsApp} />
                ))}
            </div>

            {/* Final CTA - Nexus Style */}
            <section className="py-40 px-4 relative overflow-hidden bg-[#050505] text-center border-t border-white/5">
                {/* Decorative backgrounds */}
                < div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-10 blur-[120px] pointer-events-none bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] rounded-full" />

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInVariants}
                    className="relative z-10 max-w-5xl mx-auto"
                >
                    <div className="inline-block mb-4 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5">
                        <span className="text-sm font-semibold text-[#FFD700] tracking-wider uppercase">El momento es ahora</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-10 tracking-tight">
                        ¿Quieres subir de <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Nivel?</span>
                    </h2>

                    <div className="flex flex-col items-center gap-12">
                        <button
                            onClick={() => openWhatsApp('información sobre los planes web')}
                            className="group relative px-10 md:px-16 py-6 md:py-8 rounded-full font-black uppercase tracking-widest text-xs md:text-sm transition-all duration-500 bg-[#FFD700] text-black hover:scale-105 hover:shadow-[0_20px_60px_rgba(255,215,0,0.4)] overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Hablar con un Experto <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-20 opacity-40">
                            {[
                                { t: 'Branding', d: 'Identidad que Impacta' },
                                { t: 'Estrategia', d: 'Crecimiento' },
                                { t: 'Resultados', d: 'Conversión Real' }
                            ].map((item) => (
                                <div key={item.t} className="flex flex-col items-center gap-1">
                                    <span className="text-[12px] font-black uppercase tracking-[0.4em] font-[family-name:var(--font-orbitron)] text-white">{item.t}</span>
                                    <span className="text-[10px] text-gray-400 font-light">{item.d}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section >

            <Footer />
            <FloatingButton isMenuOpen={isMenuOpen} />
        </main >
    );
}
