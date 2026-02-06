import ClientShell from '@/components/ClientShell';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WebServices from '@/components/WebServices';
import BusinessCard from '@/components/BusinessCard';
import Calculator from '@/components/Calculator';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import FadeInSection from '@/components/ui/FadeInSection';
import ProjectStatusSearch from '@/components/ProjectStatusSearch';

export default function Home() {
  return (
    <ClientShell>
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
      <FadeInSection id="seguimiento">
        <ProjectStatusSearch />
      </FadeInSection>
      <FadeInSection id="contacto">
        <Contact key="contact-unified-v1" />
      </FadeInSection>
      <Footer />
    </ClientShell>
  );
}
