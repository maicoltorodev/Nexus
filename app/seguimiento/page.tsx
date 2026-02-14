'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getProyectoByCedula, uploadArchivo, updateProyectoNotas, updateProyectoClientData } from '@/lib/actions';
import { Search, Code2, Paintbrush, Hammer, MonitorPlay, Boxes, LayoutTemplate, BriefcaseBusiness, Loader2, Calendar, CheckCircle2, FileText, ChevronRight, Layout, Upload, Sparkles, Rocket, Zap, Smartphone, X, AlertCircle, Lock, ShieldBan, ExternalLink, Link2, Plus, Trash2, Image as ImageIcon, GripVertical, Check, Globe, Facebook, Instagram, Twitter, MapPin, MessageSquare, Send, Mail, Pencil, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NEXUS_PLANS_ARRAY } from '@/lib/constants';
import EditModal from '@/components/dashboard/EditModal';
import ProjectTimeline from '@/components/dashboard/ProjectTimeline';
import FeedbackChat from '@/components/dashboard/FeedbackChat';

const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB
const MAX_PROJECT_SIZE = 50 * 1024 * 1024; // 50MB
const TOTAL_STEPS = 10;

export default function SeguimientoPage() {
    const [cedula, setCedula] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [error, setError] = useState('');

    // Wizard State
    const [wizardStep, setWizardStep] = useState(0);
    const [wizardData, setWizardData] = useState<any>({});
    const [savingStep, setSavingStep] = useState(false);
    const [feedbackNote, setFeedbackNote] = useState('');
    const [sendingFeedback, setSendingFeedback] = useState(false);
    const [feedbackImages, setFeedbackImages] = useState<string[]>([]);
    const [isUploadingFeedback, setIsUploadingFeedback] = useState(false);

    // Edit Section Logic
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [sectionData, setSectionData] = useState<any>({});
    const [isSavingSection, setIsSavingSection] = useState(false);
    const [isUploadingSectionFile, setIsUploadingSectionFile] = useState<string | null>(null); // 'logo', 'service-index', etc.

    const isProjectReady = (onboardingData: any) => {
        if (!onboardingData) return false;

        // Al menos un servicio y todos deben estar completos
        const hasValidServices = onboardingData.services?.length > 0 &&
            onboardingData.services.every((s: any) => !!s.title && !!s.description && !!s.image);

        return !!onboardingData.dominioUno &&
            !!onboardingData.logo &&
            !!onboardingData.descripcion &&
            !!onboardingData.nombreComercial &&
            !!onboardingData.primaryColor &&
            onboardingData.gallery?.length === 2 &&
            !!onboardingData.contactoTel &&
            !!onboardingData.contactoEmail &&
            hasValidServices;
    };

    const handleSectionFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, context: string, index?: number) => {
        const file = e.target.files?.[0];
        if (!file || !selectedProject) return;

        // Validar tamaño (4.5MB)
        if (file.size > MAX_FILE_SIZE) {
            alert('El archivo es demasiado grande. Máximo 4.5MB.');
            return;
        }

        const uploadId = context + (index !== undefined ? `-${index}` : '');
        setIsUploadingSectionFile(uploadId);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('proyectoId', selectedProject.id);
        formData.append('subidoPor', 'cliente');

        try {
            const res = await uploadArchivo(formData);
            if (res.success && res.url) {
                if (context === 'logo') {
                    setSectionData({ ...sectionData, logo: res.url });
                } else if (context === 'service' && index !== undefined) {
                    const services = [...(sectionData.services || [])];
                    services[index] = { ...services[index], image: res.url };
                    setSectionData({ ...sectionData, services });
                } else if (context === 'gallery') {
                    setSectionData({ ...sectionData, gallery: [...(sectionData.gallery || []), res.url] });
                }
            } else {
                alert('Error al subir: ' + (res.error || 'Desconocido'));
            }
        } catch (err) {
            console.error(err);
            alert('Error al subir el archivo');
        } finally {
            setIsUploadingSectionFile(null);
        }
    };

    const handleEditClick = (section: string, data: any) => {
        setSectionData(data);
        setEditingSection(section);
    };

    const handleSaveSection = async () => {
        if (!selectedProject) return;
        setIsSavingSection(true);
        // Merge current data with new section data
        const currentOnboarding = selectedProject.onboardingData || {};
        const updatedOnboarding = { ...currentOnboarding, ...sectionData };

        // Solo si no se ha completado antes y ahora sí está listo
        if (!updatedOnboarding.onboardingCompletedAt && isProjectReady(updatedOnboarding)) {
            updatedOnboarding.onboardingCompletedAt = new Date().toISOString();
        }

        const res = await updateProyectoClientData(selectedProject.id, updatedOnboarding);

        if (res.success) {
            setSelectedProject({ ...selectedProject, onboardingData: updatedOnboarding }); // Optimistic update
            setEditingSection(null);
        } else {
            alert('Error al guardar los cambios.');
        }
        setIsSavingSection(false);
    };



    const handleFeedbackImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0 || !selectedProject) return;

        setIsUploadingFeedback(true);
        const newImages: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.size > MAX_FILE_SIZE) {
                    alert(`El archivo ${file.name} es demasiado grande (Máx 4.5MB)`);
                    continue;
                }

                const formData = new FormData();
                formData.append('file', file);
                formData.append('proyectoId', selectedProject.id);
                formData.append('subidoPor', 'cliente');

                const res = await uploadArchivo(formData);
                if (res.success && res.url) {
                    newImages.push(res.url);
                }
            }
            setFeedbackImages([...feedbackImages, ...newImages]);
        } catch (error) {
            console.error(error);
            alert('Error al subir imágenes.');
        } finally {
            setIsUploadingFeedback(false);
        }
    };

    const handleSendFeedback = async () => {
        if ((!feedbackNote.trim() && feedbackImages.length === 0) || !selectedProject) return;
        setSendingFeedback(true);
        try {
            await updateProyectoNotas(selectedProject.id, feedbackNote, feedbackImages);
            setFeedbackNote('');
            setFeedbackImages([]);
            alert('¡Notas enviadas con éxito! El equipo las revisará pronto.');
        } catch (e) {
            console.error(e);
            alert('Error al enviar las notas.');
        } finally {
            setSendingFeedback(false);
        }
    };

    // Initial Load Params (Security Policy: Strict Manual Input)
    useEffect(() => { }, []);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!cedula) return;

        setLoading(true);
        setError('');
        setData(null);
        setSelectedProject(null);

        try {
            const result = await getProyectoByCedula(cedula);
            if (result) {
                const visibleProjects = result.proyectos.filter((p: any) => p.visibilidad !== false);
                const filteredResult = { ...result, proyectos: visibleProjects };

                if (visibleProjects.length > 0) {
                    setData(filteredResult);
                    if (visibleProjects.length === 1) {
                        const proj = visibleProjects[0];
                        setSelectedProject(proj);
                        setWizardStep(proj.onboardingStep || 0);
                        setWizardData(proj.onboardingData || {});
                    }
                } else {
                    setError('No se encontraron proyectos activos para esta cédula.');
                }
            } else {
                setError('No se encontró ningún proyecto asociado a esta cédula.');
            }
        } catch (err) {
            setError('Ocurrió un error al buscar. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    }

    // Polling Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (data && cedula) {
            interval = setInterval(async () => {
                const result = await getProyectoByCedula(cedula);
                if (result) {
                    const visibleProjects = result.proyectos.filter((p: any) => p.visibilidad !== false);
                    if (visibleProjects.length === 0) {
                        setData(null);
                        setSelectedProject(null);
                        setError('No hay proyectos activos visibles por el momento.');
                        return;
                    }

                    const filteredResult = { ...result, proyectos: visibleProjects };
                    setData(filteredResult);

                    if (selectedProject) {
                        const updatedProj = visibleProjects.find((p: any) => p.id === selectedProject.id);
                        if (updatedProj) {
                            setSelectedProject((prev: any) => ({ ...prev, ...updatedProj, onboardingStep: prev.onboardingStep, onboardingData: prev.onboardingData }));
                        } else {
                            setSelectedProject(null);
                        }
                    }
                }
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [data, cedula, selectedProject]);


    // Wizard Logic
    const handleNextStep = async (newData: any = {}, nextStepOverride?: number) => {
        if (!selectedProject) return;
        const project = selectedProject;

        setSavingStep(true);
        const nextStep = nextStepOverride !== undefined ? nextStepOverride : wizardStep + 1;

        const mergedData = { ...wizardData, ...newData };

        // Solo marcamos como completado si llegamos al final Y todo está listo
        if (!mergedData.onboardingCompletedAt && isProjectReady(mergedData) && nextStep === TOTAL_STEPS) {
            mergedData.onboardingCompletedAt = new Date().toISOString();
        }

        try {
            const { updateProyectoOnboarding } = await import('@/lib/actions');
            await updateProyectoOnboarding(project.id, nextStep, mergedData);

            setWizardStep(nextStep);
            setWizardData(mergedData);
            setSelectedProject((prev: any) => ({ ...prev, onboardingStep: nextStep, onboardingData: mergedData }));
        } catch (e) {
            console.error("Failed to save wizard progress", e);
        } finally {
            setSavingStep(false);
        }
    };

    const handlePrevStep = async (currentData: any) => {
        if (wizardStep > 0) {
            await handleNextStep(currentData, wizardStep - 1);
        }
    };

    const handleSelectProject = (proj: any) => {
        setSelectedProject(proj);
        setWizardStep(proj.onboardingStep || 0);
        setWizardData(proj.onboardingData || {});
    };

    const proyecto = selectedProject;
    const isOnboardingComplete = wizardStep >= TOTAL_STEPS;
    const projectPlan = NEXUS_PLANS_ARRAY[0];

    // --- VIEW: LOGIN ---
    if (!data) {
        return (
            <main className="bg-[#050505] min-h-screen text-white flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <Navbar />
                <section className="flex-1 flex flex-col items-center justify-center p-4 pt-48 relative z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FFD700] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full max-w-md"
                    >
                        <div className="text-center mb-12">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
                            >
                                <Lock className="w-3 h-3 text-[#FFD700]" />
                                <span className="text-[10px] font-black tracking-[0.2em] text-gray-300 uppercase">Acceso Cliente</span>
                            </motion.div>

                            <div className="relative flex items-center justify-center gap-6 mb-8">
                                <motion.img
                                    src="/X.webp"
                                    alt="Nexus Logo"
                                    className="w-12 h-12 md:w-16 md:h-16 object-contain"
                                    animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight text-center">
                                    Portal De <span className="bg-gradient-to-r from-[#FFD700] via-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">Clientes</span>
                                </h1>
                                <motion.img
                                    src="/logo-inzidium.webp"
                                    alt="Inzidium Logo"
                                    className="w-12 h-12 md:w-16 md:h-16 object-contain"
                                    animate={{ y: [0, -15, 0], rotate: [0, -5, 5, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                                />
                            </div>
                            <p className="text-gray-400 text-lg">Tu espacio personal, en tiempo real.</p>
                        </div>

                        <motion.form
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            onSubmit={handleSearch}
                            className="space-y-4"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700]/20 to-purple-600/20 rounded-3xl blur transition duration-500 group-hover:duration-200 group-hover:opacity-100 opacity-50" />
                                <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-2 flex items-center transition-all focus-within:border-[#FFD700]/50 focus-within:shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <Search className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={cedula}
                                        onChange={(e) => setCedula(e.target.value)}
                                        placeholder="Tu Número de Identificación"
                                        className="w-full bg-transparent border-none outline-none text-white font-bold h-14 px-4 text-lg placeholder:text-gray-600 placeholder:font-medium placeholder:text-base"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !cedula}
                                        className="w-14 h-14 bg-[#FFD700] rounded-2xl flex items-center justify-center text-black hover:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-6 h-6" />}
                                    </button>
                                </div>
                            </div>
                        </motion.form>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4"
                            >
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-red-400">Acceso Denegado</p>
                                    <p className="text-xs text-red-300/80 mt-1">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </section>
                <Footer />
            </main>
        );
    }

    // --- VIEW: PROJECT SELECTION ---
    if (!selectedProject && data.proyectos && data.proyectos.length > 0) {
        return (
            <main className="bg-[#050505] min-h-screen text-white flex flex-col relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <Navbar />
                <section className="flex-1 flex flex-col items-center justify-center p-4 pt-48 relative z-10">
                    <div className="w-full max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-black uppercase tracking-widest text-[#FFD700] mb-4">Hola, {data.nombre.split(' ')[0]}</h2>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">¿Qué proyecto <br />revisamos hoy?</h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data.proyectos.map((proj: any, i: number) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={proj.id}
                                    onClick={() => handleSelectProject(proj)}
                                    className="group relative bg-[#0a0a0a] border border-white/5 hover:border-[#FFD700]/50 rounded-[2.5rem] p-8 cursor-pointer transition-all hover:-translate-y-2 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-12">
                                            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-[#FFD700] transition-colors duration-500">
                                                <Rocket className="w-8 h-8 text-gray-400 group-hover:text-black transition-colors" />
                                            </div>
                                            <div className={`px-4 py-2 rounded-full border ${proj.onboardingStep >= TOTAL_STEPS ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-[#FFD700]/10 border-[#FFD700]/20 text-[#FFD700]'} text-[10px] font-black uppercase tracking-widest`}>
                                                {proj.onboardingStep >= TOTAL_STEPS ? 'Activo' : 'Inicio'}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-white mb-2 leading-tight">{proj.nombre}</h3>
                                        <p className="text-sm text-gray-500 font-medium mb-6">Paquete {proj.plan}</p>

                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 group-hover:text-white transition-colors">
                                            <span>Ver Panel</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
                <Footer />
            </main>
        );
    }

    // --- VIEW: ONBOARDING WIZARD ---
    if (!isOnboardingComplete && proyecto) {
        return (
            <main className="bg-[#050505] min-h-screen text-white flex flex-col relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <Navbar />
                <section className="flex-1 flex flex-col items-center justify-center p-4 pt-48 pb-20 relative z-10">
                    <div className="w-full max-w-4xl">
                        <div className="flex items-end justify-between mb-12 px-2">
                            <div>
                                <h1 className="text-4xl font-black text-white mb-2">Configuración</h1>
                                <p className="text-gray-500 font-medium">Paso {wizardStep + 1} de {TOTAL_STEPS}</p>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-xs font-black uppercase tracking-widest text-[#FFD700] mb-2">{proyecto.nombre}</p>
                                <div className="flex gap-1.5">
                                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                                        <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= wizardStep ? 'bg-[#FFD700]' : 'bg-white/10'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 md:p-16 relative shadow-2xl">
                            <WizardStep
                                step={wizardStep}
                                data={wizardData}
                                onNext={handleNextStep}
                                onBack={handlePrevStep}
                                loading={savingStep}
                                clientName={data.nombre}
                                projectId={proyecto?.id}
                            />
                        </div>
                    </div>
                </section>
                <Footer />
            </main>
        );
    }

    // --- VIEW: DASHBOARD (MAIN) ---
    // Calculate final stats
    const totalServices = proyecto.onboardingData?.services?.length || 0;
    const hasLogo = !!proyecto.onboardingData?.logo;

    const isMissingInfo = !isProjectReady(proyecto.onboardingData);


    return (
        <main className="bg-[#050505] min-h-screen text-white relative selection:bg-[#FFD700] selection:text-black">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none fixed"></div>

            {/* Dynamic Background */}
            <div className="fixed top-0 left-0 w-full h-[800px] bg-gradient-to-b from-blue-900/10 via-purple-900/5 to-transparent pointer-events-none" />
            <div className="fixed -top-[200px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#FFD700] opacity-[0.02] blur-[150px] rounded-full pointer-events-none" />

            <Navbar />

            <section className="pt-32 md:pt-48 pb-12 md:pb-24 px-4 relative z-10 w-full max-w-[1600px] mx-auto">

                {/* HERO SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center mb-20">
                    <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`inline-flex items-center gap-3 px-5 py-2 rounded-full border backdrop-blur-md mb-8 ${proyecto.estado === 'completado' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-[#FFD700]/20 bg-[#FFD700]/5'}`}
                        >
                            {proyecto.estado === 'completado' ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em]">Proyecto Finalizado</span>
                                </>
                            ) : (
                                <>
                                    <Hammer className="w-4 h-4 text-[#FFD700] animate-bounce" />
                                    <span className="text-xs font-black text-[#FFD700] uppercase tracking-[0.2em]">Construyendo Tu Visión</span>
                                </>
                            )}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.9] pr-4"
                        >
                            {proyecto.estado === 'completado' ? (
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 pr-2">Tu Web Está Lista</span>
                            ) : (
                                <div>
                                    Tu Web En <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-cyan-400 to-purple-500 animate-gradient bg-[length:200%_auto] pr-2">Desarrollo</span>
                                </div>
                            )}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-gray-400 font-medium max-w-xl leading-relaxed mb-8"
                        >
                            {proyecto.estado === 'completado' ? (
                                <>¡Felicidades <span className="text-white">{data.nombre.split(' ')[0]}</span>! Hemos completado tu proyecto. Explora tu nueva web y haznos saber qué opinas.</>
                            ) : (
                                <>Hola <span className="text-white">{data.nombre.split(' ')[0]}</span>. Estamos trabajando arduamente en tu proyecto. Sigue el progreso paso a paso aquí abajo.</>
                            )}
                        </motion.p>


                    </div>

                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        {/* Mantenemos el Countdown Timer existente para consistencia */}
                        <CountdownTimer
                            targetDate={
                                proyecto.onboardingData?.onboardingCompletedAt
                                    ? new Date(new Date(proyecto.onboardingData.onboardingCompletedAt).getTime() + 48 * 60 * 60 * 1000)
                                    : null
                            }
                            isCompleted={proyecto.estado === 'completado'}
                        />
                    </div>
                </div>

                {selectedProject && <ProjectTimeline proyecto={selectedProject} />}

                {/* GLOBAL LINK BUTTON OR EDIT WARNING (CENTERED) */}
                <div className="flex justify-center mb-16 relative z-30 px-4">
                    {proyecto.estado === 'completado' ? (
                        proyecto.link && proyecto.link !== 'Próximamente' ? (
                            <motion.a
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                href={proyecto.link.startsWith('http') ? proyecto.link : `https://${proyecto.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]"
                            >
                                <Globe className="w-5 h-5 shrink-0" />
                                <span className="truncate">
                                    {proyecto.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                </span>
                                <ExternalLink className="w-4 h-4 opacity-50 shrink-0 ml-1" />
                            </motion.a>
                        ) : (
                            <div className="inline-flex items-center gap-3 bg-white/5 text-gray-400 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm border border-white/10 cursor-not-allowed">
                                <Loader2 className="w-5 h-5 animate-spin text-[#FFD700]" />
                                <span className="text-gray-300">Generando Enlace del Sitio<span className="animate-pulse">...</span></span>
                            </div>
                        )
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative group overflow-hidden bg-[#0A0A0A] border border-[#FFD700]/20 px-8 py-5 rounded-3xl flex items-center gap-5 max-w-lg mx-auto backdrop-blur-xl hover:border-[#FFD700]/40 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] transition-all cursor-default"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center text-[#FFD700] shrink-0 relative z-10">
                                <AlertCircle className="w-5 h-5" />
                            </div>

                            <div className="relative z-10 text-left flex-1">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#FFD700] font-black mb-1">Nota Importante</p>
                                <p className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors leading-snug">
                                    Recuerda que puedes editar la información enviada si necesitas realizar alguna actualización.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>


                {/* CONTENT GRID OR COMPLETED VIEW */}
                {proyecto.estado === 'completado' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12 py-4 md:py-12"
                    >
                        <div className="bg-[#0a0a0a] border border-emerald-500/20 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden mb-8 md:mb-12">
                            <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5 pointer-events-none" />

                            <div className="relative z-10 space-y-6 md:space-y-8">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                                    <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-emerald-400" />
                                </div>

                                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter pr-2">
                                    ¡Tu Web está <span className="text-emerald-400">Lista</span>!
                                </h2>

                                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                    Ya puedes revisar completamente tu sitio web. Navega por todas las secciones, prueba los botones y asegúrate de que todo esté perfecto para tus clientes.
                                </p>
                            </div>
                        </div>

                        {/* CHAT SEPARADO */}
                        <div className="relative h-[500px] md:h-[700px] rounded-[2rem] overflow-hidden shadow-2xl">
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
                                        En Línea
                                    </div>
                                </div>

                                {/* Area de Mensajes */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {proyecto.notas && proyecto.notas.length > 0 ? (
                                        proyecto.notas.map((nota: any) => (
                                            <div key={nota.id} className={`flex ${nota.autor === 'cliente' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] lg:max-w-[70%] p-5 rounded-3xl ${nota.autor === 'cliente'
                                                    ? 'bg-[#FFD700]/10 border border-[#FFD700]/20 text-white rounded-tr-none'
                                                    : 'bg-white/10 border border-white/10 text-gray-200 rounded-tl-none'
                                                    }`}>
                                                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${nota.autor === 'cliente' ? 'text-[#FFD700]' : 'text-blue-400'}`}>
                                                            {nota.autor === 'cliente' ? 'TÃº' : 'Nexus Dev'}
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


                    </motion.div>
                ) : (
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
                            {/* PENDING INFO WARNING CARD */}
                            {/* PENDING INFO WARNING CARD OR SUCCESS INFO */}
                            {isMissingInfo ? (
                                <div className="col-span-1 md:col-span-2 bg-amber-500/5 border border-amber-500/20 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden flex items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                                    <div className="hidden md:flex w-20 h-20 rounded-full bg-amber-500/10 items-center justify-center shrink-0">
                                        <AlertCircle className="w-10 h-10 text-amber-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white mb-2 flex items-center gap-3">
                                            <AlertCircle className="w-6 h-6 text-amber-500 md:hidden" />
                                            Información Requerida
                                        </h3>
                                        <p className="text-gray-400 font-medium leading-relaxed">
                                            Aún nos falta información para hacer tu página. Recuerda que hasta no tener todo lo necesario no podemos comenzar con el desarrollo.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="col-span-1 md:col-span-2 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden flex items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                                    <div className="hidden md:flex w-20 h-20 rounded-full bg-emerald-500/10 items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white mb-2 flex items-center gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500 md:hidden" />
                                            ¡Todo Listo!
                                        </h3>
                                        <p className="text-gray-400 font-medium leading-relaxed">
                                            Gracias por completar tu perfil. Tenemos toda la información necesaria para trabajar en tu proyecto.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* CARD 1: CORPORATE IDENTITY */}
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden group hover:border-[#FFD700]/30 transition-all duration-500 h-full flex flex-col">
                                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <BriefcaseBusiness className="w-16 h-16 md:w-24 md:h-24 text-[#FFD700] transform rotate-12 translate-x-4 md:translate-x-8 -translate-y-4 md:-translate-y-8" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-white mb-6 md:mb-8 flex items-center gap-3">
                                    Identidad Corporativa
                                    <button
                                        onClick={() => handleEditClick('identity', { nombreComercial: proyecto.onboardingData?.nombreComercial, slogan: proyecto.onboardingData?.slogan, descripcion: proyecto.onboardingData?.descripcion })}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all"
                                        title="Editar Información"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </h3>
                                <div className="space-y-6 md:space-y-8 relative z-10 flex-1">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Nombre Comercial</p>
                                        <p className="text-2xl md:text-3xl font-black text-white leading-tight mb-4">{proyecto.onboardingData?.nombreComercial || '...'}</p>

                                        <div className="mb-6 pl-4 border-l-2 border-[#FFD700]/50">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-1">Slogan</p>
                                            {proyecto.onboardingData?.slogan ? (
                                                <p className="text-lg font-bold text-gray-300 italic">"{proyecto.onboardingData.slogan}"</p>
                                            ) : (
                                                <p className="text-sm font-medium text-gray-600 italic">Sin registrar (Opcional)</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Descripción del Negocio</p>
                                        <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed line-clamp-4">{proyecto.onboardingData?.descripcion || 'Pendiente de información.'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* CARD 2: DOMAINS */}
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500 h-full flex flex-col">
                                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <Globe className="w-16 h-16 md:w-24 md:h-24 text-cyan-500 transform -rotate-12 translate-x-4 md:translate-x-8 -translate-y-4 md:-translate-y-8" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-white mb-6 md:mb-8 flex items-center gap-3">
                                    Dominios Web
                                    <button
                                        onClick={() => handleEditClick('domains', { dominioUno: proyecto.onboardingData?.dominioUno })}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all"
                                        title="Editar Dominios"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </h3>
                                <div className="space-y-6 md:space-y-8 relative z-10 flex-1 flex flex-col justify-center">
                                    <div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400"><Globe className="w-4 h-4" /></div>
                                                <span className="text-white font-bold truncate">
                                                    {proyecto.onboardingData?.dominioUno
                                                        ? `www.${proyecto.onboardingData.dominioUno}.com`
                                                        : 'Pendiente'}
                                                </span>
                                                {proyecto.onboardingData?.dominioUno && <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-bold ml-auto">PRINCIPAL</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* CARD 3: VISUAL BRANDING */}
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500 h-full flex flex-col">
                                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <Paintbrush className="w-16 h-16 md:w-24 md:h-24 text-purple-500 transform rotate-12 translate-x-4 md:translate-x-8 -translate-y-4 md:-translate-y-8" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-white mb-6 md:mb-8 relative z-10 flex items-center gap-3">
                                    Marca Visual
                                    <button
                                        onClick={() => handleEditClick('branding', { logo: proyecto.onboardingData?.logo, primaryColor: proyecto.onboardingData?.primaryColor, secondaryColor: proyecto.onboardingData?.secondaryColor })}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all"
                                        title="Editar Marca Visual"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </h3>
                                <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 relative group-hover:bg-black/60 transition-colors flex items-center justify-center p-8">
                                    {hasLogo ? (
                                        <img src={proyecto.onboardingData.logo} className="max-w-full max-h-[140px] w-auto h-auto object-contain drop-shadow-2xl" />
                                    ) : (
                                        <button
                                            onClick={() => handleEditClick('branding', { logo: proyecto.onboardingData?.logo, primaryColor: proyecto.onboardingData?.primaryColor, secondaryColor: proyecto.onboardingData?.secondaryColor })}
                                            className="text-center group/upload w-full h-full flex flex-col items-center justify-center cursor-pointer"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 border-dashed group-hover/upload:border-purple-500 group-hover/upload:bg-purple-500/10 transition-all">
                                                <Upload className="w-6 h-6 text-gray-600 group-hover/upload:text-purple-500 transition-colors" />
                                            </div>
                                            <p className="text-xs font-bold text-gray-600 uppercase group-hover/upload:text-purple-400 transition-colors">Subir Logo</p>
                                        </button>
                                    )}
                                </div>

                                {/* Palette Preview */}
                                <div className="mt-6 flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-xl border shadow-lg ${!proyecto.onboardingData?.primaryColor ? 'border-white/10 bg-white/5 border-dashed' : 'border-white/20'}`}
                                            style={{ backgroundColor: proyecto.onboardingData?.primaryColor || 'transparent' }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">Acento</span>
                                            <span className="text-[9px] font-mono text-gray-500">{proyecto.onboardingData?.primaryColor || 'SIN ELEGIR'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-right">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Fondo</span>
                                            <span className="text-[9px] font-mono text-gray-500">{proyecto.onboardingData?.secondaryColor || 'SIN ELEGIR'}</span>
                                        </div>
                                        <div
                                            className={`w-10 h-10 rounded-xl border shadow-lg ${!proyecto.onboardingData?.secondaryColor ? 'border-white/10 bg-white/5 border-dashed' : 'border-white/20'}`}
                                            style={{ backgroundColor: proyecto.onboardingData?.secondaryColor || 'transparent' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* CARD 4: CONTACT DIRECT */}
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 h-full flex flex-col justify-between">
                                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <Smartphone className="w-16 h-16 md:w-24 md:h-24 text-emerald-500 transform rotate-12 translate-x-4 md:translate-x-8 -translate-y-4 md:-translate-y-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-white mb-6 md:mb-8 flex items-center gap-3">
                                        Contacto Directo
                                        <button
                                            onClick={() => handleEditClick('contact', { contactoTel: proyecto.onboardingData?.contactoTel, contactoEmail: proyecto.onboardingData?.contactoEmail, direccion: proyecto.onboardingData?.direccion })}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all"
                                            title="Editar Contacto"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </h3>
                                    <div className="space-y-6 relative z-10">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-4 text-gray-300 group-hover:text-white transition-colors">
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                                    <Smartphone className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Teléfono</p>
                                                    <span className="text-lg font-bold">{proyecto.onboardingData?.contactoTel || 'No registrado'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-gray-300 group-hover:text-white transition-colors">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Email</p>
                                                    <span className="text-lg font-bold truncate block">{proyecto.onboardingData?.contactoEmail || 'No registrado'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-gray-300 group-hover:text-white transition-colors">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${proyecto.onboardingData?.direccion ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-white/5 text-gray-600 border-white/5'}`}>
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${proyecto.onboardingData?.direccion ? 'text-purple-500' : 'text-gray-600'}`}>Ubicación</p>
                                                    {proyecto.onboardingData?.direccion ? (
                                                        <span className="text-sm font-bold leading-tight block">{proyecto.onboardingData.direccion}</span>
                                                    ) : (
                                                        <span className="text-sm font-medium leading-tight block text-gray-600 italic">Sin registrar (Opcional)</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NEW SERVICES SECTION */}
                        {/* NEW SERVICES SECTION */}
                        <div className="mb-24">
                            <h3 className="text-2xl font-black text-white mb-8 px-2 flex items-center gap-3">
                                <span className="w-8 h-1 bg-[#FFD700] rounded-full inline-block"></span>
                                Servicios / Productos
                                {proyecto.onboardingData?.services?.length > 0 && (
                                    <button
                                        onClick={() => handleEditClick('services', { services: proyecto.onboardingData?.services || [] })}
                                        className="ml-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all"
                                        title="Editar Servicios"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                )}
                            </h3>

                            {(!proyecto.onboardingData?.services || proyecto.onboardingData.services.length === 0) ? (
                                <div className="bg-[#0a0a0a] border border-white/5 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center text-center group hover:border-[#FFD700]/30 transition-all">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Layout className="w-10 h-10 text-gray-600 group-hover:text-[#FFD700] transition-colors" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2">No especificaste ningún Servicio/Producto</h4>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Es importante que definas qué ofreces para poder estructurar tu sitio web correctamente.</p>

                                    <button
                                        onClick={() => handleEditClick('services', { services: [] })}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFD700]/90 transition-all hover:scale-105"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Añadir Servicio
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {proyecto.onboardingData.services.map((s: any, i: number) => (
                                        <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 md:p-8 relative overflow-hidden group hover:border-white/20 transition-all">
                                            {/* Image Header */}
                                            <div className="h-40 -mx-8 -mt-8 mb-6 bg-white/5 relative overflow-hidden">
                                                {s.image ? (
                                                    <img src={s.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                        <Layout className="w-10 h-10 text-gray-700" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80" />
                                            </div>

                                            <div className="relative z-10">
                                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4 border border-white/10">
                                                    <span className="font-black text-sm">0{i + 1}</span>
                                                </div>
                                                <h4 className="text-xl font-bold text-white mb-2 leading-tight">{s.title}</h4>
                                                <p className="text-sm text-gray-500 font-medium line-clamp-2">{s.description || 'Descripción de servicio/producto'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* GALLERY SECTION */}
                        <div className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <h3 className="text-2xl font-black text-white mb-8 px-2 flex items-center gap-3">
                                <span className="w-8 h-1 bg-purple-500 rounded-full inline-block"></span>
                                Galería del Negocio
                                {proyecto.onboardingData?.gallery?.length > 0 && (
                                    <button
                                        onClick={() => handleEditClick('gallery', { gallery: proyecto.onboardingData?.gallery || [] })}
                                        className="ml-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all"
                                        title="Editar Galería"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                )}
                            </h3>

                            {(!proyecto.onboardingData?.gallery || proyecto.onboardingData.gallery.length === 0) ? (
                                <div className="bg-[#0a0a0a] border border-white/5 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center text-center group hover:border-purple-500/30 transition-all">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-10 h-10 text-gray-600 group-hover:text-purple-500 transition-colors" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2">No hay imágenes en la galería</h4>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Sube fotos de tu negocio para usarlas en el diseño.</p>

                                    <button
                                        onClick={() => handleEditClick('gallery', { gallery: [] })}
                                        className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-all hover:scale-105"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Subir Fotos
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {proyecto.onboardingData.gallery.map((img: string, i: number) => (
                                        <div key={i} className="aspect-square bg-[#0a0a0a] border border-white/5 rounded-2xl relative overflow-hidden group">
                                            <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={() => handleEditClick('gallery', { gallery: proyecto.onboardingData.gallery })}
                                                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all text-white"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {proyecto.onboardingData.gallery.length < 2 && (
                                        <button
                                            onClick={() => handleEditClick('gallery', { gallery: proyecto.onboardingData.gallery })}
                                            className="aspect-square bg-[#0a0a0a] border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 group hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-gray-500 hover:text-purple-400"
                                        >
                                            <Plus className="w-8 h-8" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Añadir</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* SOCIAL MEDIA SECTION */}
                        <div className="mb-24">
                            <h3 className="text-2xl font-black text-white mb-8 px-2 flex items-center gap-3 group">
                                <span className="w-8 h-1 bg-[#E1306C] rounded-full inline-block"></span>
                                Presencia Social
                                <button
                                    onClick={() => handleEditClick('social', { instagram: proyecto.onboardingData?.instagram, facebook: proyecto.onboardingData?.facebook, tiktok: proyecto.onboardingData?.tiktok, x: proyecto.onboardingData?.x })}
                                    className="ml-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all"
                                    title="Editar Redes"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { key: 'instagram', label: 'Instagram', color: '#E1306C', icon: Instagram },
                                    { key: 'facebook', label: 'Facebook', color: '#1877F2', icon: Facebook },
                                    { key: 'tiktok', label: 'TikTok', color: '#00f2ea', icon: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"></path></svg> },
                                    { key: 'x', label: 'X / Twitter', color: '#ffffff', icon: X }
                                ].map((social) => {
                                    const value = proyecto.onboardingData?.[social.key];
                                    const hasValue = value && value.trim().length > 0;

                                    return (
                                        <div key={social.key} className={`bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 flex items-center gap-4 group transition-all ${hasValue ? `hover:border-[${social.color}]/30` : 'hover:border-white/10 opacity-75 hover:opacity-100'}`}>
                                            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform ${hasValue
                                                ? `bg-[${social.color}]/10 border-[${social.color}]/20 text-[${social.color}] group-hover:scale-110`
                                                : 'bg-white/5 border-white/5 text-gray-600 group-hover:scale-100'
                                                }`}>
                                                <social.icon className="w-6 h-6" style={{ color: hasValue ? social.color : 'inherit' }} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${hasValue ? 'text-gray-500' : 'text-gray-700'}`}>{social.label}</p>
                                                {hasValue ? (
                                                    <p className="text-white font-bold truncate">
                                                        {value.startsWith('@') ? value : (social.key === 'facebook' && value.includes('http') ? 'Enlace Guardado' : value)}
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-600 font-medium italic text-sm">Disponible (Opcional)</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        {/* FEEDBACK & CHAT COMPONENT */}
                        {selectedProject && (
                            <FeedbackChat
                                proyecto={selectedProject}
                                feedbackNote={feedbackNote}
                                setFeedbackNote={setFeedbackNote}
                                handleSendFeedback={handleSendFeedback}
                                sendingFeedback={sendingFeedback}
                                feedbackImages={feedbackImages}
                                setFeedbackImages={setFeedbackImages}
                                handleFeedbackImageUpload={handleFeedbackImageUpload}
                                isUploadingFeedback={isUploadingFeedback}
                            />
                        )}
                    </div>
                )}

            </section >

            {/* EDIT MODAL */}
            <EditModal
                editingSection={editingSection}
                onClose={() => setEditingSection(null)}
                sectionData={sectionData}
                setSectionData={setSectionData}
                onSave={handleSaveSection}
                isSaving={isSavingSection}
                onFileUpload={handleSectionFileUpload}
                isUploading={isUploadingSectionFile}
            />

            <Footer />
        </main >
    );
}

import CountdownTimer from '@/components/CountdownTimer';

// Wizard Step Component (Keeping logic, improving UI wrapper inside parent)
function WizardStep({ step, data, onNext, onBack, loading, clientName, projectId }: any) {
    const [localData, setLocalData] = useState(data);
    const [uploading, setUploading] = useState<string | null>(null);
    const [showLogoWarning, setShowLogoWarning] = useState(false);

    // Domain Checking Logic (Moved to top level to avoid Hook errors)
    const [isChecking, setIsChecking] = useState(false);
    const [availability, setAvailability] = useState<{ available: boolean; error?: string } | null>(null);

    // Auto-width input logic
    const spanRef = useRef<HTMLSpanElement>(null);
    const [inputWidth, setInputWidth] = useState(0);

    useEffect(() => {
        // Measure the width of the text to resize input
        if (spanRef.current) {
            setInputWidth(spanRef.current.offsetWidth);
        }
    }, [localData.dominioUno, step]);

    useEffect(() => {
        // Only run check if we are on the domain step (2) and there is a domain to check
        if (step !== 2) return;

        const domain = localData.dominioUno;
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
        }, 800); // 800ms debounce

        return () => clearTimeout(timeoutId);
    }, [localData.dominioUno, step]);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const handleChange = (field: string, value: any) => {
        setLocalData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, context: string) => {
        const file = e.target.files?.[0];
        if (!file || !projectId) return;

        // Validar tamaño (4.5MB)
        if (file.size > MAX_FILE_SIZE) {
            alert('El archivo es demasiado grande. Máximo 4.5MB.');
            return;
        }

        setUploading(context);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('proyectoId', projectId);
        formData.append('subidoPor', 'cliente');

        try {
            const res = await uploadArchivo(formData);
            if (res.success && res.url) {
                if (context === 'logo') {
                    handleChange('logo', res.url);
                } else if (context === 'gallery') {
                    const currentGallery = localData.gallery || [];
                    handleChange('gallery', [...currentGallery, res.url]);
                } else {
                    const current = localData.services || [];
                    const updated = current.map((s: any) => s.id === context ? { ...s, image: res.url } : s);
                    handleChange('services', updated);
                }
            } else {
                alert('Error al subir: ' + (res.error || 'Desconocido'));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(null);
        }
    };

    const removeGalleryImage = (indexToRemove: number) => {
        const currentGallery = localData.gallery || [];
        handleChange('gallery', currentGallery.filter((_: any, index: number) => index !== indexToRemove));
    };

    // Handlers for Services
    const handleServiceAdd = () => {
        const current = localData.services || [];
        if (current.length >= 6) return;
        const newService = { id: window.crypto?.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).substring(7), title: '', description: '' };
        handleChange('services', [...current, newService]);
    };
    const handleServiceUpdate = (id: string, field: string, value: string) => {
        const current = localData.services || [];
        const updated = current.map((s: any) => s.id === id ? { ...s, [field]: value } : s);
        handleChange('services', updated);
    };
    const handleServiceRemove = (id: string) => {
        const current = localData.services || [];
        handleChange('services', current.filter((s: any) => s.id !== id));
    };


    // RENDER STEPS
    if (step === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-32 h-32 mx-auto mb-12 relative">
                    <div className="absolute inset-0 bg-[#FFD700] blur-[80px] opacity-20 animate-pulse" />
                    <Sparkles className="w-full h-full text-[#FFD700] relative z-10" />
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter pr-4">¡Hola, <span className="text-[#FFD700]">{clientName.split(' ')[0]}</span>!</h2>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Estás a punto de iniciar algo grande. Solo necesitamos configurar unos detalles básicos para que tu proyecto en <strong>Nexus</strong> despegue a la velocidad de la luz.
                </p>
                <button onClick={() => onNext({})} disabled={loading} className="group relative px-12 py-6 bg-white text-black font-black text-lg uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                    <span className="relative z-10 flex items-center gap-3">Comenzar <Rocket className="w-5 h-5" /></span>
                </button>
            </div>
        );
    }

    // Step 1: Identidad
    if (step === 1) {
        return (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="space-y-8">
                    <div className="group">
                        <label className="text-xs font-black uppercase tracking-widest text-[#FFD700] mb-4 block">Nombre de tu Empresa</label>
                        <input
                            type="text"
                            value={localData.nombreComercial || ''}
                            onChange={(e) => handleChange('nombreComercial', e.target.value)}
                            className="w-full bg-transparent border-b-2 border-white/10 text-4xl md:text-6xl font-black text-white focus:border-[#FFD700] transition-colors outline-none py-4 placeholder:text-white/10"
                            placeholder="Tu Empresa"
                            autoFocus
                        />
                    </div>
                    <div className="group">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 block">Frase Clave (Slogan) (Opcional)</label>
                        <input
                            type="text"
                            value={localData.slogan || ''}
                            onChange={(e) => handleChange('slogan', e.target.value)}
                            className="w-full bg-transparent border-b-2 border-white/10 text-2xl md:text-3xl font-bold text-gray-300 focus:border-[#FFD700] transition-colors outline-none py-4 placeholder:text-white/10"
                            placeholder="Tu frase distintiva"
                        />
                    </div>
                </div>
                <div className="flex justify-between pt-8">
                    <button onClick={() => onBack(localData)} className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors">Atrás</button>
                    <button onClick={() => onNext(localData)} disabled={!localData.nombreComercial} className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100">Continuar</button>
                </div>
            </div>
        );
    }



    // Step 2: Dominio
    if (step === 2) {
        return (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700 min-h-[500px] flex flex-col justify-center">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Tu Dirección Web</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Cada gran proyecto comienza con un nombre. <br /> Comprueba si está disponible.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto w-full relative flex flex-col items-center">

                    {/* HIDDEN MEASUREMENT SPAN (Keeps input width perfect) */}
                    <span
                        ref={spanRef}
                        className="absolute opacity-0 pointer-events-none text-2xl md:text-3xl lg:text-4xl font-black whitespace-pre px-0 tracking-tight"
                        aria-hidden="true"
                    >
                        {localData.dominioUno || 'negocio'}
                    </span>

                    {/* Main Input Container */}
                    <div className={`relative flex items-center justify-center bg-[#0a0a0a] border-2 rounded-full px-8 py-6 transition-all duration-300 group
                        ${availability?.available
                            ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                            : availability?.available === false
                                ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
                                : 'border-white/10 hover:border-[#FFD700]/30 focus-within:border-[#FFD700] focus-within:shadow-[0_0_30px_rgba(255,215,0,0.1)]'
                        }`}>

                        {/* Flex Row for tight spacing */}
                        <div className="flex items-center justify-center gap-0.5">
                            <span className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-500 select-none m-0 p-0 leading-none tracking-tight">www.</span>

                            <input
                                type="text"
                                value={localData.dominioUno || ''}
                                onChange={(e) => handleChange('dominioUno', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                className="bg-transparent text-2xl md:text-3xl lg:text-4xl font-black text-white outline-none placeholder:text-gray-700 text-center m-0 p-0 border-none leading-none tracking-tight"
                                style={{ width: inputWidth ? `${inputWidth}px` : 'auto', minWidth: '1ch' }}
                                placeholder="negocio"
                                autoFocus
                            />

                            <span className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-500 select-none m-0 p-0 leading-none tracking-tight">.com</span>
                        </div>


                    </div>

                    {/* Feedback Message */}
                    <div className="mt-6 text-center h-8">
                        {availability?.available ? (
                            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-emerald-400 font-bold uppercase tracking-widest text-sm bg-emerald-500/10 inline-block px-4 py-2 rounded-full">
                                🎉 ¡Dominio Disponible! Es todo tuyo.
                            </motion.p>
                        ) : availability?.available === false ? (
                            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 font-bold uppercase tracking-widest text-sm bg-red-500/10 inline-block px-4 py-2 rounded-full">
                                {availability.error === 'Dominio muy corto invÃ¡lido.' ? 'Escribe al menos 3 caracteres.' : '🚫 Este dominio ya está ocupado. Intenta otro.'}
                            </motion.p>
                        ) : isChecking ? (
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest animate-pulse">... Verificando Disponibilidad ...</span>
                        ) : (
                            <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Escribe para verificar en tiempo real</span>
                        )}
                    </div>
                </div>

                <div className="flex justify-between pt-12 max-w-3xl mx-auto w-full">
                    <button onClick={() => onBack(localData)} className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors px-6 py-4 rounded-xl hover:bg-white/5">
                        Atrás
                    </button>
                    <button
                        onClick={() => onNext(localData)}
                        disabled={!localData.dominioUno || !availability?.available || isChecking}
                        className="bg-[#FFD700] text-black px-10 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_50px_rgba(255,215,0,0.5)]"
                    >
                        Confirmar Dominio
                    </button>
                </div>
            </div>
        );
    }

    // Step 3: Historia
    if (step === 3) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <h2 className="text-3xl font-black text-white">Cuéntanos tu historia</h2>
                <textarea
                    value={localData.descripcion || ''}
                    onChange={(e) => handleChange('descripcion', e.target.value)}
                    className="w-full h-80 bg-black/40 border border-white/10 rounded-3xl p-8 text-xl text-white focus:border-[#FFD700] transition-all outline-none resize-none leading-relaxed placeholder:text-gray-700"
                    placeholder="Describe a qué se dedica tu empresa, cuál es tu misión y qué te hace único..."
                    autoFocus
                />
                <div className="flex justify-between pt-8">
                    <button onClick={() => onBack(localData)} className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors">Atrás</button>
                    <button onClick={() => onNext(localData)} disabled={!localData.descripcion} className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100">Continuar</button>
                </div>
            </div>
        )
    }

    // Step 4: Colores de Marca
    if (step === 4) {
        return (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-white mb-4">Personalidad Visual</h2>
                    <p className="text-gray-400">Selecciona los colores que darán vida a tu sitio web.</p>
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mt-4 bg-amber-400/10 inline-block px-4 py-2 rounded-full border border-amber-400/20">
                        ✨ Tip: Elige colores que contrasten bien entre sí para una mejor legibilidad.
                    </p>
                </div>



                {/* Suggested Palettes */}
                <div className="max-w-4xl mx-auto">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 block text-center">Paletas Sugeridas (Nexus Collection)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { name: 'Cyber Nexus', primary: '#22d3ee', secondary: '#020617' },
                            { name: 'Pure Light', primary: '#2563eb', secondary: '#ffffff' },
                            { name: 'Luxury Gold', primary: '#fbbf24', secondary: '#0a0a05' },
                            { name: 'Ocean Breeze', primary: '#0ea5e9', secondary: '#ffffff' },
                            { name: 'Deep Forest', primary: '#10b981', secondary: '#020d08' },
                            { name: 'Royal Velvet', primary: '#8b5cf6', secondary: '#ffffff' },
                            { name: 'Crimson Tech', primary: '#ef4444', secondary: '#0d0202' },
                            { name: 'Rose Garden', primary: '#f43f5e', secondary: '#ffffff' },
                        ].map((palette) => (
                            <button
                                key={palette.name}
                                onClick={() => {
                                    setLocalData((prev: any) => ({
                                        ...prev,
                                        primaryColor: palette.primary,
                                        secondaryColor: palette.secondary
                                    }));
                                }}
                                className={`group p-3 rounded-2xl border transition-all hover:scale-105 flex flex-col items-center gap-3 ${localData.primaryColor === palette.primary && localData.secondaryColor === palette.secondary ? 'bg-white/10 border-[#FFD700]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex -space-x-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-black shadow-lg z-10" style={{ backgroundColor: palette.primary }} />
                                    <div className="w-10 h-10 rounded-full border-2 border-black shadow-lg" style={{ backgroundColor: palette.secondary }} />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${localData.primaryColor === palette.primary && localData.secondaryColor === palette.secondary ? 'text-[#FFD700]' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                    {palette.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative py-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <span className="relative bg-[#0a0a0a] px-4 text-[9px] font-bold text-gray-700 uppercase tracking-widest">O personaliza el tuyo</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-2xl mx-auto">
                    {/* Primary Color */}
                    <div className="space-y-6 flex flex-col items-center">
                        <label className="text-sm font-black uppercase tracking-[0.2em] text-[#FFD700]">Color de Acento (Botones/Títulos)</label>
                        <div className="relative group">
                            <input
                                type="color"
                                value={localData.primaryColor || '#FFFFFF'}
                                onChange={(e) => handleChange('primaryColor', e.target.value)}
                                className={`w-32 h-32 rounded-full cursor-pointer bg-transparent border-4 transition-all overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full hover:scale-105 ${!localData.primaryColor ? 'border-dashed border-white/20' : 'border-white/10 group-hover:border-[#FFD700]/50'}`}
                            />
                            {!localData.primaryColor && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <Plus className="w-8 h-8 text-white/20" />
                                </div>
                            )}
                            <div className="absolute inset-0 rounded-full pointer-events-none border-4 border-black/20" />
                        </div>
                        <input
                            type="text"
                            value={localData.primaryColor || ''}
                            onChange={(e) => handleChange('primaryColor', e.target.value)}
                            placeholder="SIN ELEGIR"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center font-mono text-white uppercase outline-none focus:border-[#FFD700] transition-colors placeholder:text-gray-600 placeholder:text-xs"
                        />
                    </div>

                    {/* Background Color */}
                    <div className="space-y-6 flex flex-col items-center">
                        <label className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Color de Fondo</label>
                        <div className="relative group">
                            <input
                                type="color"
                                value={localData.secondaryColor || '#000000'}
                                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                className={`w-32 h-32 rounded-full cursor-pointer bg-transparent border-4 transition-all overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full hover:scale-105 ${!localData.secondaryColor ? 'border-dashed border-white/20' : 'border-white/10 group-hover:border-white/30'}`}
                            />
                            {!localData.secondaryColor && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <Plus className="w-8 h-8 text-white/20" />
                                </div>
                            )}
                            <div className="absolute inset-0 rounded-full pointer-events-none border-4 border-black/20" />
                        </div>
                        <input
                            type="text"
                            value={localData.secondaryColor || ''}
                            onChange={(e) => handleChange('secondaryColor', e.target.value)}
                            placeholder="SIN ELEGIR"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center font-mono text-white uppercase outline-none focus:border-white transition-colors placeholder:text-gray-600 placeholder:text-xs"
                        />
                    </div>
                </div>

                <div className="flex justify-between pt-12">
                    <button onClick={() => onBack(localData)} className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors">Atrás</button>
                    <button
                        onClick={() => onNext(localData)}
                        className="bg-[#FFD700] text-black px-12 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,215,0,0.3)] disabled:opacity-50"
                    >
                        Continuar
                    </button>
                </div>
            </div >
        )
    }

    if (step === 5) { // Servicios
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-white">Tus Servicios / Productos Principales <span className="text-sm font-bold text-gray-500 ml-2">(Opcional)</span></h2>
                    <button onClick={handleServiceAdd} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#FFD700] hover:text-black hover:border-transparent transition-all"><Plus className="w-6 h-6" /></button>
                </div>

                <div className="grid gap-4 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                    {localData.services?.map((s: any, i: number) => (
                        <div key={s.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-colors flex gap-6 items-start group">
                            <div className="w-20 h-20 bg-black/50 rounded-2xl flex-shrink-0 border border-white/10 overflow-hidden relative cursor-pointer hover:opacity-80 transition-opacity">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={(e) => handleFileUpload(e, s.id)}
                                    disabled={!!uploading}
                                />
                                {s.image ? (
                                    <img src={s.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-700" /></div>
                                )}
                                {uploading === s.id && <div className="absolute inset-0 bg-black/80 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-[#FFD700]" /></div>}
                            </div>
                            <div className="flex-1 space-y-3">
                                <input
                                    type="text"
                                    value={s.title}
                                    onChange={(e) => handleServiceUpdate(s.id, 'title', e.target.value)}
                                    placeholder="Nombre del Servicio / Producto"
                                    className="w-full bg-transparent border-b border-white/10 focus:border-white text-lg font-bold text-white outline-none pb-2 transition-colors"
                                />
                                <input
                                    type="text"
                                    value={s.description}
                                    onChange={(e) => handleServiceUpdate(s.id, 'description', e.target.value)}
                                    placeholder="Breve descripción..."
                                    className="w-full bg-transparent border-b border-white/10 focus:border-white text-sm text-gray-400 outline-none pb-2 transition-colors"
                                />
                            </div>
                            <button onClick={() => handleServiceRemove(s.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                        </div>
                    ))}
                    {(!localData.services || localData.services.length === 0) && (
                        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl text-gray-500">
                            No hay servicios o productos agregados aún. Dale al "+" para empezar.
                        </div>
                    )}
                </div>

                <div className="flex justify-between pt-8">
                    <button onClick={() => onBack(localData)} className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors">Atrás</button>
                    <button
                        onClick={() => onNext(localData)}
                        className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        {(!localData.services || localData.services.length === 0) ? 'Omitir' : 'Continuar'}
                    </button>
                </div>
            </div>
        );
    }

    // Step 6: Galería
    if (step === 6) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-2">Galería del Negocio</h2>
                        <p className="text-gray-400">Necesitamos 2 fotos de buena calidad que identifiquen tu negocio.</p>
                    </div>
                    <div className={`relative overflow-hidden group ${localData.gallery?.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
                            onChange={(e) => handleFileUpload(e, 'gallery')}
                            disabled={!!uploading || localData.gallery?.length >= 2}
                        />
                        <button className="bg-white/10 hover:bg-[#FFD700] hover:text-black text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2 disabled:cursor-not-allowed">
                            {uploading === 'gallery' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                            {localData.gallery?.length >= 2 ? 'Límite Alcanzado' : 'Subir Foto'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto custom-scrollbar min-h-[200px] content-start">
                    {localData.gallery?.map((imgUrl: string, index: number) => (
                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                            <img src={imgUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => removeGalleryImage(index)}
                                    className="p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {(!localData.gallery || localData.gallery.length === 0) && (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-gray-600 gap-4">
                            <ImageIcon className="w-12 h-12 opacity-50" />
                            <p className="font-medium">Sube tus 2 mejores fotos</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-between pt-8">
                    <button onClick={() => onBack(localData)} className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors">Atrás</button>
                    <button onClick={() => onNext(localData)} className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                        {(!localData.gallery || localData.gallery.length < 2) ? 'Omitir' : 'Continuar'}
                    </button>
                </div>
            </div>
        );
    }

    // Step 7: Logo
    if (step === 7) {
        return (
            <div className="text-center space-y-12 animate-in fade-in slide-in-from-right-8 duration-700 relative">
                <h2 className="text-4xl font-black text-white">Tu Logo</h2>

                <div className="relative w-64 h-64 mx-auto group cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                        onChange={(e) => handleFileUpload(e, 'logo')}
                        disabled={!!uploading}
                    />
                    <div className={`w-full h-full rounded-[3rem] border-4 border-dashed ${localData.logo ? 'border-[#FFD700] bg-black' : 'border-white/20 bg-white/5'} flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-[#FFD700]/50 relative overflow-hidden`}>
                        {uploading === 'logo' ? (
                            <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin" />
                        ) : localData.logo ? (
                            <img src={localData.logo} className="w-full h-full object-contain p-8" />
                        ) : (
                            <div className="space-y-4">
                                <Upload className="w-12 h-12 text-gray-500 mx-auto" />
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Subir Archivo</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between pt-8 max-w-lg mx-auto w-full">
                    <button onClick={() => onBack(localData)} className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors">Atrás</button>
                    <button
                        onClick={() => {
                            if (localData.logo) {
                                onNext(localData);
                            } else {
                                setShowLogoWarning(true);
                            }
                        }}
                        className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        {localData.logo ? 'Confirmar Logo' : 'Aún no tengo Logo'}
                    </button>
                </div>

                {/* LOGO WARNING MODAL */}
                <AnimatePresence>
                    {showLogoWarning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-[#111] border border-white/10 p-8 rounded-[2rem] max-w-md w-full text-center shadow-2xl relative"
                            >
                                <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Paintbrush className="w-8 h-8 text-[#FFD700]" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4">¡Espera un momento!</h3>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    Necesitamos un logo para representar tu marca. <br />
                                    <strong className="text-white">¡Te recomendamos diseñar uno con nosotros!</strong>
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowLogoWarning(false)}
                                        className="w-full bg-[#FFD700] text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                                    >
                                        Subir mi Logo
                                    </button>
                                    <button
                                        onClick={() => onNext(localData)}
                                        className="w-full bg-white/5 text-gray-400 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        Continuar sin Logo
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Step 8: Contacto Directo
    if (step === 8) {
        return (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <h2 className="text-4xl font-black text-white">Contacto Directo</h2>
                <div className="space-y-6">
                    <div className="group">
                        <label className="text-xs font-black uppercase tracking-widest text-[#FFD700] mb-4 block">Número de Celular / WhatsApp</label>
                        <input
                            type="text"
                            value={localData.contactoTel || ''}
                            onChange={(e) => handleChange('contactoTel', e.target.value)}
                            className="w-full bg-transparent border-b-2 border-white/10 text-2xl font-bold text-white focus:border-[#FFD700] transition-colors outline-none py-4 placeholder:text-white/10"
                            placeholder="+57 300..."
                            autoFocus
                        />
                    </div>
                    <div className="group">
                        <label className="text-xs font-black uppercase tracking-widest text-[#FFD700] mb-4 block">Correo Electrónico</label>
                        <input
                            type="email"
                            value={localData.contactoEmail || ''}
                            onChange={(e) => handleChange('contactoEmail', e.target.value)}
                            className="w-full bg-transparent border-b-2 border-white/10 text-2xl font-bold text-white focus:border-[#FFD700] transition-colors outline-none py-4 placeholder:text-white/10"
                            placeholder="contacto@..."
                        />
                    </div>
                    <div className="group">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 block">Dirección del Negocio (Opcional)</label>
                        <input
                            type="text"
                            value={localData.direccion || ''}
                            onChange={(e) => handleChange('direccion', e.target.value)}
                            className="w-full bg-transparent border-b-2 border-white/10 text-xl font-medium text-gray-300 focus:border-[#FFD700] transition-colors outline-none py-4 placeholder:text-white/10"
                            placeholder="Calle 123 #45-67..."
                        />
                    </div>
                </div>

                <div className="flex justify-between pt-12">
                    <button onClick={() => onBack(localData)} className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors">Atrás</button>
                    <button
                        onClick={() => onNext(localData)}
                        disabled={!localData.contactoTel || !localData.contactoEmail}
                        className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                    >
                        Siguiente Paso
                    </button>
                </div>
            </div>
        );
    }

    // Step 9: Redes Sociales (Final)
    if (step === 9) {
        return (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <h2 className="text-4xl font-black text-white">Presencia en Redes</h2>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group relative">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 block">Facebook (Opcional)</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1877F2]">
                                    <Facebook className="w-6 h-6" />
                                </div>
                                <input
                                    type="text"
                                    value={localData.facebook || ''}
                                    onChange={(e) => handleChange('facebook', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl text-xl font-medium text-white focus:border-[#1877F2] focus:bg-white/10 transition-all outline-none py-4 pl-14 pr-4 placeholder:text-white/10"
                                    placeholder="Link o Usuario"
                                />
                            </div>
                        </div>
                        <div className="group relative">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 block">Instagram (Opcional)</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E1306C]">
                                    <Instagram className="w-6 h-6" />
                                </div>
                                <input
                                    type="text"
                                    value={localData.instagram || ''}
                                    onChange={(e) => handleChange('instagram', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl text-xl font-medium text-white focus:border-[#E1306C] focus:bg-white/10 transition-all outline-none py-4 pl-14 pr-4 placeholder:text-white/10"
                                    placeholder="@usuario"
                                />
                            </div>
                        </div>
                        <div className="group relative">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 block">TikTok (Opcional)</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"></path></svg>
                                </div>
                                <input
                                    type="text"
                                    value={localData.tiktok || ''}
                                    onChange={(e) => handleChange('tiktok', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl text-xl font-medium text-white focus:border-[#00f2ea] focus:bg-white/10 transition-all outline-none py-4 pl-14 pr-4 placeholder:text-white/10"
                                    placeholder="@usuario"
                                />
                            </div>
                        </div>
                        <div className="group relative">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 block">X / Twitter (Opcional)</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                                    <X className="w-6 h-6" />
                                </div>
                                <input
                                    type="text"
                                    value={localData.x || ''}
                                    onChange={(e) => handleChange('x', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl text-xl font-medium text-white focus:border-white focus:bg-white/10 transition-all outline-none py-4 pl-14 pr-4 placeholder:text-white/10"
                                    placeholder="@usuario"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between pt-12">
                    <button onClick={() => onBack(localData)} className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors">Atrás</button>
                    <button
                        onClick={() => onNext(localData)}
                        disabled={loading}
                        className="bg-emerald-500 text-black px-12 py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
                    >
                        {loading ? 'Finalizando...' : 'Finalizar Configuración'} <Check className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

