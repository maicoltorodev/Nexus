'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getProyectoByCedula, uploadArchivo } from '@/lib/actions';
import { Search, Loader2, Calendar, CheckCircle2, FileText, ChevronRight, Layout, Upload, Sparkles, Rocket, Zap, Terminal, Smartphone, X, AlertCircle, Lock, ShieldBan, ExternalLink, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NEXUS_PLANS } from '@/lib/constants';

const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB
const MAX_PROJECT_SIZE = 50 * 1024 * 1024; // 50MB

export default function SeguimientoPage() {
    const [cedula, setCedula] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!cedula) return;

        setLoading(true);
        setError('');
        setData(null);

        try {
            const result = await getProyectoByCedula(cedula);
            if (result) {
                setData(result);
            } else {
                setError('No se encontró ningún proyecto asociado a esta cédula.');
            }
        } catch (err) {
            setError('Ocurrió un error al buscar. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    }

    // Reactividad (Polling System) - Actualizar cada 5s
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (data && cedula) {
            interval = setInterval(async () => {
                try {
                    const result = await getProyectoByCedula(cedula);
                    if (result) {
                        setData(result);
                    } else {
                        // CRÍTICO: Si el proyecto desaparece (fue eliminado), limpiamos la vista
                        setData(null);
                        setError('El proyecto ha dejado de estar disponible.');
                    }
                } catch (error) {
                    // Si hay error de red, no hacemos nada para no asustar al usuario,
                    // reintentará en 5s. Solo si es persistente afectaría.
                    console.error("Error de conexión en background:", error);
                }
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [data, cedula]);

    // Obtener el plan del proyecto de forma robusta
    const proyecto = data?.proyectos?.[0];

    const getPlanConfig = (nombrePlan: string) => {
        const p = nombrePlan?.toLowerCase() || '';
        if (p.includes('funcional')) return NEXUS_PLANS.funcional;
        if (p.includes('experiencia')) return NEXUS_PLANS.experiencia;
        if (p.includes('crecimiento')) return NEXUS_PLANS.crecimiento;
        if (p.includes('medida')) return NEXUS_PLANS.medida;
        return NEXUS_PLANS.lanzamiento;
    };

    const projectPlan = getPlanConfig(proyecto?.plan);
    const PlanIcon = projectPlan.icon;

    // Calcular tamaño total de archivos
    const totalSize = proyecto?.archivos?.reduce((acc: number, file: any) => acc + (file.tamano || 0), 0) || 0;
    const remainingSpace = MAX_PROJECT_SIZE - totalSize;

    // Función para subir archivos
    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        setUploadError('');

        // Validar tamaño individual
        if (file.size > MAX_FILE_SIZE) {
            setUploadError(`El archivo excede el límite de 4.5MB. Tamaño: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            return;
        }

        // Validar espacio total del proyecto
        if (totalSize + file.size > MAX_PROJECT_SIZE) {
            setUploadError(`No hay suficiente espacio. Disponible: ${(remainingSpace / 1024 / 1024).toFixed(2)}MB`);
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await uploadArchivo(formData, proyecto.id, 'cliente');

            if (result.success) {
                // Recargar datos del proyecto
                const updatedData = await getProyectoByCedula(cedula);
                setData(updatedData);
                setUploadError('');
            } else {
                setUploadError(result.error || 'Error al subir el archivo');
            }
        } catch (err) {
            setUploadError('Error al subir el archivo. Inténtalo de nuevo.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Drag & Drop handlers
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
    };

    return (
        <main className="bg-[#0a0a0a] min-h-screen text-white">
            <Navbar />

            <section className="pt-40 pb-20 px-4 relative">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#FFD700] opacity-[0.03] blur-[150px] pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5 text-xs font-black text-[#FFD700] uppercase tracking-[0.3em]">
                            <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                            Portal del Cliente
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Estado de tu <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Proyecto</span>
                        </h1>

                        <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                            Ingresa tu número de identificación para consultar el estado completo de tu proyecto, avances, archivos y toda la información en tiempo real.
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden group hover:border-[#FFD700]/20 transition-colors duration-500 mb-16">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700] blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />

                            <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
                                <input
                                    type="text"
                                    value={cedula}
                                    onChange={(e) => setCedula(e.target.value)}
                                    placeholder="Escribe tu cédula aquí..."
                                    className="w-full bg-black/40 border border-white/10 rounded-full py-5 px-8 pr-16 focus:outline-none focus:border-[#FFD700]/50 transition-all text-lg text-white placeholder:text-gray-600 font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-2 top-2 bottom-2 w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 shadow-[0_10px_30px_-5px_rgba(255,215,0,0.3)]"
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ChevronRight className="w-6 h-6" />}
                                </button>
                            </form>

                            <div className="mt-6 flex items-center justify-center gap-6 opacity-40">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Acceso Seguro
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Datos Encriptados
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 mb-8 backdrop-blur-xl"
                            >
                                <p className="font-bold text-sm uppercase tracking-widest">{error}</p>
                            </motion.div>
                        )}

                        {data && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-left space-y-8"
                            >
                                {(!proyecto) ? (
                                    <div className="relative overflow-hidden rounded-[3rem] p-1">
                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-50" />
                                        <div className="relative bg-[#0a0a0a] rounded-[2.8rem] p-12 md:p-20 text-center border border-white/5">
                                            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                                                <Rocket className="w-10 h-10 text-gray-500" />
                                            </div>
                                            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-white">
                                                Hola, <span className="text-[#FFD700]">{data.nombre}</span>
                                            </h2>
                                            <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-300">
                                                No tienes ningún proyecto activo
                                            </h3>
                                            <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed mb-10">
                                                Actualmente no hemos iniciado ningún proyecto bajo tu identificación.
                                                Si crees que esto es un error, o estás listo para comenzar tu próxima gran idea, contáctanos.
                                            </p>
                                            <a
                                                href="https://wa.me/573184022999"
                                                target="_blank"
                                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FFD700] text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg shadow-[#FFD700]/20"
                                            >
                                                Iniciar Proyecto
                                            </a>
                                        </div>
                                    </div>
                                ) : !proyecto?.visibilidad ? (
                                    <div className="relative overflow-hidden rounded-[3rem] p-1">
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 opacity-50" />
                                        <div className="relative bg-[#0a0a0a] rounded-[2.8rem] p-12 md:p-20 text-center">
                                            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-500/10 flex items-center justify-center">
                                                <ShieldBan className="w-12 h-12 text-red-500" />
                                            </div>
                                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                                                Acceso Restringido
                                            </h2>
                                            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                                                La vista de este proyecto se encuentra temporalmente bloqueada o privada.
                                                Si crees que esto es un error, por favor contacta con soporte.
                                            </p>
                                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold uppercase tracking-widest text-xs">
                                                <Lock className="w-4 h-4" />
                                                Visualización Privada
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Dashboard Grid Layout */}
                                        <div className="space-y-12">

                                            {/* 1. Project Header & Identity */}
                                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-colors duration-700`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${projectPlan.color} transition-all duration-700`} />
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                                                                Plan {proyecto?.plan}
                                                            </span>
                                                        </div>
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                                                            <Sparkles className="w-3 h-3 text-amber-400" />
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                                                                {proyecto?.estado}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <h2 className="text-3xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-none md:leading-[0.9]">
                                                        {proyecto?.nombre || 'Tu Proyecto'}
                                                    </h2>

                                                    <div className="flex flex-wrap items-center gap-4">
                                                        {proyecto?.link && proyecto.link.includes('http') ? (
                                                            <a href={proyecto.link} target="_blank" rel="noopener noreferrer" className={`group relative inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full bg-white text-black font-black uppercase text-[10px] md:text-xs tracking-widest hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]`}>
                                                                Ver Proyecto
                                                                <ExternalLink className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                                                            </a>
                                                        ) : (
                                                            <div className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full bg-white/5 border border-white/10 text-gray-500 font-bold uppercase text-[10px] md:text-xs tracking-widest cursor-not-allowed">
                                                                <Link2 className="w-3 h-3 md:w-4 md:h-4 opacity-50" />
                                                                {proyecto?.link || 'Enlace próximamente'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Progress Indicator (Circular or Large Number) */}
                                                <div className="md:text-right">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Progreso Global</p>
                                                    <div className="flex items-baseline md:justify-end gap-1">
                                                        <span className={`text-6xl md:text-8xl font-black bg-gradient-to-b ${projectPlan.color} bg-clip-text text-transparent tracking-tighter transition-all duration-700`}>
                                                            {proyecto?.progreso}
                                                        </span>
                                                        <span className={`text-2xl font-black text-gray-600`}>%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 2. Metrics & Specs Grid */}
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                {/* Progress Bar Card */}
                                                <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group transition-all duration-700">
                                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${projectPlan.color} opacity-20 transition-all duration-700`} />
                                                    <div className="flex justify-between items-end mb-6">
                                                        <div>
                                                            <h3 className="text-xl font-bold mb-1">Evolución del Desarrollo</h3>
                                                            <p className="text-xs text-gray-500 font-medium">Seguimiento en tiempo real de la línea de producción</p>
                                                        </div>
                                                        <Rocket className={`w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-500`} />
                                                    </div>
                                                    <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${proyecto?.progreso}%` }}
                                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                                            className={`h-full bg-gradient-to-r ${projectPlan.color} relative shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-700`}
                                                        >
                                                            <div className="absolute inset-0 bg-white/30 animate-pulse" />
                                                        </motion.div>
                                                    </div>
                                                </div>

                                                {/* Info Metrics */}
                                                <InfoCard
                                                    icon={Calendar}
                                                    label="Fecha de Inicio"
                                                    value={new Date(proyecto?.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    color={projectPlan.color}
                                                />
                                                <InfoCard
                                                    icon={Layout}
                                                    label="Arquitectura"
                                                    value={`Plan ${proyecto?.plan}`}
                                                    color={projectPlan.color}
                                                />
                                                <InfoCard
                                                    icon={CheckCircle2}
                                                    label="Estado del Canal"
                                                    value={proyecto?.visibilidad ? 'Activo & Público' : 'Privado'}
                                                    color={projectPlan.color}
                                                />
                                            </div>

                                            {/* 3. File Vault Section */}
                                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                                                {/* Upload Zone (Left - Large) */}
                                                <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden">
                                                    <div className="flex items-center justify-between mb-8">
                                                        <div>
                                                            <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${projectPlan.color} flex items-center justify-center text-white shadow-lg transition-all duration-700`}>
                                                                    <Upload className="w-5 h-5" />
                                                                </div>
                                                                Bóveda de Archivos
                                                            </h3>
                                                            <p className="text-xs text-gray-500 mt-2 ml-1">Repositorio seguro de activos digitales</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1`}>Almacenamiento</div>
                                                            <div className="text-sm font-bold text-white">{(totalSize / 1024 / 1024).toFixed(1)} <span className="text-gray-600">/ 50 MB</span></div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        onDragEnter={handleDragEnter}
                                                        onDragLeave={handleDragLeave}
                                                        onDragOver={handleDragOver}
                                                        onDrop={handleDrop}
                                                        className={`border border-dashed rounded-3xl p-6 md:p-10 transition-all duration-300 flex flex-col items-center justify-center text-center group/drop ${isDragging
                                                            ? `border-[#FFD700] bg-[#FFD700]/5 scale-[0.98]`
                                                            : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
                                                            }`}
                                                    >
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            onChange={(e) => handleFileUpload(e.target.files)}
                                                            className="hidden"
                                                            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                                                        />
                                                        <div className={`w-16 h-16 mb-6 rounded-full bg-white/5 flex items-center justify-center group-hover/drop:scale-110 transition-transform duration-300`}>
                                                            <Upload className={`w-6 h-6 text-gray-400 group-hover/drop:text-white transition-colors`} />
                                                        </div>
                                                        <h4 className="text-lg font-bold mb-2">Arrastra tus archivos aquí</h4>
                                                        <p className="text-xs text-gray-500 mb-6 max-w-xs mx-auto">Soporta imágenes, documentos PDF y archivos comprimidos hasta 4.5MB</p>
                                                        <button
                                                            onClick={() => fileInputRef.current?.click()}
                                                            disabled={uploading}
                                                            className={`px-8 py-3 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50`}
                                                        >
                                                            {uploading ? 'Subiendo...' : 'Explorar Archivos'}
                                                        </button>
                                                    </div>

                                                    {/* Error Message */}
                                                    <AnimatePresence>
                                                        {uploadError && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
                                                            >
                                                                <AlertCircle className="w-4 h-4 text-red-400" />
                                                                <span className="text-xs text-red-300 font-medium">{uploadError}</span>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* Files List (Right - Smaller) */}
                                                <div className="lg:col-span-2 space-y-4">
                                                    <div className="flex items-center justify-between px-2">
                                                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Recientes</h4>
                                                        <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded text-white">{proyecto?.archivos?.length || 0}</span>
                                                    </div>

                                                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {proyecto?.archivos?.length > 0 ? (
                                                            proyecto.archivos.map((file: any) => (
                                                                <div
                                                                    key={file.id}
                                                                    className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 flex items-start gap-4"
                                                                >
                                                                    <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-gray-500 group-hover:text-white transition-colors`}>
                                                                        <FileText className="w-5 h-5" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="font-bold text-xs truncate text-gray-300 group-hover:text-white transition-colors mb-1">
                                                                            {file.nombre}
                                                                        </p>
                                                                        <p className="text-[10px] text-gray-600 font-medium">
                                                                            {(file.tamano / 1024).toFixed(1)} KB
                                                                        </p>
                                                                    </div>
                                                                    <div className={`w-1.5 h-1.5 rounded-full mt-2 ${file.subidoPor === 'cliente' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="py-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
                                                                <FileText className="w-8 h-8 text-gray-700 mb-3" />
                                                                <p className="text-xs text-gray-600 font-medium">Bóveda vacía</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 4. Support Footer */}
                                            <div className={`mt-12 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-r ${projectPlan.color} p-[1px] transition-all duration-700`}>
                                                <div className="absolute inset-0 bg-black/20" />
                                                <div className="relative bg-[#080808] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                                                    <div className="text-center md:text-left">
                                                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-2">Centro de Ayuda</h3>
                                                        <p className="text-gray-400 text-xs md:text-sm max-w-sm mx-auto md:mx-0">Si tienes dudas sobre tu progreso o necesitas asistencia técnica, estamos en línea.</p>
                                                    </div>
                                                    <a
                                                        href="https://wa.me/573184022999"
                                                        target="_blank"
                                                        className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r ${projectPlan.color} text-white font-black uppercase text-xs tracking-widest hover:scale-105 transition-all duration-700 shadow-lg`}
                                                    >
                                                        Contactar Soporte
                                                        <ChevronRight className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function InfoCard({ icon: Icon, label, value, color }: any) {
    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl group hover:bg-white/10 transition-all">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{label}</p>
            <p className="text-lg font-bold capitalize">{value}</p>
        </div>
    );
}
