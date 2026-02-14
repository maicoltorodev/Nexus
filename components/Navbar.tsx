'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { NAV_LINKS, SOCIAL_LINKS } from '@/data/navigation';
import MobileMenu from '@/components/MobileMenu';
import { useNavigation } from '@/hooks/use-navigation';

import { useState } from 'react';

function SocialLink({ social, forceColor = false }: { social: any, forceColor?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 transition-all hover:scale-110 duration-300"
      aria-label={social.label}
      style={{ color: isHovered || forceColor ? social.color : undefined }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {social.icon}
    </a>
  );
}

interface NavbarProps {
  isMenuOpen?: boolean;
  onMenuToggle?: (open: boolean) => void;
}

export default function Navbar({ isMenuOpen: controlledOpen, onMenuToggle }: NavbarProps) {
  const { isMenuOpen, setMenuOpen, isScrolled, activeSection } = useNavigation(controlledOpen, onMenuToggle);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div
          className={`w-full transition-all duration-500 pointer-events-auto ${isScrolled || isMenuOpen
            ? 'py-3 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'py-6 bg-transparent'
            }`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className={`transition-opacity duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {/* Desktop Logo */}
                <Link href="/" className="hidden lg:flex group items-center gap-2">
                  <Image
                    src="/nexus.webp"
                    alt="Nexus Logo"
                    width={100}
                    height={40}
                    className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                    priority
                  />
                </Link>

                {/* Mobile Social Icons */}
                <div className="flex lg:hidden items-center gap-4">
                  {SOCIAL_LINKS.map((social) => (
                    <SocialLink key={social.label} social={social} forceColor={true} />
                  ))}
                </div>
              </div>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-1">
                {NAV_LINKS.map((link) => {
                  // Extraer el ID del href (ej: "/#inicio" -> "inicio")
                  const linkId = link.href.replace('/#', '');
                  const isActive = activeSection === linkId;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative rounded-full ${isActive
                        ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.3)] font-bold scale-105'
                        : 'text-gray-300 hover:text-[#FFD700] hover:bg-white/5'
                        }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <div className="ml-6 pl-6 border-l border-white/10 flex items-center gap-4">
                  {SOCIAL_LINKS.map((social) => (
                    <SocialLink key={social.label} social={social} />
                  ))}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!isMenuOpen)}
                className={`lg:hidden relative z-[60] w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-500 border ${isMenuOpen ? 'opacity-0 pointer-events-none' :
                  isScrolled ? 'bg-[#0a0a0a]/80 border-white/10 text-white' : 'bg-black/60 border-white/40 text-white backdrop-blur-md'
                  }`}
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
