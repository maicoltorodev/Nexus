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

export const PROJECT_STATUSES = {
    PENDIENTE: 'pendiente',
    DISENO: 'diseño',
    DESARROLLO: 'desarrollo',
    COMPLETADO: 'completado'
} as const;

export const getStatusFromProgress = (progress: number): string => {
    if (progress >= 100) return PROJECT_STATUSES.COMPLETADO;
    if (progress >= 50) return PROJECT_STATUSES.DESARROLLO;
    if (progress >= 20) return PROJECT_STATUSES.DISENO;
    return PROJECT_STATUSES.PENDIENTE;
};

export const getProgressFromStatus = (status: string): number => {
    switch (status) {
        case PROJECT_STATUSES.COMPLETADO: return 100;
        case PROJECT_STATUSES.DESARROLLO: return 75;
        case PROJECT_STATUSES.DISENO: return 35;
        case PROJECT_STATUSES.PENDIENTE: return 10;
        default: return 0;
    }
};
