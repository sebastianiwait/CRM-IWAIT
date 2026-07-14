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
        return <span className="bg-[#47B6E6]/15 text-[#47B6E6] text-[11px] font-semibold px-2 py-0.5 rounded">Negociación</span>;
      case 'Demo':
      case 'Propuesta':
        return <span className="bg-[#F5A623]/15 text-[#F5A623] text-[11px] font-semibold px-2 py-0.5 rounded">Propuesta</span>;
      case 'Lead':
      case 'Prospecto':
      default:
        return <span className="bg-white/5 text-[#8DA2B5] text-[11px] font-semibold px-2 py-0.5 rounded">Prospecto</span>;
    }
  };

  return (
    <div className="animate-fade-in space-y-7">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#c3dae4] pb-5 gap-4">
        <div>
          <h2 className="text-[20px] font-semibold text-[#0F1A2C] tracking-tight">
            {subTab === 'leads' ? 'Leads & Pipeline' : subTab === 'clientes' ? 'Clientes Activos' : 'Comercial — Todo'}
          </h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            {subTab === 'leads' 
              ? 'Gestión de prospectos, demos y negociaciones en curso' 
              : subTab === 'clientes' 
              ? 'Cuentas operativas y contratos de servicio activos' 
              : 'Pipeline comercial, prospección y gestión de cuentas activas'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#0B1524] border border-[#22384F] rounded-lg p-1">
          <button
            type="button"
            onClick={() => setSubTab('all')}
            className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all duration-200 cursor-pointer ${
              subTab === 'all'
                ? 'bg-[#0E457F] text-white'
                : 'text-[#64748B] hover:text-[#EAF3F9]'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setSubTab('leads')}
            className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all duration-200 cursor-pointer ${
              subTab === 'leads'
                ? 'bg-[#0E457F] text-white'
                : 'text-[#64748B] hover:text-[#EAF3F9]'
            }`}
          >
            Leads
          </button>
          <button
            type="button"
            onClick={() => setSubTab('clientes')}
            className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all duration-200 cursor-pointer ${
              subTab === 'clientes'
                ? 'bg-[#0E457F] text-white'
                : 'text-[#64748B] hover:text-[#EAF3F9]'
            }`}
          >
            Clientes
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center">
          {/* View Layout Toggle */}
          <div className="flex bg-[#0B1524] border border-[#22384F] rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewLayout('list')}
              className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                viewLayout === 'list'
                  ? 'bg-[#0E457F] text-white'
                  : 'text-[#64748B] hover:text-[#EAF3F9]'
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
                  ? 'bg-[#0E457F] text-white'
                  : 'text-[#64748B] hover:text-[#EAF3F9]'
              }`}
              title="Vista Kanban"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="bg-[#14243A] border border-[#2A415A] rounded-lg pl-9 pr-4 py-1.8 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-[13px] w-[150px] md:w-[180px]"
            />
          </div>
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary px-3.5 py-1.8 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg text-[13px] flex items-center gap-1.5 transition-all font-medium text-sm cursor-pointer"
          >
            <Plus className="w-[15px] h-[15px]" /> Nuevo lead / cliente
          </button>
        </div>
      </div>

      {/* Pipeline visual sequence */}
      <div className="mb-28">
        <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-2.5">Embudo Comercial (Pipeline)</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 bg-[#14243A] border border-[#22384F] rounded-xl overflow-hidden text-center divide-x divide-[#22384F]">
          <div className="p-3.5">
            <div className="text-lg font-bold text-[#EAF3F9]">5</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Prospecto</div>
          </div>
          <div className="p-3.5 bg-[#0E457F]/10 border-y sm:border-y-0 text-center">
            <div className="text-lg font-bold text-[#47B6E6]">4</div>
            <div className="text-[11px] text-[#47B6E6] mt-0.5 font-semibold">Demo (Activo)</div>
          </div>
          <div className="p-3.5">
            <div className="text-lg font-bold text-[#EAF3F9]">3</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Propuesta</div>
          </div>
          <div className="p-3.5">
            <div className="text-lg font-bold text-[#EAF3F9]">2</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Negociación</div>
          </div>
          <div className="p-3.5">
            <div className="text-lg font-bold text-[#10CC82]">3</div>
            <div className="text-[11px] text-[#10CC82] mt-0.5 font-semibold">Cliente</div>
          </div>
        </div>
      </div>

      {/* Client listing / Kanban view */}
      {viewLayout === 'list' ? (
        <div className="bg-[#14243A] border border-[#22384F] rounded-lg overflow-hidden animate-fade-in">
          <div className="border-b border-[#22384F] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1B2F49]/25">
            <h3 className="text-[14px] font-semibold text-[#EAF3F9]">Todas las cuentas</h3>
            <div className="flex gap-2.5 flex-wrap">
              <span className="bg-[#10CC82]/15 text-[#10CC82] text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{activeCount} activos</span>
              <span className="bg-[#47B6E6]/15 text-[#47B6E6] text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{pipelineCount} en pipeline</span>
              <span className="bg-[#8DA2B5]/10 text-[#8DA2B5] text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{prospectCount} prospectos</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/[0.02] text-left border-b border-[#22384F]">
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Empresa</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Tipo</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Etapa</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Valor estimado</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Último contacto</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider col-span-2">Responsable</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22384F]">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#0E457F]/4 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-[#EAF3F9] text-[13.5px]">{client.name}</div>
                      <div className="text-[11px] text-[#64748B] mt-0.5">{client.hub}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        client.type === 'Aerolínea' 
                          ? 'bg-[#0E457F]/15 text-[#47B6E6]' 
                          : client.type === 'Aeropuerto'
                          ? 'bg-[#00C9A7]/15 text-[#00C9A7]'
                          : 'bg-[#47B6E6]/15 text-[#47B6E6]'
                      }`}>
                        {client.type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {getStatusBadge(client.status)}
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#EAF3F9] text-[13.5px]">
                      €{client.dealValue.toLocaleString('es-ES')}/año
                    </td>
                    <td className="px-5 py-3 text-[#64748B] text-[12.5px]">Hoy</td>
                    <td className="px-5 py-3 text-[#EAF3F9] text-[13px]">
                      <div className="flex items-center gap-2">
                        {client.contactPerson}
                        {client.linkedin && (
                          <a href={client.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#0E457F] hover:text-[#47B6E6] transition-colors">
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button 
                        onClick={() => setSelectedClient(client)}
                        className="px-3 py-1.5 bg-[#0E457F]/10 hover:bg-[#0E457F] text-[#47B6E6] hover:text-white rounded text-[12px] transition-colors cursor-pointer"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-[#64748B] text-sm">
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
                className={`flex-1 min-w-[280px] max-w-[320px] bg-[#14243A] border rounded-lg p-3 snap-start flex flex-col transition-all duration-200 ${
                  activeOverStatus === statusKey 
                    ? 'border-[#0E457F] bg-[#14243A]/80 shadow-[0_0_15px_rgba(79,126,248,0.15)] scale-[1.01]' 
                    : 'border-[#22384F]'
                }`}
              >
                <div className="flex justify-between items-center mb-3 px-1">
                  <h4 className="text-[13px] font-semibold text-[#EAF3F9] flex items-center gap-2">
                    {statusKey}
                    <span className="bg-[#22384F] text-[#64748B] px-2 py-0.5 rounded-full text-[10px] font-mono">
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
                      className={`bg-[#1B2F49] border p-3 rounded-md transition-all cursor-grab active:cursor-grabbing group ${
                        draggingClientId === client.id 
                          ? 'opacity-40 border-dashed border-[#0E457F]/60 bg-[#1B2F49]/40 scale-95' 
                          : 'border-[#2A415A] hover:border-[#0E457F]/50'
                      }`}
                      onClick={() => setSelectedClient(client)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-[#EAF3F9] text-[13px] group-hover:text-[#47B6E6] transition-colors">{client.name}</span>
                        {getStatusBadge(client.status)}
                      </div>
                      <div className="text-[11px] text-[#64748B] mb-2.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {client.hub}
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#22384F]/50">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          client.type === 'Aerolínea' 
                            ? 'bg-[#0E457F]/15 text-[#47B6E6]' 
                            : client.type === 'Aeropuerto'
                            ? 'bg-[#00C9A7]/15 text-[#00C9A7]'
                            : 'bg-[#47B6E6]/15 text-[#47B6E6]'
                        }`}>
                          {client.type}
                        </span>
                        <div className="text-[12px] font-semibold text-[#EAF3F9]">
                          €{(client.dealValue / 1000).toFixed(0)}k
                        </div>
                      </div>
                    </div>
                  ))}
                  {columnClients.length === 0 && (
                    <div className="border border-dashed border-[#22384F] rounded-md p-4 flex items-center justify-center text-[12px] text-[#64748B]">
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
        <div className="fixed inset-0 z-50 bg-[#0F1A2C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243A] border border-[#22384F] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between bg-[#1B2F49]/40">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#47B6E6]" />
                <h3 className="text-base font-semibold text-[#EAF3F9]">{selectedClient.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedClient(null)} 
                className="text-[#64748B] hover:text-[#EAF3F9] transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-0.5">
                  <div className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">Tipo de Cuenta</div>
                  <div className="text-[13.5px] text-[#EAF3F9] font-medium">{selectedClient.type}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">Estado comercial</div>
                  <div className="text-[13.5px] text-[#EAF3F9] font-medium">{selectedClient.status}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">Hub Primario</div>
                  <div className="text-[13.5px] text-[#EAF3F9] font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#64748B]" /> {selectedClient.hub}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">Pasajeros mensuales</div>
                  <div className="text-[13.5px] text-[#EAF3F9] font-medium font-mono">{selectedClient.passengersMonthly ? selectedClient.passengersMonthly.toLocaleString('es-ES') : 'TBD'} pax</div>
                </div>
              </div>

              <div className="bg-[#0F1A2C]/50 border border-[#22384F] p-4 rounded-lg space-y-2">
                <div className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#F5A623]" /> Métricas de Valor del Contrato (ARR)
                </div>
                <div className="text-[20px] font-bold text-[#10CC82]">€{selectedClient.dealValue.toLocaleString('es-ES')}/año</div>
                <div className="text-[11px] text-[#64748B]">Formulado mediante cargo fijo SaaS y comisión por cupón expedido.</div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#1B2F49]/40 border border-[#2A415A] rounded-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-[30px] h-[30px] rounded-full bg-[#0E457F]/10 text-[#47B6E6] flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#EAF3F9]">{selectedClient.contactPerson}</div>
                    <div className="text-[11px] text-[#64748B]">Punto de contacto y tomador de decisión</div>
                  </div>
                </div>
                {selectedClient.linkedin && (
                  <a href={selectedClient.linkedin} target="_blank" rel="noopener noreferrer" className="w-[30px] h-[30px] rounded-full bg-[#0E457F]/10 hover:bg-[#0E457F] text-[#47B6E6] hover:text-white flex items-center justify-center transition-colors cursor-pointer" title="Ver perfil en LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="border-t border-[#22384F] pt-4 flex justify-end gap-2">
                <button 
                  onClick={() => {
                    triggerToast(`Llamada o demo programada para ${selectedClient.name}`);
                    setSelectedClient(null);
                  }}
                  className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg text-sm font-medium cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-[#0F1A2C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243A] border border-[#22384F] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#22384F] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#EAF3F9]">Añadir Nueva Cuenta Comercial</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#64748B] hover:text-[#EAF3F9] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5 font-sans">Empresa / Aerolínea</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. AENA Group"
                  className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Tipo</label>
                  <select 
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-sm"
                  >
                    <option value="Aerolínea">Aerolínea</option>
                    <option value="Aeropuerto">Aeropuerto</option>
                    <option value="Comercio">Comercio / Restaurante</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Etapa Comercial</label>
                  <select 
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] focus:outline-none focus:border-[#0E457F] text-sm"
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
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Monto ARR (EUR)</label>
                  <input 
                    type="number" 
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    placeholder="Ej. 120000"
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Pasajeros mensuales</label>
                  <input 
                    type="number" 
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    placeholder="Ej. 300000"
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Hub / Base Operativa</label>
                  <input 
                    type="text" 
                    value={hub}
                    onChange={(e) => setHub(e.target.value)}
                    placeholder="Ej. Madrid T4"
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] uppercase tracking-wider mb-1.5">Responsable / Contacto</label>
                  <input 
                    type="text" 
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Ej. Marta Villanueva"
                    className="w-full bg-[#1B2F49] border border-[#2A415A] rounded-lg px-3 py-2 text-[#EAF3F9] placeholder-[#64748B] focus:outline-none focus:border-[#0E457F] text-sm"
                  />
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
