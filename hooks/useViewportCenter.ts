'use client';

import { useState, useEffect, useRef } from 'react';

export function useViewportCenter() {
  const [centeredId, setCenteredId] = useState<string | null>(null);
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const isMobile = () => window.innerWidth < 768; // md breakpoint de Tailwind

    const checkCentered = () => {
      // Solo activar en móvil
      if (!isMobile()) {
        setCenteredId(null);
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      let closestId: string | null = null;
      let closestDistance = Infinity;

      elementsRef.current.forEach((element, id) => {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - elementCenter);

        // Si el elemento está en el centro del viewport (con un margen del 30% de la altura del viewport)
        if (distance < window.innerHeight * 0.3 && distance < closestDistance) {
          closestDistance = distance;
          closestId = id;
        }
      });

      setCenteredId(closestId);
    };

    checkCentered();
    window.addEventListener('scroll', checkCentered, { passive: true });
    window.addEventListener('resize', checkCentered, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkCentered);
      window.removeEventListener('resize', checkCentered);
    };
  }, []);

  const registerElement = (id: string, element: HTMLElement | null) => {
    if (element) {
      elementsRef.current.set(id, element);
    } else {
      elementsRef.current.delete(id);
    }
  };

  return { centeredId, registerElement };
}
