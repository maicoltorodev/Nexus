'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    CheckCircle2,
    MessageCircle,
    Instagram,
    Facebook,
    MapPin,
    Phone,
    Mail,
    ChevronRight,
    Star,
    LayoutPanelTop,
    Shield,
    Music2 as Tiktok,
    X as XIcon,
    RefreshCcw,
    Menu // Importar Menu para el botón móvil
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// --- CONFIGURACIÓN DE TEMAS DINÁMICOS ---
type Theme = {
    id: string;
    name: string;
    bg: string;
    bgMuted: string;
    primary: string;
    accent: string;
    text: string;
    textMuted: string;
};

const THEMES: Theme[] = [
    {
        id: 'cyber',
        name: 'Cyber Nexus',
        bg: '#020617', // Slate 950
        bgMuted: '#01030e',
        primary: '#22d3ee', // Cyan 400
        accent: '#3b82f6', // Blue 500
        text: '#ffffff',
        textMuted: '#94a3b8',
    },
    {
        id: 'light',
        name: 'Pure Light',
        bg: '#ffffff',
        bgMuted: '#f8fafc',
        primary: '#2563eb', // Blue 600
        accent: '#0f172a', // Slate 900
        text: '#0f172a',
        textMuted: '#64748b',
    },
    {
        id: 'gold',
        name: 'Luxury Gold',
        bg: '#0a0a05',
        bgMuted: '#050502',
        primary: '#fbbf24', // Amber 400
        accent: '#f59e0b', // Amber 500
        text: '#ffffff',
        textMuted: '#a8a29e',
    },
    {
        id: 'ocean',
        name: 'Ocean Breeze',
        bg: '#ffffff',
        bgMuted: '#f0f9ff',
        primary: '#0ea5e9', // Sky 500
        accent: '#0369a1', // Sky 700
        text: '#0c4a6e',
        textMuted: '#3ea5d9',
    },
    {
        id: 'forest',
        name: 'Deep Forest',
        bg: '#020d08',
        bgMuted: '#010604',
        primary: '#10b981', // Emerald 500
        accent: '#059669', // Emerald 600
        text: '#ffffff',
        textMuted: '#94a3b8',
    },
    {
        id: 'velvet',
        name: 'Royal Velvet',
        bg: '#ffffff',
        bgMuted: '#faf5ff',
        primary: '#8b5cf6', // Violet 500
        accent: '#4c1d95', // Violet 900
        text: '#2e1065',
        textMuted: '#7c3aed',
    },
    {
        id: 'crimson',
        name: 'Crimson Tech',
        bg: '#0d0202',
        bgMuted: '#060101',
        primary: '#ef4444', // Red 500
        accent: '#b91c1c', // Red 700
        text: '#ffffff',
        textMuted: '#a8a29e',
    },
    {
        id: 'rose',
        name: 'Rose Garden',
        bg: '#ffffff',
        bgMuted: '#fff1f2',
        primary: '#f43f5e', // Rose 500
        accent: '#9f1239', // Rose 800
        text: '#4c0519',
        textMuted: '#e11d48',
    }
];

// --- COMPONENTE RASTRO DE PARTÍCULAS (MouseTrail) - Optimizado para Hipervelocidad ---
const MouseTrail = ({ color }: { color: string }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const particles = React.useRef<{ x: number, y: number, radius: number, opacity: number }[]>([]);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Limitar creación de partículas para rendimiento extremo
            if (particles.current.length < 20) {
                particles.current.push({
                    x: e.clientX,
                    y: e.clientY,
                    radius: 1.5,
                    opacity: 0.5
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = color;

            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                p.opacity -= 0.025;
                p.radius *= 0.96;

                if (p.opacity <= 0) {
                    particles.current.splice(i, 1);
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        handleResize();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [color]);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9998]" />;
};

// --- COMPONENTE CURSOR PERSONALIZADO - Versión Minimalista y Veloz ---
// --- COMPONENTE CURSOR PERSONALIZADO - Versión Minimalista y Veloz ---
const CustomCursor = ({ forceHidden }: { forceHidden: boolean }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            const target = e.target as HTMLElement;
            setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
            setIsVisible(true);
        };
        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    const shouldHide = !isVisible || forceHidden;

    return (
        <div className={`hidden lg:block pointer-events-none fixed inset-0 z-[100000] transition-opacity duration-300 ${shouldHide ? 'opacity-0' : 'opacity-100'}`}>
            {/* Outer Square - Solo Color de Marca, Máxima Fluidez */}
            <motion.div
                className="fixed top-0 left-0 w-6 h-6 border-2 border-[var(--primary)] rounded-sm shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                animate={{
                    x: position.x - 12,
                    y: position.y - 12,
                    rotate: isPointer ? 45 : 0,
                    scale: isPointer ? 1.4 : isClicking ? 0.8 : 1,
                    backgroundColor: isPointer ? 'var(--primary)' : 'rgba(255, 255, 255, 0)'
                }}
                transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.4 }}
            />
            {/* Inner Dot */}
            <motion.div
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-[var(--primary)] rounded-full"
                animate={{
                    x: position.x - 3,
                    y: position.y - 3,
                }}
                transition={{ type: "spring", damping: 25, stiffness: 500, mass: 0.1 }}
            />
        </div>
    );
};

// Componente Badge Dinámico
const DynamicBadge = ({ children }: { children: React.ReactNode }) => (
    <div className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest mb-4 hover:bg-[var(--primary)]/10 hover:scale-105 transition-all cursor-default select-none">
        {children}
    </div>
);

export default function DemoEstandar() {
    const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
    const [modalType, setModalType] = useState<'call' | 'product' | 'social' | 'info' | 'logo' | 'whatsapp' | 'welcome' | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
    const [isHoveringMap, setIsHoveringMap] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para menú móvil

    // Abrir modal de bienvenida al iniciar
    useEffect(() => {
        const timer = setTimeout(() => {
            setModalType('welcome');
        }, 1000); // Pequeño delay para que la transición de entrada se aprecie mejor
        return () => clearTimeout(timer);
    }, []);

    const openCallModal = () => {
        setModalType('call');
        setSelectedProduct(null);
    };

    const openWhatsAppModal = () => {
        setModalType('whatsapp');
        setSelectedProduct(null);
    };

    const openLogoModal = () => {
        setModalType('logo');
        setSelectedProduct(null);
    };

    const openInfoModal = () => {
        setModalType('info');
        setSelectedProduct(null);
    };

    const openSocialModal = () => {
        setModalType('social');
        setSelectedProduct(null);
    };

    const openProductModal = (index: number) => {
        setModalType('product');
        setSelectedProduct(index);
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedProduct(null);
    };

    // Inyectar variables CSS dinámicamente
    // Las variables CSS se inyectan directamente en el bloque de estilo global para un mejor rendimiento y compatibilidad.
    // const themeStyles = {
    //     '--bg': currentTheme.bg,
    //     '--bg-muted': currentTheme.bgMuted,
    //     '--primary': currentTheme.primary,
    //     '--accent': currentTheme.accent,
    //     '--text': currentTheme.text,
    //     '--text-muted': currentTheme.textMuted,
    // } as React.CSSProperties;

    return (
        <div className={`bg-[var(--bg)] text-[var(--text)] min-h-screen w-full overflow-x-hidden selection:bg-[var(--primary)] selection:text-[var(--bg)] font-sans transition-colors duration-700 ${modalType ? 'cursor-auto' : 'cursor-none'}`}>

            {/* --- ESTILOS COMPLEMENTARIOS DINÁMICOS (React Standard) --- */}
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --bg: ${currentTheme.bg};
                    --bg-muted: ${currentTheme.bgMuted};
                    --primary: ${currentTheme.primary};
                    --accent: ${currentTheme.accent};
                    --text: ${currentTheme.text};
                    --text-muted: ${currentTheme.textMuted};
                }

                html, body {
                    scroll-behavior: smooth;
                    overflow-x: hidden;
                    width: 100%;
                }
                
                /* Forzar Scrollbar del Tema (Valores Reales para Máxima Compatibilidad) */
                ::-webkit-scrollbar {
                    width: 8px !important;
                    height: 8px !important;
                }

                ::-webkit-scrollbar-track {
                    background: ${currentTheme.bg} !important;
                }

                ::-webkit-scrollbar-thumb {
                    background: ${currentTheme.primary} !important;
                    border-radius: 20px !important;
                    border: 3px solid ${currentTheme.bg} !important;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: ${currentTheme.accent} !important;
                }

                /* Firefox Support */
                * {
                    scrollbar-width: thin !important;
                    scrollbar-color: ${currentTheme.primary} ${currentTheme.bg} !important;
                }

                /* Utilidades Extra */
                .no-scrollbar::-webkit-scrollbar {
                    display: none !important;
                }
            `}} />

            <MouseTrail color={currentTheme.primary} />
            <CustomCursor forceHidden={isHoveringMap} />

            {/* --- NEXUS UNIFIED CONTROL BAR --- */}
            <div className="fixed top-0 left-0 w-full bg-[var(--accent)] z-[110] py-3 md:py-4 px-4 md:px-6 shadow-2xl border-b border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-white">
                    {/* Info */}
                    <span className="hidden sm:flex text-[9px] font-black uppercase tracking-[0.4em] items-center gap-2 shrink-0 opacity-80">
                        <Shield className="w-3.5 h-3.5" /> PLAN ESTÁNDAR NEXUS
                    </span>

                    {/* Theme Selector Group */}
                    {/* Theme Selector Group */}
                    <div className="flex items-center justify-center w-full md:w-auto relative order-3 md:order-2">
                        <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/90 animate-pulse absolute right-full mr-6 whitespace-nowrap">
                            ¡Tendrás tu propio dominio!
                        </span>

                        <div className="bg-white/5 backdrop-blur-sm px-2 py-1.5 md:px-3 md:py-2 rounded-full flex gap-2 items-center justify-center">
                            {THEMES.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setCurrentTheme(theme)}
                                    title={theme.name}
                                    className={`relative w-7 h-7 md:w-8 md:h-8 rounded-full transition-all duration-300 flex items-center justify-center p-[2px] shrink-0 ${currentTheme.id === theme.id
                                        ? 'bg-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)] z-10'
                                        : 'bg-white/10 hover:bg-white/20'
                                        }`}
                                >
                                    <div className="w-full h-full rounded-full flex overflow-hidden rotate-45 border border-black/10">
                                        <div className="w-1/2 h-full" style={{ backgroundColor: theme.primary }} />
                                        <div className="w-1/2 h-full" style={{ backgroundColor: theme.bg }} />
                                    </div>

                                    {currentTheme.id === theme.id && (
                                        <motion.div
                                            layoutId="activeThemeDot"
                                            className="absolute -bottom-2 w-1 h-1 bg-white rounded-full opacity-50 hidden md:block"
                                        />
                                    )}
                                </button>
                            ))}

                        </div>
                    </div>

                    {/* Exit Button */}
                    <Link href="/planes" className="bg-white/10 hover:bg-white text-white hover:text-[var(--accent)] px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all border border-white/20 shrink-0">
                        SALIR DEL DEMO
                    </Link>
                </div>
            </div>

            {/* --- HEADER --- */}
            <header className="fixed top-[112px] sm:top-20 left-0 w-full z-50 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--text)]/10 py-3 md:py-6 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <button
                        onClick={openLogoModal}
                        className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 text-[var(--text)] hover:scale-105 transition-transform group"
                    >
                        <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center group-hover:bg-[var(--text)] transition-colors">
                            <Zap className="w-5 h-5 text-[var(--bg)] group-hover:text-[var(--primary)] transition-colors" />
                        </div>
                        <div className="text-left flex items-center gap-2">
                            NEGOCIO <span className="text-[var(--primary)] text-sm font-light tracking-widest block transform skew-x-[-15deg]">FICTICIO</span>
                        </div>
                    </button>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-[var(--text)]">
                        {[
                            { name: 'Inicio', href: '#inicio' },
                            { name: 'Nosotros', href: '#como-trabajamos' },
                            { name: 'Servicios', href: '#catalogo' },
                            { name: 'Contacto', href: '#contacto' }
                        ].map((item) => (
                            <a key={item.name} href={item.href} className="text-sm font-bold uppercase tracking-widest hover:text-[var(--primary)] transition-colors">
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        {/* Botón Llamar (Visible siempre, ajustado en móvil) */}
                        <button
                            onClick={openCallModal}
                            className="hidden md:flex bg-[var(--accent)] text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-[var(--primary)] hover:shadow-[0_0_20px_var(--primary)]/40 transition-all duration-300 active:scale-95 shadow-lg items-center gap-2"
                        >
                            <Phone className="w-3 h-3" /> <span className="hidden sm:inline">LLAMAR</span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-[var(--text)] p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden bg-[var(--bg)] border-t border-[var(--text)]/10 overflow-hidden"
                        >
                            <nav className="flex flex-col p-6 gap-4">
                                {[
                                    { name: 'Inicio', href: '#inicio' },
                                    { name: 'Nosotros', href: '#como-trabajamos' },
                                    { name: 'Servicios', href: '#catalogo' },
                                    { name: 'Contacto', href: '#contacto' }
                                ].map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="text-[var(--text)] font-black uppercase tracking-widest py-3 border-b border-[var(--text)]/5 hover:text-[var(--primary)] hover:pl-4 transition-all"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* --- HERO --- */}
            <section id="inicio" className="relative pt-48 md:pt-72 pb-16 md:pb-32 px-6 overflow-hidden scroll-mt-40">
                <div className="absolute top-0 right-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[var(--primary)]/10 blur-[80px] md:blur-[120px] rounded-full -mr-20 -mt-20 md:-mr-60 md:-mt-60 pointer-events-none" />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <DynamicBadge>Bienvenido al Futuro</DynamicBadge>
                        <h1 className="text-3xl sm:text-4xl md:text-7xl font-black mb-6 md:mb-8 leading-[1.1] md:leading-[0.9] tracking-tight uppercase pr-2 break-words">
                            NUESTRO <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">NEGOCIO FICTICIO</span>
                        </h1>
                        <p className="text-lg text-[var(--text-muted)] max-w-lg mb-12 leading-relaxed">
                            En nuestro negocio ficticio ofrecemos estos productos/servicios de ejemplo para mostrarte la estructura del Plan Estándar de Nexus.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={openInfoModal}
                                className="bg-[var(--primary)] text-[var(--bg)] px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[var(--primary)]/20 hover:scale-105 transition-all"
                            >
                                Solicitar Info
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative h-[350px] md:h-[500px] rounded-[2.5rem] md:rounded-[3.5rem] p-[3px] overflow-hidden group shadow-2xl shadow-[var(--primary)]/20 my-8 md:my-0"
                    >
                        {/* --- EFECTO DE ENERGÍA FLUYENTE (DINÁMICO) --- */}
                        <div className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent,rgba(34,211,238,0),var(--primary),var(--accent),transparent)] animate-[spin_6s_linear_infinite] z-0" />

                        <div className="relative w-full h-full rounded-[3.3rem] overflow-hidden bg-[var(--bg)] z-10">
                            <Image
                                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop"
                                alt="Oficina Moderna"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent opacity-60" />
                        </div>

                        <div className="absolute inset-0 rounded-[3.5rem] shadow-[inset_0_0_20px_var(--primary)]/20 pointer-events-none z-20" />
                    </motion.div>
                </div>
            </section>

            {/* --- SECCIÓN 2: NOSOTROS (¿CÓMO TRABAJAMOS?) --- */}
            <section id="como-trabajamos" className="py-20 md:py-32 px-6 bg-[var(--bg-muted)] border-y border-[var(--text)]/10 scroll-mt-40">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <DynamicBadge>Nuestra Especialidad</DynamicBadge>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight pr-2">¿CÓMO TRABAJAMOS?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { t: "Producto Ejemplo", d: "Aquí describimos tu producto principal con sus características y beneficios clave.", i: <MessageCircle className="w-8 h-8" /> },
                            { t: "Servicio Ejemplo", d: "Explicamos cómo tu servicio estrella soluciona los problemas de tus clientes potenciales.", i: <LayoutPanelTop className="w-8 h-8" /> },
                            { t: "Valor Agregado", d: "Destacamos lo que hace diferente a tu negocio frente a toda la competencia.", i: <Zap className="w-8 h-8" /> }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-12 rounded-[2.5rem] bg-[var(--bg)] border border-[var(--text)]/10 hover:border-[var(--primary)]/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--primary)]/5 transition-all duration-500 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="mb-8 transform text-[var(--primary)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">{item.i}</div>
                                <h3 className="text-xl font-black uppercase mb-4 tracking-widest group-hover:text-[var(--primary)] transition-colors">{item.t}</h3>
                                <p className="text-[var(--text-muted)] leading-relaxed text-sm">
                                    {item.d}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN 3: TEXTO + IMAGEN (NOSOTROS) --- */}
            <section id="nosotros" className="py-20 md:py-32 px-6 bg-[var(--bg)] overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2 relative h-[400px] md:h-[600px] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden group shadow-2xl border border-[var(--text)]/10"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
                            alt="Sobre Nosotros"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-[var(--accent)]/10 group-hover:bg-transparent transition-colors duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/60 via-transparent to-transparent" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                    >
                        <DynamicBadge>Nuestra Esencia</DynamicBadge>
                        <h2 className="text-4xl md:text-6xl font-black mb-10 leading-[0.9] tracking-tight uppercase text-[var(--text)] pr-2">LA CALIDAD <br />DE TU MARCA</h2>
                        <ul className="space-y-8">
                            {[
                                "Diseño de vanguardia adaptado a tu estilo.",
                                "Estructura optimizada para máxima conversión.",
                                "Identidad visual única y memorable.",
                                "Soporte y compromiso real con tu proyecto."
                            ].map((text, i) => (
                                <li key={i} className="flex gap-6 items-start group/item p-4 rounded-2xl hover:bg-[var(--text)]/5 transition-all duration-300 hover:pl-6 cursor-default">
                                    <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center shrink-0 group-hover/item:bg-[var(--primary)] group-hover/item:scale-110 transition-all">
                                        <CheckCircle2 className="w-4 h-4 text-[var(--primary)] group-hover/item:text-[var(--bg)] transition-colors" />
                                    </div>
                                    <span className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-[11px] group-hover/item:text-[var(--text)] transition-colors">{text}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={openSocialModal}
                            className="mt-16 group flex items-center gap-4 bg-[var(--accent)] text-white px-10 py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[var(--primary)] hover:text-[var(--bg)] hover:shadow-[0_10px_40px_var(--primary)]/30 transition-all duration-300"
                        >
                            Saber Más
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* --- SECCIÓN 4: SERVICIOS (CATÁLOGO) --- */}
            <section id="catalogo" className="py-20 md:py-32 px-6 bg-[var(--bg-muted)] scroll-mt-40">
                <div className="max-w-7xl mx-auto text-center mb-16 md:mb-24">
                    <DynamicBadge>Catálogo de Ejemplo</DynamicBadge>
                    <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tight pr-2">NUESTROS 6 SERVICIOS</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1504164996022-09080787b6b3?q=80&w=2070&auto=format&fit=crop"
                    ].map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => openProductModal(i + 1)}
                            className="relative aspect-square rounded-3xl overflow-hidden group border border-[var(--text)]/10 hover:border-[var(--primary)]/50 hover:shadow-[0_0_30px_var(--primary)]/20 transition-all duration-700 cursor-pointer"
                        >
                            <Image src={img} alt={`Gallery ${i}`} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-2" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">
                                <span className="text-[var(--text)] font-black uppercase text-[10px] tracking-[0.3em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    Servicio / Producto {i + 1}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- SECCIÓN 5: CONTACTO --- */}
            <section id="contacto" className="py-32 px-6 bg-[var(--bg)] border-t border-[var(--text)]/10 scroll-mt-40 overflow-hidden">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <DynamicBadge>Estamos Cerca</DynamicBadge>
                        <h2 className="text-4xl md:text-6xl font-black mb-10 leading-[0.9] tracking-tight uppercase text-[var(--text)] pr-2">
                            UBICACIÓN <br />ESTRATÉGICA
                        </h2>

                        <div className="space-y-2">
                            <div className="flex gap-6 items-start group p-4 rounded-2xl hover:bg-[var(--text)]/5 transition-all duration-300 hover:translate-x-2 cursor-default">
                                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)] transition-colors duration-300 group-hover:scale-110 group-hover:rotate-6">
                                    <MapPin className="w-6 h-6 text-[var(--primary)] group-hover:text-[var(--bg)] transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-[var(--text)] font-black uppercase tracking-widest text-sm mb-2 group-hover:text-[var(--primary)] transition-colors">Visítanos</h3>
                                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                        Calle 100 # 15 - 80<br />
                                        Edificio Business Center, Oficina 404<br />
                                        Bogotá, Colombia
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group p-4 rounded-2xl hover:bg-[var(--text)]/5 transition-all duration-300 hover:translate-x-2 cursor-default">
                                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)] transition-colors duration-300 group-hover:scale-110 group-hover:rotate-6">
                                    <Phone className="w-6 h-6 text-[var(--primary)] group-hover:text-[var(--bg)] transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-[var(--text)] font-black uppercase tracking-widest text-sm mb-2 group-hover:text-[var(--primary)] transition-colors">Llámanos</h3>
                                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                        +57 (601) 000 0000<br />
                                        +57 300 000 0000
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group p-4 rounded-2xl hover:bg-[var(--text)]/5 transition-all duration-300 hover:translate-x-2 cursor-default">
                                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)] transition-colors duration-300 group-hover:scale-110 group-hover:rotate-6">
                                    <Mail className="w-6 h-6 text-[var(--primary)] group-hover:text-[var(--bg)] transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-[var(--text)] font-black uppercase tracking-widest text-sm mb-2 group-hover:text-[var(--primary)] transition-colors">Escríbenos</h3>
                                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                        contacto@negocioficticio.com<br />
                                        ventas@negocioficticio.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full h-[350px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-[var(--text)]/10 shadow-2xl relative group"
                        onMouseEnter={() => setIsHoveringMap(true)}
                        onMouseLeave={() => setIsHoveringMap(false)}
                    >
                        <div className="absolute inset-0 bg-[var(--primary)]/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7953.008283061439!2d-74.09172!3d4.682083!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9b175e0b947b%3A0xd3315c1cd8c20385!2sNEXUS%20ESTUDIO%20GRAFICO!5e0!3m2!1ses-419!2sco!4v1770940913418!5m2!1ses-419!2sco"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-24 px-6 border-t border-[var(--text)]/10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
                    <div className="md:col-span-2">
                        <div className="text-2xl font-black tracking-tighter flex items-center gap-2 mb-8 text-[var(--text)]">
                            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-[var(--bg)]" />
                            </div>
                            NEGOCIO <span className="text-[var(--primary)]">FICTICIO</span>
                        </div>
                        <p className="text-[var(--text-muted)] max-w-sm mb-8 leading-relaxed text-sm">
                            En este pie de página colocaremos la información de contacto de tu empresa. El Plan Estándar incluye todo lo que ves aquí.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Facebook, XIcon, Tiktok].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-[var(--text)]/5 flex items-center justify-center text-[var(--text)] hover:bg-[var(--primary)] hover:text-[var(--bg)] transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[var(--text)] font-black uppercase text-xs tracking-widest mb-8">Navegación</h4>
                        <div className="flex flex-col gap-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
                            <a href="#inicio" className="hover:text-[var(--primary)] hover:translate-x-2 transition-all inline-block">Inicio</a>
                            <a href="#como-trabajamos" className="hover:text-[var(--primary)] hover:translate-x-2 transition-all inline-block">Nosotros</a>
                            <a href="#catalogo" className="hover:text-[var(--primary)] hover:translate-x-2 transition-all inline-block">Servicios</a>
                            <a href="#contacto" className="hover:text-[var(--primary)] hover:translate-x-2 transition-all inline-block">Contacto</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[var(--text)] font-black uppercase text-xs tracking-widest mb-8">Contacto</h4>
                        <div className="space-y-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
                            <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-[var(--primary)]" /> Tu Ciudad, País</div>
                            <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-[var(--primary)]" /> +57 000 000 0000</div>
                            <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-[var(--primary)]" /> tucorreo@correo.com</div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[var(--text)]/10 text-center">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.5em]">
                        &copy; 2026 NEGOCIO FICTICIO - TODOS LOS DERECHOS RESERVADOS
                    </p>
                </div>
            </footer>

            {/* --- WhatsApp Float --- */}
            <div className="fixed bottom-8 right-8 z-[60]">
                <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" />
                <motion.div
                    onClick={openWhatsAppModal}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer group relative z-10"
                >
                    <svg viewBox="0 0 24 24" className="w-9 h-9 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <div className="absolute right-full mr-4 bg-white px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300 pointer-events-none whitespace-nowrap">
                        <span className="text-black font-bold text-xs uppercase tracking-widest relative z-10">¡Escríbenos!</span>
                        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45" />
                    </div>
                </motion.div>
            </div>
            {/* --- MODAL UNIFICADO --- */}
            <AnimatePresence>
                {modalType && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[var(--bg)] border border-[var(--primary)]/20 p-8 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)]" />
                            <div className="absolute top-0 right-0 p-4">
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-full hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {modalType === 'call' ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mb-6 text-[var(--primary)]">
                                        <Phone className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-[var(--text)] mb-4 tracking-tight">
                                        Llamada
                                    </h3>
                                    <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
                                        Cuando tus clientes hagan click a este botón se iniciará una llamada automáticamente hacia tu número de celular.
                                    </p>
                                    <button
                                        onClick={closeModal}
                                        className="w-full bg-[var(--primary)] text-[var(--bg)] font-bold uppercase tracking-widest py-4 rounded-xl hover:opacity-90 transition-opacity"
                                    >
                                        Entendido
                                    </button>
                                </div>
                            ) : modalType === 'product' ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mb-6 text-[#25D366]">
                                        <MessageCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-[var(--text)] mb-4 tracking-tight">
                                        Chat de Ventas
                                    </h3>
                                    <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
                                        Al hacer click aquí, tu cliente será redirigido a tu WhatsApp con este mensaje automático:
                                        <br /><br />
                                        <span className="italic text-[var(--primary)]">
                                            "Hola, estoy interesado en el <br />
                                            <span className="font-bold">Servicio / Producto {selectedProduct}</span>"
                                        </span>
                                    </p>
                                    <p className="text-[var(--text-muted)] text-[10px] mb-6 opacity-60 font-medium uppercase tracking-widest">
                                        * Recuerda que cada producto / servicio tendrá su propio nombre *
                                    </p>
                                    <button
                                        onClick={closeModal}
                                        className="w-full bg-[#25D366] text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#25D366]/20"
                                    >
                                        Entendido
                                    </button>
                                </div>
                            ) : modalType === 'info' ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mb-6 text-[#25D366]">
                                        <MessageCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-[var(--text)] mb-4 tracking-tight">
                                        Chat de Interés
                                    </h3>
                                    <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
                                        Este botón le abrirá tu chat de WhatsApp al cliente con un mensaje automático de interés en tu negocio.
                                    </p>
                                    <button
                                        onClick={closeModal}
                                        className="w-full bg-[#25D366] text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#25D366]/20"
                                    >
                                        Entendido
                                    </button>
                                </div>
                            ) : modalType === 'logo' ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mb-6 text-[var(--primary)]">
                                        <Zap className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-[var(--text)] mb-4 tracking-tight">
                                        Identidad Visual
                                    </h3>
                                    <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
                                        Aquí aparecerá tu logo personalizado para darle presencia a la página.
                                    </p>
                                    <button
                                        onClick={closeModal}
                                        className="w-full bg-[var(--primary)] text-[var(--bg)] font-bold uppercase tracking-widest py-4 rounded-xl hover:opacity-90 transition-opacity"
                                    >
                                        Entendido
                                    </button>
                                </div>
                            ) : modalType === 'whatsapp' ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mb-6 text-[#25D366]">
                                        <MessageCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-[var(--text)] mb-4 tracking-tight">
                                        Chat Directo
                                    </h3>
                                    <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
                                        Cuando tus clientes le den click a este botón irán directamente a tu chat de WhatsApp con un mensaje de saludo.
                                    </p>
                                    <button
                                        onClick={closeModal}
                                        className="w-full bg-[#25D366] text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#25D366]/20"
                                    >
                                        Entendido
                                    </button>
                                </div>
                            ) : modalType === 'welcome' ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mb-6 text-[var(--accent)]">
                                        <Zap className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-[var(--text)] mb-4 tracking-tight">
                                        Demo Interactivo
                                    </h3>
                                    <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
                                        Tu página será exactamente así pero con tu logo, <span className="text-[var(--primary)] font-bold">tus colores personalizados</span>, textos (títulos y descripciones), imágenes propias y redes sociales.
                                        <br /><br />
                                        <span className="opacity-70 text-[11px] font-bold uppercase tracking-widest block border-t border-[var(--text)]/10 pt-4 mt-2">
                                            Recuerda que esta solo es una demostración
                                        </span>
                                    </p>
                                    <button
                                        onClick={closeModal}
                                        className="w-full bg-[var(--primary)] text-[var(--bg)] font-bold uppercase tracking-widest py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[var(--primary)]/20"
                                    >
                                        Comenzar Recorrido
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-[#E1306C]/10 flex items-center justify-center mb-6 text-[#E1306C]">
                                        <Instagram className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-[var(--text)] mb-4 tracking-tight">
                                        Redes Sociales
                                    </h3>
                                    <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
                                        Este botón redirigirá a tus clientes a la red social de tu preferencia.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 w-full mb-6">
                                        {[
                                            { icon: Instagram, name: 'Instagram', color: 'hover:text-[#E1306C]' },
                                            { icon: Facebook, name: 'Facebook', color: 'hover:text-[#1877F2]' },
                                            { icon: XIcon, name: 'Twitter / X', color: 'hover:text-black dark:hover:text-white' },
                                            { icon: Tiktok, name: 'TikTok', color: 'hover:text-[#ff0050]' }
                                        ].map((item, i) => (
                                            <button
                                                key={i}
                                                onClick={closeModal}
                                                className={`flex items-center justify-center gap-3 p-4 rounded-xl border border-[var(--text)]/10 hover:bg-[var(--text)]/5 transition-all text-[var(--text-muted)] ${item.color} group`}
                                            >
                                                <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <p className="text-[var(--text-muted)] text-[10px] opacity-60 font-medium uppercase tracking-widest">
                                        * Redirección a perfil social *
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
