import React, { useState, useMemo } from 'react';
import {
  Plus,
  Calendar,
  Flame,
  X,
  Inbox,
  Circle,
  Timer,
  CheckCircle2,
  ArrowRight,
  Search
} from 'lucide-react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

type SprintColumn = 'Backlog' | 'Por Hacer' | 'En Progreso' | 'Hecho';

interface SprintTask {
  id: string;
  title: string;
  description: string;
  column: SprintColumn;
  priority: 'Alta' | 'Media' | 'Baja';
  sprint: string;
  points: number;
}

interface SprintBoardViewProps {
  triggerToast: (msg: string) => void;
}

const OWNER = 'Juan Diego';
const ACTIVE_SPRINT = 'Sprint 12';

const INITIAL_SPRINT_TASKS: SprintTask[] = [
  { id: 'jd-1', title: 'Endpoint /predict de colas', description: 'Servir el modelo v2 vía API interna', column: 'Hecho', priority: 'Alta', sprint: 'Sprint 12', points: 5 },
  { id: 'jd-2', title: 'Refactor pipeline de ingesta', description: 'Normalizar eventos de sensores de aeropuerto', column: 'Hecho', priority: 'Media', sprint: 'Sprint 12', points: 3 },
  { id: 'jd-3', title: 'Dashboard live — websockets', description: 'Push de métricas en tiempo real al panel', column: 'En Progreso', priority: 'Alta', sprint: 'Sprint 12', points: 8 },
  { id: 'jd-4', title: 'Tests e2e del predictor', description: 'Cobertura de casos límite de la cola', column: 'En Progreso', priority: 'Media', sprint: 'Sprint 12', points: 3 },
  { id: 'jd-5', title: 'Cache de resultados por terminal', description: 'Reducir latencia de consultas repetidas', column: 'Por Hacer', priority: 'Media', sprint: 'Sprint 12', points: 5 },
  { id: 'jd-6', title: 'Alertas de degradación de modelo', description: 'Notificar cuando la precisión baje de 90%', column: 'Por Hacer', priority: 'Alta', sprint: 'Sprint 12', points: 5 },
  { id: 'jd-7', title: 'Exportador de métricas a BI', description: 'Conector para el módulo de analytics', column: 'Backlog', priority: 'Baja', sprint: 'Sprint 13', points: 8 },
  { id: 'jd-8', title: 'Multi-aeropuerto: sharding de datos', description: 'Preparar el modelo para red AENA completa', column: 'Backlog', priority: 'Media', sprint: 'Sprint 13', points: 13 },
  { id: 'jd-9', title: 'OCR de pasaportes en WhatsApp', description: 'Escaneo de ID nacional para cupones', column: 'Backlog', priority: 'Baja', sprint: 'Backlog', points: 8 },
  { id: 'jd-10', title: 'AI Baggage — spike técnico', description: 'Investigación de viabilidad de tracking', column: 'Backlog', priority: 'Baja', sprint: 'Backlog', points: 5 }
];

const COLUMNS: { key: SprintColumn; label: string; dot: string; glow: string; icon: React.ReactNode }[] = [
  { key: 'Backlog', label: 'Backlog', dot: 'bg-[#47B6E6]', glow: 'rgba(139,99,245,0.15)', icon: <Inbox className="w-3.5 h-3.5 text-[#47B6E6]" /> },
  { key: 'Por Hacer', label: 'Por hacer', dot: 'bg-[#64748B]', glow: 'rgba(79,126,248,0.15)', icon: <Circle className="w-3.5 h-3.5 text-[#64748B]" /> },
  { key: 'En Progreso', label: 'En progreso', dot: 'bg-[#0E457F]', glow: 'rgba(79,126,248,0.15)', icon: <Timer className="w-3.5 h-3.5 text-[#0E457F]" /> },
  { key: 'Hecho', label: 'Hecho', dot: 'bg-[#10CC82]', glow: 'rgba(16,204,130,0.15)', icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#10CC82]" /> }
];

const NEXT_COLUMN: Record<SprintColumn, SprintColumn | null> = {
  'Backlog': 'Por Hacer',
  'Por Hacer': 'En Progreso',
  'En Progreso': 'Hecho',
  'Hecho': null
};

export default function SprintBoardView({ triggerToast }: SprintBoardViewProps) {
  const [tasks, setTasks] = useLocalStorageState<SprintTask[]>('iwait.crm.sprints.juan-diego', INITIAL_SPRINT_TASKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Drag & drop
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<SprintColumn | null>(null);

  // New task form
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [column, setColumn] = useState<SprintColumn>('Backlog');
  const [priority, setPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');
  const [sprint, setSprint] = useState('Sprint 12');
  const [points, setPoints] = useState(3);

  const moveTask = (id: string, target: SprintColumn) => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.column === target) return;
    setTasks(cur => cur.map(t => t.id === id ? { ...t, column: target } : t));
    const label = COLUMNS.find(c => c.key === target)?.label ?? target;
    triggerToast(`"${task.title}" → ${label}`);
  };

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return tasks;
    const term = searchTerm.toLowerCase();
    return tasks.filter(t => t.title.toLowerCase().includes(term) || t.sprint.toLowerCase().includes(term));
  }, [tasks, searchTerm]);

  const activeTasks = tasks.filter(t => t.sprint === ACTIVE_SPRINT);
  const doneActive = activeTasks.filter(t => t.column === 'Hecho');
  const donePoints = doneActive.reduce((s, t) => s + t.points, 0);
  const totalPoints = activeTasks.reduce((s, t) => s + t.points, 0);
  const pct = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      triggerToast('Proporcione un título para la tarjeta');
      return;
    }
    setTasks(cur => [
      { id: `jd-${Date.now()}`, title, description: desc || 'Sin detalles.', column, priority, sprint, points },
      ...cur
    ]);
    triggerToast(`Tarjeta añadida al ${column === 'Backlog' ? 'backlog' : 'tablero'} de ${OWNER}`);
    setTitle('');
    setDesc('');
    setIsModalOpen(false);
  };

  const priorityBadge = (prio: string) => {
    switch (prio) {
      case 'Alta': return <span className="bg-[#F05252]/15 text-[#F05252] text-[10px] font-bold px-2 py-0.5 rounded">Alta</span>;
      case 'Media': return <span className="bg-[#F5A623]/15 text-[#F5A623] text-[10px] font-bold px-2 py-0.5 rounded">Media</span>;
      default: return <span className="bg-[#64748B]/15 text-[#8DA2B5]/90 text-[10px] font-bold px-2 py-0.5 rounded">Baja</span>;
    }
  };

  return (
    <div className="animate-fade-in space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#c3dae4] pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0E457F] to-[#47B6E6] flex items-center justify-center text-white font-bold text-[14px]">JD</div>
          <div>
            <h2 className="text-[20px] font-bold text-[#0F1A2C] tracking-tight">Backlog &amp; Sprints — Juan Diego</h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">Seguimiento de todo el trabajo de Juan Diego por sprint</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tarjeta o sprint..."
              className="bg-[#14243A] border border-[#2A415A] rounded-lg pl-9 pr-4 py-1.5 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-[13px] w-[190px] md:w-[220px]"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg text-[13px] flex items-center gap-1.5 transition-all font-medium cursor-pointer"
          >
            <Plus className="w-[15px] h-[15px]" /> Nueva tarjeta
          </button>
        </div>
      </div>

      {/* Active sprint summary */}
      <div className="bg-[#14243A] border border-[#22384F] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#22384F]/60 pb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#F5A623]" />
            <h3 className="text-[14px] font-semibold text-[#EAF3F9]">{ACTIVE_SPRINT} — activo</h3>
            <span className="text-[11px] text-[#64748B] font-mono ml-2">19 Jun — 2 Jul 2026</span>
          </div>
          <span className="bg-[#F5A623]/15 text-[#F5A623] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{pct}% completado</span>
        </div>
        <div className="mt-4 space-y-4">
          <div className="w-full bg-[#22384F] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#0E457F] h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#47B6E6]/8 border border-[#47B6E6]/20 rounded-lg p-3">
              <div className="text-[18px] font-bold text-[#47B6E6]">{tasks.filter(t => t.column === 'Backlog').length}</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">En backlog</div>
            </div>
            <div className="bg-[#0E457F]/8 border border-[#0E457F]/20 rounded-lg p-3">
              <div className="text-[18px] font-bold text-[#47B6E6]">{activeTasks.filter(t => t.column === 'En Progreso').length}</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">En progreso</div>
            </div>
            <div className="bg-[#10CC82]/8 border border-[#10CC82]/20 rounded-lg p-3">
              <div className="text-[18px] font-bold text-[#10CC82]">{doneActive.length}</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">Completadas</div>
            </div>
            <div className="bg-[#64748B]/8 border border-[#64748B]/20 rounded-lg p-3">
              <div className="text-[18px] font-bold text-[#8DA2B5]">{donePoints}/{totalPoints}</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">Story points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map(col => {
          const colTasks = filtered.filter(t => t.column === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => { e.preventDefault(); if (overColumn !== col.key) setOverColumn(col.key); }}
              onDragLeave={() => setOverColumn(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain') || draggingId;
                if (id) moveTask(id, col.key);
                setDraggingId(null);
                setOverColumn(null);
              }}
              className={`bg-[#14243A] border rounded-lg p-4 min-h-[420px] transition-all duration-200 ${
                overColumn === col.key
                  ? 'border-[#0E457F] scale-[1.01]'
                  : 'border-[#22384F]'
              }`}
              style={overColumn === col.key ? { boxShadow: `0 0 15px ${col.glow}` } : undefined}
            >
              <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                {col.icon}
                <span>{col.label}</span>
                <span className="ml-auto bg-[#2A415A] text-[#8DA2B5] px-2 py-0.5 rounded-full text-[10px] font-bold">{colTasks.length}</span>
              </div>

              <div className="space-y-3">
                {colTasks.map(task => {
                  const next = NEXT_COLUMN[task.column];
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => { setDraggingId(task.id); e.dataTransfer.setData('text/plain', task.id); e.dataTransfer.effectAllowed = 'move'; }}
                      onDragEnd={() => { setDraggingId(null); setOverColumn(null); }}
                      className={`bg-[#1B2F49] border rounded-lg p-3.5 hover:border-[#0E457F] transition-all relative group cursor-grab active:cursor-grabbing ${
                        draggingId === task.id
                          ? 'opacity-40 border-dashed border-[#0E457F]/60 scale-95'
                          : col.key === 'En Progreso' ? 'border-[#0E457F]/40' : 'border-[#2A415A]'
                      } ${col.key === 'Hecho' ? 'opacity-70 hover:opacity-100' : ''}`}
                    >
                      <div className={`text-[13px] font-medium text-[#EAF3F9] mb-2 pr-6 ${col.key === 'Hecho' ? 'line-through' : ''}`}>{task.title}</div>
                      {task.description && (
                        <div className="text-[11.5px] text-[#64748B] mb-2.5 leading-normal">{task.description}</div>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        {priorityBadge(task.priority)}
                        <span className="text-[10px] font-mono text-[#47B6E6] bg-[#0E457F]/10 px-1.5 py-0.5 rounded">{task.points} pts</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {task.sprint}
                        </div>
                      </div>

                      {next && (
                        <button
                          onClick={() => moveTask(task.id, next)}
                          className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 p-1 bg-[#0E457F]/10 hover:bg-[#0E457F] hover:text-white rounded text-[#47B6E6] transition-all cursor-pointer"
                          title={`Mover a ${COLUMNS.find(c => c.key === next)?.label}`}
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
                {colTasks.length === 0 && (
                  <div className="text-center py-10 border border-dashed border-[#22384F] rounded-lg text-[#64748B] text-xs">
                    Sin tarjetas aquí.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New card modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1A2C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243A] border border-[#22384F] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#EAF3F9]">Nueva tarjeta — {OWNER}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#64748B] hover:text-[#EAF3F9] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Optimizar query del predictor"
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Descripción</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Detalle de la tarea"
                  rows={2}
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] uppercase mb-1">Columna</label>
                  <select value={column} onChange={(e: any) => setColumn(e.target.value)} className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-2 py-1.5 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-[12px]">
                    <option value="Backlog">Backlog</option>
                    <option value="Por Hacer">Por hacer</option>
                    <option value="En Progreso">En progreso</option>
                    <option value="Hecho">Hecho</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] uppercase mb-1">Prioridad</label>
                  <select value={priority} onChange={(e: any) => setPriority(e.target.value)} className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-2 py-1.5 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-[12px]">
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] uppercase mb-1">Sprint</label>
                  <select value={sprint} onChange={(e: any) => setSprint(e.target.value)} className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-2 py-1.5 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-[12px]">
                    <option value="Sprint 12">Sprint 12</option>
                    <option value="Sprint 13">Sprint 13</option>
                    <option value="Backlog">Backlog</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] uppercase mb-1">Story points</label>
                  <select value={points} onChange={(e: any) => setPoints(Number(e.target.value))} className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-2 py-1.5 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-[12px]">
                    {[1, 2, 3, 5, 8, 13].map(p => <option key={p} value={p}>{p} pts</option>)}
                  </select>
                </div>
              </div>
              <div className="border-t border-[#22384F] pt-4 flex justify-end gap-2.5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-transparent border border-[#2A415A] text-[#64748B] hover:text-[#EAF3F9] text-sm cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg font-medium text-sm cursor-pointer">Añadir tarjeta</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
