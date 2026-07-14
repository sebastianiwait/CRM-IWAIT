import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Filter, 
  Calendar, 
  User, 
  X,
  Play,
  CheckCircle2,
  Undo,
  Search
} from 'lucide-react';
import { KanbanTask } from '../data/iwaitData';

interface TasksViewProps {
  tasks: KanbanTask[];
  onAddTask: (newTask: Omit<KanbanTask, 'id'>) => void;
  onUpdateTaskColumn: (id: string, newColumn: 'Por Hacer' | 'En Progreso' | 'Hecho') => void;
  triggerToast: (msg: string) => void;
}

export default function TasksView({ 
  tasks, 
  onAddTask, 
  onUpdateTaskColumn, 
  triggerToast 
}: TasksViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Drag and drop states
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [activeOverColumn, setActiveOverColumn] = useState<'Por Hacer' | 'En Progreso' | 'Hecho' | null>(null);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingTaskId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setActiveOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, column: 'Por Hacer' | 'En Progreso' | 'Hecho') => {
    e.preventDefault();
    if (activeOverColumn !== column) {
      setActiveOverColumn(column);
    }
  };

  const handleDragLeave = () => {
    setActiveOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetColumn: 'Por Hacer' | 'En Progreso' | 'Hecho') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        if (task.column !== targetColumn) {
          onUpdateTaskColumn(taskId, targetColumn);
          triggerToast(`"${task.title}" movida a ${targetColumn === 'Por Hacer' ? 'Pendiente' : targetColumn === 'En Progreso' ? 'En progreso' : 'Completado'}`);
        }
      }
    }
    setDraggingTaskId(null);
    setActiveOverColumn(null);
  };

  // New task form state
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [column, setColumn] = useState<'Por Hacer' | 'En Progreso' | 'Hecho'>('Por Hacer');
  const [priority, setPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');
  const [dept, setDept] = useState<'Producto' | 'Clientes' | 'Inversionistas' | 'Aeropuerto' | 'Legal'>('Producto');
  const [assigned, setAssigned] = useState('');
  const [dueDate, setDueDate] = useState('30 Jun 2026');

  // Process task filtering
  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (filterPriority !== 'Todos') {
      result = result.filter(t => t.priority === filterPriority);
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(term) || 
        t.assignedTo.toLowerCase().includes(term)
      );
    }
    return result;
  }, [tasks, filterPriority, searchTerm]);

  // Divide tasks into columns
  const todoTasks = filteredTasks.filter(t => t.column === 'Por Hacer');
  const progressTasks = filteredTasks.filter(t => t.column === 'En Progreso');
  const doneTasks = filteredTasks.filter(t => t.column === 'Hecho');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      triggerToast('Proporcione un título para la tarea');
      return;
    }

    onAddTask({
      title,
      description: desc || 'Sin detalles.',
      column,
      priority,
      department: dept,
      assignedTo: assigned || 'Sebastian',
      dueDate: dueDate || 'A convenir'
    });

    setTitle('');
    setDesc('');
    setAssigned('');
    setIsModalOpen(false);
  };

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case 'Alta':
        return <span className="bg-[#F05252]/15 text-[#F05252] text-[10px] font-bold px-2 py-0.5 rounded">Alta prioridad</span>;
      case 'Media':
        return <span className="bg-[#F5A623]/15 text-[#F5A623] text-[10px] font-bold px-2 py-0.5 rounded">Media prioridad</span>;
      case 'Baja':
        return <span className="bg-[#64748B]/15 text-[#8DA2B5]/90 text-[10px] font-bold px-2 py-0.5 rounded">Baja prioridad</span>;
      default:
        return <span className="bg-[#0E457F]/15 text-[#47B6E6] text-[10px] font-bold px-2 py-0.5 rounded">Normal</span>;
    }
  };

  return (
    <div className="animate-fade-in space-y-7">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#c3dae4] pb-5 gap-4">
        <div>
          <h2 className="text-[20px] font-semibold text-[#0F1A2C] tracking-tight">Tareas</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">Gestión de tareas del equipo</p>
        </div>
        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por tarea o asignado..."
              className="bg-[#14243A] border border-[#2A415A] rounded-lg pl-9 pr-4 py-1.5 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-[13px] w-[200px] md:w-[220px]"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative flex items-center bg-[#14243A] border border-[#2A415A] rounded-lg px-2.5 py-1.5 font-sans">
            <Filter className="w-3.5 h-3.5 text-[#64748B] mr-1.5" />
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-[#14243A] border-none text-[12px] text-[#EAF3F9] focus:outline-none focus:ring-0 pr-1 cursor-pointer font-medium"
            >
              <option value="Todos">Todas las prioridades</option>
              <option value="Alta">Prioridad Alta</option>
              <option value="Media">Prioridad Media</option>
              <option value="Baja">Prioridad Baja</option>
            </select>
          </div>
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary px-3.5 py-1.8 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg text-[13px] flex items-center gap-1.5 transition-all font-medium text-sm cursor-pointer"
          >
            <Plus className="w-[15px] h-[15px]" /> Nueva tarea
          </button>
        </div>
      </div>      {/* Kanban main board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {/* Column 1: Pendiente / Por Hacer */}
        <div 
          onDragOver={(e) => handleDragOver(e, 'Por Hacer')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'Por Hacer')}
          className={`bg-[#14243A] border rounded-lg p-4 min-h-[500px] transition-all duration-200 ${
            activeOverColumn === 'Por Hacer' 
              ? 'border-[#0E457F] bg-[#14243A]/80 shadow-[0_0_15px_rgba(79,126,248,0.15)] scale-[1.01]' 
              : 'border-[#22384F]'
          }`}
        >
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#64748B]"></span>
            <span>Pendiente</span>
            <span className="ml-1 bg-[#2A415A] text-[#8DA2B5] px-2 py-0.5 rounded-full text-[10px] font-bold">{todoTasks.length}</span>
          </div>

          <div className="space-y-3">
            {todoTasks.map(task => (
              <div 
                key={task.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragEnd={handleDragEnd}
                className={`bg-[#1B2F49] border rounded-lg p-3.5 hover:border-[#0E457F] transition-all relative group cursor-grab active:cursor-grabbing ${
                  draggingTaskId === task.id 
                    ? 'opacity-40 border-dashed border-[#0E457F]/60 bg-[#1B2F49]/40 scale-95' 
                    : 'border-[#2A415A]'
                }`}
              >
                <div className="text-[13px] font-medium text-[#EAF3F9] mb-2">{task.title}</div>
                <div className="mb-3">{getPriorityBadge(task.priority)}</div>
                
                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {task.dueDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {task.assignedTo}
                  </div>
                </div>

                {/* Interactive State Mover */}
                <button 
                  onClick={() => {
                    onUpdateTaskColumn(task.id, 'En Progreso');
                    triggerToast(`"${task.title}" iniciada! Se movió a 'En progreso'`);
                  }}
                  className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 p-1 bg-[#0E457F]/10 hover:bg-[#0E457F] hover:text-white rounded text-[#47B6E6] transition-all cursor-pointer"
                  title="Comenzar Tarea"
                >
                  <Play className="w-3 h-3" />
                </button>
              </div>
            ))}
            {todoTasks.length === 0 && (
              <div className="text-center py-10 border border-dashed border-[#22384F] rounded-lg text-[#64748B] text-xs">
                No hay tareas pendientes.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: En Progreso */}
        <div 
          onDragOver={(e) => handleDragOver(e, 'En Progreso')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'En Progreso')}
          className={`bg-[#14243A] border rounded-lg p-4 min-h-[500px] transition-all duration-200 ${
            activeOverColumn === 'En Progreso' 
              ? 'border-[#0E457F] bg-[#14243A]/80 shadow-[0_0_15px_rgba(79,126,248,0.15)] scale-[1.01]' 
              : 'border-[#22384F]'
          }`}
        >
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#0E457F]"></span>
            <span>En progreso</span>
            <span className="ml-1 bg-[#2A415A] text-[#8DA2B5] px-2 py-0.5 rounded-full text-[10px] font-bold">{progressTasks.length}</span>
          </div>

          <div className="space-y-3">
            {progressTasks.map(task => (
              <div 
                key={task.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragEnd={handleDragEnd}
                className={`bg-[#1B2F49] border rounded-lg p-3.5 hover:border-[#0E457F] transition-all relative group cursor-grab active:cursor-grabbing ${
                  draggingTaskId === task.id 
                    ? 'opacity-40 border-dashed border-[#0E457F]/60 bg-[#1B2F49]/40 scale-95' 
                    : 'border-[#0E457F]/40'
                }`}
              >
                <div className="text-[13px] font-medium text-[#EAF3F9] mb-2">{task.title}</div>
                <div className="mb-3">{getPriorityBadge(task.priority)}</div>
                
                {/* Simulated progress slider/indicator */}
                <div className="mb-3 space-y-1">
                  <div className="w-full bg-[#2A415A] h-1 rounded-full overflow-hidden">
                    <div className="bg-[#0E457F] h-full rounded-full transition-all duration-300" style={{ width: task.priority === 'Alta' ? '70%' : '45%' }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {task.dueDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {task.assignedTo}
                  </div>
                </div>

                {/* Interactive State Movers */}
                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 flex gap-1 z-20">
                  <button 
                    onClick={() => {
                      onUpdateTaskColumn(task.id, 'Por Hacer');
                      triggerToast(`"${task.title}" pausada y devuelta a Pendiente`);
                    }}
                    className="p-1 bg-[#22384F] hover:bg-[#2A415A] rounded text-[#8DA2B5] transition-all cursor-pointer"
                    title="Pausar Tarea"
                  >
                    <Undo className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => {
                      onUpdateTaskColumn(task.id, 'Hecho');
                      triggerToast(`"${task.title}" completada con éxito!`);
                    }}
                    className="p-1 bg-[#10CC82]/20 hover:bg-[#10CC82] hover:text-white rounded text-[#10CC82] transition-all cursor-pointer"
                    title="Completar Tarea"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {progressTasks.length === 0 && (
              <div className="text-center py-10 border border-dashed border-[#22384F] rounded-lg text-[#64748B] text-xs">
                Ninguna tarea activa por el momento.
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Completado */}
        <div 
          onDragOver={(e) => handleDragOver(e, 'Hecho')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'Hecho')}
          className={`bg-[#14243A] border rounded-lg p-4 min-h-[500px] transition-all duration-200 ${
            activeOverColumn === 'Hecho' 
              ? 'border-[#10CC82] bg-[#14243A]/80 shadow-[0_0_15px_rgba(16,204,130,0.15)] scale-[1.01]' 
              : 'border-[#22384F]'
          }`}
        >
          <div className="flex items-center gap-2 mb-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#10CC82]"></span>
            <span>Completado</span>
            <span className="ml-1 bg-[#2A415A] text-[#8DA2B5] px-2 py-0.5 rounded-full text-[10px] font-bold">{doneTasks.length}</span>
          </div>

          <div className="space-y-3">
            {doneTasks.map(task => (
              <div 
                key={task.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragEnd={handleDragEnd}
                className={`bg-[#1B2F49]/60 border rounded-lg p-3.5 opacity-70 hover:opacity-100 transition-all relative group cursor-grab active:cursor-grabbing ${
                  draggingTaskId === task.id 
                    ? 'opacity-40 border-dashed border-[#10CC82]/60 bg-[#1B2F49]/40 scale-95' 
                    : 'border-[#2A415A]'
                }`}
              >
                <div className="text-[13px] font-medium text-[#EAF3F9] line-through mb-2">{task.title}</div>
                <div className="mb-3">
                  <span className="bg-[#10CC82]/15 text-[#10CC82] text-[10px] font-bold px-2 py-0.5 rounded">✓ Completado</span>
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {task.dueDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {task.assignedTo}
                  </div>
                </div>

                {/* Move back to progress button */}
                <button 
                  onClick={() => {
                    onUpdateTaskColumn(task.id, 'En Progreso');
                    triggerToast(`"${task.title}" reasentada a 'En progreso'`);
                  }}
                  className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 p-1 bg-[#22384F] hover:bg-[#2A415A] rounded text-[#8DA2B5] transition-all cursor-pointer"
                  title="Reabrir Tarea"
                >
                  <Undo className="w-3 h-3" />
                </button>
              </div>
            ))}
            {doneTasks.length === 0 && (
              <div className="text-center py-10 border border-dashed border-[#22384F] rounded-lg text-[#64748B] text-xs">
                No hay tareas completadas aún.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1A2C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243A] border border-[#22384F] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#EAF3F9]">Crear Nueva Tarea</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#64748B] hover:text-[#EAF3F9] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Título de la Tarea</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Rediseño del Apple Wallet Pass"
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Descripción</label>
                <textarea 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Instrucciones detalladas o anotaciones"
                  rows={2}
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5 font-mono">Asignado a</label>
                  <input 
                    type="text" 
                    value={assigned}
                    onChange={(e) => setAssigned(e.target.value)}
                    placeholder="Ej. Sebastian, CTO"
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Fecha Límite</label>
                  <input 
                    type="text" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="Ej. 28 Jun 2026"
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] uppercase mb-1">Columna</label>
                  <select 
                    value={column}
                    onChange={(e: any) => setColumn(e.target.value)}
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-2 py-1.5 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-[12px]"
                  >
                    <option value="Por Hacer">Pendiente</option>
                    <option value="En Progreso">En proceso</option>
                    <option value="Hecho">Completado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] uppercase mb-1">Prioridad</label>
                  <select 
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-2 py-1.5 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-[12px]"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] uppercase mb-1 font-mono">Dpto</label>
                  <select 
                    value={dept}
                    onChange={(e: any) => setDept(e.target.value)}
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-2 py-1.5 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-[12px]"
                  >
                    <option value="Producto">Producto</option>
                    <option value="Clientes">Clientes</option>
                    <option value="Inversionistas">Inversores</option>
                    <option value="Aeropuerto">Aeropuerto</option>
                    <option value="Legal">Legal</option>
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
                  Asignar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
