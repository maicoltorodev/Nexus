'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Zap, Target, Layers, Layout, Maximize, Palette, ShieldCheck } from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Impresión Digital',
    description: 'Impresión de alta calidad para cuadernos, revistas, posters, adhesivos, habladores, tarjetas y volantes. Soluciones versátiles para cada proyecto.',
    image: '/servicios/impresion-digital.webp',
    icon: <Layers className="w-8 h-8" />,
    tag: 'Versatilidad'
  },
  {
    id: 2,
    title: 'Impresión Gran Formato',
    description: 'Banners, vinilos y microperforados de hasta 150cm de ancho. Incluimos servicios profesionales de laminado, terminados e instalación.',
    image: '/servicios/impresion-gran-formato.webp',
    icon: <Maximize className="w-8 h-8" />,
    tag: 'Impacto'
  },
  {
    id: 3,
    title: 'Diseño Gráfico',
    description: 'Diseño y diagramación experta: logotipos, piezas gráficas, folletos y carpetas corporativas. Creamos el ADN visual de tu marca.',
    image: '/servicios/diseño-grafico.webp',
    icon: <Palette className="w-8 h-8" />,
    tag: 'Creatividad'
  },
  {
    id: 4,
    title: 'Material P.O.P',
    description: 'Impresión en rígidos, estampado y sublimación. Expertos en botones, manillas, agendas y habladores personalizados para tu marca.',
    image: '/servicios/material-pop.webp',
    icon: <Target className="w-8 h-8" />,
    tag: 'Promoción'
  },
  {
    id: 5,
    title: 'Plotter de Corte',
    description: 'Semicorte preciso en vinilos textiles, frost, adhesivos y tornasol. Rotulación de color o impresa con acabados laminados profesionales.',
    image: '/servicios/plotter-corte.webp',
    icon: <Layout className="w-8 h-8" />,
    tag: 'Precisión'
  },
  {
    id: 6,
    title: 'Corte Láser',
    description: 'Corte y grabado en acrílico, poliestireno y MDF. Creamos llaveros, trofeos y avisos con acabados industriales de alta definición.',
    image: '/servicios/corte-laser.webp',
    icon: <Zap className="w-8 h-8" />,
    tag: 'Tecnología'
  },
  {
    id: 7,
    title: 'Troquelado',
    description: 'Troqueles en madera con cuchillas de alta durabilidad. Cortes limpios con formas personalizadas que hacen tus trabajos únicos y llamativos.',
    image: '/servicios/troquelado.webp',
    icon: <ShieldCheck className="w-8 h-8" />,
    tag: 'Acabados'
  }
];

export default function Services() {
  const openWhatsApp = (serviceTitle: string) => {
    const phoneNumber = '573184022999';
    const message = encodeURIComponent(`Hola Nexus, me interesa información premium sobre: ${serviceTitle}.`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="servicios" className="relative py-32 bg-[#050505] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FFD700]/5 rounded-full blur-[150px] opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#FFA500]/5 rounded-full blur-[150px] opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-24 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD700]">High Impact Solutions</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none"
          >
            Ingeniería <span className="text-[#FFD700]">Visual</span>
          </motion.h2>
          <div className="w-24 h-1 bg-[#FFD700] mt-8 hidden lg:block rounded-full"></div>
        </div>

        <div className="space-y-40">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}
            >
              {/* Image Container with 700x450 Aspect Ratio */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full lg:w-3/5"
              >
                <div
                  onClick={() => openWhatsApp(service.title)}
                  className="relative aspect-[700/450] rounded-[40px] overflow-hidden group border border-white/5 cursor-pointer shadow-2xl"
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  {/* Premium Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[40px]"></div>

                  {/* Dynamic Corner Detail */}
                  <div className="absolute bottom-6 right-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowRight className="w-6 h-6 text-[#FFD700]" />
                  </div>

                  <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Service {service.id.toString().padStart(2, '0')}</span>
                  </div>
                </div>
              </motion.div>

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full lg:w-2/5 space-y-6 text-center lg:text-left"
              >
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <div className="w-14 h-14 bg-[#FFD700] rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                    {service.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em]">{service.tag}</span>
                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight leading-none mt-1">
                      {service.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xl text-gray-400 font-light leading-relaxed">
                  {service.description}
                </p>

                <div className="pt-4">
                  <button
                    onClick={() => openWhatsApp(service.title)}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all duration-300 group"
                  >
                    Solicitar Cotización
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
