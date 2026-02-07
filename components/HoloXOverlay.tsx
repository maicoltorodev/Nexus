'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  pieces?: number;
};

const HoloXOverlay: React.FC<Props> = ({ src, className, style, pieces = 36 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !hydrated) return;
    let raf = 0;
    let px = 0, py = 0;
    const tick = () => {
      raf = 0;
      const angle = Math.atan2(py - 0.5, px - 0.5);
      const deg = (angle * 180) / Math.PI + 180;
      const tiltX = (py - 0.5) * -10;
      const tiltY = (px - 0.5) * 10;
      el.style.setProperty('--angle', `${deg}deg`);
      el.style.setProperty('--tiltX', `${tiltX}deg`);
      el.style.setProperty('--tiltY', `${tiltY}deg`);
      el.style.setProperty('--x', `${px}`);
      el.style.setProperty('--y', `${py}`);
    };
    const onMove = (e: MouseEvent) => {
      px = e.clientX / window.innerWidth;
      py = e.clientY / window.innerHeight;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, hydrated]);

  const shards = useMemo(() => {
    function mulberry32(a: number) {
      return function() {
        let t = (a += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    const rand = mulberry32(123456);
    const arr: { clip: string; phase: number; depth: number; opacity: number }[] = [];
    for (let i = 0; i < pieces; i++) {
      const cx = rand() * 100;
      const cy = rand() * 100;
      const r = 8 + rand() * 18;
      const jag = 3 + Math.floor(rand() * 4);
      const pts: string[] = [];
      for (let j = 0; j < jag; j++) {
        const ang = (j / jag) * Math.PI * 2 + rand() * 0.6;
        const rr = r * (0.6 + rand() * 0.6);
        const x = Math.max(0, Math.min(100, cx + Math.cos(ang) * rr));
        const y = Math.max(0, Math.min(100, cy + Math.sin(ang) * rr));
        pts.push(`${x}% ${y}%`);
      }
      arr.push({
        clip: `polygon(${pts.join(',')})`,
        phase: Math.floor(rand() * 360),
        depth: Math.floor(rand() * 6),
        opacity: 0.30 + rand() * 0.25
      });
    }
    return arr;
  }, [pieces, hydrated]);

  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskPosition: 'center',
    maskPosition: 'center'
  };

  return (
    <div ref={ref} className={`holo-x ${className || ''}`} style={style}>
      <img src={src} alt="X" className="x-img" draggable={false} />
      {hydrated ? (
        <div className="mask" style={maskStyle}>
          {shards.map((s, idx) => (
            <div
              key={idx}
              className="piece"
              style={{
                clipPath: s.clip,
                opacity: s.opacity,
                ['--phase' as any]: `${s.phase}deg`,
                ['--depth' as any]: s.depth
              }}
            />
          ))}
          <div className="shine" />
        </div>
      ) : (
        <div className="mask" style={maskStyle}>
          <div className="base-foil" />
        </div>
      )}
      <style jsx>{`
        .holo-x {
          position: absolute;
          pointer-events: none;
          transform: translateZ(2px);
          --angle: 0deg;
          --tiltX: 0deg;
          --tiltY: 0deg;
          --x: 0.5;
          --y: 0.5;
        }
        .x-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .mask {
          position: absolute;
          inset: 0;
        }
        .base-foil {
          position: absolute;
          inset: 0;
          background: conic-gradient(from var(--angle), #ffd700, #ff00ff, #00ffff, #ffa500, #ffffff, #ffd700);
          mix-blend-mode: screen;
          opacity: 0.28;
        }
        .piece {
          position: absolute;
          inset: 0;
          background: conic-gradient(
            from calc(var(--angle) + var(--phase)),
            #ffd700,
            #ff00ff,
            #00ffff,
            #ffa500,
            #ffffff,
            #ffd700
          );
          mix-blend-mode: screen;
          filter: saturate(120%) brightness(115%);
          box-shadow: inset 0 0 0 0.75px rgba(255, 255, 255, 0.18);
          transform: perspective(800px) rotateX(var(--tiltX)) rotateY(var(--tiltY)) translateZ(calc(var(--depth) * 1px));
        }
        .shine {
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 120% at calc(var(--x) * 100%) calc(var(--y) * 100%), rgba(255,255,255,0.55), rgba(255,255,255,0) 45%);
          mix-blend-mode: overlay;
          opacity: 0.25;
          transform: perspective(800px) rotateX(var(--tiltX)) rotateY(var(--tiltY));
        }
        @media (prefers-reduced-motion: reduce) {
          .piece, .shine {
            transform: none;
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default HoloXOverlay;
