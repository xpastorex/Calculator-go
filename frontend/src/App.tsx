import { useState, useEffect } from 'react';
import { calculateService } from './services/api';

interface PasosHistorial {
  operacion: string;
  resultado: number;
}

interface SesionHistorial {
  id: string;
  fecha: string;
  pasos: PasosHistorial[];
}

export default function App() {
  const [pantalla, setPantalla] = useState('0');
  const [operador, setOperador] = useState<string | null>(null);
  const [valorAnterior, setValorAnterior] = useState<number | null>(null);
  const [limpiarPantallaAlDigitar, setLimpiarPantallaAlDigitar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [historial, setHistorial] = useState<SesionHistorial[]>(() => {
    const saved = localStorage.getItem('historial_calculadora');
    return saved ? JSON.parse(saved) : [];
  });
  const [sesionActual, setSesionActual] = useState<PasosHistorial[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [sesionExpandida, setSesionExpandida] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('historial_calculadora', JSON.stringify(historial));
  }, [historial]);

  const presionarNumero = (num: string) => {
    setError(null);
    if (pantalla === '0' || limpiarPantallaAlDigitar) {
      setPantalla(num);
      setLimpiarPantallaAlDigitar(false);
    } else {
      setPantalla(pantalla + num);
    }
  };

  const presionarOperador = (op: string) => {
    setError(null);
    setValorAnterior(parseFloat(pantalla));
    setOperador(op);
    setLimpiarPantallaAlDigitar(true);
  };

  const ejecutarOperacion = async () => {
    if (valorAnterior === null || !operador) return;

    const valorActual = parseFloat(pantalla);
    
    const respuesta = await calculateService.calculate({
      operator: operador,
      num1: valorAnterior,
      num2: valorActual
    });

    if (respuesta.error) {
      setError(respuesta.error);
      setPantalla('Error');
    } else {
      const nuevoResultado = respuesta.result;
      const textoOperacion = `${valorAnterior} ${operador} ${valorActual}`;
      
      setSesionActual(prev => [...prev, { operacion: textoOperacion, resultado: nuevoResultado }]);
      
      setPantalla(nuevoResultado.toString());
      setValorAnterior(nuevoResultado);
    }
    setOperador(null);
    setLimpiarPantallaAlDigitar(true);
  };

  //Boton para borrar la operacion actual
  const botonClear = () => {
    if (sesionActual.length > 0) {
      const nuevaSesion: SesionHistorial = {
        id: Math.random().toString(36).substr(2, 9),
        fecha: new Date().toLocaleTimeString(),
        pasos: sesionActual
      };
      setHistorial(prev => [nuevaSesion, ...prev]);
      setSesionActual([]);
    }
    setPantalla('0');
    setOperador(null);
    setValorAnterior(null);
    setError(null);
  };

  const toggleSesion = (id: string) => {
    setSesionExpandida(sesionExpandida === id ? null : id);
  };

  const botonBackspace = () => {
    setError(null);
    // Si la pantalla ya está en '0' o viene de un resultado que se debe limpiar, no hace nada
    if (pantalla === '0' || limpiarPantallaAlDigitar) return;

    // Si solo queda un dígito, vuelve a '0'
    if (pantalla.length === 1) {
      setPantalla('0');
    } else {
      // Quita el último carácter de la cadena
      setPantalla(pantalla.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary flex flex-col justify-between sm:justify-center items-center font-sans">
      
      {/* Contenedor Calculadora: Ocupa todo el alto/ancho en móvil, fijo en escritorio */}
      <div className="w-full h-screen sm:h-auto sm:max-w-sm bg-white sm:rounded-3xl sm:shadow-xl flex flex-col overflow-hidden justify-between border border-gray-100">
        
        {/* Barra superior de herramientas */}
        <div className="p-4 flex justify-between items-center bg-gray-50 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Calculator v1.0</span>
          <button 
            onClick={() => setModalAbierto(true)}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-all shadow-sm"
          >
            📜 Historial ({historial.length})
          </button>
        </div>

        {/* Pantalla de resultados */}
        <div className="px-6 py-8 flex flex-col justify-end items-end grow min-h-[150px] bg-gradient-to-b from-gray-50 to-white">
          <div className="text-sm text-gray-400 min-h-[20px] mb-1">
            {valorAnterior !== null && operador ? `${valorAnterior} ${operador}` : ''}
          </div>
          <div className="text-5xl font-light tracking-tight text-gray-800 break-all truncate w-full text-right">
            {pantalla}
          </div>
          {error && <div className="text-xs text-red-500 mt-2 font-medium">{error}</div>}
        </div>

        {/* Teclado numérico y de operaciones separado en las filas*/}
        <div className="grid grid-cols-4 gap-px bg-gray-100 p-2 sm:p-4 pb-10 sm:pb-4 flex-grow">
          
          <button onClick={botonClear} className="py-5 bg-gray-50 text-xl font-bold hover:bg-gray-200/70 active:scale-95 transition-all rounded-xl">C</button>
          <button onClick={() => presionarOperador('^')} className="py-5 bg-gray-50 text-gray-700 text-xl font-medium hover:bg-gray-200/70 active:scale-95 transition-all rounded-xl">^</button>
          <button onClick={() => presionarOperador('%')} className="py-5 bg-gray-50 text-gray-700 text-xl font-medium hover:bg-gray-200/70 active:scale-95 transition-all rounded-xl">%</button>
          <button onClick={botonBackspace} className="py-5 bg-gray-50 text-gray-700 text-xl font-medium hover:bg-gray-200/70 active:scale-95 transition-all rounded-xl">⌫</button>

          <button 
            onClick={async () => {
              const valorActual = parseFloat(pantalla);
              const respuesta = await calculateService.calculate({ operator: 'sqrt', num1: valorActual, num2: 0 });
              if (respuesta.error) { setError(respuesta.error); setPantalla('Error'); }
              else { 
                setPantalla(respuesta.result.toString()); 
                setSesionActual(prev => [...prev, { operacion: `√(${valorActual})`, resultado: respuesta.result }]);
              }
            }} 
            className="py-5 bg-gray-50 text-gray-700 text-xl font-medium hover:bg-gray-200/70 active:scale-95 transition-all rounded-xl"
          >
            √
          </button>
          <button onClick={() => presionarOperador('/')} className="py-5 bg-gray-100/50 text-gray-800 text-2xl font-semibold hover:bg-gray-200/70 active:scale-95 transition-all rounded-xl">÷</button>
          <button onClick={() => presionarOperador('*')} className="py-5 bg-gray-100/50 text-gray-800 text-2xl font-semibold hover:bg-gray-200/70 active:scale-95 transition-all rounded-xl">×</button>
          <button onClick={() => presionarOperador('-')} className="py-5 bg-gray-100/50 text-gray-800 text-2xl font-semibold hover:bg-gray-200/70 active:scale-95 transition-all rounded-xl">−</button>

          <button onClick={() => presionarNumero('7')} className="py-5 bg-white text-gray-800 text-2xl font-light hover:bg-gray-50 active:scale-95 transition-all rounded-xl">7</button>
          <button onClick={() => presionarNumero('8')} className="py-5 bg-white text-gray-800 text-2xl font-light hover:bg-gray-50 active:scale-95 transition-all rounded-xl">8</button>
          <button onClick={() => presionarNumero('9')} className="py-5 bg-white text-gray-800 text-2xl font-light hover:bg-gray-50 active:scale-95 transition-all rounded-xl">9</button>
          <button onClick={() => presionarOperador('+')} className="row-span-2 py-5 bg-gray-100/50 text-gray-800 text-2xl font-semibold hover:bg-gray-200/70 active:scale-95 transition-all rounded-xl">+</button>

          <button onClick={() => presionarNumero('4')} className="py-5 bg-white text-gray-800 text-2xl font-light hover:bg-gray-50 active:scale-95 transition-all rounded-xl">4</button>
          <button onClick={() => presionarNumero('5')} className="py-5 bg-white text-gray-800 text-2xl font-light hover:bg-gray-50 active:scale-95 transition-all rounded-xl">5</button>
          <button onClick={() => presionarNumero('6')} className="py-5 bg-white text-gray-800 text-2xl font-light hover:bg-gray-50 active:scale-95 transition-all rounded-xl">6</button>

          <button onClick={() => presionarNumero('1')} className="py-5 bg-white text-gray-800 text-2xl font-light hover:bg-gray-50 active:scale-95 transition-all rounded-xl">1</button>
          <button onClick={() => presionarNumero('2')} className="py-5 bg-white text-gray-800 text-2xl font-light hover:bg-gray-50 active:scale-95 transition-all rounded-xl">2</button>
          <button onClick={() => presionarNumero('3')} className="py-5 bg-white text-gray-800 text-2xl font-light hover:bg-gray-50 active:scale-95 transition-all rounded-xl">3</button>
          <button onClick={ejecutarOperacion} className="row-span-2 py-5 bg-gray-800 text-white text-3xl font-bold hover:bg-gray-900 active:scale-95 transition-all rounded-xl">=</button>


          <button onClick={() => presionarNumero('0')} className="col-span-2 py-5 bg-white text-gray-800 text-2xl font-light hover:bg-gray-50 active:scale-95 transition-all rounded-xl">0</button>
          <button onClick={() => presionarNumero('.')} className="py-5 bg-white text-gray-800 text-2xl font-light hover:bg-gray-50 active:scale-95 transition-all rounded-xl">.</button>

        </div>
      </div>

      {/* Modal Historial*/}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md h-[80vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl">
            
            {/* Cabecera Modal */}
            <div className="p-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div className='text-start'>
                <h3 className="text-xl font-semibold text-gray-800">Historial de Operaciones</h3>
                <p className='text-gray-400 text-sm|'>Presione la operación para ver mas detalles</p>
              </div>
              <button 
                onClick={() => setModalAbierto(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-4 grow overflow-y-auto space-y-3 bg-gray-50/50">
              {historial.length === 0 ? (
                <div className="text-center text-gray-400 mt-10 text-sm">No hay operaciones en el historial aún.</div>
              ) : (
                historial.map((sesion) => (
                  <div key={sesion.id} className="bg-white border border-gray-200/60 rounded-xl overflow-hidden shadow-sm">
                    
                    {/* Sección Expandible Trigger */}
                    <button 
                      onClick={() => toggleSesion(sesion.id)}
                      className="w-full p-4 flex justify-between items-center bg-white hover:bg-gray-50/80 transition-colors text-left"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">
                          {sesion.pasos[0]?.operacion} = {sesion.pasos[0]?.resultado}
                        </span>
                      </div>
                    </button>
                    {sesionExpandida === sesion.id && (
                      <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-3">
                        {sesion.pasos.map((paso, index) => (
                          <div key={index} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                            <span className="text-gray-500 font-mono">{paso.operacion}</span>
                            <span className="font-bold text-gray-800 font-mono">= {paso.resultado}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => { setHistorial([]); setModalAbierto(false); }}
                className="text-xs text-red-500 font-semibold hover:underline"
              >
                Limpiar todo el historial
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}