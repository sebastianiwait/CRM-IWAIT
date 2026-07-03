import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  X,
  Sparkles,
  Building2,
  TrendingUp,
  User,
  MapPin,
  BarChart3,
  Linkedin,
  LayoutGrid,
  List
} from 'lucide-react';
import { ClientEntity } from '../data/iwaitData';

interface ClientsViewProps {
  clients: ClientEntity[];
  onAddClient: (newClient: Omit<ClientEntity, 'id'>) => void;
  onUpdateClientStatus?: (clientId: string, newStatus: ClientEntity['status']) => void;
  triggerToast: (msg: string) => void;
  initialViewMode?: 'all' | 'leads' | 'clientes';
  key?: string;
}

export default function ClientsView({ clients, onAddClient, onUpdateClientStatus, triggerToast, initialViewMode = 'all' }: ClientsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientEntity | null>(null);
  const [subTab, setSubTab] = useState<'all' | 'leads' | 'clientes'>(initialViewMode);
  const [viewLayout, setViewLayout] = useState<'list' | 'kanban'>(initialViewMode === 'leads' ? 'kanban' : 'list');

  // Drag and drop state
  const [draggingClientId, setDraggingClientId] = useState<string | null>(null);
  const [activeOverStatus, setActiveOverStatus] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggingClientId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeOverStatus !== status) {
      setActiveOverStatus(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setActiveOverStatus(null);
  };

  const handleDrop = (e: React.DragEvent, status: ClientEntity['status']) => {
    e.preventDefault();
    setActiveOverStatus(null);
    setDraggingClientId(null);
    const id = e.dataTransfer.getData('text/plain');
    if (id && onUpdateClientStatus) {
      onUpdateClientStatus(id, status);
      triggerToast(`Lead movido a ${status}`);
    }
  };

  const handleDragEnd = () => {
    setDraggingClientId(null);
    setActiveOverStatus(null);
  };

  // Sync subTab with initialViewMode when the prop changes
  useEffect(() => {
    setSubTab(initialViewMode);
    setViewLayout(initialViewMode === 'leads' ? 'kanban' : 'list');
  }, [initialViewMode]);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<'Aerolínea' | 'Aeropuerto' | 'Comercio'>('Aerolínea');
  const [status, setStatus] = useState<'Lead' | 'Negociando' | 'Contrato' | 'Operativo'>('Lead');
  const [dealValue, setDealValue] = useState('');
  const [hub, setHub] = useState('');
  const [contact, setContact] = useState('');
  const [passengers, setPassengers] = useState('');

  // Filter & Search based on subTab (leads / clientes)
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      // Subtab filtering
      if (subTab === 'leads' && (c.status === 'Operativo' || c.status === 'Contrato')) {
        return false;
      }
      if (subTab === 'clientes' && !(c.status === 'Operativo' || c.status === 'Contrato')) {
        return false;
      }

      // Search term filtering
      return (
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.hub.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [clients, searchTerm, subTab]);

  // Aggregate counts
  const activeCount = clients.filter(c => c.status === 'Operativo').length;
  const pipelineCount = clients.filter(c => c.status === 'Negociando' || c.status === 'Contrato').length;
  const prospectCount = clients.filter(c => c.status === 'Lead').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      triggerToast('El nombre de la empresa es requerido');
      return;
    }

    const val = parseFloat(dealValue) || 12000;
    const pax = parseInt(passengers) || 100000;

    onAddClient({
      name,
      type,
      status,
      dealValue: val,
      hub: hub || 'Terminals EMEA',
      contactPerson: contact || 'Sebastian M.',
      passengersMonthly: pax
    });

    // Reset Form
    setName('');
    setDealValue('');
    setHub('');
    setContact('');
    setPassengers('');
    setIsModalOpen(false);
  };

  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'Operativo':
      case 'Cliente':
        return <span className="bg-[#10CC82]/15 text-[#10CC82] text-[11px] font-semibold px-2 py-0.5 rounded">Cliente</span>;
      case 'Contrato':
      case 'Negociación':
        return <span className="bg-[#8B63F5]/15 text-[#8B63F5] text-[11px] font-semibold px-2 py-0.5 rounded">Negociación</span>;
      case 'Demo':
      case 'Propuesta':
        return <span className="bg-[#F5A623]/15 text-[#F5A623] text-[11px] font-semibold px-2 py-0.5 rounded">Propuesta</span>;
      case 'Lead':
      case 'Prospecto':
      default:
        return <span className="bg-white/5 text-[#9AA3CC] text-[11px] font-semibold px-2 py-0.5 rounded">Prospecto</span>;
    }
  };

  return (
    <div className="animate-fade-in space-y-7">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#1C2248] pb-5 gap-4">
        <div>
          <h2 className="text-[20px] font-semibold text-[#E4EAFF] tracking-tight">
            {subTab === 'leads' ? 'Leads & Pipeline' : subTab === 'clientes' ? 'Clientes Activos' : 'Comercial — Todo'}
          </h2>
          <p className="text-[13px] text-[#6B7AAD] mt-0.5">
            {subTab === 'leads' 
              ? 'Gestión de prospectos, demos y negociaciones en curso' 
              : subTab === 'clientes' 
              ? 'Cuentas operativas y contratos de servicio activos' 
              : 'Pipeline comercial, prospección y gestión de cuentas activas'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#090C20] border border-[#1C2248] rounded-lg p-1">
          <button
            type="button"
            onClick={() => setSubTab('all')}
            className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all duration-200 cursor-pointer ${
              subTab === 'all'
                ? 'bg-[#4F7EF8] text-white'
                : 'text-[#6B7AAD] hover:text-[#E4EAFF]'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setSubTab('leads')}
            className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all duration-200 cursor-pointer ${
              subTab === 'leads'
                ? 'bg-[#4F7EF8] text-white'
                : 'text-[#6B7AAD] hover:text-[#E4EAFF]'
            }`}
          >
            Leads
          </button>
          <button
            type="button"
            onClick={() => setSubTab('clientes')}
            className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all duration-200 cursor-pointer ${
              subTab === 'clientes'
                ? 'bg-[#4F7EF8] text-white'
                : 'text-[#6B7AAD] hover:text-[#E4EAFF]'
            }`}
          >
            Clientes
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center">
          {/* View Layout Toggle */}
          <div className="flex bg-[#090C20] border border-[#1C2248] rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewLayout('list')}
              className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                viewLayout === 'list'
                  ? 'bg-[#4F7EF8] text-white'
                  : 'text-[#6B7AAD] hover:text-[#E4EAFF]'
              }`}
              title="Vista Lista"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('kanban')}
              className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                viewLayout === 'kanban'
                  ? 'bg-[#4F7EF8] text-white'
                  : 'text-[#6B7AAD] hover:text-[#E4EAFF]'
              }`}
              title="Vista Kanban"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7AAD]" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="bg-[#0F1330] border border-[#222850] rounded-lg pl-9 pr-4 py-1.8 text-[#E4EAFF] placeholder-[#6B7AAD] focus:outline-none focus:border-[#4F7EF8] text-[13px] w-[150px] md:w-[180px]"
            />
          </div>
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary px-3.5 py-1.8 bg-[#4F7EF8] hover:bg-[#2B56D6] text-white rounded-lg text-[13px] flex items-center gap-1.5 transition-all font-medium text-sm cursor-pointer"
          >
            <Plus className="w-[15px] h-[15px]" /> Nuevo lead / cliente
          </button>
        </div>
      </div>

      {/* Pipeline visual sequence */}
      <div className="mb-28">
        <div className="text-[12px] font-semibold text-[#6B7AAD] uppercase tracking-wider mb-2.5">Embudo Comercial (Pipeline)</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 bg-[#0F1330] border border-[#1C2248] rounded-xl overflow-hidden text-center divide-x divide-[#1C2248]">
          <div className="p-3.5">
            <div className="text-lg font-bold text-[#E4EAFF]">5</div>
            <div className="text-[11px] text-[#6B7AAD] mt-0.5">Prospecto</div>
          </div>
          <div className="p-3.5 bg-[#4F7EF8]/10 border-y sm:border-y-0 text-center">
            <div className="text-lg font-bold text-[#7AA4FA]">4</div>
            <div className="text-[11px] text-[#7AA4FA] mt-0.5 font-semibold">Demo (Activo)</div>
          </div>
          <div className="p-3.5">
            <div className="text-lg font-bold text-[#E4EAFF]">3</div>
            <div className="text-[11px] text-[#6B7AAD] mt-0.5">Propuesta</div>
          </div>
          <div className="p-3.5">
            <div className="text-lg font-bold text-[#E4EAFF]">2</div>
            <div className="text-[11px] text-[#6B7AAD] mt-0.5">Negociación</div>
          </div>
          <div className="p-3.5">
            <div className="text-lg font-bold text-[#10CC82]">3</div>
            <div className="text-[11px] text-[#10CC82] mt-0.5 font-semibold">Cliente</div>
          </div>
        </div>
      </div>

      {/* Client listing / Kanban view */}
      {viewLayout === 'list' ? (
        <div className="bg-[#0F1330] border border-[#1C2248] rounded-lg overflow-hidden animate-fade-in">
          <div className="border-b border-[#1C2248] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131740]/25">
            <h3 className="text-[14px] font-semibold text-[#E4EAFF]">Todas las cuentas</h3>
            <div className="flex gap-2.5 flex-wrap">
              <span className="bg-[#10CC82]/15 text-[#10CC82] text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{activeCount} activos</span>
              <span className="bg-[#8B63F5]/15 text-[#8B63F5] text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{pipelineCount} en pipeline</span>
              <span className="bg-[#9AA3CC]/10 text-[#9AA3CC] text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{prospectCount} prospectos</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/[0.02] text-left border-b border-[#1C2248]">
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider">Empresa</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider">Tipo</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider">Etapa</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider">Valor estimado</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider">Último contacto</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider col-span-2">Responsable</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C2248]">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#4F7EF8]/4 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-[#E4EAFF] text-[13.5px]">{client.name}</div>
                      <div className="text-[11px] text-[#6B7AAD] mt-0.5">{client.hub}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        client.type === 'Aerolínea' 
                          ? 'bg-[#4F7EF8]/15 text-[#7AA4FA]' 
                          : client.type === 'Aeropuerto'
                          ? 'bg-[#00C9A7]/15 text-[#00C9A7]'
                          : 'bg-[#8B63F5]/15 text-[#8B63F5]'
                      }`}>
                        {client.type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {getStatusBadge(client.status)}
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#E4EAFF] text-[13.5px]">
                      €{client.dealValue.toLocaleString('es-ES')}/año
                    </td>
                    <td className="px-5 py-3 text-[#6B7AAD] text-[12.5px]">Hoy</td>
                    <td className="px-5 py-3 text-[#E4EAFF] text-[13px]">
                      <div className="flex items-center gap-2">
                        {client.contactPerson}
                        {client.linkedin && (
                          <a href={client.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#4F7EF8] hover:text-[#7AA4FA] transition-colors">
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button 
                        onClick={() => setSelectedClient(client)}
                        className="px-3 py-1.5 bg-[#4F7EF8]/10 hover:bg-[#4F7EF8] text-[#7AA4FA] hover:text-white rounded text-[12px] transition-colors cursor-pointer"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-[#6B7AAD] text-sm">
                      No se encontraron clientes que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x animate-fade-in">
          {(subTab === 'leads' ? ['Lead', 'Negociando'] : subTab === 'clientes' ? ['Contrato', 'Operativo'] : ['Lead', 'Negociando', 'Contrato', 'Operativo']).map((statusKey) => {
            const columnClients = filteredClients.filter(c => c.status === statusKey);
            return (
              <div 
                key={statusKey} 
                onDragOver={(e) => handleDragOver(e, statusKey)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, statusKey as any)}
                className={`flex-1 min-w-[280px] max-w-[320px] bg-[#0F1330] border rounded-lg p-3 snap-start flex flex-col transition-all duration-200 ${
                  activeOverStatus === statusKey 
                    ? 'border-[#4F7EF8] bg-[#0F1330]/80 shadow-[0_0_15px_rgba(79,126,248,0.15)] scale-[1.01]' 
                    : 'border-[#1C2248]'
                }`}
              >
                <div className="flex justify-between items-center mb-3 px-1">
                  <h4 className="text-[13px] font-semibold text-[#E4EAFF] flex items-center gap-2">
                    {statusKey}
                    <span className="bg-[#1C2248] text-[#6B7AAD] px-2 py-0.5 rounded-full text-[10px] font-mono">
                      {columnClients.length}
                    </span>
                  </h4>
                  <div className="text-[11px] font-semibold text-[#10CC82]">
                    €{(columnClients.reduce((acc, client) => acc + client.dealValue, 0) / 1000).toFixed(0)}k
                  </div>
                </div>
                <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar" style={{ maxHeight: '600px' }}>
                  {columnClients.map(client => (
                    <div 
                      key={client.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, client.id)}
                      onDragEnd={handleDragEnd}
                      className={`bg-[#131740] border p-3 rounded-md transition-all cursor-grab active:cursor-grabbing group ${
                        draggingClientId === client.id 
                          ? 'opacity-40 border-dashed border-[#4F7EF8]/60 bg-[#131740]/40 scale-95' 
                          : 'border-[#222850] hover:border-[#4F7EF8]/50'
                      }`}
                      onClick={() => setSelectedClient(client)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-[#E4EAFF] text-[13px] group-hover:text-[#7AA4FA] transition-colors">{client.name}</span>
                        {getStatusBadge(client.status)}
                      </div>
                      <div className="text-[11px] text-[#6B7AAD] mb-2.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {client.hub}
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#1C2248]/50">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          client.type === 'Aerolínea' 
                            ? 'bg-[#4F7EF8]/15 text-[#7AA4FA]' 
                            : client.type === 'Aeropuerto'
                            ? 'bg-[#00C9A7]/15 text-[#00C9A7]'
                            : 'bg-[#8B63F5]/15 text-[#8B63F5]'
                        }`}>
                          {client.type}
                        </span>
                        <div className="text-[12px] font-semibold text-[#E4EAFF]">
                          €{(client.dealValue / 1000).toFixed(0)}k
                        </div>
                      </div>
                    </div>
                  ))}
                  {columnClients.length === 0 && (
                    <div className="border border-dashed border-[#1C2248] rounded-md p-4 flex items-center justify-center text-[12px] text-[#6B7AAD]">
                      Sin cuentas
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Client Detail modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-[#07091C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1330] border border-[#1C2248] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#1C2248] px-5 py-4 flex items-center justify-between bg-[#131740]/40">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#7AA4FA]" />
                <h3 className="text-base font-semibold text-[#E4EAFF]">{selectedClient.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedClient(null)} 
                className="text-[#6B7AAD] hover:text-[#E4EAFF] transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-0.5">
                  <div className="text-[11px] text-[#6B7AAD] uppercase tracking-wider font-semibold">Tipo de Cuenta</div>
                  <div className="text-[13.5px] text-[#E4EAFF] font-medium">{selectedClient.type}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] text-[#6B7AAD] uppercase tracking-wider font-semibold">Estado comercial</div>
                  <div className="text-[13.5px] text-[#E4EAFF] font-medium">{selectedClient.status}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] text-[#6B7AAD] uppercase tracking-wider font-semibold">Hub Primario</div>
                  <div className="text-[13.5px] text-[#E4EAFF] font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#6B7AAD]" /> {selectedClient.hub}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] text-[#6B7AAD] uppercase tracking-wider font-semibold">Pasajeros mensuales</div>
                  <div className="text-[13.5px] text-[#E4EAFF] font-medium font-mono">{selectedClient.passengersMonthly ? selectedClient.passengersMonthly.toLocaleString('es-ES') : 'TBD'} pax</div>
                </div>
              </div>

              <div className="bg-[#07091C]/50 border border-[#1C2248] p-4 rounded-lg space-y-2">
                <div className="text-[11px] text-[#6B7AAD] uppercase tracking-wider font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#F5A623]" /> Métricas de Valor del Contrato (ARR)
                </div>
                <div className="text-[20px] font-bold text-[#10CC82]">€{selectedClient.dealValue.toLocaleString('es-ES')}/año</div>
                <div className="text-[11px] text-[#6B7AAD]">Formulado mediante cargo fijo SaaS y comisión por cupón expedido.</div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#131740]/40 border border-[#222850] rounded-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-[30px] h-[30px] rounded-full bg-[#4F7EF8]/10 text-[#7AA4FA] flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#E4EAFF]">{selectedClient.contactPerson}</div>
                    <div className="text-[11px] text-[#6B7AAD]">Punto de contacto y tomador de decisión</div>
                  </div>
                </div>
                {selectedClient.linkedin && (
                  <a href={selectedClient.linkedin} target="_blank" rel="noopener noreferrer" className="w-[30px] h-[30px] rounded-full bg-[#4F7EF8]/10 hover:bg-[#4F7EF8] text-[#7AA4FA] hover:text-white flex items-center justify-center transition-colors cursor-pointer" title="Ver perfil en LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="border-t border-[#1C2248] pt-4 flex justify-end gap-2">
                <button 
                  onClick={() => {
                    triggerToast(`Llamada o demo programada para ${selectedClient.name}`);
                    setSelectedClient(null);
                  }}
                  className="px-4 py-2 bg-[#4F7EF8] hover:bg-[#2B56D6] text-white rounded-lg text-sm font-medium cursor-pointer"
                >
                  Contactar Cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#07091C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1330] border border-[#1C2248] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#1C2248] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#E4EAFF]">Añadir Nueva Cuenta Comercial</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#6B7AAD] hover:text-[#E4EAFF] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5 font-sans">Empresa / Aerolínea</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. AENA Group"
                  className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] placeholder-[#6B7AAD] focus:outline-none focus:border-[#4F7EF8] text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Tipo</label>
                  <select 
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] focus:outline-none focus:border-[#4F7EF8] text-sm"
                  >
                    <option value="Aerolínea">Aerolínea</option>
                    <option value="Aeropuerto">Aeropuerto</option>
                    <option value="Comercio">Comercio / Restaurante</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Etapa Comercial</label>
                  <select 
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] focus:outline-none focus:border-[#4F7EF8] text-sm"
                  >
                    <option value="Lead">Lead / Prospecto</option>
                    <option value="Negociando">Negociación</option>
                    <option value="Contrato">Contrato Firmado</option>
                    <option value="Operativo">Operativo (Completado)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Monto ARR (EUR)</label>
                  <input 
                    type="number" 
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    placeholder="Ej. 120000"
                    className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] placeholder-[#6B7AAD] focus:outline-none focus:border-[#4F7EF8] text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Pasajeros mensuales</label>
                  <input 
                    type="number" 
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    placeholder="Ej. 300000"
                    className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] placeholder-[#6B7AAD] focus:outline-none focus:border-[#4F7EF8] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Hub / Base Operativa</label>
                  <input 
                    type="text" 
                    value={hub}
                    onChange={(e) => setHub(e.target.value)}
                    placeholder="Ej. Madrid T4"
                    className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] placeholder-[#6B7AAD] focus:outline-none focus:border-[#4F7EF8] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#6B7AAD] uppercase tracking-wider mb-1.5">Responsable / Contacto</label>
                  <input 
                    type="text" 
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Ej. Marta Villanueva"
                    className="w-full bg-[#131740] border border-[#222850] rounded-lg px-3 py-2 text-[#E4EAFF] placeholder-[#6B7AAD] focus:outline-none focus:border-[#4F7EF8] text-sm"
                  />
                </div>
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
                  Crear Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
