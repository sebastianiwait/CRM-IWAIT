import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  FolderLock, 
  Award, 
  CheckSquare,
  Rocket,
  Users,
  Plane,
  Briefcase,
  KanbanSquare
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tasksCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, tasksCount }: SidebarProps) {
  // Navigation item helper
  const renderItem = (tabId: string, label: string, icon: React.ReactNode, badge?: React.ReactNode) => {
    const isActive = activeTab === tabId;
    return (
      <button
        onClick={() => setActiveTab(tabId)}
        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-left cursor-pointer transition-all duration-200 text-[13.5px] ${
          isActive
            ? 'bg-[#0E457F]/10 text-[#0E457F] font-semibold border border-transparent'
            : 'text-[#33475b] hover:bg-[#0E457F]/8 hover:text-[#0F1A2C]'
        }`}
      >
        {icon}
        <span className="flex-1">{label}</span>
        {badge}
      </button>
    );
  };

  return (
    <div className="w-[230px] bg-gradient-to-b from-[#cde4ed] via-[#f5fcfd] to-white border-r border-[#c3dae4] flex flex-col fixed top-0 left-0 h-screen overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#c3dae4] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0E457F] to-[#47B6E6] flex items-center justify-center text-white font-extrabold text-[13px] tracking-tight">
          iw
        </div>
        <div>
          <div className="text-[16px] font-extrabold text-[#0F1A2C] tracking-tight leading-tight">iwait<span className="text-[#47B6E6]">.</span></div>
          <div className="text-[10px] text-[#64748B] tracking-wider uppercase font-mono font-bold">Platform CRM</div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 p-3 space-y-4">
        {/* General */}
        <div>
          <div className="px-3.5 py-1 text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">General</div>
          <div className="mt-1">
            {renderItem('inicio', 'Inicio', <LayoutDashboard className="w-[17px] h-[17px]" />)}
          </div>
        </div>

        {/* Inversiones */}
        <div>
          <div className="px-3.5 py-1 text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Inversiones</div>
          <div className="mt-1 space-y-0.5">
            {renderItem('inversionstas', 'Inversionistas', <TrendingUp className="w-[17px] h-[17px]" />)}
            {renderItem('dataroom', 'Data Room', <FolderLock className="w-[17px] h-[17px]" />)}
          </div>
        </div>

        {/* Producto */}
        <div>
          <div className="px-3.5 py-1 text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Producto</div>
          <div className="mt-1 space-y-0.5">
            {renderItem('producto', 'Seguimiento & Sprints', <Rocket className="w-[17px] h-[17px]" />)}
            {renderItem('sprint-jd', 'Backlog · Juan Diego', <KanbanSquare className="w-[17px] h-[17px]" />)}
            {renderItem(
              'airports', 
              'AI Airports', 
              <Plane className="w-[17px] h-[17px]" />,
              <span className="bg-[#00C9A7] text-[#0F1A2C] text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-auto">3</span>
            )}
            {renderItem('compensaciones', 'Compensaciones & Progreso', <Award className="w-[17px] h-[17px]" />)}
          </div>
        </div>

        {/* Operaciones */}
        <div>
          <div className="px-3.5 py-1 text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Operaciones</div>
          <div className="mt-1 space-y-0.5">
            {renderItem(
              'tareas', 
              'Tareas', 
              <CheckSquare className="w-[17px] h-[17px]" />,
              <span className="bg-[#0E457F] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-auto">{tasksCount}</span>
            )}
          </div>
        </div>

        {/* Comercial */}
        <div>
          <div className="px-3.5 py-1 text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">Comercial</div>
          <div className="mt-1 space-y-0.5">
            {renderItem('leads', 'Leads & Pipeline', <Briefcase className="w-[17px] h-[17px]" />)}
            {renderItem('clientes', 'Clientes', <Users className="w-[17px] h-[17px]" />)}
          </div>
        </div>
      </nav>

      {/* Sidebar Footer User Details */}
      <div className="p-4 border-t border-[#c3dae4] flex items-center gap-2.5">
        <div className="w-7.5 h-7.5 rounded-full bg-gradient-to-tr from-[#0E457F] to-[#47B6E6] flex items-center justify-center font-bold text-xs text-white">
          SM
        </div>
        <div className="truncate">
          <div className="text-[13px] font-medium text-[#0F1A2C] truncate">Sebastian M.</div>
          <div className="text-[11px] text-[#64748B] truncate">Founder &amp; CEO</div>
        </div>
      </div>
    </div>
  );
}
