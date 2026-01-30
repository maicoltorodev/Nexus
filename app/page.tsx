'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WebServices from '@/components/WebServices';
import BusinessCard from '@/components/BusinessCard';
import Calculator from '@/components/Calculator';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import FloatingButton from '@/components/FloatingButton';
import FadeInSection from '@/components/ui/FadeInSection';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="relative">
      <Navbar isMenuOpen={isMenuOpen} onMenuToggle={setIsMenuOpen} />
      <Hero />
      <FadeInSection id="tarjeta">
        <BusinessCard />
      </FadeInSection>
      <FadeInSection id="web-design">
        <WebServices />
      </FadeInSection>
      <FadeInSection id="servicios">
        <Services />
      </FadeInSection>
      <FadeInSection id="calculadora">
        <Calculator />
      </FadeInSection>
      <FadeInSection id="testimonios">
        <Testimonials />
      </FadeInSection>
      <FadeInSection id="contacto">
        <Contact />
      </FadeInSection>
      <Footer />
      <FloatingButton isMenuOpen={isMenuOpen} />
    </main>
  );
}
