'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login' || pathname === '/admin/setup';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#030712] text-white overflow-hidden relative">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#FFD700] blur-[150px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600 blur-[150px] rounded-full" />
            </div>

            {/* Mobile Toggle Button */}
            {!isLoginPage && (
                <div className="lg:hidden absolute top-6 left-6 z-40">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white shadow-lg active:scale-95 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Sidebar con control móvil */}
            {!isLoginPage && (
                <AdminSidebar
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-scroll relative z-10" style={{ scrollbarGutter: 'stable' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
