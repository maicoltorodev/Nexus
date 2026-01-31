'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getArchivos, deleteArchivo } from '@/lib/actions';
import { useToast } from '@/app/providers/ToastProvider';
import {
    FileText,
    Search,
    Download,
    Trash2,
    Image as ImageIcon,
    File as FileIcon,
    Loader2,
    FolderOpen,
    User,
    Calendar,
    ExternalLink,
    ShieldAlert,
    X,
    FolderKanban,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLoading from '../loading';
import { NEXUS_PLANS, NEXUS_PLANS_ARRAY } from '@/lib/constants';

export default function ArchivosPage() {
    const [archivos, setArchivos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [archivoToDelete, setArchivoToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { showToast } = useToast();
    const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
    const prevArchivosCount = useRef(-1);

    useEffect(() => {
        loadArchivos();

        // Polling para mantener la bóveda sincronizada
        const interval = setInterval(() => {
            loadArchivos();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Notificación de nuevos archivos en la bóveda
    useEffect(() => {
        if (archivos.length > 0) {
            const currentCount = archivos.length;
            if (prevArchivosCount.current !== -1 && currentCount > prevArchivosCount.current) {
                showToast('¡NUEVOS ACTIVOS EN LA BÓVEDA!', 'success');
            }
            prevArchivosCount.current = currentCount;
        }
    }, [archivos]);

    async function loadArchivos() {
        try {
            const data = await getArchivos();
            setArchivos(data);
        } catch (error) {
            console.error("Error cargando archivos:", error);
        } finally {
            setLoading(false);
        }
    }

    // Agrupar por Proyecto
    const proyectosGrouped = archivos.reduce((acc: any, archivo: any) => {
        const projId = archivo.proyectoId;
        if (!acc[projId]) {
            acc[projId] = {
                proyecto: archivo.proyecto,
                files: []
            };
        }
        acc[projId].files.push(archivo);
        return acc;
    }, {});

    const sortedGroups = Object.values(proyectosGrouped).sort((a: any, b: any) =>
        a.proyecto.nombre.localeCompare(b.proyecto.nombre)
    );

    async function handleDeleteConfirm() {
        if (!archivoToDelete) return;
        setIsDeleting(true);
        const result = await deleteArchivo(archivoToDelete.id);

        if (result.success) {
            showToast('ACTIVO ELIMINADO DE LA BÓVEDA', 'info');
            loadArchivos();
        } else {
            showToast('ERROR AL ELIMINAR EL ACTIVO', 'error');
        }

        setIsDeleting(false);
        setArchivoToDelete(null);
    }

    const toggleFolder = (id: string) => {
        setExpandedFolders(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const isSearching = searchTerm.length > 0;

    const getPlanColor = (planName: string) => {
        const plan = NEXUS_PLANS_ARRAY.find(p => p.title === planName) || NEXUS_PLANS_ARRAY[0];
        if (planName.toLowerCase().includes('lanzamiento')) return 'cyan-400';
        if (planName.toLowerCase().includes('funcional')) return 'emerald-400';
        if (planName.toLowerCase().includes('experiencia')) return 'purple-500';
        if (planName.toLowerCase().includes('crecimiento')) return 'red-500';
        if (planName.toLowerCase().includes('medida')) return '[#FFD700]';
        return 'rose-500';
    };

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

    return (
        <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
            {/* Header Elite */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 text-[#FFD700] mb-2">
                        <FolderOpen className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] font-[family-name:var(--font-orbitron)]">Jerarquía de Activos</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                        Nuestra <span className="bg-gradient-to-r from-[#FFD700] via-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">Bóveda</span>
                    </h1>
                </motion.div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-rose-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar en proyectos..."
                            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-rose-500/50 focus:bg-white/[0.08] transition-all w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Project Folders Grid */}
            <div className="space-y-8">
                {sortedGroups.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {sortedGroups
                            .filter((group: any) =>
                                !isSearching ||
                                group.proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                group.proyecto.cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                group.files.some((f: any) => f.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
                            )
                            .map((group: any) => {
                                const isExpanded = expandedFolders.includes(group.proyecto.id) || isSearching;
                                const planColor = getPlanColor(group.proyecto.plan);

                                return (
                                    <div key={group.proyecto.id} className="space-y-4">
                                        {/* Folder Header */}
                                        <button
                                            onClick={() => toggleFolder(group.proyecto.id)}
                                            className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 group ${isExpanded
                                                ? 'bg-white/5 border-white/20'
                                                : 'bg-[#0a0a0a]/50 border-white/5 hover:border-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className={`w-16 h-16 rounded-2xl bg-${planColor.startsWith('[') ? 'white' : planColor}/10 border border-${planColor.startsWith('[') ? 'white' : planColor}/10 flex items-center justify-center text-${planColor.startsWith('[') ? 'white' : planColor} group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-${planColor.startsWith('[') ? 'white' : planColor}/5`}>
                                                    <FolderOpen className="w-8 h-8" />
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="text-xl font-bold group-hover:text-white transition-colors tracking-tight line-clamp-1">
                                                        {group.proyecto.nombre}
                                                    </h3>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2 mt-1">
                                                        <User className="w-3 h-3" /> {group.proyecto.cliente?.nombre}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right hidden sm:block">
                                                    <span style={{ color: planColor.startsWith('[') ? planColor.replace('[', '').replace(']', '') : undefined }} className={`text-sm font-black ${!planColor.startsWith('[') ? `text-${planColor}` : ''} font-[family-name:var(--font-orbitron)]`}>
                                                        {group.files.length}
                                                    </span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 block">
                                                        Activos
                                                    </span>
                                                </div>
                                                <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
                                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                                </div>
                                            </div>
                                        </button>

                                        {/* Files Grid (Expanded) */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.4, ease: "circOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 pb-8">
                                                        {group.files
                                                            .filter((f: any) => !isSearching || f.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
                                                            .map((archivo: any, fIdx: number) => {
                                                                const extension = archivo.nombre.split('.').pop()?.toUpperCase() || 'FILE';
                                                                const isImage = archivo.tipo === 'imagen';

                                                                return (
                                                                    <motion.div
                                                                        key={archivo.id}
                                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        transition={{ delay: fIdx * 0.03 }}
                                                                        className="group/file bg-[#0a0a0a]/30 border border-white/5 rounded-[1.5rem] hover:border-white/20 transition-all flex flex-col relative overflow-hidden h-full"
                                                                    >
                                                                        {/* Card Front - Image or Tech Icon */}
                                                                        <div className="relative h-40 w-full overflow-hidden bg-white/[0.02]">
                                                                            {isImage ? (
                                                                                <img
                                                                                    src={archivo.url}
                                                                                    alt={archivo.nombre}
                                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/file:scale-110"
                                                                                />
                                                                            ) : (
                                                                                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                                                                    <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-${planColor} shadow-2xl shadow-${planColor}/5`}>
                                                                                        <FileIcon className="w-8 h-8" />
                                                                                    </div>
                                                                                    <span className={`px-3 py-1 rounded-full bg-${planColor}/10 border border-${planColor}/20 text-[10px] font-black text-${planColor} tracking-widest`}>
                                                                                        {extension}
                                                                                    </span>
                                                                                </div>
                                                                            )}

                                                                            {/* Overlay Actions */}
                                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/file:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                                                                                <a
                                                                                    href={archivo.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center transition-all hover:scale-110 shadow-xl"
                                                                                    title="Ver Original"
                                                                                >
                                                                                    <ExternalLink className="w-5 h-5" />
                                                                                </a>
                                                                                <button
                                                                                    onClick={() => handleDownload(archivo.url, archivo.nombre)}
                                                                                    className="w-10 h-10 rounded-xl bg-[#FFD700] text-black flex items-center justify-center transition-all hover:scale-110 shadow-xl"
                                                                                    title="Descargar"
                                                                                >
                                                                                    <Download className="w-5 h-5" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => setArchivoToDelete(archivo)}
                                                                                    className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center transition-all hover:scale-110 shadow-xl"
                                                                                    title="Eliminar"
                                                                                >
                                                                                    <Trash2 className="w-5 h-5" />
                                                                                </button>
                                                                            </div>
                                                                        </div>

                                                                        {/* Info Footer */}
                                                                        <div className="p-4 bg-black/40 border-t border-white/5">
                                                                            <div className="flex items-center justify-between gap-3">
                                                                                <div className="min-w-0 flex-1">
                                                                                    <h4 className="text-[11px] font-bold text-gray-200 truncate pr-4" title={archivo.nombre}>
                                                                                        {archivo.nombre}
                                                                                    </h4>
                                                                                    <div className="flex items-center gap-2 mt-1">
                                                                                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">
                                                                                            {archivo.subidoPor === 'admin' ? '🛡️ Admin' : '👤 Cliente'}
                                                                                        </span>
                                                                                        <span className="w-1 h-1 rounded-full bg-white/20" />
                                                                                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">
                                                                                            {formatSize(archivo.tamano)}
                                                                                        </span>
                                                                                        {!isImage && (
                                                                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                                                                        )}
                                                                                        {!isImage && (
                                                                                            <span className={`text-[8px] font-black text-${planColor}/80 uppercase tracking-widest`}>
                                                                                                {extension}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                );
                                                            })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-gray-700 mb-8 relative group overflow-hidden">
                            <FileText className="w-10 h-10 relative z-10" />
                            <div className="absolute inset-0 bg-rose-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h2 className="text-2xl font-black mb-3 font-[family-name:var(--font-orbitron)] uppercase tracking-tight text-white">Bóveda Vacía</h2>
                        <p className="text-gray-500 text-sm max-w-md mb-2 leading-relaxed font-medium">
                            No se han detectado activos digitales en el sistema. <br />
                            Los archivos aparecerán aquí una vez sean inyectados en los proyectos.
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Modal de Confirmación de Eliminación */}
            <AnimatePresence>
                {archivoToDelete && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeleting && setArchivoToDelete(null)}
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
                                        disabled={isDeleting}
                                        onClick={() => setArchivoToDelete(null)}
                                        className="py-4 rounded-xl border border-white/5 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                                    >
                                        Abortar
                                    </button>
                                    <button
                                        disabled={isDeleting}
                                        onClick={handleDeleteConfirm}
                                        className="py-4 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_-5px_rgba(239,68,68,0.3)] border border-red-400/20"
                                    >
                                        {isDeleting ? (
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
        </div>
    );
}
