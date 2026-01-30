'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import FloatingButton from '@/components/FloatingButton';

interface ClientShellProps {
    children: React.ReactNode;
}

export default function ClientShell({ children }: ClientShellProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <main className="relative">
            <Navbar isMenuOpen={isMenuOpen} onMenuToggle={setIsMenuOpen} />
            {children}
            <FloatingButton isMenuOpen={isMenuOpen} />
        </main>
    );
}
