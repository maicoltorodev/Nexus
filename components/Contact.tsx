'use client';

import { useViewportCenter } from '@/hooks/useViewportCenter';
import { useRef } from 'react';

const contactInfo = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Ubicación',
    content: 'Calle 71 # 69M - 05',
    subcontent: 'Barrio La Estrada, Bogotá - Colombia'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: 'Teléfono',
    content: '318 402 2999',
    subcontent: 'WhatsApp'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Horario',
    content: '8:00 - 13:00',
    subcontent: '14:00 - 18:00'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Correo',
    content: 'nexustoprint@gmail.com',
    subcontent: ''
  }
];

export default function Contact() {
  const { centeredId, registerElement } = useViewportCenter();

  const openWhatsApp = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/\s/g, ''); // Eliminar espacios
    const formattedNumber = `57${cleanNumber}`; // Agregar código de país
    const message = encodeURIComponent('Hola, me gustaría obtener más información sobre sus servicios.');
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="relative py-32 overflow-hidden bg-[#0a0a0a]">
      {/* Efecto de brillo dorado sutil optimizado */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 60%)' }}></div>
      {/* Efecto de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#FFD700] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#FFA500] rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header mejorado */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5">
            <span className="text-sm font-semibold text-[#FFD700] tracking-wider uppercase">Contacto</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Conectemos <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Contigo</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            Estamos aquí para hacer realidad tus ideas
          </p>
        </div>

        {/* Grid de contacto mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => {
            const cardRef = useRef<HTMLDivElement>(null);
            const isCentered = centeredId === `contact-${index}`;
            const isHovered = isCentered;

            const isPhoneCard = info.title === 'Teléfono';

            return (
              <div
                key={index}
                ref={(el) => {
                  cardRef.current = el;
                  registerElement(`contact-${index}`, el);
                }}
                onClick={() => {
                  if (isPhoneCard) {
                    openWhatsApp(info.content);
                  }
                }}
                className={`group relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 border transition-all duration-500 overflow-hidden md:hover:border-[#FFD700]/40 ${isHovered ? 'border-[#FFD700]/40' : 'border-[#FFD700]/10'
                  } ${isPhoneCard ? 'cursor-pointer' : ''}`}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  transform: isHovered ? 'translateY(-4px)' : undefined
                }}
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Efecto de brillo al hover */}
                <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 md:group-hover:from-[#FFD700]/5 md:group-hover:to-[#FFA500]/5 ${isHovered
                  ? 'from-[#FFD700]/5 to-[#FFA500]/5'
                  : 'from-[#FFD700]/0 to-[#FFA500]/0'
                  }`}></div>

                {/* Línea superior dorada */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent transition-transform duration-500 md:group-hover:scale-x-100 ${isHovered ? 'scale-x-100' : 'scale-x-0'
                  }`}></div>

                {/* Contenido */}
                <div className="relative z-10 text-center">
                  <div className="mb-6 flex justify-center">
                    <div className={`p-4 rounded-xl bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/10 border transition-all duration-300 text-[#FFD700] md:group-hover:border-[#FFD700]/40 md:group-hover:scale-110 ${isHovered
                      ? 'border-[#FFD700]/40 scale-110'
                      : 'border-[#FFD700]/20 scale-100'
                      }`}>
                      {info.icon}
                    </div>
                  </div>
                  <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 md:group-hover:text-[#FFD700] ${isHovered ? 'text-[#FFD700]' : 'text-white'
                    }`}>
                    {info.title}
                  </h3>
                  <p className="text-gray-300 font-medium mb-1 text-sm">{info.content}</p>
                  {info.subcontent && (
                    <p className="text-gray-400 text-xs mt-1">{info.subcontent}</p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Mapa - En móvil es parte del grid, en desktop está oculto aquí */}
          <div className="md:hidden">
            <div
              ref={(el) => {
                registerElement(`contact-map`, el);
              }}
              className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-2 border-2 border-[#FFD700]/30 overflow-hidden h-full shadow-2xl"
              style={{
                animation: `fadeInUp 0.6s ease-out ${contactInfo.length * 0.1}s both`,
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.1), inset 0 0 20px rgba(255, 215, 0, 0.05)'
              }}
            >
              {/* Efecto de brillo en el borde */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.5037717737646!2d-74.09166590203546!3d4.682148050380403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9b175e0b947b%3A0xd3315c1cd8c20385!2sNEXUS%20ESTUDIO%20GRAFICO!5e0!3m2!1ses-419!2sco!4v1769066189707!5m2!1ses-419!2sco"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full rounded-xl relative z-10"
              />
            </div>
          </div>
        </div>

        {/* Mapa - En desktop aparece debajo del grid */}
        <div className="hidden md:block mt-6">
          <div
            className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-2 border-2 border-[#FFD700]/30 overflow-hidden shadow-2xl transition-all duration-500 hover:border-[#FFD700]/50"
            style={{
              height: '400px',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.1), inset 0 0 20px rgba(255, 215, 0, 0.05)'
            }}
          >
            {/* Efecto de brillo en el borde al hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"></div>

            {/* Línea decorativa superior */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50 z-20"></div>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.5037717737646!2d-74.09166590203546!3d4.682148050380403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9b175e0b947b%3A0xd3315c1cd8c20385!2sNEXUS%20ESTUDIO%20GRAFICO!5e0!3m2!1ses-419!2sco!4v1769066189707!5m2!1ses-419!2sco"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full rounded-xl relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
