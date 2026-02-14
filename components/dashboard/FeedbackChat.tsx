'use client';

import { MessageSquare, ExternalLink, Loader2, ImageIcon, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackChatProps {
    proyecto: any;
    feedbackNote: string;
    setFeedbackNote: (note: string) => void;
    handleSendFeedback: () => void;
    sendingFeedback: boolean;
    feedbackImages: string[];
    setFeedbackImages: (images: string[]) => void;
    handleFeedbackImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isUploadingFeedback: boolean;
}

export default function FeedbackChat({
    proyecto,
    feedbackNote,
    setFeedbackNote,
    handleSendFeedback,
    sendingFeedback,
    feedbackImages,
    setFeedbackImages,
    handleFeedbackImageUpload,
    isUploadingFeedback
}: FeedbackChatProps) {
    return (
        <div className="col-span-1 lg:col-span-3 mt-24 max-w-4xl mx-auto w-full">
            <div className="relative h-[500px] md:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg_at_50%_50%,#facc15_0deg,#06b6d4_120deg,#9333ea_240deg,#facc15_360deg)] animate-[spin_4s_linear_infinite]" />
                <div className="absolute inset-[1px] bg-[#0a0a0a] rounded-[2rem] flex flex-col overflow-hidden">
                    {/* Header del Chat */}
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700]">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-white">Centro de Mensajes</h3>
                                <p className="text-xs text-gray-500">Comunicación directa con el equipo Nexus</p>
                            </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Soporte Activo
                        </div>
                    </div>

                    {/* Area de Mensajes */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {proyecto.notas && proyecto.notas.length > 0 ? (
                            proyecto.notas.map((nota: any) => (
                                <div key={nota.id} className={`flex ${nota.autor === 'cliente' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] lg:max-w-[70%] p-5 rounded-3xl ${nota.autor === 'cliente'
                                        ? 'bg-[#FFD700]/10 border border-[#FFD700]/20 text-white rounded-tr-none'
                                        : 'bg-white/10 border border-white/10 text-gray-200 rounded-tl-none'
                                        }`}>
                                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${nota.autor === 'cliente' ? 'text-[#FFD700]' : 'text-blue-400'}`}>
                                                {nota.autor === 'cliente' ? 'Tú' : 'Nexus Dev'}
                                            </span>
                                            <span className="text-[10px] text-gray-600 font-medium">
                                                {new Date(nota.createdAt).toLocaleString('es-CO', {
                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{nota.contenido}</p>
                                        {nota.imagenes && Array.isArray(nota.imagenes) && nota.imagenes.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
                                                {nota.imagenes.map((img: string, idx: number) => (
                                                    <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-colors group/img">
                                                        <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                                            <ExternalLink className="w-4 h-4 text-white" />
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-6 opacity-50">
                                <MessageSquare className="w-16 h-16" />
                                <div className="text-center">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Comienza la conversación</p>
                                    <p className="text-xs text-gray-600 max-w-xs">Envía tus correcciones, dudas o comentarios. Tu feedback es vital para nosotros.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Area de Input */}
                    <div className="p-6 bg-[#0a0a0a] border-t border-white/5">
                        <div className="relative">
                            <textarea
                                value={feedbackNote}
                                onChange={(e) => setFeedbackNote(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-32 text-white placeholder:text-gray-600 focus:border-[#FFD700]/50 focus:bg-white/[0.07] outline-none min-h-[60px] max-h-[150px] resize-none transition-all"
                                rows={2}
                            />

                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                {/* Image Upload Trigger */}
                                <label className={`w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors border border-white/5 ${isUploadingFeedback ? 'opacity-50 pointer-events-none' : ''}`} title="Adjuntar Imagen">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFeedbackImageUpload}
                                        disabled={isUploadingFeedback}
                                    />
                                    {isUploadingFeedback ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : <ImageIcon className="w-4 h-4 text-gray-400" />}
                                </label>

                                <button
                                    onClick={handleSendFeedback}
                                    disabled={sendingFeedback || (!feedbackNote.trim() && feedbackImages.length === 0)}
                                    className="w-10 h-10 rounded-xl bg-[#FFD700] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                                >
                                    {sendingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Image Previews */}
                        <AnimatePresence>
                            {feedbackImages.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="flex flex-wrap gap-3 overflow-hidden"
                                >
                                    {feedbackImages.map((img, idx) => (
                                        <div key={idx} className="relative group/preview w-16 h-16 rounded-xl overflow-hidden border border-white/20">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setFeedbackImages(feedbackImages.filter((_, i) => i !== idx))}
                                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
