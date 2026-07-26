import React, { useMemo, useState } from 'react';
import {
  Database,
  Activity as ActivityIcon,
  Search,
  Phone,
  Mail,
  CalendarDays,
  StickyNote,
  Plus,
  MessageSquarePlus,
  Building2,
  Plane,
  Store,
  ChevronRight
} from 'lucide-react';
import { ClientEntity } from '../data/iwaitData';

interface ClientsCrmViewProps {
  clients: ClientEntity[];
  onAddClient: (newClient: Omit<ClientEntity, 'id'>) => void;
  triggerToast: (msg: string) => void;
}

type ActivityKind = 'Llamada' | 'Reunión' | 'Email' | 'Nota';

interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  text: string;
  date: string;
  author: string;
}

const money = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`);

const typeIcon = (t: ClientEntity['type']) =>
  t === 'Aerolínea' ? <Plane className="w-4 h-4" /> : t === 'Aeropuerto' ? <Building2 className="w-4 h-4" /> : <Store className="w-4 h-4" />;

const statusBadge = (s: ClientEntity['status']) => {
  switch (s) {
    case 'Operativo': return 'bg-[#10CC82]/12 text-[#0f9c66]';
    case 'Contrato': return 'bg-[#0E457F]/10 text-[#0E457F]';
    case 'Negociando': return 'bg-[#F5A623]/12 text-[#b8790f]';
    default: return 'bg-[#64748B]/12 text-[#64748B]';
  }
};

const kindMeta: Record<ActivityKind, { icon: React.ReactNode; color: string }> = {
  'Llamada': { icon: <Phone className="w-3.5 h-3.5" />, color: '#0E457F' },
  'Reunión': { icon: <CalendarDays className="w-3.5 h-3.5" />, color: '#8B63F5' },
  'Email': { icon: <Mail className="w-3.5 h-3.5" />, color: '#47B6E6' },
  'Nota': { icon: <StickyNote className="w-3.5 h-3.5" />, color: '#F5A623' }
};

const SEED_ACTIVITY: Record<string, ActivityEntry[]> = {
  'cli-1': [
    { id: 'a1', kind: 'Reunión', text: 'QBR trimestral: NPS 82, renovación en marcha.', date: '20 Jun 2026', author: 'Sebastian M.' },
    { id: 'a2', kind: 'Email', text: 'Enviado reporte de ahorro de colas de mayo.', date: '12 Jun 2026', author: 'Juan Diego' }
  ],
  'cli-4': [
    { id: 'a3', kind: 'Llamada', text: 'Avianca pide piloto en MDE antes de firmar.', date: '18 Jun 2026', author: 'Sebastian M.' }
  ]
};

export default function ClientsCrmView({ clients, triggerToast }: ClientsCrmViewProps) {
  const [view, setView] = useState<'db' | 'activity'>('db');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | ClientEntity['type']>('Todos');
  const [statusFilter, setStatusFilter] = useState<'Todos' | ClientEntity['status']>('Todos');

  const [activities, setActivities] = useState<Record<string, ActivityEntry[]>>(SEED_ACTIVITY);
  const [selectedId, setSelectedId] = useState<string>(clients[0]?.id ?? '');

  // new activity form
  const [kind, setKind] = useState<ActivityKind>('Nota');
  const [text, setText] = useState('');

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (typeFilter !== 'Todos' && c.type !== typeFilter) return false;
      if (statusFilter !== 'Todos' && c.status !== statusFilter) return false;
      if (search.trim()) {
        const t = search.toLowerCase();
        if (!c.name.toLowerCase().includes(t) && !c.hub.toLowerCase().includes(t) && !c.contactPerson.toLowerCase().includes(t))
          return false;
      }
      return true;
    });
  }, [clients, typeFilter, statusFilter, search]);

  const selected = clients.find((c) => c.id === selectedId) ?? clients[0];
  const selectedActivities = selected ? activities[selected.id] ?? [] : [];

  const openActivity = (id: string) => {
    setSelectedId(id);
    setView('activity');
  };

  const addActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !text.trim()) return;
    const entry: ActivityEntry = {
      id: `act-${Date.now()}`,
      kind,
      text,
      date: new Date().toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: 'Sebastian M.'
    };
    setActivities((cur) => ({ ...cur, [selected.id]: [entry, ...(cur[selected.id] ?? [])] }));
    setText('');
    triggerToast(`Actividad registrada en ${selected.name}`);
  };

  const activityCount = (id: string) => (activities[id] ?? []).length;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-[#0F1A2C] tracking-tight">Clientes</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">Base de datos de cuentas y registro de actividad</p>
        </div>
        <div className="inline-flex bg-[#eef2f6] rounded-xl p-1 self-start">
          <button
            onClick={() => setView('db')}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              view === 'db' ? 'bg-white text-[#0F1A2C] shadow-sm' : 'text-[#64748B] hover:text-[#0F1A2C]'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Base de datos
          </button>
          <button
            onClick={() => setView('activity')}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              view === 'activity' ? 'bg-white text-[#0F1A2C] shadow-sm' : 'text-[#64748B] hover:text-[#0F1A2C]'
            }`}
          >
            <ActivityIcon className="w-3.5 h-3.5" /> Actividad
          </button>
        </div>
      </div>

      {/* -------- BASE DE DATOS -------- */}
      {view === 'db' && (
        <>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cuenta, hub o contacto..."
                className="bg-white border border-[#e6eef4] rounded-lg pl-9 pr-4 py-2 text-[13px] text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] w-[240px] shadow-sm"
              />
            </div>
            <select value={typeFilter} onChange={(e: any) => setTypeFilter(e.target.value)} className="bg-white border border-[#e6eef4] rounded-lg px-3 py-2 text-[12.5px] text-[#33475b] focus:outline-none focus:border-[#47B6E6] shadow-sm cursor-pointer">
              <option value="Todos">Todos los tipos</option>
              <option value="Aerolínea">Aerolíneas</option>
              <option value="Aeropuerto">Aeropuertos</option>
              <option value="Comercio">Comercios</option>
            </select>
            <select value={statusFilter} onChange={(e: any) => setStatusFilter(e.target.value)} className="bg-white border border-[#e6eef4] rounded-lg px-3 py-2 text-[12.5px] text-[#33475b] focus:outline-none focus:border-[#47B6E6] shadow-sm cursor-pointer">
              <option value="Todos">Todos los estados</option>
              <option value="Lead">Lead</option>
              <option value="Negociando">Negociando</option>
              <option value="Contrato">Contrato</option>
              <option value="Operativo">Operativo</option>
            </select>
            <span className="text-[12px] text-[#64748B] ml-auto">{filtered.length} cuentas</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#fbfdfe] border-b border-[#eef2f6]">
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Cuenta</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Tipo</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Hub</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Contacto</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Deal</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Estado</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide text-right">Actividad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-[#fafcfe] transition-colors group">
                      <td className="px-5 py-3.5 font-semibold text-[13.5px] text-[#0F1A2C]">{c.name}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-[12px] text-[#33475b]">
                          <span className="text-[#0E457F]">{typeIcon(c.type)}</span> {c.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[12.5px] text-[#64748B]">{c.hub}</td>
                      <td className="px-5 py-3.5 text-[12.5px] text-[#33475b]">{c.contactPerson}</td>
                      <td className="px-5 py-3.5 text-[13px] font-bold text-[#0F1A2C]">{money(c.dealValue)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${statusBadge(c.status)}`}>{c.status}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => openActivity(c.id)}
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0E457F] hover:text-[#0A365F] cursor-pointer"
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5" />
                          {activityCount(c.id) > 0 ? `${activityCount(c.id)}` : 'Registrar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-[13px] text-[#94a3b8]">No hay cuentas que coincidan.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* -------- ACTIVIDAD / CAMPAIGN -------- */}
      {view === 'activity' && (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 items-start">
          {/* Client list */}
          <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#eef2f6]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar cuenta..."
                  className="w-full bg-[#f5f9fc] border border-[#e6eef4] rounded-lg pl-9 pr-3 py-2 text-[13px] text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6]"
                />
              </div>
            </div>
            <div className="max-h-[520px] overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2.5 border-b border-[#f1f5f9] transition-colors cursor-pointer ${
                    selected?.id === c.id ? 'bg-[#0E457F]/6' : 'hover:bg-[#fafcfe]'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selected?.id === c.id ? 'bg-[#0E457F] text-white' : 'bg-[#eef2f6] text-[#0E457F]'}`}>
                    {typeIcon(c.type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-[#0F1A2C] truncate">{c.name}</div>
                    <div className="text-[11px] text-[#64748B] truncate">{c.hub}</div>
                  </div>
                  {activityCount(c.id) > 0 && (
                    <span className="text-[10px] font-bold bg-[#eef2f6] text-[#64748B] px-1.5 py-0.5 rounded-full">{activityCount(c.id)}</span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-[#cbd5e1]" />
                </button>
              ))}
            </div>
          </div>

          {/* Timeline + form */}
          {selected && (
            <div className="space-y-5">
              {/* Client header card */}
              <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0E457F] to-[#47B6E6] text-white flex items-center justify-center">{typeIcon(selected.type)}</span>
                    <div>
                      <h3 className="text-[17px] font-bold text-[#0F1A2C]">{selected.name}</h3>
                      <p className="text-[12.5px] text-[#64748B]">{selected.type} · {selected.hub}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusBadge(selected.status)}`}>{selected.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#eef2f6]">
                  <div><div className="text-[15px] font-bold text-[#0F1A2C]">{money(selected.dealValue)}</div><div className="text-[11px] text-[#64748B]">deal value</div></div>
                  <div><div className="text-[15px] font-bold text-[#0F1A2C]">{selected.contactPerson}</div><div className="text-[11px] text-[#64748B]">contacto</div></div>
                  <div><div className="text-[15px] font-bold text-[#0F1A2C]">{(selected.passengersMonthly / 1000).toFixed(0)}K</div><div className="text-[11px] text-[#64748B]">pax/mes</div></div>
                </div>
              </div>

              {/* Add activity */}
              <form onSubmit={addActivity} className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  {(['Nota', 'Llamada', 'Reunión', 'Email'] as ActivityKind[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setKind(k)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                        kind === k ? 'text-white' : 'bg-[#f1f6fa] text-[#64748B] hover:text-[#0F1A2C]'
                      }`}
                      style={kind === k ? { backgroundColor: kindMeta[k].color } : undefined}
                    >
                      {kindMeta[k].icon} {k}
                    </button>
                  ))}
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={2}
                  placeholder={`Registrar ${kind.toLowerCase()} con ${selected.name}...`}
                  className="w-full bg-[#f5f9fc] border border-[#e6eef4] rounded-lg px-3 py-2 text-[13px] text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] resize-none"
                />
                <div className="flex justify-end mt-2.5">
                  <button type="submit" className="px-3.5 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg text-[13px] font-medium flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-[15px] h-[15px]" /> Registrar
                  </button>
                </div>
              </form>

              {/* Timeline */}
              <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm p-5">
                <h4 className="text-[13px] font-bold text-[#0F1A2C] mb-4">Historial de actividad</h4>
                {selectedActivities.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-[#e6eef4] rounded-xl">
                    <StickyNote className="w-7 h-7 text-[#cbd5e1] mx-auto mb-2" />
                    <p className="text-[13px] text-[#64748B]">Sin actividad todavía.</p>
                    <p className="text-[12px] text-[#94a3b8]">Registra la primera arriba.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedActivities.map((a) => (
                      <div key={a.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${kindMeta[a.kind].color}18`, color: kindMeta[a.kind].color }}>
                            {kindMeta[a.kind].icon}
                          </span>
                          <span className="flex-1 w-px bg-[#eef2f6] mt-1"></span>
                        </div>
                        <div className="pb-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[12.5px] font-bold text-[#0F1A2C]">{a.kind}</span>
                            <span className="text-[11px] text-[#94a3b8]">· {a.date} · {a.author}</span>
                          </div>
                          <p className="text-[13px] text-[#33475b] mt-0.5 leading-relaxed">{a.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
