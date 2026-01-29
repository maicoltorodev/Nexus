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

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main id="inicio" className="relative">
      <Navbar isMenuOpen={isMenuOpen} onMenuToggle={setIsMenuOpen} />
      <Hero />
      <BusinessCard />
      <WebServices />
      <Services />
      <Calculator />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingButton isMenuOpen={isMenuOpen} />
    </main>
  );
}
