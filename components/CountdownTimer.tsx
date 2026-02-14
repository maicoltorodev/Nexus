'use client';

import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

export default function CountdownTimer({ targetDate, isCompleted, size = 'large' }: { targetDate: Date | null, isCompleted?: boolean, size?: 'small' | 'large' }) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const calculateTime = () => {
            if (!targetDate) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                setIsLoading(false);
                return;
            }

            if (isCompleted) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                setIsLoading(false);
                return;
            }

            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + Math.floor(distance / (1000 * 60 * 60 * 24)) * 24;
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft({ hours, minutes, seconds });
            }
            setIsLoading(false);
        };

        // Calcular inmediatamente al montar
        calculateTime();

        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [targetDate, isCompleted]);

    const activeColor = isCompleted ? "text-emerald-500" : "text-[#FFD700]";
    const boxSizeClass = size === 'small' ? 'w-16 h-20 md:w-24 md:h-28' : 'w-20 h-28 sm:w-24 sm:h-32 md:w-40 md:h-48';
    const textSizeClass = size === 'small' ? 'text-3xl md:text-5xl' : 'text-4xl sm:text-5xl md:text-8xl';
    const separatorClass = size === 'small' ? 'text-3xl md:text-5xl pt-2' : 'text-4xl sm:text-5xl md:text-8xl pt-4';

    if (isLoading) {
        return (
            <div className="flex gap-2 md:gap-4 justify-center animate-pulse">
                <SkeletonBox boxClass={boxSizeClass} />
                <div className={`${separatorClass} text-white/10 flex items-start`}>:</div>
                <SkeletonBox boxClass={boxSizeClass} />
                <div className={`${separatorClass} text-white/10 flex items-start`}>:</div>
                <SkeletonBox boxClass={boxSizeClass} />
            </div>
        );
    }

    if (!targetDate) {
        return (
            <div className="flex gap-4 justify-center items-center opacity-30 py-8">
                {[0, 150, 300].map((delay) => (
                    <div
                        key={delay}
                        className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="flex gap-2 md:gap-4 justify-center">
            <TimeBox
                value={timeLeft.hours}
                label="Horas"
                colorClass={isCompleted ? activeColor : "text-[#FFD700]"}
                boxClass={boxSizeClass}
                textClass={textSizeClass}
            />
            <div className={`${separatorClass} font-black text-gray-600 animate-pulse flex items-start`}>:</div>
            <TimeBox
                value={timeLeft.minutes}
                label="Min"
                colorClass={isCompleted ? activeColor : "text-[#FFD700]"}
                boxClass={boxSizeClass}
                textClass={textSizeClass}
            />
            <div className={`${separatorClass} font-black text-gray-600 animate-pulse flex items-start`}>:</div>
            <TimeBox
                value={timeLeft.seconds}
                label="Seg"
                colorClass={isCompleted ? activeColor : "text-[#FFD700]"}
                boxClass={boxSizeClass}
                textClass={textSizeClass}
            />
        </div>
    );
}

function TimeBox({ value, label, colorClass = "text-white", boxClass, textClass }: any) {
    return (
        <div className="text-center group">
            <div className={`relative bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center mb-2 md:mb-4 overflow-hidden transition-transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.05)] ${boxClass}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className={`font-black tracking-tighter z-10 ${colorClass === 'text-white' ? 'text-white' : colorClass} ${textClass} drop-shadow-2xl`}>
                    {typeof value === 'number' ? value.toString().padStart(2, '0') : value}
                </span>
            </div>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 group-hover:text-white transition-colors">{label}</span>
        </div>
    );
}

function SkeletonBox({ boxClass }: any) {
    return (
        <div className="text-center">
            <div className={`relative bg-white/5 border border-white/5 rounded-2xl md:rounded-[2.5rem] mb-2 md:mb-4 ${boxClass}`} />
            <div className="h-3 w-12 bg-white/5 rounded-full mx-auto" />
        </div>
    );
}
