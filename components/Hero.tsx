'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [clickCount, setClickCount] = useState(0);
  const router = useRouter();

  const handleXClick = () => {
    setClickCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (clickCount === 7) {
      router.push('/admin');
      setClickCount(0);
    }
  }, [clickCount, router]);

  useEffect(() => {
    if (clickCount > 0 && clickCount < 7) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  return (
    <section id="inicio" className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Efecto de brillo dorado sutil optimizado */}
      <div className="absolute inset-0 opacity-20 md:opacity-100 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 60%)' }}></div>

      {/* Contenido principal (solo texto) */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto space-y-0 group">
          <div className="relative mx-auto w-[55vw] sm:w-[50vw] md:w-[42vw] lg:w-[36vw] max-w-[640px]">
            <Image
              src="/hero-logo.webp"
              alt="Nexus"
              width={800}
              height={800}
              className="w-full h-auto object-contain block select-none pointer-events-none"
              priority
              draggable={false}
              sizes="(max-width: 640px) 55vw, (max-width: 768px) 50vw, (max-width: 1024px) 42vw, 36vw"
            />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center -translate-y-[10%]">
              <Image
                src="/X.webp"
                alt="X"
                width={256}
                height={256}
                className="w-[18%] h-auto object-contain animate-spin-slow transition-all duration-300 group-hover:drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] select-none pointer-events-auto cursor-default active:scale-95 transition-transform"
                priority
                draggable={false}
                sizes="(max-width: 640px) 15vw, (max-width: 768px) 12vw, 10vw"
                onClick={handleXClick}
              />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 mb-0 max-w-2xl mx-auto font-semibold tracking-wide px-4 transition-all duration-500 animate-fade-in-up-desktop delay-400 text-white">
            ¿Tienes una idea?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 md:mb-10 max-w-2xl mx-auto leading-relaxed font-light tracking-wide px-4 transition-all duration-300 animate-fade-in-up-desktop delay-500 text-gray-400 group-hover:text-white">
            Realizamos todo tipo de impresión digital y litográfica, en diferentes materiales, tamaños y formas.
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#tarjeta"
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
