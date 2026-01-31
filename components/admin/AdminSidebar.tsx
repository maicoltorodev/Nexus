'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Users,
    LayoutDashboard,
    FolderKanban,
    ShieldCheck,
    FileText,
    LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react'; // Importar icono X para cerrar

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isAdminHover, setIsAdminHover] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Clases base para Desktop y Móvil
    const sidebarClasses = `
        w-72 bg-[#0a0a0a]/95 backdrop-blur-2xl border-r border-white/5 flex flex-col h-full 
        ${isOpen ? 'fixed inset-y-0 left-0 z-[60] shadow-[0_0_50px_rgba(0,0,0,0.8)]' : 'hidden lg:flex relative z-50 shadow-[20px_0_50px_rgba(0,0,0,0.5)]'}
        transition-all duration-300
    `;

    return (
        <>
            {/* Overlay para móvil */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[55] bg-black/80 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={sidebarClasses}>
                {/* Botón cerrar solo en móvil */}
                <div className="lg:hidden absolute top-4 right-4 z-50">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Línea de Gradiente Animada que Fluye */}
                <div
                    className={`absolute inset-y-0 right-0 z-20 sidebar-flow-line transition-all duration-700 ${isAdminHover ? 'w-[5px] brightness-150' : 'w-[2px]'
                        }`}
                    style={{
                        animationDuration: isAdminHover ? '1.5s' : '8s'
                    }}
                />
                <div className="p-8 relative z-10">
                    <Link
                        href="/admin"
                        className="block mb-12 group relative"
                        onMouseEnter={() => setIsAdminHover(true)}
                        onMouseLeave={() => setIsAdminHover(false)}
                    >
                        <div className="relative mb-6">
                            <h2
                                className="text-4xl font-black tracking-tighter text-center text-transparent bg-clip-text bg-[length:200%_auto] transition-transform duration-500 group-hover:scale-105 font-[family-name:var(--font-orbitron)] relative z-10"
                                style={{
                                    backgroundImage: `linear-gradient(90deg, #FFD700, #a855f7, #22d3ee, #a855f7, #FFD700)`,
                                    animation: 'gradient 3s linear infinite'
                                }}
                            >
                                ADMIN
                            </h2>

                            {/* Glow pulsante detrás del texto */}
                            <div className="absolute inset-0 blur-2xl opacity-20 animate-pulse pointer-events-none"
                                style={{
                                    background: `radial-gradient(circle, #a855f7 0%, transparent 70%)`
                                }}
                            />
                        </div>
                        {/* Badge de Alianza Estilo Premium - Centrado Perfecto */}
                        <div className="relative group/badge">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#a855f7] opacity-0 group-hover/badge:opacity-10 blur-xl transition-opacity duration-500" />

                            <div className="relative flex items-center justify-between gap-2 py-5 px-6 rounded-3xl bg-white/[0.03] border border-white/10 group-hover/badge:border-[#FFD700]/30 transition-all duration-500 backdrop-blur-sm shadow-2xl overflow-hidden">

                                {/* Lado NEXUS */}
                                <div className="flex flex-col items-center gap-3 flex-1">
                                    <div className="relative w-8 h-8 transition-transform duration-500 group-hover/badge:scale-110 group-hover/badge:rotate-12">
                                        <Image
                                            src="/X.webp"
                                            alt="Nexus"
                                            fill
                                            className="object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
                                        />
                                    </div>
                                    <div className="text-[8px] tracking-[0.2em] text-white font-medium whitespace-nowrap">
                                        NE<span className="text-[#FFD700] font-black">X</span>US
                                    </div>
                                </div>

                                {/* Separador */}
                                <span className="text-xl text-white/10 font-light font-[family-name:var(--font-orbitron)] mb-6">✕</span>

                                {/* Lado INZIDIUM */}
                                <div className="flex flex-col items-center gap-3 flex-1">
                                    <div className="relative w-8 h-8 transition-transform duration-500 group-hover/badge:scale-110 group-hover/badge:-rotate-12">
                                        <Image
                                            src="/logo-inzidium.webp"
                                            alt="InZidium"
                                            fill
                                            className="object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                                        />
                                    </div>
                                    <div className="text-[8px] font-bold tracking-[0.1em] bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent font-[family-name:var(--font-orbitron)] whitespace-nowrap">
                                        InZidium
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Link>

                    <nav className="space-y-2 mt-12">
                        {[
                            { icon: LayoutDashboard, label: "Resumen", href: "/admin", match: (p: string) => p === '/admin' },
                            { icon: Users, label: "Clientes", href: "/admin/clientes", match: (p: string) => p.startsWith('/admin/clientes') },
                            { icon: FolderKanban, label: "Proyectos", href: "/admin/proyectos", match: (p: string) => p.startsWith('/admin/proyectos') },
                            { icon: FileText, label: "Archivos", href: "/admin/archivos", match: (p: string) => p.startsWith('/admin/archivos') },
                            { icon: ShieldCheck, label: "Admins", href: "/admin/admins", match: (p: string) => p.startsWith('/admin/admins') },
                        ].map((item, idx) => (
                            <SidebarLink
                                key={item.href}
                                {...item}
                                active={item.match(pathname)}
                                index={idx}
                            />
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-white/5">
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="group flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 hover:text-red-400 transition-all duration-300 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 w-full"
                    >
                        <div className="p-2 rounded-xl bg-white/5 group-hover:bg-red-500/10 group-hover:rotate-12 transition-all">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm tracking-wide">Cerrar Sesión</span>
                    </button>
                </div>

                {/* Modal de Confirmación Logout - CORREGIDO: AnimatePresence dentro del Portal */}
                {mounted && createPortal(
                    <AnimatePresence>
                        {showLogoutConfirm && (
                            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="bg-[#0a0a0a] border border-white/10 w-[90%] md:w-full max-w-sm rounded-[2rem] p-8 relative z-10 shadow-2xl overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] -z-10" />

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20">
                                            <LogOut className="w-8 h-8 ml-1" />
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-2">
                                            ¿Cerrar Sesión?
                                        </h3>
                                        <p className="text-gray-400 text-xs mb-8 font-medium leading-relaxed">
                                            Tendrás que volver a autenticarte para acceder al panel de control.
                                        </p>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setShowLogoutConfirm(false)}
                                                className="py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => signOut({ callbackUrl: '/' })}
                                                className="py-3 rounded-xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                                            >
                                                Confirmar
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </aside>
        </>
    );
}

function SidebarLink({ icon: Icon, label, href, active, index }: any) {
    const isEven = index % 2 === 0;
    const activeColor = isEven ? '#FFD700' : '#a855f7';
    const indicatorColor = isEven ? '#FFD700' : '#22d3ee';
    const activeGradient = isEven
        ? 'from-[#FFD700]/10 to-transparent'
        : 'from-[#a855f7]/10 to-transparent';
    const activeBorder = isEven ? 'border-[#FFD700]' : 'border-[#a855f7]';

    return (
        <Link
            href={href}
            className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group overflow-hidden ${active ? 'text-white' : 'text-gray-500 hover:text-gray-200'
                }`}
        >
            {/* Background Active / Hover */}
            <AnimatePresence>
                {active && (
                    <motion.div
                        layoutId="sidebar-active"
                        className={`absolute inset-0 bg-gradient-to-r ${activeGradient} border-l-2 ${activeBorder} z-0`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
            </AnimatePresence>

            {!active && (
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-500" />
            )}

            {/* Glow effect on Active */}
            {active && (
                <div
                    className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-4 h-12 opacity-20 blur-xl px-4"
                    style={{ backgroundColor: activeColor }}
                />
            )}

            <Icon className={`w-5 h-5 relative z-10 transition-all duration-500 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]' : 'group-hover:scale-110 group-hover:text-gray-300'
                }`} style={{ color: active ? activeColor : undefined }} />

            <span className={`font-bold text-[13px] tracking-wide relative z-10 transition-colors duration-500 ${active ? 'text-white' : 'group-hover:text-white'
                }`}>
                {label}
            </span>

            {active && (
                <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{
                        backgroundColor: indicatorColor,
                        boxShadow: `0 0 10px ${indicatorColor}80`
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                />
            )}
        </Link>
    );
}
