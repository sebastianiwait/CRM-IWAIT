import React, { useState } from 'react';
import { 
  Rocket, 
  Plus, 
  Flame, 
  List, 
  X,
  PlusCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Plane,
  Award,
  Activity,
  CheckCircle2,
  TrendingUp,
  Users,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { KanbanTask } from '../data/iwaitData'; // Import KanbanTask from data/iwaitData

interface ProductViewProps {
  triggerToast: (msg: string) => void;
  tasks?: any[];
}

interface RoadmapItem {
  id: string;
  quarter: 'Q2 2026' | 'Q3 2026' | 'Q4 2026';
  title: string;
  description: string;
  status: 'Completado' | 'En desarrollo' | 'Planificado' | 'R&D';
}

interface ProductModule {
  id: string;
  name: string;
  status: 'Producción' | 'Beta' | 'Desarrollo' | 'Roadmap';
  owner: string;
  progress: number;
}

export default function ProductView({ triggerToast, tasks = [] }: ProductViewProps) {
  const [activeSubView, setActiveSubView] = useState<'roadmap' | 'consolidated'>('roadmap');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBacklogOpen, setIsBacklogOpen] = useState(false);

  // Roadmap Items State
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([
    { id: 'rm-1', quarter: 'Q2 2026', title: 'AI Queue Predictor v2', description: 'Predicción de colas en tiempo real con ML', status: 'Completado' },
    { id: 'rm-2', quarter: 'Q2 2026', title: 'Dashboard aeropuerto en tiempo real', description: 'Panel de control para gestores de aeropuerto', status: 'En desarrollo' },
    { id: 'rm-3', quarter: 'Q2 2026', title: 'API pública v1', description: 'Integración con sistemas de aeropuertos', status: 'En desarrollo' },
    { id: 'rm-4', quarter: 'Q3 2026', title: 'App pasajero iOS/Android', description: 'Notificaciones proactivas de colas al pasajero', status: 'Planificado' },
    { id: 'rm-5', quarter: 'Q3 2026', title: 'Módulo BI & Analytics', description: 'Informes históricos para aeropuertos', status: 'Planificado' },
    { id: 'rm-6', quarter: 'Q3 2026', title: 'Multi-aeropuerto (AENA network)', description: 'Escalar a red completa de aeropuertos AENA', status: 'Planificado' },
    { id: 'rm-7', quarter: 'Q4 2026', title: 'AI Baggage Tracking', description: 'Predicción y tracking de equipajes con IA', status: 'R&D' },
    { id: 'rm-8', quarter: 'Q4 2026', title: 'Expansión internacional', description: 'UK, Alemania, Francia — primeros aeropuertos', status: 'R&D' }
  ]);

  // Product Modules state
  const [modules, setModules] = useState<ProductModule[]>([
    { id: 'm-1', name: 'AI Queue Predictor', status: 'Producción', owner: 'María R.', progress: 100 },
    { id: 'm-2', name: 'Live Dashboard', status: 'Beta', owner: 'Alex V.', progress: 82 },
    { id: 'm-3', name: 'Passenger App', status: 'Desarrollo', owner: 'Jorge L.', progress: 30 },
    { id: 'm-4', name: 'API Pública', status: 'Desarrollo', owner: 'María R.', progress: 51 },
    { id: 'm-5', name: 'BI Analytics', status: 'Roadmap', owner: 'Sin asignar', progress: 0 },
    { id: 'm-6', name: 'AI Baggage', status: 'Roadmap', owner: 'Sin asignar', progress: 0 }
  ]);

  // Create feature states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [quarter, setQuarter] = useState<'Q2 2026' | 'Q3 2026' | 'Q4 2026'>('Q2 2026');
  const [status, setStatus] = useState<'Completado' | 'En desarrollo' | 'Planificado' | 'R&D'>('Planificado');

  const handleCreateFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: RoadmapItem = {
      id: `rm-${Date.now()}`,
      quarter,
      title,
      description: desc || 'Nueva feature planificada.',
      status
    };

    setRoadmap([newItem, ...roadmap]);

    // Also add to modules table if appropriate or just show confirmation
    if (status === 'Completado' || status === 'En desarrollo') {
      const modName = title.split(' v')[0];
      if (!modules.some(m => m.name.toLowerCase() === modName.toLowerCase())) {
        setModules([
          {
            id: `m-${Date.now()}`,
            name: modName,
            status: status === 'Completado' ? 'Producción' : 'Desarrollo',
            owner: 'Sin asignar',
            progress: status === 'Completado' ? 100 : 10
          },
          ...modules
        ]);
      }
    }

    triggerToast(`Feature "${title}" añadida correctamente al roadmap de ${quarter}.`);
    setTitle('');
    setDesc('');
    setIsModalOpen(false);
  };

  const getDotColor = (stat: string) => {
    switch (stat) {
      case 'Completado': return 'bg-[#10CC82]';
      case 'En desarrollo': return 'bg-[#0E457F]';
      case 'Planificado': return 'bg-[#64748B]';
      case 'R&D': return 'bg-[#47B6E6]';
      default: return 'bg-[#8DA2B5]';
    }
  };

  const getBadgeStyle = (stat: string) => {
    switch (stat) {
      case 'Producción':
        return 'bg-[#10CC82]/15 text-[#10CC82]';
      case 'Beta':
        return 'bg-[#0E457F]/15 text-[#47B6E6]';
      case 'Desarrollo':
        return 'bg-[#F5A623]/15 text-[#F5A623]';
      case 'Roadmap':
      default:
        return 'bg-[#47B6E6]/10 text-[#47B6E6]';
    }
  };

  return (
    <div className="animate-fade-in space-y-7">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#c3dae4] pb-5 gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-[#0F1A2C] tracking-tight">Seguimiento · Sprints &amp; Progreso</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">Control interno del equipo — velocidad de sprints, avance de workstreams e hitos de progreso</p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-[#0B1524] border border-[#22384F] rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveSubView('roadmap')}
            className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeSubView === 'roadmap'
                ? 'bg-[#0E457F] text-white'
                : 'text-[#64748B] hover:text-[#EAF3F9]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Roadmap &amp; Sprints
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('consolidated')}
            className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeSubView === 'consolidated'
                ? 'bg-[#0E457F] text-white'
                : 'text-[#64748B] hover:text-[#EAF3F9]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Consolidado de Progreso
          </button>
        </div>

        <div className="flex gap-2.5">
          <button 
            type="button"
            onClick={() => setIsBacklogOpen(true)}
            className="btn btn-ghost px-3.5 py-1.8 bg-transparent hover:bg-[#14243A] rounded-lg border border-[#2A415A] text-[#8DA2B5] hover:text-white text-[13px] flex items-center gap-1.5 transition-all text-sm cursor-pointer"
          >
            <List className="w-[15px] h-[15px]" /> Ver backlog
          </button>
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary px-3.5 py-1.8 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg text-[13px] flex items-center gap-1.5 transition-all font-medium text-sm cursor-pointer"
          >
            <Plus className="w-[15px] h-[15px]" /> Nueva feature
          </button>
        </div>
      </div>

      {activeSubView === 'roadmap' ? (
        <>
          {/* active Sprint Status Box */}
          <div className="bg-[#14243A] border border-[#22384F] rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#22384F]/60 pb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#F5A623]" />
                <h3 className="text-[14px] font-semibold text-[#EAF3F9]">Sprint 12 — activo</h3>
                <span className="text-[11px] text-[#64748B] font-mono ml-2">19 Jun — 2 Jul 2026</span>
              </div>
              <span className="bg-[#F5A623]/15 text-[#F5A623] text-[11px] font-bold px-2.5 py-0.5 rounded-full">75% completado</span>
            </div>
            
            <div className="mt-4 space-y-4">
              <div className="w-full bg-[#22384F] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0E457F] h-full rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#10CC82]/8 border border-[#10CC82]/20 rounded-lg p-3">
                  <div className="text-[18px] font-bold text-[#10CC82]">6</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Stories completadas</div>
                </div>
                <div className="bg-[#0E457F]/8 border border-[#0E457F]/20 rounded-lg p-3">
                  <div className="text-[18px] font-bold text-[#47B6E6]">2</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">En progreso</div>
                </div>
                <div className="bg-[#64748B]/8 border border-[#64748B]/20 rounded-lg p-3">
                  <div className="text-[18px] font-bold text-[#8DA2B5]">2</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Pendientes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Split grid roadmap vs product modules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Roadmap section */}
            <div className="space-y-6">
              {['Q2 2026', 'Q3 2026', 'Q4 2026'].map((q) => {
                const items = roadmap.filter(item => item.quarter === q);
                if (items.length === 0) return null;
                return (
                  <div key={q} className="space-y-2.5">
                    <div className="text-[12px] font-bold text-[#47B6E6] uppercase tracking-wider pl-1">{q} · {q === 'Q2 2026' ? 'En curso' : q === 'Q3 2026' ? 'Planificado' : 'Futuro'}</div>
                    <div className="space-y-2">
                      {items.map(item => (
                        <div 
                          key={item.id} 
                          className="flex items-start gap-3 p-3.5 bg-[#14243A] border border-[#22384F] rounded-lg hover:border-[#0E457F]/50 transition-all"
                        >
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${getDotColor(item.status)}`}></div>
                          <div>
                            <div className="text-[13.5px] font-medium text-[#EAF3F9]">{item.title}</div>
                            <div className="text-[12px] text-[#64748B] mt-1 leading-normal">
                              {item.description} · <span className="font-semibold text-[11px] text-[#8DA2B5]/90">{item.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Workstreams section */}
            <div className="bg-[#14243A] border border-[#22384F] rounded-lg">
              <div className="border-b border-[#22384F] px-5 py-4">
                <h3 className="text-[14px] font-semibold text-[#EAF3F9]">Workstreams del equipo</h3>
                <p className="text-[11.5px] text-[#64748B] mt-0.5">Líneas de trabajo internas y su avance</p>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Workstream</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Estado</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Responsable</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#22384F]">Progreso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#22384F]">
                  {modules.map((mod) => (
                    <tr key={mod.id} className="hover:bg-[#0E457F]/4 transition-colors">
                      <td className="px-5 py-3 font-medium text-[#EAF3F9] text-[13.5px]">{mod.name}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getBadgeStyle(mod.status)}`}>
                          {mod.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[13px]">
                        <span className={mod.owner === 'Sin asignar' ? 'text-[#64748B] italic' : 'text-[#8DA2B5]'}>{mod.owner}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-[54px] bg-[#22384F] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${mod.progress === 100 ? 'bg-[#10CC82]' : mod.progress === 0 ? 'bg-[#64748B]/30' : 'bg-[#0E457F]'}`}
                              style={{ width: `${mod.progress}%` }}
                            ></div>
                          </div>
                          <span className={`text-[11.5px] font-semibold font-mono ${mod.progress === 100 ? 'text-[#10CC82]' : mod.progress === 0 ? 'text-[#64748B]' : 'text-[#47B6E6]'}`}>{mod.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Consolidated Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#14243A] border border-[#22384F] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#00C9A7]">
              <div className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">AI Airports Activos</div>
              <div className="text-[24px] font-bold text-[#EAF3F9] mt-1 tracking-tight leading-none">3 Nodos (BCN, MAD, LIS)</div>
              <div className="text-[11px] text-[#00C9A7] flex items-center gap-1 mt-3">
                <Sparkles className="w-3 h-3" /> Precisión Promedio: 94.2%
              </div>
            </div>

            <div className="bg-[#14243A] border border-[#22384F] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#0E457F]">
              <div className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">Hito de Progreso Actual</div>
              <div className="text-[24px] font-bold text-[#EAF3F9] mt-1 tracking-tight leading-none">Fase 2 (En Curso)</div>
              <div className="text-[11px] text-[#47B6E6] flex items-center gap-1 mt-3">
                <Activity className="w-3 h-3" /> Hitos de Fase 2: 70%
              </div>
            </div>

            <div className="bg-[#14243A] border border-[#22384F] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#47B6E6]">
              <div className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">Runway Disponible</div>
              <div className="text-[24px] font-bold text-[#EAF3F9] mt-1 tracking-tight leading-none">16.5 Meses</div>
              <div className="text-[11px] text-[#47B6E6] flex items-center gap-1 mt-3">
                <TrendingUp className="w-3 h-3" /> Caja: €504K restante
              </div>
            </div>

            <div className="bg-[#14243A] border border-[#22384F] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#F5A623]">
              <div className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">Masa Salarial / Mes</div>
              <div className="text-[24px] font-bold text-[#EAF3F9] mt-1 tracking-tight leading-none">€35.5K /mes</div>
              <div className="text-[11px] text-[#F5A623] flex items-center gap-1 mt-3">
                <Users className="w-3 h-3" /> 5 personas + Hiring
              </div>
            </div>
          </div>

          {/* Table: AI Airports Deployments */}
          <div className="bg-[#14243A] border border-[#22384F] rounded-lg">
            <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#00C9A7]" />
                <h3 className="text-[14px] font-semibold text-[#EAF3F9]">Estado de Despliegue de AI Airports</h3>
              </div>
              <span className="text-[10.5px] bg-[#00C9A7]/15 text-[#00C9A7] font-mono px-2 py-0.5 rounded font-bold uppercase">3 nodos activos</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-[#22384F]">
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">IATA</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Aeropuerto</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Ubicación</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Precisión IA</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Pasajeros/Día</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Reducción Espera</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Módulos Activos</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#22384F]">
                  <tr className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-[#47B6E6]">BCN</td>
                    <td className="px-5 py-3.5 font-medium text-[#EAF3F9]">Aeropuerto El Prat</td>
                    <td className="px-5 py-3.5 text-[#64748B]">Barcelona · España</td>
                    <td className="px-5 py-3.5 text-[#00C9A7] font-mono font-bold">98.1%</td>
                    <td className="px-5 py-3.5 text-[#8DA2B5]">52K</td>
                    <td className="px-5 py-3.5 text-[#10CC82] font-semibold">-41%</td>
                    <td className="px-5 py-3.5 text-[12.5px] text-[#8DA2B5]">AI Queue Predictor · Live Dashboard</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-[#10CC82]/15 text-[#10CC82] text-[10px] font-bold px-2 py-0.5 rounded">Activo</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-[#47B6E6]">MAD</td>
                    <td className="px-5 py-3.5 font-medium text-[#EAF3F9]">Aeropuerto Barajas</td>
                    <td className="px-5 py-3.5 text-[#64748B]">Madrid · España</td>
                    <td className="px-5 py-3.5 text-[#00C9A7] font-mono font-bold">93.4%</td>
                    <td className="px-5 py-3.5 text-[#8DA2B5]">74K</td>
                    <td className="px-5 py-3.5 text-[#10CC82] font-semibold">-35%</td>
                    <td className="px-5 py-3.5 text-[12.5px] text-[#8DA2B5]">AI Queue Predictor</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-[#10CC82]/15 text-[#10CC82] text-[10px] font-bold px-2 py-0.5 rounded">Activo</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-[#47B6E6]">LIS</td>
                    <td className="px-5 py-3.5 font-medium text-[#EAF3F9]">Aeroporto de Lisboa</td>
                    <td className="px-5 py-3.5 text-[#64748B]">Lisboa · Portugal</td>
                    <td className="px-5 py-3.5 text-[#00C9A7] font-mono font-bold">91.2%</td>
                    <td className="px-5 py-3.5 text-[#8DA2B5]">16K</td>
                    <td className="px-5 py-3.5 text-[#10CC82] font-semibold">-38%</td>
                    <td className="px-5 py-3.5 text-[12.5px] text-[#8DA2B5]">AI Queue Predictor · Piloto</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-[#0E457F]/15 text-[#47B6E6] text-[10px] font-bold px-2 py-0.5 rounded">Beta</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table: Project Milestones & Progress */}
          <div className="bg-[#14243A] border border-[#22384F] rounded-lg">
            <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#47B6E6]" />
                <h3 className="text-[14px] font-semibold text-[#EAF3F9]">Hitos Estratégicos &amp; Financieros (Compensaciones de Progreso)</h3>
              </div>
              <span className="text-[10.5px] bg-[#47B6E6]/15 text-[#47B6E6] font-mono px-2 py-0.5 rounded font-bold uppercase">Consolidado fases 1-4</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-[#22384F]">
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Fase</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Descripción</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Financiación</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Fecha Objetivo</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Hito Crítico</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Progreso</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#22384F]">
                  <tr className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white text-[13px]">Fase 1</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-[#EAF3F9]">Validación y MVP</div>
                      <div className="text-[11.5px] text-[#64748B]">Lanzamiento en Barajas con Iberia</div>
                    </td>
                    <td className="px-5 py-3.5 text-[#8DA2B5] font-mono text-[12.5px]">Fundadores (€400K)</td>
                    <td className="px-5 py-3.5 text-[#64748B] text-[12.5px]">Q1 2026</td>
                    <td className="px-5 py-3.5 text-[#EAF3F9] text-[12.5px]">Firma de acuerdo con Iberia T4</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-[60px] bg-[#22384F] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#10CC82] h-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="text-[11.5px] font-semibold text-[#10CC82]">100%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-[#10CC82]/15 text-[#10CC82] text-[10px] font-bold px-2 py-0.5 rounded">Completado</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white text-[13px]">Fase 2</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-[#EAF3F9]">Escalamiento Local</div>
                      <div className="text-[11.5px] text-[#64748B]">Sincronización de vouchers comercios</div>
                    </td>
                    <td className="px-5 py-3.5 text-[#8DA2B5] font-mono text-[12.5px]">SAFE Semilla ($180K)</td>
                    <td className="px-5 py-3.5 text-[#64748B] text-[12.5px]">Q3 2026</td>
                    <td className="px-5 py-3.5 text-[#EAF3F9] text-[12.5px]">SAFE Clara Ortiz &amp; Air Europa</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-[60px] bg-[#22384F] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#0E457F] h-full" style={{ width: '70%' }}></div>
                        </div>
                        <span className="text-[11.5px] font-semibold text-[#47B6E6]">70%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-[#0E457F]/15 text-[#47B6E6] text-[10px] font-bold px-2 py-0.5 rounded">En Curso</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white text-[13px]">Fase 3</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-[#EAF3F9]">Expansión Europea</div>
                      <div className="text-[11.5px] text-[#64748B]">App nativa &amp; aeropuertos EMEA</div>
                    </td>
                    <td className="px-5 py-3.5 text-[#8DA2B5] font-mono text-[12.5px]">Semilla (€1.2M)</td>
                    <td className="px-5 py-3.5 text-[#64748B] text-[12.5px]">Q4 2026</td>
                    <td className="px-5 py-3.5 text-[#EAF3F9] text-[12.5px]">Levantar €1.2M con Andes Ventures</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-[60px] bg-[#22384F] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#64748B]/30 h-full" style={{ width: '0%' }}></div>
                        </div>
                        <span className="text-[11.5px] font-semibold text-[#64748B]">0%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-[#64748B]/10 text-[#64748B] text-[10px] font-bold px-2 py-0.5 rounded">Planificado</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white text-[13px]">Fase 4</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-[#EAF3F9]">Serie A &amp; Global</div>
                      <div className="text-[11.5px] text-[#64748B]">Módulo AI Baggage Tracking</div>
                    </td>
                    <td className="px-5 py-3.5 text-[#8DA2B5] font-mono text-[12.5px]">Serie A (€5.0M)</td>
                    <td className="px-5 py-3.5 text-[#64748B] text-[12.5px]">Q3 2027</td>
                    <td className="px-5 py-3.5 text-[#EAF3F9] text-[12.5px]">Predictor inteligente de pérdida de equipaje</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-[60px] bg-[#22384F] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#64748B]/30 h-full" style={{ width: '0%' }}></div>
                        </div>
                        <span className="text-[11.5px] font-semibold text-[#64748B]">0%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-[#47B6E6]/10 text-[#47B6E6] text-[10px] font-bold px-2 py-0.5 rounded">I+D</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table: Team Compensation Summary */}
          <div className="bg-[#14243A] border border-[#22384F] rounded-lg">
            <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0E457F]" />
                <h3 className="text-[14px] font-semibold text-[#EAF3F9]">Compensaciones y Estructura Salarial de Equipo</h3>
              </div>
              <span className="text-[10.5px] bg-[#0E457F]/15 text-[#47B6E6] font-mono px-2 py-0.5 rounded font-bold uppercase">5 integrantes clave</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-[#22384F]">
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Persona</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Rol / Cargo</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Salario Mensual</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Equity (Acciones)</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Vesting / Permanencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#22384F]">
                  <tr className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#EAF3F9]">Sebastian M.</td>
                    <td className="px-5 py-3.5 text-[#47B6E6] font-medium">Founder (CEO)</td>
                    <td className="px-5 py-3.5 font-mono">€4,500 /mes</td>
                    <td className="px-5 py-3.5 text-[#47B6E6] font-bold">45.0%</td>
                    <td className="px-5 py-3.5 text-xs text-[#10CC82] font-semibold">Founder (Totalmente Adquirido)</td>
                  </tr>
                  <tr className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#EAF3F9]">Alex V.</td>
                    <td className="px-5 py-3.5 text-[#00C9A7] font-medium">Co-founder (CTO)</td>
                    <td className="px-5 py-3.5 font-mono">€4,500 /mes</td>
                    <td className="px-5 py-3.5 text-[#47B6E6] font-bold">30.5%</td>
                    <td className="px-5 py-3.5 text-xs text-[#10CC82] font-semibold">Founder (Totalmente Adquirido)</td>
                  </tr>
                  <tr className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#EAF3F9]">María R.</td>
                    <td className="px-5 py-3.5 text-[#47B6E6] font-medium">Senior Engineer</td>
                    <td className="px-5 py-3.5 font-mono">€9,000 /mes</td>
                    <td className="px-5 py-3.5 text-[#47B6E6] font-bold">0.8%</td>
                    <td className="px-5 py-3.5 text-xs text-[#8DA2B5]">Año 2 de 4 (40%)</td>
                  </tr>
                  <tr className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#EAF3F9]">Jorge L.</td>
                    <td className="px-5 py-3.5 text-[#F5A623] font-medium">Senior ML Engineer</td>
                    <td className="px-5 py-3.5 font-mono">€10,000 /mes</td>
                    <td className="px-5 py-3.5 text-[#47B6E6] font-bold">0.7%</td>
                    <td className="px-5 py-3.5 text-xs text-[#8DA2B5]">Año 1 de 4 (25%)</td>
                  </tr>
                  <tr className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#EAF3F9]">Laura C.</td>
                    <td className="px-5 py-3.5 text-[#10CC82] font-medium">Sales AE</td>
                    <td className="px-5 py-3.5 font-mono">€7,500 /mes</td>
                    <td className="px-5 py-3.5 text-[#47B6E6] font-bold">0.4%</td>
                    <td className="px-5 py-3.5 text-xs text-[#8DA2B5]">Mes 6 de 48 (15%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detail Backlog Modal */}
      {isBacklogOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1A2C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243A] border border-[#22384F] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#EAF3F9] flex items-center gap-1.5"><List className="w-4 h-4 text-[#0E457F]" /> Backlog de Requerimientos</h3>
              <button onClick={() => setIsBacklogOpen(false)} className="text-[#64748B] hover:text-[#EAF3F9] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 max-h-[400px] overflow-y-auto space-y-3 divide-y divide-[#22384F]/60">
              <div className="pt-2 first:pt-0">
                <div className="flex justify-between items-start text-[13px]">
                  <span className="font-semibold text-[#47B6E6]">#IW-192 Redirección de contingencias</span>
                  <span className="text-[10px] bg-[#2A415A] px-1.5 py-0.5 text-[#8DA2B5] rounded">Alta</span>
                </div>
                <p className="text-[11.5px] text-[#64748B] mt-1">Automatización de triggers de cupones digitales mediante integraciones con el API de OPAIN.</p>
              </div>
              <div className="pt-3">
                <div className="flex justify-between items-start text-[13px]">
                  <span className="font-semibold text-[#EAF3F9]">#IW-113 Validación de pasaportes vía OCR</span>
                  <span className="text-[10px] bg-[#2A415A] px-1.5 py-0.5 text-[#8DA2B5] rounded">Media</span>
                </div>
                <p className="text-[11.5px] text-[#64748B] mt-1">Módulo para que el pasajero escanee su ID nacional en WhatsApp y se asiente su cupón de alimentación.</p>
              </div>
              <div className="pt-3">
                <div className="flex justify-between items-start text-[13px]">
                  <span className="font-semibold text-[#EAF3F9]">#IW-88 Compensaciones automáticas SEPA</span>
                  <span className="text-[10px] bg-[#2A415A] px-1.5 py-0.5 text-[#8DA2B5] rounded font-mono">Baja</span>
                </div>
                <p className="text-[11.5px] text-[#64748B] mt-1">Sincronización con bancos locales europeos para realizar pagos automáticos instantáneos.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Feature Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1A2C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243A] border border-[#22384F] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#EAF3F9]">Añadir Nueva Feature</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#64748B] hover:text-[#EAF3F9] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateFeature} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Título / Módulo</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Notificaciones push en tiempo real v1"
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Descripción</label>
                <textarea 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Objetivo e impacto de la feature"
                  rows={2}
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Trimestre Objetivo</label>
                  <select 
                    value={quarter}
                    onChange={(e: any) => setQuarter(e.target.value)}
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-sm"
                  >
                    <option value="Q2 2026">Q2 2026</option>
                    <option value="Q3 2026">Q3 2026</option>
                    <option value="Q4 2026">Q4 2026</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Estado Inicial</label>
                  <select 
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-sm"
                  >
                    <option value="Planificado">Planificado</option>
                    <option value="En desarrollo">En desarrollo</option>
                    <option value="Completado">Listo / Completado</option>
                    <option value="R&D">I+D (Investigación)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-[#22384F] pt-4 flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-transparent border border-[#2A415A] text-[#64748B] hover:text-[#EAF3F9] text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg font-medium text-sm cursor-pointer"
                >
                  Publicar Feature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
