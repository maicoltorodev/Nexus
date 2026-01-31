'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    ChevronRight,
    Gamepad2,
    Zap,
    Target,
    Database,
    Cloud,
    Lock,
    Activity,
    FileText
} from 'lucide-react';
import { getClientes, getProyectos, getSystemStatus } from '@/lib/actions';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NEXUS_PLANS, NEXUS_PLANS_ARRAY } from '@/lib/constants';
import AdminLoading from './loading';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function AdminDashboard() {
    const [stats, setStats] = useState({ clients: 0, projects: 0, developing: 0, files: 0 });
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    const [systemStatus, setSystemStatus] = useState({ database: '...', blob: '...', auth: '...' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboardData() {
            const [clients, projects, health] = await Promise.all([
                getClientes(),
                getProyectos(),
                getSystemStatus()
            ]);

            setStats({
                clients: clients.length,
                projects: projects.length,
                developing: projects.filter((p: any) => p.estado !== 'finalizado').length,
                files: projects.reduce((acc: number, p: any) => acc + (p.archivos?.length || 0), 0)
            });

            setRecentProjects(projects.slice(0, 5));
            setSystemStatus(health);
            setLoading(false);
        }
        loadDashboardData();
    }, []);

    if (loading) return <AdminLoading />;

    return (
        <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 text-[#FFD700] mb-2">
                        <Gamepad2 className="w-5 h-5 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] font-[family-name:var(--font-orbitron)]">Consola de Comando</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                        Nuestro <span className="bg-gradient-to-r from-[#FFD700] via-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">Ecosistema</span>
                    </h1>
                </motion.div>
            </header>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <StatCard icon={TrendingUp} label="Proyectos Totales" value={stats.projects} color="#FFD700" />
                <StatCard icon={Users} label="Clientes Activos" value={stats.clients} color="#a855f7" />
                <StatCard icon={Zap} label="En Desarrollo" value={stats.developing} color="#22d3ee" />
                <Link href="/admin/archivos" className="block hover:scale-[1.02] transition-all">
                    <StatCard icon={FileText} label="Archivos" value={stats.files} color="#f43f5e" />
                </Link>
            </motion.div>

            {/* REAL Health Monitor Banner - FULL WIDTH */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="relative group bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 md:p-10 overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] -z-10" />
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-400 relative">
                            <Activity className="w-10 h-10 animate-pulse" />
                            <div className="absolute inset-0 rounded-3xl border border-emerald-500/20 animate-ping opacity-20" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Live Status</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 max-w-3xl">
                        <HealthStat icon={Database} label="Nexus Database" value={systemStatus.database} status="Optimal" />
                        <HealthStat icon={Cloud} label="Vercel Cloud" value={systemStatus.blob} status="Synced" />
                        <HealthStat icon={Lock} label="Auth Protocol" value={systemStatus.auth} status="Active" />
                    </div>
                </div>
            </motion.div>

            {/* Main Content - Expanded Project Table */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-purple-500/5 blur-3xl rounded-[3rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden">
                    <div className="p-8 border-b border-white/5 text-center">
                        <h2 className="text-xl font-bold font-[family-name:var(--font-orbitron)]">Últimos Flujos Operativos</h2>
                        <p className="text-xs text-gray-500 font-medium">Monitoreo en tiempo real de la actividad del estudio</p>
                    </div>
                    <div className="overflow-x-auto">
                        {recentProjects.length > 0 ? (
                            <table className="w-full text-left">
                                <tbody>
                                    {recentProjects.map((proj, idx) => {
                                        // Búsqueda más robusta por ID o Título
                                        const projectPlan = NEXUS_PLANS_ARRAY.find(p =>
                                            proj.plan?.toLowerCase().includes(p.id) ||
                                            p.title.toLowerCase().includes(proj.plan?.toLowerCase())
                                        ) || NEXUS_PLANS_ARRAY[0];

                                        return (
                                            <tr key={idx} className="group/row hover:bg-white/[0.02] transition-colors">
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col">
                                                        <span className={`font-bold text-xl group-hover/row:bg-gradient-to-r ${projectPlan.color} group-hover/row:bg-clip-text group-hover/row:text-transparent transition-all`}>{proj.nombre}</span>
                                                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Cliente: {proj.cliente?.nombre}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col gap-3 min-w-[200px]">
                                                        <div className="flex justify-between text-[11px] font-black font-[family-name:var(--font-orbitron)] tracking-widest uppercase">
                                                            <span className={`bg-gradient-to-r ${projectPlan.color} bg-clip-text text-transparent`}>Progreso: {proj.progreso}%</span>
                                                            <span className="text-gray-400 opacity-60 group-hover/row:opacity-100 transition-opacity">Sistema: {proj.estado}</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${proj.progreso}%` }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                                className={`h-full bg-gradient-to-r ${projectPlan.color} rounded-full relative overflow-hidden`}
                                                            >
                                                                {/* Energy Stripes Animation */}
                                                                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:1rem_1rem] opacity-30 animate-[move-bg_3s_linear_infinite]" />
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <Link href={`/admin/proyectos/${proj.id}`} className={`inline-flex h-14 w-14 items-center justify-center bg-white/5 rounded-2xl border border-white/5 group-hover/row:border-white/20 transition-all text-gray-500 group-hover/row:text-white group-hover/row:bg-gradient-to-br ${projectPlan.color} group-hover/row:scale-105 active:scale-95 shadow-lg group-hover/row:shadow-current/20`}>
                                                        <ChevronRight className="w-6 h-6" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-24 flex flex-col items-center justify-center text-center px-6">
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-gray-700 mb-6 border border-white/5">
                                    <Database className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Sin Activos Registrados</h3>
                                <p className="text-gray-500 text-sm max-w-xs mb-8">No se han detectado flujos operativos en el sistema. Inicializa un proyecto para comenzar el monitoreo.</p>
                                <Link
                                    href="/admin/proyectos"
                                    className="px-8 py-4 bg-[#FFD700] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-[0_10px_30px_rgba(255,215,0,0.2)]"
                                >
                                    Crear Primer Proyecto
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </motion.section>
        </div>
    );
}

function HealthStat({ icon: Icon, label, value, status }: any) {
    return (
        <div className="flex flex-col gap-3 p-6 rounded-3xl bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-all">
            <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">{status}</span>
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-bold text-white tracking-wide">{value}</p>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: any) {
    return (
        <motion.div
            variants={item}
            className="bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] group hover:border-white/10 transition-all cursor-default relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500" style={{ color }}>
                    <Icon className="w-6 h-6" />
                </div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
                <h3 className="text-4xl font-black text-white font-[family-name:var(--font-orbitron)] tracking-tight">{value}</h3>
            </div>
        </motion.div>
    );
}
