'use client';

import { useViewportCenter } from '@/hooks/useViewportCenter';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

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
    <section id="servicios" className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)' }}>
      {/* Efecto de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFD700] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFA500] rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header mejorado */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5">
            <span className="text-sm font-semibold text-[#FFD700] tracking-wider uppercase">Servicios</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Soluciones <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Premium</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            Excelencia en cada detalle, calidad en cada proyecto
          </p>
        </div>

        {/* Grid de servicios mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const cardRef = useRef<HTMLDivElement>(null);
            const isCentered = centeredId === `service-${service.id}`;
            const isHovered = isCentered;

            return (
              <div
                key={service.id}
                ref={(el) => {
                  cardRef.current = el;
                  registerElement(`service-${service.id}`, el);
                }}
                onClick={() => openWhatsApp(service.title)}
                className={`group relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl border transition-all duration-300 md:duration-700 overflow-hidden md:hover:border-[#FFD700]/50 cursor-pointer min-h-[480px] shadow-2xl md:hover:shadow-[0_20px_60px_rgba(255,215,0,0.15)] ${
                  isHovered && !isMobile 
                    ? 'border-[#FFD700]/50 shadow-[0_20px_60px_rgba(255,215,0,0.15)]' 
                    : isHovered && isMobile
                    ? 'border-[#FFD700]/40'
                    : 'border-[#FFD700]/10'
                }`}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  transform: isHovered && !isMobile ? 'translateY(-12px) scale(1.02)' : undefined,
                  transition: 'transform 0.3s ease-out'
                }}
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }
                }}
              >
                {/* Imagen de fondo - Solo 40% superior */}
                <div className="absolute top-0 left-0 right-0 h-[40%] overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-300 md:duration-700 md:group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Overlay elegante con gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/30 to-transparent transition-opacity duration-300 md:duration-700 md:group-hover:from-[#0a0a0a]/40 md:group-hover:via-[#0a0a0a]/20"></div>
                    {/* Borde inferior sutil de la imagen */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent"></div>
                  </div>
                </div>

                {/* Efecto de brillo al hover - más sutil */}
                <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-300 md:duration-700 md:group-hover:from-[#FFD700]/8 md:group-hover:to-[#FFA500]/8 ${
                  isHovered && !isMobile
                    ? 'from-[#FFD700]/8 to-[#FFA500]/8' 
                    : 'from-[#FFD700]/0 to-[#FFA500]/0'
                }`}></div>
                
                {/* Línea superior dorada - más elegante */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent transition-all duration-300 md:duration-700 md:group-hover:scale-x-100 md:group-hover:opacity-100 z-20 ${
                  isHovered && !isMobile ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                }`}></div>

                {/* Contenido */}
                <div className="relative z-10 flex flex-col h-full min-h-[480px]">
                  {/* Parte superior con imagen e icono */}
                  <div className="relative h-[40%] flex items-center justify-center pt-8 pb-4">
                    <div className={`relative p-5 rounded-2xl bg-gradient-to-br from-[#FFD700]/25 to-[#FFA500]/25 backdrop-blur-md border-2 transition-all duration-300 md:duration-500 text-[#FFD700] shadow-lg md:group-hover:border-[#FFD700] md:group-hover:scale-110 md:group-hover:shadow-[0_10px_30px_rgba(255,215,0,0.4)] ${
                      isHovered && !isMobile
                        ? 'border-[#FFD700] scale-110 shadow-[0_10px_30px_rgba(255,215,0,0.4)]' 
                        : 'border-[#FFD700]/50 scale-100'
                    }`}>
                      {/* Brillo interno del icono */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 md:duration-500"></div>
                      <div className="relative z-10">
                        {service.icon}
                      </div>
                    </div>
                  </div>

                  {/* Parte inferior con fondo normal y descripción */}
                  <div className="flex-1 flex flex-col justify-start items-center px-6 pb-8 pt-6">
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 text-center transition-all duration-300 md:duration-500 md:group-hover:text-[#FFD700] tracking-tight ${
                      isHovered && !isMobile ? 'text-[#FFD700]' : 'text-white'
                    }`}>
                      {service.title}
                    </h3>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent mb-5 transition-all duration-300 md:duration-500 md:group-hover:via-[#FFD700] md:group-hover:w-24"></div>
                    <p className="text-gray-300 text-center leading-relaxed text-base md:text-lg font-normal max-w-sm px-2">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer de sección mejorado */}
        <div className="mt-20 text-center space-y-6">
          <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border border-[#FFD700]/20">
            <p className="text-lg font-semibold text-white">
              Impresión litográfica, servicio rápido
            </p>
          </div>
          <p className="text-xl text-gray-400 font-light">
            Impresión digital en alta resolución
          </p>
        </div>
      </div>
    </section>
  );
}
