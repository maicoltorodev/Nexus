'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientShell from '@/components/ClientShell';
import Footer from '@/components/Footer';
import { Settings, Maximize2, RotateCcw, Info, Zap, Ruler, Layers, BookOpen, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function CalculadoraCorte() {
    // State for Units
    const [unit, setUnit] = useState<'cm' | 'mm'>('cm');

    // Inputs with persistence
    const [sheetW, setSheetW] = useState<number>(100);
    const [sheetH, setSheetH] = useState<number>(70);
    const [cutW, setCutW] = useState<number>(9);
    const [cutH, setCutH] = useState<number>(5);
    const [margin, setMargin] = useState<number>(0);
    const [gap, setGap] = useState<number>(0);
    const [neededQty, setNeededQty] = useState<number>(1000);
    const [allowRotation, setAllowRotation] = useState<boolean>(true);
    const [showGuide, setShowGuide] = useState<boolean>(false);
    const [strategyMode, setStrategyMode] = useState<'auto' | 'manual'>('auto');

    // Persistence Effect
    useEffect(() => {
        const saved = localStorage.getItem('nexus-calc-settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSheetW(parsed.sheetW ?? 100);
                setSheetH(parsed.sheetH ?? 70);
                setCutW(parsed.cutW ?? 9);
                setCutH(parsed.cutH ?? 5);
                setMargin(parsed.margin ?? 0);
                setGap(parsed.gap ?? 0);
                setNeededQty(parsed.neededQty ?? 1000);
                setUnit(parsed.unit ?? 'cm');
                setAllowRotation(parsed.allowRotation ?? true);
                setStrategyMode(parsed.strategyMode ?? 'auto');
            } catch (e) {
                console.error("Error loading saved settings", e);
            }
        }
    }, []);

    // Conversion logic
    const toggleUnit = (newUnit: 'cm' | 'mm') => {
        if (newUnit === unit) return;
        const conv = newUnit === 'mm' ? 10 : 0.1;
        setSheetW(prev => Number((prev * conv).toFixed(2)));
        setSheetH(prev => Number((prev * conv).toFixed(2)));
        setCutW(prev => Number((prev * conv).toFixed(2)));
        setCutH(prev => Number((prev * conv).toFixed(2)));
        setMargin(prev => Number((prev * conv).toFixed(2)));
        setGap(prev => Number((prev * conv).toFixed(2)));
        setUnit(newUnit);
    };

    useEffect(() => {
        const settings = { sheetW, sheetH, cutW, cutH, margin, gap, neededQty, unit, allowRotation, strategyMode };
        localStorage.setItem('nexus-calc-settings', JSON.stringify(settings));
    }, [sheetW, sheetH, cutW, cutH, margin, gap, neededQty, unit, allowRotation, strategyMode]);

    // Derived calculations
    const calculation = useMemo(() => {
        const effW = sheetW - (margin * 2);
        const effH = sheetH - (margin * 2);

        if (effW <= 0 || effH <= 0 || cutW <= 0 || cutH <= 0) return null;

        const getLayout = (sW: number, sH: number, cW: number, cH: number) => {
            const maxCols = Math.floor((sW + gap) / (cW + gap));
            const maxRows = Math.floor((sH + gap) / (cH + gap));

            // Basic check
            if (maxCols <= 0 || maxRows <= 0) return { total: 0, parts: [] };

            // If rotation is NOT allowed, the greedy max grid is always optimal 
            // because we can't use the remainder for anything else.
            if (!allowRotation) {
                const mainTotal = maxCols * maxRows;
                const mainPart = { type: 'main', cols: maxCols, rows: maxRows, w: cW, h: cH, total: mainTotal, x: 0, y: 0 };
                return { total: mainTotal, parts: [mainPart] };
            }

            let bestResult = { total: -1, parts: [] as any[] };

            // Iterative Optimization:
            // Check all reasonable main grid sizes (from max down to 0).
            // Sometimes a smaller main grid leaves a remainder that fits MORE rotated pieces.
            for (let c = maxCols; c >= 0; c--) {
                for (let r = maxRows; r >= 0; r--) {
                    if (c === 0 && r === 0) continue;

                    const currentMainTotal = c * r;
                    const usedW = c > 0 ? c * (cW + gap) - gap : 0;
                    const usedH = r > 0 ? r * (cH + gap) - gap : 0;

                    const mainPart = { type: 'main', cols: c, rows: r, w: cW, h: cH, total: currentMainTotal, x: 0, y: 0 };

                    // Coordinates for the remaining space
                    // If main block exists (c>0), the remainder starts after (usedW + gap).
                    // If no main block, remainder starts at 0.
                    const rightX = c > 0 ? usedW + gap : 0;
                    const rightW = Math.max(0, sW - rightX);

                    const bottomY = r > 0 ? usedH + gap : 0;
                    const bottomH = Math.max(0, sH - bottomY);

                    // --- Strategy 1: Right Strip (Full Height) + Bottom Left (Under Main) ---
                    // Right Strip: x=rightX, y=0, w=rightW, h=sH (Full Height)
                    // Bottom Left: x=0, y=bottomY, w=usedW, h=bottomH 

                    const s1_r_cols = Math.floor((rightW + gap) / (cH + gap));
                    const s1_r_rows = Math.floor((sH + gap) / (cW + gap));
                    const s1_r_total = Math.max(0, s1_r_cols * s1_r_rows);

                    // Note: Bottom Left width is technically 'usedW', but we must ensure we don't overlap.
                    // If c=0, usedW=0, so bottom left is empty. Correct.
                    const s1_b_cols = Math.floor((usedW + gap) / (cH + gap));
                    const s1_b_rows = Math.floor((bottomH + gap) / (cW + gap));
                    const s1_b_total = Math.max(0, s1_b_cols * s1_b_rows);

                    const total1 = currentMainTotal + s1_r_total + s1_b_total;

                    // --- Strategy 2: Bottom Strip (Full Width) + Top Right (Next to Main) ---
                    // Bottom Strip: x=0, y=bottomY, w=sW (Full Width), h=bottomH
                    // Top Right: x=rightX, y=0, w=rightW, h=usedH

                    const s2_b_cols = Math.floor((sW + gap) / (cH + gap));
                    const s2_b_rows = Math.floor((bottomH + gap) / (cW + gap));
                    const s2_b_total = Math.max(0, s2_b_cols * s2_b_rows);

                    const s2_r_cols = Math.floor((rightW + gap) / (cH + gap));
                    const s2_r_rows = Math.floor((usedH + gap) / (cW + gap));
                    const s2_r_total = Math.max(0, s2_r_cols * s2_r_rows);

                    const total2 = currentMainTotal + s2_b_total + s2_r_total;

                    // Compare and update best
                    if (total1 >= total2 && total1 >= bestResult.total) { // Prefer S1 if equal or better
                        const parts = [mainPart];
                        if (s1_r_total > 0) parts.push({ type: 'extra', cols: s1_r_cols, rows: s1_r_rows, w: cH, h: cW, total: s1_r_total, x: rightX, y: 0 });
                        if (s1_b_total > 0) parts.push({ type: 'extra', cols: s1_b_cols, rows: s1_b_rows, w: cH, h: cW, total: s1_b_total, x: 0, y: bottomY });
                        bestResult = { total: total1, parts };
                    }
                    else if (total2 > total1 && total2 > bestResult.total) {
                        const parts = [mainPart];
                        if (s2_b_total > 0) parts.push({ type: 'extra', cols: s2_b_cols, rows: s2_b_rows, w: cH, h: cW, total: s2_b_total, x: 0, y: bottomY });
                        if (s2_r_total > 0) parts.push({ type: 'extra', cols: s2_r_cols, rows: s2_r_rows, w: cH, h: cW, total: s2_r_total, x: rightX, y: 0 });
                        bestResult = { total: total2, parts };
                    }
                }
            }
            return bestResult.total !== -1 ? bestResult : { total: 0, parts: [] };
        };

        const layout1 = getLayout(effW, effH, cutW, cutH);
        const layout2 = allowRotation ? getLayout(effW, effH, cutH, cutW) : { total: 0, parts: [] };

        const best = layout1.total >= layout2.total ? layout1 : layout2;

        const totalArea = sheetW * sheetH;
        const usedArea = best.total * (cutW * cutH);
        const wastePercent = totalArea > 0 ? ((totalArea - usedArea) / totalArea) * 100 : 0;

        const pliegosCalculados = Math.ceil(neededQty / Math.max(1, best.total)) || 0;
        const totalYield = pliegosCalculados * best.total;
        const extraQty = totalYield - neededQty;

        return {
            ...best,
            sheetW,
            sheetH,
            origCutW: cutW,
            origCutH: cutH,
            wastePercent,
            pliegos: pliegosCalculados,
            extraQty
        };
    }, [sheetW, sheetH, cutW, cutH, margin, gap, neededQty, allowRotation]);

    return (
        <ClientShell>
            <main className="min-h-screen bg-[#050505] pt-20 md:pt-24 pb-10 md:pb-20 overflow-x-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFD700]/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FFA500]/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-[1700px] mx-auto px-4 relative z-10 min-h-[calc(100vh-100px)] flex flex-col pt-4">
                    <div id="studio-report-content" className="flex-1 relative group min-h-0 flex flex-col lg:flex-row bg-[#0a0a0a] rounded-3xl md:rounded-[38px] border border-white/5 overflow-hidden">

                        {/* LEFT HUD - INTELLIGENCE & PRESETS */}
                        <aside className="w-full lg:w-72 bg-black/40 backdrop-blur-2xl border-b lg:border-r lg:border-b-0 border-white/5 flex flex-col p-4 md:p-6 overflow-x-auto lg:overflow-y-auto custom-scrollbar lg:max-h-full max-h-[300px] lg:h-auto shrink-0">
                            <div className="flex lg:flex-col gap-4 lg:gap-6 min-w-max lg:min-w-0">

                                <div className="mt-6 space-y-6">
                                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-1.5 overflow-hidden w-[240px] lg:w-full shrink-0">
                                        <div className="flex p-1 gap-1 bg-white/5 rounded-[26px] mb-2">
                                            <button onClick={() => { setStrategyMode('auto'); setAllowRotation(true); }} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-tighter transition-all ${strategyMode === 'auto' ? 'bg-[#FFD700] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}><Zap className="w-3.5 h-3.5" /> Auto Pro</button>
                                            <button onClick={() => { setStrategyMode('manual'); setAllowRotation(false); }} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-tighter transition-all ${strategyMode === 'manual' ? 'bg-[#FFA500] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}><Ruler className="w-3.5 h-3.5" /> Manual</button>
                                        </div>
                                        <div className="px-4 py-2 space-y-3">
                                            <p className="text-[10px] text-white font-black uppercase italic tracking-tight">{strategyMode === 'auto' ? "Optimización Inteligente" : "Control de Fibra Activo"}</p>
                                            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{strategyMode === 'auto' ? "Nexus buscará el mejor rendimiento rotando piezas automáticamente." : "Posición estricta. Usa los controles para orientar el diseño."}</p>
                                            <AnimatePresence>
                                                {strategyMode === 'manual' && (
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2">
                                                        <button onClick={() => { setSheetW(sheetH); setSheetH(sheetW); }} className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/10 transition-all group"><RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-[#FFD700] mb-1" /><span className="text-[7px] font-black text-gray-500 uppercase group-hover:text-white">Girar Pliego</span></button>
                                                        <button onClick={() => { setCutW(cutH); setCutH(cutW); }} className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-[#FFA500]/50 hover:bg-[#FFA500]/10 transition-all group"><Maximize2 className="w-4 h-4 text-gray-400 group-hover:text-[#FFA500] mb-1 rotate-90" /><span className="text-[7px] font-black text-gray-500 uppercase group-hover:text-white">Girar Corte</span></button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 w-[240px] lg:w-full shrink-0">
                                        <p className="text-[10px] text-[#FFD700] font-black uppercase tracking-[0.2em] mb-4">Producción</p>
                                        <StudioInput label="Tiraje Deseado" value={neededQty} onChange={setNeededQty} highlight />
                                    </div>
                                </div>

                                <div className="pt-4 mt-auto w-[240px] lg:w-full shrink-0">
                                    <button onClick={() => setShowGuide(true)} className="w-full py-4 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#FFD700] transition-all group shadow-lg">
                                        <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        Guía de Corte
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* CENTER - THE WORKSPACE/CANVAS */}
                        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#1a1a1a_2px,transparent_2px)] [background-size:40px_40px] min-h-[400px] lg:min-h-0">

                            <AnimatePresence>
                                {showGuide && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[80] bg-black/95 backdrop-blur-xl p-6 md:p-10 overflow-y-auto custom-scrollbar">
                                        <button onClick={() => setShowGuide(false)} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"><Maximize2 className="w-6 h-6 rotate-45" /></button>
                                        <div className="max-w-3xl mx-auto space-y-12 py-10">
                                            <div className="text-center space-y-4">
                                                <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase">Guía Maestra de Corte</h2>
                                                <p className="text-gray-400 text-sm md:text-base leading-relaxed">Entiende la diferencia entre la matemática del algoritmo y la realidad de la imprenta.</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-4">
                                                    <div className="w-12 h-12 bg-[#FFD700]/20 rounded-2xl flex items-center justify-center"><Zap className="w-6 h-6 text-[#FFD700]" /></div>
                                                    <h3 className="text-lg font-black text-white uppercase tracking-widest">Sentido de Fibra</h3>
                                                    <p className="text-xs text-gray-400 leading-relaxed">El papel tiene "vetas" como la madera. Al doblarlo a favor de la fibra, el acabado es perfecto.</p>
                                                    <div className="flex items-center gap-2 text-[10px] text-green-400 font-bold uppercase"><CheckCircle2 className="w-3 h-3" /> Tip: Desactiva "Permitir Rotación" si tienes fibra obligatoria.</div>
                                                </div>
                                                <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-4">
                                                    <div className="w-12 h-12 bg-[#FFA500]/20 rounded-2xl flex items-center justify-center"><Settings className="w-6 h-6 text-[#FFA500]" /></div>
                                                    <h3 className="text-lg font-black text-white uppercase tracking-widest">Pinzas de Máquina</h3>
                                                    <p className="text-xs text-gray-400 leading-relaxed">Las máquinas de imprenta necesitan un borde (usualmente 1cm) para "sujetar" el papel.</p>
                                                    <div className="flex items-center gap-2 text-[10px] text-[#FFA500] font-bold uppercase"><AlertTriangle className="w-3 h-3" /> Ojo: Revisa el manual de tu máquina antes de imprimir.</div>
                                                </div>
                                            </div>
                                            <div className="bg-[#FFD700] p-8 rounded-[38px] text-black">
                                                <h4 className="text-xl font-black uppercase tracking-tighter italic mb-4">¿Por qué usar el Modo Inteligente?</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="space-y-2"><p className="text-xs font-black uppercase opacity-60">01. Máximo Aprovechamiento</p><p className="text-[10px] leading-relaxed font-bold">Nexus intenta mezclar piezas verticales y horizontales para no dejar retales grandes.</p></div>
                                                    <div className="space-y-2"><p className="text-xs font-black uppercase opacity-60">02. Menos Basura</p><p className="text-[10px] leading-relaxed font-bold">Calcula la merma exacta en dinero para que sepas cuánto estás perdiendo por pliego.</p></div>
                                                    <div className="space-y-2"><p className="text-xs font-black uppercase opacity-60">03. Realidad Técnica</p><p className="text-[10px] leading-relaxed font-bold">Si una pieza no cabe por 1mm, el algoritmo la descarta para evitar problemas en guillotina.</p></div>
                                                </div>
                                                <button onClick={() => setShowGuide(false)} className="mt-8 w-full py-4 bg-black text-white text-xs font-black rounded-2xl flex items-center justify-center gap-2 hover:gap-4 transition-all uppercase tracking-widest">Entendido, volver a la mesa de trabajo <ArrowRight className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                {calculation ? (
                                    <MainLayoutPreview data={calculation} gap={gap} margin={margin} unit={unit} strategyMode={strategyMode} />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10"><Info className="text-gray-600 w-10 h-10" /></div>
                                        <p className="text-gray-500 font-light text-xl tracking-tight">Introduce dimensiones para renderizar</p>
                                    </div>
                                )}
                            </AnimatePresence>

                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-3 md:gap-6 px-4 md:px-6 py-2 md:py-3 bg-black/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl w-[90%] md:w-auto">
                                <DimensionTag label="Pliego" value={`${sheetW}x${sheetH}`} />
                                <div className="hidden md:block w-[1px] h-4 bg-white/10"></div>
                                <DimensionTag label="Corte" value={`${cutW}x${cutH}`} />
                                <div className="hidden md:block w-[1px] h-4 bg-white/10"></div>
                                <div className="flex items-center gap-2"><span className="text-[10px] font-bold text-gray-500 uppercase">Req.</span><span className="text-xs md:text-sm font-bold text-[#FFD700]">{calculation?.pliegos || 0}</span></div>
                            </div>

                            <div className="absolute top-6 left-6 flex bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-1 shadow-2xl z-[70]">
                                {(['cm', 'mm'] as const).map((u) => (
                                    <button key={u} onClick={() => toggleUnit(u)} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${unit === u ? 'bg-[#FFD700] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>{u}</button>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR - CONTROLS */}
                        <aside className="w-full lg:w-80 bg-black/40 backdrop-blur-2xl border-t lg:border-l lg:border-t-0 border-white/5 p-4 md:p-6 overflow-y-auto custom-scrollbar lg:h-auto shrink-0">
                            <div className="space-y-8">

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] text-[#FFD700] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><Layers className="w-3 h-3" /> Configuración</p>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4"><StudioInput label="Ancho Pliego" value={sheetW} onChange={setSheetW} /><StudioInput label="Largo Pliego" value={sheetH} onChange={setSheetH} /></div>
                                            <div className="h-[1px] bg-white/5 my-4"></div>
                                            <div className="grid grid-cols-2 gap-4"><StudioInput label="Ancho Corte" value={cutW} onChange={setCutW} /><StudioInput label="Largo Corte" value={cutH} onChange={setCutH} /></div>
                                            <div className="h-[1px] bg-white/5 my-4"></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2 text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><Settings className="w-3 h-3" /> Ajustes Técnicos</div>
                                                <StudioInput label="Márgenes" value={margin} onChange={setMargin} />
                                                <StudioInput label="Calle (Gap)" value={gap} onChange={setGap} />
                                            </div>

                                            <div className="pt-6 mt-6 border-t border-white/5">
                                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">Rendimiento</p>
                                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-4">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-xs text-gray-400">Cortes x Pliego</span>
                                                        <span className="text-xl md:text-2xl font-black text-white leading-none">{calculation?.total || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between items-end pt-2 border-t border-white/5">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold">Sobra (Demasía)</span>
                                                        <span className="text-sm font-black text-green-400">+{calculation?.extraQty || 0}</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px]">
                                                            <span className="text-green-500">Eficiencia</span>
                                                            <span className="text-green-500">{(100 - (calculation?.wastePercent || 0)).toFixed(1)}%</span>
                                                        </div>
                                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${100 - (calculation?.wastePercent || 0)}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div >
            </main >
            <Footer />
        </ClientShell >
    );
}

function StudioInput({ label, value, onChange, highlight = false, step = 1 }: { label: string, value: number, onChange: (v: number) => void, highlight?: boolean, step?: number }) {
    const [localValue, setLocalValue] = useState<string>(value.toString());
    useEffect(() => { if (value !== Number(localValue)) setLocalValue(value.toString()); }, [value]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
            setLocalValue(val);
            if (val !== '' && val !== '-' && val !== '.') onChange(Number(val));
        }
    };
    const handleStep = (delta: number) => { const newValue = Math.max(0, value + delta); onChange(newValue); setLocalValue(newValue.toString()); };
    return (
        <div className="space-y-1.5 group">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block transition-colors group-focus-within:text-[#FFD700] ml-1">{label}</label>
            <div className={`relative flex items-center ${highlight ? 'bg-[#FFD700]/10 border-[#FFD700]/30' : 'bg-black/40 border-white/10'} border rounded-xl overflow-hidden transition-all focus-within:border-[#FFD700] focus-within:ring-1 focus-within:ring-[#FFD700]/30`}>
                <button onClick={() => handleStep(-step)} className="px-2 text-gray-600 hover:text-[#FFD700] transition-colors">-</button>
                <input type="text" inputMode="decimal" value={localValue} onFocus={(e) => e.target.select()} onChange={handleChange} onBlur={() => { if (localValue === '' || isNaN(Number(localValue))) { setLocalValue('0'); onChange(0); } }} className="w-full bg-transparent px-1 py-2.5 text-white text-sm font-bold focus:outline-none text-center" />
                <button onClick={() => handleStep(step)} className="px-2 text-gray-600 hover:text-[#FFD700] transition-colors">+</button>
            </div>
        </div>
    );
}


function DimensionTag({ label, value }: { label: string, value: string | number }) {
    return <div className="flex items-center gap-2"><span className="text-[10px] font-bold text-white/20 uppercase">{label}</span><span className="text-sm font-mono text-[#FFD700]">{value}</span></div>;
}
function MainLayoutPreview({ data, gap, margin, unit, strategyMode }: { data: any, gap: number, margin: number, unit: string, strategyMode: 'auto' | 'manual' }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            const container = containerRef.current;
            if (!container) return;
            const padW = container.clientWidth < 600 ? 120 : 180;
            const padH = container.clientHeight < 400 ? 120 : 180;
            const s = Math.min((container.clientWidth - padW) / data.sheetW, (container.clientHeight - padH) / data.sheetH);
            setScale(s);
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [data.sheetW, data.sheetH]);

    const vSheetW = data.sheetW * scale;
    const vSheetH = data.sheetH * scale;
    const vMargin = margin * scale;
    const vGap = gap * scale;

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center">
            <div className="relative" style={{ width: vSheetW, height: vSheetH }}>
                <div className="absolute inset-0 bg-[#f0f0f0] shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex items-center justify-center rounded-sm overflow-hidden border border-gray-300">
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)`, backgroundSize: '8px 8px' }}></div>
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`, backgroundSize: `${1 * scale}px ${1 * scale}px` }}></div>
                    <div className={`absolute shadow-2xl overflow-hidden transition-all ${margin > 0 ? 'bg-white border-[1.5px] border-dashed border-pink-500/40' : ''}`} style={{ inset: vMargin }}>
                        <div className="relative w-full h-full bg-gray-900/5">
                            {data.parts.map((part: any, pIdx: number) => {
                                const startOffset = data.parts.slice(0, pIdx).reduce((acc: number, p: any) => acc + p.total, 0);
                                return (
                                    <div key={pIdx} className="absolute flex flex-wrap content-start" style={{ left: part.x * scale, top: part.y * scale, width: part.cols * (part.w * scale + vGap), gap: vGap }}>
                                        {Array.from({ length: Math.min(part.total, 400) }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="relative bg-[#FFD700] border-[#B8860B]/40 rounded-[1.5px] border-[1px] cursor-pointer overflow-hidden flex items-center justify-center group/cut shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all duration-300 hover:border-[#FF4500]/50"
                                                style={{ width: part.w * scale, height: part.h * scale }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00] via-[#FF4500] to-[#E31E24] opacity-0 group-hover/cut:opacity-100 transition-opacity duration-300 ease-in-out" />
                                                <div
                                                    className="absolute inset-0 pointer-events-none z-10 transition-all duration-500"
                                                    style={{
                                                        opacity: strategyMode === 'manual' ? 0.22 : 0.1,
                                                        backgroundImage: part.w > part.h
                                                            ? 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.5) 11px, rgba(0,0,0,0.5) 12px)'
                                                            : 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.5) 11px, rgba(0,0,0,0.5) 12px)',
                                                        backgroundSize: part.w > part.h ? '100% 12px' : '12px 100%'
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-0"></div>
                                                <div className="absolute bottom-1 right-1 opacity-0 group-hover/cut:opacity-100 transition-all duration-300 z-20 scale-90">{part.w > part.h ? <ArrowRight className="w-3 h-3 text-white" /> : <ArrowRight className="w-3 h-3 text-white rotate-90" />}</div>
                                                <span className="relative z-20 text-[7px] text-black font-black opacity-30 group-hover/cut:opacity-100 group-hover/cut:text-white transition-all duration-300">{startOffset + i + 1}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 -left-12 bottom-0 w-8 border-r border-[#FFD700]/30 flex flex-col justify-between py-1 pr-2"><div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-[12px] text-[#FFD700] font-mono font-bold -rotate-90 whitespace-nowrap bg-black/80 px-2 rounded-full border border-[#FFD700]/20">{data.sheetH} {unit}</span></div></div>
                <div className="absolute -top-12 left-0 right-0 h-8 border-b border-[#FFD700]/30 flex justify-between px-1 pb-2"><div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-[12px] text-[#FFD700] font-mono font-bold uppercase tracking-widest bg-black/80 px-2 rounded-full border border-[#FFD700]/20">{data.sheetW} {unit}</span></div></div>
                {data.parts.some((p: any) => p.total > 400) && (
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur border border-yellow-500/30 text-yellow-500 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 shadow-xl z-50">
                        <AlertTriangle className="w-3 h-3" />
                        Visualización limitada (Max 400)
                    </div>
                )}
            </div>
        </div>
    );
}

