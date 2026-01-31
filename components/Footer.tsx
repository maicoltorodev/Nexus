'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    servicios: [
      { name: 'Diseño Web', href: '#web-design' },
      { name: 'Branding', href: '#servicios' },
      { name: 'Impresión Digital', href: '#servicios' },
      { name: 'Tarjetas Premium', href: '#tarjeta' },
    ],
    empresa: [
      { name: 'Sobre Nosotros', href: '#inicio' },
      { name: 'Proyectos', href: '#testimonios' },
      { name: 'Contacto', href: '#calculadora' },
      { name: 'Planes', href: '/planes' },
    ],
  };

  return (
    <footer className="relative bg-[#050505] text-white pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD700]/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="inline-block group">
              <div className="relative w-40 h-16 transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/nexus.webp"
                  alt="Nexus Logo"
                  fill
                  className="object-contain opacity-90 group-hover:opacity-100"
                />
              </div>
            </Link>
            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-md">
              Elevamos la identidad de tu marca a través de diseño estratégico y tecnología de vanguardia. <span className="text-white font-medium">NE<span className="text-[#FFD700] font-black">X</span>US</span> es donde la creatividad se encuentra con el impacto.
            </p>

          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD700]">Servicios</h4>
              <ul className="space-y-4">
                {footerLinks.servicios.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-sm font-light"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD700]">Explorar</h4>
              <ul className="space-y-4">
                {footerLinks.empresa.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-sm font-light"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD700]">Contacto</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-300 text-sm font-light">
                  <Mail className="w-4 h-4 text-[#FFD700]" />
                  <span>info@nexusstudio.com</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm font-light">
                  <Phone className="w-4 h-4 text-[#FFD700]" />
                  <span>+57 318 4022999</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300 text-sm font-light">
                  <MapPin className="w-4 h-4 text-[#FFD700] mt-1" />
                  <span>Bogotá, Colombia</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Big Nexus Text Background - Full Width */}
      <div className="relative mt-20 mb-10 overflow-hidden py-6 border-y border-[#FFD700]/20 bg-[#FFD700]/5 w-full">
        <div className="whitespace-nowrap flex animate-infinite-scroll">
          {Array(10).fill(0).map((_, i) => (
            <span key={i} className="text-7xl md:text-[10rem] font-black text-transparent stroke-text tracking-tighter mx-8 leading-none select-none">
              NEXUS STUDIO
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-12 pb-16 border-t border-white/5 gap-6">
          <p className="text-gray-400 text-sm font-light">
            © {currentYear} <span className="text-white font-medium">NE<span className="text-[#FFD700] font-black">X</span>US</span>. Todos los derechos reservados.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="#" className="hover:text-[#FFD700] transition-colors">Privacidad</Link>
            <Link href="#" className="hover:text-[#FFD700] transition-colors">Términos</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
                .stroke-text {
                    -webkit-text-stroke: 1px rgba(255, 215, 0, 0.5);
                }
                @keyframes infinite-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-infinite-scroll {
                    animation: infinite-scroll 40s linear infinite;
                    width: max-content;
                }
            `}</style>
    </footer>
  );
}
