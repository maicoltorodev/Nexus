'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProyectos, updateProyectoProgreso, uploadArchivo, updateProyectoVisibilidad, deleteArchivo, updateProyectoPlan, updateProyectoFecha, updateProyectoLink, deleteProyecto } from '@/lib/actions';
import { useToast } from '@/app/providers/ToastProvider';
import {
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
    Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLoading from '../../loading';
import Link from 'next/link';
import { NEXUS_PLANS, NEXUS_PLANS_ARRAY } from '@/lib/constants';

export default function ProyectoDetalle() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [estado, setEstado] = useState('');
    const [visibilidad, setVisibilidad] = useState(true);
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

    const handleConfirmLinkChange = async () => {
        if (!project) return;
        setSaving(true);
        try {
            const result = await updateProyectoLink(project.id, tempLink);
            if (result.success) {
                showToast('ENLACE DEL PROYECTO ACTUALIZADO', 'success');
                setIsEditingLink(false);
                loadProject();
            } else {
                showToast('ERROR AL ACTUALIZAR EL ENLACE', 'error');
            }
        } catch (error) {
            showToast('ERROR DE CONEXIÓN', 'error');
        } finally {
            setSaving(false);
        }
    };
    const dragCounter = useRef(0);
    const { showToast } = useToast();
    const [showConfirmDeleteProject, setShowConfirmDeleteProject] = useState(false);
    const [deleteConfirmInput, setDeleteConfirmInput] = useState(''); // Nuevo estado para input de seguridad
    const [isDeletingProject, setIsDeletingProject] = useState(false);

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

    const prevFilesCount = useRef(-1);

    // Notificación de nuevos archivos
    useEffect(() => {
        if (project?.archivos) {
            const currentCount = project.archivos.length;
            // Si no es la carga inicial (-1) y hay más archivos que antes
            if (prevFilesCount.current !== -1 && currentCount > prevFilesCount.current) {
                showToast('¡NUEVO ARCHIVO DEL CLIENTE!', 'success');
            }
            prevFilesCount.current = currentCount;
        }
    }, [project?.archivos]);

    useEffect(() => {
        loadProject();
    }, []);

    // Protección contra cierre de pestaña con cambios sin guardar
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

    // Interceptor global de navegación para detectar cambios sin guardar
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!hasPendingChanges) return;

            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && link.href && !link.href.includes('#')) {
                // Solo interceptar si es navegación interna (mismo dominio)
                const currentDomain = window.location.origin;
                if (link.href.startsWith(currentDomain) || link.href.startsWith('/')) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Extraer la ruta del href
                    const path = link.href.replace(currentDomain, '');
                    setPendingNavigation(path);
                    setShowUnsavedModal(true);
                }
            }
        };

        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, [hasPendingChanges]);

    // Polling System - Actualizar cada 5s si no hay cambios pendientes
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (project && !hasPendingChanges && !isEditingPlan && !isEditingDate && !isEditingLink) {
            interval = setInterval(() => {
                loadProject(true); // Silent mode
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [project?.id, hasPendingChanges, isEditingPlan, isEditingDate, isEditingLink]);

    async function loadProject(silent = false) {
        if (!silent) setLoading(true);
        try {
            const projects = await getProyectos();
            const p = projects.find((p: any) => p.id === params.id);
            if (p) {
                // Solo actualizar si realmente hubo cambios en la data relevante para evitar re-renders masivos
                // O simplificamos actualizando siempre, React vDOM lo maneja bien.
                // En este caso, para no perder estado local de inputs, debemos tener cuidado.
                // Como validamos !hasPendingChanges arriba, es seguro actualizar.
                setProject(p);

                // Si NO hay cambios pendientes locales, sincronizamos los inputs con la DB
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

    const updateProgresoAndEstado = (val: number) => {
        setProgreso(val);
        if (val >= 0 && val <= 24) setEstado('pendiente');
        else if (val >= 25 && val <= 50) setEstado('diseño');
        else if (val >= 51 && val <= 99) setEstado('desarrollo');
        else if (val >= 100) setEstado('finalizado');
        setHasPendingChanges(true);
    };

    const updateEstadoAndProgreso = (nuevoEstado: string) => {
        setEstado(nuevoEstado);
        if (nuevoEstado === 'pendiente') setProgreso(0);
        else if (nuevoEstado === 'diseño') setProgreso(25);
        else if (nuevoEstado === 'desarrollo') setProgreso(75);
        else if (nuevoEstado === 'finalizado') setProgreso(100);
        setHasPendingChanges(true);
    };

    async function handleSyncChanges() {
        setSaving(true);
        const result = await updateProyectoProgreso(params.id as string, progreso, estado);
        if (result.success) {
            showToast('CAMBIOS SINCRONIZADOS EXITOSAMENTE', 'success');
            setHasPendingChanges(false);
            await loadProject();

            // Si había navegación pendiente, ejecutarla ahora
            if (pendingNavigation) {
                router.push(pendingNavigation);
                setPendingNavigation(null);
            }
        } else {
            showToast('ERROR AL SINCRONIZAR CAMBIOS', 'error');
        }
        setSaving(false);
    }

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

    async function handleUpdateFecha() {
        if (!tempDate) {
            showToast('SELECCIONA UNA FECHA VÁLIDA', 'error');
            return;
        }

        setSaving(true);
        const result = await updateProyectoFecha(params.id as string, tempDate);
        if (result.success) {
            showToast('FECHA ACTUALIZADA EXITOSAMENTE', 'success');
            setIsEditingDate(false);
            await loadProject();
        } else {
            showToast('ERROR AL ACTUALIZAR LA FECHA', 'error');
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

    async function processFile(file: File) {
        // Pre-check de tamaño en cliente
        if (file.size > 4.5 * 1024 * 1024) {
            showToast('ARCHIVO DEMASIADO GRANDE. El límite es 4.5MB.', 'error');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const result: any = await uploadArchivo(formData, params.id as string, 'admin');

        if (result.error) {
            showToast(result.error, 'error');
        } else {
            showToast('ACTIVO SINCRONIZADO CON LA BÓVEDA', 'success');
            await loadProject();
        }

        setUploading(false);
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.[0]) return;
        await processFile(e.target.files[0]);
    }

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (dragCounter.current === 1) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;
        const file = e.dataTransfer.files?.[0];
        if (file) {
            await processFile(file);
        }
    };

    async function handleDeleteArchivo() {
        if (!archivoToDelete) return;
        setIsDeletingArchivo(true);
        const result = await deleteArchivo(archivoToDelete.id);

        if (result.success) {
            showToast('ACTIVO ELIMINADO CON EXITO', 'info');
            await loadProject();
        } else {
            showToast('ERROR AL ELIMINAR EL ACTIVO', 'error');
        }

        setIsDeletingArchivo(false);
        setArchivoToDelete(null);
    }

    async function handleConfirmPlanChange() {
        setShowConfirmPlan(false);
        setShowVerifyName(true);
    }

    async function handleUpdatePlan() {
        if (!pendingPlan) return;

        // Verificar que el nombre coincida
        if (verifyInput.trim() !== project.nombre.trim()) {
            showToast('EL NOMBRE DEL PROYECTO NO COINCIDE', 'error');
            return;
        }

        setShowVerifyName(false);
        setVerifyInput('');
        setSaving(true);
        const result = await updateProyectoPlan(params.id as string, pendingPlan);
        if (result.success) {
            showToast(`PLAN ACTUALIZADO A ${pendingPlan.toUpperCase()}`, 'success');
            await loadProject();
        } else {
            showToast('ERROR AL ACTUALIZAR EL PLAN', 'error');
        }
        setSaving(false);
        setPendingPlan(null);
    }

    const formatSize = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

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
            showToast('ARCHIVO DESCARGADO EXITOSAMENTE', 'success');
        } catch (error) {
            showToast('ERROR AL DESCARGAR EL ARCHIVO', 'error');
        }
    };

    if (loading) return <AdminLoading />;
    if (!project) return <div>Proyecto no encontrado...</div>;

    const projectPlan = NEXUS_PLANS_ARRAY.find(p => p.title === project.plan) || NEXUS_PLANS_ARRAY[0];
    const PlanIcon = project.plan.toLowerCase().includes('lanzamiento') ? Rocket :
        project.plan.toLowerCase().includes('funcional') ? Zap :
            project.plan.toLowerCase().includes('experiencia') ? CheckCircle2 :
                project.plan.toLowerCase().includes('crecimiento') ? Terminal : Smartphone;

    return (
        <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">

            {/* Command Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5 relative">
                <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b ${projectPlan.color} opacity-5 blur-[120px] pointer-events-none`} />

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <button
                        onClick={() => handleNavigation('/admin/proyectos')}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hover:text-white transition-colors mb-6 group w-fit"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Proyectos
                    </button>
                    <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-[2.5rem] bg-gradient-to-br ${projectPlan.color} flex items-center justify-center text-white shadow-2xl transition-transform duration-700 hover:rotate-6`}>
                            <PlanIcon className="w-10 h-10 shadow-lg" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">{project.nombre}</h1>
                            <div className="flex items-center gap-4 mt-3">
                                <span className="text-gray-500 text-sm font-bold flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#FFD700]" /> {project.cliente?.nombre}
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <span className={`bg-gradient-to-r ${projectPlan.color} bg-clip-text text-transparent text-xs font-black uppercase tracking-[0.2em]`}>{project.plan}</span>
                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${projectPlan.color} animate-pulse`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4">
                    <AnimatePresence>
                        {hasPendingChanges && (
                            <motion.button
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                                onClick={handleSyncChanges}
                                disabled={saving}
                                className={`relative group px-12 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all hover:scale-[1.02] active:scale-95 shadow-2xl disabled:opacity-50 overflow-hidden text-white`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${projectPlan.color} animate-gradient bg-[length:200%_auto]`} />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                <span className="flex items-center gap-3 relative z-10">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Sincronizar Cambios
                                </span>
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={() => {
                            setDeleteConfirmInput(''); // Resetear input por seguridad
                            setShowConfirmDeleteProject(true);
                        }}
                        className="w-16 h-16 rounded-2xl bg-red-500/5 hover:bg-red-500 text-red-500/50 hover:text-white border border-red-500/10 hover:border-red-500 transition-all duration-300 flex items-center justify-center group/trash hover:scale-105 active:scale-95 shadow-2xl"
                        title="Eliminar Proyecto"
                    >
                        <Trash2 className="w-6 h-6 group-hover/trash:rotate-12 transition-transform" />
                    </button>
                </div>
            </header>

            <div className="space-y-12">
                {/* Consola de Mando Unificada */}
                <section className="bg-[#0a0a0a]/30 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] relative overflow-hidden group/console">
                    <div className={`absolute top-0 right-0 w-[50%] h-full bg-gradient-to-br ${projectPlan.color} opacity-[0.02] blur-[120px] -z-10`} />

                    <div className="grid grid-cols-1 lg:grid-cols-3">
                        {/* Panel de Control (Motor de Avance) - 2/3 */}
                        <div className="lg:col-span-2 p-12 border-b lg:border-b-0 lg:border-r border-white/5">
                            <div className="flex items-center justify-between mb-16 px-2">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-2xl font-black font-[family-name:var(--font-orbitron)] flex items-center gap-4 tracking-tighter text-white">
                                        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/5 group-hover/console:border-white/20 transition-all`}>
                                            <MousePointer2 className="w-5 h-5" />
                                        </div>
                                        Motor de Avance
                                    </h2>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Gestión de flujo operativo</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span
                                        className="text-6xl font-black font-[family-name:var(--font-orbitron)] text-transparent bg-clip-text bg-[length:200%_auto]"
                                        style={{
                                            backgroundImage: `linear-gradient(90deg, 
                                                var(--tw-gradient-from, #22d3ee), 
                                                var(--tw-gradient-to, #3b82f6), 
                                                var(--tw-gradient-from, #22d3ee), 
                                                var(--tw-gradient-to, #3b82f6), 
                                                var(--tw-gradient-from, #22d3ee))`.replace(/var\(--tw-gradient-from, #22d3ee\)/g,
                                                project.plan.toLowerCase().includes('lanzamiento') ? '#22d3ee' :
                                                    project.plan.toLowerCase().includes('funcional') ? '#34d399' :
                                                        project.plan.toLowerCase().includes('experiencia') ? '#a855f7' :
                                                            project.plan.toLowerCase().includes('crecimiento') ? '#fb923c' : '#facc15'
                                            ).replace(/var\(--tw-gradient-to, #3b82f6\)/g,
                                                project.plan.toLowerCase().includes('lanzamiento') ? '#3b82f6' :
                                                    project.plan.toLowerCase().includes('funcional') ? '#06b6d4' :
                                                        project.plan.toLowerCase().includes('experiencia') ? '#ec4899' :
                                                            project.plan.toLowerCase().includes('crecimiento') ? '#ef4444' : '#f97316'
                                            ),
                                            animation: 'gradient 3s linear infinite'
                                        }}
                                    >
                                        {progreso}
                                    </span>
                                    <span className="text-xl font-black text-white/20 mb-2">%</span>
                                </div>
                            </div>

                            <div className="space-y-16 px-4">
                                <div className="relative h-24 flex items-center group/slider">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={progreso}
                                        onChange={(e) => updateProgresoAndEstado(parseInt(e.target.value))}
                                        className="w-full h-4 bg-white/5 rounded-full appearance-none cursor-pointer relative z-10 transition-all"
                                        style={{
                                            background: `linear-gradient(to right, transparent 0%, transparent 100%)`
                                        }}
                                    />
                                    {/* Custom Progress Track */}
                                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-4 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: `${progreso}%` }}
                                            className={`h-full bg-gradient-to-r ${projectPlan.color} relative`}
                                        >
                                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[size:1rem_1rem] opacity-20 animate-[move-bg_2s_linear_infinite]" />
                                        </motion.div>
                                    </div>
                                    <div className="absolute inset-0 pointer-events-none flex justify-between px-1 items-center mt-20 opacity-20 group-hover/slider:opacity-50 transition-opacity">
                                        {[0, 25, 50, 75, 100].map(val => (
                                            <div key={val} className="flex flex-col items-center gap-2">
                                                <div className="w-[1px] h-3 bg-white" />
                                                <span className="text-[10px] font-black text-white">{val}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                                    {['Pendiente', 'Diseño', 'Desarrollo', 'Finalizado'].map((e) => {
                                        const isActive = estado === e.toLowerCase();
                                        return (
                                            <button
                                                key={e}
                                                onClick={() => updateEstadoAndProgreso(e.toLowerCase())}
                                                className={`py-5 px-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-150 ${isActive
                                                    ? `bg-gradient-to-br ${projectPlan.color} text-white border-transparent shadow-[0_20px_40px_-10px] shadow-current/30 scale-[1.05]`
                                                    : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20 hover:bg-white/[0.08]'
                                                    }`}
                                            >
                                                {e}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Panel de Datos (Especificaciones) - 1/3 */}
                        <div className="p-12 flex flex-col justify-between bg-white/[0.01]">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-10 flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${projectPlan.color}`} />
                                    Especificaciones
                                </h3>

                                <div className="space-y-4">
                                    {/* Card de Fecha de Lanzamiento */}
                                    <button
                                        onClick={() => {
                                            setIsEditingDate(true);
                                            setTempDate(new Date(project.createdAt).toISOString().split('T')[0]);
                                        }}
                                        className="w-full p-6 rounded-2xl flex items-center justify-between transition-all duration-500 border group/dateCard bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-gradient-to-br ${projectPlan.color} text-white shadow-lg`}>
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className={`text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${projectPlan.color} bg-clip-text text-transparent`}>
                                                    {new Date(project.createdAt).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                                </span>
                                                <span className="text-[9px] text-gray-500 font-bold uppercase">
                                                    Inicio del proyecto
                                                </span>
                                            </div>
                                        </div>
                                        <Settings2 className="w-4 h-4 text-gray-700 group-hover/dateCard:text-white group-hover/dateCard:rotate-90 transition-all duration-500" />
                                    </button>

                                    {/* Link del Proyecto */}
                                    <button
                                        onClick={() => {
                                            setIsEditingLink(true);
                                            setTempLink(project.link || 'Próximamente');
                                        }}
                                        className="w-full p-6 rounded-2xl flex items-center justify-between transition-all duration-500 border group/linkCard bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-gradient-to-br ${projectPlan.color} text-white shadow-lg`}>
                                                <Link2 className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className={`text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${projectPlan.color} bg-clip-text text-transparent break-all line-clamp-1`}>
                                                    {project.link || 'Próximamente'}
                                                </span>
                                                <span className="text-[9px] text-gray-500 font-bold uppercase">
                                                    URL del Proyecto
                                                </span>
                                            </div>
                                        </div>
                                        <Settings2 className="w-4 h-4 text-gray-700 group-hover/linkCard:text-white group-hover/linkCard:rotate-90 transition-all duration-500" />
                                    </button>

                                    {/* Plan Card */}
                                    <button
                                        onClick={() => setIsEditingPlan(true)}
                                        className={`w-full p-6 rounded-2xl flex items-center justify-between transition-all duration-500 border group/planCard bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-gradient-to-br ${projectPlan.color} text-white shadow-lg`}>
                                                <Rocket className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className={`text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${projectPlan.color} bg-clip-text text-transparent`}>
                                                    Nivel {project.plan}
                                                </span>
                                                <span className="text-[9px] text-gray-500 font-bold uppercase">
                                                    Plan de servicio Nexus
                                                </span>
                                            </div>
                                        </div>
                                        <Settings2 className="w-4 h-4 text-gray-700 group-hover/planCard:text-white group-hover/planCard:rotate-90 transition-all duration-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-white/5">
                                <button
                                    onClick={handleToggleVisibilidad}
                                    disabled={togglingVisibilidad}
                                    className={`w-full p-6 rounded-2xl flex items-center justify-between transition-all duration-500 border group/visibility text-left ${visibilidad
                                        ? 'bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10'
                                        : 'bg-red-500/5 border-red-500/10 hover:bg-red-500/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${visibilidad
                                            ? 'bg-emerald-500/10 text-emerald-400 group-hover/visibility:scale-110'
                                            : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {togglingVisibilidad ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : visibilidad ? (
                                                <Eye className="w-5 h-5" />
                                            ) : (
                                                <EyeOff className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${visibilidad ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {visibilidad ? 'Canal Activo' : 'Canal Bloqueado'}
                                            </span>
                                            <span className="text-[9px] text-gray-500 font-bold uppercase">
                                                {visibilidad ? 'Visibilidad cliente OK' : 'Acceso restringido'}
                                            </span>
                                        </div>
                                    </div>
                                    <Settings2 className="w-4 h-4 text-gray-500 group-hover/visibility:text-white group-hover/visibility:rotate-90 transition-all duration-500 opacity-20 group-hover/visibility:opacity-100" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Files Vault */}
                <section
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`bg-white/[0.02] border rounded-[3.5rem] p-12 group/vault transition-all duration-500 relative ${isDragging
                        ? `border-[#FFD700] bg-white/[0.05] shadow-[0_0_50px_rgba(255,215,0,0.1)] scale-[1.01]`
                        : 'border-white/5'
                        }`}
                >
                    {isDragging && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0a0a]/40 backdrop-blur-sm rounded-[3.5rem] pointer-events-none">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="w-20 h-20 rounded-full bg-[#FFD700] text-black flex items-center justify-center shadow-[0_0_30px_#FFD700]">
                                    <Upload className="w-10 h-10 animate-bounce" />
                                </div>
                                <span className="text-sm font-black uppercase tracking-[0.4em] text-[#FFD700]">Soltar para Inyectar</span>
                            </motion.div>
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div>
                            <h2 className="text-2xl font-black font-[family-name:var(--font-orbitron)] tracking-tighter flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/5 group-hover/vault:border-white/20 transition-all">
                                    <FileText className="w-5 h-5" />
                                </div>
                                Bóveda
                            </h2>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Archivos de entrega final y recursos</p>
                        </div>

                        <label className="cursor-pointer group/upload">
                            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                            <div className={`flex items-center gap-4 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 shadow-xl ${uploading ? 'bg-gray-800' : `bg-white/5 border border-white/10 group-hover/upload:bg-gradient-to-r ${projectPlan.color} group-hover/upload:text-white group-hover/upload:border-transparent`}`}>
                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-5 h-5" />}
                                Subir archivo
                            </div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {project.archivos?.map((archivo: any) => (
                                <motion.div
                                    key={archivo.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 rounded-[2rem] bg-[#0a0a0a]/40 border border-white/5 flex items-center justify-between group/file hover:border-white/20 transition-all duration-500 shadow-lg"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover/file:bg-gradient-to-br ${projectPlan.color} group-hover/file:text-white transition-all duration-500`}>
                                            {/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(archivo.nombre) ? (
                                                <ImageIcon className="w-7 h-7" />
                                            ) : (
                                                <FileText className="w-7 h-7" />
                                            )}
                                        </div>
                                        <div className="flex flex-col max-w-[120px] md:max-w-[180px]">
                                            <span className="text-sm font-black truncate group-hover/file:text-white transition-colors">{archivo.nombre}</span>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">OK</span>
                                                </div>
                                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                                <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">{formatSize(archivo.tamano)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDownload(archivo.url, archivo.nombre)}
                                            className={`p-4 rounded-xl bg-white/5 text-gray-400 hover:scale-110 transition-all duration-300 hover:text-white hover:bg-gradient-to-br ${projectPlan.color}`}
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setArchivoToDelete(archivo)}
                                            className="p-4 rounded-xl bg-white/5 text-gray-400 hover:scale-110 transition-all duration-300 hover:text-white hover:bg-red-500"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {(!project.archivos || project.archivos.length === 0) && (
                            <div className="col-span-full py-20 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-700 bg-white/[0.01]">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                    <AlertCircle className="w-8 h-8 opacity-20" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sin flujos de datos detectados</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Modal de Selección de Plan */}
            <AnimatePresence>
                {isEditingPlan && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditingPlan(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0a0a0a] border border-white/10 w-full max-w-5xl rounded-[3rem] p-12 relative z-10 shadow-2xl overflow-hidden"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${projectPlan.color}`} />

                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">Arquitectura Operativa</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Reconfigura el nivel de inversión y escalado del proyecto</p>
                                </div>
                                <button onClick={() => setIsEditingPlan(false)} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                                {NEXUS_PLANS_ARRAY.map((planOption) => {
                                    const isCurrent = project.plan === planOption.title;
                                    const Icon = planOption.id === 'lanzamiento' ? Rocket :
                                        planOption.id === 'funcional' ? Zap :
                                            planOption.id === 'experiencia' ? CheckCircle2 :
                                                planOption.id === 'crecimiento' ? Terminal : Smartphone;

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
                                            className={`relative group p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center text-center gap-6 overflow-hidden ${isCurrent
                                                ? 'bg-white/5 border-white/20 ring-1 ring-white/10'
                                                : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                                                }`}
                                        >
                                            {/* Gradient Background on Selected */}
                                            {isCurrent && (
                                                <div className={`absolute inset-0 bg-gradient-to-br ${planOption.color} opacity-10 animate-pulse`} />
                                            )}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${planOption.color} opacity-0 group-hover:opacity-5 transition-opacity duration-700`} />

                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${planOption.color} flex items-center justify-center text-white shadow-lg transition-transform duration-500 ${isCurrent ? 'scale-110 shadow-current/20' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105'}`}>
                                                <Icon className="w-8 h-8" />
                                            </div>

                                            <div className="relative z-10">
                                                <p className={`text-[11px] font-black uppercase tracking-tight mb-1 transition-colors ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                                                    {planOption.title.replace('Plan ', '')}
                                                </p>
                                                <div className={`text-[8px] font-black px-3 py-1 rounded-full inline-block transition-all ${isCurrent ? 'bg-white text-black' : 'bg-white/5 text-gray-600 group-hover:text-gray-400'
                                                    }`}>
                                                    {isCurrent ? 'ACTUAL' : `${planOption.days}D`}
                                                </div>
                                            </div>

                                            {isCurrent && (
                                                <motion.div
                                                    layoutId="modalActivePlanMark"
                                                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-gradient-to-r ${planOption.color} rounded-full`}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Re-confirmación Critica */}
            <AnimatePresence>
                {showConfirmPlan && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowConfirmPlan(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0a0a0a] border border-red-500/20 w-full max-w-sm rounded-[2.5rem] p-10 relative z-10 shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-3">¿ESTÁS SEGURO?</h3>
                            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                                Estás a punto de cambiar el nivel de servicio de <br />
                                <span className={`font-black bg-gradient-to-r ${NEXUS_PLANS_ARRAY.find(p => p.title === project.plan)?.color || 'from-gray-400 to-gray-500'} bg-clip-text text-transparent`}>"{project.plan}"</span> a <br />
                                <span className={`font-black bg-gradient-to-r ${NEXUS_PLANS_ARRAY.find(p => p.title === pendingPlan)?.color || 'from-emerald-400 to-emerald-500'} bg-clip-text text-transparent`}>"{pendingPlan}"</span>
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowConfirmPlan(false)}
                                    className="py-4 rounded-xl border border-white/5 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                                >
                                    Abortar
                                </button>
                                <button
                                    onClick={handleConfirmPlanChange}
                                    className="py-4 rounded-xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] border border-emerald-400/20"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            {/* Modal de Verificación Final - Nombre del Proyecto */}
            <AnimatePresence>
                {showVerifyName && (
                    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowVerifyName(false);
                                setVerifyInput('');
                            }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0a0a0a] border border-amber-500/30 w-full max-w-md rounded-[2.5rem] p-10 relative z-10 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-3 text-center">VERIFICACIÓN FINAL</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6 text-center">
                                Para confirmar este cambio crítico, <br />
                                escribe el nombre exacto del proyecto:
                            </p>

                            <div className="mb-8">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 text-center">
                                    <span className={`text-sm font-black bg-gradient-to-r ${NEXUS_PLANS_ARRAY.find(p => p.title === project.plan)?.color || 'from-gray-400 to-gray-500'} bg-clip-text text-transparent`}>
                                        {project.nombre}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={verifyInput}
                                    onChange={(e) => setVerifyInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && verifyInput.trim() === project.nombre.trim()) {
                                            handleUpdatePlan();
                                        }
                                    }}
                                    placeholder="Escribe el nombre aquí..."
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-center focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-gray-600 placeholder:font-normal"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        setShowVerifyName(false);
                                        setVerifyInput('');
                                    }}
                                    className="py-4 rounded-xl border border-white/5 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdatePlan}
                                    disabled={verifyInput.trim() !== project.nombre.trim()}
                                    className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${verifyInput.trim() === project.nombre.trim()
                                        ? 'bg-amber-500 text-black hover:bg-amber-600 shadow-[0_10px_20px_-5px_rgba(245,158,11,0.3)] border border-amber-400/20'
                                        : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'
                                        }`}
                                >
                                    Ejecutar Cambio
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Confirmación de Eliminación */}
            <AnimatePresence>
                {archivoToDelete && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeletingArchivo && setArchivoToDelete(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0a0a0a] border border-red-500/20 w-full max-w-sm rounded-[2.5rem] p-10 relative z-10 shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                                    <ShieldAlert className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black font-[family-name:var(--font-orbitron)] mb-3 uppercase tracking-tighter">Purgar Activo</h3>
                                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                                    ¿Confirmas la eliminación permanente de <br />
                                    <span className="text-white">"{archivoToDelete.nombre}"</span>?
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        disabled={isDeletingArchivo}
                                        onClick={() => setArchivoToDelete(null)}
                                        className="py-4 rounded-xl border border-white/5 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                                    >
                                        Abortar
                                    </button>
                                    <button
                                        disabled={isDeletingArchivo}
                                        onClick={handleDeleteArchivo}
                                        className="py-4 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_-5px_rgba(239,68,68,0.3)] border border-red-400/20"
                                    >
                                        {isDeletingArchivo ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>Confirmar</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            {/* Modal de Edición de Fecha */}
            <AnimatePresence>
                {isEditingDate && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditingDate(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0a0a0a] border border-blue-500/30 w-full max-w-md rounded-[2.5rem] p-10 relative z-10 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Calendar className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-3 text-center">EDITAR FECHA DE LANZAMIENTO</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6 text-center">
                                Actualiza la fecha de inicio del proyecto
                            </p>

                            <div className="mb-8">
                                <input
                                    type="date"
                                    value={tempDate}
                                    onChange={(e) => setTempDate(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-center focus:outline-none focus:border-blue-500/50 transition-all"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsEditingDate(false)}
                                    className="py-4 rounded-xl border border-white/5 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdateFecha}
                                    disabled={saving || !tempDate}
                                    className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${tempDate && !saving
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg shadow-[0_10px_20px_-5px_rgba(59,130,246,0.3)] border border-blue-400/20'
                                        : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'
                                        }`}
                                >
                                    {saving ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Guardando...
                                        </span>
                                    ) : (
                                        'Actualizar'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Edicíón de Link */}
            <AnimatePresence>
                {isEditingLink && (
                    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditingLink(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0a0a0a] border border-white/10 w-[95%] sm:w-full max-w-lg rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative z-10 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-6">
                                <Link2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-3 text-center">ENLACE DEL PROYECTO</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6 text-center">
                                Actualiza la URL donde el cliente podrá ver su proyecto finalizado o en progreso.
                            </p>

                            <div className="mb-8">
                                <input
                                    type="text"
                                    value={tempLink}
                                    onChange={(e) => setTempLink(e.target.value)}
                                    placeholder="https://ejemplo.com o Próximamente"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsEditingLink(false)}
                                    className="py-4 rounded-xl border border-white/5 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmLinkChange}
                                    disabled={saving || !tempLink}
                                    className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${tempLink && !saving
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg shadow-[0_10px_20px_-5px_rgba(59,130,246,0.3)] border border-blue-400/20'
                                        : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'
                                        }`}
                                >
                                    {saving ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Guardando...
                                        </span>
                                    ) : (
                                        'Actualizar'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Cambios Sin Guardar */}
            <AnimatePresence>
                {showUnsavedModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUnsavedModal(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0a0a0a] border border-amber-500/30 w-[95%] sm:w-full max-w-md rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative z-10 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-3 text-center">CAMBIOS SIN GUARDAR</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8 text-center">
                                Tienes modificaciones pendientes en <br />
                                <span className="text-amber-400 font-black">Progreso y Estado</span> <br />
                                ¿Qué deseas hacer?
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={async () => {
                                        setShowUnsavedModal(false);
                                        await handleSyncChanges();
                                    }}
                                    disabled={saving}
                                    className="w-full py-4 rounded-xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] border border-emerald-400/20 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sincronizando...
                                        </span>
                                    ) : (
                                        'Sincronizar y Salir'
                                    )}
                                </button>
                                <button
                                    onClick={handleDiscardChanges}
                                    className="w-full py-4 rounded-xl bg-red-500/10 text-red-400 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all border border-red-500/20"
                                >
                                    Descartar Cambios
                                </button>
                                <button
                                    onClick={() => {
                                        setShowUnsavedModal(false);
                                        setPendingNavigation(null);
                                    }}
                                    className="w-full py-4 rounded-xl border border-white/5 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Eliminación de Proyecto */}
            <AnimatePresence>
                {showConfirmDeleteProject && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeletingProject && setShowConfirmDeleteProject(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0a0a0a] border border-red-500/30 w-[95%] sm:w-full max-w-lg rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative z-10 shadow-[0_0_100px_rgba(239,68,68,0.2)] overflow-hidden"
                        >
                            {/* Fondo Nuclear */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/20 blur-[80px] rounded-full pointer-events-none" />

                            <div className="text-center relative">
                                <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                                    <Trash2 className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-black font-[family-name:var(--font-orbitron)] mb-3 uppercase tracking-tighter text-white">
                                    Zona de Peligro
                                </h3>
                                <p className="text-gray-400 text-sm mb-6 leading-relaxed font-medium">
                                    Estás a punto de eliminar permanentemente el proyecto <span className="text-white font-black">{project.nombre}</span>.
                                    Esta acción es irreversible.
                                </p>

                                {/* Input de Seguridad */}
                                <div className="mb-8 text-left bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-red-400 mb-2 block">
                                        Escribe la frase de confirmación:
                                    </label>
                                    <div className="user-select-all font-mono text-xs bg-black/50 p-3 rounded-lg border border-white/5 mb-4 text-gray-300">
                                        eliminar {project.nombre}
                                    </div>
                                    <input
                                        type="text"
                                        value={deleteConfirmInput}
                                        onChange={(e) => setDeleteConfirmInput(e.target.value)}
                                        placeholder={`eliminar ${project.nombre}`}
                                        className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                                        autoComplete="off"
                                        onPaste={(e) => e.preventDefault()} // Opcional: Evitar pegar para más seguridad
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setShowConfirmDeleteProject(false)}
                                        disabled={isDeletingProject}
                                        className="py-5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleDeleteProject}
                                        disabled={isDeletingProject || deleteConfirmInput !== `eliminar ${project.nombre}`}
                                        className="py-5 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_-5px_rgba(220,38,38,0.4)] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                                    >
                                        {isDeletingProject ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Eliminando...
                                            </>
                                        ) : (
                                            'Confirmar Eliminación'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InfoRow({ label, value, color = "text-white" }: { label: string, value: string, color?: string }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">{label}</span>
            <span className={`text-sm font-black tracking-tight ${color}`}>{value}</span>
        </div>
    );
}
