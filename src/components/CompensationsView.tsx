import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Plus, 
  Home, 
  Laptop, 
  PieChart, 
  BookOpen, 
  Heart, 
  Plane,
  X,
  Sparkles,
  Users,
  TrendingDown,
  Clock,
  Compass,
  CheckCircle2,
  ArrowRight,
  Milestone,
  Award,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { KanbanTask } from '../data/iwaitData';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleBadge: string;
  salary: number;
  equity: number;
  vestingLabel: string;
  vestingPct: number;
  avatarBg: string;
  isCustom?: boolean;
}

interface CompensationsViewProps {
  triggerToast: (msg: string) => void;
  tasks?: KanbanTask[];
}

export default function CompensationsView({ triggerToast, tasks = [] }: CompensationsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'roadmap' | 'compensations'>('roadmap');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<number>(2); // Default selected phase is current (Phase 2)
  
  // Team compensation state
  const [team, setTeam] = useState<TeamMember[]>([
    { id: '1', name: 'Sebastian M.', role: 'Founder', roleBadge: 'CEO', salary: 4500, equity: 45, vestingLabel: 'Founder', vestingPct: 100, avatarBg: 'from-[#4F7EF8] to-[#8B63F5]' },
    { id: '2', name: 'Alex V.', role: 'Co-founder', roleBadge: 'CTO', salary: 4500, equity: 30.5, vestingLabel: 'Founder', vestingPct: 100, avatarBg: 'from-[#00C9A7] to-[#4F7EF8]' },
    { id: '3', name: 'María R.', role: 'Senior', roleBadge: 'Eng.', salary: 9000, equity: 0.8, vestingLabel: 'Año 2 de 4', vestingPct: 40, avatarBg: 'from-[#8B63F5] to-[#E879A0]' },
    { id: '4', name: 'Jorge L.', role: 'Senior', roleBadge: 'ML Eng.', salary: 10000, equity: 0.7, vestingLabel: 'Año 1 de 4', vestingPct: 25, avatarBg: 'from-[#F5A623] to-[#F05252]' },
    { id: '5', name: 'Laura C.', role: 'Sales', roleBadge: 'AE', salary: 7500, equity: 0.4, vestingLabel: 'Mes 6 de 48', vestingPct: 15, avatarBg: 'from-[#10CC82] to-[#00C9A7]' },
    { id: '6', name: 'Open hire', role: 'Buscando', roleBadge: 'Backend', salary: 8000, equity: 0.3, vestingLabel: 'Hiring', vestingPct: 0, avatarBg: 'from-[#444] to-[#666]' }
  ]);

  // Form states
  const [name, setName] = useState('');
  const [roleGroup, setRoleGroup] = useState('Eng.');
  const [salaryStr, setSalaryStr] = useState('');
  const [equityStr, setEquityStr] = useState('');

  // Dynamically calculate KPIs
  const totalSalary = team.reduce((acc, curr) => acc + curr.salary, 0);
  const assignedEquity = team.reduce((acc, curr) => acc + curr.equity, 0);
  const monthlyBurn = totalSalary + 14000; // salary + 14k operational cost
  const customRunway = (504000 / monthlyBurn).toFixed(1); // 504k remaining cash divided by burn

  // Live Task Helper to match and display live state of relevant corporate milestones
  const getLiveTask = (keywords: string[]) => {
    return tasks.find(t => 
      keywords.every(kw => t.title.toLowerCase().includes(kw.toLowerCase()))
    );
  };

  // Find actual live tasks for Phase 2
  const safeTask = getLiveTask(['clara', 'ortiz']);
  const airEuropaTask = getLiveTask(['air europa']);
  const jfkTask = getLiveTask(['jfk']);
  const bogDashboardTask = getLiveTask(['conciliación', 'bog']);
  const walletTask = getLiveTask(['wallet', 'apple']);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const sal = parseFloat(salaryStr) || 6000;
    const eq = parseFloat(equityStr) || 0.2;

    const newMb: TeamMember = {
      id: `mb-${Date.now()}`,
      name,
      role: 'Full-time Hire',
      roleBadge: roleGroup,
      salary: sal,
      equity: eq,
      vestingLabel: 'Mes 1 de 48',
      vestingPct: 2,
      avatarBg: 'from-[#8B63F5] to-[#4F7EF8]',
      isCustom: true
    };

    setTeam([...team.filter(t => t.name !== 'Open hire'), newMb, team.find(t => t.name === 'Open hire')!].filter(Boolean) as TeamMember[]);
    triggerToast(`"${name}" de incorporación reciente agregada al simular de compensaciones.`);
    setName('');
    setSalaryStr('');
    setEquityStr('');
    setIsModalOpen(false);
  };

  const getTaskStatusLabel = (task?: KanbanTask, fallback: string = 'Planificado') => {
    if (!task) return fallback;
    if (task.column === 'Hecho') return 'Completado';
    if (task.column === 'En Progreso') return 'En desarrollo';
    return 'Pendiente';
  };

  const getTaskStatusColor = (task?: KanbanTask, fallbackColor: string = 'text-[#6B7AAD]') => {
    if (!task) return fallbackColor;
    if (task.column === 'Hecho') return 'text-[#10CC82]';
    if (task.column === 'En Progreso') return 'text-[#4F7EF8]';
    return 'text-[#F5A623]';
  };

  // Corporate stages definition
  const corporateStages = [
    {
      number: 1,
      title: 'Fase 1: Validación y MVP',
      subtitle: 'Completado (100%)',
      status: 'completado',
      description: 'Constitución legal de iwait, desarrollo de la versión inicial del motor de colas en WhatsApp, y validación en el Hub de Madrid-Barajas con Iberia.',
      funding: 'Fundadores (€400K)',
      date: 'Finalizado en Q1 2026',
      milestones: [
        { title: 'Levantar capital de fundadores e inversores ángeles (€200K + €50K)', isCompleted: true },
        { title: 'Firmar acuerdo comercial con Iberia T4 Barajas', isCompleted: true },
        { title: 'Integrar Meta WhatsApp Cloud API para envío de cupones', isCompleted: true },
        { title: 'Primeros 500 pasajeros compensados con éxito en Barajas', isCompleted: true }
      ]
    },
    {
      number: 2,
      title: 'Fase 2: Escalamiento Local & Estabilización',
      subtitle: 'En Curso (70%)',
      status: 'en_curso',
      description: 'Sincronización con comercios locales para canje de vouchers, automatización de triggers y cierre legal del SAFE de Clara Ortiz por $180K USD.',
      funding: 'SAFE Semilla / Pre-Seed',
      date: 'En progreso · Cierre Q3 2026',
      milestones: [
        { 
          title: 'Cierre legal de SAFE con Clara Ortiz ($180K)', 
          isCompleted: safeTask?.column === 'Hecho', 
          linkedTask: safeTask 
        },
        { 
          title: 'Firma de contrato comercial con Air Europa', 
          isCompleted: airEuropaTask?.column === 'Hecho', 
          linkedTask: airEuropaTask 
        },
        { 
          title: 'Integrar base de datos de comercios JFK Terminal 4 (restaurantes de terminal)', 
          isCompleted: jfkTask?.column === 'Hecho', 
          linkedTask: jfkTask 
        },
        { 
          title: 'Finalizar Dashboard de Conciliación en Bogotá (El Dorado OPAIN)', 
          isCompleted: bogDashboardTask ? bogDashboardTask.column === 'Hecho' : true, 
          linkedTask: bogDashboardTask 
        },
        { 
          title: 'Rediseño visual del Wallet Apple Pass en producción', 
          isCompleted: walletTask?.column === 'Hecho', 
          linkedTask: walletTask 
        }
      ]
    },
    {
      number: 3,
      title: 'Fase 3: Ronda Semilla & Expansión Europea',
      subtitle: 'Planificado',
      status: 'planificado',
      description: 'Lanzamiento de la aplicación nativa para pasajeros e internacionalización de la red comercial en aeropuertos del Reino Unido y Alemania.',
      funding: 'Ronda Semilla (€1.2M - Andes Ventures)',
      date: 'Estimado Q4 2026 / Q1 2027',
      milestones: [
        { title: 'Levantar Ronda Semilla institucional de €1.2M', isCompleted: false },
        { title: 'Lanzar App de Pasajeros IWAIT (notificaciones proactivas de colas)', isCompleted: false },
        { title: 'Expandir la red a 12 aeropuertos internacionales de EMEA', isCompleted: false },
        { title: 'Incorporar un ML Engineer Senior y un Backend Lead (Hiring)', isCompleted: false }
      ]
    },
    {
      number: 4,
      title: 'Fase 4: Serie A & Consolidación Global',
      subtitle: 'Planificado (I+D)',
      status: 'planificado',
      description: 'Sistemas automáticos de transferencia de dinero SEPA/ACH instantáneos para vuelos cancelados y un predictor inteligente de pérdida de equipaje mediante IA.',
      funding: 'Serie A (€5M)',
      date: 'Estimado Q3 2027',
      milestones: [
        { title: 'Levantar Ronda Serie A global de €5.0M', isCompleted: false },
        { title: 'Desplegar módulo "AI Baggage Tracking" en 3 aeropuertos estratégicos', isCompleted: false },
        { title: 'Conectar API con el 90% de las aerolíneas líderes en LATAM y EMEA', isCompleted: false }
      ]
    }
  ];

  // Dynamic calculations for roadmap completeness based on actual tasks
  const currentPhaseMilestones = corporateStages[1].milestones;
  const completedCurrentPhaseMilestones = currentPhaseMilestones.filter(m => m.isCompleted).length;
  const phase2Progress = Math.round((completedCurrentPhaseMilestones / currentPhaseMilestones.length) * 100);

  return (
    <div className="animate-fade-in space-y-7">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1C2248] pb-5 gap-4">
        <div>
          <h2 className="text-[20px] font-semibold text-[#E4EAFF] tracking-tight">Progreso &amp; Compensaciones</h2>
          <p className="text-[13px] text-[#6B7AAD] mt-0.5">Visión estratégica: Hitos corporativos, roadmap de la startup, nóminas y control de runway</p>
        </div>
        
        {/* Sub-tab Toggle */}
        <div className="bg-[#090C20] border border-[#1C2248] rounded-lg p-1 flex">
          <button
            onClick={() => setActiveSubTab('roadmap')}
            className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'roadmap'
                ? 'bg-[#4F7EF8] text-white'
                : 'text-[#6B7AAD] hover:text-[#E4EAFF]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Cómo Vamos
          </button>
          <button
            onClick={() => setActiveSubTab('compensations')}
            className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'compensations'
                ? 'bg-[#4F7EF8] text-white'
                : 'text-[#6B7AAD] hover:text-[#E4EAFF]'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Finanzas &amp; Equipo
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ROADMAP SUB-TAB CONTENT ("CÓMO VAMOS") */}
      {/* ========================================================= */}
      {activeSubTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#4F7EF8]">
              <div className="text-[11px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Fase Actual</div>
              <div className="text-[20px] font-bold text-[#E4EAFF] mt-1.5 tracking-tight leading-none">Fase 2: Escalamiento</div>
              <div className="text-[11px] text-[#7AA4FA] flex items-center gap-1 mt-3">
                <Activity className="w-3 h-3 animate-pulse" /> {phase2Progress}% completado
              </div>
            </div>

            <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#10CC82]">
              <div className="text-[11px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Hitos Estratégicos</div>
              <div className="text-[20px] font-bold text-[#E4EAFF] mt-1.5 tracking-tight leading-none">
                {4 + completedCurrentPhaseMilestones} / 15
              </div>
              <div className="text-[11px] text-[#10CC82] flex items-center gap-1 mt-3">
                <CheckCircle2 className="w-3 h-3" /> F1 (100%) + F2 ({phase2Progress}%)
              </div>
            </div>

            <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#F5A623]">
              <div className="text-[11px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Siguiente Hito Clave</div>
              <div className="text-[20px] font-bold text-[#E4EAFF] mt-1.5 tracking-tight leading-none truncate">SAFE Clara Ortiz</div>
              <div className="text-[11px] text-[#F5A623] flex items-center gap-1 mt-3">
                <Clock className="w-3 h-3" /> Cierre planeado en 5 días
              </div>
            </div>

            <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#8B63F5]">
              <div className="text-[11px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Runway &amp; Finanzas</div>
              <div className="text-[20px] font-bold text-[#E4EAFF] mt-1.5 tracking-tight leading-none">{customRunway} meses</div>
              <div className="text-[11px] text-[#8B63F5] flex items-center gap-1 mt-3">
                <TrendingUp className="w-3 h-3" /> Fondo disponible: €504K
              </div>
            </div>
          </div>

          {/* Core Interactive Roadmap & Dynamic Stage Tasks split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left: The Roadmap Visual Stepper */}
            <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between border-b border-[#1C2248] pb-3">
                <h3 className="text-[14px] font-semibold text-[#E4EAFF] flex items-center gap-2">
                  <Milestone className="w-4 h-4 text-[#4F7EF8]" />
                  Etapas corporativas del Roadmap
                </h3>
                <span className="text-[10px] bg-[#1C2248] text-[#9AA3CC] px-2 py-0.5 rounded font-mono uppercase">Línea de tiempo</span>
              </div>

              {/* Steps Timeline Wrapper */}
              <div className="relative border-l-2 border-[#1C2248] ml-4 pl-6 space-y-7 py-2">
                
                {corporateStages.map((stage) => {
                  const isSelected = selectedPhase === stage.number;
                  const isCompleted = stage.status === 'completado';
                  const isCurrent = stage.status === 'en_curso';

                  return (
                    <div 
                      key={stage.number} 
                      onClick={() => setSelectedPhase(stage.number)}
                      className={`relative group cursor-pointer transition-all duration-200 ${
                        isSelected ? 'scale-[1.01]' : 'hover:translate-x-0.5'
                      }`}
                    >
                      {/* Left Dot Indicator */}
                      <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-[#0F1330] flex items-center justify-center transition-all ${
                        isCompleted 
                          ? 'border-[#10CC82] bg-[#10CC82]/10 scale-110' 
                          : isCurrent 
                          ? 'border-[#4F7EF8] bg-[#4F7EF8]/10 scale-110 shadow-[0_0_10px_rgba(79,126,248,0.4)]' 
                          : 'border-[#1C2248]'
                      }`}>
                        {isCompleted && <span className="w-1.5 h-1.5 rounded-full bg-[#10CC82]" />}
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#4F7EF8] animate-ping" />}
                      </span>

                      {/* Card Box */}
                      <div className={`p-4 rounded-lg border transition-all ${
                        isSelected 
                          ? 'bg-[#131740] border-[#4F7EF8]' 
                          : 'bg-[#131740]/40 border-[#1C2248] hover:border-[#1C2248]/80'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="text-[13px] font-semibold text-[#E4EAFF] group-hover:text-white">
                            {stage.title}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold w-fit ${
                            isCompleted 
                              ? 'bg-[#10CC82]/15 text-[#10CC82]' 
                              : isCurrent 
                              ? 'bg-[#4F7EF8]/15 text-[#7AA4FA]' 
                              : 'bg-[#6B7AAD]/10 text-[#6B7AAD]'
                          }`}>
                            {stage.number === 2 ? `En curso (${phase2Progress}%)` : stage.subtitle}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-[#6B7AAD] mt-1.5 leading-relaxed truncate-2-lines">{stage.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[10.5px] text-[#9AA3CC]">
                          <span className="flex items-center gap-1 font-mono">
                            <span className="text-[#6B7AAD]">Financiación:</span> {stage.funding}
                          </span>
                          <span className="text-[#1C2248]">•</span>
                          <span className="text-[#6B7AAD] font-mono">{stage.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* Right: Detailed Selected Phase and Live Interlinked Tasks */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Detailed Card for Selected Phase */}
              <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 space-y-4">
                {(() => {
                  const stage = corporateStages.find(s => s.number === selectedPhase)!;
                  const isCurrentPhase = stage.number === 2;

                  return (
                    <>
                      <div className="border-b border-[#1C2248] pb-3.5">
                        <div className="text-[10px] text-[#4F7EF8] font-bold uppercase tracking-wider font-mono mb-1">Fase seleccionada</div>
                        <h4 className="text-[15px] font-bold text-[#E4EAFF]">{stage.title}</h4>
                        <p className="text-[12px] text-[#6B7AAD] mt-1">{stage.description}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider">Hitos y tareas vinculadas:</div>
                        
                        <div className="space-y-2.5">
                          {stage.milestones.map((m, idx) => {
                            // Check if this is a live linked task
                            const linkedTask = 'linkedTask' in m ? m.linkedTask as KanbanTask | undefined : undefined;
                            const isDone = m.isCompleted;

                            return (
                              <div 
                                key={idx} 
                                className={`p-3 rounded-lg border text-[12.5px] transition-all ${
                                  isDone 
                                    ? 'bg-[#10CC82]/4 border-[#10CC82]/15 text-[#E4EAFF]' 
                                    : linkedTask && linkedTask.column === 'En Progreso'
                                    ? 'bg-[#4F7EF8]/4 border-[#4F7EF8]/20 text-[#E4EAFF]'
                                    : 'bg-white/[0.01] border-[#1C2248] text-[#9AA3CC]'
                                }`}
                              >
                                <div className="flex items-start gap-2.5">
                                  <span className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center text-[10px] ${
                                    isDone 
                                      ? 'bg-[#10CC82] text-[#07091C] font-bold' 
                                      : linkedTask && linkedTask.column === 'En Progreso'
                                      ? 'bg-[#4F7EF8] text-white animate-pulse'
                                      : 'border border-[#6B7AAD]/40'
                                  }`}>
                                    {isDone ? '✓' : '●'}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <div className={`font-medium ${isDone ? 'line-through text-[#6B7AAD]' : 'text-[#E4EAFF]'}`}>
                                      {m.title}
                                    </div>
                                    
                                    {/* Live feedback loop from Kanban Board */}
                                    {linkedTask && (
                                      <div className="mt-2 pt-2 border-t border-[#1C2248]/40 flex items-center justify-between text-[11px]">
                                        <span className="text-[#6B7AAD]">
                                          Asignado: <strong className="text-[#9AA3CC] font-mono">{linkedTask.assignedTo}</strong>
                                        </span>
                                        <span className={`font-mono font-bold flex items-center gap-1 ${getTaskStatusColor(linkedTask)}`}>
                                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                          {getTaskStatusLabel(linkedTask)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {isCurrentPhase && (
                        <div className="bg-[#4F7EF8]/4 border border-[#4F7EF8]/15 rounded-lg p-3 text-xs leading-relaxed text-[#6B7AAD] flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-[#7AA4FA] flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[#E4EAFF] font-medium">Nota de Sincronización:</span> Las tareas de esta etapa están enlazadas en tiempo real con el Kanban de <strong className="text-[#7AA4FA]">Operaciones &gt; Tareas</strong>. Moverlas allí actualizará automáticamente el progreso de esta sección.
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Hiring roadmap / Options pool alignment */}
              <div className="bg-[#0F1330] border border-[#1C2248] p-5 rounded-lg space-y-4">
                <div className="flex items-center gap-1.5 text-white font-semibold text-[13.5px]">
                  <Users className="w-4 h-4 text-[#8B63F5]" />
                  Planificación de Incorporaciones (Hiring)
                </div>
                <p className="text-[12px] text-[#6B7AAD] leading-relaxed">
                  Para habilitar la Fase 3, se requiere incorporar los siguientes perfiles críticos con cargo al presupuesto asignado.
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 bg-[#131740]/40 border border-[#1C2248] rounded-lg">
                    <div>
                      <div className="text-[12px] font-semibold text-[#E4EAFF]">Lead Backend Developer</div>
                      <div className="text-[10px] text-[#6B7AAD]">Fase 2 (Pendiente) · Opción stock 0.3%</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#F5A623] bg-[#F5A623]/15 px-2 py-0.5 rounded uppercase font-bold">Open hire</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#131740]/40 border border-[#1C2248] rounded-lg">
                    <div>
                      <div className="text-[12px] font-semibold text-[#E4EAFF]">Chief Financial Officer (CFO)</div>
                      <div className="text-[10px] text-[#6B7AAD]">Fase 3 (Planificado) · Opción stock 1.0%</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#6B7AAD] bg-[#6B7AAD]/10 px-2 py-0.5 rounded uppercase font-bold">Q4 2026</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FINANCES & TEAM SUB-TAB CONTENT ("ESTRUCTURA Y NÓMINAS") */}
      {/* ========================================================= */}
      {activeSubTab === 'compensations' && (
        <>
          {/* Dynamic KPIs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#4F7EF8]">
              <div className="text-[12px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Masa salarial total</div>
              <div className="text-[28px] font-bold text-[#E4EAFF] mt-2 tracking-tight leading-none">€{(totalSalary / 1000).toFixed(0)}K</div>
              <div className="text-[12px] text-[#9AA3CC] flex items-center gap-1 mt-2.5">
                <Users className="w-[13px] h-[13px]" /> {team.length} personas · /mes
              </div>
            </div>

            <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#8B63F5]">
              <div className="text-[12px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Pool de opciones</div>
              <div className="text-[28px] font-bold text-[#E4EAFF] mt-2 tracking-tight leading-none">8.5%</div>
              <div className="text-[12px] text-[#E4EAFF] flex items-center gap-1 mt-2.5">
                {assignedEquity.toFixed(1)}% asignado founders + team
              </div>
            </div>

            <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#00C9A7]">
              <div className="text-[12px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Burn mensual</div>
              <div className="text-[28px] font-bold text-white mt-2 tracking-tight leading-none">€{(monthlyBurn / 1000).toFixed(0)}K</div>
              <div className="text-[12px] text-[#F05252] flex items-center gap-1 mt-2.5">
                <TrendingDown className="w-[13px] h-[13px]" /> incl. operaciones
              </div>
            </div>

            <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#F5A623]">
              <div className="text-[12px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Runway</div>
              <div className="text-[28px] font-bold text-[#E4EAFF] mt-2 tracking-tight leading-none">{customRunway}m</div>
              <div className="text-[12px] text-[#10CC82] flex items-center gap-1 mt-2.5">
                <Clock className="w-[13px] h-[13px]" /> hasta Q1 2027
              </div>
            </div>
          </div>

          {/* Main split grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Team compensation list table */}
            <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg lg:col-span-7">
              <div className="border-b border-[#1C2248] p-5 flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-[#E4EAFF]">Equipo &amp; compensación</h3>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => triggerToast('Sueldos y proyecciones de dilución exportados como PDF fiscal')}
                    className="px-2.5 py-1 bg-[#131740] border border-[#222850] rounded text-[11px] text-[#9AA3CC] hover:text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Exportar
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="px-2.5 py-1 bg-[#4F7EF8] hover:bg-[#2B56D6] text-white rounded text-[11px] transition-all font-medium cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Simular persona
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/[0.02] text-left border-b border-[#1C2248]">
                      <th className="px-5 py-3 text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider">Persona</th>
                      <th className="px-5 py-3 text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider">Rol</th>
                      <th className="px-5 py-3 text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider">Salario/mes</th>
                      <th className="px-5 py-3 text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider">Equity</th>
                      <th className="px-5 py-3 text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider">Vesting</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C2248]">
                    {team.map((mb) => {
                      const nameParts = mb.name.split(' ');
                      const initials = nameParts.map(p => p[0]).join('').slice(0, 2);
                      return (
                        <tr key={mb.id} className="hover:bg-[#4F7EF8]/4 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${mb.avatarBg} flex items-center justify-center font-bold text-[10px] text-white flex-shrink-0`}>
                                {initials}
                              </div>
                              <div>
                                <div className="font-semibold text-[#E4EAFF] text-[13px]">{mb.name}</div>
                                <div className="text-[11px] text-[#6B7AAD] mt-0.5">{mb.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              mb.roleBadge === 'CEO' 
                                ? 'bg-[#4F7EF8]/15 text-[#7AA4FA]' 
                                : mb.roleBadge === 'CTO' 
                                ? 'bg-[#00C9A7]/15 text-[#00C9A7]' 
                                : mb.roleBadge === 'Eng.' || mb.roleBadge === 'ML Eng.'
                                ? 'bg-[#8B63F5]/15 text-[#8B63F5]'
                                : mb.roleBadge === 'AE'
                                ? 'bg-[#10CC82]/15 text-[#10CC82]'
                                : 'bg-[#9AA3CC]/10 text-[#6B7AAD]'
                            }`}>
                              {mb.roleBadge}
                            </span>
                          </td>
                          <td className="px-5 py-3 font-semibold text-white text-[13px]">
                            {mb.salary > 0 ? `€${mb.salary.toLocaleString('es-ES')}` : mb.salary}
                          </td>
                          <td className="px-5 py-3 text-[#8B63F5] font-bold text-[13px]">
                            {mb.equity}%
                          </td>
                          <td className="px-5 py-3">
                            {mb.vestingLabel === 'Founder' ? (
                              <span className="bg-[#10CC82]/15 text-[#10CC82] text-[10px] font-bold px-2 py-0.5 rounded">Founder</span>
                            ) : mb.vestingLabel === 'Hiring' ? (
                              <span className="bg-[#F5A623]/15 text-[#F5A623] text-[10px] font-bold px-2 py-0.5 rounded">Hiring</span>
                            ) : (
                              <div className="space-y-1 w-[80px]">
                                <div className="w-full bg-[#1C2248] h-1 rounded-full overflow-hidden">
                                  <div className="bg-[#F5A623] h-full rounded-full" style={{ width: `${mb.vestingPct}%` }}></div>
                                </div>
                                <div className="text-[10px] text-[#6B7AAD] whitespace-nowrap">{mb.vestingLabel}</div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: salary benchmarks & benefits */}
            <div className="lg:col-span-5 space-y-6">
              {/* benchmarks card */}
              <div className="bg-[#0F1330] border border-[#1C2248] p-5 rounded-lg space-y-4">
                <div>
                  <h3 className="text-[14px] font-semibold text-white">Bandas salariales</h3>
                  <p className="text-[11.5px] text-[#6B7AAD] mt-1">Referencia promedio de mercado (bruto anual) · España</p>
                </div>

                <div className="space-y-3.5 pt-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono font-semibold">
                      <span className="text-[#6B7AAD]">CEO</span>
                      <span className="text-[#9AA3CC]">€54K</span>
                    </div>
                    <div className="w-full bg-[#1C2248] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#4F7EF8] h-full rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono font-semibold">
                      <span className="text-[#6B7AAD]">CTO</span>
                      <span className="text-[#9AA3CC]">€54K</span>
                    </div>
                    <div className="w-full bg-[#1C2248] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#4F7EF8] h-full rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono font-semibold">
                      <span className="text-[#6B7AAD]">ML Eng.</span>
                      <span className="text-[#9AA3CC]">€120K</span>
                    </div>
                    <div className="w-full bg-[#1C2248] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#8B63F5] h-full rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono font-semibold">
                      <span className="text-[#6B7AAD]">Sr. Eng.</span>
                      <span className="text-[#9AA3CC]">€108K</span>
                    </div>
                    <div className="w-full bg-[#1C2248] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#8B63F5] h-full rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono font-semibold">
                      <span className="text-[#6B7AAD]">Sales AE</span>
                      <span className="text-[#9AA3CC]">€90K</span>
                    </div>
                    <div className="w-full bg-[#1C2248] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#00C9A7] h-full rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-[#6B7AAD] border-t border-[#1C2248]/60 pt-3 leading-normal font-sans">
                  * Sueldos actuales de founders regulados por debajo de mercado de forma intencional en pro del runway. Ajuste planificado post Serie A.
                </div>
              </div>

              {/* Perks card */}
              <div className="bg-[#0F1330] border border-[#1C2248] p-5 rounded-lg space-y-4">
                <h3 className="text-[14px] font-semibold text-white">Beneficios &amp; perks</h3>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2 p-2 bg-white/[0.02] hover:bg-white/[0.06] transition-colors border border-[#1C2248]/50 rounded-lg">
                    <Home className="w-4 h-4 text-[#4F7EF8] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-[#E4EAFF] truncate">Trabajo remoto</div>
                      <div className="text-[10px] text-[#6B7AAD] truncate">100% flexible</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-white/[0.02] hover:bg-white/[0.06] transition-colors border border-[#1C2248]/50 rounded-lg">
                    <Laptop className="w-4 h-4 text-[#00C9A7] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-[#E4EAFF] truncate">Equipamiento</div>
                      <div className="text-[10px] text-[#6B7AAD] truncate font-mono">Mac + setup</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-white/[0.02] hover:bg-white/[0.06] transition-colors border border-[#1C2248]/50 rounded-lg">
                    <PieChart className="w-4 h-4 text-[#8B63F5] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-[#E4EAFF] truncate">Stock options</div>
                      <div className="text-[10px] text-[#6B7AAD] truncate font-mono">Cliff 1 año</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-white/[0.02] hover:bg-white/[0.06] transition-colors border border-[#1C2248]/50 rounded-lg">
                    <BookOpen className="w-4 h-4 text-[#F5A623] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-[#E4EAFF] truncate">Formación</div>
                      <div className="text-[10px] text-[#6B7AAD] truncate">€1,500/año</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-white/[0.02] hover:bg-white/[0.06] transition-colors border border-[#1C2248]/50 rounded-lg">
                    <Heart className="w-4 h-4 text-[#F05252] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-[#E4EAFF] truncate">Seguro médico</div>
                      <div className="text-[10px] text-[#6B7AAD] truncate">Post Serie A</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-white/[0.02] hover:bg-white/[0.06] transition-colors border border-[#1C2248]/50 rounded-lg">
                    <Plane className="w-4 h-4 text-[#00C9A7] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-[#E4EAFF] truncate">Travel budget</div>
                      <div className="text-[10px] text-[#6B7AAD] truncate">Para aeropuertos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </>
      )}

      {/* Add team member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#07091C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1330] border border-[#1C2248] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#1C2248] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#E4EAFF]">Simular Persona en el Equipo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#6B7AAD] hover:text-[#E4EAFF] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Nombre Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Laura Diaz"
                  className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] placeholder-[#6B7AAD] focus:outline-none focus:border-[#4F7EF8] text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Sabor de Rol</label>
                  <select 
                    value={roleGroup}
                    onChange={(e) => setRoleGroup(e.target.value)}
                    className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] focus:outline-none focus:border-[#4F7EF8] text-sm"
                  >
                    <option value="Eng.">Ingeniero (FE/BE)</option>
                    <option value="ML Eng.">Ingeniero ML</option>
                    <option value="CFO">Finanzas / CFO</option>
                    <option value="AE">Ventas / AE</option>
                    <option value="CS">Customer Success</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Salario Mensual (€)</label>
                  <input 
                    type="number" 
                    value={salaryStr}
                    onChange={(e) => setSalaryStr(e.target.value)}
                    placeholder="Ej. 6500"
                    className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] placeholder-[#6B7AAD] focus:outline-none focus:border-[#4F7EF8] text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">% de Opciones de Compra (Equity)</label>
                <input 
                  type="number" 
                  step="0.05"
                  value={equityStr}
                  onChange={(e) => setEquityStr(e.target.value)}
                  placeholder="Ej. 0.5"
                  className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] placeholder-[#6B7AAD] focus:outline-none focus:border-[#4F7EF8] text-sm"
                />
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
                  Confirmar Persona
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
