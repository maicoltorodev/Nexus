'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function FloatingButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showHelpText, setShowHelpText] = useState(false);
  const [showCardText, setShowCardText] = useState(false);
  const [showCalculatorText, setShowCalculatorText] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Si entra a la sección, esperamos 3 segundos para mostrar el mensaje
          timer = setTimeout(() => {
            setShowCardText(true);
          }, 3000);
        } else {
          // Si sale de la sección, ocultamos y limpiamos el timer
          setShowCardText(false);
          clearTimeout(timer);
        }
      },
      { threshold: 0.5 } // Detectar cuando al menos el 50% sea visible
    );

    const tarjetaSection = document.getElementById('tarjeta');
    if (tarjetaSection) {
      observer.observe(tarjetaSection);
    }

    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      setIsVisible(scrollPosition > heroHeight * 0.8);

      if (!showCalculatorText && !showCardText) {
        const serviciosSection = document.getElementById('servicios');
        if (serviciosSection) {
          const serviciosTop = serviciosSection.offsetTop;
          const serviciosBottom = serviciosTop + serviciosSection.offsetHeight;
          const isInViewport = scrollPosition + window.innerHeight > serviciosTop && scrollPosition < serviciosBottom;
          setShowHelpText(isInViewport && scrollPosition > heroHeight * 0.8);
        }
      } else {
        setShowHelpText(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [showCalculatorText, showCardText]);

  // Escuchar cuando se usa la calculadora y detectar cuando se sale de la sección
  useEffect(() => {
    // Limpiar cache al montar (no persistir entre sesiones)
    localStorage.removeItem('calculatorUsed');

    // Escuchar el evento personalizado
    const handleCalculatorUsed = () => {
      setShowCalculatorText(true);
    };

    const handleScroll = () => {
      const calculadoraSection = document.getElementById('calculadora');
      if (calculadoraSection) {
        const calculadoraTop = calculadoraSection.offsetTop;
        const calculadoraBottom = calculadoraTop + calculadoraSection.offsetHeight;
        const scrollPosition = window.scrollY;
        const viewportBottom = scrollPosition + window.innerHeight;

        // Si se sale de la sección de calculadora, ocultar el mensaje y limpiar cache
        const isInViewport = scrollPosition < calculadoraBottom && viewportBottom > calculadoraTop;
        if (!isInViewport && showCalculatorText) {
          setShowCalculatorText(false);
          localStorage.removeItem('calculatorUsed');
        }
      }
    };

    window.addEventListener('calculatorUsed', handleCalculatorUsed);
    window.addEventListener('scroll', handleScroll);

    // Limpiar al recargar la página
    const handleBeforeUnload = () => {
      localStorage.removeItem('calculatorUsed');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('calculatorUsed', handleCalculatorUsed);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showCalculatorText]);

  const openWhatsApp = () => {
    const phoneNumber = '573184022999'; // Número sin espacios, con código de país
    const message = encodeURIComponent('Hola, Estoy interesado en uno de sus servicios.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
      {/* Texto de ayuda para servicios */}
      {(showHelpText && !showCalculatorText) && (
        <div className="relative transition-all duration-500 opacity-100 translate-x-0">
          <div className="relative bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0a0a0a] px-4 py-2 rounded-lg shadow-xl border-2 border-[#FFD700]/50 font-semibold text-sm md:text-base whitespace-nowrap">
            ¿Necesitas Ayuda?
          </div>
          {/* Flecha apuntando al botón */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-[#FFD700] border-b-[6px] border-b-transparent"></div>
        </div>
      )}

      {/* Texto de ayuda para calculadora */}
      {showCalculatorText && (
        <div className="relative transition-all duration-500 opacity-100 translate-x-0">
          <div className="relative bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0a0a0a] px-4 py-2 rounded-lg shadow-xl border-2 border-[#FFD700]/50 font-semibold text-sm md:text-base whitespace-nowrap">
            ¡Click aquí y lo hacemos de una!
          </div>
          {/* Flecha apuntando al botón */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-[#FFD700] border-b-[6px] border-b-transparent"></div>
        </div>
      )}

      {/* Texto de ayuda para la tarjeta */}
      {showCardText && (
        <div className="relative transition-all duration-500 opacity-100 translate-x-0">
          <div className="relative bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0a0a0a] px-4 py-2 rounded-lg shadow-xl border-2 border-[#FFD700]/50 font-semibold text-sm md:text-base whitespace-nowrap">
            ¡Click y hacemos tu tarjeta!
          </div>
          {/* Flecha apuntando al botón */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-[#FFD700] border-b-[6px] border-b-transparent"></div>
        </div>
      )}

      {/* Botón FAB */}
      <button
        onClick={openWhatsApp}
        className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-2xl border-2 border-[#FFD700]/50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        style={{
          animation: isVisible ? 'float 3s ease-in-out infinite' : 'none',
          boxShadow: '0 10px 40px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 15px 50px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.5)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 10px 40px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        aria-label="Contactar por WhatsApp"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/X.webp"
            alt="X"
            fill
            className="object-contain p-3"
            priority
            style={{ filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))' }}
          />
        </div>
      </button>
    </div>
  );
}
