import React, { useState } from 'react';
import { 
  Sparkles,
  Info
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

  // Simple Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(current => current === msg ? null : current);
    }, 4500);
  };

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
