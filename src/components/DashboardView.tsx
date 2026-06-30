import React from 'react';
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
  AlertCircle
} from 'lucide-react';

interface DashboardViewProps {
  onAddAction: () => void;
  triggerToast: (msg: string) => void;
  metrics: {
    totalCapital: number;
    activeAirports: number;
    clientsCount: number;
    tasksCount: number;
  };
}

export default function DashboardView({ onAddAction, triggerToast, metrics }: DashboardViewProps) {
  return (
    <div className="animate-fade-in space-y-7">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#1C2248] pb-5">
        <div>
          <h2 className="text-[20px] font-semibold text-[#E4EAFF] tracking-tight">Dashboard</h2>
          <p className="text-[13px] text-[#6B7AAD] mt-0.5">Resumen general · iwait Platform</p>
        </div>
        <div className="flex gap-2.5">
          <button 
            type="button"
            onClick={() => triggerToast('Resumen ejecutivo descargado como reporte PDF')}
            className="btn btn-ghost px-3.5 py-1.8 bg-transparent hover:bg-[#0F1330] rounded-lg border border-[#222850] text-[#9AA3CC] hover:text-white text-[13px] flex items-center gap-1.5 transition-all text-sm cursor-pointer"
          >
            <Download className="w-[15px] h-[15px]" /> Exportar
          </button>
          <button 
            type="button"
            onClick={onAddAction}
            className="btn btn-primary px-3.5 py-1.8 bg-[#4F7EF8] hover:bg-[#2B56D6] text-white rounded-lg text-[13px] flex items-center gap-1.5 transition-all font-medium text-sm cursor-pointer"
          >
            <Plus className="w-[15px] h-[15px]" /> Nueva acción
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Levandato Card */}
        <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#4F7EF8]">
          <div className="text-[12px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Capital levantado</div>
          <div className="text-[28px] font-bold text-[#E4EAFF] mt-2 tracking-tight leading-none">${(metrics.totalCapital / 1000000).toFixed(1)}M</div>
          <div className="text-[12px] text-[#10CC82] flex items-center gap-1 mt-2.5">
            <TrendingUp className="w-[13px] h-[13px]" /> +18% vs. mes anterior
          </div>
          <Coins className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 text-[#E4EAFF] opacity-8" />
        </div>

        {/* Aeropuertos Card */}
        <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#00C9A7]">
          <div className="text-[12px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Aeropuertos activos</div>
          <div className="text-[28px] font-bold text-[#E4EAFF] mt-2 tracking-tight leading-none">{metrics.activeAirports}</div>
          <div className="text-[12px] text-[#10CC82] flex items-center gap-1 mt-2.5">
            <Sparkles className="w-[13px] h-[13px]" /> +1 nuevo este mes
          </div>
          <Plane className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 text-[#E4EAFF] opacity-8" />
        </div>

        {/* Clientes Card */}
        <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#8B63F5]">
          <div className="text-[12px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Clientes pipeline</div>
          <div className="text-[28px] font-bold text-[#E4EAFF] mt-2 tracking-tight leading-none">{metrics.clientsCount}</div>
          <div className="text-[12px] text-[#10CC82] flex items-center gap-1 mt-2.5">
            <TrendingUp className="w-[13px] h-[13px]" /> 4 en negociación
          </div>
          <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 text-[#E4EAFF] opacity-8" />
        </div>

        {/* Tareas Card */}
        <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[2px] before:bg-[#F5A623]">
          <div className="text-[12px] text-[#6B7AAD] font-semibold uppercase tracking-wider">Tareas pendientes</div>
          <div className="text-[28px] font-bold text-[#E4EAFF] mt-2 tracking-tight leading-none">{metrics.tasksCount}</div>
          <div className="text-[12px] text-[#F05252] flex items-center gap-1 mt-2.5">
            <AlertCircle className="w-[13px] h-[13px]" /> 2 vencidas
          </div>
          <CheckSquare className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 text-[#E4EAFF] opacity-8" />
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Actividad reciente card */}
        <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg">
          <div className="border-b border-[#1C2248] px-5 py-4 flex items-center gap-2">
            <Activity className="w-[15px] h-[15px] text-[#4F7EF8]" />
            <h3 className="text-[14px] font-semibold text-[#E4EAFF]">Actividad reciente</h3>
          </div>
          <div className="p-5 space-y-4">
            
            {/* Item 1 */}
            <div className="flex gap-3.5 pb-5 border-b border-[#1C2248]/40 last:border-b-0 last:pb-0 relative before:content-[''] before:absolute before:left-3.5 before:top-7.5 before:bottom-0 before:width-[1px] before:bg-[#1C2248] last:before:display-none">
              <div className="w-[30px] h-[30px] rounded-full bg-[#131740] border border-[#222850] flex items-center justify-center flex-shrink-0 z-10">
                <Coins className="w-[14px] h-[14px] text-[#F5A623]" />
              </div>
              <div>
                <div className="text-[13.5px] font-medium text-[#E4EAFF]">Nueva inversión confirmada — Punto Capital</div>
                <div className="text-[11px] text-[#6B7AAD] mt-1">Hace 2 horas · $450K seed</div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-3.5 pb-5 border-b border-[#1C2248]/40 last:border-b-0 last:pb-0 relative before:content-[''] before:absolute before:left-3.5 before:top-7.5 before:bottom-0 before:width-[1px] before:bg-[#1C2248] last:before:display-none">
              <div className="w-[30px] h-[30px] rounded-full bg-[#131740] border border-[#222850] flex items-center justify-center flex-shrink-0 z-10">
                <Plane className="w-[14px] h-[14px] text-[#00C9A7]" />
              </div>
              <div>
                <div className="text-[13.5px] font-medium text-[#E4EAFF]">Go-live completado — Aeropuerto El Prat (BCN)</div>
                <div className="text-[11px] text-[#6B7AAD] mt-1">Hace 1 día · Módulo AI Queues activo</div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex gap-3.5 pb-5 border-b border-[#1C2248]/40 last:border-b-0 last:pb-0 relative before:content-[''] before:absolute before:left-3.5 before:top-7.5 before:bottom-0 before:width-[1px] before:bg-[#1C2248] last:before:display-none">
              <div className="w-[30px] h-[30px] rounded-full bg-[#131740] border border-[#222850] flex items-center justify-center flex-shrink-0 z-10">
                <FileText className="w-[14px] h-[14px] text-[#8B63F5]" />
              </div>
              <div>
                <div className="text-[13.5px] font-medium text-[#E4EAFF]">Documento cargado en Data Room — Term Sheet v3</div>
                <div className="text-[11px] text-[#6B7AAD] mt-1">Hace 3 días</div>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex gap-3.5 last:pb-0">
              <div className="w-[30px] h-[30px] rounded-full bg-[#131740] border border-[#222850] flex items-center justify-center flex-shrink-0 z-10">
                <UserPlus className="w-[14px] h-[14px] text-[#10CC82]" />
              </div>
              <div>
                <div className="text-[13.5px] font-medium text-[#E4EAFF]">Nuevo cliente potencial — Aena Group</div>
                <div className="text-[11px] text-[#6B7AAD] mt-1">Hace 5 días · Demo programada</div>
              </div>
            </div>

          </div>
        </div>

        {/* Resumen del pipeline progress card */}
        <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg">
          <div className="border-b border-[#1C2248] px-5 py-4 flex items-center gap-2">
            <TrendingUp className="w-[15px] h-[15px] text-[#8B63F5]" />
            <h3 className="text-[14px] font-semibold text-[#E4EAFF]">Resumen del pipeline</h3>
          </div>
          <div className="p-5 space-y-5">
            {/* Bar 1 */}
            <div>
              <div className="flex justify-between items-center text-[12px] text-[#6B7AAD] mb-1">
                <span>Lead → Propuesta</span>
                <span className="font-semibold text-[#E4EAFF]">68%</span>
              </div>
              <div className="w-full bg-[#222850] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#4F7EF8] h-full rounded-full transition-all duration-500" style={{ width: '68%' }}></div>
              </div>
              <div className="text-[11px] text-[#6B7AAD] mt-1">9 de 14 leads calificados</div>
            </div>

            {/* Bar 2 */}
            <div>
              <div className="flex justify-between items-center text-[12px] text-[#6B7AAD] mb-1">
                <span>Propuesta → Negociación</span>
                <span className="font-semibold text-[#E4EAFF]">44%</span>
              </div>
              <div className="w-full bg-[#222850] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#8B63F5] h-full rounded-full transition-all duration-500" style={{ width: '44%' }}></div>
              </div>
              <div className="text-[11px] text-[#6B7AAD] mt-1">4 de 9 en negociación activa</div>
            </div>

            {/* Bar 3 */}
            <div>
              <div className="flex justify-between items-center text-[12px] text-[#6B7AAD] mb-1">
                <span>Objetivo runway (meses)</span>
                <span className="font-semibold text-[#E4EAFF]">60%</span>
              </div>
              <div className="w-full bg-[#222850] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#00C9A7] h-full rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
              </div>
              <div className="text-[11px] text-[#6B7AAD] mt-1">7.2 meses actuales</div>
            </div>

            {/* Bar 4 */}
            <div>
              <div className="flex justify-between items-center text-[12px] text-[#6B7AAD] mb-1">
                <span>Producto — Sprint actual</span>
                <span className="font-semibold text-[#E4EAFF]">75%</span>
              </div>
              <div className="w-full bg-[#222850] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#F5A623] h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
              </div>
              <div className="text-[11px] text-[#6B7AAD] mt-1">Sprint 12 · 75% completado</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
