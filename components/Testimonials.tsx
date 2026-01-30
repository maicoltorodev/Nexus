'use client';

import { useState, useEffect, useRef } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Albanys María Gamez Valero',
    text: 'Los mejores, quedamos súper encantados y el tiempo en llegar es súper corto. ¡Sin duda alguna los mejores!',
    rating: 5
  },
  {
    id: 2,
    name: 'Medios Audiovisuales CRD',
    text: 'El trabajo de Nexus siempre es impecable. Su disposición, atención y calidad de servicio son excelentes. Cada vez que se necesita algo adicional, están atentos.',
    rating: 5
  },
  {
    id: 3,
    name: 'Nelson Lopez',
    text: 'Son unos profesionales, rápidos y cumplidos, excelente atención al diseño e instalación, muy pulidos🌟',
    rating: 5
  },
  {
    id: 4,
    name: 'Leydy Peña',
    text: 'Quiero felicitar al equipo por el excelente servicio que me brindaron. Desde el primer momento, la atención fue amable, profesional y muy eficiente. Se nota el compromiso con la calidad y la satisfacción del cliente. ¡Totalmente recomendados!',
    rating: 5
  },
  {
    id: 5,
    name: 'Natalia Bernal',
    text: 'Muy buena experiencia, super rápidos y de buena calidad!',
    rating: 5
  },
  {
    id: 6,
    name: 'Natalia Peña',
    text: 'Hacen un excelente trabajo. Tienen un gran manejo del diseño, mucha creatividad y cuidan cada detalle en los proyectos. Muy recomendados para quienes buscan calidad y compromiso!!! 😊',
    rating: 5
  },
  {
    id: 7,
    name: 'Lina María Ramos Delgado',
    text: 'Mil gracias, quedé encantada con mis volantes. Puntuales, cumplidos y captaron mis ideas tal cuál',
    rating: 5
  },
  {
    id: 8,
    name: 'Attack Soluciones',
    text: 'La calidad y tiempo de entrega de los trabajos son muy buenos. Tienen muy buenos equipos para trabajar y el personal es excelente. Gracias por su apoyo y seguiremos trabajando!',
    rating: 5
  },
  {
    id: 9,
    name: 'Diego Vargas',
    text: 'Recomendadisimo, excelente trabajo, todo de muy alta calidad y se ve increíble el resultado, seguiré encargando mis productos con ustedes',
    rating: 5
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lógica de Auto-slide robusta
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Observer para pausar cuando no es visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          interval = setInterval(() => {
            nextSlide();
          }, 5000);
        } else {
          clearInterval(interval);
        }
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [isMobile, currentIndex]); // Se reinicia el timer cuando cambia el slide manualmente o cambia el layout

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-red-500 to-red-600',
      'from-green-500 to-green-600',
      'from-amber-700 to-amber-800',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-cyan-500 to-cyan-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600'
    ];
    return colors[index % colors.length];
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && currentIndex < testimonials.length - 1) {
      // Swipe izquierda - siguiente
      setCurrentIndex((prev) => prev + 1);
    } else if (distance < -minSwipeDistance && currentIndex > 0) {
      // Swipe derecha - anterior
      setCurrentIndex((prev) => prev - 1);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const goToSlide = (index: number) => {
    if (isMobile) {
      setCurrentIndex(index);
    } else {
      // En desktop, limitamos el índice para mostrar 3 a la vez
      const maxIndex = testimonials.length - 3;
      setCurrentIndex(Math.min(index, maxIndex));
    }
  };

  const nextSlide = () => {
    if (isMobile) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    } else {
      const maxIndex = testimonials.length - 3;
      setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1));
    }
  };

  const prevSlide = () => {
    if (isMobile) {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    } else {
      const maxIndex = testimonials.length - 3;
      setCurrentIndex((prev) => (prev - 1 + maxIndex + 1) % (maxIndex + 1));
    }
  };

  return (
    <section className="relative py-32 overflow-hidden bg-[#0a0a0a]">
      {/* Efecto de brillo dorado sutil optimizado */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 60%)' }}></div>
      {/* Efecto de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-[#FFD700] rounded-full blur-xl md:blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-[#FFA500] rounded-full blur-xl md:blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header mejorado */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-semibold text-[#FFD700] tracking-wider uppercase">Testimonios de Google</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Lo que dicen <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">nuestros clientes</span>
          </h2>

          {/* Badge de calificación con estrellas - Centrado debajo del título */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border border-[#FFD700]/30">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="relative w-5 h-5">
                    {/* Estrella de fondo (gris) */}
                    <svg className="absolute inset-0 w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {/* Estrella dorada (completa o parcial) */}
                    {i < 4 ? (
                      <svg className="absolute inset-0 w-5 h-5 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ) : (
                      <div className="absolute inset-0 overflow-hidden" style={{ width: '90%' }}>
                        <svg className="w-5 h-5 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <span className="text-2xl font-bold text-white">4.9</span>
              <span className="text-sm text-gray-400">de 5 estrellas</span>
            </div>
          </div>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            Experiencias reales de quienes confían en nosotros
          </p>
        </div>

        {/* Carrusel */}
        <div className="relative">
          {/* Contenedor del carrusel */}
          <div
            ref={carouselRef}
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: isMobile
                  ? `translateX(-${currentIndex * 100}%)`
                  : `translateX(-${currentIndex * (100 / 3)}%)`
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`flex-shrink-0 ${isMobile ? 'w-full' : 'w-1/3 px-3'
                    }`}
                >
                  <div className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 border border-[#FFD700]/10 hover:border-[#FFD700]/40 transition-all duration-500 h-full">
                    {/* Efecto de brillo al hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/0 to-[#FFA500]/0 group-hover:from-[#FFD700]/5 group-hover:to-[#FFA500]/5 transition-all duration-500 rounded-2xl"></div>

                    {/* Línea superior dorada */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                    {/* Contenido */}
                    <div className="relative z-10">
                      {/* Avatar y nombre */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarColor(index)} flex items-center justify-center text-2xl font-bold text-white flex-shrink-0`}>
                          {getInitial(testimonial.name)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{testimonial.name}</h3>
                          {/* Estrellas */}
                          <div className="flex gap-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <svg key={i} className="w-5 h-5 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Texto del testimonio */}
                      <p className="text-gray-300 leading-relaxed italic">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 p-3 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] transition-all duration-300 shadow-lg hover:shadow-xl"
            aria-label="Testimonio anterior"
          >
            <svg className="w-6 h-6 text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 p-3 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] transition-all duration-300 shadow-lg hover:shadow-xl"
            aria-label="Siguiente testimonio"
          >
            <svg className="w-6 h-6 text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>

        {/* Link a Google Reviews */}
        <div className="mt-12 text-center">
          <a
            href="https://www.google.com/search?q=NEXUS+ESTUDIO+GRAFICO&oq=NEXUS+ESTUDIO+GRAFICO&gs_lcrp=EgZjaHJvbWUyDAgAEEUYORjjAhiABDINCAEQLhivARjHARiABDIKCAIQABiABBiiBDIHCAMQABjvBTIKCAQQABiABBiiBDIGCAUQRRg8MgYIBhBFGDwyBggHEEUYPNIBBzMwMmowajeoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0x8e3f9b175e0b947b:0xd3315c1cd8c20385,1,,,,"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border border-[#FFD700]/30 hover:border-[#FFD700] hover:from-[#FFD700]/20 hover:to-[#FFA500]/20 transition-all duration-300 group"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-white font-medium group-hover:text-[#FFD700] transition-colors">
              Ver todos los comentarios en Google
            </span>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[#FFD700] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
