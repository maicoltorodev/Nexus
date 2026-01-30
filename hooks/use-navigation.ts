import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { scrollToHash, isInternalHashLink } from '@/utils/scroll-utils';

export function useNavigation(controlledOpen?: boolean, onMenuToggle?: (open: boolean) => void) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

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
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    }, [isMenuOpen]);

    const handleLinkClick = useCallback((e: React.MouseEvent<HTMLElement>, href: string) => {
        const [path, hash] = href.split('#');
        const isInternal = isInternalHashLink(href, pathname);

        if (hash && isInternal) {
            e.preventDefault();
            setMenuOpen(false);

            // Delay for mobile menu animation
            const delay = isMenuOpen ? 300 : 0;
            setTimeout(() => {
                scrollToHash(hash);
                window.history.pushState(null, '', href);
            }, delay);
        } else {
            setMenuOpen(false);
        }
    }, [pathname, isMenuOpen, setMenuOpen]);

    return {
        isMenuOpen,
        setMenuOpen,
        isScrolled,
        handleLinkClick
    };
}
