'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram, Facebook, MessageCircle, ArrowRight, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/#inicio', label: 'Inicio', desc: 'Volver arriba' },
    { href: '/#tarjeta', label: 'Tarjetas', desc: 'Presentación premium' },
    { href: '/#web-design', label: 'Webs', desc: 'Tu sitio profesional' },
    { href: '/#servicios', label: 'Impresión', desc: 'Calidad litográfica' },
    { href: '/#calculadora', label: 'Calculadora', desc: 'Cotiza al instante' },
    { href: '/#testimonios', label: 'Opiniones', desc: 'Qué dicen de nosotros' },
    { href: '/#contacto', label: 'Contacto', desc: 'Hablemos de tu idea' }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "https://facebook.com", label: "Facebook", color: "#1877F2" },
    { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com/nexus.col", label: "Instagram", color: "#E4405F" },
    { icon: <MessageCircle className="w-5 h-5" />, href: "https://wa.me/573184022999", label: "WhatsApp", color: "#25D366" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || isMobileMenuOpen
        ? 'py-3 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl'
        : 'py-6 bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Brand/Logo Placeholder or Social Icons as current */}
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-xl font-black tracking-tighter text-white">
                NE<span className="text-[#FFD700]">X</span>US
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#FFD700] transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
            <div className="ml-6 pl-6 border-l border-white/10 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all hover:scale-110"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden relative z-[60] w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-300 ${isMobileMenuOpen
                ? 'bg-[#FFD700]/10 border-[#FFD700]/20 text-[#FFD700]'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <X className="w-6 h-6 text-[#FFD700]" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden bg-[#0a0a0a]"
          >
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-[10%] -right-[10%] w-[70%] h-[70%] bg-[#FFD700]/5 rounded-full blur-[120px]" />
              <div className="absolute -bottom-[10%] -left-[10%] w-[70%] h-[70%] bg-[#FFD700]/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative h-full flex flex-col px-8 pt-32 pb-12 overflow-y-auto">
              <div className="flex flex-col space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD700]/60 mb-2">Navegación</p>
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-center justify-between py-2"
                    >
                      <div className="flex flex-col">
                        <span className="text-3xl font-bold text-white group-hover:text-[#FFD700] transition-colors">{link.label}</span>
                        <span className="text-xs text-gray-500 mt-1">{link.desc}</span>
                      </div>
                      <ArrowRight className="w-6 h-6 text-[#FFD700] opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto space-y-8">
                <div className="pt-8 border-t border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD700]/60 mb-6">Conecta con nosotros</p>
                  <div className="flex gap-6">
                    {socialLinks.map((social, idx) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#FFD700] hover:text-black transition-all"
                        aria-label={social.label}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="p-6 rounded-[2rem] bg-gradient-to-br from-[#FFD700]/10 to-transparent border border-[#FFD700]/20"
                >
                  <h4 className="text-lg font-bold text-white mb-2">¿Listo para empezar?</h4>
                  <p className="text-sm text-gray-400 mb-4">Transformamos tus ideas en realidades visuales impactantes.</p>
                  <Link
                    href="/planes"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-4 bg-[#FFD700] text-black rounded-xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
                  >
                    Ver Planes <ExternalLink className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
