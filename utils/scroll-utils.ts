export const scrollToHash = (hash: string) => {
    if (!hash) return;

    const id = hash.replace('#', '').split('?')[0];
    const element = document.getElementById(id);

    if (element) {
        const offset = 90; // Compensación para la Navbar fija
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

const preventDefault = (e: Event) => {
    e.preventDefault();
};

const preventScrollKeys = (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
        e.preventDefault();
    }
};

let lockCount = 0;

export const lockScroll = () => {
    if (typeof window === 'undefined') return;
    if (lockCount === 0) {
        window.addEventListener('wheel', preventDefault, { passive: false });
        window.addEventListener('touchmove', preventDefault, { passive: false });
        window.addEventListener('keydown', preventScrollKeys, { passive: false });
    }
    lockCount++;
};

export const unlockScroll = () => {
    if (typeof window === 'undefined') return;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
        window.removeEventListener('wheel', preventDefault);
        window.removeEventListener('touchmove', preventDefault);
        window.removeEventListener('keydown', preventScrollKeys);
    }
};

export const isInternalHashLink = (href: string, currentPathname: string): boolean => {
    if (!href.includes('#')) return false;
    const [path] = href.split('#');
    return path === '' || path === '/' || path === currentPathname;
};
