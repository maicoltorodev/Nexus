'use client';

import { useState } from 'react';

export default function QuoteForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    especificaciones: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simular envío del formulario
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        especificaciones: ''
      });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }, 1000);
  };

  return (
    <section id="cotiza" className="relative py-24 overflow-hidden bg-[#0a0a0a]">
      {/* Efecto de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD700] rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header mejorado */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5">
            <span className="text-sm font-semibold text-[#FFD700] tracking-wider uppercase">Cotización</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Inicia tu <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Proyecto</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed font-light">
            Completa el formulario y nos pondremos en contacto contigo
          </p>
        </div>

        {/* Formulario mejorado */}
        <form onSubmit={handleSubmit} className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-8 md:p-12 border border-[#FFD700]/20 shadow-2xl">
          {/* Efecto de brillo sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent rounded-3xl pointer-events-none"></div>
          
          <div className="relative space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-white mb-3 tracking-wide">
                  Nombre <span className="text-[#FFD700]">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-[#0a0a0a] border border-[#FFD700]/20 rounded-xl focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] transition-all text-white placeholder-gray-500 font-light"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-3 tracking-wide">
                  Email <span className="text-[#FFD700]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-[#0a0a0a] border border-[#FFD700]/20 rounded-xl focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] transition-all text-white placeholder-gray-500 font-light"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-semibold text-white mb-3 tracking-wide">
                Teléfono <span className="text-[#FFD700]">*</span>
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                required
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-[#0a0a0a] border border-[#FFD700]/20 rounded-xl focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] transition-all text-white placeholder-gray-500 font-light"
                placeholder="+57 300 000 0000"
              />
            </div>

            <div>
              <label htmlFor="especificaciones" className="block text-sm font-semibold text-white mb-3 tracking-wide">
                Especificaciones del proyecto
              </label>
              <textarea
                id="especificaciones"
                name="especificaciones"
                rows={6}
                value={formData.especificaciones}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-[#0a0a0a] border border-[#FFD700]/20 rounded-xl focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] transition-all resize-none text-white placeholder-gray-500 font-light"
                placeholder="Describe tu proyecto, materiales, tamaños, cantidades, etc."
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full font-semibold py-5 px-8 rounded-xl text-lg transition-all duration-500 overflow-hidden text-[#0a0a0a] disabled:opacity-50"
                style={{ 
                  background: isSubmitting ? '#666' : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  boxShadow: '0 10px 40px rgba(255, 215, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.boxShadow = '0 15px 50px rgba(255, 215, 0, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(255, 215, 0, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>

            {submitStatus === 'success' && (
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 text-center">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>¡Gracias! Hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto.</span>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-400 text-center">
                <span>Hubo un error al enviar el formulario. Por favor, intenta nuevamente.</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
