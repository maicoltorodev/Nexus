import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { SECTION_IDS } from '@/data/navigation';

export function useNavigation(controlledOpen?: boolean, onMenuToggle?: (open: boolean) => void) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');
    const pathname = usePathname();

    const isMenuOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const setMenuOpen = useCallback((open: boolean) => {
        if (onMenuToggle) {
            onMenuToggle(open);
        } else {
            setInternalOpen(open);
        }
    }, [onMenuToggle]);

    // Manejo del scroll para el fondo del navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Bloqueo del scroll cuando el menú móvil está abierto
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    }, [isMenuOpen]);

    // Detección de sección activa (ScrollSpy)
    useEffect(() => {
        // Solo ejecutar en la página de inicio donde están las secciones
        if (pathname !== '/') {
            setActiveSection('');
            return;
        }

        const handleScrollSpy = () => {
            const sections = Object.values(SECTION_IDS);
            let currentSection = '';

            // Lógica: La sección activa es aquella cuyo borde superior está más cerca de una posición de referencia (ej. 1/3 de la pantalla)
            // o que ocupa la mayor parte de la pantalla.
            
            // Usamos una posición de referencia un poco bajada del top (100px por el navbar)
            const scrollPosition = window.scrollY + 150; 

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    
                    // Si el scroll está dentro de los límites de la sección
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        currentSection = sectionId;
                        break; // Encontramos la sección, salimos del loop
                    }
                }
            }

            // Caso especial: si estamos al final de la página, marcar la última sección (Contacto usualmente)
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                 // Asumiendo que contacto es la última, o buscar la última en el DOM
                 currentSection = SECTION_IDS.CONTACTO; 
            }

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScrollSpy, { passive: true });
        // Llamada inicial para establecer el estado correcto al cargar
        handleScrollSpy(); 

        return () => window.removeEventListener('scroll', handleScrollSpy);
    }, [pathname]);

    return {
        isMenuOpen,
        setMenuOpen,
        isScrolled,
        activeSection
    };
}
