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
  return (
    <main id="inicio" className="relative">
      <Navbar />
      <Hero />
      <BusinessCard />
      <WebServices />
      <Services />
      <Calculator />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingButton />
    </main>
  );
}
