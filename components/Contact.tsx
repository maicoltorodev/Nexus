'use client';

import { useViewportCenter } from '@/hooks/useViewportCenter';
import { useState, useEffect } from 'react';

const CONTACT = {
  phone: '318 402 2999',
  email: 'info@nexustoprint.com',
  address: 'Calle 71 # 69M - 05',
  city: 'Bogotá, Colombia',
};

const SCHEDULE: { day: string; times: string[] }[] = [
  { day: 'Lunes', times: ['8:30 AM – 1:00 PM', '2:00 PM – 6:00 PM'] },
  { day: 'Martes', times: ['8:30 AM – 1:00 PM', '2:00 PM – 6:00 PM'] },
  { day: 'Miércoles', times: ['8:30 AM – 1:00 PM', '2:00 PM – 6:00 PM'] },
  { day: 'Jueves', times: ['8:30 AM – 1:00 PM', '2:00 PM – 6:00 PM'] },
  { day: 'Viernes', times: ['8:30 AM – 1:00 PM', '2:00 PM – 6:00 PM'] },
  { day: 'Sábado', times: ['9:00 AM – 3:00 PM'] },
  { day: 'Domingo', times: ['Cerrado'] },
];

const LOCATIONS = [
  {
    id: 'principal',
    label: 'Sede 1',
    address: 'Calle 71 # 69M - 05',
    city: 'Bogotá, Colombia',
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.5037717737646!2d-74.09166590203546!3d4.682148050380403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9b175e0b947b%3A0xd3315c1cd8c20385!2sNEXUS%20ESTUDIO%20GRAFICO!5e0!3m2!1ses-419!2sco!4v1769066189707!5m2!1ses-419!2sco",
    link: "https://maps.google.com/?q=NEXUS+ESTUDIO+GRAFICO"
  },
  {
    id: 'sede-produccion',
    label: 'Sede 2',
    address: 'Cra. 69m #70-78',
    city: 'Bogotá, Colombia',
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d994.1262836325701!2d-74.092404671466!3d4.681908299704594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9b112a7d799b%3A0x7b12948660ff7b07!2sCra.%2069m%20%2370-78%2C%20Bogot%C3%A1!5e0!3m2!1ses-419!2sco!4v1771638923286!5m2!1ses-419!2sco",
    link: "https://www.google.com/maps/search/?api=1&query=Cra.+69m+%2370-78,+Bogot%C3%A1"
  }
];

export default function Contact() {
  const { centeredId, registerElement } = useViewportCenter();
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0]);

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

        <div className="space-y-10">
          <div
            ref={(el) => registerElement('contact-0', el)}
            className={`group relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 border transition-all duration-500 overflow-hidden md:hover:border-[#FFD700]/40 ${centeredId === 'contact-0' ? 'border-[#FFD700]/40' : 'border-[#FFD700]/10'}`}
            style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 md:group-hover:from-[#FFD700]/5 md:group-hover:to-[#FFA500]/5 ${centeredId === 'contact-0' ? 'from-[#FFD700]/5 to-[#FFA500]/5' : 'from-[#FFD700]/0 to-[#FFA500]/0'}`}></div>
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent transition-transform duration-500 md:group-hover:scale-x-100 ${centeredId === 'contact-0' ? 'scale-x-100' : 'scale-x-0'}`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">Información de Contacto</h3>
                  <p className="text-sm text-gray-400 mt-1">Respuestas rápidas y atención personalizada</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/5 text-[#FFD700] text-xs font-bold tracking-wide">
                  <span>Disponibles hoy</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#FFD700]/40 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/10 border border-[#FFD700]/20 text-[#FFD700] flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Teléfono</p>
                      <h4 className="text-lg font-bold text-white">{CONTACT.phone}</h4>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">WhatsApp</p>
                  <button
                    onClick={() => openWhatsApp(CONTACT.phone)}
                    className="mt-4 w-full px-4 py-2 rounded-lg bg-[#FFD700] text-black text-xs font-bold tracking-wide shadow-[0_8px_30px_rgba(255,215,0,0.35)] hover:shadow-[0_12px_40px_rgba(255,215,0,0.5)] transition-all hover:scale-[1.02]"
                    aria-label="Contactar por WhatsApp"
                  >
                    WhatsApp
                  </button>
                </div>
                <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#FFD700]/40 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/10 border border-[#FFD700]/20 text-[#FFD700] flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Correo</p>
                      <h4 className="text-lg font-bold text-white">{CONTACT.email}</h4>
                    </div>
                  </div>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="mt-9 w-full inline-flex justify-center px-4 py-2 rounded-lg bg-[#FFD700] text-black text-xs font-bold tracking-wide shadow-[0_8px_30px_rgba(255,215,0,0.35)] hover:shadow-[0_12px_40px_rgba(255,215,0,0.5)] transition-all hover:scale-[1.02]"
                    aria-label="Enviar correo"
                  >
                    Enviar correo
                  </a>
                </div>
                <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#FFD700]/40 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/10 border border-[#FFD700]/20 text-[#FFD700] flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Ubicación</p>
                      <h4 className="text-lg font-bold text-white">{activeLocation.address}</h4>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{activeLocation.city}</p>
                  <a
                    href={activeLocation.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full inline-flex justify-center px-4 py-2 rounded-lg bg-[#FFD700] text-black text-xs font-bold tracking-wide shadow-[0_8px_30px_rgba(255,215,0,0.35)] hover:shadow-[0_12px_40px_rgba(255,215,0,0.5)] transition-all hover:scale-[1.02]"
                    aria-label="Abrir en Google Maps"
                  >
                    Ver mapa
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={(el) => registerElement('contact-1', el)}
            className={`group relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 border transition-all duration-500 overflow-hidden md:hover:border-[#FFD700]/40 ${centeredId === 'contact-1' ? 'border-[#FFD700]/40' : 'border-[#FFD700]/10'}`}
            style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 md:group-hover:from-[#FFD700]/5 md:group-hover:to-[#FFA500]/5 ${centeredId === 'contact-1' ? 'from-[#FFD700]/5 to-[#FFA500]/5' : 'from-[#FFD700]/0 to-[#FFA500]/0'}`}></div>
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent transition-transform duration-500 md:group-hover:scale-x-100 ${centeredId === 'contact-1' ? 'scale-x-100' : 'scale-x-0'}`}></div>
            <div className="relative z-10 w-full text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Horarios de Atención</h3>
              <ScheduleBlock schedule={SCHEDULE} />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-center gap-4 mb-6">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setActiveLocation(loc)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${activeLocation.id === loc.id
                  ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                  : 'bg-transparent text-gray-400 border-white/10 hover:border-[#FFD700]/50 hover:text-white'
                  }`}
              >
                {loc.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border-2 border-[#FFD700]/30 shadow-2xl transition-all duration-500">
            <iframe
              src={activeLocation.mapUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[450px] bg-black"
              title={`Mapa de ${activeLocation.label}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ScheduleBlock({ schedule }: { schedule: { day: string; times: string[] }[] }) {
  const [selectedDay, setSelectedDay] = useState<string>('Lunes');
  const selected = schedule.find((s) => s.day === selectedDay);
  const [paused, setPaused] = useState<boolean>(false);
  useEffect(() => {
    if (paused) return;
    const i = schedule.findIndex((s) => s.day === selectedDay);
    const next = schedule[(i + 1) % schedule.length]?.day;
    const t = setTimeout(() => setSelectedDay(next), 3000);
    return () => clearTimeout(t);
  }, [selectedDay, paused, schedule]);

  return (
    <div className="mt-2">
      <p className="text-center text-gray-300 font-bold mb-4">Horarios de Atención</p>
      <div className="flex flex-wrap justify-center gap-3">
        {schedule.map((entry) => {
          const active = entry.day === selectedDay;
          return (
            <button
              key={entry.day}
              onClick={() => {
                setSelectedDay(entry.day);
                setPaused(true);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${active
                ? 'bg-[#FFD700] text-black shadow-[0_8px_30px_rgba(255,215,0,0.35)]'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              aria-label={`Ver horario de ${entry.day}`}
            >
              {entry.day}
            </button>
          );
        })}
      </div>
      <div className="mt-4 text-center text-gray-300 font-medium">
        {selected ? selected.times.join(' / ') : ''}
      </div>
    </div>
  );
}
