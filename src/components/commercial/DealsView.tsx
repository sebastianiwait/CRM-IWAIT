import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, KanbanSquare, Database, Briefcase, TrendingUp } from 'lucide-react';
import {
  Deal,
  DealStage,
  DealContact,
  CompanyType,
  ActivityKind,
  DEAL_STAGES,
  COMPANY_TYPES,
  DEAL_OWNERS,
  money,
  isOpen,
  weightedValue
} from '../../data/crmData';
import { NewDealInput } from '../../hooks/useDeals';
import DealPipeline from './DealPipeline';
import DealTable from './DealTable';
import DealDetailPanel from './DealDetailPanel';
import DealFormModal from './DealFormModal';

interface DealsViewProps {
  deals: Deal[];
  onAddDeal: (input: NewDealInput) => string;
  onUpdateDeal: (id: string, patch: Partial<Omit<Deal, 'id'>>) => void;
  onMoveStage: (id: string, stage: DealStage) => void;
  onDeleteDeal: (id: string) => void;
  onAddActivity: (dealId: string, input: { kind: ActivityKind; text: string; date?: string }) => void;
  onUpsertContact: (dealId: string, contact: DealContact | Omit<DealContact, 'id'>) => void;
  onDeleteContact: (dealId: string, contactId: string) => void;
  focusDealId?: string | null;
  onFocusHandled?: () => void;
}

const selectCls =
  'bg-[#f4fafc] border border-[#dceaf2] rounded-xl px-3 py-2 text-[12.5px] text-[#33475b] focus:outline-none focus:border-[#47B6E6] shadow-sm cursor-pointer';

export default function DealsView({
  deals,
  onAddDeal,
  onUpdateDeal,
  onMoveStage,
  onDeleteDeal,
  onAddActivity,
  onUpsertContact,
  onDeleteContact,
  focusDealId,
  onFocusHandled
}: DealsViewProps) {
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<'Todas' | DealStage>('Todas');
  const [typeFilter, setTypeFilter] = useState<'Todos' | CompanyType>('Todos');
  const [ownerFilter, setOwnerFilter] = useState<'Todos' | string>('Todos');

  // Se guarda el id, no el objeto: así el panel refleja las ediciones
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [form, setForm] = useState<{ open: boolean; mode: 'create' | 'edit'; deal?: Deal }>({
    open: false,
    mode: 'create'
  });

  // Apertura desde la búsqueda global
  useEffect(() => {
    if (focusDealId) {
      setSelectedDealId(focusDealId);
      onFocusHandled?.();
    }
  }, [focusDealId, onFocusHandled]);

  const selected = selectedDealId ? deals.find((d) => d.id === selectedDealId) ?? null : null;

  const filtered = useMemo(() => {
    return deals.filter((d) => {
      if (stageFilter !== 'Todas' && d.stage !== stageFilter) return false;
      if (typeFilter !== 'Todos' && d.companyType !== typeFilter) return false;
      if (ownerFilter !== 'Todos' && d.owner !== ownerFilter) return false;
      if (search.trim()) {
        const t = search.toLowerCase();
        const hit =
          d.name.toLowerCase().includes(t) ||
          d.company.toLowerCase().includes(t) ||
          d.contacts.some((c) => c.name.toLowerCase().includes(t));
        if (!hit) return false;
      }
      return true;
    });
  }, [deals, stageFilter, typeFilter, ownerFilter, search]);

  // KPIs
  const openDeals = deals.filter(isOpen);
  const pipelineValue = openDeals.reduce((a, d) => a + d.amount, 0);
  const weighted = openDeals.reduce((a, d) => a + weightedValue(d), 0);
  const won = deals.filter((d) => d.stage === 'Cerrado ganado');
  const wonValue = won.reduce((a, d) => a + d.amount, 0);
  const avgTicket = openDeals.length > 0 ? Math.round(pipelineValue / openDeals.length) : 0;

  const handleSubmitForm = (values: NewDealInput | Partial<Omit<Deal, 'id'>>) => {
    if (form.mode === 'edit' && form.deal) {
      onUpdateDeal(form.deal.id, values as Partial<Omit<Deal, 'id'>>);
    } else {
      const id = onAddDeal(values as NewDealInput);
      setSelectedDealId(id);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-[#0F1A2C] tracking-tight">Negocios</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">Pipeline comercial, contactos y actividad por cuenta</p>
        </div>
        <button
          data-tour="deal-add"
          onClick={() => setForm({ open: true, mode: 'create' })}
          className="px-3.5 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-xl text-[13px] flex items-center gap-1.5 transition-all font-medium cursor-pointer self-start"
        >
          <Plus className="w-[15px] h-[15px]" /> Nuevo negocio
        </button>
      </div>

      {/* KPIs */}
      <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm p-5 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#0E457F] to-[#47B6E6]"></div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-[18px] h-[18px] text-[#0E457F]" />
          <h3 className="text-[15px] font-bold text-[#0F1A2C]">Resumen del pipeline</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { v: money(pipelineValue), l: 'pipeline abierto', c: '#0F1A2C' },
            { v: money(weighted), l: 'ponderado por etapa', c: '#0E457F' },
            { v: money(wonValue), l: 'cerrado ganado', c: '#10CC82' },
            { v: String(openDeals.length), l: 'negocios abiertos', c: '#0F1A2C' },
            { v: money(avgTicket), l: 'ticket medio', c: '#0F1A2C' }
          ].map((k) => (
            <div key={k.l}>
              <div className="text-[19px] font-bold" style={{ color: k.c }}>{k.v}</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">{k.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-tabs + filtros */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div data-tour="deal-tabs" className="inline-flex bg-[#eef2f6] rounded-xl p-1">
          <button
            onClick={() => setView('pipeline')}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              view === 'pipeline' ? 'bg-white text-[#0F1A2C] shadow-sm' : 'text-[#64748B] hover:text-[#0F1A2C]'
            }`}
          >
            <KanbanSquare className="w-3.5 h-3.5" /> Pipeline
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              view === 'table' ? 'bg-white text-[#0F1A2C] shadow-sm' : 'text-[#64748B] hover:text-[#0F1A2C]'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Tabla
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar negocio, empresa o contacto..."
            className="bg-[#f4fafc] border border-[#dceaf2] rounded-xl pl-9 pr-4 py-2 text-[13px] text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] w-[250px] shadow-sm"
          />
        </div>

        {view === 'table' && (
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value as any)} className={selectCls}>
            <option value="Todas">Todas las etapas</option>
            {DEAL_STAGES.map((s) => <option key={s.key} value={s.key}>{s.key}</option>)}
          </select>
        )}
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className={selectCls}>
          <option value="Todos">Todos los tipos</option>
          {COMPANY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className={selectCls}>
          <option value="Todos">Todos los responsables</option>
          {DEAL_OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>

        <span className="text-[12px] text-[#64748B] ml-auto">{filtered.length} negocios</span>
      </div>

      {/* Contenido */}
      {deals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#dbe9f0] py-16 text-center">
          <Briefcase className="w-10 h-10 text-[#cbd5e1] mx-auto mb-3" />
          <h3 className="text-[15px] font-bold text-[#0F1A2C]">Aún no hay negocios</h3>
          <p className="text-[13px] text-[#64748B] mt-1 mb-5">Crea tu primer negocio para empezar a construir el pipeline.</p>
          <button
            onClick={() => setForm({ open: true, mode: 'create' })}
            className="px-4 py-2.5 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-xl text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Crear tu primer negocio
          </button>
        </div>
      ) : view === 'pipeline' ? (
        <DealPipeline deals={filtered} onMoveStage={onMoveStage} onOpenDeal={setSelectedDealId} />
      ) : (
        <DealTable
          deals={filtered}
          onOpenDeal={setSelectedDealId}
          onEditDeal={(deal) => setForm({ open: true, mode: 'edit', deal })}
          onDeleteDeal={onDeleteDeal}
        />
      )}

      {/* Panel de detalle */}
      {selected && (
        <DealDetailPanel
          deal={selected}
          onClose={() => setSelectedDealId(null)}
          onMoveStage={onMoveStage}
          onAddActivity={onAddActivity}
          onEditDeal={() => setForm({ open: true, mode: 'edit', deal: selected })}
          onUpsertContact={onUpsertContact}
          onDeleteContact={onDeleteContact}
        />
      )}

      {/* Modal de negocio */}
      {form.open && (
        <DealFormModal
          mode={form.mode}
          deal={form.deal}
          onSubmit={handleSubmitForm}
          onClose={() => setForm({ open: false, mode: 'create' })}
        />
      )}
    </div>
  );
}
