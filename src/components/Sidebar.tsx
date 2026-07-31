import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  FolderLock,
  Award,
  CheckSquare,
  Rocket,
  Plane,
  Briefcase,
  KanbanSquare,
  Search,
  ChevronDown,
  GraduationCap,
  LogOut,
  RotateCcw
} from 'lucide-react';
import { AppUser } from '../hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tasksCount: number;
  onOpenTutorials: () => void;
  /** en móvil el sidebar es un drawer */
  isOpen?: boolean;
  onClose?: () => void;
  user: AppUser;
  onSignOut: () => void;
  onResetData: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  tasksCount,
  onOpenTutorials,
  isOpen = false,
  onClose,
  user,
  onSignOut,
  onResetData
}: SidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    general: true,
    inversiones: true,
    producto: true,
    comercial: true
  });
  const [filter, setFilter] = useState('');

  const toggleSection = (key: string) =>
    setOpenSections((cur) => ({ ...cur, [key]: !cur[key] }));

  // Navigation item helper. `count` se estiliza aquí para que contraste
  // tanto sobre el fondo claro como sobre el navy del ítem activo.
  const renderItem = (tabId: string, label: string, icon: React.ReactNode, count?: number) => {
    if (filter.trim() && !label.toLowerCase().includes(filter.toLowerCase())) return null;
    const isActive = activeTab === tabId;
    const badge =
      count === undefined ? null : (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-auto ${
            isActive ? 'bg-white/20 text-white' : 'bg-[#0E457F]/10 text-[#0E457F]'
          }`}
        >
          {count}
        </span>
      );
    return (
      <button
        onClick={() => { setActiveTab(tabId); onClose?.(); }}
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-200 text-[13.5px] ${
          isActive
            ? 'bg-gradient-to-r from-[#0E457F] to-[#1a5c9e] text-white font-semibold shadow-sm shadow-[#0E457F]/25'
            : 'text-[#33475b] hover:bg-[#eaf3f8] hover:text-[#0F1A2C]'
        }`}
      >
        <span className={isActive ? 'text-white' : 'text-[#64748B]'}>{icon}</span>
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
    <>
      {/* Backdrop solo en móvil */}
      {isOpen && (
        <div
          onClick={onClose}
          className="md:hidden fixed inset-0 z-40 bg-[#0F1A2C]/40 backdrop-blur-sm animate-fade-in"
        />
      )}

      <div
        data-tour="sidebar"
        className={`w-[250px] md:w-[230px] bg-white border-r border-[#e6eef4] flex flex-col fixed top-0 left-0 h-screen overflow-y-auto z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
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
            className="w-full bg-[#f4fafc] border border-[#dceaf2] rounded-xl pl-9 pr-12 py-2 text-[13px] text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] focus:bg-white transition-colors"
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
          {renderItem('tareas', 'Tareas', <CheckSquare className="w-[17px] h-[17px]" />, tasksCount)}
        </>)}

        {renderSection('inversiones', 'Inversiones', <>
          {renderItem('inversionstas', 'Inversionistas', <TrendingUp className="w-[17px] h-[17px]" />)}
          {renderItem('dataroom', 'Data Room', <FolderLock className="w-[17px] h-[17px]" />)}
        </>)}

        {renderSection('producto', 'Producto', <>
          {renderItem('producto', 'Aerolíneas & Aeropuertos', <Rocket className="w-[17px] h-[17px]" />)}
          {renderItem('compensaciones', 'Compensaciones & Progreso', <Award className="w-[17px] h-[17px]" />)}
        </>)}

        {renderSection('comercial', 'Comercial', <>
          {renderItem('negocios', 'Negocios', <Briefcase className="w-[17px] h-[17px]" />)}
        </>)}
      </nav>

      {/* Tutoriales trigger */}
      <div className="px-3 pb-2">
        <button
          onClick={onOpenTutorials}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left cursor-pointer transition-all duration-200 text-[13.5px] text-[#33475b] hover:bg-[#0E457F]/8 hover:text-[#0F1A2C]"
        >
          <GraduationCap className="w-[17px] h-[17px] text-[#0E457F]" />
          <span className="flex-1 font-medium">Tutoriales</span>
        </button>
        <button
          onClick={onResetData}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left cursor-pointer transition-all duration-200 text-[12.5px] text-[#94a3b8] hover:bg-[#F05252]/8 hover:text-[#F05252]"
          title="Vuelve a los datos de ejemplo"
        >
          <RotateCcw className="w-[15px] h-[15px]" />
          <span className="flex-1">Restablecer datos</span>
        </button>
      </div>

      {/* Sidebar Footer User Details */}
      <div className="p-3.5 border-t border-[#e6eef4] flex items-center gap-2.5">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0E457F] to-[#47B6E6] flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
            {user.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
          </div>
        )}
        <div className="truncate flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-[#0F1A2C] truncate flex items-center gap-1.5">
            {user.name}
            {user.demo && (
              <span className="text-[9px] font-bold uppercase bg-[#F5A623]/15 text-[#b8790f] px-1.5 py-0.5 rounded">demo</span>
            )}
          </div>
          <div className="text-[11px] text-[#64748B] truncate">{user.email}</div>
        </div>
        <button
          onClick={onSignOut}
          title="Cerrar sesión"
          className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#F05252] hover:bg-[#F05252]/8 transition-colors cursor-pointer flex-shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
      </div>
    </>
  );
}
