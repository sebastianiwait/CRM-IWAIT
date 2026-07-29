import React, { useState } from 'react';
import { 
  Sparkles,
  Info,
  Search,
  Building2,
  Briefcase,
  CheckCircle2,
  Menu
} from 'lucide-react';
import {
  INITIAL_INVESTORS,
  INITIAL_DATA_ROOM,
  INITIAL_TASKS,
  Investor,
  DataRoomFile,
  KanbanTask
} from './data/iwaitData';
import { INITIAL_DEALS } from './data/crmData';
import { useDeals } from './hooks/useDeals';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './components/LoginScreen';

// Modular Sub-views
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import InvestorsView from './components/InvestorsView';
import DataRoomView from './components/DataRoomView';
import TasksView from './components/TasksView';
import AiAirportsView from './components/AiAirportsView';
import CompensationsView from './components/CompensationsView';
import ProductHubView from './components/ProductHubView';
import DealsView from './components/commercial/DealsView';
import Tour, { TourStep } from './components/Tour';
import TutorialsMenu from './components/TutorialsMenu';
import { TOURS } from './data/tours';
import { TUTORIALS } from './data/tutorials';

export default function App() {
  const { user, loading: authLoading, error: authError, signInWithGoogle, signInAsDemo, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [tutorialsOpen, setTutorialsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTour, setActiveTour] = useState<TourStep[] | null>(null);

  // Launch a tutorial: navigate to its section, then run the interactive tour
  // (or a centered walkthrough derived from the written manual).
  const startTutorial = (section: string) => {
    setTutorialsOpen(false);
    setActiveTab(section);
    const steps: TourStep[] =
      TOURS[section] ??
      (TUTORIALS[section]
        ? [
            { title: TUTORIALS[section].title, body: TUTORIALS[section].intro },
            ...TUTORIALS[section].steps.map((s) => ({ title: s.title, body: s.body })),
            { title: 'Tip', body: TUTORIALS[section].tip }
          ]
        : []);
    if (steps.length === 0) return;
    setTimeout(() => setActiveTour(steps), 380);
  };
  
  // State management
  const [investors, setInvestors] = useState<Investor[]>(INITIAL_INVESTORS);
  const [dataRoomFiles, setDataRoomFiles] = useState<DataRoomFile[]>(INITIAL_DATA_ROOM);
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);

  // Global search state
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [focusDealId, setFocusDealId] = useState<string | null>(null);

  // Simple Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(current => current === msg ? null : current);
    }, 4500);
  };

  // Módulo comercial (deals con contactos y actividad embebidos)
  const {
    deals,
    addDeal,
    updateDeal,
    moveStage,
    deleteDeal,
    addActivity,
    upsertContact,
    deleteContact
  } = useDeals(INITIAL_DEALS, triggerToast);

  const handleGlobalSearch = (term: string) => {
    setGlobalSearchTerm(term);
  };

  const getSearchResults = () => {
    if (!globalSearchTerm.trim()) return null;
    const term = globalSearchTerm.toLowerCase();
    
    const matchedInvestors = investors.filter(i => i.name.toLowerCase().includes(term) || i.status.toLowerCase().includes(term));
    const matchedDeals = deals.filter(d =>
      d.name.toLowerCase().includes(term) ||
      d.company.toLowerCase().includes(term) ||
      d.stage.toLowerCase().includes(term) ||
      d.contacts.some(c => c.name.toLowerCase().includes(term))
    );
    const matchedTasks = tasks.filter(t => t.title.toLowerCase().includes(term) || t.column.toLowerCase().includes(term) || t.assignedTo.toLowerCase().includes(term));

    return { investors: matchedInvestors, deals: matchedDeals, tasks: matchedTasks };
  };

  const searchResults = getSearchResults();
  const hasResults = searchResults && (searchResults.investors.length > 0 || searchResults.deals.length > 0 || searchResults.tasks.length > 0);


  // State handlers to bubble up modifications
  const handleAddInvestor = (newInv: Omit<Investor, 'id'>) => {
    const inv: Investor = {
      ...newInv,
      id: `inv-${Date.now()}`
    };
    setInvestors(current => [inv, ...current]);
    triggerToast(`Inversor "${newInv.name}" agregado exitosamente`);
  };

  const handleUpdateInvestor = (id: string, patch: Partial<Omit<Investor, 'id'>>) => {
    setInvestors(current => current.map(i => (i.id === id ? { ...i, ...patch } : i)));
    triggerToast('Inversor actualizado');
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

  const handleUpdateTask = (id: string, patch: Partial<Omit<KanbanTask, 'id'>>) => {
    setTasks(current => current.map(t => (t.id === id ? { ...t, ...patch } : t)));
    triggerToast('Tarea actualizada');
  };

  const handleDeleteTask = (id: string) => {
    setTasks(current => current.filter(t => t.id !== id));
    triggerToast('Tarea eliminada');
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
              clientsCount: deals.filter(d => !d.stage.startsWith('Cerrado')).length,
              tasksCount: tasks.filter(t => t.column !== 'Hecho').length
            }}
            onAddInvestor={handleAddInvestor}
            onAddDeal={addDeal}
            onAddTask={handleAddTask}
            navigate={setActiveTab}
          />
        );
      case 'inversionstas':
        return (
          <InvestorsView
            investors={investors}
            onAddInvestor={handleAddInvestor}
            onUpdateInvestor={handleUpdateInvestor}
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
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            triggerToast={triggerToast}
          />
        );
      case 'producto':
        return (
          <ProductHubView triggerToast={triggerToast} />
        );
      case 'negocios':
        return (
          <DealsView
            deals={deals}
            onAddDeal={addDeal}
            onUpdateDeal={updateDeal}
            onMoveStage={moveStage}
            onDeleteDeal={deleteDeal}
            onAddActivity={addActivity}
            onUpsertContact={upsertContact}
            onDeleteContact={deleteContact}
            focusDealId={focusDealId}
            onFocusHandled={() => setFocusDealId(null)}
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
          <div className="p-8 text-center bg-[#14243A] rounded-xl border border-[#22384F]">
            <Info className="w-8 h-8 text-[#0E457F] mx-auto mb-2" />
            <h3 className="text-lg font-bold">Sección en construcción</h3>
          </div>
        );
    }
  };

  // Puerta de autenticación
  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0E457F] to-[#47B6E6] animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <LoginScreen
        onGoogle={signInWithGoogle}
        onDemo={signInAsDemo}
        loading={authLoading}
        error={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fafc] text-[#0F1A2C] font-sans antialiased flex">

      {/* Sidebar navigation */}
      <Sidebar
        user={user}
        onSignOut={signOut}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tasksCount={tasks.filter(t => t.column !== 'Hecho').length}
        onOpenTutorials={() => setTutorialsOpen(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content stage */}
      <main className="flex-1 md:ml-[230px] min-h-screen flex flex-col relative bg-[#f7fafc] w-full min-w-0">
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#c3dae4] px-4 md:px-8 py-3 md:py-4 flex items-center gap-3">
          {/* Hamburguesa solo en móvil */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 -ml-1 rounded-lg text-[#33475b] hover:bg-[#f1f6fa] transition-colors flex-shrink-0"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 max-w-3xl mx-auto relative min-w-0" data-tour="global-search">
            <div className={`relative flex items-center bg-white border ${isSearchFocused ? 'border-[#0E457F] ring-1 ring-[#0E457F]/40' : 'border-[#c3dae4]'} rounded-xl transition-all duration-200 shadow-sm`}>
              <Search className={`absolute left-4 w-5 h-5 ${isSearchFocused ? 'text-[#0E457F]' : 'text-[#64748B]'}`} />
              <input
                type="text"
                placeholder="Buscar inversores, negocios o tareas..."
                value={globalSearchTerm}
                onChange={(e) => handleGlobalSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // delay to allow clicking results
                className="w-full bg-transparent border-none text-[#0F1A2C] placeholder-[#64748B] pl-12 pr-4 py-3 focus:outline-none rounded-xl text-[14px]"
              />
              {globalSearchTerm && (
                <button
                  onClick={() => {
                    setGlobalSearchTerm('');
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-4 text-[#64748B] hover:text-[#EAF3F9] text-[12px] font-medium"
                >
                  ESC
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchFocused && globalSearchTerm && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#14243A] border border-[#22384F] rounded-xl shadow-2xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
                {hasResults ? (
                  <div className="py-2">
                    {searchResults.investors.length > 0 && (
                      <div className="px-3 py-2">
                        <h4 className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2 px-3">Inversores</h4>
                        {searchResults.investors.map(inv => (
                          <button
                            key={inv.id}
                            onClick={() => {
                              setActiveTab('inversionstas');
                              setGlobalSearchTerm('');
                            }}
                            className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#1B2F49] group transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#47B6E6]/10 text-[#47B6E6] flex items-center justify-center">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-[13px] font-semibold text-[#EAF3F9] group-hover:text-[#0E457F] transition-colors">{inv.name}</div>
                                <div className="text-[11px] text-[#64748B]">{inv.type}</div>
                              </div>
                            </div>
                            <span className="text-[11px] font-medium px-2 py-1 rounded bg-[#22384F] text-[#8DA2B5]">{inv.status}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.deals.length > 0 && (
                      <div className="px-3 py-2 border-t border-[#eef2f6]">
                        <h4 className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2 px-3">Negocios</h4>
                        {searchResults.deals.map(deal => (
                          <button
                            key={deal.id}
                            onClick={() => {
                              setActiveTab('negocios');
                              setFocusDealId(deal.id);
                              setGlobalSearchTerm('');
                            }}
                            className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#f1f6fa] group transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-[#10CC82]/10 text-[#10CC82] flex items-center justify-center flex-shrink-0">
                                <Briefcase className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[13px] font-semibold text-[#0F1A2C] group-hover:text-[#0E457F] transition-colors truncate">{deal.name}</div>
                                <div className="text-[11px] text-[#64748B] truncate">{deal.company}</div>
                              </div>
                            </div>
                            <span className="text-[11px] font-medium px-2 py-1 rounded bg-[#eef2f6] text-[#64748B] flex-shrink-0 ml-2">{deal.stage}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.tasks.length > 0 && (
                      <div className="px-3 py-2 border-t border-[#22384F]">
                        <h4 className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2 px-3">Tareas</h4>
                        {searchResults.tasks.map(task => (
                          <button
                            key={task.id}
                            onClick={() => {
                              setActiveTab('tareas');
                              setGlobalSearchTerm('');
                            }}
                            className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#1B2F49] group transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#0E457F]/10 text-[#0E457F] flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-[13px] font-semibold text-[#EAF3F9] group-hover:text-[#0E457F] transition-colors line-clamp-1">{task.title}</div>
                                <div className="text-[11px] text-[#64748B]">Asignado: {task.assignedTo}</div>
                              </div>
                            </div>
                            <span className="text-[11px] font-medium px-2 py-1 rounded bg-[#22384F] text-[#8DA2B5] whitespace-nowrap">{task.column}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="w-8 h-8 text-[#22384F] mx-auto mb-3" />
                    <p className="text-[13px] text-[#64748B]">No se encontraron resultados para "{globalSearchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="px-4 md:px-8 py-5 md:py-7 w-full mx-auto flex-1 min-w-0">
          {renderActiveView()}
        </div>
      </main>

      {/* Tutorials picker + interactive tour */}
      {tutorialsOpen && (
        <TutorialsMenu onClose={() => setTutorialsOpen(false)} onSelect={startTutorial} />
      )}
      {activeTour && <Tour steps={activeTour} onClose={() => setActiveTour(null)} />}

      {/* Premium custom alert messages / Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[60] bg-[#0F1A2C] text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 animate-slide-up">
          <Sparkles className="w-4 h-4 text-[#47B6E6] flex-shrink-0" />
          <span className="text-[13px] font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
