'use client';

import React, { useState, useEffect } from 'react';
import { getAdmins, createAdmin, deleteAdmin } from '@/lib/actions';
import { useToast } from '@/app/providers/ToastProvider';
import {
    ShieldCheck,
    Plus,
    Loader2,
    Mail,
    Calendar,
    UserCircle,
    X,
    Sparkles,
    Search,
    ShieldAlert,
    AlertCircle,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLoading from '../loading';

export default function AdminsPage() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState<any>({});
    const [adminToDelete, setAdminToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState('');

    useEffect(() => {
        if (!adminToDelete) setConfirmEmail('');
    }, [adminToDelete]);

    useEffect(() => {
        loadAdmins();
    }, []);

    async function loadAdmins() {
        const data = await getAdmins();
        setAdmins(data);
        setLoading(false);
    }

    async function handleDeleteConfirm() {
        if (!adminToDelete) return;
        setIsDeleting(true);
        const result = await deleteAdmin(adminToDelete.id);

        if (result.error) {
            showToast(result.error, 'error');
        } else {
            showToast(`ACCESO REVOCADO PARA ${adminToDelete.nombre.toUpperCase()}`, 'info');
            loadAdmins();
        }

        setIsDeleting(false);
        setAdminToDelete(null);
    }

    const filteredAdmins = admins.filter(a =>
        a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <AdminLoading />;

    return (
        <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
            {/* Header Elite */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 text-[#FFD700] mb-2">
                        <ShieldAlert className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] font-[family-name:var(--font-orbitron)]">Control de Seguridad</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                        Nuestro <span className="bg-gradient-to-r from-[#FFD700] via-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">Equipo</span>
                    </h1>
                </motion.div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#a855f7] transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar administrador..."
                            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-[#a855f7]/50 focus:bg-white/[0.08] transition-all w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="group relative px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#a855f7] to-[#22d3ee] animate-gradient bg-[length:200%_auto]" />
                        <div className="relative flex items-center gap-2 text-black font-black uppercase tracking-widest text-[10px]">
                            <Plus className="w-5 h-5" />
                            <span className="hidden md:inline">Sincronizar Guardián</span>
                        </div>
                    </button>
                </div>
            </header>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredAdmins.map((admin, idx) => (
                        <motion.div
                            key={admin.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 to-cyan-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
                            <div className="relative bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] hover:border-white/20 transition-all duration-500 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#a855f7]/20 to-[#a855f7]/5 border border-white/5 flex items-center justify-center text-[#a855f7] group-hover:scale-110 transition-transform duration-500">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div className="px-3 py-1 bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-full text-[8px] font-black uppercase tracking-widest text-[#a855f7]">
                                        Full Access
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{admin.nombre}</h3>
                                <div className="flex items-center gap-2 text-gray-500 text-xs mb-8">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="truncate">{admin.email}</span>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Desde {new Date(admin.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={() => setAdminToDelete(admin)}
                                        className="w-8 h-8 rounded-lg bg-red-500/5 hover:bg-red-500 text-red-500/50 hover:text-white border border-red-500/10 hover:border-red-500 transition-all duration-300 flex items-center justify-center group/trash hover:scale-110 active:scale-90 shadow-lg"
                                        title="Revocar Acceso"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 group-hover/trash:rotate-12 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal de Registro Premium */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAdding(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0a0a0a]/80 border border-white/10 w-full max-w-lg rounded-[3rem] p-10 relative z-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#a855f7]/5 blur-[100px] -z-10" />

                            <button
                                onClick={() => setIsAdding(false)}
                                className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 group/close z-50"
                            >
                                <X className="w-6 h-6 group-hover/close:rotate-90 transition-transform duration-300" />
                            </button>

                            <div className="mb-10 text-center">
                                <span className="text-xs font-black text-[#a855f7] uppercase tracking-[0.5em] mb-2 block">Protocolo de Acceso</span>
                                <h2 className="text-3xl font-black font-[family-name:var(--font-orbitron)] mb-2 uppercase tracking-tighter">Vincular Guardián</h2>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Otorga las llaves de acceso administrativo al ecosistema.</p>
                            </div>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const newErrors: any = {};

                                if (!formData.get('nombre')) newErrors.nombre = 'Nombre requerido.';
                                if (!formData.get('email')) newErrors.email = 'Email necesario.';
                                if (!formData.get('password')) newErrors.password = 'Seguridad requerida.';

                                if (Object.keys(newErrors).length > 0) {
                                    setErrors(newErrors);
                                    return;
                                }

                                const result = await createAdmin(formData);

                                if (result?.error) {
                                    setErrors({ email: result.error });
                                    showToast(result.error, 'error');
                                    return;
                                }

                                showToast('NUEVO GUARDIÁN VINCULADO AL SISTEMA', 'success');
                                setIsAdding(false);
                                setErrors({});
                                loadAdmins();
                            }} className="space-y-6">
                                <PremiumInput name="nombre" placeholder="Nombre del Administrador" icon={UserCircle} error={errors.nombre} onFocus={() => setErrors({ ...errors, nombre: null })} />
                                <PremiumInput name="email" type="email" placeholder="Email Corporativo" icon={Mail} error={errors.email} onFocus={() => setErrors({ ...errors, email: null })} />
                                <PremiumInput name="password" type="password" placeholder="Contraseña de Seguridad" icon={ShieldCheck} error={errors.password} onFocus={() => setErrors({ ...errors, password: null })} />

                                <button
                                    type="submit"
                                    className="relative group w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-sm transition-all hover:scale-[1.02] active:scale-95 overflow-hidden shadow-[0_10px_30px_rgba(168,85,247,0.2)] mt-6"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#a855f7] via-[#8b5cf6] to-[#22d3ee] animate-gradient bg-[length:200%_auto]" />
                                    <span className="relative text-white">Activar Credenciales</span>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Confirmación de Eliminación */}
            <AnimatePresence>
                {adminToDelete && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeleting && setAdminToDelete(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0a0a0a] border border-red-500/20 w-full max-w-md rounded-[2.5rem] p-10 relative z-10 shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                                    <ShieldAlert className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black font-[family-name:var(--font-orbitron)] mb-3 uppercase tracking-tighter">Revocar Acceso</h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    ¿Estás seguro de retirar los privilegios de guardián a <span className="text-white font-bold">{adminToDelete.nombre}</span>? Esta acción es irreversible.
                                </p>

                                <div className="mb-8 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2 block">Escribe el email para confirmar:</label>
                                    <div className="relative group/confirm">
                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${confirmEmail === adminToDelete.email ? 'text-emerald-400' : 'text-gray-600'}`} />
                                        <input
                                            type="text"
                                            value={confirmEmail}
                                            onChange={(e) => setConfirmEmail(e.target.value)}
                                            placeholder={adminToDelete.email}
                                            className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-6 text-xs transition-all placeholder:text-gray-800 focus:outline-none ${confirmEmail === adminToDelete.email ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400' : 'border-white/10 focus:border-red-500/30'}`}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        disabled={isDeleting}
                                        onClick={() => setAdminToDelete(null)}
                                        className="py-4 rounded-xl border border-white/5 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        disabled={isDeleting || confirmEmail !== adminToDelete.email}
                                        onClick={handleDeleteConfirm}
                                        className={`py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl border ${confirmEmail === adminToDelete.email
                                            ? 'bg-red-500 text-white border-red-400/20 hover:bg-red-600 shadow-[0_10px_20px_-5px_rgba(239,68,68,0.3)]'
                                            : 'bg-gray-800/50 text-gray-600 border-white/5 grayscale cursor-not-allowed'
                                            }`}
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

function PremiumInput({ icon: Icon, placeholder, error, onFocus, ...props }: any) {
    return (
        <div className="relative group">
            <div className={`absolute -inset-0.5 rounded-2xl transition-opacity blur-[2px] ${error ? 'bg-red-500/40 opacity-100' : 'bg-[#a855f7]/10 opacity-0 group-focus-within:opacity-100'}`} />
            <div className="relative">
                <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? 'text-red-400' : 'text-gray-500 group-focus-within:text-[#a855f7]'}`} />
                <input
                    {...props}
                    placeholder={placeholder}
                    onFocus={onFocus}
                    className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none transition-all placeholder:text-gray-600 ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 group-hover:border-white/20 focus:border-[#a855f7]/50 focus:bg-white/[0.08]'}`}
                />
            </div>
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute -right-2 top-0 -translate-y-1/2 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl z-20 flex items-center gap-2 pointer-events-none"
                    >
                        <AlertCircle className="w-3 h-3" />
                        {error}
                        <div className="absolute bottom-0 right-4 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-red-500" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
