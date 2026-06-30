import React, { useState } from 'react';
import { 
  Plane, 
  Plus, 
  Activity, 
  Cpu, 
  Clock, 
  X,
  Sparkles,
  RefreshCw,
  TrendingDown
} from 'lucide-react';

interface AirportMetric {
  id: string;
  iata: string;
  name: string;
  country: string;
  status: 'Activo' | 'Beta' | 'Negociando';
  precision: number;
  passengers: string;
  reduction: number;
  modules: string;
}

interface AiModel {
  name: string;
  function: string;
  airports: string;
  precision: string;
  latency: string;
  status: 'Producción' | 'Beta' | 'R&D';
}

interface AiAirportsViewProps {
  triggerToast: (msg: string) => void;
}

export default function AiAirportsView({ triggerToast }: AiAirportsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Dynamic list of deployed airports
  const [airports, setAirports] = useState<AirportMetric[]>([
    { id: 'ap-1', iata: 'BCN', name: 'Aeropuerto El Prat', country: 'Barcelona · España', status: 'Activo', precision: 98.1, passengers: '52K', reduction: 41, modules: 'AI Queue Predictor · Live Dashboard' },
    { id: 'ap-2', iata: 'MAD', name: 'Aeropuerto Barajas', country: 'Madrid · España', status: 'Activo', precision: 93.4, passengers: '74K', reduction: 35, modules: 'AI Queue Predictor' },
    { id: 'ap-3', iata: 'LIS', name: 'Aeroporto de Lisboa', country: 'Lisboa · Portugal', status: 'Beta', precision: 91.2, passengers: '16K', reduction: 38, modules: 'AI Queue Predictor · en piloto' }
  ]);

  const [models, setModels] = useState<AiModel[]>([
    { name: 'queue-predictor-v2', function: 'Predicción de colas (15-60 min)', airports: 'BCN, MAD, LIS', precision: '94.2%', latency: '<200ms', status: 'Producción' },
    { name: 'passenger-flow-v1', function: 'Análisis de flujos de pasajeros', airports: 'BCN, MAD', precision: '91.8%', latency: '<500ms', status: 'Producción' },
    { name: 'anomaly-detector-v1', function: 'Detección de anomalías y alertas', airports: 'BCN', precision: '87.5%', latency: '<1s', status: 'Beta' },
    { name: 'baggage-tracker-v0', function: 'Tracking predictivo de equipajes', airports: '—', precision: 'En entrenamiento', latency: '—', status: 'R&D' }
  ]);

  // Form states
  const [iata, setIata] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [passengers, setPassengers] = useState('');
  const [activeModules, setActiveModules] = useState('AI Queue Predictor');
  
  const handleAddAirport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!iata.trim() || !name.trim()) return;

    const code = iata.slice(0, 3).toUpperCase();
    const precisionVal = parseFloat((Math.random() * (99.5 - 90.5) + 90.5).toFixed(1));
    const reductionVal = Math.floor(Math.random() * (45 - 28) + 28);

    const newAp: AirportMetric = {
      id: `ap-${Date.now()}`,
      iata: code,
      name,
      country: country || 'Internacional',
      status: 'Beta',
      precision: precisionVal,
      passengers: passengers || '10K',
      reduction: reductionVal,
      modules: activeModules
    };

    setAirports([...airports, newAp]);

    // Also update model coverage list
    setModels(models.map(m => {
      if (m.name === 'queue-predictor-v2') {
        return { ...m, airports: `${m.airports}, ${code}` };
      }
      return m;
    }));

    triggerToast(`Despliegue activado para el nodo ${code} — ${name}. Inicializando modelos de IA.`);
    setIata('');
    setName('');
    setCountry('');
    setPassengers('');
    setIsModalOpen(false);
  };

  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'Activo':
        return <span className="bg-[#10CC82]/15 text-[#10CC82] text-[11px] font-bold px-2 py-0.5 rounded">Activo</span>;
      case 'Beta':
        return <span className="bg-[#4F7EF8]/15 text-[#7AA4FA] text-[11px] font-bold px-2 py-0.5 rounded">Beta</span>;
      case 'Negociando':
      default:
        return <span className="bg-[#8B63F5]/15 text-[#8B63F5] text-[11px] font-bold px-2 py-0.5 rounded">Beta / Piloto</span>;
    }
  };

  return (
    <div className="animate-fade-in space-y-7">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#1C2248] pb-5">
        <div>
          <h2 className="text-[20px] font-semibold text-[#E4EAFF] tracking-tight">AI Airports</h2>
          <p className="text-[13px] text-[#6B7AAD] mt-0.5">Despliegues activos y métricas de IA en aeropuertos</p>
        </div>
        <div className="flex gap-2.5">
          <button 
            type="button"
            onClick={() => triggerToast('Generando reporte consolidado de precisión y latencia de IA...')}
            className="btn btn-ghost px-3.5 py-1.8 bg-transparent hover:bg-[#0F1330] rounded-lg border border-[#222850] text-[#9AA3CC] hover:text-white text-[13px] flex items-center gap-1.5 transition-all text-sm cursor-pointer"
          >
            <Cpu className="w-[15px] h-[15px]" /> Informe global
          </button>
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary px-3.5 py-1.8 bg-[#4F7EF8] hover:bg-[#2B56D6] text-white rounded-lg text-[13px] flex items-center gap-1.5 transition-all font-medium text-sm cursor-pointer"
          >
            <Plus className="w-[15px] h-[15px]" /> Añadir aeropuerto
          </button>
        </div>
      </div>

      {/* Global stats KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#00C9A7]">
          <div className="text-[12px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Aeropuertos activos</div>
          <div className="text-[28px] font-bold text-[#E4EAFF] mt-2 tracking-tight leading-none">{airports.length}</div>
          <div className="text-[12px] text-[#10CC82] flex items-center gap-1 mt-2.5">
            <Sparkles className="w-[13px] h-[13px]" /> +1 este mes
          </div>
        </div>

        <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#4F7EF8]">
          <div className="text-[12px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Pasajeros analizados/día</div>
          <div className="text-[28px] font-bold text-[#E4EAFF] mt-2 tracking-tight leading-none">142K</div>
          <div className="text-[12px] text-[#10CC82] flex items-center gap-1 mt-2.5">
            <TrendingDown className="w-[13px] h-[13px]" /> +23% vs. semana pasada
          </div>
        </div>

        <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#8B63F5]">
          <div className="text-[12px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Precisión predicción</div>
          <div className="text-[28px] font-bold text-[#E4EAFF] mt-2 tracking-tight leading-none">94.2%</div>
          <div className="text-[12px] text-[#10CC82] flex items-center gap-1 mt-2.5">
            <Cpu className="w-[13px] h-[13px]" /> Promedio red
          </div>
        </div>

        <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#F5A623]">
          <div className="text-[12px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Tiempo espera reducido</div>
          <div className="text-[28px] font-bold text-white mt-2 tracking-tight leading-none">-38%</div>
          <div className="text-[12px] text-[#10CC82] flex items-center gap-1 mt-2.5">
            <Clock className="w-[13px] h-[13px]" /> vs. baseline sin IA
          </div>
        </div>
      </div>

      {/* Airport cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {airports.map((ap) => (
          <div key={ap.id} className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[22px] font-extrabold text-[#7AA4FA] tracking-wide font-mono leading-none">{ap.iata}</div>
                <h4 className="text-[15px] font-semibold text-[#E4EAFF] mt-2">{ap.name}</h4>
                <div className="text-[12px] text-[#6B7AAD] mt-0.5">{ap.country}</div>
              </div>
              {getStatusBadge(ap.status)}
            </div>

            {/* Sub Metrics matrix */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="bg-[#131740]/40 border border-[#222850] p-2.5 text-center rounded-lg">
                <div className="text-[16px] font-bold text-[#00C9A7] font-mono">{ap.precision}%</div>
                <div className="text-[10px] text-[#6B7AAD] mt-1 font-sans">Precisión</div>
              </div>
              <div className="bg-[#131740]/40 border border-[#222850] p-2.5 text-center rounded-lg">
                <div className="text-[16px] font-bold text-[#E4EAFF] font-mono">{ap.passengers}</div>
                <div className="text-[10px] text-[#6B7AAD] mt-1 font-sans">Pasaj./día</div>
              </div>
              <div className="bg-[#131740]/40 border border-[#222850] p-2.5 text-center rounded-lg">
                <div className="text-[16px] font-bold text-[#10CC82] font-mono">-{ap.reduction}%</div>
                <div className="text-[10px] text-[#6B7AAD] mt-1 font-sans">Tiempo cola</div>
              </div>
            </div>
            
            <div className="text-[11px] text-[#6B7AAD] border-t border-[#1C2248]/60 pt-3 flex items-center justify-between">
              <span className="truncate">Módulos: <strong className="text-[#9AA3CC]">{ap.modules}</strong></span>
              <button 
                onClick={() => triggerToast(`Sincronizando logs en tiempo real para el nodo ${ap.iata}`)}
                className="text-[#7AA4FA] hover:underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 animate-spin duration-3000" /> Sincronizar
              </button>
            </div>
          </div>
        ))}

        {/* Airport Add trigger card */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="border border-dashed border-[#1C2248] hover:border-[#4F7EF8] bg-[#0F1330]/30 hover:bg-[#0F1330]/65 p-6 rounded-lg flex flex-col justify-center items-center text-center cursor-pointer min-h-[170px] transition-all group"
        >
          <Plus className="w-8 h-8 text-[#4F7EF8] opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform mb-2.5" />
          <div className="text-[14px] font-semibold text-[#E4EAFF]">Próximo aeropuerto</div>
          <div className="text-[12px] text-[#6B7AAD] mt-1 max-w-[200px]">LHR — Heathrow · En negociación activa</div>
        </div>
      </div>

      {/* AI Models Table Card layout */}
      <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg">
        <div className="border-b border-[#1C2248] px-5 py-4">
          <h3 className="text-[14px] font-semibold text-[#E4EAFF]">Modelos IA en producción</h3>
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider border-b border-[#1C2248]">Modelo</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider border-b border-[#1C2248]">Función</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider border-b border-[#1C2248]">Aeropuertos</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider border-b border-[#1C2248]">Precisión</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider border-b border-[#1C2248]">Latencia</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider border-b border-[#1C2248]">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C2248] text-[13px]">
            {models.map((m, i) => (
              <tr key={i} className="hover:bg-[#4F7EF8]/4 transition-colors">
                <td className="px-5 py-3 font-mono font-bold text-[#7AA4FA]">{m.name}</td>
                <td className="px-5 py-3 text-[#E4EAFF]">{m.function}</td>
                <td className="px-5 py-3 text-[#9AA3CC]">{m.airports}</td>
                <td className="px-5 py-3 font-bold text-[#10CC82]">{m.precision}</td>
                <td className="px-5 py-3 text-[#6B7AAD] font-mono">{m.latency}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    m.status === 'Producción' 
                      ? 'bg-[#10CC82]/15 text-[#10CC82]' 
                      : m.status === 'Beta'
                      ? 'bg-[#4F7EF8]/15 text-[#7AA4FA]'
                      : 'bg-[#8B63F5]/10 text-[#8B63F5]'
                  }`}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Airport Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#07091C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1330] border border-[#1C2248] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#1C2248] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#E4EAFF]">Añadir Aeropuerto / Despliegue</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#6B7AAD] hover:text-[#E4EAFF] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddAirport} className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Código IATA</label>
                  <input 
                    type="text" 
                    value={iata}
                    onChange={(e) => setIata(e.target.value)}
                    placeholder="Ej. BCN"
                    maxLength={3}
                    className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] placeholder-[#6B7AAD] focus:outline-none focus:border-[#4F7EF8] text-sm text-center font-mono font-bold"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Nombre Aeropuerto</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Aeropuerto El Prat"
                    className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] placeholder-[#6B7AAD] focus:outline-none focus:border-[#4F7EF8] text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Ciudad · País</label>
                  <input 
                    type="text" 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Ej. Barcelona · España"
                    className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] placeholder-[#6B7AAD] focus:outline-none focus:border-[#4F7EF8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Pasajeros/día (estimado)</label>
                  <input 
                    type="text" 
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    placeholder="Ej. 52K"
                    className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] placeholder-[#6B7AAD] focus:outline-none focus:border-[#4F7EF8] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Módulos de IA iniciales</label>
                <select 
                  value={activeModules}
                  onChange={(e) => setActiveModules(e.target.value)}
                  className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] focus:outline-none focus:border-[#4F7EF8] text-sm"
                >
                  <option value="AI Queue Predictor">AI Queue Predictor</option>
                  <option value="AI Queue Predictor · Live Dashboard">AI Queue Predictor y Live Dashboard</option>
                  <option value="AI Queue Predictor · AI Baggage">AI Queue Predictor &amp; Baggage Tracking</option>
                </select>
              </div>

              <div className="border-t border-[#1C2248] pt-4 flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-transparent border border-[#222850] text-[#6B7AAD] hover:text-[#E4EAFF] text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#4F7EF8] hover:bg-[#2B56D6] text-white rounded-lg font-medium text-sm cursor-pointer"
                >
                  Confirmar Despliegue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
