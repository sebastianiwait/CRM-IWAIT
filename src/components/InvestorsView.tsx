import React, { useMemo, useState } from 'react';
import {
  Download,
  Plus,
  Trash2,
  TrendingUp,
  Users,
  Target,
  Database,
  KanbanSquare,
  Search,
  X,
  Mail
} from 'lucide-react';
import { Investor, InvestorStage } from '../data/iwaitData';

interface InvestorsViewProps {
  investors: Investor[];
  onAddInvestor: (investor: Omit<Investor, 'id'>) => void;
  onDeleteInvestor: (id: string) => void;
  triggerToast: (msg: string) => void;
}

const STAGES: { key: InvestorStage; label: string; accent: string }[] = [
  { key: 'Contactado', label: 'Contactado', accent: '#64748B' },
  { key: 'Reunión', label: 'Reunión', accent: '#47B6E6' },
  { key: 'Due Diligence', label: 'Due Diligence', accent: '#8B63F5' },
  { key: 'Compromiso', label: 'Compromiso', accent: '#F5A623' },
  { key: 'Cerrado', label: 'Cerrado', accent: '#10CC82' }
];

// Active round config
const ACTIVE_ROUND = 'Semilla';
const ROUND_TARGET = 1_200_000;

const money = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
};

export default function InvestorsView({
  investors,
  onAddInvestor,
  onDeleteInvestor,
  triggerToast
}: InvestorsViewProps) {
  const [view, setView] = useState<'db' | 'pipeline'>('db');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // local stage overrides for the pipeline (parent has no updater)
  const [stageOverrides, setStageOverrides] = useState<Record<string, InvestorStage>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<InvestorStage | null>(null);

  // form
  const [name, setName] = useState('');
  const [firm, setFirm] = useState('');
  const [contact, setContact] = useState('');
  const [amount, setAmount] = useState('');
  const [round, setRound] = useState('Semilla');
  const [stage, setStage] = useState<InvestorStage>('Contactado');

  const stageOf = (inv: Investor): InvestorStage =>
    stageOverrides[inv.id] ?? inv.stage ?? (inv.status === 'Firmado' ? 'Cerrado' : 'Contactado');

  const totalRaised = investors.reduce((a, c) => a + c.committedAmount, 0);
  const roundCommitted = investors
    .filter((i) => i.round === ACTIVE_ROUND)
    .reduce((a, c) => a + c.committedAmount, 0);
  const roundPct = Math.min(100, Math.round((roundCommitted / ROUND_TARGET) * 100));
  const closedCount = investors.filter((i) => stageOf(i) === 'Cerrado').length;

  const filtered = useMemo(() => {
    if (!search.trim()) return investors;
    const t = search.toLowerCase();
    return investors.filter(
      (i) => i.name.toLowerCase().includes(t) || i.firm.toLowerCase().includes(t) || i.round.toLowerCase().includes(t)
    );
  }, [investors, search]);

  const moveStage = (id: string, s: InvestorStage) => {
    setStageOverrides((cur) => ({ ...cur, [id]: s }));
    const inv = investors.find((i) => i.id === id);
    if (inv) triggerToast(`${inv.name} → ${s}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      triggerToast('Ingresa el nombre del inversor');
      return;
    }
    onAddInvestor({
      name,
      firm: firm || 'Sin descripción',
      contact: contact || name,
      committedAmount: Number(amount) || 0,
      status: stage === 'Cerrado' ? 'Firmado' : 'Negociando',
      email: '',
      round,
      sharesPercent: 0,
      stage
    });
    setName(''); setFirm(''); setContact(''); setAmount('');
    setIsModalOpen(false);
  };

  const statusBadge = (s: string) => {
    switch (s) {
      case 'Firmado': return 'bg-[#10CC82]/12 text-[#0f9c66]';
      case 'Pendiente': return 'bg-[#F5A623]/12 text-[#b8790f]';
      default: return 'bg-[#47B6E6]/12 text-[#0E7CB0]';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-[#0F1A2C] tracking-tight">Inversionistas</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">Base de datos, pipeline de ronda y relaciones con inversores</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => triggerToast('Cap table exportado')}
            className="px-3.5 py-2 bg-white hover:bg-[#eef6fa] rounded-lg border border-[#e6eef4] text-[#33475b] hover:text-[#0F1A2C] text-[13px] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-[15px] h-[15px]" /> Exportar
          </button>
          <button
            data-tour="inv-add"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg text-[13px] flex items-center gap-1.5 transition-all font-medium cursor-pointer"
          >
            <Plus className="w-[15px] h-[15px]" /> Añadir inversor
          </button>
        </div>
      </div>

      {/* Active round progress */}
      <div data-tour="inv-round" className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm p-5 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#0E457F] to-[#47B6E6]"></div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-[18px] h-[18px] text-[#0E457F]" />
            <h3 className="text-[15px] font-bold text-[#0F1A2C]">Ronda activa — {ACTIVE_ROUND}</h3>
            <span className="text-[11px] font-bold bg-[#F5A623]/12 text-[#b8790f] px-2 py-0.5 rounded-full">En curso</span>
          </div>
          <div className="text-[13px] text-[#64748B]">
            <span className="font-bold text-[#0F1A2C] text-[16px]">{money(roundCommitted)}</span> de {money(ROUND_TARGET)} objetivo
          </div>
        </div>
        <div className="mt-4 w-full bg-[#eef2f6] h-2.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#0E457F] to-[#47B6E6] h-full rounded-full transition-all duration-500" style={{ width: `${roundPct}%` }}></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div>
            <div className="text-[18px] font-bold text-[#0F1A2C]">{roundPct}%</div>
            <div className="text-[11px] text-[#64748B]">de la ronda</div>
          </div>
          <div>
            <div className="text-[18px] font-bold text-[#0F1A2C]">{money(totalRaised)}</div>
            <div className="text-[11px] text-[#64748B]">total comprometido</div>
          </div>
          <div>
            <div className="text-[18px] font-bold text-[#10CC82]">{closedCount}</div>
            <div className="text-[11px] text-[#64748B]">cerrados</div>
          </div>
          <div>
            <div className="text-[18px] font-bold text-[#0F1A2C]">{investors.length}</div>
            <div className="text-[11px] text-[#64748B]">inversores</div>
          </div>
        </div>
      </div>

      {/* Sub tabs + search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div data-tour="inv-tabs" className="inline-flex bg-[#eef2f6] rounded-xl p-1">
          <button
            onClick={() => setView('db')}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              view === 'db' ? 'bg-white text-[#0F1A2C] shadow-sm' : 'text-[#64748B] hover:text-[#0F1A2C]'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Base de datos
          </button>
          <button
            onClick={() => setView('pipeline')}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              view === 'pipeline' ? 'bg-white text-[#0F1A2C] shadow-sm' : 'text-[#64748B] hover:text-[#0F1A2C]'
            }`}
          >
            <KanbanSquare className="w-3.5 h-3.5" /> Pipeline
          </button>
        </div>
        {view === 'db' && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar inversor, fondo o ronda..."
              className="bg-white border border-[#e6eef4] rounded-lg pl-9 pr-4 py-2 text-[13px] text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] w-[240px] shadow-sm"
            />
          </div>
        )}
      </div>

      {/* -------- BASE DE DATOS -------- */}
      {view === 'db' && (
        <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#fbfdfe] border-b border-[#eef2f6]">
                  <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Inversor</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Contacto</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Ronda</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Monto</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Equity</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Etapa</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Estado</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#fafcfe] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="text-[13.5px] font-semibold text-[#0F1A2C]">{inv.name}</div>
                      <div className="text-[11.5px] text-[#64748B]">{inv.firm}</div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#33475b]">{inv.contact ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] font-semibold bg-[#0E457F]/8 text-[#0E457F] px-2 py-0.5 rounded">{inv.round}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[13.5px] font-bold text-[#0F1A2C]">{money(inv.committedAmount)}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#33475b]">{inv.sharesPercent ? `${inv.sharesPercent}%` : '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11.5px] text-[#33475b]">{stageOf(inv)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${statusBadge(inv.status)}`}>{inv.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onDeleteInvestor(inv.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#94a3b8] hover:text-[#F05252] transition-all p-1 cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-[15px] h-[15px]" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-[13px] text-[#94a3b8]">
                      No hay inversores que coincidan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------- PIPELINE -------- */}
      {view === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
          {STAGES.map((col) => {
            const cards = investors.filter((i) => stageOf(i) === col.key);
            const sum = cards.reduce((a, c) => a + c.committedAmount, 0);
            return (
              <div
                key={col.key}
                onDragOver={(e) => { e.preventDefault(); if (overCol !== col.key) setOverCol(col.key); }}
                onDragLeave={() => setOverCol(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('text/plain') || draggingId;
                  if (id) moveStage(id, col.key);
                  setDraggingId(null); setOverCol(null);
                }}
                className={`bg-white rounded-xl border p-3 min-h-[360px] transition-all ${
                  overCol === col.key ? 'border-[#47B6E6] shadow-md' : 'border-[#e6eef4] shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.accent }}></span>
                  <span className="text-[12px] font-bold text-[#0F1A2C]">{col.label}</span>
                  <span className="ml-auto text-[10px] font-bold bg-[#eef2f6] text-[#64748B] px-2 py-0.5 rounded-full">{cards.length}</span>
                </div>
                <div className="text-[11px] text-[#64748B] px-1 mb-2 font-mono">{money(sum)}</div>

                <div className="space-y-2.5">
                  {cards.map((inv) => (
                    <div
                      key={inv.id}
                      draggable
                      onDragStart={(e) => { setDraggingId(inv.id); e.dataTransfer.setData('text/plain', inv.id); }}
                      onDragEnd={() => { setDraggingId(null); setOverCol(null); }}
                      className={`bg-white border rounded-lg p-3 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all ${
                        draggingId === inv.id ? 'opacity-40 border-dashed border-[#47B6E6]' : 'border-[#eef2f6]'
                      }`}
                    >
                      <div className="text-[13px] font-semibold text-[#0F1A2C]">{inv.name}</div>
                      <div className="text-[11px] text-[#64748B] mt-0.5">{inv.firm}</div>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-[12.5px] font-bold text-[#0E457F]">{money(inv.committedAmount)}</span>
                        <span className="text-[10.5px] font-semibold bg-[#0E457F]/8 text-[#0E457F] px-1.5 py-0.5 rounded">{inv.round}</span>
                      </div>
                      {inv.contact && (
                        <div className="flex items-center gap-1 mt-2 text-[11px] text-[#64748B]">
                          <Mail className="w-3 h-3" /> {inv.contact}
                        </div>
                      )}
                    </div>
                  ))}
                  {cards.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-[#e6eef4] rounded-lg text-[11.5px] text-[#94a3b8]">
                      Vacío
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1A2C]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#eef2f6] px-5 py-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#0F1A2C]">Añadir inversor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94a3b8] hover:text-[#0F1A2C] p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">Inversor / Fondo</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Andes Ventures" className="w-full bg-white border border-[#e6eef4] rounded-lg px-3 py-2 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-sm" required />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">Descripción</label>
                <input type="text" value={firm} onChange={(e) => setFirm(e.target.value)} placeholder="Ej. Aviation-focused VC" className="w-full bg-white border border-[#e6eef4] rounded-lg px-3 py-2 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">Contacto</label>
                  <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Nombre" className="w-full bg-white border border-[#e6eef4] rounded-lg px-2.5 py-1.5 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-[12.5px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">Monto (USD)</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="150000" className="w-full bg-white border border-[#e6eef4] rounded-lg px-2.5 py-1.5 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-[12.5px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">Ronda</label>
                  <select value={round} onChange={(e) => setRound(e.target.value)} className="w-full bg-white border border-[#e6eef4] rounded-lg px-2.5 py-1.5 text-[#0F1A2C] focus:outline-none focus:border-[#47B6E6] text-[12.5px]">
                    <option>Pre-Seed</option><option>Semilla</option><option>Serie A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">Etapa</label>
                  <select value={stage} onChange={(e) => setStage(e.target.value as InvestorStage)} className="w-full bg-white border border-[#e6eef4] rounded-lg px-2.5 py-1.5 text-[#0F1A2C] focus:outline-none focus:border-[#47B6E6] text-[12.5px]">
                    {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="border-t border-[#eef2f6] pt-4 flex justify-end gap-2.5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-white border border-[#e6eef4] text-[#64748B] hover:text-[#0F1A2C] text-sm cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg font-medium text-sm cursor-pointer">Añadir</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
