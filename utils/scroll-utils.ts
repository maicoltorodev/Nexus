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

export const isInternalHashLink = (href: string, currentPathname: string): boolean => {
    if (!href.includes('#')) return false;
    const [path] = href.split('#');
    return path === '' || path === '/' || path === currentPathname;
};
