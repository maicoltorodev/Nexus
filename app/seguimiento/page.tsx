'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getProyectoByCedula, uploadArchivo } from '@/lib/actions';
import { Search, Loader2, Calendar, CheckCircle2, FileText, ChevronRight, Layout, Upload, Sparkles, Rocket, Zap, Terminal, Smartphone, X, AlertCircle, Lock, ShieldBan, ExternalLink, Link2, Plus, Trash2, Image as ImageIcon, GripVertical, Check, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NEXUS_PLANS_ARRAY } from '@/lib/constants';

const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB
const MAX_PROJECT_SIZE = 50 * 1024 * 1024; // 50MB
const TOTAL_STEPS = 8;

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
                                <span className="text-[10px] font-black tracking-[0.2em] text-gray-300 uppercase">Acceso Seguro</span>
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                                Nexus<span className="text-[#FFD700]">Portal</span>
                            </h1>
                            <p className="text-gray-400 text-lg">Tu visión, en tiempo real.</p>
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
                                        placeholder="Ingresa tu ID de Cliente"
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
                                                {proj.onboardingStep >= TOTAL_STEPS ? 'Activo' : 'Setup'}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-white mb-2 leading-tight">{proj.nombre}</h3>
                                        <p className="text-sm text-gray-500 font-medium mb-6">Plan {proj.plan}</p>

                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 group-hover:text-white transition-colors">
                                            <span>Ver Dashboard</span>
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

    return (
        <main className="bg-[#050505] min-h-screen text-white relative selection:bg-[#FFD700] selection:text-black">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none fixed"></div>

            {/* Dynamic Background */}
            <div className="fixed top-0 left-0 w-full h-[800px] bg-gradient-to-b from-blue-900/10 via-purple-900/5 to-transparent pointer-events-none" />
            <div className="fixed -top-[200px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#FFD700] opacity-[0.02] blur-[150px] rounded-full pointer-events-none" />

            <Navbar />

            <section className="pt-48 pb-24 px-4 relative z-10 w-full max-w-[1600px] mx-auto">

                {/* HERO SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center mb-32">
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/5 backdrop-blur-md mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD700]"></span>
                            </span>
                            <span className="text-xs font-black text-[#FFD700] uppercase tracking-[0.2em]">En Construcción</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 tracking-tighter leading-[0.9]"
                        >
                            {data.nombre.split(' ')[0]},<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">tu web en</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl leading-relaxed"
                        >
                            Hola <span className="text-white">{data.nombre.split(' ')[0]}</span>. Todo el equipo de Nexus está trabajando en este momento en tu proyecto. Aquí puedes ver el progreso en tiempo real.
                        </motion.p>
                    </div>

                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <CountdownTimer targetDate={new Date(new Date(proyecto.createdAt).getTime() + 48 * 60 * 60 * 1000)} />
                    </div>
                </div>

                {/* STATUS BAR (Glassmorphism Dock) */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="sticky top-8 z-40 mb-24"
                >
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-3 shadow-2xl max-w-5xl mx-auto flex flex-col md:flex-row gap-2 md:gap-8 items-center justify-between">

                        {/* Status Item */}
                        <div className="flex items-center gap-4 px-6 py-2 w-full md:w-auto">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                {proyecto.estado === 'completado' ? <CheckCircle2 className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Estado</p>
                                <p className="text-sm font-bold text-white capitalize">{proyecto.estado || 'Iniciado'}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex-1 w-full md:w-auto px-6 border-l border-r border-white/5 flex flex-col justify-center">
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">Progreso General</p>
                                <p className="text-sm font-black text-white">{proyecto.progreso}%</p>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${proyecto.progreso}%` }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="h-full bg-[#FFD700] box-shadow-[0_0_20px_#FFD700]"
                                />
                            </div>
                        </div>

                        {/* Link Button */}
                        <div className="p-2 w-full md:w-auto">
                            {proyecto.link && proyecto.link !== 'Próximamente' ? (
                                <a href={proyecto.link.startsWith('http') ? proyecto.link : `https://${proyecto.link}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-transform w-full">
                                    <Globe className="w-4 h-4" />
                                    Visitar Sitio
                                </a>
                            ) : (
                                <button disabled className="flex items-center justify-center gap-3 bg-white/5 text-gray-500 px-6 py-3 rounded-2xl font-bold text-sm w-full cursor-not-allowed">
                                    <Lock className="w-4 h-4" />
                                    En Desarrollo
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>


                {/* CONTENT GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                    {/* CARD 1: IDENTITY */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group hover:border-[#FFD700]/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                            <FileText className="w-24 h-24 text-[#FFD700] transform rotate-12 translate-x-8 -translate-y-8" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-8">Identidad</h3>
                        <div className="space-y-8 relative z-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Marca</p>
                                <p className="text-3xl font-black text-white">{proyecto.onboardingData?.nombreComercial || '...'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Esencia</p>
                                <p className="text-lg text-gray-300 font-medium leading-relaxed">{proyecto.onboardingData?.descripcion || 'Pendiente'}</p>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: BRANDING (Visual) */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500 flex flex-col">
                        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-purple-900/10 to-transparent opacity-50 pointer-events-none" />
                        <h3 className="text-2xl font-black text-white mb-8 relative z-10">Branding</h3>

                        <div className="flex-1 flex items-center justify-center min-h-[200px] bg-black/40 rounded-3xl border border-white/5 relative group-hover:bg-black/60 transition-colors">
                            {hasLogo ? (
                                <img src={proyecto.onboardingData.logo} className="max-w-[80%] max-h-[160px] object-contain drop-shadow-2xl" />
                            ) : (
                                <div className="text-center">
                                    <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-gray-600 uppercase">Sin Logo</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CARD 3: CONTACT & SERVICES */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500 row-span-2">
                        <h3 className="text-2xl font-black text-white mb-8">Detalles</h3>

                        <div className="space-y-8 mb-12">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Contacto</p>
                                <div className="flex flex-col gap-3">
                                    <a href={`mailto:${proyecto.onboardingData?.contactoEmail}`} className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><ExternalLink className="w-3 h-3" /></div>
                                        <span className="font-bold text-sm truncate">{proyecto.onboardingData?.contactoEmail || '-'}</span>
                                    </a>
                                    <div className="flex items-center gap-3 text-white">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Smartphone className="w-3 h-3" /></div>
                                        <span className="font-bold text-sm">{proyecto.onboardingData?.contactoTel || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Servicios ({totalServices})</p>
                            </div>
                            <div className="space-y-3">
                                {proyecto.onboardingData?.services?.map((s: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition-colors">
                                        <div className="w-10 h-10 rounded-xl bg-black border border-white/10 overflow-hidden flex-shrink-0">
                                            {s.image ? <img src={s.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-600" /></div>}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{s.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

            </section>

            <Footer />
        </main>
    );
}

// --- SUB-COMPONENTS ---

function CountdownTimer({ targetDate }: { targetDate: Date }) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + Math.floor(distance / (1000 * 60 * 60 * 24)) * 24;
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft({ hours, minutes, seconds });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex gap-4 md:gap-8">
            <TimeBox value={timeLeft.hours} label="Horas" />
            <div className="text-5xl md:text-8xl font-black text-[#FFD700] animate-pulse flex items-start pt-4">:</div>
            <TimeBox value={timeLeft.minutes} label="Min" />
            <div className="text-5xl md:text-8xl font-black text-[#FFD700] animate-pulse flex items-start pt-4">:</div>
            <TimeBox value={timeLeft.seconds} label="Seg" />
        </div>
    );
}

function TimeBox({ value, label }: { value: number; label: string }) {
    return (
        <div className="text-center group">
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-24 h-32 md:w-40 md:h-48 flex items-center justify-center mb-4 overflow-hidden transition-transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-10px_rgba(255,215,0,0.1)]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opaicty-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-5xl md:text-8xl font-black text-white tracking-tighter z-10">
                    {value.toString().padStart(2, '0')}
                </span>
            </div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-gray-500 group-hover:text-[#FFD700] transition-colors">{label}</span>
        </div>
    );
}

// Wizard Step Component (Keeping logic, improving UI wrapper inside parent)
function WizardStep({ step, data, onNext, onBack, loading, clientName, projectId }: any) {
    const [localData, setLocalData] = useState(data);
    const [uploading, setUploading] = useState<string | null>(null);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const handleChange = (field: string, value: any) => {
        setLocalData({ ...localData, [field]: value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, context: string) => {
        const file = e.target.files?.[0];
        if (!file || !projectId) return;

        setUploading(context);
        const formData = new FormData();
        formData.append('file', file);

        let contextLabel = '';
        if (context === 'logo') {
            contextLabel = 'LOGO';
        } else {
            const index = localData.services?.findIndex((s: any) => s.id === context);
            if (index !== undefined && index !== -1) {
                contextLabel = `SERVICIO ${index + 1}`;
            } else {
                contextLabel = 'SERVICIO';
            }
        }

        try {
            const res = await uploadArchivo(formData, projectId, 'cliente', contextLabel);
            if (res.success && res.url) {
                if (context === 'logo') {
                    handleChange('logo', res.url);
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
                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">¡Hola, <span className="text-[#FFD700]">{clientName.split(' ')[0]}</span>!</h2>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Estás a punto de iniciar algo grande. Solo necesitamos configurar unos detalles básicos para que tu proyecto en <strong>Nexus</strong> despegue a la velocidad de la luz.
                </p>
                <button onClick={() => onNext({})} disabled={loading} className="group relative px-12 py-6 bg-white text-black font-black text-lg uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                    <span className="relative z-10 flex items-center gap-3">Despegar <Rocket className="w-5 h-5" /></span>
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
                        <label className="text-xs font-black uppercase tracking-widest text-[#FFD700] mb-4 block">Nombre de tu Marca</label>
                        <input
                            type="text"
                            value={localData.nombreComercial || ''}
                            onChange={(e) => handleChange('nombreComercial', e.target.value)}
                            className="w-full bg-transparent border-b-2 border-white/10 text-4xl md:text-6xl font-black text-white focus:border-[#FFD700] transition-colors outline-none py-4 placeholder:text-white/10"
                            placeholder="Tu Marca"
                            autoFocus
                        />
                    </div>
                    <div className="group">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 block">Slogan (Opcional)</label>
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
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-white mb-2">Tu Dominio en Internet</h2>
                    <p className="text-gray-400">¿Cómo quieres que te encuentren? (Ej: tupagina.com)</p>
                </div>

                <div className="space-y-8 max-w-xl mx-auto">
                    <div className="group">
                        <label className="text-xs font-black uppercase tracking-widest text-[#FFD700] mb-4 block">Opción Principal</label>
                        <div className="flex items-center bg-transparent border-b-2 border-white/10 focus-within:border-[#FFD700] transition-colors">
                            <span className="text-2xl font-black text-gray-500 mr-2">www.</span>
                            <input
                                type="text"
                                value={localData.dominioUno || ''}
                                onChange={(e) => handleChange('dominioUno', e.target.value)}
                                className="w-full bg-transparent text-2xl md:text-3xl font-black text-white outline-none py-4 placeholder:text-white/10"
                                placeholder="tuempresa"
                                autoFocus
                            />
                            <span className="text-xl font-bold text-gray-500 ml-2">.com / .co</span>
                        </div>
                    </div>
                    <div className="group">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 block">Opción Alternativa (Opcional)</label>
                        <div className="flex items-center bg-transparent border-b-2 border-white/10 focus-within:border-white transition-colors">
                            <span className="text-xl font-bold text-gray-600 mr-2">www.</span>
                            <input
                                type="text"
                                value={localData.dominioDos || ''}
                                onChange={(e) => handleChange('dominioDos', e.target.value)}
                                className="w-full bg-transparent text-xl md:text-2xl font-bold text-gray-400 outline-none py-4 placeholder:text-white/5"
                                placeholder="tuempresa-oficial"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between pt-8">
                    <button onClick={() => onBack(localData)} className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors">Atrás</button>
                    <button onClick={() => onNext(localData)} disabled={!localData.dominioUno} className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100">Continuar</button>
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

    if (step === 4) { // Servicios
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-white">Tus Servicios Principales <span className="text-sm font-bold text-gray-500 ml-2">(Opcional)</span></h2>
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
                                    placeholder="Nombre del Servicio"
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
                            No hay servicios agregados aún. Dale al "+" para empezar.
                        </div>
                    )}
                </div>

                <div className="flex justify-between pt-8">
                    <button onClick={() => onBack(localData)} className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors">Atrás</button>
                    <button onClick={() => onNext(localData)} className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform">Continuar</button>
                </div>
            </div>
        );
    }

    // Step 5: Imagenes Ref
    if (step === 5) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <h2 className="text-3xl font-black text-white">¿Tienes imágenes de referencia?</h2>
                <p className="text-gray-400">Sube fotos de tu local, productos o ejemplos visuales que te gusten.</p>
                {/* Simplified placeholder for file upload logic reuse if needed, or skip for aesthetic focus */}
                <div className="flex justify-between pt-8">
                    <button onClick={() => onBack(localData)} className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors">Atrás</button>
                    <button onClick={() => onNext(localData)} className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform">Omitir / Continuar</button>
                </div>
            </div>
        );
    }

    // Step 6: Logo
    if (step === 6) {
        return (
            <div className="text-center space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <h2 className="text-4xl font-black text-white">Tu Logotipo</h2>

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
                    <button onClick={() => onNext(localData)} className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                        {localData.logo ? 'Confirmar Logo' : 'No tengo Logo aún'}
                    </button>
                </div>
            </div>
        );
    }

    // Step 7: Final Contact
    if (step === 7) {
        return (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <h2 className="text-4xl font-black text-white">Últimos Detalles</h2>

                <div className="space-y-6">
                    <div className="group">
                        <label className="text-xs font-black uppercase tracking-widest text-[#FFD700] mb-4 block">Whatsapp / Teléfono</label>
                        <input
                            type="text"
                            value={localData.contactoTel || ''}
                            onChange={(e) => handleChange('contactoTel', e.target.value)}
                            className="w-full bg-transparent border-b-2 border-white/10 text-2xl font-bold text-white focus:border-[#FFD700] transition-colors outline-none py-4 placeholder:text-white/10"
                            placeholder="+57 300..."
                        />
                    </div>
                    <div className="group">
                        <label className="text-xs font-black uppercase tracking-widest text-[#FFD700] mb-4 block">Email de Contacto</label>
                        <input
                            type="email"
                            value={localData.contactoEmail || ''}
                            onChange={(e) => handleChange('contactoEmail', e.target.value)}
                            className="w-full bg-transparent border-b-2 border-white/10 text-2xl font-bold text-white focus:border-[#FFD700] transition-colors outline-none py-4 placeholder:text-white/10"
                            placeholder="contacto@..."
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 block">Facebook (Opcional)</label>
                            <input
                                type="text"
                                value={localData.facebook || ''}
                                onChange={(e) => handleChange('facebook', e.target.value)}
                                className="w-full bg-transparent border-b-2 border-white/10 text-xl font-medium text-gray-300 focus:border-[#FFD700] transition-colors outline-none py-4 placeholder:text-white/10"
                                placeholder="Link o Usuario"
                            />
                        </div>
                        <div className="group">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 block">Instagram (Opcional)</label>
                            <input
                                type="text"
                                value={localData.instagram || ''}
                                onChange={(e) => handleChange('instagram', e.target.value)}
                                className="w-full bg-transparent border-b-2 border-white/10 text-xl font-medium text-gray-300 focus:border-[#FFD700] transition-colors outline-none py-4 placeholder:text-white/10"
                                placeholder="@usuario"
                            />
                        </div>
                        <div className="group">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 block">TikTok (Opcional)</label>
                            <input
                                type="text"
                                value={localData.tiktok || ''}
                                onChange={(e) => handleChange('tiktok', e.target.value)}
                                className="w-full bg-transparent border-b-2 border-white/10 text-xl font-medium text-gray-300 focus:border-[#FFD700] transition-colors outline-none py-4 placeholder:text-white/10"
                                placeholder="@usuario"
                            />
                        </div>
                        <div className="group">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 block">X / Twitter (Opcional)</label>
                            <input
                                type="text"
                                value={localData.x || ''}
                                onChange={(e) => handleChange('x', e.target.value)}
                                className="w-full bg-transparent border-b-2 border-white/10 text-xl font-medium text-gray-300 focus:border-[#FFD700] transition-colors outline-none py-4 placeholder:text-white/10"
                                placeholder="@usuario"
                            />
                        </div>
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
                        disabled={loading || !localData.contactoTel || !localData.contactoEmail}
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
