'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientShell from '@/components/ClientShell';
import Footer from '@/components/Footer';
import { Settings, Maximize2, RotateCcw, Download, Info, Zap, Ruler, Layers, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';

export default function CalculadoraCorte() {
    // Inputs
    const [sheetW, setSheetW] = useState<number>(100);
    const [sheetH, setSheetH] = useState<number>(70);
    const [cutW, setCutW] = useState<number>(9);
    const [cutH, setCutH] = useState<number>(5);
    const [margin, setMargin] = useState<number>(1);
    const [gap, setGap] = useState<number>(0.3);
    const [neededQty, setNeededQty] = useState<number>(1000);
    const [sheetPrice, setSheetPrice] = useState<number>(1500); // Cost per full sheet
    const [sellPrice, setSellPrice] = useState<number>(500); // Selling price per cut

    // Derived calculations
    const calculation = useMemo(() => {
        const effW = sheetW - (margin * 2);
        const effH = sheetH - (margin * 2);

        if (effW <= 0 || effH <= 0 || cutW <= 0 || cutH <= 0) return null;

        const calcGrid = (sW: number, sH: number, cW: number, cH: number) => {
            const cols = Math.floor((sW + gap) / (cW + gap));
            const rows = Math.floor((sH + gap) / (cH + gap));
            return { cols, rows, total: Math.max(0, cols * rows) };
        };

        const opt1 = calcGrid(effW, effH, cutW, cutH);
        const opt2 = calcGrid(effW, effH, cutH, cutW);

        const best = opt1.total >= opt2.total
            ? { ...opt1, orientation: 'normal' as const }
            : { ...opt2, orientation: 'rotated' as const };

        const totalArea = sheetW * sheetH;
        const usedArea = best.total * (cutW * cutH);
        const wastePercent = totalArea > 0 ? ((totalArea - usedArea) / totalArea) * 100 : 0;

        const totalMaterialCost = Math.ceil(neededQty / best.total) * sheetPrice;
        const totalRevenue = neededQty * sellPrice;
        const profit = totalRevenue - totalMaterialCost;

        return {
            ...best,
            sheetW,
            sheetH,
            cutW: best.orientation === 'normal' ? cutW : cutH,
            cutH: best.orientation === 'normal' ? cutH : cutW,
            origCutW: cutW,
            origCutH: cutH,
            wastePercent,
            pliegos: Math.ceil(neededQty / best.total) || 0,
            totalMaterialCost,
            totalRevenue,
            profit
        };
    }, [sheetW, sheetH, cutW, cutH, margin, gap, neededQty, sheetPrice, sellPrice]);

    const [isExporting, setIsExporting] = useState(false);

    const handleExportPDF = async () => {
        if (!calculation) return;
        setIsExporting(true);

        try {
            const studioElement = document.getElementById('studio-report-content');
            if (!studioElement) return;

            // html-to-image is much better with modern CSS colors like oklab
            const dataUrl = await htmlToImage.toPng(studioElement, {
                quality: 1.0,
                pixelRatio: 2,
                backgroundColor: '#0a0a0a'
            });

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Background color for the whole page
            pdf.setFillColor(5, 5, 5);
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

            // Add the image fitting the page
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);

            pdf.save(`Nexus-Report-${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <ClientShell>
            <main className="min-h-screen bg-[#050505] pt-20 md:pt-24 pb-10 md:pb-20 overflow-x-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFD700]/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FFA500]/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-[1700px] mx-auto px-4 relative z-10 min-h-[calc(100vh-100px)] flex flex-col pt-4">
                    {/* THE UNIFIED STUDIO BOX */}
                    <div id="studio-report-content" className="flex-1 relative group min-h-0 flex flex-col lg:flex-row bg-[#0a0a0a] rounded-3xl md:rounded-[38px] border border-white/5 overflow-hidden">

                        {/* LEFT HUD - INTELLIGENCE & PRESETS */}
                        <aside className="w-full lg:w-72 bg-black/40 backdrop-blur-2xl border-b lg:border-r lg:border-b-0 border-white/5 flex flex-col p-4 md:p-6 overflow-x-auto lg:overflow-y-auto custom-scrollbar lg:max-h-full max-h-[300px] lg:h-auto shrink-0">
                            <div className="flex lg:flex-col gap-4 lg:gap-6 min-w-max lg:min-w-0">
                                {/* Rendimiento Section */}
                                <div className="bg-white/5 rounded-2xl p-4 md:p-5 border border-white/5 w-[240px] lg:w-full shrink-0">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">Rendimiento</p>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs text-gray-400">Cortes x Pliego</span>
                                            <span className="text-xl md:text-2xl font-black text-white leading-none">{calculation?.total || 0}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-green-500">Eficiencia</span>
                                                <span className="text-green-500">{(100 - (calculation?.wastePercent || 0)).toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 transition-all duration-500"
                                                    style={{ width: `${100 - (calculation?.wastePercent || 0)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Business Intel Panel */}
                                <div className={`bg-gradient-to-br ${calculation && calculation.profit < 0 ? 'from-red-500/10' : 'from-[#FFD700]/10'} to-transparent rounded-2xl p-4 md:p-5 border ${calculation && calculation.profit < 0 ? 'border-red-500/20' : 'border-[#FFD700]/10'} w-[240px] lg:w-full shrink-0`}>
                                    <p className={`text-[10px] ${calculation && calculation.profit < 0 ? 'text-red-500' : 'text-[#FFD700]'} font-black uppercase tracking-[0.2em] mb-4`}>Business Intel</p>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase">Utilidad Estimada</p>
                                            <p className={`text-xl md:text-2xl font-black ${calculation && calculation.profit < 0 ? 'text-red-500' : 'text-green-400'}`}>
                                                ${calculation?.profit.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase">ROI Retorno</p>
                                            <p className={`text-lg md:text-xl font-black ${calculation && calculation.profit < 0 ? 'text-red-500' : 'text-white'}`}>
                                                {calculation ? ((calculation.profit / (calculation.totalMaterialCost || 1)) * 100).toFixed(0) : 0}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Industrial Presets */}
                                <div className="pt-0 lg:pt-4 w-[240px] lg:w-full shrink-0">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4 px-2">Presets</p>
                                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                                        <PresetButton label="SRA3" onClick={() => { setSheetW(45); setSheetH(32); }} />
                                        <PresetButton label="Tabloide" onClick={() => { setSheetW(48); setSheetH(33); }} />
                                        <PresetButton label="Pliego" onClick={() => { setSheetW(100); setSheetH(70); }} />
                                        <PresetButton label="M. Pliego" onClick={() => { setSheetW(70); setSheetH(50); }} />
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Premium Export Overlay */}
                        <AnimatePresence>
                            {isExporting && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
                                >
                                    <div className="relative mb-8">
                                        {/* Spinning outer rings */}
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            className="w-32 h-32 rounded-full border-t-2 border-b-2 border-[#FFD700]/30"
                                        ></motion.div>
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-2 rounded-full border-l-2 border-r-2 border-[#FFD700]/50"
                                        ></motion.div>

                                        {/* Central Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative">
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="w-12 h-12 bg-[#FFD700] rounded-2xl rotate-45 flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.5)]"
                                                >
                                                    <Zap className="w-6 h-6 text-black -rotate-45" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] italic">Generando Reporte</h3>
                                        <div className="flex flex-col items-center gap-1">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                                                Nexus está procesando su diseño...
                                            </p>
                                            <p className="text-[9px] text-gray-500 uppercase tracking-widest max-w-[250px] leading-relaxed">
                                                Optimizando geometría y análisis financiero para formato industrial.
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Progress bar simulation */}
                                    <div className="mt-8 w-48 h-[1px] bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-full h-full bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* CENTER - THE WORKSPACE/CANVAS */}
                        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#1a1a1a_2px,transparent_2px)] [background-size:40px_40px] min-h-[400px] lg:min-h-0">
                            <AnimatePresence mode="wait">
                                {calculation ? (
                                    <motion.div
                                        key={`${sheetW}-${sheetH}-${cutW}-${cutH}-${margin}`}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        transition={{ duration: 0.5, ease: "circOut" }}
                                        className="w-full h-full flex items-center justify-center p-8"
                                    >
                                        <MainLayoutPreview data={calculation} gap={gap} margin={margin} />
                                    </motion.div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                                            <Info className="text-gray-600 w-10 h-10" />
                                        </div>
                                        <p className="text-gray-500 font-light text-xl tracking-tight">Introduce dimensiones para renderizar</p>
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Simple bottom bar inside the studio */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-3 md:gap-6 px-4 md:px-6 py-2 md:py-3 bg-black/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl w-[90%] md:w-auto">
                                <DimensionTag label="Pliego" value={`${sheetW}x${sheetH}`} />
                                <div className="hidden md:block w-[1px] h-4 bg-white/10"></div>
                                <DimensionTag label="Corte" value={`${cutW}x${cutH}`} />
                                <div className="hidden md:block w-[1px] h-4 bg-white/10"></div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Req.</span>
                                    <span className="text-xs md:text-sm font-bold text-[#FFD700]">{calculation?.pliegos || 0}</span>
                                </div>
                            </div>

                            {/* Nexus Studio Watermark */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-5 pointer-events-none select-none">
                                <Zap className="w-5 h-5 text-white" />
                                <span className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">NEXUS ENGINE</span>
                            </div>

                            {/* Floating Rotate Tool */}
                            {!isExporting && (
                                <button
                                    onClick={() => {
                                        const tempW = sheetW;
                                        setSheetW(sheetH);
                                        setSheetH(tempW);
                                    }}
                                    className="absolute top-6 right-6 p-4 bg-black/40 backdrop-blur-md text-white rounded-2xl border border-white/10 hover:bg-[#FFD700] hover:text-black transition-all group/rotate shadow-2xl"
                                    title="Rotar Pliego"
                                >
                                    <RotateCcw className="w-5 h-5 group-active/rotate:rotate-180 transition-transform" />
                                </button>
                            )}
                        </div>

                        {/* RIGHT SIDEBAR - CONTROLS */}
                        <aside className="w-full lg:w-80 bg-black/40 backdrop-blur-2xl border-t lg:border-l lg:border-t-0 border-white/5 p-4 md:p-6 overflow-y-auto custom-scrollbar lg:h-auto shrink-0">
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-8">
                                    <div>
                                        <p className="text-[10px] text-[#FFD700] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <Layers className="w-3 h-3" /> Configuración
                                        </p>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <StudioInput label="Ancho Pliego" value={sheetW} onChange={setSheetW} />
                                                <StudioInput label="Largo Pliego" value={sheetH} onChange={setSheetH} />
                                            </div>
                                            <div className="h-[1px] bg-white/5 my-4"></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <StudioInput label="Ancho Corte" value={cutW} onChange={setCutW} />
                                                <StudioInput label="Largo Corte" value={cutH} onChange={setCutH} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:border-l lg:border-l-0 md:pl-6 lg:pl-0 border-white/5">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <Settings className="w-3 h-3" /> Ajustes Técnicos
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <StudioInput label="Márgenes" value={margin} onChange={setMargin} />
                                            <StudioInput label="Calle (Gap)" value={gap} onChange={setGap} />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <p className="text-[10px] text-[#FFD700] font-black uppercase tracking-[0.2em] mb-6">Producción & Costos</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                                        <StudioInput label="Tiraje Deseado" value={neededQty} onChange={setNeededQty} highlight />
                                        <div className="grid grid-cols-2 gap-4">
                                            <StudioInput label="Costo Pliego" value={sheetPrice} onChange={setSheetPrice} />
                                            <StudioInput label="Venta Unidad" value={sellPrice} onChange={setSellPrice} />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
                                    <Info className="w-4 h-4 text-gray-500" />
                                    <p className="text-[10px] text-gray-500 italic leading-snug">
                                        Tip: Nexus optimiza la rotación para maximizar el ROI.
                                    </p>
                                </div>

                                <button
                                    onClick={handleExportPDF}
                                    disabled={isExporting}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black text-[11px] font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl uppercase tracking-[0.1em] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isExporting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Download className="w-4 h-4" />
                                    )}
                                    {isExporting ? 'Generando...' : 'Exportar Registro PDF'}
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </ClientShell>
    );
}

function StudioInput({ label, value, onChange, highlight = false }: { label: string, value: number, onChange: (v: number) => void, highlight?: boolean }) {
    const [localValue, setLocalValue] = useState<string>(value.toString());

    // Sincronizar estado local cuando el valor cambia externamente (ej. Presets)
    useEffect(() => {
        if (value !== Number(localValue)) {
            setLocalValue(value.toString());
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalValue(val);

        // Solo enviamos el cambio al padre si es un número válido
        if (val !== '' && !isNaN(Number(val))) {
            onChange(Number(val));
        } else if (val === '') {
            onChange(0); // Para cálculos internos, el vacío es 0
        }
    };

    return (
        <div className="space-y-1.5 group">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block transition-colors group-focus-within:text-[#FFD700] ml-1">{label}</label>
            <div className={`relative flex items-center ${highlight ? 'bg-[#FFD700]/10 border-[#FFD700]/30' : 'bg-black/40 border-white/10'} border rounded-xl overflow-hidden transition-all focus-within:border-[#FFD700] focus-within:ring-1 focus-within:ring-[#FFD700]/30`}>
                <input
                    type="text"
                    inputMode="decimal"
                    value={localValue}
                    onFocus={(e) => e.target.select()}
                    onChange={handleChange}
                    onBlur={() => {
                        // Al salir del campo, si está vacío, restaurar a 0
                        if (localValue === '') {
                            setLocalValue('0');
                        }
                    }}
                    className="w-full bg-transparent px-3 py-2.5 text-white text-sm font-bold focus:outline-none"
                />
            </div>
        </div>
    );
}

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black text-gray-500 hover:text-white hover:border-[#FFD700]/50 hover:bg-[#FFD700]/10 transition-all uppercase tracking-widest text-left"
        >
            {label}
        </button>
    );
}

function DimensionTag({ label, value }: { label: string, value: string | number }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white/20 uppercase">{label}</span>
            <span className="text-sm font-mono text-[#FFD700]">{value}</span>
        </div>
    );
}

function MainLayoutPreview({ data, gap, margin }: { data: any, gap: number, margin: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            const container = containerRef.current;
            if (!container) return;
            const padW = container.clientWidth < 600 ? 120 : 180;
            const padH = container.clientHeight < 400 ? 120 : 180;

            const s = Math.min(
                (container.clientWidth - padW) / data.sheetW,
                (container.clientHeight - padH) / data.sheetH
            );
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
    const drawCutW = data.cutW * scale;
    const drawCutH = data.cutH * scale;

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center">
            <div className="relative" style={{ width: vSheetW, height: vSheetH }}>
                {/* Main Sheet */}
                <div className="absolute inset-0 bg-white shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex items-center justify-center rounded-sm">
                    {/* Perspective shadow */}
                    <div className="absolute -bottom-10 left-10 right-10 h-2 bg-black/40 blur-2xl rounded-full"></div>

                    {/* Margin area */}
                    <div className="absolute bg-[#F5F5F5] border-2 border-dashed border-gray-300"
                        style={{ inset: vMargin }}>
                    </div>

                    {/* Grid of Cuts */}
                    <div
                        className="relative flex flex-wrap content-start"
                        style={{
                            width: data.cols * (drawCutW + vGap) - vGap,
                            height: data.rows * (drawCutH + vGap) - vGap,
                            gap: vGap
                        }}
                    >
                        {Array.from({ length: Math.min(data.total, 400) }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{
                                    scale: 1.1,
                                    zIndex: 50,
                                    boxShadow: "0 10px 25px rgba(255, 215, 0, 0.4)"
                                }}
                                className="relative bg-[#FFD700] rounded-[2px] border-[0.5px] border-black/10 cursor-pointer overflow-hidden flex items-center justify-center group/cut"
                                style={{ width: drawCutW, height: drawCutH }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FF4500] opacity-0 group-hover/cut:opacity-100 transition-all duration-300"></div>
                                <span className="relative z-20 text-[7px] text-black font-black opacity-30 group-hover/cut:opacity-80 transition-all">
                                    {i + 1}
                                </span>
                                <div className="absolute inset-0 translate-x-[-100%] group-hover/cut:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Vertical Ruler */}
                <div className="absolute top-0 -left-12 bottom-0 w-6 border-r border-[#FFD700]/30 flex flex-col justify-between py-1 pr-2">
                    <div className="w-full h-[1px] bg-[#FFD700]/40"></div>
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-[12px] text-[#FFD700] font-mono font-bold -rotate-90 whitespace-nowrap">{data.sheetH} cm</span>
                    </div>
                    <div className="w-full h-[1px] bg-[#FFD700]/40"></div>
                </div>

                {/* Horizontal Ruler */}
                <div className="absolute -top-12 left-0 right-0 h-6 border-b border-[#FFD700]/30 flex justify-between px-1 pb-2">
                    <div className="w-[1px] h-full bg-[#FFD700]/40"></div>
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-[12px] text-[#FFD700] font-mono font-bold uppercase tracking-widest">{data.sheetW} cm</span>
                    </div>
                    <div className="w-[1px] h-full bg-[#FFD700]/40"></div>
                </div>
            </div>
        </div>
    );
}
