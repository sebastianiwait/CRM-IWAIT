import React, { useState } from 'react';
import { 
  Sparkles,
  Info,
  Search,
  Building2,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { 
  INITIAL_INVESTORS, 
  INITIAL_DATA_ROOM, 
  INITIAL_TASKS, 
  INITIAL_CLIENTS,
  Investor, 
  DataRoomFile, 
  KanbanTask, 
  ClientEntity
} from './data/iwaitData';

// Modular Sub-views
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import InvestorsView from './components/InvestorsView';
import DataRoomView from './components/DataRoomView';
import TasksView from './components/TasksView';
import ProductView from './components/ProductView';
import ClientsView from './components/ClientsView';
import AiAirportsView from './components/AiAirportsView';
import CompensationsView from './components/CompensationsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('inicio');
  
  // State management
  const [investors, setInvestors] = useState<Investor[]>(INITIAL_INVESTORS);
  const [dataRoomFiles, setDataRoomFiles] = useState<DataRoomFile[]>(INITIAL_DATA_ROOM);
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [clients, setClients] = useState<ClientEntity[]>(INITIAL_CLIENTS);

  // Global search state
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Simple Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(current => current === msg ? null : current);
    }, 4500);
  };

  const handleGlobalSearch = (term: string) => {
    setGlobalSearchTerm(term);
  };

  const getSearchResults = () => {
    if (!globalSearchTerm.trim()) return null;
    const term = globalSearchTerm.toLowerCase();
    
    const matchedInvestors = investors.filter(i => i.name.toLowerCase().includes(term) || i.status.toLowerCase().includes(term));
    const matchedClients = clients.filter(c => c.name.toLowerCase().includes(term) || c.status.toLowerCase().includes(term) || c.type.toLowerCase().includes(term));
    const matchedTasks = tasks.filter(t => t.title.toLowerCase().includes(term) || t.column.toLowerCase().includes(term) || t.assignedTo.toLowerCase().includes(term));

    return { investors: matchedInvestors, clients: matchedClients, tasks: matchedTasks };
  };

  const searchResults = getSearchResults();
  const hasResults = searchResults && (searchResults.investors.length > 0 || searchResults.clients.length > 0 || searchResults.tasks.length > 0);


  // State handlers to bubble up modifications
  const handleAddInvestor = (newInv: Omit<Investor, 'id'>) => {
    const inv: Investor = {
      ...newInv,
      id: `inv-${Date.now()}`
    };
    setInvestors(current => [inv, ...current]);
    triggerToast(`Inversor "${newInv.name}" agregado exitosamente`);
  };

  const handleDeleteInvestor = (id: string) => {
    const target = investors.find(i => i.id === id);
    if (!target) return;
    setInvestors(current => current.filter(item => item.id !== id));
    triggerToast(`Inversor "${target.name}" removido`);
  };

  const handleUploadFile = (newFile: Omit<DataRoomFile, 'id'>) => {
    const file: DataRoomFile = {
      ...newFile,
      id: `dr-${Date.now()}`
    };
    setDataRoomFiles(current => [file, ...current]);
  };

  const handleAddTask = (newTask: Omit<KanbanTask, 'id'>) => {
    const t: KanbanTask = {
      ...newTask,
      id: `task-${Date.now()}`
    };
    setTasks(current => [t, ...current]);
    triggerToast(`Nueva tarea asignada a: ${newTask.assignedTo}`);
  };

  const handleUpdateTaskColumn = (id: string, newColumn: 'Por Hacer' | 'En Progreso' | 'Hecho') => {
    setTasks(current => current.map(t => t.id === id ? { ...t, column: newColumn } : t));
  };

  const handleUpdateClientStatus = (clientId: string, newStatus: ClientEntity['status']) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, status: newStatus } : c));
  };

  const handleAddClient = (newCli: Omit<ClientEntity, 'id'>) => {
    const cli: ClientEntity = {
      ...newCli,
      id: `cli-${Date.now()}`
    };
    setClients(current => [cli, ...current]);
    triggerToast(`Cliente "${newCli.name}" dado de alta en pipeline`);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <DashboardView 
            onAddAction={() => {
              setActiveTab('tareas');
              triggerToast('Redirigido a la sección de Tareas corporativas nuevas.');
            }}
            triggerToast={triggerToast}
            metrics={{
              totalCapital: investors.reduce((sum, item) => sum + item.committedAmount, 0),
              activeAirports: 3,
              clientsCount: clients.length,
              tasksCount: tasks.filter(t => t.column !== 'Hecho').length
            }}
            onAddInvestor={handleAddInvestor}
            onAddClient={handleAddClient}
            onAddTask={handleAddTask}
            navigate={setActiveTab}
          />
        );
      case 'inversionstas':
        return (
          <InvestorsView 
            investors={investors}
            onAddInvestor={handleAddInvestor}
            onDeleteInvestor={handleDeleteInvestor}
            triggerToast={triggerToast}
          />
        );
      case 'dataroom':
        return (
          <DataRoomView 
            files={dataRoomFiles}
            onUploadFile={handleUploadFile}
            triggerToast={triggerToast}
          />
        );
      case 'tareas':
        return (
          <TasksView 
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTaskColumn={handleUpdateTaskColumn}
            triggerToast={triggerToast}
          />
        );
      case 'producto':
        return (
          <ProductView 
            triggerToast={triggerToast}
            tasks={tasks}
          />
        );
      case 'leads':
        return (
          <ClientsView 
            key="leads"
            clients={clients}
            onAddClient={handleAddClient}
            onUpdateClientStatus={handleUpdateClientStatus}
            triggerToast={triggerToast}
            initialViewMode="leads"
          />
        );
      case 'clientes':
        return (
          <ClientsView 
            key="clientes"
            clients={clients}
            onAddClient={handleAddClient}
            onUpdateClientStatus={handleUpdateClientStatus}
            triggerToast={triggerToast}
            initialViewMode="clientes"
          />
        );
      case 'airports':
        return (
          <AiAirportsView 
            triggerToast={triggerToast}
          />
        );
      case 'compensaciones':
        return (
          <CompensationsView 
            triggerToast={triggerToast}
            tasks={tasks}
          />
        );
      default:
        return (
          <div className="p-8 text-center bg-[#0F1330] rounded-xl border border-[#1C2248]">
            <Info className="w-8 h-8 text-[#4F7EF8] mx-auto mb-2" />
            <h3 className="text-lg font-bold">Sección en construcción</h3>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07091C] text-[#E4EAFF] font-sans antialiased flex">
      
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tasksCount={tasks.filter(t => t.column !== 'Hecho').length}
      />

      {/* Main content stage */}
      <main className="flex-1 ml-[230px] min-h-screen flex flex-col relative">
        <div className="sticky top-0 z-40 bg-[#07091C]/90 backdrop-blur-md border-b border-[#1C2248] px-8 py-4">
          <div className="max-w-3xl mx-auto relative">
            <div className={`relative flex items-center bg-[#0F1330] border ${isSearchFocused ? 'border-[#4F7EF8] ring-1 ring-[#4F7EF8]/50' : 'border-[#1C2248]'} rounded-xl transition-all duration-200`}>
              <Search className={`absolute left-4 w-5 h-5 ${isSearchFocused ? 'text-[#4F7EF8]' : 'text-[#6B7AAD]'}`} />
              <input
                type="text"
                placeholder="Buscar inversores, clientes o tareas..."
                value={globalSearchTerm}
                onChange={(e) => handleGlobalSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // delay to allow clicking results
                className="w-full bg-transparent border-none text-[#E4EAFF] placeholder-[#6B7AAD] pl-12 pr-4 py-3 focus:outline-none rounded-xl text-[14px]"
              />
              {globalSearchTerm && (
                <button
                  onClick={() => {
                    setGlobalSearchTerm('');
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-4 text-[#6B7AAD] hover:text-[#E4EAFF] text-[12px] font-medium"
                >
                  ESC
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchFocused && globalSearchTerm && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F1330] border border-[#1C2248] rounded-xl shadow-2xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
                {hasResults ? (
                  <div className="py-2">
                    {searchResults.investors.length > 0 && (
                      <div className="px-3 py-2">
                        <h4 className="text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider mb-2 px-3">Inversores</h4>
                        {searchResults.investors.map(inv => (
                          <button
                            key={inv.id}
                            onClick={() => {
                              setActiveTab('inversionstas');
                              setGlobalSearchTerm('');
                            }}
                            className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#131740] group transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#8B63F5]/10 text-[#8B63F5] flex items-center justify-center">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-[13px] font-semibold text-[#E4EAFF] group-hover:text-[#4F7EF8] transition-colors">{inv.name}</div>
                                <div className="text-[11px] text-[#6B7AAD]">{inv.type}</div>
                              </div>
                            </div>
                            <span className="text-[11px] font-medium px-2 py-1 rounded bg-[#1C2248] text-[#9AA3CC]">{inv.status}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.clients.length > 0 && (
                      <div className="px-3 py-2 border-t border-[#1C2248]">
                        <h4 className="text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider mb-2 px-3">Cuentas y Leads</h4>
                        {searchResults.clients.map(cli => (
                          <button
                            key={cli.id}
                            onClick={() => {
                              setActiveTab(cli.status === 'Lead' || cli.status === 'Negociando' ? 'leads' : 'clientes');
                              setGlobalSearchTerm('');
                            }}
                            className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#131740] group transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#10CC82]/10 text-[#10CC82] flex items-center justify-center">
                                <Briefcase className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-[13px] font-semibold text-[#E4EAFF] group-hover:text-[#4F7EF8] transition-colors">{cli.name}</div>
                                <div className="text-[11px] text-[#6B7AAD]">{cli.type}</div>
                              </div>
                            </div>
                            <span className="text-[11px] font-medium px-2 py-1 rounded bg-[#1C2248] text-[#9AA3CC]">{cli.status}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.tasks.length > 0 && (
                      <div className="px-3 py-2 border-t border-[#1C2248]">
                        <h4 className="text-[11px] font-semibold text-[#6B7AAD] uppercase tracking-wider mb-2 px-3">Tareas</h4>
                        {searchResults.tasks.map(task => (
                          <button
                            key={task.id}
                            onClick={() => {
                              setActiveTab('tareas');
                              setGlobalSearchTerm('');
                            }}
                            className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#131740] group transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#4F7EF8]/10 text-[#4F7EF8] flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-[13px] font-semibold text-[#E4EAFF] group-hover:text-[#4F7EF8] transition-colors line-clamp-1">{task.title}</div>
                                <div className="text-[11px] text-[#6B7AAD]">Asignado: {task.assignedTo}</div>
                              </div>
                            </div>
                            <span className="text-[11px] font-medium px-2 py-1 rounded bg-[#1C2248] text-[#9AA3CC] whitespace-nowrap">{task.column}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="w-8 h-8 text-[#1C2248] mx-auto mb-3" />
                    <p className="text-[13px] text-[#6B7AAD]">No se encontraron resultados para "{globalSearchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="px-8 py-7 max-w-7xl w-full mx-auto flex-1">
          {renderActiveView()}
        </div>
      </main>

      {/* Premium custom alert messages / Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131740] border border-[#4F7EF8] text-[#E4EAFF] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 animate-slide-up">
          <Sparkles className="w-4 h-4 text-[#7AA4FA] flex-shrink-0" />
          <span className="text-[13px] font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
