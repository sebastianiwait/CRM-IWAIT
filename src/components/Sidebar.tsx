import React, { useState } from 'react';
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
  KanbanSquare,
  Search,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tasksCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, tasksCount }: SidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    general: true,
    inversiones: true,
    producto: true,
    operaciones: true,
    comercial: true
  });
  const [filter, setFilter] = useState('');

  const toggleSection = (key: string) =>
    setOpenSections((cur) => ({ ...cur, [key]: !cur[key] }));

  // Navigation item helper
  const renderItem = (tabId: string, label: string, icon: React.ReactNode, badge?: React.ReactNode) => {
    if (filter.trim() && !label.toLowerCase().includes(filter.toLowerCase())) return null;
    const isActive = activeTab === tabId;
    return (
      <button
        onClick={() => setActiveTab(tabId)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left cursor-pointer transition-all duration-200 text-[13.5px] ${
          isActive
            ? 'bg-[#eef4f9] text-[#0F1A2C] font-semibold'
            : 'text-[#33475b] hover:bg-[#f1f6fa] hover:text-[#0F1A2C]'
        }`}
      >
        <span className={isActive ? 'text-[#0E457F]' : 'text-[#64748B]'}>{icon}</span>
        <span className="flex-1">{label}</span>
        {badge}
      </button>
    );
  };

  const renderSection = (key: string, title: string, children: React.ReactNode) => {
    const isOpen = openSections[key];
    // Hide the whole section when filtering yields nothing
    const hasVisibleChildren = React.Children.toArray(children).some(Boolean);
    if (filter.trim() && !hasVisibleChildren) return null;
    return (
      <div>
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-[12px] font-semibold text-[#64748B] hover:text-[#0F1A2C] transition-colors cursor-pointer"
        >
          <span>{title}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}
          />
        </button>
        {isOpen && <div className="mt-0.5 space-y-0.5">{children}</div>}
      </div>
    );
  };

  return (
    <div data-tour="sidebar" className="w-[230px] bg-white border-r border-[#e6eef4] flex flex-col fixed top-0 left-0 h-screen overflow-y-auto">
      {/* Brand Header */}
      <div className="p-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0E457F] to-[#47B6E6] flex items-center justify-center text-white font-extrabold text-[13px] tracking-tight">
          iw
        </div>
        <div>
          <div className="text-[15px] font-extrabold text-[#0F1A2C] tracking-tight leading-tight">
            iwait<span className="text-[#47B6E6]">.</span>
          </div>
          <div className="text-[9.5px] text-[#64748B] tracking-wider uppercase font-mono font-bold">Platform CRM</div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-[15px] h-[15px] text-[#94a3b8]" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Buscar..."
            className="w-full bg-[#f5f9fc] border border-[#e6eef4] rounded-lg pl-9 pr-12 py-2 text-[13px] text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] focus:bg-white transition-colors"
          />
          <span className="absolute right-2.5 text-[10px] font-mono text-[#94a3b8] bg-white border border-[#e6eef4] rounded px-1.5 py-0.5">
            ⌘K
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 pb-3 space-y-3">
        {renderSection('general', 'General', <>
          {renderItem('inicio', 'Inicio', <LayoutDashboard className="w-[17px] h-[17px]" />)}
        </>)}

        {renderSection('inversiones', 'Inversiones', <>
          {renderItem('inversionstas', 'Inversionistas', <TrendingUp className="w-[17px] h-[17px]" />)}
          {renderItem('dataroom', 'Data Room', <FolderLock className="w-[17px] h-[17px]" />)}
        </>)}

        {renderSection('producto', 'Producto', <>
          {renderItem('producto', 'Aerolíneas & Aeropuertos', <Rocket className="w-[17px] h-[17px]" />)}
          {renderItem('compensaciones', 'Compensaciones & Progreso', <Award className="w-[17px] h-[17px]" />)}
        </>)}

        {renderSection('operaciones', 'Operaciones', <>
          {renderItem(
            'tareas',
            'Tareas',
            <CheckSquare className="w-[17px] h-[17px]" />,
            <span className="bg-[#0E457F]/10 text-[#0E457F] text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-auto">{tasksCount}</span>
          )}
        </>)}

        {renderSection('comercial', 'Comercial', <>
          {renderItem('leads', 'Leads & Pipeline', <Briefcase className="w-[17px] h-[17px]" />)}
          {renderItem('clientes', 'Clientes', <Users className="w-[17px] h-[17px]" />)}
        </>)}
      </nav>

      {/* Sidebar Footer User Details */}
      <div className="p-3.5 border-t border-[#e6eef4] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0E457F] to-[#47B6E6] flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
          SM
        </div>
        <div className="truncate">
          <div className="text-[13px] font-semibold text-[#0F1A2C] truncate">Sebastian M.</div>
          <div className="text-[11px] text-[#64748B] truncate">Founder &amp; CEO</div>
        </div>
      </div>
    </div>
  );
}
