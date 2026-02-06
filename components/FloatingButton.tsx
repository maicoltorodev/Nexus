'use client';

import { useState, useEffect } from 'react';

export default function FloatingButton({ isMenuOpen }: { isMenuOpen?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showHelpText, setShowHelpText] = useState(false);
  const [showCardText, setShowCardText] = useState(false);
  const [showCalculatorText, setShowCalculatorText] = useState(false);
  const [showWaazaaaText, setShowWaazaaaText] = useState(false);

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
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Detectar si está en el fondo de la página (con un margen de 50px)
      const isAtBottom = scrollPosition + windowHeight >= documentHeight - 50;
      setShowWaazaaaText(isAtBottom);

      setIsVisible(scrollPosition > heroHeight * 0.8);

      if (!showCalculatorText && !showCardText && !isAtBottom) {
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

  if (isMenuOpen) return null;

  return (
    <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
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

      {/* Easter Egg: Mensaje cuando llega al final */}
      {showWaazaaaText && (
        <div className="relative transition-all duration-500 opacity-100 translate-x-0 animate-bounce">
          <div className="relative bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0a0a0a] px-4 py-2 rounded-lg shadow-xl border-2 border-[#FFD700]/50 font-black text-sm md:text-base whitespace-nowrap">
            WaaZaaaaa
          </div>
          {/* Flecha apuntando al botón */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-[#FFD700] border-b-[6px] border-b-transparent"></div>
        </div>
      )}

      {/* Botón FAB */}
      <div style={{ animation: showWaazaaaText ? 'crazy-shake 0.5s ease-in-out infinite' : 'float 3s ease-in-out infinite' }}>
        <button
          onClick={openWhatsApp}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-2xl border-2 border-[#FFD700]/50 transition-transform duration-300"
          style={{
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
          <div className="relative w-full h-full flex items-center justify-center p-3 md:p-4">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full text-white drop-shadow-md"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
