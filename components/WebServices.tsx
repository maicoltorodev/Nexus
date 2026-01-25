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

const webPlans = [
    {
        title: "Landing Page",
        description: "Diseños de una sola página optimizados para convertir visitantes en clientes. Ideal para lanzamientos o promociones específicas.",
        features: ["Diseño Responsive", "Formulario de Contacto", "Integración RRSS", "Velocidad de carga extrema"],
        icon: <Rocket className="w-8 h-8" />,
        color: "from-[#FFD700] to-[#FFA500]"
    },
    {
        title: "Sitio Corporativo",
        description: "Presencia profesional completa para tu empresa. Múltiples secciones, blogs y diseño que proyecta autoridad.",
        features: ["Hasta 5 secciones", "Blog Autogestionable", "Optimización SEO", "Diseño Premium"],
        icon: <Code className="w-8 h-8" />,
        color: "from-[#FFA500] to-[#FF8C00]"
    },
    {
        title: "E-Commerce",
        description: "Tu tienda abierta las 24 horas. Gestión de inventario, pagos online y experiencia de compra optimizada.",
        features: ["Carrito de Compras", "Pasarela de Pagos", "Gestión de Productos", "Panel de Administración"],
        icon: <ShieldCheck className="w-8 h-8" />,
        color: "from-[#FFD700] via-[#FFA500] to-[#FF4500]"
    }
];

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
                className="absolute -top-10 -left-10 z-20 bg-black/80 backdrop-blur-xl border border-[#FFD700]/30 p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_30px_rgba(255,215,0,0.2)]"
            >
                <div className="w-12 h-12 rounded-full border-4 border-[#FFD700] flex items-center justify-center font-black text-[#FFD700]">99</div>
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

                {/* Browser Content (Code Section) */}
                <div className="p-8 font-mono text-sm space-y-2 relative">
                    <div className="flex gap-2 text-blue-400"><span>const</span> <span className="text-purple-400">NexusProject</span> = <span className="text-yellow-400">async</span> () ={">"} {"{"}</div>
                    <div className="pl-4 text-gray-400">await <span className="text-blue-400">optimize</span>({"{"}</div>
                    <div className="pl-8 text-gray-500">performance: <span className="text-green-500">'ultra-fast'</span>,</div>
                    <div className="pl-8 text-gray-500">design: <span className="text-green-500">'premium'</span>,</div>
                    <div className="pl-8 text-gray-500">seo: <span className="text-yellow-400">true</span></div>
                    <div className="pl-4 text-gray-400">{"}"});</div>
                    <div className="pl-4 text-pink-400">return <span className="text-blue-400">success</span>;</div>
                    <div className="text-blue-400">{"}"};</div>

                    {/* Floating UI Elements over code */}
                    <motion.div
                        animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-10 right-10 bg-gradient-to-br from-[#FFD700] to-[#FFA500] p-4 rounded-xl text-black font-black flex items-center gap-2 shadow-xl"
                    >
                        <Smartphone className="w-5 h-5" /> 100% RESPONSIVE
                    </motion.div>

                    {/* Cursor effect */}
                    <motion.div
                        animate={{ x: [100, 300, 150], y: [100, 50, 200] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute pointer-events-none"
                    >
                        <MousePointer2 className="w-6 h-6 text-[#FFD700] fill-[#FFD700] drop-shadow-lg" />
                        <div className="ml-4 mt-2 px-2 py-1 bg-white text-[10px] text-black font-bold rounded shadow-lg uppercase">Nexus Design</div>
                    </motion.div>
                </div>
            </div>

            {/* Rear perspective panels */}
            <div className="absolute inset-0 bg-[#FFD700]/5 -z-10 rounded-3xl blur-2xl group-hover:bg-[#FFD700]/10 transition-colors" />
        </motion.div>
    );
};

const WebServices = () => {
    const openWhatsApp = (planTitle: string) => {
        const phoneNumber = '573184022999';
        const message = encodeURIComponent(`Hola Nexus, me gustaría obtener información sobre el plan de Sitio Web: ${planTitle}.`);
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    return (
        <section id="web-design" className="relative py-32 px-4 overflow-hidden bg-[#0a0a0a]">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#FFD700]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#FFA500]/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

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
                            No solo hacemos páginas, construimos experiencias digitales de alto impacto que impulsan el crecimiento de tu negocio bajo el sello de calidad de <span className="text-white font-medium">Nexus</span>.
                        </p>
                    </motion.div>
                </div>

                {/* MOCKUP VIVO SECTION */}
                <BrowserMockup />

                {/* Features Row - Reimagined */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 max-w-5xl mx-auto">
                    {[
                        { icon: <Zap className="text-[#FFD700]" />, text: "Velocidad Ultra Rápida", desc: "< 1s Carga" },
                        { icon: <Smartphone className="text-[#FFD700]" />, text: "100% Mobile Friendly", desc: "Adaptive UI" },
                        { icon: <Search className="text-[#FFD700]" />, text: "SEO Optimizado", desc: "Google Ready" },
                        { icon: <ShieldCheck className="text-[#FFD700]" />, text: "Seguridad SSL", desc: "HTTPS Active" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group flex flex-col items-center p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] backdrop-blur-md hover:bg-white/[0.05] hover:border-[#FFD700]/30 transition-all duration-300"
                        >
                            <div className="mb-4 p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{item.icon}</div>
                            <span className="text-white text-sm font-bold text-center mb-1">{item.text}</span>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{item.desc}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Pricing/Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {webPlans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            whileHover={{ y: -10 }}
                            className="group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-8 md:p-10 overflow-hidden flex flex-col justify-between shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div>
                                <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${plan.color} flex items-center justify-center text-black mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{plan.title}</h3>
                                <p className="text-gray-400 mb-8 leading-relaxed font-light text-sm">
                                    {plan.description}
                                </p>
                                <div className="space-y-4 mb-10">
                                    {plan.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-center gap-3 text-xs text-gray-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => openWhatsApp(plan.title)}
                                className="w-full py-5 rounded-2xl border border-[#FFD700]/30 text-white font-black tracking-[0.2em] uppercase text-[10px] flex items-center justify-center gap-3 group-hover:bg-[#FFD700] group-hover:text-black transition-all duration-500"
                            >
                                Solicitar Cotización <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WebServices;
