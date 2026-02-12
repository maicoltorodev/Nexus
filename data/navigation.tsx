import { Facebook, Instagram, MessageCircle } from 'lucide-react';

export const SECTION_IDS = {
    INICIO: 'inicio',
    PROPOSITO: 'proposito',
    TARJETA: 'tarjeta',
    WEB_DESIGN: 'web-design',
    SERVICIOS: 'servicios',
    CALCULADORA: 'calculadora',
    TESTIMONIOS: 'testimonios',
    SEGUIMIENTO: 'seguimiento',
    CONTACTO: 'contacto',
};

export const NAV_LINKS = [
    { href: `/#${SECTION_IDS.INICIO}`, label: 'Inicio', desc: 'Volver arriba' },
    { href: `/#${SECTION_IDS.TARJETA}`, label: 'Tarjetas', desc: 'Presentación premium' },
    { href: `/#${SECTION_IDS.WEB_DESIGN}`, label: 'Webs', desc: 'Tu sitio profesional' },
    { href: `/#${SECTION_IDS.SERVICIOS}`, label: 'Impresión', desc: 'Calidad litográfica' },
    { href: `/#${SECTION_IDS.CALCULADORA}`, label: 'Calculadora', desc: 'Cotiza al instante' },
    { href: `/#${SECTION_IDS.TESTIMONIOS}`, label: 'Opiniones', desc: 'Qué dicen de nosotros' },
    { href: `/#${SECTION_IDS.SEGUIMIENTO}`, label: 'Proyectos', desc: 'Estado de tu proyecto' },
    { href: `/#${SECTION_IDS.PROPOSITO}`, label: 'Esencia', desc: 'Nuestra misión y visión' },
    { href: `/#${SECTION_IDS.CONTACTO}`, label: 'Contacto', desc: 'Hablemos de tu idea' }
];

export const SOCIAL_LINKS = [
    { icon: <Facebook className="w-5 h-5" />, href: "https://facebook.com", label: "Facebook", color: "#1877F2" },
    { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com/nexus.col", label: "Instagram", color: "#E4405F" },
    { icon: <MessageCircle className="w-5 h-5" />, href: "https://wa.me/573184022999", label: "WhatsApp", color: "#25D366" }
];
