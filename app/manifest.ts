import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Nexus Estudio Gráfico',
        short_name: 'Nexus',
        description: 'Soluciones profesionales en diseño e impresión digital y litográfica en Bogotá, Colombia',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#8b5cf6',
        orientation: 'portrait-primary',
        scope: '/',
        lang: 'es-CO',
        dir: 'ltr',
        categories: ['business', 'design', 'productivity'],
        icons: [
            {
                src: '/favicon.ico',
                sizes: '48x48',
                type: 'image/x-icon',
            },
            {
                src: '/icon',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/apple-icon',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
        shortcuts: [
            {
                name: 'Servicios',
                short_name: 'Servicios',
                description: 'Ver todos nuestros servicios',
                url: '/#servicios',
                icons: [
                    {
                        src: '/icon',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                ],
            },
            {
                name: 'Contacto',
                short_name: 'Contacto',
                description: 'Contáctanos',
                url: '/#contacto',
                icons: [
                    {
                        src: '/icon',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                ],
            },
        ],
    };
}
