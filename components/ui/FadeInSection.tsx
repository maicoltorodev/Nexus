'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInSectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
}

export default function FadeInSection({ children, className, id }: FadeInSectionProps) {
    return (
        <div id={id} className={`scroll-section ${className || ''} optimize-section w-full`}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        </div>
    );
}
