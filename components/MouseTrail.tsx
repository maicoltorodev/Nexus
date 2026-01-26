'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    radius: number;
    opacity: number;
}

export default function MouseTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const lastAdded = useRef<number>(0);

    useEffect(() => {
        if (typeof window === 'undefined' || window.innerWidth < 1024) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        if (!ctx) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const now = performance.now();
            // Throttling: Solo 1 partícula cada 16ms (~60fps)
            if (now - lastAdded.current < 16) return;
            lastAdded.current = now;

            particles.current.push({
                x: e.clientX,
                y: e.clientY,
                radius: 1.5,
                opacity: 0.8
            });

            // Pool ultra-reducido: Máximo 20 mini-partículas
            if (particles.current.length > 20) {
                particles.current.shift();
            }
        };

        const animate = () => {
            if (particles.current.length > 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#FFD700';

                for (let i = particles.current.length - 1; i >= 0; i--) {
                    const p = particles.current[i];
                    ctx.globalAlpha = p.opacity;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, 6.28);
                    ctx.fill();

                    p.opacity -= 0.05; // Desvanecimiento rápido
                    p.radius *= 0.98;

                    if (p.opacity <= 0) {
                        particles.current.splice(i, 1);
                    }
                }
            } else {
                // Si no hay partículas, limpiamos una última vez y esperamos
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        handleResize();
        requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[9999]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
