/**
 * Utilidad para manejar el scroll de precisión en toda la aplicación.
 * Resuelve el problema de secciones que no cargan a tiempo o layouts dinámicos.
 */

export const scrollToHash = (hash: string, delay: number = 500) => {
    if (!hash) return;

    const id = hash.replace('#', '').split('?')[0]; // Limpiar hash
    if (!id) return;

    const element = document.getElementById(id);
    if (element) {
        // 1. Primer intento inmediato
        element.scrollIntoView({ behavior: 'smooth' });

        // 2. Segundo intento de precisión después del delay
        // Esto compensa imágenes cargando, animaciones o cambios en el DOM
        setTimeout(() => {
            const reElement = document.getElementById(id);
            if (reElement) {
                reElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, delay);

        // 3. Tercer intento de seguridad para layouts muy pesados (opcional pero recomendado)
        setTimeout(() => {
            const finalElement = document.getElementById(id);
            if (finalElement) {
                finalElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, delay * 2.5);
    }
};

/**
 * Determina si un href es un enlace interno a un hash en la página actual
 */
export const isInternalHashLink = (href: string, currentPathname: string): boolean => {
    if (!href.includes('#')) return false;

    const [path] = href.split('#');
    // Se considera interno si el path es vacío, es '/' y estamos en home, o coincide exactamente
    return path === '' || (path === '/' && currentPathname === '/') || path === currentPathname;
};
