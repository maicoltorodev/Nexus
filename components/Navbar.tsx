'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { NAV_LINKS, SOCIAL_LINKS } from '@/data/navigation';
import MobileMenu from '@/components/MobileMenu';
import { useNavigation } from '@/hooks/use-navigation';

interface NavbarProps {
  isMenuOpen?: boolean;
  onMenuToggle?: (open: boolean) => void;
}

export default function Navbar({ isMenuOpen: controlledOpen, onMenuToggle }: NavbarProps) {
  const { isMenuOpen, setMenuOpen, isScrolled, handleLinkClick } = useNavigation(controlledOpen, onMenuToggle);

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
                <Link href="/" className="group flex items-center gap-2">
                  <span className="text-xl font-black tracking-tighter text-white">
                    NE<span className="text-[#FFD700]">X</span>US
                  </span>
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#FFD700] transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
                ))}

                <div className="ml-6 pl-6 border-l border-white/10 flex items-center gap-4">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-all hover:scale-110"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
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
        onLinkClick={handleLinkClick}
      />
    </>
  );
}

