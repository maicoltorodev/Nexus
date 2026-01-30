'use client';

import { useViewportCenter } from '@/hooks/useViewportCenter';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Tarjetas',
    description: 'Tarjetas de presentación de alta calidad en diferentes materiales y acabados. Visita, comerciales y corporativas con opciones en papel couché, reciclado, relieve y barniz UV.',
    image: '/servicios/tarjetas.webp',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    id: 2,
    title: 'Volantes',
    description: 'Volantes publicitarios efectivos para promocionar tus productos y servicios. Impresión en una o dos caras, con opción de numeración para eventos y diseños impactantes.',
    image: '/servicios/volantes.webp',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Impresión Digital',
    description: 'Impresión digital de alta resolución para folletos, revistas, catálogos, adhesivos y materiales metalizados. Tecnología de vanguardia con colores vibrantes y acabados profesionales.',
    image: '/servicios/impresion.webp',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'Gran Formato',
    description: 'Impresión en gran formato para máxima visibilidad. Banners, vinilos, panaflex, materiales microperforados y retablos. Perfectos para eventos, fachadas y publicidad exterior.',
    image: '/servicios/gran-formato.webp',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    )
  },
  {
    id: 5,
    title: 'Papelería Comercial',
    description: 'Papelería corporativa profesional para tu negocio. Facturas, recibos, membretes y documentos comerciales con diseño personalizado e impresión láser de alta calidad.',
    image: '/servicios/papeleria.webp',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    id: 6,
    title: 'Promocionales',
    description: 'Artículos promocionales personalizados. Manillas VIP, esferos corporativos, bolsas ecológicas, termos y más para fortalecer tu marca.',
    image: '/servicios/promocionales.webp',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    )
  }
];

export default function Services() {
  const { centeredId, registerElement } = useViewportCenter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openWhatsApp = (serviceTitle: string) => {
    const phoneNumber = '573184022999'; // Número sin espacios, con código de país
    const message = encodeURIComponent(`Hola, estoy interesado por el servicio ${serviceTitle}.`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };



  return (
    <section className="relative py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)' }}>
      {/* Efecto de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-[#FFD700] rounded-full blur-xl md:blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-[#FFA500] rounded-full blur-xl md:blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header mejorado */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5">
            <span className="text-sm font-semibold text-[#FFD700] tracking-wider uppercase">Nuestro Portafolio</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Soluciones <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Gráficas y Publicitarias</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            Desarrollamos soluciones de alto impacto diseñadas exclusivamente <span className="text-white font-medium">para ti y tu negocio</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const isCentered = isMobile && centeredId === service.id.toString();

            return (
              <div
                key={service.id}
                ref={(el) => registerElement(service.id.toString(), el)}
                onClick={() => openWhatsApp(service.title)}
                className={`group relative bg-[#111] rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer min-h-[460px] will-change-[border-color]
                  ${isCentered
                    ? 'border-[#FFD700]'
                    : 'border-[#FFD700]/10 shadow-xl'} 
                  md:shadow-2xl md:hover:border-[#FFD700]/40 md:hover:-translate-y-2 md:hover:shadow-[0_20px_60px_rgba(255,215,0,0.15)]`}
              >
                <div className="absolute top-0 left-0 right-0 h-[40%] overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className={`object-cover transition-transform duration-700 md:group-hover:scale-110`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent"></div>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col h-full pt-44 pb-8 px-8">
                  <div className={`mb-6 p-4 w-fit rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 backdrop-blur-md border transition-all duration-500 text-[#FFD700] shadow-lg 
                    ${isCentered ? 'border-[#FFD700]/50' : 'border-[#FFD700]/50 md:group-hover:scale-110 md:group-hover:border-[#FFD700]'}`}>
                    {service.icon}
                  </div>
                  <h3 className={`text-2xl md:text-3xl font-bold mb-4 transition-colors tracking-tight 
                    ${isCentered ? 'text-white' : 'text-white md:group-hover:text-[#FFD700]'}`}>
                    {service.title}
                  </h3>
                  <div className={`h-1 bg-[#FFD700]/50 mb-6 transition-all duration-500 
                    ${isCentered ? 'w-12' : 'w-12 md:group-hover:w-20 md:group-hover:bg-[#FFD700]'}`}></div>
                  <p className="text-gray-400 leading-relaxed text-base font-light">
                    {service.description}
                  </p>
                  <div className={`mt-auto pt-8 flex items-center gap-2 text-[#FFD700] text-xs font-black uppercase tracking-widest transition-opacity 
                    ${isCentered ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}>
                    Cotizar ahora <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
