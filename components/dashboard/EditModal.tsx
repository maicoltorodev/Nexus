'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, X, Loader2, Save, ImageIcon, Plus, Trash2, Upload, Instagram, Facebook, Check, AlertCircle, Palette } from 'lucide-react';

interface EditModalProps {
    editingSection: string | null;
    onClose: () => void;
    sectionData: any;
    setSectionData: (data: any) => void;
    onSave: () => void;
    isSaving: boolean;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, context: string, index?: number) => void;
    isUploading: string | null;
}

export default function EditModal({
    editingSection,
    onClose,
    sectionData,
    setSectionData,
    onSave,
    isSaving,
    onFileUpload,
    isUploading
}: EditModalProps) {
    const [isChecking, setIsChecking] = useState(false);
    const [availability, setAvailability] = useState<{ available: boolean; error?: string } | null>(null);

    useEffect(() => {
        if (editingSection !== 'domains') return;

        const domain = sectionData.dominioUno;
        if (!domain || domain.length < 3) {
            setAvailability(null);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsChecking(true);
            setAvailability(null);
            try {
                const { checkDomainAvailability } = await import('@/lib/domain-check');
                const result = await checkDomainAvailability(domain);
                setAvailability(result);
            } catch (e) {
                console.error(e);
            } finally {
                setIsChecking(false);
            }
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [sectionData.dominioUno, editingSection]);
    return (
        <AnimatePresence>
            {editingSection && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative"
                    >
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none" />

                        <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
                            <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <Pencil className="w-4 h-4 text-[#FFD700]" />
                                Editar {(() => {
                                    switch (editingSection) {
                                        case 'identity': return 'Identidad';
                                        case 'domains': return 'Dominios';
                                        case 'contact': return 'Contacto';
                                        case 'social': return 'Redes Sociales';
                                        case 'services': return 'Servicios';
                                        case 'branding': return 'Marca Visual';
                                        case 'gallery': return 'Galería de Fotos';
                                        default: return 'Sección';
                                    }
                                })()}
                            </h3>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar relative z-10">
                            {editingSection === 'identity' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre Comercial</label>
                                        <input
                                            type="text"
                                            value={sectionData.nombreComercial || ''}
                                            onChange={(e) => setSectionData({ ...sectionData, nombreComercial: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#FFD700] outline-none transition-colors"
                                            placeholder="Tu Empresa"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slogan (Opcional)</label>
                                        <input
                                            type="text"
                                            value={sectionData.slogan || ''}
                                            onChange={(e) => setSectionData({ ...sectionData, slogan: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#FFD700] outline-none transition-colors"
                                            placeholder="Ej: Innovación a tu alcance"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción</label>
                                        <textarea
                                            value={sectionData.descripcion || ''}
                                            onChange={(e) => setSectionData({ ...sectionData, descripcion: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#FFD700] outline-none min-h-[120px] resize-none transition-colors"
                                            placeholder="Describe tu negocio..."
                                        />
                                    </div>
                                </>
                            )}

                            {editingSection === 'domains' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dominio</label>
                                        <div className={`flex items-center gap-2 bg-white/5 border rounded-xl px-4 focus-within:border-[#FFD700] transition-colors ${availability?.available === false ? 'border-red-500/50' : availability?.available === true ? 'border-emerald-500/50' : 'border-white/10'}`}>
                                            <span className="text-gray-500 font-bold">www.</span>
                                            <input
                                                type="text"
                                                value={sectionData.dominioUno || ''}
                                                onChange={(e) => setSectionData({ ...sectionData, dominioUno: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                                className="flex-1 bg-transparent p-4 text-white outline-none pl-1"
                                                placeholder="ejemplo"
                                            />
                                            <span className="text-gray-500 font-bold">.com</span>
                                            {isChecking && <Loader2 className="w-4 h-4 text-[#FFD700] animate-spin" />}
                                            {!isChecking && availability?.available === true && <Check className="w-4 h-4 text-emerald-500" />}
                                            {!isChecking && availability?.available === false && <X className="w-4 h-4 text-red-500" />}
                                        </div>
                                        {/* Status Message */}
                                        <div className="h-6">
                                            {isChecking ? (
                                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                                    <Loader2 className="w-3 h-3 animate-spin" /> Verificando disponibilidad...
                                                </p>
                                            ) : availability ? (
                                                availability.available ? (
                                                    <p className="text-xs text-emerald-400 font-bold flex items-center gap-2">
                                                        <Check className="w-3 h-3" /> ¡Dominio disponible!
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-red-400 font-bold flex items-center gap-2">
                                                        <AlertCircle className="w-3 h-3" /> {availability.error || 'Este dominio no está disponible.'}
                                                    </p>
                                                )
                                            ) : null}
                                        </div>
                                    </div>
                                </>
                            )}

                            {editingSection === 'branding' && (
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Logo de la Empresa</label>
                                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors relative group mb-6">
                                        {sectionData.logo ? (
                                            <div className="relative w-full h-32 flex items-center justify-center">
                                                <img src={sectionData.logo} className="max-w-full max-h-full object-contain" />
                                                <button
                                                    onClick={() => setSectionData({ ...sectionData, logo: null })}
                                                    className="absolute top-0 right-0 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors text-white z-20"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-400">
                                                <ImageIcon className="w-8 h-8 mb-2" />
                                                <span className="text-xs font-bold">Subir Logo</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={(e) => onFileUpload(e, 'logo')}
                                            disabled={isUploading === 'logo'}
                                        />
                                        {isUploading === 'logo' && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30 rounded-xl">
                                                <Loader2 className="w-6 h-6 animate-spin text-[#FFD700]" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                                <Palette className="w-4 h-4 text-[#FFD700]" /> Paleta de Colores
                                            </label>
                                            <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                                                Tip: Usa buen contraste
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-gray-600 uppercase">Acento</p>
                                                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                                                    <input
                                                        type="color"
                                                        value={sectionData.primaryColor || '#FFFFFF'}
                                                        onChange={(e) => setSectionData({ ...sectionData, primaryColor: e.target.value })}
                                                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={sectionData.primaryColor || ''}
                                                        onChange={(e) => setSectionData({ ...sectionData, primaryColor: e.target.value })}
                                                        placeholder="SIN ELEGIR"
                                                        className="bg-transparent text-white font-mono text-[10px] outline-none w-full placeholder:text-gray-600"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-gray-600 uppercase">Fondo</p>
                                                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                                                    <input
                                                        type="color"
                                                        value={sectionData.secondaryColor || '#000000'}
                                                        onChange={(e) => setSectionData({ ...sectionData, secondaryColor: e.target.value })}
                                                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={sectionData.secondaryColor || ''}
                                                        onChange={(e) => setSectionData({ ...sectionData, secondaryColor: e.target.value })}
                                                        placeholder="SIN ELEGIR"
                                                        className="bg-transparent text-white font-mono text-[10px] outline-none w-full placeholder:text-gray-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {editingSection === 'gallery' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {sectionData.gallery?.map((img: string, i: number) => (
                                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                                <img src={img} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        onClick={() => {
                                                            const updated = sectionData.gallery.filter((_: any, idx: number) => idx !== i);
                                                            setSectionData({ ...sectionData, gallery: updated });
                                                        }}
                                                        className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {(!sectionData.gallery || sectionData.gallery.length < 2) && (
                                            <div className="aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-xl hover:bg-white/10 transition-colors relative flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-white cursor-pointer group">
                                                <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Añadir Foto</span>

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => onFileUpload(e, 'gallery')}
                                                    disabled={isUploading === 'gallery'}
                                                />
                                                {isUploading === 'gallery' && (
                                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 rounded-xl">
                                                        <Loader2 className="w-6 h-6 animate-spin text-[#FFD700]" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 text-center">
                                        Sube exactamente 2 fotos de alta calidad para tu web.
                                    </p>
                                </div>
                            )}

                            {editingSection === 'services' && (

                                <div className="space-y-6">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => {
                                                const current = sectionData.services || [];
                                                if (current.length >= 6) return;
                                                setSectionData({ ...sectionData, services: [...current, { id: Math.random().toString(36).substring(7), title: '', description: '' }] });
                                            }}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-2 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" /> Agregar Servicio
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {sectionData.services?.map((s: any, i: number) => (
                                            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 group hover:border-white/20 transition-colors">
                                                <div className="flex justify-between items-start gap-4 mb-3">
                                                    <span className="text-[10px] font-black text-gray-600 bg-black/20 px-2 py-1 rounded">#{i + 1}</span>
                                                    <button
                                                        onClick={() => {
                                                            const updated = sectionData.services.filter((_: any, idx: number) => idx !== i);
                                                            setSectionData({ ...sectionData, services: updated });
                                                        }}
                                                        className="text-gray-600 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="relative w-full h-24 bg-black/20 rounded-lg overflow-hidden border border-white/10 group/img">
                                                        {s.image ? (
                                                            <img src={s.image} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-gray-500">
                                                                <ImageIcon className="w-6 h-6 opacity-50" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
                                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                                                                <Upload className="w-3 h-3" /> Cambiar Imagen
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                            onChange={(e) => onFileUpload(e, 'service', i)}
                                                            disabled={isUploading === `service-${i}`}
                                                        />
                                                        {isUploading === `service-${i}` && (
                                                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                                                                <Loader2 className="w-5 h-5 animate-spin text-[#FFD700]" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <input
                                                        type="text"
                                                        value={s.title || ''}
                                                        onChange={(e) => {
                                                            const updated = [...sectionData.services];
                                                            updated[i] = { ...updated[i], title: e.target.value };
                                                            setSectionData({ ...sectionData, services: updated });
                                                        }}
                                                        className="w-full bg-black/20 border-b border-white/10 focus:border-[#FFD700] text-sm text-white font-bold px-2 py-1 outline-none transition-colors"
                                                        placeholder="Nombre del Servicio"
                                                    />
                                                    <textarea
                                                        value={s.description || ''}
                                                        onChange={(e) => {
                                                            const updated = [...sectionData.services];
                                                            updated[i] = { ...updated[i], description: e.target.value };
                                                            setSectionData({ ...sectionData, services: updated });
                                                        }}
                                                        className="w-full bg-black/20 border-b border-white/10 focus:border-[#FFD700] text-xs text-gray-400 px-2 py-1 outline-none transition-colors resize-none min-h-[60px]"
                                                        placeholder="Descripción corta..."
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {(!sectionData.services || sectionData.services.length === 0) && (
                                            <div className="text-center py-8 text-gray-500 text-xs">No hay servicios registrados.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {editingSection === 'contact' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Teléfono</label>
                                        <input
                                            type="text"
                                            value={sectionData.contactoTel || ''}
                                            onChange={(e) => setSectionData({ ...sectionData, contactoTel: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#FFD700] outline-none transition-colors"
                                            placeholder="+57 300..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                                        <input
                                            type="email"
                                            value={sectionData.contactoEmail || ''}
                                            onChange={(e) => setSectionData({ ...sectionData, contactoEmail: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#FFD700] outline-none transition-colors"
                                            placeholder="contacto@empresa.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección Física</label>
                                        <input
                                            type="text"
                                            value={sectionData.direccion || ''}
                                            onChange={(e) => setSectionData({ ...sectionData, direccion: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#FFD700] outline-none transition-colors"
                                            placeholder="Calle 123 # 45..."
                                        />
                                    </div>
                                </>
                            )}

                            {editingSection === 'social' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Instagram className="w-4 h-4 text-[#E1306C]" /> Instagram (Usuario)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">@</span>
                                            <input
                                                type="text"
                                                value={sectionData.instagram || ''}
                                                onChange={(e) => setSectionData({ ...sectionData, instagram: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-10 text-white focus:border-[#E1306C] outline-none transition-colors"
                                                placeholder="usuario"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Facebook className="w-4 h-4 text-[#1877F2]" /> Facebook (Link Completo)</label>
                                        <input
                                            type="text"
                                            value={sectionData.facebook || ''}
                                            onChange={(e) => setSectionData({ ...sectionData, facebook: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#1877F2] outline-none transition-colors"
                                            placeholder="https://facebook.com/..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg> TikTok (Usuario)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">@</span>
                                            <input
                                                type="text"
                                                value={sectionData.tiktok || ''}
                                                onChange={(e) => setSectionData({ ...sectionData, tiktok: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-10 text-white focus:border-white outline-none transition-colors"
                                                placeholder="usuario"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><X className="w-4 h-4 text-white" /> X / Twitter (Usuario)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">@</span>
                                            <input
                                                type="text"
                                                value={sectionData.x || ''}
                                                onChange={(e) => setSectionData({ ...sectionData, x: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-10 text-white focus:border-white outline-none transition-colors"
                                                placeholder="usuario"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-6 border-t border-white/10 flex gap-3 justify-end bg-black/50 relative z-10">
                            <button
                                onClick={onClose}
                                className="px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={onSave}
                                disabled={isSaving || (editingSection === 'domains' && (isChecking || availability?.available !== true))}
                                className="px-8 py-4 rounded-xl bg-[#FFD700] text-black text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)] disabled:opacity-50 disabled:scale-100 flex items-center gap-2 disabled:cursor-not-allowed"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Guardar Cambios
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
