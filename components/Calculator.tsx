'use client';

import { useState, useEffect, useRef } from 'react';

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

export default function Calculator() {
  const [serviceType, setServiceType] = useState<ServiceType>('tarjetas');
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1000);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Refs para el portapapeles 3D
  const clipboardRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentRotationX = useRef(15);
  const currentRotationY = useRef(45);
  const animationFrameRef = useRef<number | null>(null);
  const hasUserInteracted = useRef(false);

  // Estado para la calculadora 3D funcional
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcValue, setCalcValue] = useState(0);
  const [calcOperator, setCalcOperator] = useState<string | null>(null);
  const [calcWaitingForOperand, setCalcWaitingForOperand] = useState(false);

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

  // Inicializar rotación automática del portapapeles 3D
  useEffect(() => {
    const clipboard = clipboardRef.current;
    if (!clipboard) return;

    let time = 0;
    let lastTime = Date.now();
    let baseRotationX = 15;
    let baseRotationY = 45;

    const animate = () => {
      if (!isDragging.current) {
        const now = Date.now();
        const deltaTime = (now - lastTime) / 1000;
        lastTime = now;
        time += deltaTime;

        // Si el usuario ha interactuado, usar sus valores como base
        if (hasUserInteracted.current) {
          baseRotationX = currentRotationX.current;
          baseRotationY = currentRotationY.current;
        }

        // Oscilación suave en un rango limitado para mantener la calculadora visible
        // Rotación Y: oscila alrededor de la posición base
        const rangeY = 25; // Rango de oscilación
        const autoRotateY = baseRotationY + Math.sin(time * 0.5) * rangeY;

        // Rotación X: oscila alrededor de la posición base
        const rangeX = 10; // Rango de oscilación
        const autoRotateX = baseRotationX + Math.cos(time * 0.3) * rangeX;
        
        clipboard.style.transform = `perspective(1000px) rotateX(${autoRotateX}deg) rotateY(${autoRotateY}deg)`;
      } else {
        // Cuando está siendo arrastrada, usar la posición del usuario directamente
        clipboard.style.transform = `perspective(1000px) rotateX(${currentRotationX.current}deg) rotateY(${currentRotationY.current}deg)`;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handlers para el portapapeles 3D
  const handleClipboardStart = (clientX: number, clientY: number) => {
    isDragging.current = true;
    hasUserInteracted.current = true;
    startX.current = clientX;
    startY.current = clientY;
  };

  const handleClipboardMove = (clientX: number, clientY: number) => {
    if (!isDragging.current || !clipboardRef.current) return;

    const deltaX = clientX - startX.current;
    const deltaY = clientY - startY.current;

    currentRotationY.current += deltaX * 0.5;
    currentRotationX.current -= deltaY * 0.5;
    currentRotationX.current = Math.max(-90, Math.min(90, currentRotationX.current));

    clipboardRef.current.style.transform = `perspective(1000px) rotateX(${currentRotationX.current}deg) rotateY(${currentRotationY.current}deg)`;
    clipboardRef.current.style.cursor = 'grabbing';

    startX.current = clientX;
    startY.current = clientY;
  };

  const handleClipboardEnd = () => {
    isDragging.current = false;
    if (clipboardRef.current) {
      clipboardRef.current.style.cursor = 'grab';
    }
  };

  // Global mouse/touch events para el portapapeles
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        handleClipboardMove(e.clientX, e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        handleClipboardEnd();
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches.length === 1) {
        e.preventDefault();
        handleClipboardMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleGlobalTouchEnd = () => {
      if (isDragging.current) {
        handleClipboardEnd();
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    window.addEventListener('touchend', handleGlobalTouchEnd);
    window.addEventListener('touchcancel', handleGlobalTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
      window.removeEventListener('touchcancel', handleGlobalTouchEnd);
    };
  }, []);

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
              behavior: 'smooth', 
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

  // Funciones para la calculadora 3D
  const formatDisplay = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    // Limitar a 10 caracteres para que quepa en la pantalla
    const str = num.toString();
    if (str.length > 10) {
      return num.toExponential(5);
    }
    return str;
  };

  const handleCalcInput = (value: string) => {
    if (calcWaitingForOperand) {
      setCalcDisplay(value);
      setCalcWaitingForOperand(false);
    } else {
      const newDisplay = calcDisplay === '0' ? value : calcDisplay + value;
      // Limitar la longitud del display
      if (newDisplay.length <= 10) {
        setCalcDisplay(newDisplay);
      }
    }
  };

  const handleCalcOperator = (nextOperator: string) => {
    const inputValue = parseFloat(calcDisplay);

    if (calcValue === 0) {
      setCalcValue(inputValue);
    } else if (calcOperator) {
      const currentValue = calcValue || 0;
      const newValue = calculate(currentValue, inputValue, calcOperator);

      setCalcValue(newValue);
      setCalcDisplay(formatDisplay(newValue));
    }

    setCalcWaitingForOperand(true);
    setCalcOperator(nextOperator);
  };

  const calculate = (firstValue: number, secondValue: number, operator: string): number => {
    switch (operator) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const handleCalcEquals = () => {
    const inputValue = parseFloat(calcDisplay);

    if (calcOperator && !calcWaitingForOperand) {
      const newValue = calculate(calcValue, inputValue, calcOperator);
      setCalcDisplay(formatDisplay(newValue));
      setCalcValue(0);
      setCalcOperator(null);
      setCalcWaitingForOperand(true);
    }
  };

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setCalcValue(0);
    setCalcOperator(null);
    setCalcWaitingForOperand(false);
  };

  const handleCalcToggleSign = () => {
    const value = parseFloat(calcDisplay);
    setCalcDisplay(formatDisplay(-value));
  };

  const handleCalcPercent = () => {
    const value = parseFloat(calcDisplay);
    setCalcDisplay(formatDisplay(value / 100));
  };

  const handleCalcDecimal = () => {
    if (calcWaitingForOperand) {
      setCalcDisplay('0.');
      setCalcWaitingForOperand(false);
    } else if (calcDisplay.indexOf('.') === -1) {
      setCalcDisplay(calcDisplay + '.');
    }
  };

  return (
    <section id="calculadora" className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)' }}>
      {/* Efecto de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFA500] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFD700] rounded-full blur-3xl"></div>
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

        {/* Calculadora 3D Interactiva */}
        <div className="relative flex items-center justify-center my-8 md:my-12 pointer-events-auto">
          <div className="relative">
            <div
              ref={clipboardRef}
              className="relative"
              style={{
                width: 'clamp(140px, 20vw, 200px)',
                height: 'clamp(180px, 26vw, 260px)',
                transformStyle: 'preserve-3d',
                transform: 'perspective(1000px) rotateX(15deg) rotateY(45deg)',
                cursor: 'grab',
                userSelect: 'none',
                touchAction: 'none',
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                handleClipboardStart(e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                if (e.touches.length === 1) {
                  handleClipboardStart(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
            >
              {/* Cara frontal de la calculadora */}
              <div
                className="absolute w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]"
                style={{
                  transform: 'translateZ(8px)',
                  boxShadow: 'inset 0 0 30px rgba(255, 215, 0, 0.1), 0 0 20px rgba(255, 215, 0, 0.2)',
                  borderRadius: '8px',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Pantalla de la calculadora */}
                <div className="absolute top-1 left-1 right-1 h-12 bg-[#0a0a0a] rounded px-2 flex items-center justify-end overflow-hidden">
                  <span className="text-[#FFD700] font-mono text-lg font-bold truncate">{calcDisplay}</span>
                </div>
                
                {/* Botones de la calculadora */}
                <div className="absolute top-16 left-1 right-1 bottom-1 grid grid-cols-4 gap-1">
                  {/* Fila 1 */}
                  <button 
                    onClick={handleCalcClear}
                    className="w-full h-8 bg-[#FFD700]/20 rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#FFD700]/30 transition-colors cursor-pointer"
                  >C</button>
                  <button 
                    onClick={handleCalcToggleSign}
                    className="w-full h-8 bg-[#FFD700]/20 rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#FFD700]/30 transition-colors cursor-pointer"
                  >±</button>
                  <button 
                    onClick={handleCalcPercent}
                    className="w-full h-8 bg-[#FFD700]/20 rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#FFD700]/30 transition-colors cursor-pointer"
                  >%</button>
                  <button 
                    onClick={() => handleCalcOperator('÷')}
                    className="w-full h-8 bg-[#FFA500]/30 rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#FFA500]/40 transition-colors cursor-pointer"
                  >÷</button>
                  
                  {/* Fila 2 */}
                  <button 
                    onClick={() => handleCalcInput('7')}
                    className="w-full h-8 bg-[#0a0a0a] rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  >7</button>
                  <button 
                    onClick={() => handleCalcInput('8')}
                    className="w-full h-8 bg-[#0a0a0a] rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  >8</button>
                  <button 
                    onClick={() => handleCalcInput('9')}
                    className="w-full h-8 bg-[#0a0a0a] rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  >9</button>
                  <button 
                    onClick={() => handleCalcOperator('×')}
                    className="w-full h-8 bg-[#FFA500]/30 rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#FFA500]/40 transition-colors cursor-pointer"
                  >×</button>
                  
                  {/* Fila 3 */}
                  <button 
                    onClick={() => handleCalcInput('4')}
                    className="w-full h-8 bg-[#0a0a0a] rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  >4</button>
                  <button 
                    onClick={() => handleCalcInput('5')}
                    className="w-full h-8 bg-[#0a0a0a] rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  >5</button>
                  <button 
                    onClick={() => handleCalcInput('6')}
                    className="w-full h-8 bg-[#0a0a0a] rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  >6</button>
                  <button 
                    onClick={() => handleCalcOperator('-')}
                    className="w-full h-8 bg-[#FFA500]/30 rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#FFA500]/40 transition-colors cursor-pointer"
                  >-</button>
                  
                  {/* Fila 4 */}
                  <button 
                    onClick={() => handleCalcInput('1')}
                    className="w-full h-8 bg-[#0a0a0a] rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  >1</button>
                  <button 
                    onClick={() => handleCalcInput('2')}
                    className="w-full h-8 bg-[#0a0a0a] rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  >2</button>
                  <button 
                    onClick={() => handleCalcInput('3')}
                    className="w-full h-8 bg-[#0a0a0a] rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  >3</button>
                  <button 
                    onClick={() => handleCalcOperator('+')}
                    className="w-full h-8 bg-[#FFA500]/30 rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#FFA500]/40 transition-colors cursor-pointer"
                  >+</button>
                  
                  {/* Fila 5 */}
                  <button 
                    onClick={() => handleCalcInput('0')}
                    className="w-full h-8 bg-[#0a0a0a] rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#1a1a1a] transition-colors cursor-pointer col-span-2"
                  >0</button>
                  <button 
                    onClick={handleCalcDecimal}
                    className="w-full h-8 bg-[#0a0a0a] rounded flex items-center justify-center text-[#FFD700] text-sm font-bold hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  >.</button>
                  <button 
                    onClick={handleCalcEquals}
                    className="w-full h-8 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded flex items-center justify-center text-[#0a0a0a] text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
                  >=</button>
                </div>
              </div>
              
              {/* Tapa trasera de la calculadora */}
              <div
                className="absolute w-full h-full bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a]"
                style={{
                  transform: 'translateZ(-8px) rotateY(180deg)',
                  boxShadow: 'inset 0 0 20px rgba(255, 215, 0, 0.05), 0 0 15px rgba(255, 215, 0, 0.1)',
                  borderRadius: '8px',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Detalles decorativos en la tapa */}
                <div className="absolute inset-2 rounded-sm">
                  {/* Líneas decorativas sutiles */}
                  <div className="absolute top-1/4 left-2 right-2 h-px bg-[#FFD700]/10"></div>
                  <div className="absolute top-1/2 left-2 right-2 h-px bg-[#FFD700]/10"></div>
                  <div className="absolute top-3/4 left-2 right-2 h-px bg-[#FFD700]/10"></div>
                  {/* Texto o logo sutil */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FFD700]/20 text-xs font-light tracking-widest uppercase">
                    NXS
                  </div>
                </div>
              </div>
              
              {/* Lado derecho de la calculadora */}
              <div
                className="absolute w-4 h-full bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a]"
                style={{
                  right: 0,
                  top: 0,
                  transform: 'rotateY(90deg) translateZ(4px)',
                  borderRadius: '0 8px 8px 0',
                  backfaceVisibility: 'hidden',
                }}
              />
              {/* Lado izquierdo de la calculadora */}
              <div
                className="absolute w-4 h-full bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a]"
                style={{
                  left: 0,
                  top: 0,
                  transform: 'rotateY(-90deg) translateZ(4px)',
                  borderRadius: '8px 0 0 8px',
                  backfaceVisibility: 'hidden',
                }}
              />
              {/* Lado superior de la calculadora */}
              <div
                className="absolute w-full h-4 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]"
                style={{
                  top: 0,
                  left: 0,
                  transform: 'rotateX(90deg) translateZ(4px)',
                  borderRadius: '8px 8px 0 0',
                  backfaceVisibility: 'hidden',
                }}
              />
              {/* Lado inferior de la calculadora */}
              <div
                className="absolute w-full h-4 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]"
                style={{
                  bottom: 0,
                  left: 0,
                  transform: 'rotateX(-90deg) translateZ(4px)',
                  borderRadius: '0 0 8px 8px',
                  backfaceVisibility: 'hidden',
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de entrada */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-8 md:p-10 border border-[#FFD700]/10 shadow-2xl">
              <div className="space-y-6">
                {/* Tipo de servicio */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4 tracking-wide">
                    <svg className="w-5 h-5 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Tipo de Servicio <span className="text-[#FFD700]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value as ServiceType)}
                      className="w-full px-5 py-4 pl-12 bg-[#0a0a0a] border border-[#FFD700]/20 rounded-xl focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] transition-all text-white font-light appearance-none cursor-pointer hover:border-[#FFD700]/40"
                    >
                      {serviceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFD700]">
                      {selectedService?.icon}
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Opción del servicio */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4 tracking-wide">
                    <svg className="w-5 h-5 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Opción <span className="text-[#FFD700]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedOptionId}
                      onChange={(e) => setSelectedOptionId(e.target.value)}
                      className="w-full px-5 py-4 pl-12 bg-[#0a0a0a] border border-[#FFD700]/20 rounded-xl focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] transition-all text-white font-light appearance-none cursor-pointer hover:border-[#FFD700]/40"
                    >
                      {availableOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFD700] pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

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

                {/* Cantidad */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4 tracking-wide">
                    <svg className="w-5 h-5 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    {cantidadLabel} <span className="text-[#FFD700]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={serviceType === 'papeleria' ? 100 : serviceType === 'gran-formato' ? 0.1 : 1}
                      step={serviceType === 'papeleria' ? 100 : serviceType === 'gran-formato' ? 0.1 : 1}
                      value={cantidad}
                      onChange={(e) => {
                        const value = serviceType === 'gran-formato' 
                          ? parseFloat(e.target.value) || 0 
                          : parseInt(e.target.value) || 0;
                        setCantidad(value);
                      }}
                      className="w-full px-5 py-4 pl-12 bg-[#0a0a0a] border border-[#FFD700]/20 rounded-xl focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] transition-all text-white placeholder-gray-500 font-light hover:border-[#FFD700]/40"
                      placeholder={cantidadPlaceholder}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFD700] pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </div>
                  </div>
                  {serviceType === 'papeleria' && cantidad > 0 && cantidad % 100 !== 0 && (
                    <p className="mt-2 text-xs text-[#FFA500]">
                      La cantidad debe ser múltiplo de 100 hojas
                    </p>
                  )}
                </div>

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
