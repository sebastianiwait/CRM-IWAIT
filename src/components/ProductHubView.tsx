import React, { useMemo, useState } from 'react';
import {
  Plane,
  Building2,
  ChevronRight,
  ArrowLeft,
  ListTree,
  Activity,
  Plus,
  X,
  Flame,
  CheckCircle2,
  Search
} from 'lucide-react';
import {
  PRODUCTS,
  INITIAL_BACKLOG,
  INITIAL_SPRINTS,
  BACKLOG_STATUSES,
  TEAM_MEMBERS,
  BacklogItem,
  BacklogStatus,
  BacklogType,
  BacklogPriority,
  ProductKey
} from '../data/productData';

interface ProductHubViewProps {
  triggerToast: (msg: string) => void;
}

const typeStyle = (t: BacklogType) => {
  switch (t) {
    case 'Historia': return 'bg-[#0E457F]/10 text-[#0E457F]';
    case 'Bug': return 'bg-[#F05252]/12 text-[#F05252]';
    case 'Spike': return 'bg-[#47B6E6]/15 text-[#0E7CB0]';
    default: return 'bg-[#64748B]/12 text-[#64748B]';
  }
};

const priorityStyle = (p: BacklogPriority) => {
  switch (p) {
    case 'Crítica': return 'text-[#F05252]';
    case 'Alta': return 'text-[#F5A623]';
    case 'Media': return 'text-[#0E457F]';
    default: return 'text-[#94a3b8]';
  }
};

const statusStyle = (s: BacklogStatus) => {
  switch (s) {
    case 'Hecho': return 'bg-[#10CC82]/12 text-[#0f9c66]';
    case 'En progreso': return 'bg-[#0E457F]/10 text-[#0E457F]';
    case 'Review': return 'bg-[#8B63F5]/12 text-[#6d43d6]';
    case 'Por hacer': return 'bg-[#F5A623]/12 text-[#b8790f]';
    default: return 'bg-[#64748B]/10 text-[#64748B]';
  }
};

export default function ProductHubView({ triggerToast }: ProductHubViewProps) {
  const [selected, setSelected] = useState<ProductKey | null>(null);
  const [tab, setTab] = useState<'backlog' | 'progreso'>('backlog');
  const [items, setItems] = useState<BacklogItem[]>(INITIAL_BACKLOG);
  const [sprints] = useState(INITIAL_SPRINTS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New item form
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [epic, setEpic] = useState('');
  const [type, setType] = useState<BacklogType>('Historia');
  const [priority, setPriority] = useState<BacklogPriority>('Media');
  const [points, setPoints] = useState(5);
  const [assignee, setAssignee] = useState('Sin asignar');
  const [sprintId, setSprintId] = useState<string>('');

  const productItems = useMemo(
    () => items.filter((i) => i.product === selected),
    [items, selected]
  );
  const productSprints = useMemo(
    () => sprints.filter((s) => s.product === selected),
    [sprints, selected]
  );

  const filteredItems = useMemo(() => {
    if (!search.trim()) return productItems;
    const t = search.toLowerCase();
    return productItems.filter(
      (i) =>
        i.title.toLowerCase().includes(t) ||
        i.id.toLowerCase().includes(t) ||
        i.epic.toLowerCase().includes(t)
    );
  }, [productItems, search]);

  const epics = useMemo(() => {
    const map = new Map<string, BacklogItem[]>();
    filteredItems.forEach((i) => {
      if (!map.has(i.epic)) map.set(i.epic, []);
      map.get(i.epic)!.push(i);
    });
    return Array.from(map.entries());
  }, [filteredItems]);

  const updateStatus = (id: string, status: BacklogStatus) => {
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, status } : i)));
    triggerToast(`${id} → ${status}`);
  };

  const sprintStats = (sid: string) => {
    const its = productItems.filter((i) => i.sprintId === sid);
    const done = its.filter((i) => i.status === 'Hecho');
    const total = its.reduce((s, i) => s + i.points, 0);
    const donePts = done.reduce((s, i) => s + i.points, 0);
    return {
      items: its,
      done,
      total,
      donePts,
      pct: total > 0 ? Math.round((donePts / total) * 100) : 0
    };
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selected) return;
    const prefix = selected === 'aerolineas' ? 'AL' : 'AP';
    const newItem: BacklogItem = {
      id: `${prefix}-${Math.floor(Math.random() * 900 + 100)}`,
      product: selected,
      epic: epic.trim() || 'Sin épica',
      title,
      description: desc || 'Sin detalles.',
      type,
      priority,
      points,
      status: sprintId ? 'Por hacer' : 'Backlog',
      sprintId: sprintId || null,
      assignee
    };
    setItems((cur) => [newItem, ...cur]);
    triggerToast(`${newItem.id} añadido al backlog`);
    setTitle('');
    setDesc('');
    setEpic('');
    setIsModalOpen(false);
  };

  /* ---------------- Product picker ---------------- */
  if (!selected) {
    return (
      <div className="animate-fade-in space-y-7">
        <div>
          <h2 className="text-[22px] font-bold text-[#0F1A2C] tracking-tight">Producto</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">Elige un producto para ver su backlog y su progreso</p>
        </div>

        <div data-tour="prod-cards" className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PRODUCTS.map((p) => {
            const its = items.filter((i) => i.product === p.key);
            const done = its.filter((i) => i.status === 'Hecho').length;
            const activeSprint = sprints.find((s) => s.product === p.key && s.status === 'Activo');
            return (
              <button
                key={p.key}
                onClick={() => { setSelected(p.key); setTab('backlog'); }}
                className="group text-left bg-white rounded-2xl border border-[#e6eef4] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-6 relative overflow-hidden cursor-pointer"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[5px]" style={{ backgroundColor: p.accent }}></div>
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${p.accent}18`, color: p.accent }}
                  >
                    {p.key === 'aerolineas' ? <Plane className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#94a3b8] group-hover:text-[#0E457F] group-hover:translate-x-1 transition-all" />
                </div>
                <div className="text-[19px] font-bold text-[#0F1A2C] mt-4 tracking-tight">{p.name}</div>
                <p className="text-[13px] text-[#64748B] mt-1 leading-relaxed">{p.tagline}</p>

                <div className="flex items-center gap-5 mt-5 pt-4 border-t border-[#eef2f6]">
                  <div>
                    <div className="text-[18px] font-bold text-[#0F1A2C]">{its.length}</div>
                    <div className="text-[11px] text-[#64748B]">ítems backlog</div>
                  </div>
                  <div>
                    <div className="text-[18px] font-bold text-[#10CC82]">{done}</div>
                    <div className="text-[11px] text-[#64748B]">completados</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-[12px] font-semibold text-[#0E457F]">{activeSprint?.name ?? '—'}</div>
                    <div className="text-[11px] text-[#64748B]">sprint activo</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------------- Product detail ---------------- */
  const product = PRODUCTS.find((p) => p.key === selected)!;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelected(null)}
            className="w-9 h-9 rounded-lg border border-[#e6eef4] bg-white hover:bg-[#f1f6fa] flex items-center justify-center text-[#64748B] hover:text-[#0F1A2C] transition-colors cursor-pointer"
            title="Volver a productos"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${product.accent}18`, color: product.accent }}
          >
            {product.key === 'aerolineas' ? <Plane className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[#0F1A2C] tracking-tight">{product.name}</h2>
            <p className="text-[12.5px] text-[#64748B]">{product.tagline}</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg text-[13px] flex items-center gap-1.5 transition-all font-medium cursor-pointer self-start"
        >
          <Plus className="w-[15px] h-[15px]" /> Nuevo ítem
        </button>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="inline-flex bg-[#eef2f6] rounded-xl p-1">
          <button
            onClick={() => setTab('backlog')}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              tab === 'backlog' ? 'bg-white text-[#0F1A2C] shadow-sm' : 'text-[#64748B] hover:text-[#0F1A2C]'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" /> Backlog
          </button>
          <button
            onClick={() => setTab('progreso')}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              tab === 'progreso' ? 'bg-white text-[#0F1A2C] shadow-sm' : 'text-[#64748B] hover:text-[#0F1A2C]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Progreso
          </button>
        </div>

        {tab === 'backlog' && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ítem, épica o ID..."
              className="bg-white border border-[#e6eef4] rounded-lg pl-9 pr-4 py-2 text-[13px] text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] w-[220px] shadow-sm"
            />
          </div>
        )}
      </div>

      {/* -------- BACKLOG -------- */}
      {tab === 'backlog' && (
        <div className="space-y-5">
          {epics.map(([epicName, epicItems]) => (
            <div key={epicName} className="bg-white rounded-xl border border-[#e6eef4] shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-[#eef2f6] flex items-center justify-between bg-[#fbfdfe]">
                <div className="flex items-center gap-2">
                  <ListTree className="w-4 h-4 text-[#0E457F]" />
                  <h3 className="text-[13.5px] font-bold text-[#0F1A2C]">{epicName}</h3>
                  <span className="text-[11px] text-[#64748B] bg-[#eef2f6] px-2 py-0.5 rounded-full font-semibold">
                    {epicItems.length}
                  </span>
                </div>
                <span className="text-[11.5px] text-[#64748B] font-mono">
                  {epicItems.reduce((s, i) => s + i.points, 0)} pts
                </span>
              </div>

              <div className="divide-y divide-[#f1f5f9]">
                {epicItems.map((item) => (
                  <div key={item.id} className="px-5 py-3 hover:bg-[#fafcfe] transition-colors flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-[11.5px] text-[#94a3b8] w-[62px] flex-shrink-0">{item.id}</span>

                    <div className="min-w-[220px] flex-1">
                      <div className="text-[13.5px] font-medium text-[#0F1A2C]">{item.title}</div>
                      <div className="text-[11.5px] text-[#64748B] mt-0.5">{item.description}</div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeStyle(item.type)}`}>
                      {item.type}
                    </span>

                    <span className={`text-[11px] font-bold ${priorityStyle(item.priority)} w-[52px]`}>
                      {item.priority}
                    </span>

                    <span className="text-[11px] font-mono font-bold text-[#0E457F] bg-[#0E457F]/8 px-1.5 py-0.5 rounded">
                      {item.points}p
                    </span>

                    <span className="text-[11.5px] text-[#64748B] w-[86px] truncate">{item.assignee}</span>

                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value as BacklogStatus)}
                      className={`text-[10.5px] font-bold px-2 py-1 rounded border-none cursor-pointer focus:outline-none ${statusStyle(item.status)}`}
                    >
                      {BACKLOG_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {epics.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-[#dbe9f0] py-14 text-center">
              <ListTree className="w-8 h-8 text-[#cbd5e1] mx-auto mb-2" />
              <p className="text-[13px] text-[#64748B]">No hay ítems que coincidan.</p>
            </div>
          )}
        </div>
      )}

      {/* -------- PROGRESO -------- */}
      {tab === 'progreso' && (
        <div className="space-y-5">
          {productSprints.map((sprint) => {
            const st = sprintStats(sprint.id);
            const isActive = sprint.status === 'Activo';
            return (
              <div
                key={sprint.id}
                className="bg-white rounded-xl border border-[#e6eef4] shadow-sm overflow-hidden relative"
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#F5A623]"></div>}
                <div className="px-5 py-4 border-b border-[#eef2f6] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <Flame className="w-4 h-4 text-[#F5A623]" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[#94a3b8]" />
                    )}
                    <h3 className="text-[14px] font-bold text-[#0F1A2C]">{sprint.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-[#F5A623]/15 text-[#b8790f]' : 'bg-[#64748B]/10 text-[#64748B]'
                      }`}
                    >
                      {sprint.status}
                    </span>
                    <span className="text-[11px] text-[#94a3b8] font-mono ml-1">{sprint.range}</span>
                  </div>
                  <span className="text-[12px] font-bold text-[#0E457F]">{st.pct}% completado</span>
                </div>

                <div className="px-5 py-4 space-y-4">
                  <div>
                    <p className="text-[12.5px] text-[#64748B] mb-2">
                      <span className="font-semibold text-[#33475b]">Objetivo:</span> {sprint.goal}
                    </p>
                    <div className="w-full bg-[#eef2f6] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#0E457F] to-[#47B6E6] h-full rounded-full transition-all duration-500"
                        style={{ width: `${st.pct}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#64748B] mt-1.5">
                      <span>{st.done.length} de {st.items.length} ítems</span>
                      <span className="font-mono">{st.donePts}/{st.total} pts</span>
                    </div>
                  </div>

                  {/* Items in this sprint — connected to backlog */}
                  <div className="space-y-1.5">
                    {st.items.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#fafcfe] border border-[#f1f5f9]"
                      >
                        <span className="font-mono text-[11px] text-[#94a3b8] w-[58px]">{i.id}</span>
                        <span
                          className={`text-[13px] flex-1 ${
                            i.status === 'Hecho' ? 'text-[#94a3b8] line-through' : 'text-[#0F1A2C]'
                          }`}
                        >
                          {i.title}
                        </span>
                        <span className="text-[11px] font-mono text-[#64748B]">{i.points}p</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusStyle(i.status)}`}>
                          {i.status}
                        </span>
                      </div>
                    ))}
                    {st.items.length === 0 && (
                      <p className="text-[12px] text-[#94a3b8] italic py-2">Sin ítems asignados a este sprint.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Unassigned backlog reminder */}
          {(() => {
            const loose = productItems.filter((i) => !i.sprintId);
            if (loose.length === 0) return null;
            return (
              <div className="bg-white rounded-xl border border-dashed border-[#dbe9f0] px-5 py-4">
                <h3 className="text-[13px] font-bold text-[#0F1A2C] mb-1">Sin sprint asignado</h3>
                <p className="text-[12px] text-[#64748B] mb-3">
                  {loose.length} ítems del backlog aún no están planificados.
                </p>
                <div className="flex flex-wrap gap-2">
                  {loose.map((i) => (
                    <span key={i.id} className="text-[11.5px] bg-[#f1f6fa] text-[#33475b] px-2.5 py-1 rounded-lg">
                      <span className="font-mono text-[#94a3b8] mr-1">{i.id}</span>
                      {i.title}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* New item modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1A2C]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
            <div className="border-b border-[#eef2f6] px-5 py-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#0F1A2C]">Nuevo ítem — {product.name}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94a3b8] hover:text-[#0F1A2C] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Integrar webhook de incidencias"
                  className="w-full bg-white border border-[#e6eef4] rounded-lg px-3 py-2 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">Descripción</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={2}
                  placeholder="Detalle técnico o criterio de aceptación"
                  className="w-full bg-white border border-[#e6eef4] rounded-lg px-3 py-2 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">Épica</label>
                  <input
                    type="text"
                    value={epic}
                    onChange={(e) => setEpic(e.target.value)}
                    placeholder="Ej. Integraciones"
                    className="w-full bg-white border border-[#e6eef4] rounded-lg px-2.5 py-1.5 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-[12.5px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">Tipo</label>
                  <select value={type} onChange={(e: any) => setType(e.target.value)} className="w-full bg-white border border-[#e6eef4] rounded-lg px-2.5 py-1.5 text-[#0F1A2C] focus:outline-none focus:border-[#47B6E6] text-[12.5px]">
                    <option>Historia</option><option>Bug</option><option>Spike</option><option>Tarea</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">Prioridad</label>
                  <select value={priority} onChange={(e: any) => setPriority(e.target.value)} className="w-full bg-white border border-[#e6eef4] rounded-lg px-2.5 py-1.5 text-[#0F1A2C] focus:outline-none focus:border-[#47B6E6] text-[12.5px]">
                    <option>Crítica</option><option>Alta</option><option>Media</option><option>Baja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">Story points</label>
                  <select value={points} onChange={(e: any) => setPoints(Number(e.target.value))} className="w-full bg-white border border-[#e6eef4] rounded-lg px-2.5 py-1.5 text-[#0F1A2C] focus:outline-none focus:border-[#47B6E6] text-[12.5px]">
                    {[1, 2, 3, 5, 8, 13].map((p) => <option key={p} value={p}>{p} pts</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">Responsable</label>
                  <select value={assignee} onChange={(e: any) => setAssignee(e.target.value)} className="w-full bg-white border border-[#e6eef4] rounded-lg px-2.5 py-1.5 text-[#0F1A2C] focus:outline-none focus:border-[#47B6E6] text-[12.5px]">
                    {TEAM_MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">Sprint</label>
                  <select value={sprintId} onChange={(e: any) => setSprintId(e.target.value)} className="w-full bg-white border border-[#e6eef4] rounded-lg px-2.5 py-1.5 text-[#0F1A2C] focus:outline-none focus:border-[#47B6E6] text-[12.5px]">
                    <option value="">Sin sprint (backlog)</option>
                    {productSprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="border-t border-[#eef2f6] pt-4 flex justify-end gap-2.5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-white border border-[#e6eef4] text-[#64748B] hover:text-[#0F1A2C] text-sm cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg font-medium text-sm cursor-pointer">Añadir al backlog</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
