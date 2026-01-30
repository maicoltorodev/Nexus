import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export function useNavigation(controlledOpen?: boolean, onMenuToggle?: (open: boolean) => void) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    const isMenuOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const setMenuOpen = useCallback((open: boolean) => {
        if (onMenuToggle) {
            onMenuToggle(open);
        } else {
            setInternalOpen(open);
        }
    }, [onMenuToggle]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    }, [isMenuOpen]);

    const handleLinkClick = useCallback((e: React.MouseEvent<HTMLElement>, href: string) => {
        setMenuOpen(false);
        // La navegación se maneja de forma nativa o por otro método externo
    }, [setMenuOpen]);

    return {
        isMenuOpen,
        setMenuOpen,
        isScrolled,
        handleLinkClick
    };
}
