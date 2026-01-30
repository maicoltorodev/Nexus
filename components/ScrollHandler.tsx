'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { scrollToHash } from '@/utils/scroll-utils';

export default function ScrollHandler() {
    const pathname = usePathname();

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash) {
                scrollToHash(hash);
            }
        };

        // Ejecutar al cargar la ruta (por si venimos de otra página con hash)
        handleHashChange();

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [pathname]);

    return null;
}
