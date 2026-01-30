'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type ServiceType = 'tarjetas' | 'volantes' | 'gran-formato' | 'papeleria';

interface ServiceOption {
  id: string;
  name: string;
  material: string;
  size: string;
  priceMin: number;
  priceMax: number;
  baseQuantity: number; // Para tarjetas/volantes (1000), papeleria (100)
  unit: 'unidades' | 'm2' | 'hojas';
  specialNote?: string; // Para casos especiales como Mauro
}

interface CalculationResult {
  cantidad: number;
  precioMin: number;
  precioMax: number;
  precioPromedio: number;
  unit: string;
  material: string;
  size: string;
}

const serviceOptions = [
  {
    value: 'tarjetas',
    label: 'Tarjetas de Presentación',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    value: 'volantes',
    label: 'Volantes / Flyers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    value: 'gran-formato',
    label: 'Gran Formato',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    )
  },
  {
    value: 'papeleria',
    label: 'Papelería Comercial',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }
];

const serviceConfig: Record<ServiceType, ServiceOption[]> = {
  'tarjetas': [
    {
      id: 'propalcote-brillo',
      name: 'Propalcote 300g + Brillo UV Total',
      material: 'Propalcote 300g + Brillo UV Total',
      size: '9x5 cm',
      priceMin: 75000,
      priceMax: 85000,
      baseQuantity: 1000,
      unit: 'unidades'
    },
    {
      id: 'propalcote-mate',
      name: 'Propalcote 300g + Mate + Reserva UV',
      material: 'Propalcote 300g + Mate + Reserva UV',
      size: '9x5 cm',
      priceMin: 110000,
      priceMax: 130000,
      baseQuantity: 1000,
      unit: 'unidades'
    },
    {
      id: 'mauro',
      name: 'Mauro (Cartulina fina/texturizada)',
      material: 'Mauro (Cartulina fina/texturizada)',
      size: '9x5 cm',
      priceMin: 150000,
      priceMax: 150000,
      baseQuantity: 100,
      unit: 'unidades',
      specialNote: 'Suele ser x100 unidades'
    }
  ],
  'volantes': [
    {
      id: 'cuarto-4x0',
      name: '1/4 de Carta (4x0 tintas)',
      material: 'Propalcote 115g',
      size: '1/4 de Carta',
      priceMin: 135000,
      priceMax: 155000,
      baseQuantity: 1000,
      unit: 'unidades'
    },
    {
      id: 'medio-4x0',
      name: '1/2 Carta (4x0 tintas)',
      material: 'Propalcote 115g',
      size: '1/2 Carta',
      priceMin: 210000,
      priceMax: 240000,
      baseQuantity: 1000,
      unit: 'unidades'
    },
    {
      id: 'cuarto-4x4',
      name: '1/4 de Carta (4x4 tintas)',
      material: 'Propalcote 150g',
      size: '1/4 de Carta',
      priceMin: 180000,
      priceMax: 200000,
      baseQuantity: 1000,
      unit: 'unidades'
    }
  ],
  'gran-formato': [
    {
      id: 'banner',
      name: 'Banner / Pendón',
      material: 'Lona 13oz',
      size: 'Variable',
      priceMin: 35000,
      priceMax: 45000,
      baseQuantity: 1,
      unit: 'm2'
    },
    {
      id: 'vinilo',
      name: 'Vinilo Adhesivo',
      material: 'Brillante/Mate',
      size: 'Variable',
      priceMin: 45000,
      priceMax: 55000,
      baseQuantity: 1,
      unit: 'm2'
    },
    {
      id: 'microperforado',
      name: 'Microperforado',
      material: 'Ventanales',
      size: 'Variable',
      priceMin: 55000,
      priceMax: 70000,
      baseQuantity: 1,
      unit: 'm2'
    },
    {
      id: 'panaflex',
      name: 'Panaflex',
      material: 'Avisos luminosos',
      size: 'Variable',
      priceMin: 75000,
      priceMax: 90000,
      baseQuantity: 1,
      unit: 'm2'
    }
  ],
  'papeleria': [
    {
      id: 'cuenta-cobro',
      name: 'Cuenta de Cobro/Factura',
      material: 'Talonario',
      size: '1/2 Carta',
      priceMin: 45000,
      priceMax: 55000,
      baseQuantity: 100,
      unit: 'hojas'
    },
    {
      id: 'recetario',
      name: 'Recetario Médico',
      material: 'Talonario',
      size: '1/2 Carta',
      priceMin: 50000,
      priceMax: 65000,
      baseQuantity: 100,
      unit: 'hojas'
    }
  ]
};

interface CustomSelectProps {
  label: string;
  icon: React.ReactNode;
  options: { id: string; name: string }[] | { value: string; label: string }[];
  value: string;
  onChange: (value: any) => void;
  placeholder?: string;
}

const CustomSelect = ({ label, icon, options, value, onChange }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt: any) => (opt.id || opt.value) === value);
  const displayName = selectedLabel ? ((selectedLabel as any).name || (selectedLabel as any).label) : '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4 tracking-wide pointer-events-none">
        {label} <span className="text-[#FFD700]">*</span>
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-4 pl-5 bg-[#0a0a0a] border ${isOpen ? 'border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.1)]' : 'border-[#FFD700]/20'} rounded-xl transition-all text-white font-light cursor-pointer hover:border-[#FFD700]/40 flex items-center justify-between group`}
      >
        <span className="truncate">{displayName}</span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={isOpen ? { opacity: 1, y: 5, display: 'block' } : { opacity: 0, y: -10, transitionEnd: { display: 'none' } }}
        className="absolute z-[100] w-full mt-2 bg-[#0d0d0d] border border-[#FFD700]/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl"
      >
        <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
          {options.map((option: any) => {
            const optVal = option.id || option.value;
            const optName = option.name || option.label;
            const isSelected = optVal === value;

            return (
              <div
                key={optVal}
                onClick={() => {
                  onChange(optVal);
                  setIsOpen(false);
                }}
                className={`px-6 py-3 text-sm transition-colors cursor-pointer hover:bg-[#FFD700]/10 ${isSelected ? 'text-[#FFD700] bg-[#FFD700]/5 font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                {optName}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

const CustomNumberInput = ({ label, value, onChange, min, step, placeholder }: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  step: number;
  placeholder: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const increment = () => onChange(Number((value + step).toFixed(2)));
  const decrement = () => onChange(Number(Math.max(min, value - step).toFixed(2)));

  return (
    <div className="relative group">
      <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4 tracking-wide pointer-events-none transition-colors group-hover:text-[#FFD700]">
        {label} <span className="text-[#FFD700]">*</span>
      </label>

      <div className={`relative flex items-center bg-[#0a0a0a] border ${isFocused ? 'border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.15)]' : 'border-[#FFD700]/20'} rounded-2xl overflow-hidden transition-all duration-300`}>
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={decrement}
          className="px-6 py-4 text-[#FFD700] transition-colors border-r border-[#FFD700]/10"
          aria-label="Disminuir cantidad"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </motion.button>

        <input
          type="number"
          value={value === 0 ? '' : value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent px-4 py-4 text-white text-center font-bold text-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder={placeholder}
          min={min}
        />

        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={increment}
          className="px-6 py-4 text-[#FFD700] transition-colors border-l border-[#FFD700]/10"
          aria-label="Aumentar cantidad"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default function Calculator() {
  const [serviceType, setServiceType] = useState<ServiceType>('tarjetas');
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1000);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Inicializar con la primera opción del servicio seleccionado
  useEffect(() => {
    const options = serviceConfig[serviceType];
    if (options && options.length > 0) {
      setSelectedOptionId(options[0].id);
      // Establecer cantidad por defecto según el servicio
      if (serviceType === 'gran-formato') {
        setCantidad(1);
      } else if (serviceType === 'papeleria') {
        setCantidad(100);
      } else {
        setCantidad(1000);
      }
    }
  }, [serviceType]);

  // Resetear resultado cuando cambian los inputs
  useEffect(() => {
    setResult(null);
  }, [serviceType, selectedOptionId, cantidad]);

  const selectedOption = serviceConfig[serviceType]?.find(opt => opt.id === selectedOptionId);
  const availableOptions = serviceConfig[serviceType] || [];

  const calculatePrice = () => {
    if (!selectedOption) return;

    setIsCalculating(true);

    setTimeout(() => {
      let precioMinCalculado = 0;
      let precioMaxCalculado = 0;

      if (serviceType === 'gran-formato') {
        // Gran Formato: precio por m² × cantidad de m²
        precioMinCalculado = selectedOption.priceMin * cantidad;
        precioMaxCalculado = selectedOption.priceMax * cantidad;
      } else if (serviceType === 'papeleria') {
        // Papelería: precio por 100 hojas × (cantidad / 100)
        if (cantidad % 100 !== 0) {
          // Si no es múltiplo de 100, redondear hacia arriba
          const multiplos = Math.ceil(cantidad / 100);
          precioMinCalculado = selectedOption.priceMin * multiplos;
          precioMaxCalculado = selectedOption.priceMax * multiplos;
        } else {
          const multiplos = cantidad / 100;
          precioMinCalculado = selectedOption.priceMin * multiplos;
          precioMaxCalculado = selectedOption.priceMax * multiplos;
        }
      } else {
        // Tarjetas y Volantes: precio base por baseQuantity, calcular proporcionalmente
        const ratio = cantidad / selectedOption.baseQuantity;
        precioMinCalculado = selectedOption.priceMin * ratio;
        precioMaxCalculado = selectedOption.priceMax * ratio;
      }

      const precioPromedio = (precioMinCalculado + precioMaxCalculado) / 2;

      setResult({
        cantidad,
        precioMin: precioMinCalculado,
        precioMax: precioMaxCalculado,
        precioPromedio,
        unit: selectedOption.unit,
        material: selectedOption.material,
        size: selectedOption.size
      });
      setIsCalculating(false);

      // Marcar que se usó la calculadora
      localStorage.setItem('calculatorUsed', 'true');
      window.dispatchEvent(new Event('calculatorUsed'));

      // En móvil, hacer scroll hacia el panel de resultados
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          const resultsPanel = document.getElementById('calculator-results');
          if (resultsPanel) {
            resultsPanel.scrollIntoView({
              behavior: 'auto',
              block: 'center'
            });
          }
        }, 100);
      }
    }, 500);
  };

  const selectedService = serviceOptions.find(s => s.value === serviceType);
  const cantidadLabel = serviceType === 'gran-formato'
    ? 'Metros Cuadrados (m²)'
    : serviceType === 'papeleria'
      ? 'Cantidad (múltiplos de 100 hojas)'
      : 'Cantidad';

  const cantidadPlaceholder = serviceType === 'gran-formato'
    ? 'Ej: 1, 2.5, 5'
    : serviceType === 'papeleria'
      ? 'Ej: 100, 200, 300'
      : 'Ej: 100, 500, 1000';

  const isValidQuantity = () => {
    if (!selectedOption) return false;
    if (cantidad <= 0) return false;
    if (serviceType === 'papeleria' && cantidad % 100 !== 0) return false;
    return true;
  };

  return (
    <section className="relative py-32 overflow-hidden bg-[#0a0a0a]">
      {/* Efecto de brillo dorado sutil optimizado */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 60%)' }}></div>
      {/* Efecto de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-[#FFA500] rounded-full blur-xl md:blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-[#FFD700] rounded-full blur-xl md:blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header mejorado */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5">
            <span className="text-sm font-semibold text-[#FFD700] tracking-wider uppercase">Calculadora</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Estima tu <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Presupuesto</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            Obtén una estimación rápida y precisa del costo de tu servicio
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de entrada */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-8 md:p-10 border border-[#FFD700]/10 shadow-2xl">
              <div className="space-y-8">
                {/* Custom Dropdown: Tipo de servicio */}
                <CustomSelect
                  label="Tipo de Servicio"
                  icon={selectedService?.icon}
                  options={serviceOptions}
                  value={serviceType}
                  onChange={(val) => setServiceType(val)}
                />

                {/* Custom Dropdown: Opción del servicio */}
                <CustomSelect
                  label="Opción"
                  icon={(
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  options={availableOptions}
                  value={selectedOptionId}
                  onChange={(val) => setSelectedOptionId(val)}
                />

                {/* Información predeterminada */}
                {selectedOption && (
                  <div className="bg-[#0a0a0a]/50 border border-[#FFD700]/10 rounded-xl p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#FFD700] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">
                          <span className="text-[#FFD700] font-semibold">Material:</span> {selectedOption.material}
                        </p>
                        <p className="text-sm text-gray-300">
                          <span className="text-[#FFD700] font-semibold">Tamaño:</span> {selectedOption.size}
                        </p>
                        {selectedOption.specialNote && (
                          <p className="text-xs text-[#FFA500] mt-1 italic">
                            {selectedOption.specialNote}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Cantidad Personalizada */}
                <CustomNumberInput
                  label={cantidadLabel}
                  value={cantidad}
                  onChange={setCantidad}
                  min={serviceType === 'papeleria' ? 100 : serviceType === 'gran-formato' ? 0.1 : 1}
                  step={serviceType === 'papeleria' ? 100 : serviceType === 'gran-formato' ? 0.1 : 1}
                  placeholder={cantidadPlaceholder}
                />

                {serviceType === 'papeleria' && cantidad > 0 && cantidad % 100 !== 0 && (
                  <p className="mt-2 text-xs text-[#FFA500] animate-pulse">
                    La cantidad debe ser múltiplo de 100 hojas
                  </p>
                )}

                {/* Botón calcular */}
                <div className="pt-4">
                  <button
                    onClick={calculatePrice}
                    disabled={isCalculating || !isValidQuantity()}
                    className="group relative w-full font-semibold py-5 px-8 rounded-xl text-lg transition-all duration-500 overflow-hidden text-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      boxShadow: '0 10px 40px rgba(255, 215, 0, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isCalculating && isValidQuantity()) {
                        e.currentTarget.style.boxShadow = '0 15px 50px rgba(255, 215, 0, 0.6)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(255, 215, 0, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isCalculating ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Calculando...
                        </>
                      ) : (
                        <>
                          Calcular Precio
                          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de resultados */}
          <div id="calculator-results" className="lg:col-span-1">
            <div className="sticky top-8">
              {result ? (
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-8 border border-[#FFD700]/20 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 border border-[#FFD700]/30 mb-4">
                      <svg className="w-8 h-8 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Presupuesto Estimado</h3>
                    <p className="text-sm text-gray-400">Precio aproximado</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-[#FFD700]/10">
                      <span className="text-gray-400 text-sm">Cantidad</span>
                      <span className="text-white font-semibold">
                        {result.cantidad.toLocaleString('es-CO')} {result.unit === 'm2' ? 'm²' : result.unit === 'hojas' ? 'hojas' : 'unidades'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#FFD700]/10">
                      <span className="text-gray-400 text-sm">Material</span>
                      <span className="text-white font-semibold text-right text-xs">{result.material}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#FFD700]/10">
                      <span className="text-gray-400 text-sm">Tamaño</span>
                      <span className="text-white font-semibold">{result.size}</span>
                    </div>
                    <div className="pt-4 mt-4 border-t-2 border-[#FFD700]/30">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm font-semibold">Rango de Precio</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Mínimo</span>
                          <span className="text-white font-semibold">
                            ${result.precioMin.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Máximo</span>
                          <span className="text-white font-semibold">
                            ${result.precioMax.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-[#FFD700]/10">
                          <div className="flex justify-between items-center">
                            <span className="text-white text-lg font-bold">Promedio</span>
                            <span className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                              ${result.precioPromedio.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[#FFD700]/10">
                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                      * Este es un precio estimado. Contáctanos para una cotización exacta y personalizada.
                    </p>
                  </div>

                  <a
                    href="#contacto"
                    className="mt-6 w-full block text-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border border-[#FFD700]/30 hover:border-[#FFD700] hover:from-[#FFD700]/20 hover:to-[#FFA500]/20 transition-all duration-300 text-white font-semibold"
                  >
                    Solicitar Cotización
                  </a>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-8 border border-[#FFD700]/10 shadow-2xl">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/10 border border-[#FFD700]/20 mb-4">
                      <svg className="w-8 h-8 text-[#FFD700]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Presupuesto Estimado</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Completa el formulario y calcula el precio estimado de tu proyecto
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
