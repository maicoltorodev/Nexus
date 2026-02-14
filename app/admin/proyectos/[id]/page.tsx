'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProyectos, updateProyectoProgreso, uploadArchivo, updateProyectoVisibilidad, deleteArchivo, updateProyectoPlan, updateProyectoFecha, updateProyectoLink, deleteProyecto, addNota } from '@/lib/actions';
import { useToast } from '@/app/providers/ToastProvider';
import {
    Users,
    Globe,
    Box,
    Loader2,
    Upload,
    Download,
    Trash2,
    Save,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileText,
    Layout,
    MousePointer2,
    Sparkles,
    Zap,
    ChevronLeft,
    Rocket,
    Smartphone,
    Terminal,
    User,
    Eye,
    EyeOff,
    ShieldAlert,
    Edit2,
    Settings2,
    Calendar,
    X,
    ChevronRight as ChevronRightIcon,
    Link2,
    Image as ImageIcon,
    MessageSquare,
    ExternalLink,
    Send,
    Menu,
    Grid,
    MessageCircle,
    FolderOpen,
    Cpu,
    Briefcase,
    TrendingUp,
    CreditCard,
    Camera,
    Banknote,
    Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLoading from '../../loading';
import CountdownTimer from '@/components/CountdownTimer';
import Link from 'next/link';
import { NEXUS_PLANS, NEXUS_PLANS_ARRAY, getStatusFromProgress, getProgressFromStatus } from '@/lib/constants';

type TabType = 'overview' | 'communication' | 'vault' | 'settings' | 'briefing' | 'finance';

export default function ProyectoDetalle() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [estado, setEstado] = useState('');
    const [visibilidad, setVisibilidad] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    // Estados de UI y Modales
    const [uploading, setUploading] = useState(false);
    const [togglingVisibilidad, setTogglingVisibilidad] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [archivoToDelete, setArchivoToDelete] = useState<any>(null);
    const [isDeletingArchivo, setIsDeletingArchivo] = useState(false);
    const [isEditingPlan, setIsEditingPlan] = useState(false);
    const [pendingPlan, setPendingPlan] = useState<string | null>(null);
    const [showConfirmPlan, setShowConfirmPlan] = useState(false);
    const [showVerifyName, setShowVerifyName] = useState(false);
    const [verifyInput, setVerifyInput] = useState('');
    const [hasPendingChanges, setHasPendingChanges] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [tempDate, setTempDate] = useState('');
    const [isEditingLink, setIsEditingLink] = useState(false);
    const [tempLink, setTempLink] = useState('');
    const [showConfirmDeleteProject, setShowConfirmDeleteProject] = useState(false);
    const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
    const [isDeletingProject, setIsDeletingProject] = useState(false);
    const [replyNote, setReplyNote] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    const dragCounter = useRef(0);
    const { showToast } = useToast();
    const prevFilesCount = useRef(-1);

    // --- EFFECT: Carga Inicial y Polling ---
    useEffect(() => {
        loadProject();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (project && !hasPendingChanges && !isEditingPlan && !isEditingDate && !isEditingLink) {
            interval = setInterval(() => {
                loadProject(true);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [project?.id, hasPendingChanges, isEditingPlan, isEditingDate, isEditingLink]);

    // --- EFFECT: Notificación Nuevos Archivos ---
    useEffect(() => {
        if (project?.archivos) {
            const currentCount = project.archivos.length;
            if (prevFilesCount.current !== -1 && currentCount > prevFilesCount.current) {
                showToast('¡NUEVO ARCHIVO DEL CLIENTE!', 'success');
            }
            prevFilesCount.current = currentCount;
        }
    }, [project?.archivos]);

    // --- EFFECT: Protección de Navegación ---
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasPendingChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasPendingChanges]);

    // --- LOGIC: Carga de Datos ---
    async function loadProject(silent = false) {
        if (!silent) setLoading(true);
        try {
            const projects = await getProyectos();
            const p = projects.find((p: any) => p.id === params.id);
            if (p) {
                setProject(p);
                if (!hasPendingChanges) {
                    setProgreso(p.progreso);
                    setEstado(p.estado);
                    setVisibilidad(p.visibilidad ?? true);
                }
            }
        } catch (error) {
            console.error("Polling error", error);
        } finally {
            if (!silent) setLoading(false);
        }
    }

    // --- LOGIC: Updates & Sync ---
    const updateProgresoAndEstado = (val: number) => {
        setProgreso(val);
        setEstado(getStatusFromProgress(val));
        setHasPendingChanges(true);
    };

    const updateEstadoAndProgreso = (nuevoEstado: string) => {
        setEstado(nuevoEstado);
        setProgreso(getProgressFromStatus(nuevoEstado));
        setHasPendingChanges(true);
    };

    async function handleSyncChanges() {
        setSaving(true);
        const result = await updateProyectoProgreso(params.id as string, progreso, estado);
        if (result.success) {
            showToast('CAMBIOS SINCRONIZADOS', 'success');
            setHasPendingChanges(false);
            await loadProject();
            if (pendingNavigation) {
                router.push(pendingNavigation);
                setPendingNavigation(null);
            }
        } else {
            showToast('ERROR DE SINCRONIZACIÓN', 'error');
        }
        setSaving(false);
    }

    const handleConfirmLinkChange = async () => {
        if (!project) return;
        setSaving(true);
        try {
            const result = await updateProyectoLink(project.id, tempLink);
            if (result.success) {
                showToast('ENLACE ACTUALIZADO', 'success');
                setIsEditingLink(false);
                loadProject();
            } else {
                showToast('ERROR AL ACTUALIZAR', 'error');
            }
        } catch (error) {
            showToast('ERROR DE CONEXIÓN', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!project) return;
        setIsDeletingProject(true);
        try {
            const result = await deleteProyecto(project.id);
            if (result.success) {
                showToast('PROYECTO ELIMINADO', 'success');
                router.push('/admin/clientes');
            } else {
                showToast('ERROR AL ELIMINAR', 'error');
                setIsDeletingProject(false);
            }
        } catch (error) {
            setIsDeletingProject(false);
        }
    };

    const handleSendReply = async () => {
        if (!replyNote.trim() || !project) return;
        setSendingReply(true);
        try {
            const result = await addNota(project.id, replyNote, 'admin');
            if (result.success) {
                setReplyNote('');
                await loadProject(true);
                showToast('MENSAJE ENVIADO', 'success');
            } else {
                showToast('ERROR AL ENVIAR', 'error');
            }
        } catch (e) {
            showToast('ERROR AL ENVIAR', 'error');
        } finally {
            setSendingReply(false);
        }
    };

    async function handleUpdateFecha() {
        if (!tempDate) return;
        setSaving(true);
        // Ajustar zona horaria añadiendo 'T12:00:00' para evitar desfases de día
        const result = await updateProyectoFecha(params.id as string, new Date(tempDate + 'T12:00:00'));
        if (result.success) {
            showToast('FECHA ACTUALIZADA', 'success');
            setIsEditingDate(false);
            await loadProject();
        } else {
            showToast('ERROR AL ACTUALIZAR', 'error');
        }
        setSaving(false);
    }

    async function handleToggleVisibilidad() {
        setTogglingVisibilidad(true);
        const nuevaVisibilidad = !visibilidad;
        await updateProyectoVisibilidad(params.id as string, nuevaVisibilidad);
        setVisibilidad(nuevaVisibilidad);
        setTogglingVisibilidad(false);
    }

    // --- LOGIC: Files ---
    async function processFile(file: File) {
        if (file.size > 4.5 * 1024 * 1024) {
            showToast('ARCHIVO DEMASIADO GRANDE (>4.5MB)', 'error');
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('proyectoId', params.id as string);
        formData.append('subidoPor', 'admin');

        const result: any = await uploadArchivo(formData);
        if (result.error) {
            showToast(result.error, 'error');
        } else {
            showToast('ARCHIVO SUBIDO', 'success');
            await loadProject();
        }
        setUploading(false);
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.[0]) return;
        await processFile(e.target.files[0]);
    }

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        dragCounter.current++;
        if (dragCounter.current === 1) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;
        const file = e.dataTransfer.files?.[0];
        if (file) await processFile(file);
    };

    async function handleDeleteArchivo() {
        if (!archivoToDelete) return;
        setIsDeletingArchivo(true);
        const result = await deleteArchivo(archivoToDelete.id);
        if (result.success) {
            showToast('ARCHIVO ELIMINADO', 'info');
            await loadProject();
        } else {
            showToast('ERROR AL ELIMINAR', 'error');
        }
        setIsDeletingArchivo(false);
        setArchivoToDelete(null);
    }

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            showToast('DESCARGA INICIADA', 'success');
        } catch (error) {
            showToast('ERROR DE DESCARGA', 'error');
        }
    };

    // --- LOGIC: Planes ---
    async function handleUpdatePlan() {
        if (!pendingPlan || verifyInput.trim() !== project.nombre.trim()) return;
        setShowVerifyName(false);
        setVerifyInput('');
        setSaving(true);
        const result = await updateProyectoPlan(params.id as string, pendingPlan);
        if (result.success) {
            showToast(`PLAN ACTUALIZADO A ${pendingPlan.toUpperCase()}`, 'success');
            await loadProject();
        } else {
            showToast('ERROR AL ACTUALIZAR PLAN', 'error');
        }
        setSaving(false);
        setPendingPlan(null);
    }

    const handleConfirmPlanChange = async () => {
        setShowConfirmPlan(false);
        setShowVerifyName(true);
    };

    // --- HELPER: Navegación ---
    const handleNavigation = (path: string) => {
        if (hasPendingChanges) {
            setPendingNavigation(path);
            setShowUnsavedModal(true);
        } else {
            router.push(path);
        }
    };

    const handleDiscardChanges = () => {
        setHasPendingChanges(false);
        setShowUnsavedModal(false);
        if (pendingNavigation) {
            router.push(pendingNavigation);
            setPendingNavigation(null);
        }
    };

    const formatSize = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };


    if (loading) return <AdminLoading />;
    if (!project) return <div className="min-h-screen flex items-center justify-center text-white font-black uppercase tracking-widest">Proyecto no encontrado</div>;

    const projectPlan = NEXUS_PLANS_ARRAY.find(p => p.title === project.plan) || NEXUS_PLANS_ARRAY[0];

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col font-sans selection:bg-[#FFD700] selection:text-black">

            {/* TOP BAR / HEADER */}
            <header className="h-20 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => handleNavigation('/admin/proyectos')}
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black tracking-tight uppercase leading-none flex items-center gap-2">
                            {project.nombre}
                            <span className={`px-2 py-0.5 rounded text-[10px] bg-gradient-to-r ${projectPlan.color} text-white font-black uppercase tracking-widest`}>
                                {project.plan}
                            </span>
                        </h1>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <User className="w-3 h-3" /> {project.cliente?.nombre}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <AnimatePresence>
                        {hasPendingChanges && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={handleSyncChanges}
                                disabled={saving}
                                className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg hover:shadow-cyan-500/20 transition-all ${saving ? 'bg-gray-800' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Sync Cambios
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div className="h-8 w-[1px] bg-white/10 mx-2" />

                    <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${projectPlan.color} animate-pulse`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                            {estado}
                        </span>
                    </div>
                </div>
            </header>

            {/* MAIN WORKSPACE LAYOUT */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* BACKGROUND FX */}
                <div className={`absolute top-[-50%] left-[-20%] w-[50%] h-[100%] rounded-full bg-gradient-to-br ${projectPlan.color} opacity-[0.03] blur-[150px] pointer-events-none`} />

                {/* SIDEBAR NAVIGATION */}
                <aside className="w-20 lg:w-64 border-r border-white/5 bg-[#0a0a0a]/50 flex flex-col shrink-0">
                    <nav className="flex-1 p-4 space-y-2">
                        <NavTab
                            active={activeTab === 'overview'}
                            onClick={() => setActiveTab('overview')}
                            icon={Grid}
                            label="Visión General"
                            color="text-blue-400"
                        />
                        <NavTab
                            active={activeTab === 'finance'}
                            onClick={() => setActiveTab('finance')}
                            icon={TrendingUp}
                            label="Liquidación"
                            color="text-emerald-400"
                        />
                        <NavTab
                            active={activeTab === 'communication'}
                            onClick={() => setActiveTab('communication')}
                            icon={MessageCircle}
                            label="Comms Link"
                            notificationCount={project.notas?.filter((n: any) => n.autor !== 'admin').length}
                            color="text-amber-400"
                        />
                        <NavTab
                            active={activeTab === 'vault'}
                            onClick={() => setActiveTab('vault')}
                            icon={FolderOpen}
                            label="Bóveda Archivos"
                            notificationCount={project.archivos?.length}
                            color="text-emerald-400"
                        />
                        <NavTab
                            active={activeTab === 'briefing'}
                            onClick={() => setActiveTab('briefing')}
                            icon={Briefcase}
                            label="Briefing Data"
                            color="text-purple-400"
                        />
                        <NavTab
                            active={activeTab === 'settings'}
                            onClick={() => setActiveTab('settings')}
                            icon={Cpu}
                            label="Configuración"
                            color="text-gray-400"
                        />
                    </nav>

                    <div className="p-4 border-t border-white/5">
                        <div className="bg-white/5 rounded-xl p-4">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-3">Visibilidad Cliente</span>
                            <button
                                onClick={handleToggleVisibilidad}
                                disabled={togglingVisibilidad}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${visibilidad
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                    : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'}`}
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {visibilidad ? 'ONLINE' : 'OFFLINE'}
                                </span>
                                {togglingVisibilidad ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <div className={`w-2 h-2 rounded-full ${visibilidad ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                                )}
                            </button>
                        </div>
                    </div>
                </aside>

                {/* CONTENT AREA */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 lg:p-12 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="max-w-6xl mx-auto">
                        <AnimatePresence mode="wait">
                            {/* --- TAB: OVERVIEW --- */}
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    {/* SECCIÓN PROGRESS ENGINE */}
                                    <section className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-[3rem] p-10 relative overflow-hidden">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                                            {/* Circular Progress & Value */}
                                            <div className="flex items-center gap-8">
                                                <div className="relative w-40 h-40 flex items-center justify-center">
                                                    <svg className="w-full h-full -rotate-90">
                                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                                        <motion.circle
                                                            cx="80" cy="80" r="70"
                                                            stroke="url(#gradient-progress)"
                                                            strokeWidth="8"
                                                            fill="transparent"
                                                            strokeLinecap="round"
                                                            strokeDasharray={440}
                                                            animate={{ strokeDashoffset: 440 - (440 * progreso) / 100 }}
                                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                                        />
                                                        <defs>
                                                            <linearGradient id="gradient-progress" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                <stop offset="0%" stopColor="#22d3ee" />
                                                                <stop offset="100%" stopColor="#3b82f6" />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-4xl font-black text-white">{progreso}%</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <h2 className="text-2xl font-black uppercase tracking-tighter">Motor de Avance</h2>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest max-w-[200px]">Controla el progreso y las fases del ciclo de vida.</p>
                                                </div>
                                            </div>

                                            {/* Controls */}
                                            <div className="flex-1 w-full max-w-xl space-y-8">
                                                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                                    <input
                                                        type="range"
                                                        min="0" max="100" step="5"
                                                        value={progreso}
                                                        onChange={(e) => updateProgresoAndEstado(parseInt(e.target.value))}
                                                        className="w-full h-2 bg-black/50 rounded-full appearance-none cursor-pointer accent-cyan-400"
                                                    />
                                                    <div className="flex justify-between mt-3 px-1">
                                                        <span className="text-[10px] font-black text-gray-600">0%</span>
                                                        <span className="text-[10px] font-black text-gray-600">50%</span>
                                                        <span className="text-[10px] font-black text-gray-600">100%</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-4 gap-3">
                                                    {['Pendiente', 'Diseño', 'Desarrollo', 'Finalizado'].map((label) => {
                                                        let value = label.toLowerCase();
                                                        if (label === 'Finalizado') value = 'completado';
                                                        const isActive = estado === value;
                                                        return (
                                                            <button
                                                                key={label}
                                                                onClick={() => updateEstadoAndProgreso(value)}
                                                                className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${isActive
                                                                    ? `bg-white/10 text-cyan-400 border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]`
                                                                    : 'bg-transparent border-white/5 text-gray-600 hover:border-white/20 hover:text-gray-400'}`}
                                                            >
                                                                {label}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </section>



                                    {/* TIME LEFT SYNC (CLIENT VIEW) */}
                                    <section>
                                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:border-white/10 transition-colors">
                                            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] pointer-events-none opacity-50" />
                                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Sincronización de Tiempo Restante</h3>
                                            </div>
                                            <div className="relative z-10 scale-75 md:scale-90 origin-center">
                                                <CountdownTimer
                                                    targetDate={
                                                        project.onboardingData?.onboardingCompletedAt
                                                            ? new Date(new Date(project.onboardingData.onboardingCompletedAt).getTime() + 48 * 60 * 60 * 1000)
                                                            : null
                                                    }
                                                    isCompleted={project.estado === 'completado'}
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* QUICK STATS & ACTIONS */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between h-64 group hover:border-white/10 transition-all">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center text-purple-400 mb-4">
                                                <MessageSquare className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="text-3xl font-black text-white block mb-1">{project.notas?.length || 0}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Mensajes Totales</span>
                                            </div>
                                            <button onClick={() => setActiveTab('communication')} className="mt-4 text-xs font-bold text-white flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                Abrir Canal <ChevronRightIcon className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <div className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between h-64 group hover:border-white/10 transition-all">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center text-emerald-400 mb-4">
                                                <FolderOpen className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="text-3xl font-black text-white block mb-1">{project.archivos?.length || 0}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Archivos en Bóveda</span>
                                            </div>
                                            <button onClick={() => setActiveTab('vault')} className="mt-4 text-xs font-bold text-white flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                Gestionar Archivos <ChevronRightIcon className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <div className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between h-64 group hover:border-white/10 transition-all relative overflow-hidden">
                                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${projectPlan.color} opacity-10 blur-[40px]`} />
                                            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-4`}>
                                                <Rocket className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className={`text-xl font-black bg-gradient-to-r ${projectPlan.color} bg-clip-text text-transparent block mb-1 uppercase`}>{project.plan}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Nivel de Servicio</span>
                                            </div>
                                            <button onClick={() => setActiveTab('settings')} className="mt-4 text-xs font-bold text-white flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                Configurar Plan <ChevronRightIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- TAB: COMMUNICATION --- */}
                            {activeTab === 'communication' && (
                                <motion.div
                                    key="communication"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="h-[calc(100vh-180px)]"
                                >
                                    <div className="h-full bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col relative">
                                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                                    <MessageSquare className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-black uppercase tracking-tight text-white">Canal Seguro</h2>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Feedback directo con {project.cliente?.nombre}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                            {project.notas && project.notas.length > 0 ? (
                                                project.notas.map((nota: any) => (
                                                    <div key={nota.id} className={`flex ${nota.autor === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[70%] p-6 rounded-3xl ${nota.autor === 'admin'
                                                            ? 'bg-white/5 border border-white/10 text-white rounded-tr-none'
                                                            : 'bg-blue-500/10 border border-blue-500/20 text-blue-100 rounded-tl-none'}`}>

                                                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5 justify-between">
                                                                <span className={`text-[10px] font-black uppercase tracking-widest ${nota.autor === 'admin' ? 'text-amber-400' : 'text-blue-400'}`}>
                                                                    {nota.autor === 'admin' ? 'NEXUS ADMIN' : 'CLIENTE'}
                                                                </span>
                                                                <span className="text-[9px] font-mono text-white/30">
                                                                    {new Date(nota.createdAt).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium opacity-90">{nota.contenido}</p>
                                                            {nota.imagenes && nota.imagenes.length > 0 && (
                                                                <div className="grid grid-cols-2 gap-2 mt-4">
                                                                    {nota.imagenes.map((img: string, i: number) => (
                                                                        <a key={i} href={img} target="_blank" className="block w-full aspect-video rounded-lg overflow-hidden border border-white/10 hover:opacity-80 transition-opacity">
                                                                            <img src={img} className="w-full h-full object-cover" />
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-white/20">
                                                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-4">
                                                        <MessageSquare className="w-8 h-8" />
                                                    </div>
                                                    <p className="text-xs font-black uppercase tracking-[0.3em]">Sin transmisiones previas</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 bg-[#050505] border-t border-white/5">
                                            <div className="relative flex items-end gap-4">
                                                <textarea
                                                    value={replyNote}
                                                    onChange={(e) => setReplyNote(e.target.value)}
                                                    placeholder="Escribir mensaje al cliente..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none h-14 min-h-[56px] py-4"
                                                />
                                                <button
                                                    onClick={handleSendReply}
                                                    disabled={sendingReply || !replyNote.trim()}
                                                    className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-black flex items-center justify-center shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {sendingReply ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- TAB: VAULT (FILES) --- */}
                            {activeTab === 'vault' && (
                                <motion.div
                                    key="vault"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    {isDragging && (
                                        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                                            <div className="flex flex-col items-center gap-6 animate-pulse">
                                                <Upload className="w-24 h-24 text-emerald-400" />
                                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Soltar para Importar</h2>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Bóveda de Archivos</h2>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Activos digitales y entregables</p>
                                        </div>
                                        <label className={`cursor-pointer px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all ${uploading ? 'bg-gray-800 pointer-events-none' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg hover:shadow-emerald-500/20'}`}>
                                            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                            {uploading ? 'Cargando...' : 'Subir Archivo'}
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        <AnimatePresence>
                                            {project.archivos?.map((archivo: any) => (
                                                <motion.div
                                                    key={archivo.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="group relative bg-white/[0.03] border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all hover:bg-white/[0.05]"
                                                >
                                                    <div className="aspect-square rounded-2xl bg-black/40 flex items-center justify-center mb-4 overflow-hidden relative">
                                                        {/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(archivo.nombre) ? (
                                                            <img src={archivo.url} alt={archivo.nombre} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                        ) : (
                                                            <FileText className="w-12 h-12 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                                                        )}

                                                        {/* Actions Overlay */}
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <button onClick={() => handleDownload(archivo.url, archivo.nombre)} className="p-3 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-white text-white transition-all">
                                                                <Download className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => setArchivoToDelete(archivo)} className="p-3 rounded-xl bg-white/10 hover:bg-red-500 hover:text-white text-white transition-all">
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-xs font-bold text-gray-300 truncate mb-1">{archivo.nombre}</h3>
                                                    <span className="text-[10px] font-mono text-gray-600 uppercase">{formatSize(archivo.tamano)}</span>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        {(!project.archivos || project.archivos.length === 0) && (
                                            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                    <FolderOpen className="w-10 h-10 text-gray-600" />
                                                </div>
                                                <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Bóveda vacía</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* --- TAB: BRIEFING --- */}
                            {activeTab === 'briefing' && (
                                <motion.div
                                    key="briefing"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Datos de Onboarding</h2>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Información suministrada por el cliente al inicio</p>
                                    </div>

                                    {project.onboardingData && Object.keys(project.onboardingData as object).length > 0 ? (
                                        <div className="space-y-6">
                                            {/* SECCIÓN 1: IDENTIDAD Y CONTACTO */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Tarjeta de Identidad */}
                                                <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 hover:border-purple-500/30 transition-colors">
                                                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                                                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                                            <Sparkles className="w-6 h-6" />
                                                        </div>
                                                        <h3 className="text-lg font-black uppercase tracking-tight text-white">Identidad de Marca</h3>
                                                    </div>

                                                    <div className="flex flex-col md:flex-row gap-8">
                                                        <div className="flex-1 space-y-6">
                                                            <div>
                                                                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Nombre Comercial</span>
                                                                <p className="text-2xl font-black text-white">{(project.onboardingData as any).nombreComercial || <span className="text-gray-600 italic">Sin definir</span>}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Slogan</span>
                                                                <p className="text-gray-300 italic">{(project.onboardingData as any).slogan ? `"${(project.onboardingData as any).slogan}"` : <span className="text-gray-600 italic">Sin definir</span>}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Descripción del Negocio</span>
                                                                <p className="text-sm text-gray-400 leading-relaxed">{(project.onboardingData as any).descripcion || <span className="text-gray-600 italic">Sin definir</span>}</p>
                                                            </div>

                                                            <div className="pt-4 border-t border-white/5">
                                                                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-3 font-black tracking-widest">Paleta Visual</span>
                                                                <div className="flex gap-4">
                                                                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 flex-1">
                                                                        <div
                                                                            className={`w-8 h-8 rounded-xl border border-white/20 shadow-lg ${(project.onboardingData as any).primaryColor ? '' : 'bg-white/5 border-dashed'}`}
                                                                            style={{ backgroundColor: (project.onboardingData as any).primaryColor || 'transparent' }}
                                                                        />
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[8px] font-black uppercase tracking-widest text-[#FFD700]">Acento</span>
                                                                            <span className="text-[9px] font-mono text-gray-500">{(project.onboardingData as any).primaryColor || 'Sin elegir'}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 flex-1">
                                                                        <div
                                                                            className={`w-8 h-8 rounded-xl border border-white/20 shadow-lg ${(project.onboardingData as any).secondaryColor ? '' : 'bg-white/5 border-dashed'}`}
                                                                            style={{ backgroundColor: (project.onboardingData as any).secondaryColor || 'transparent' }}
                                                                        />
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Fondo</span>
                                                                            <span className="text-[9px] font-mono text-gray-500">{(project.onboardingData as any).secondaryColor || 'Sin elegir'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Logo Preview */}
                                                        <div className="w-full md:w-40 shrink-0">
                                                            <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Logo Principal</span>
                                                            <div className="bg-black/40 rounded-2xl border border-white/10 p-4 aspect-square flex items-center justify-center">
                                                                {(project.onboardingData as any).logo ? (
                                                                    <img src={(project.onboardingData as any).logo} className="max-w-full max-h-full object-contain" alt="Logo" />
                                                                ) : (
                                                                    <div className="text-[10px] text-gray-700 font-bold uppercase">Sin Logo</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Tarjeta de Contacto y Dominios */}
                                                <div className="space-y-6">
                                                    {/* Contacto */}
                                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 hover:border-blue-500/30 transition-colors">
                                                        <div className="flex items-center gap-4 mb-6">
                                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                                <div className="w-5 h-5"><Users className="w-full h-full" /></div>
                                                            </div>
                                                            <h3 className="text-sm font-black uppercase tracking-tight text-white">Datos de Contacto</h3>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="bg-white/5 rounded-xl p-4">
                                                                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1">Teléfono / WhatsApp</span>
                                                                <p className="text-white font-bold text-sm">{(project.onboardingData as any).contactoTel || <span className="text-gray-600">Sin definir</span>}</p>
                                                            </div>
                                                            <div className="bg-white/5 rounded-xl p-4">
                                                                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1">Email</span>
                                                                <p className="text-white font-bold text-sm truncate" title={(project.onboardingData as any).contactoEmail}>{(project.onboardingData as any).contactoEmail || <span className="text-gray-600">Sin definir</span>}</p>
                                                            </div>
                                                            {(project.onboardingData as any).direccion && (
                                                                <div className="bg-white/5 rounded-xl p-4 md:col-span-2">
                                                                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1">Dirección Física</span>
                                                                    <p className="text-white font-bold text-sm">{(project.onboardingData as any).direccion}</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Redes Sociales */}
                                                        <div className="mt-6 pt-6 border-t border-white/5">
                                                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-3">Redes Sociales</span>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {[
                                                                    { id: 'facebook', label: 'Facebook', color: 'text-blue-500' },
                                                                    { id: 'instagram', label: 'Instagram', color: 'text-pink-500' },
                                                                    { id: 'tiktok', label: 'TikTok', color: 'text-gray-200' },
                                                                    { id: 'x', label: 'X (Twitter)', color: 'text-white' }
                                                                ].map(social => {
                                                                    const val = (project.onboardingData as any)[social.id];
                                                                    return (
                                                                        <div key={social.id} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                                                                            <span className={`text-[8px] font-black uppercase tracking-widest ${social.color}`}>{social.label}</span>
                                                                            <span className="text-[10px] font-bold text-gray-300 truncate">
                                                                                {val || <span className="text-gray-600 italic font-normal">Sin definir</span>}
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Dominios */}
                                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 hover:border-emerald-500/30 transition-colors">
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                                                <Globe className="w-5 h-5" />
                                                            </div>
                                                            <h3 className="text-sm font-black uppercase tracking-tight text-white">Dominios Solicitados</h3>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                                                                <span className="text-emerald-400 font-bold">{(project.onboardingData as any).dominioUno ? `www.${(project.onboardingData as any).dominioUno}.com` : <span className="text-gray-600">No definido</span>}</span>
                                                                <span className="text-[9px] bg-emerald-500 text-black font-black px-2 py-0.5 rounded">PRINCIPAL</span>
                                                            </div>
                                                            {(project.onboardingData as any).dominioDos && (
                                                                <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-4 py-3 opacity-60">
                                                                    <span className="text-gray-400 font-bold">www.{(project.onboardingData as any).dominioDos}.com</span>
                                                                    <span className="text-[9px] bg-white/10 text-gray-400 font-black px-2 py-0.5 rounded">ALT</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Galerías */}
                                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 hover:border-amber-500/30 transition-colors">
                                                        <div className="flex items-center gap-4 mb-6">
                                                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                                                                <ImageIcon className="w-5 h-5" />
                                                            </div>
                                                            <h3 className="text-sm font-black uppercase tracking-tight text-white">Galería del Proyecto</h3>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            {((project.onboardingData as any).gallery || []).length > 0 ? (
                                                                (project.onboardingData as any).gallery.map((img: string, i: number) => (
                                                                    <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                                                                        <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={`Gallery ${i}`} />
                                                                        <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase">Foto {i + 1}</div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="col-span-2 py-8 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-gray-600">
                                                                    <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest">Sin imágenes</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* SECCIÓN 2: SERVICIOS */}
                                            <div className="pt-6 border-t border-white/5">
                                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                                                    <Box className="w-4 h-4" /> Servicios / Productos Solicitados ({((project.onboardingData as any)?.services || []).length})
                                                </h3>

                                                {((project.onboardingData as any)?.services || []).length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {(project.onboardingData as any).services.map((service: any, index: number) => (
                                                            <div key={`service-${index}`} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-colors flex flex-col gap-3 relative overflow-hidden group">
                                                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                                                    <span className="text-[40px] font-black text-emerald-500/20">{index + 1}</span>
                                                                </div>
                                                                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 border-b border-white/5 pb-2">
                                                                    Servicio / Producto #{index + 1}
                                                                </h3>
                                                                <div className="text-sm font-medium text-gray-300 leading-relaxed z-10">
                                                                    <div className="mb-2">
                                                                        <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Título del Item</span>
                                                                        <p className="text-white font-bold text-lg">{service.title || <span className="text-gray-600 italic">Sin nombre</span>}</p>
                                                                    </div>
                                                                    <div className="mb-4">
                                                                        <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Descripción</span>
                                                                        <p className="text-gray-400 text-xs">{service.description || <span className="text-gray-600 italic">Sin descripción</span>}</p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Referencia Visual</span>
                                                                        {service.image ? (
                                                                            <BriefingValueRenderer value={service.image} />
                                                                        ) : (
                                                                            <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-[8px] text-gray-600 font-black uppercase gap-2 bg-white/[0.01]">
                                                                                <ImageIcon className="w-5 h-5 opacity-20" />
                                                                                Sin imagen
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-12 border-2 border-dashed border-white/5 rounded-[3rem] text-center">
                                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <Box className="w-8 h-8 text-gray-600" />
                                                        </div>
                                                        <p className="text-gray-500 text-xs font-black uppercase tracking-widest">El cliente no ha detallado servicios o productos aún</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-12 border border-white/5 rounded-3xl text-center text-gray-500">
                                            <p className="text-xs font-black uppercase tracking-widest">Sin datos de onboarding disponibles</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* --- TAB: SETTINGS --- */}
                            {activeTab === 'settings' && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="max-w-3xl mx-auto space-y-8"
                                >
                                    <div className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 space-y-8">
                                        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white">
                                                <Settings2 className="w-6 h-6" />
                                            </div>
                                            <h2 className="text-2xl font-black uppercase tracking-tighter">Configuración General</h2>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Date Editor */}
                                            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                                <div>
                                                    <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">Fecha de Inicio</h3>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase">{new Date(project.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <button onClick={() => { setIsEditingDate(true); setTempDate(new Date(project.createdAt).toISOString().split('T')[0]); }} className="p-2 text-gray-500 hover:text-white transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Link Editor */}
                                            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                                <div>
                                                    <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">URL Pública</h3>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase max-w-[200px] truncate">
                                                        {project.link || (project.onboardingData?.dominioUno ? `www.${project.onboardingData.dominioUno}.com` : 'No definido')}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setIsEditingLink(true);
                                                        setTempLink(project.link || (project.onboardingData?.dominioUno ? `www.${project.onboardingData.dominioUno}.com` : ''));
                                                    }}
                                                    className="p-2 text-gray-500 hover:text-white transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Plan Editor */}
                                            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                                <div>
                                                    <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">Plan Contratado</h3>
                                                    <p className={`text-[10px] font-black uppercase bg-gradient-to-r ${projectPlan.color} bg-clip-text text-transparent`}>{project.plan}</p>
                                                </div>
                                                <button onClick={() => setIsEditingPlan(true)} className="p-2 text-gray-500 hover:text-white transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Visibility Toggle Detailed */}
                                            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-xs font-black uppercase tracking-widest text-white">Estado del Canal</h3>
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wide ${visibilidad ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                            {visibilidad ? 'Online' : 'Offline'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide max-w-[280px]">
                                                        {visibilidad
                                                            ? 'El cliente puede acceder a su panel de seguimiento.'
                                                            : 'El acceso del cliente está restringido temporalmente.'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleToggleVisibilidad}
                                                    disabled={togglingVisibilidad}
                                                    className={`relative w-14 h-8 rounded-full border transition-all ${visibilidad
                                                        ? 'bg-emerald-500/10 border-emerald-500/20'
                                                        : 'bg-white/5 border-white/10'}`}
                                                >
                                                    <motion.div
                                                        animate={{ x: visibilidad ? 26 : 4 }}
                                                        className={`w-5 h-5 rounded-full shadow-lg mt-1 ${visibilidad ? 'bg-emerald-400' : 'bg-gray-500'}`}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DANGER ZONE */}
                                    <div className="p-8 rounded-[2.5rem] bg-red-500/[0.02] border border-red-500/10">
                                        <h3 className="text-red-500 font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4" /> Zona de Peligro
                                        </h3>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-white font-bold text-sm">Eliminar Proyecto</h4>
                                                <p className="text-gray-500 text-[10px] mt-1">Esta acción borrará todos los datos y archivos permanentemente.</p>
                                            </div>
                                            <button
                                                onClick={() => { setDeleteConfirmInput(''); setShowConfirmDeleteProject(true); }}
                                                className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-red-500/20"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- TAB: FINANCE --- */}
                            {activeTab === 'finance' && (
                                <motion.div
                                    key="finance"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-10"
                                >
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                        <div>
                                            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                    <TrendingUp className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Control de Pagos InZidium</span>
                                            </div>
                                            <h2 className="text-4xl font-black tracking-tighter uppercase">Liquidación de Proyecto</h2>
                                        </div>
                                        <div className="bg-emerald-500/5 px-8 py-4 rounded-[2rem] border border-emerald-500/20 text-right">
                                            <span className="text-[9px] font-black uppercase text-emerald-500/50 tracking-[0.2em] block mb-1">Total Acordado para InZidium</span>
                                            <span className="text-3xl font-black text-emerald-400">$399.000 <span className="text-xs text-emerald-700">COP</span></span>
                                        </div>
                                    </div>

                                    <div className="max-w-4xl mx-auto w-full">
                                        {/* GIROS RECIBIDOS */}
                                        <div className="bg-white/[0.02] border border-white/10 rounded-[3.5rem] p-12 space-y-10 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-12 opacity-5 text-emerald-500">
                                                <Banknote className="w-48 h-48" />
                                            </div>

                                            <div className="flex items-center justify-between border-b border-white/5 pb-8 relative z-10">
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Comprobante de Transferencia</h3>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Carga aquí la captura del giro realizado por Nexus</p>
                                                </div>
                                            </div>

                                            {/* Grid de Evidencias */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                                {/* Botón para Subir Nueva Captura */}
                                                <div className="aspect-[4/3] rounded-[2.5rem] border-2 border-dashed border-white/5 bg-black/40 flex flex-col items-center justify-center gap-4 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all cursor-pointer group/upload">
                                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600 group-hover/upload:text-emerald-400 group-hover/upload:scale-110 transition-all">
                                                        <Camera className="w-8 h-8" />
                                                    </div>
                                                    <div className="text-center">
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Subir Comprobante</span>
                                                        <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">JPG, PNG o PDF</span>
                                                    </div>
                                                </div>

                                                {/* Info de Referencia */}
                                                <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center space-y-6">
                                                    <div className="space-y-1">
                                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block font-bold">Concepto de Pago</span>
                                                        <p className="text-sm font-bold text-gray-300">Infraestructura & Desarrollo - {project.plan}</p>
                                                    </div>
                                                    <div className="space-y-1 border-t border-white/5 pt-4">
                                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block font-bold">Referencia de Proyecto</span>
                                                        <p className="text-sm font-bold text-emerald-500 font-[family-name:var(--font-orbitron)]">#NEX-{params.id?.toString().slice(-6).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nota de Alianza */}
                                    <div className="max-w-4xl mx-auto bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                            <Receipt className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1 italic">Política de Liquidación</p>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                Cada proyecto creado en el panel Nexus implica que el recaudo comercial ya fue efectuado. Nexus se compromete a anexar el comprobante de transferencia bancaria hacia InZidium para formalizar el inicio técnico del proyecto.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </main>
            </div >


            {/* --- MODALES --- */}

            {/* Modal PLAN EDIT - Reutilizado */}
            <AnimatePresence>
                {isEditingPlan && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-5xl rounded-[3rem] p-12 overflow-hidden relative">
                            <div className="flex justify-between mb-8">
                                <h3 className="text-2xl font-black text-white uppercase">Mejorar Plan</h3>
                                <button onClick={() => setIsEditingPlan(false)}><X className="text-gray-500 hover:text-white" /></button>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                {NEXUS_PLANS_ARRAY.map((planOption) => {
                                    const isCurrent = project.plan === planOption.title;
                                    const Icon = planOption.icon;
                                    return (
                                        <button
                                            key={planOption.id}
                                            onClick={() => {
                                                if (!isCurrent) {
                                                    setPendingPlan(planOption.title);
                                                    setIsEditingPlan(false);
                                                    setShowConfirmPlan(true);
                                                }
                                            }}
                                            className={`p-6 rounded-3xl border text-center flex flex-col items-center gap-4 transition-all ${isCurrent ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                                        >
                                            <Icon className={`w-8 h-8 ${isCurrent ? 'text-white' : 'text-gray-600'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-white' : 'text-gray-500'}`}>{planOption.title}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal CONFIRM PLAN */}
            <AnimatePresence>
                {showConfirmPlan && (
                    <ModalConfirm
                        title="Confirmar Cambio"
                        message={<>Vas a cambiar a <span className="text-white font-black">{pendingPlan}</span>. ¿Estás seguro?</>}
                        onCancel={() => setShowConfirmPlan(false)}
                        onConfirm={handleConfirmPlanChange}
                        confirmText="Sí, Cambiar"
                    />
                )}
            </AnimatePresence>

            {/* Modal VERIFY NAME */}
            <AnimatePresence>
                {showVerifyName && (
                    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <div className="bg-[#0a0a0a] border border-amber-500/30 w-full max-w-md rounded-[2.5rem] p-10 relative z-10">
                            <h3 className="text-xl font-black text-center text-white mb-4">Verificación de Seguridad</h3>
                            <p className="text-center text-gray-500 text-xs mb-6">Escribe <span className="text-white font-bold">{project.nombre}</span> para confirmar.</p>
                            <input
                                value={verifyInput} onChange={e => setVerifyInput(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-center text-white mb-6 focus:border-amber-500 outline-none"
                                placeholder="Nombre del proyecto"
                            />
                            <div className="flex gap-4">
                                <button onClick={() => setShowVerifyName(false)} className="flex-1 py-4 rounded-xl border border-white/10 text-gray-500 font-bold text-xs uppercase hover:bg-white/5">Cancelar</button>
                                <button onClick={handleUpdatePlan} disabled={verifyInput.trim() !== project.nombre} className="flex-1 py-4 rounded-xl bg-amber-500 text-black font-black text-xs uppercase hover:bg-amber-600 disabled:opacity-50">Confirmar</button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal DATE / LINK - Simplified for brevity in this rewrite, logic preserved */}
            {
                isEditingDate && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl w-full max-w-sm">
                            <h3 className="text-white font-black uppercase mb-4 text-center">Editar Fecha</h3>
                            <input type="date" value={tempDate} onChange={e => setTempDate(e.target.value)} className="w-full bg-white/5 border-white/10 rounded-xl p-4 text-white mb-6 block text-center color-white-scheme" />
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setIsEditingDate(false)} className="py-3 text-xs font-bold text-gray-500 border border-white/10 rounded-xl">Cancelar</button>
                                <button onClick={handleUpdateFecha} className="py-3 text-xs font-black text-black bg-white rounded-xl">Guardar</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                isEditingLink && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl w-full max-w-md">
                            <h3 className="text-white font-black uppercase mb-4 text-center">Editar Enlace</h3>
                            <input value={tempLink} onChange={e => setTempLink(e.target.value)} className="w-full bg-white/5 border-white/10 rounded-xl p-4 text-white mb-6 outline-none focus:border-blue-500" placeholder="https://..." />
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setIsEditingLink(false)} className="py-3 text-xs font-bold text-gray-500 border border-white/10 rounded-xl">Cancelar</button>
                                <button onClick={handleConfirmLinkChange} className="py-3 text-xs font-black text-black bg-white rounded-xl">Guardar</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Modal DELETE CONFIRM */}
            {
                archivoToDelete && (
                    <ModalConfirm
                        title="Borrar Archivo"
                        message="¿Estás seguro de eliminar este archivo permanentemente?"
                        onCancel={() => setArchivoToDelete(null)}
                        onConfirm={handleDeleteArchivo}
                        confirmText="Eliminar"
                        isDestructive
                    />
                )
            }

            {
                showConfirmDeleteProject && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
                        <div className="w-full max-w-md bg-black border border-red-900/30 p-10 rounded-[3rem] text-center">
                            <Trash2 className="w-12 h-12 text-red-600 mx-auto mb-6" />
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Eliminar Proyecto</h2>
                            <p className="text-gray-500 text-xs font-bold mb-8">Escribe "eliminar {project.nombre}" para confirmar.</p>
                            <input
                                value={deleteConfirmInput}
                                onChange={e => setDeleteConfirmInput(e.target.value)}
                                className="w-full bg-red-900/10 border border-red-900/30 rounded-xl p-4 text-center text-red-100 mb-6 outline-none focus:border-red-500"
                                placeholder={`eliminar ${project.nombre}`}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setShowConfirmDeleteProject(false)} className="py-4 text-xs font-bold text-gray-400 border border-white/10 rounded-xl hover:bg-white/5">CANCELAR</button>
                                <button
                                    onClick={handleDeleteProject}
                                    disabled={deleteConfirmInput !== `eliminar ${project.nombre}`}
                                    className="py-4 text-xs font-black text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ELIMINAR
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Modal UNSAVED */}
            {
                showUnsavedModal && (
                    <ModalConfirm
                        title="Cambios sin Guardar"
                        message="Tienes cambios pendientes. ¿Deseas guardarlos antes de salir?"
                        onCancel={handleDiscardChanges}
                        onConfirm={async () => {
                            setShowUnsavedModal(false);
                            await handleSyncChanges();
                        }}
                        confirmText="Guardar y Salir"
                        cancelText="Descartar"
                    />
                )
            }

        </div >
    );
}

// --- SUBCOMPONENTS ---

function NavTab({ active, onClick, icon: Icon, label, notificationCount, color }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all group relative overflow-hidden ${active ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
        >
            {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-current ${color}`} />}
            <Icon className={`w-5 h-5 ${active ? color : 'group-hover:text-white transition-colors'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            {notificationCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{notificationCount}</span>
            )}
        </button>
    );
}

function ModalConfirm({ title, message, onCancel, onConfirm, confirmText = "Confirmar", cancelText = "Cancelar", isDestructive = false }: any) {
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl"
            >
                <h3 className="text-xl font-black uppercase text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wide leading-relaxed mb-8">{message}</p>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={onCancel} className="py-4 rounded-xl border border-white/10 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all">
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-white transition-all ${isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-white text-black hover:bg-gray-200'}`}>
                        {confirmText}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function BriefingValueRenderer({ value }: { value: any }) {
    if (!value) return <span className="text-gray-600 italic">Sin datos</span>;

    // Caso: Array (Lista)
    if (Array.isArray(value)) {
        return (
            <ul className="space-y-2 mt-2">
                {value.map((item, i) => (
                    <li key={i} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Item {i + 1}</span>
                        </div>
                        <div className="text-gray-300 pl-4">
                            {typeof item === 'object' ? (
                                <BriefingValueRenderer value={item} />
                            ) : item}
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    // Caso: Objeto
    if (typeof value === 'object') {
        return (
            <div className="space-y-3 mt-2 pl-3 border-l-2 border-white/5">
                {Object.entries(value).map(([subKey, subVal]) => (
                    <div key={subKey}>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{subKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <div className="text-gray-300"><BriefingValueRenderer value={subVal} /></div>
                    </div>
                ))}
            </div>
        );
    }

    const strValue = String(value);

    // Caso: URL de Imagen
    if (strValue.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) && (strValue.startsWith('http') || strValue.startsWith('/'))) {
        return (
            <a href={strValue} target="_blank" rel="noopener noreferrer" className="block mt-2 group relative w-32 h-32 rounded-2xl overflow-hidden border border-white/10">
                <img src={strValue} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white" />
                </div>
            </a>
        );
    }

    // Caso: URL Genérica
    if (strValue.startsWith('http')) {
        return (
            <a href={strValue} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-400/30 transition-colors break-all">
                {strValue} <ExternalLink className="w-3 h-3" />
            </a>
        );
    }

    // Default
    return <span>{strValue}</span>;
}
