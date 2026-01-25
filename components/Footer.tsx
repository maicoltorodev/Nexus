import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0a0a0a] text-white py-16 border-t border-[#FFD700]/20 overflow-hidden">
      {/* Efecto de fondo sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-[#FFD700] rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Logo y descripción */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative w-32 h-32 mb-6 opacity-90">
              <Image
                src="/nexus.webp"
                alt="Nexus Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-center md:text-left leading-relaxed font-light text-sm">
              Soluciones profesionales en impresión y diseño gráfico. Transformamos ideas en realidad.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#FFD700] tracking-wide">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              {[
                { href: '#inicio', label: 'Inicio' },
                { href: '#servicios', label: 'Servicios' },
                { href: '#calculadora', label: 'Calculadora' },
                { href: '#contacto', label: 'Contacto' }
              ].map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-[#FFD700] transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#FFD700] transition-all duration-300"></span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#FFD700]/20 pt-8 text-center">
          <p className="text-gray-500 text-sm font-light">
            © {currentYear} Nexus. Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
