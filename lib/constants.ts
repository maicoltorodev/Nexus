import { Rocket, Zap, Terminal, Smartphone, Sparkles } from 'lucide-react';

export interface Plan {
    id: string;
    title: string;
    description: string;
    days: number;
    color: string;
    icon: any;
}

export const NEXUS_PLANS: Record<string, Plan> = {
    lanzamiento: {
        id: "lanzamiento",
        title: "Lanzamiento Web",
        description: "1-3 días de entrega. Ideal para presencia rápida.",
        days: 3,
        color: "from-cyan-400 to-blue-500",
        icon: Rocket
    },
    funcional: {
        id: "funcional",
        title: "Sitio Funcional",
        description: "4-6 días de entrega. Estructura sólida y SEO inicial.",
        days: 6,
        color: "from-emerald-400 to-green-500",
        icon: Zap
    },
    experiencia: {
        id: "experiencia",
        title: "Experiencia Cliente",
        description: "5-7 días de entrega. Conversión y agendamiento.",
        days: 7,
        color: "from-purple-600 to-fuchsia-600",
        icon: Terminal
    },
    crecimiento: {
        id: "crecimiento",
        title: "Crecimiento Pro",
        description: "10-13 días de entrega. E-commerce y CRM.",
        days: 13,
        color: "from-red-500 to-rose-600",
        icon: Smartphone
    },
    medida: {
        id: "medida",
        title: "A tu Medida",
        description: "Variable. Proyectos técnicos específicos.",
        days: 20,
        color: "from-[#FFD700] to-[#FFA500]",
        icon: Sparkles
    }
};

// Export también como array para compatibilidad
export const NEXUS_PLANS_ARRAY: Plan[] = Object.values(NEXUS_PLANS);
