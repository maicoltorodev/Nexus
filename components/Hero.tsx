'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [isXHovered, setIsXHovered] = useState(false);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Efecto de brillo dorado sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 70%)' }}></div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto space-y-3 md:space-y-8 pt-2 md:pt-0 pb-8 md:pb-0">
          {/* Container para todos los elementos excepto el botón */}
          <div className="relative w-full rounded-2xl p-6 md:p-8 x-container-base">
            {/* Logo dividido en 3 partes */}
            <div className="relative w-full max-w-xl mx-auto mb-0 md:mb-2 flex items-center justify-center gap-1 md:gap-4">
              {/* NE - se desliza desde el centro hacia la izquierda */}
              <div className={`relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 animate-slide-left transition-all duration-500 ${isXHovered ? 'x-hover-ne' : ''}`}>
                <Image
                  src="/NE.webp"
                  alt="NE"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                  priority
                  style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))' }}
                />
              </div>
              {/* X - aparece primero, luego gira */}
              <div
                className="relative z-10 flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 animate-x-appear cursor-pointer"
                onMouseEnter={() => setIsXHovered(true)}
                onMouseLeave={() => setIsXHovered(false)}
              >
                <Image
                  src="/X.webp"
                  alt="X"
                  width={112}
                  height={112}
                  className={`w-full h-full object-contain animate-spin-slow transition-[filter] duration-500 x-filter-base ${isXHovered ? 'x-hover-x' : ''}`}
                  priority
                />
              </div>
              {/* US - se desliza desde el centro hacia la derecha */}
              <div className={`relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 animate-slide-right transition-all duration-500 ${isXHovered ? 'x-hover-us' : ''}`}>
                <Image
                  src="/US.webp"
                  alt="US"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                  priority
                  style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))' }}
                />
              </div>
            </div>

            {/* Card blanca con texto ESTUDIO GRÁFICO */}
            <div className={`relative w-full max-w-[300px] sm:max-w-[420px] md:max-w-[500px] mx-auto mb-10 md:mb-16 px-4 transition-all duration-500 ${isXHovered ? 'x-hover-card' : ''}`} style={{ animation: 'fadeInUp 0.8s ease-out 1.4s both' }}>
              <div className="rounded-lg px-4 py-3 sm:px-6 sm:py-3 md:px-9 md:py-4 border-2 bg-white border-gray-200 shadow-2xl animate-card-pulse animate-border-glow animate-shimmer animate-continuous-glow group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_30px_80px_rgba(255,215,0,0.3)]">
                <p className="text-black text-center font-bold text-sm sm:text-base md:text-lg lg:text-xl uppercase relative z-10 transition-all duration-300 group-hover:text-[#FFD700]" style={{ letterSpacing: '0.3em' }}>
                  · ESTUDIO GRÁFICO ·
                </p>
              </div>
            </div>
            <h3 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-3 max-w-2xl mx-auto font-semibold tracking-wide px-4 transition-all duration-500 ${isXHovered ? 'x-hover-text' : 'text-white'}`} style={{ animation: 'fadeInUp 0.8s ease-out 2.2s both' }}>
              ¿Tienes una idea?
            </h3>
            <p className={`text-sm sm:text-base md:text-lg lg:text-xl mb-4 md:mb-10 max-w-2xl mx-auto leading-relaxed font-light tracking-wide px-4 transition-all duration-500 ${isXHovered ? 'x-hover-text' : 'text-gray-400'}`} style={{ animation: 'fadeInUp 0.8s ease-out 2.4s both' }}>
              Realizamos todo tipo de impresión digital y litográfica, en diferentes materiales, tamaños y formas.
            </p>
          </div>

          {/* Botón fuera del container */}
          <a
            href="#servicios"
            className={`group relative inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3 md:px-10 md:py-4 text-sm sm:text-base font-semibold text-[#0a0a0a] transition-all duration-500 overflow-hidden ${isXHovered ? 'x-hover-button' : ''}`}
            style={{
              animation: 'fadeInUp 0.8s ease-out 2.6s both',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(255, 215, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(255, 215, 0, 0.6)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(255, 215, 0, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span className="relative z-10">Servicios</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#servicios"
        className="absolute bottom-16 right-4 sm:bottom-8 sm:right-8 z-20 animate-bounce cursor-pointer transition-transform duration-300 hover:scale-110"
        aria-label="Ir a servicios"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFD700]"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </a>
    </section>
  );
}
