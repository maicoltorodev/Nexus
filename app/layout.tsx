import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import MouseTrail from "@/components/MouseTrail";
import CustomCursor from "@/components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL('https://nexustoprint.vercel.app'),
  title: "Nexus Estudio Gráfico | Impresión Digital y Litográfica en Bogotá | Diseño Gráfico Profesional",
  description: "Nexus Estudio Gráfico ofrece soluciones profesionales en diseño e impresión digital y litográfica en Bogotá, Colombia. Tarjetas de presentación, volantes, gran formato, papelería comercial, promocionales y más. Servicio rápido, calidad premium y atención personalizada. Calle 71 # 69M - 05, Barrio La Estrada.",
  keywords: [
    "impresión digital",
    "impresión litográfica",
    "diseño gráfico",
    "tarjetas de presentación",
    "volantes publicitarios",
    "gran formato",
    "banners",
    "vinilos",
    "papelería comercial",
    "facturas",
    "membretes",
    "promocionales",
    "esferos",
    "bolsas ecológicas",
    "Bogotá",
    "Colombia",
    "nexus estudio gráfico",
    "nexus to print",
    "impresión rápida",
    "diseño profesional",
    "branding",
    "identidad visual",
    "marketing visual"
  ],
  authors: [{ name: "Nexus Estudio Gráfico" }],
  creator: "Nexus Estudio Gráfico",
  publisher: "Nexus Estudio Gráfico",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://nexustoprint.vercel.app",
    siteName: "Nexus Estudio Gráfico",
    title: "Nexus Estudio Gráfico | Impresión Digital y Litográfica en Bogotá",
    description: "Soluciones profesionales en diseño e impresión digital y litográfica. Tarjetas, volantes, gran formato, papelería comercial y promocionales. Servicio rápido y calidad premium en Bogotá, Colombia.",
    images: [
      {
        url: "/imagen-meta-data.jpg",
        width: 1200,
        height: 630,
        alt: "Nexus Estudio Gráfico - Impresión Digital y Litográfica en Bogotá",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Estudio Gráfico | Impresión Digital y Litográfica en Bogotá",
    description: "Soluciones profesionales en diseño e impresión digital y litográfica. Servicio rápido y calidad premium en Bogotá, Colombia.",
    images: ["/imagen-meta-data.jpg"],
    creator: "@NEXUS.COL",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://nexustoprint.vercel.app",
  },
  verification: {
    // Agregar códigos de verificación si los tienes
    // google: "tu-codigo-google",
    // yandex: "tu-codigo-yandex",
    // bing: "tu-codigo-bing",
  },
  category: "Diseño Gráfico e Impresión",
  classification: "Estudio Gráfico",
  other: {
    "contact:phone_number": "+57 318 402 2999",
    "contact:email": "nexustoprint@gmail.com",
    "contact:address": "Calle 71 # 69M - 05, Barrio La Estrada, Bogotá, Colombia",
    "contact:business_hours": "Lunes a Viernes: 8:00 - 13:00 y 14:00 - 18:00",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Nexus Estudio Gráfico",
    "image": "https://nexustoprint.vercel.app/imagen-meta-data.jpg",
    "description": "Soluciones profesionales en diseño e impresión digital y litográfica en Bogotá, Colombia",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle 71 # 69M - 05",
      "addressLocality": "Bogotá",
      "addressRegion": "Cundinamarca",
      "addressCountry": "CO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 4.682148050380403,
      "longitude": -74.09166590203546
    },
    "url": "https://nexustoprint.vercel.app",
    "telephone": "+57-318-402-2999",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "08:00",
        "closes": "13:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "14:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/nexus.col",
      "https://www.facebook.com/nexustoprint"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "50"
    },
    "service": [
      {
        "@type": "Service",
        "serviceType": "Impresión Digital",
        "description": "Impresión digital de alta calidad en diferentes materiales"
      },
      {
        "@type": "Service",
        "serviceType": "Impresión Litográfica",
        "description": "Impresión litográfica profesional para grandes volúmenes"
      },
      {
        "@type": "Service",
        "serviceType": "Diseño Gráfico",
        "description": "Diseño gráfico profesional para identidad de marca y marketing visual"
      },
      {
        "@type": "Service",
        "serviceType": "Gran Formato",
        "description": "Banners, vinilos, panaflex, microperforado y retablos"
      }
    ]
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
      >
        <CustomCursor />
        <MouseTrail />
        {children}
      </body>
    </html>
  );
}
