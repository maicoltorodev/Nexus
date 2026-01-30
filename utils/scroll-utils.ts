export const scrollToHash = (hash: string) => {
    if (!hash) return;

    const id = hash.replace('#', '').split('?')[0];
    const element = document.getElementById(id);

    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

export const isInternalHashLink = (href: string, currentPathname: string): boolean => {
    if (!href.includes('#')) return false;
    const [path] = href.split('#');
    return path === '' || path === '/' || path === currentPathname;
};
