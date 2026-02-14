import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Nexus Estudio Gráfico',
  description: 'Política de tratamiento de datos y privacidad de Nexus Estudio Gráfico.',
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#FFD700] hover:text-[#FFA500] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Volver al Inicio
        </Link>

        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFA500] mb-8">
          Política de Privacidad
        </h1>

        <div className="space-y-8 text-gray-300 leading-relaxed font-light">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Responsable del Tratamiento</h2>
            <p>
              Nexus Estudio Gráfico, con domicilio en Bogotá, Colombia, es el responsable del tratamiento de los datos personales que nos proporciones. Nos comprometemos a proteger tu privacidad y cumplir con la normativa colombiana de protección de datos (Ley 1581 de 2012).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Datos que Recopilamos</h2>
            <p>Podemos recopilar la siguiente información:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Datos de contacto: Nombre, correo electrónico, número de teléfono, dirección física.</li>
              <li>Información del proyecto: Detalles necesarios para la prestación del servicio.</li>
              <li>Datos para registro de dominios: Información requerida por la ICANN para la titularidad de dominios web.</li>
              <li>Datos de navegación: Cookies y estadísticas de uso del sitio web.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Finalidad del Tratamiento</h2>
            <p>Tus datos serán utilizados para:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Procesar tus pedidos y cotizaciones.</li>
              <li>Contactarte sobre el estado de tus proyectos.</li>
              <li>Enviar información promocional (si has dado tu consentimiento).</li>
              <li>Mejorar la experiencia de usuario en nuestro sitio web.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Compartición de Datos</h2>
            <p>
              No vendemos tu información personal. Sin embargo, para la prestación de servicios web (Registro de Dominios y Hosting), es necesario compartir ciertos datos (Nombre, Email, Teléfono, Dirección) con proveedores de infraestructura tecnológica y registradores de dominio acreditados, en cumplimiento con las normativas internacionales de la ICANN.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos contra el acceso no autorizado, pérdida o alteración.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Tus Derechos</h2>
            <p>
              Tienes derecho a conocer, actualizar, rectificar y solicitar la supresión de tus datos personales de nuestras bases de datos. Para ejercer estos derechos, contáctanos a través de nuestros canales oficiales.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">7. Cookies</h2>
            <p>
              Este sitio utiliza cookies para mejorar la funcionalidad y analizar el tráfico. Al continuar navegando, aceptas el uso de estas tecnologías.
            </p>
          </section>

          <div className="pt-8 border-t border-white/10 text-sm text-gray-500">
            Última actualización: Febrero 2026
          </div>
        </div>
      </div>
    </div>
  );
}
