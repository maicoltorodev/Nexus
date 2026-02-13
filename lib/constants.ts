import { Zap } from 'lucide-react';

export interface Plan {
    id: string;
    title: string;
    description: string;
    days: number;
    color: string;
    icon: any;
}

export const NEXUS_PLANS: Record<string, Plan> = {
    estandar: {
        id: "estandar",
        title: "Plan Estándar",
        description: "Entrega en 48 horas. Todo incluido.",
        days: 2,
        color: "from-cyan-400 to-blue-600",
        icon: Zap
    }
};

// Export también como array para compatibilidad
export const NEXUS_PLANS_ARRAY: Plan[] = Object.values(NEXUS_PLANS);
