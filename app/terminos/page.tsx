import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Nexus Estudio Gráfico',
  description: 'Términos y condiciones de uso de los servicios de Nexus Estudio Gráfico.',
};

export default function TerminosPage() {
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
          Términos y Condiciones
        </h1>

        <div className="space-y-8 text-gray-300 leading-relaxed font-light">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Introducción</h2>
            <p>
              Bienvenido a Nexus Estudio Gráfico. Al acceder a nuestro sitio web y utilizar nuestros servicios, aceptas cumplir con los siguientes términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, te recomendamos no utilizar nuestros servicios.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Servicios</h2>
            <p>
              Ofrecemos servicios de diseño gráfico, impresión digital y litográfica, desarrollo web y branding. Nos reservamos el derecho de modificar o discontinuar cualquier servicio en cualquier momento sin previo aviso.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Servicios Web (Plan Estándar)</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Alcance:</strong> El servicio se basa en una plantilla de arquitectura fija. No se realizan modificaciones estructurales ni de diseño (CSS/HTML) fuera de la personalización de marca (Logotipo, colores, tipografías, imágenes y textos).</li>
              <li><strong>Insumos:</strong> El plazo de entrega de 48 horas inicia <strong>únicamente</strong> cuando el cliente ha entregado la totalidad del contenido (textos, imágenes, logo).</li>
              <li><strong>Renovación:</strong> El plan incluye Dominio (.com o .co) y Hosting por un (1) año. La renovación anual tiene un costo fijo de $250.000 COP.</li>
              <li><strong>Garantía:</strong> Se ofrece 1 semana de soporte post-entrega para ajustes menores de contenido. No incluye mantenimiento mensual ni actualizaciones de código.</li>
              <li><strong>Política de Reembolso Web:</strong> Una vez registrado el dominio, este costo no es reembolsable bajo ninguna circunstancia.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Pedidos y Pagos</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Todos los trabajos requieren un anticipo del 50% para iniciar la producción o diseño.</li>
              <li>El saldo restante debe ser cancelado contra entrega o antes del envío final de archivos digitales.</li>
              <li>Los precios están sujetos a cambios sin previo aviso, aunque se respetarán las cotizaciones vigentes por 15 días.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Entregas y Tiempos</h2>
            <p>
              Los tiempos de entrega son estimados y pueden variar según la complejidad del proyecto y la carga de trabajo. No nos hacemos responsables por retrasos causados por terceros (transportadoras) o fuerza mayor.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Derechos de Autor</h2>
            <p>
              El cliente garantiza que tiene los derechos sobre las imágenes y textos proporcionados para el diseño. Nexus Estudio Gráfico se reserva el derecho de exhibir los trabajos realizados en su portafolio, a menos que exista un acuerdo de confidencialidad previo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">7. Cambios y Devoluciones</h2>
            <p>
              Debido a la naturaleza personalizada de nuestros productos, no se aceptan devoluciones una vez aprobado el diseño y realizada la impresión, salvo defectos de fabricación imputables a Nexus Estudio Gráfico.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">8. Contacto</h2>
            <p>
              Si tienes dudas sobre estos términos, puedes contactarnos a través de nuestro correo electrónico o WhatsApp oficial.
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
