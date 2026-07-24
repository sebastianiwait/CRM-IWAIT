import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  Activity, 
  Coins, 
  Plane, 
  FileText, 
  UserPlus, 
  TrendingUp, 
  Sparkles,
  Users,
  CheckSquare,
  AlertCircle,
  Building2,
  Briefcase,
  X
} from 'lucide-react';
import { Investor, KanbanTask, ClientEntity } from '../data/iwaitData';

interface DashboardViewProps {
  onAddAction: () => void;
  triggerToast: (msg: string) => void;
  metrics: {
    totalCapital: number;
    activeAirports: number;
    clientsCount: number;
    tasksCount: number;
  };
  onAddInvestor?: (inv: Omit<Investor, 'id'>) => void;
  onAddClient?: (cli: Omit<ClientEntity, 'id'>) => void;
  onAddTask?: (task: Omit<KanbanTask, 'id'>) => void;
  navigate?: (tab: string) => void;
}

export default function DashboardView({ onAddAction, triggerToast, metrics, onAddInvestor, onAddClient, onAddTask, navigate }: DashboardViewProps) {
  const [modalType, setModalType] = useState<'investor' | 'lead' | 'task' | null>(null);
  const [periodTab, setPeriodTab] = useState<'Resumen' | 'Actividad hoy' | 'Ayer'>('Resumen');

  // Form states
  const [invName, setInvName] = useState('');
  const [invAmount, setInvAmount] = useState('');

  const [leadName, setLeadName] = useState('');
  const [leadHub, setLeadHub] = useState('');
  const [leadValue, setLeadValue] = useState('');

  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssigned, setTaskAssigned] = useState('');

  const handleCreate = () => {
    if (modalType === 'investor' && onAddInvestor) {
      if (!invName) return;
      onAddInvestor({
        name: invName,
        type: 'Angel Investor',
        status: 'Lead',
        committedAmount: Number(invAmount) || 0,
        contactPerson: 'Por definir',
        notes: ''
      });
      triggerToast('Inversor creado (Acción Rápida)');
      if (navigate) navigate('inversionstas');
    } else if (modalType === 'lead' && onAddClient) {
      if (!leadName) return;
      onAddClient({
        name: leadName,
        type: 'Aeropuerto',
        status: 'Lead',
        dealValue: Number(leadValue) || 0,
        hub: leadHub || 'Global',
        contactPerson: 'Por definir',
        passengersMonthly: 0
      });
      triggerToast('Lead creado (Acción Rápida)');
      if (navigate) navigate('leads');
    } else if (modalType === 'task' && onAddTask) {
      if (!taskTitle) return;
      onAddTask({
        title: taskTitle,
        desc: 'Tarea generada desde Quick Actions',
        date: new Date().toISOString().split('T')[0],
        priority: 'Media',
        column: 'Pendiente',
        assignedTo: taskAssigned || 'Sin asignar'
      });
      triggerToast('Tarea creada (Acción Rápida)');
      if (navigate) navigate('tareas');
    }

    setModalType(null);
    setInvName(''); setInvAmount('');
    setLeadName(''); setLeadHub(''); setLeadValue('');
    setTaskTitle(''); setTaskAssigned('');
  };

  return (
    <div className="animate-fade-in space-y-7">
      {/* Quick Action Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#e6eef4] rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="border-b border-[#dbe9f0] px-6 py-4 flex justify-between items-center bg-[#f5f9fc]">
              <h3 className="text-[16px] font-semibold text-[#0F1A2C]">
                {modalType === 'investor' ? 'Crear Nuevo Inversor' : modalType === 'lead' ? 'Crear Nuevo Lead' : 'Nueva Tarea'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-[#64748B] hover:text-[#0F1A2C] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {modalType === 'investor' && (
                <>
                  <div>
                    <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Nombre del Inversor / Fondo</label>
                    <input type="text" value={invName} onChange={e => setInvName(e.target.value)} className="w-full bg-[#eef2f6] border border-[#e6eef4] rounded-lg px-3 py-2 text-[#0F1A2C] text-[13px] focus:outline-none focus:border-[#0E457F] transition-colors" placeholder="Ej. Y Combinator" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Capital a levantar (€)</label>
                    <input type="number" value={invAmount} onChange={e => setInvAmount(e.target.value)} className="w-full bg-[#eef2f6] border border-[#e6eef4] rounded-lg px-3 py-2 text-[#0F1A2C] text-[13px] focus:outline-none focus:border-[#0E457F] transition-colors" placeholder="Ej. 100000" />
                  </div>
                </>
              )}
              {modalType === 'lead' && (
                <>
                  <div>
                    <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Nombre de la Cuenta / Empresa</label>
                    <input type="text" value={leadName} onChange={e => setLeadName(e.target.value)} className="w-full bg-[#eef2f6] border border-[#e6eef4] rounded-lg px-3 py-2 text-[#0F1A2C] text-[13px] focus:outline-none focus:border-[#0E457F] transition-colors" placeholder="Ej. Aena Group" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Ubicación / Hub</label>
                    <input type="text" value={leadHub} onChange={e => setLeadHub(e.target.value)} className="w-full bg-[#eef2f6] border border-[#e6eef4] rounded-lg px-3 py-2 text-[#0F1A2C] text-[13px] focus:outline-none focus:border-[#0E457F] transition-colors" placeholder="Ej. Madrid" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Valor Estimado (Deal Value €)</label>
                    <input type="number" value={leadValue} onChange={e => setLeadValue(e.target.value)} className="w-full bg-[#eef2f6] border border-[#e6eef4] rounded-lg px-3 py-2 text-[#0F1A2C] text-[13px] focus:outline-none focus:border-[#0E457F] transition-colors" placeholder="Ej. 150000" />
                  </div>
                </>
              )}
              {modalType === 'task' && (
                <>
                  <div>
                    <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Título de Tarea</label>
                    <input type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} className="w-full bg-[#eef2f6] border border-[#e6eef4] rounded-lg px-3 py-2 text-[#0F1A2C] text-[13px] focus:outline-none focus:border-[#0E457F] transition-colors" placeholder="Ej. Revisar Term Sheet" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Responsable</label>
                    <input type="text" value={taskAssigned} onChange={e => setTaskAssigned(e.target.value)} className="w-full bg-[#eef2f6] border border-[#e6eef4] rounded-lg px-3 py-2 text-[#0F1A2C] text-[13px] focus:outline-none focus:border-[#0E457F] transition-colors" placeholder="Ej. Sebastian" />
                  </div>
                </>
              )}
            </div>
            <div className="border-t border-[#e6eef4] px-6 py-4 bg-[#f5f9fc] flex justify-end gap-3">
              <button onClick={() => setModalType(null)} className="px-4 py-2 bg-transparent text-[#64748B] hover:text-[#0F1A2C] text-[13px] font-medium rounded-lg transition-colors">Cancelar</button>
              <button onClick={handleCreate} className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white text-[13px] font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(79,126,248,0.3)]">Guardar y Continuar</button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-bold text-[#0F1A2C] tracking-tight">Dashboard</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">Resumen general · iwait Platform</p>
        </div>
        <div className="flex gap-2.5">
          <button 
            type="button"
            onClick={() => triggerToast('Resumen ejecutivo descargado como reporte PDF')}
            className="btn btn-ghost px-3.5 py-1.8 bg-white hover:bg-[#eef6fa] rounded-lg border border-[#dbe9f0] text-[#33475b] hover:text-[#0F1A2C] text-[13px] flex items-center gap-1.5 transition-all text-sm cursor-pointer shadow-sm"
          >
            <Download className="w-[15px] h-[15px]" /> Exportar
          </button>
          <button 
            type="button"
            onClick={onAddAction}
            className="btn btn-primary px-3.5 py-1.8 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg text-[13px] flex items-center gap-1.5 transition-all font-medium text-sm cursor-pointer"
          >
            <Plus className="w-[15px] h-[15px]" /> Nueva acción
          </button>
        </div>
      </div>

      {/* Segmented tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div data-tour="dash-tabs" className="inline-flex bg-[#eef2f6] rounded-xl p-1">
          {(['Resumen', 'Actividad hoy', 'Ayer'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPeriodTab(t)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                periodTab === t
                  ? 'bg-white text-[#0F1A2C] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F1A2C]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="text-[12.5px] text-[#64748B]">Vista ejecutiva del pipeline y seguimiento</p>
      </div>

      {/* KPI Grid */}
      <div data-tour="dash-kpis" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Capital levantado',
            value: `$${(metrics.totalCapital / 1000000).toFixed(1)}M`,
            sub: '+18% vs. mes anterior',
            accent: '#0E457F',
            icon: <Coins className="w-[17px] h-[17px]" />
          },
          {
            label: 'Aeropuertos activos',
            value: metrics.activeAirports,
            sub: '+1 nuevo este mes',
            accent: '#00C9A7',
            icon: <Plane className="w-[17px] h-[17px]" />
          },
          {
            label: 'Clientes pipeline',
            value: metrics.clientsCount,
            sub: '4 en negociación',
            accent: '#47B6E6',
            icon: <Users className="w-[17px] h-[17px]" />
          },
          {
            label: 'Tareas pendientes',
            value: metrics.tasksCount,
            sub: '2 vencidas',
            accent: '#F5A623',
            icon: <CheckSquare className="w-[17px] h-[17px]" />
          }
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="group relative bg-white rounded-xl border border-[#e6eef4] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 pl-5 overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ backgroundColor: kpi.accent }}></div>
            <div className="flex items-start justify-between gap-2">
              <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide leading-tight">{kpi.label}</div>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${kpi.accent}1A`, color: kpi.accent }}
              >
                {kpi.icon}
              </div>
            </div>
            <div className="text-[26px] font-bold text-[#0F1A2C] mt-2 tracking-tight leading-none">{kpi.value}</div>
            <div className="text-[11.5px] text-[#64748B] mt-1.5">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div data-tour="dash-quick" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button 
          onClick={() => setModalType('investor')}
          className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm border border-[#dbe9f0] rounded-2xl shadow-sm hover:border-[#0E457F] hover:bg-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#47B6E6]/10 flex items-center justify-center text-[#47B6E6] group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[13.5px] font-semibold text-[#0F1A2C]">Nuevo Inversor</div>
              <div className="text-[11px] text-[#64748B]">Registrar fondo o ángel</div>
            </div>
          </div>
          <Plus className="w-4 h-4 text-[#64748B] group-hover:text-[#0E457F] transition-colors" />
        </button>

        <button 
          onClick={() => setModalType('lead')}
          className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm border border-[#dbe9f0] rounded-2xl shadow-sm hover:border-[#10CC82] hover:bg-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#10CC82]/10 flex items-center justify-center text-[#10CC82] group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[13.5px] font-semibold text-[#0F1A2C]">Nuevo Lead</div>
              <div className="text-[11px] text-[#64748B]">Cuenta o aeropuerto</div>
            </div>
          </div>
          <Plus className="w-4 h-4 text-[#64748B] group-hover:text-[#10CC82] transition-colors" />
        </button>

        <button 
          onClick={() => setModalType('task')}
          className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm border border-[#dbe9f0] rounded-2xl shadow-sm hover:border-[#F5A623] hover:bg-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F5A623]/10 flex items-center justify-center text-[#F5A623] group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[13.5px] font-semibold text-[#0F1A2C]">Crear Tarea</div>
              <div className="text-[11px] text-[#64748B]">Asignar a un miembro</div>
            </div>
          </div>
          <Plus className="w-4 h-4 text-[#64748B] group-hover:text-[#F5A623] transition-colors" />
        </button>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Actividad reciente card */}
        <div className="bg-white/70 backdrop-blur-sm border border-[#dbe9f0] rounded-2xl shadow-sm">
          <div className="border-b border-[#dbe9f0] px-5 py-4 flex items-center gap-2">
            <Activity className="w-[15px] h-[15px] text-[#0E457F]" />
            <h3 className="text-[14px] font-semibold text-[#0F1A2C]">Actividad reciente</h3>
          </div>
          <div className="p-5 space-y-4">
            
            {/* Item 1 */}
            <div className="flex gap-3.5 pb-5 border-b border-[#dbe9f0]/40 last:border-b-0 last:pb-0 relative before:content-[''] before:absolute before:left-3.5 before:top-7.5 before:bottom-0 before:width-[1px] before:bg-[#dbe9f0] last:before:display-none">
              <div className="w-[30px] h-[30px] rounded-full bg-[#eef6fa] border border-[#dbe9f0] flex items-center justify-center flex-shrink-0 z-10">
                <Coins className="w-[14px] h-[14px] text-[#F5A623]" />
              </div>
              <div>
                <div className="text-[13.5px] font-medium text-[#0F1A2C]">Nueva inversión confirmada — Punto Capital</div>
                <div className="text-[11px] text-[#64748B] mt-1">Hace 2 horas · $450K seed</div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-3.5 pb-5 border-b border-[#dbe9f0]/40 last:border-b-0 last:pb-0 relative before:content-[''] before:absolute before:left-3.5 before:top-7.5 before:bottom-0 before:width-[1px] before:bg-[#dbe9f0] last:before:display-none">
              <div className="w-[30px] h-[30px] rounded-full bg-[#eef6fa] border border-[#dbe9f0] flex items-center justify-center flex-shrink-0 z-10">
                <Plane className="w-[14px] h-[14px] text-[#00C9A7]" />
              </div>
              <div>
                <div className="text-[13.5px] font-medium text-[#0F1A2C]">Go-live completado — Aeropuerto El Prat (BCN)</div>
                <div className="text-[11px] text-[#64748B] mt-1">Hace 1 día · Módulo AI Queues activo</div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex gap-3.5 pb-5 border-b border-[#dbe9f0]/40 last:border-b-0 last:pb-0 relative before:content-[''] before:absolute before:left-3.5 before:top-7.5 before:bottom-0 before:width-[1px] before:bg-[#dbe9f0] last:before:display-none">
              <div className="w-[30px] h-[30px] rounded-full bg-[#eef6fa] border border-[#dbe9f0] flex items-center justify-center flex-shrink-0 z-10">
                <FileText className="w-[14px] h-[14px] text-[#47B6E6]" />
              </div>
              <div>
                <div className="text-[13.5px] font-medium text-[#0F1A2C]">Documento cargado en Data Room — Term Sheet v3</div>
                <div className="text-[11px] text-[#64748B] mt-1">Hace 3 días</div>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex gap-3.5 last:pb-0">
              <div className="w-[30px] h-[30px] rounded-full bg-[#eef6fa] border border-[#dbe9f0] flex items-center justify-center flex-shrink-0 z-10">
                <UserPlus className="w-[14px] h-[14px] text-[#10CC82]" />
              </div>
              <div>
                <div className="text-[13.5px] font-medium text-[#0F1A2C]">Nuevo cliente potencial — Aena Group</div>
                <div className="text-[11px] text-[#64748B] mt-1">Hace 5 días · Demo programada</div>
              </div>
            </div>

          </div>
        </div>

        {/* Resumen del pipeline progress card */}
        <div className="bg-white/70 backdrop-blur-sm border border-[#dbe9f0] rounded-2xl shadow-sm">
          <div className="border-b border-[#dbe9f0] px-5 py-4 flex items-center gap-2">
            <TrendingUp className="w-[15px] h-[15px] text-[#47B6E6]" />
            <h3 className="text-[14px] font-semibold text-[#0F1A2C]">Resumen del pipeline</h3>
          </div>
          <div className="p-5 space-y-5">
            {/* Bar 1 */}
            <div>
              <div className="flex justify-between items-center text-[12px] text-[#64748B] mb-1">
                <span>Lead → Propuesta</span>
                <span className="font-semibold text-[#0F1A2C]">68%</span>
              </div>
              <div className="w-full bg-[#e3eef4] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0E457F] h-full rounded-full transition-all duration-500" style={{ width: '68%' }}></div>
              </div>
              <div className="text-[11px] text-[#64748B] mt-1">9 de 14 leads calificados</div>
            </div>

            {/* Bar 2 */}
            <div>
              <div className="flex justify-between items-center text-[12px] text-[#64748B] mb-1">
                <span>Propuesta → Negociación</span>
                <span className="font-semibold text-[#0F1A2C]">44%</span>
              </div>
              <div className="w-full bg-[#e3eef4] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#47B6E6] h-full rounded-full transition-all duration-500" style={{ width: '44%' }}></div>
              </div>
              <div className="text-[11px] text-[#64748B] mt-1">4 de 9 en negociación activa</div>
            </div>

            {/* Bar 3 */}
            <div>
              <div className="flex justify-between items-center text-[12px] text-[#64748B] mb-1">
                <span>Objetivo runway (meses)</span>
                <span className="font-semibold text-[#0F1A2C]">60%</span>
              </div>
              <div className="w-full bg-[#e3eef4] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#00C9A7] h-full rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
              </div>
              <div className="text-[11px] text-[#64748B] mt-1">7.2 meses actuales</div>
            </div>

            {/* Bar 4 */}
            <div>
              <div className="flex justify-between items-center text-[12px] text-[#64748B] mb-1">
                <span>Producto — Sprint actual</span>
                <span className="font-semibold text-[#0F1A2C]">75%</span>
              </div>
              <div className="w-full bg-[#e3eef4] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#F5A623] h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
              </div>
              <div className="text-[11px] text-[#64748B] mt-1">Sprint 12 · 75% completado</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
