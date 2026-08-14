import React, { useEffect, useMemo, useState } from 'react';
import {
  Plane,
  Building2,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  ListTree,
  Activity,
  Plus,
  Flame,
  CheckCircle2,
  Search,
  MessageSquare,
  Pencil,
  Trash2,
  FolderPlus,
  Check,
  X,
  ChevronsDownUp,
  ChevronsUpDown
} from 'lucide-react';
import {
  PRODUCTS,
  INITIAL_EPICS,
  PRODUCT_SEED_VERSION,
  BACKLOG_STATUSES,
  BacklogItem,
  BacklogStatus,
  BacklogType,
  BacklogPriority,
  ProductKey,
  Sprint,
  nextItemId,
  epicsOf
} from '../data/productData';
import SprintMetrics from './SprintMetrics';
import BacklogItemPanel from './BacklogItemPanel';
import BacklogItemModal from './product/BacklogItemModal';
import SprintModal from './product/SprintModal';
import { usePersistedState } from '../hooks/usePersistedState';

interface ProductHubViewProps {
  triggerToast: (msg: string) => void;
  /** El backlog vive en App para que la búsqueda global pueda leerlo */
  items: BacklogItem[];
  setItems: React.Dispatch<React.SetStateAction<BacklogItem[]>>;
  /** Los sprints también, porque alimentan las alertas del centro de notificaciones */
  sprints: Sprint[];
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>;
  /** id de ítem a enfocar desde la búsqueda global */
  focusItemId?: string | null;
  onFocusHandled?: () => void;
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

const UNSORTED_EPIC = 'Sin épica';

export default function ProductHubView({
  triggerToast,
  items,
  setItems,
  sprints,
  setSprints,
  focusItemId,
  onFocusHandled
}: ProductHubViewProps) {
  const [selected, setSelected] = useState<ProductKey | null>(null);
  const [tab, setTab] = useState<'backlog' | 'progreso'>('backlog');
  const [search, setSearch] = useState('');
  // Se guarda el id, no el objeto: así el panel refleja los comentarios nuevos
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  /* Épicas: registro propio para poder crear una vacía y fijar el orden del roadmap */
  const [epicRegistry, setEpicRegistry] = usePersistedState<Record<ProductKey, string[]>>(
    'epics',
    INITIAL_EPICS,
    PRODUCT_SEED_VERSION
  );
  /** Épicas plegadas, con clave "producto::épica" para no mezclar productos */
  const [collapsedEpics, setCollapsedEpics] = usePersistedState<string[]>('epicsCollapsed', []);

  /* Modales de alta/edición */
  const [itemModal, setItemModal] = useState<{ item: BacklogItem | null; epic?: string } | null>(null);
  const [sprintModal, setSprintModal] = useState<{ sprint: Sprint | null } | null>(null);

  /* Edición del nombre de una épica, en línea sobre su cabecera */
  const [editingEpic, setEditingEpic] = useState<string | null>(null);
  const [epicDraft, setEpicDraft] = useState('');
  const [newEpicOpen, setNewEpicOpen] = useState(false);
  const [newEpicName, setNewEpicName] = useState('');

  const epicKey = (name: string) => `${selected}::${name}`;
  const isCollapsed = (name: string) => collapsedEpics.includes(epicKey(name));

  const toggleEpic = (name: string) => {
    const k = epicKey(name);
    setCollapsedEpics((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));
  };

  const productItems = useMemo(
    () => items.filter((i) => i.product === selected),
    [items, selected]
  );
  const productSprints = useMemo(
    () => sprints.filter((s) => s.product === selected),
    [sprints, selected]
  );

  // Al llegar desde la búsqueda global, abre el producto del ítem, lo resalta
  // y despliega su épica por si estaba plegada.
  useEffect(() => {
    if (!focusItemId) return;
    const item = items.find((i) => i.id === focusItemId);
    if (item) {
      setSelected(item.product);
      setTab('backlog');
      setSearch(item.id);
      setCollapsedEpics((cur) => cur.filter((k) => k !== `${item.product}::${item.epic}`));
    }
    onFocusHandled?.();
  }, [focusItemId, items, onFocusHandled, setCollapsedEpics]);

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

  /** Todas las épicas del producto, incluidas las vacías; al buscar solo las que tienen resultados */
  const epics = useMemo<[string, BacklogItem[]][]>(() => {
    if (!selected) return [];
    const known = epicsOf(epicRegistry, items, selected);
    const grouped = new Map<string, BacklogItem[]>(known.map((e) => [e, []]));
    filteredItems.forEach((i) => {
      if (!grouped.has(i.epic)) grouped.set(i.epic, []);
      grouped.get(i.epic)!.push(i);
    });
    const entries = Array.from(grouped.entries());
    return search.trim() ? entries.filter(([, its]) => its.length > 0) : entries;
  }, [epicRegistry, items, filteredItems, selected, search]);

  const epicNames = useMemo(
    () => (selected ? epicsOf(epicRegistry, items, selected) : []),
    [epicRegistry, items, selected]
  );

  /* ------------------------------ Ítems ------------------------------ */

  const updateStatus = (id: string, status: BacklogStatus) => {
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, status } : i)));
    triggerToast(`${id} → ${status}`);
  };

  const saveItem = (data: Omit<BacklogItem, 'id' | 'product' | 'comments'>) => {
    if (!selected) return;
    const editing = itemModal?.item ?? null;

    if (editing) {
      setItems((cur) => cur.map((i) => (i.id === editing.id ? { ...i, ...data } : i)));
      triggerToast(`${editing.id} actualizado`);
    } else {
      const newItem: BacklogItem = { id: nextItemId(items, selected), product: selected, ...data };
      setItems((cur) => [newItem, ...cur]);
      triggerToast(`${newItem.id} añadido al backlog`);
    }

    // Una épica escrita a mano en el formulario pasa a formar parte del registro
    if (data.epic && !epicNames.includes(data.epic)) registerEpic(data.epic);
    setItemModal(null);
  };

  const deleteItem = (item: BacklogItem) => {
    if (!window.confirm(`¿Eliminar ${item.id} — "${item.title}"? No se puede deshacer.`)) return;
    setItems((cur) => cur.filter((i) => i.id !== item.id));
    setItemModal(null);
    setOpenItemId(null);
    triggerToast(`${item.id} eliminado`);
  };

  const openItem = openItemId ? items.find((i) => i.id === openItemId) ?? null : null;

  const addComment = (itemId: string, text: string, author: string) => {
    const comment = {
      id: `cm-${Math.random().toString(36).slice(2, 10)}`,
      author,
      text,
      date: new Date().toISOString().slice(0, 10)
    };
    setItems((cur) =>
      cur.map((i) => (i.id === itemId ? { ...i, comments: [...(i.comments ?? []), comment] } : i))
    );
    triggerToast(`Comentario añadido a ${itemId}`);
  };

  const deleteComment = (itemId: string, commentId: string) => {
    setItems((cur) =>
      cur.map((i) =>
        i.id === itemId ? { ...i, comments: (i.comments ?? []).filter((c) => c.id !== commentId) } : i
      )
    );
  };

  /* ------------------------------ Épicas ----------------------------- */

  const registerEpic = (name: string) => {
    if (!selected) return;
    setEpicRegistry((cur) => {
      const list = cur[selected] ?? [];
      if (list.includes(name)) return cur;
      return { ...cur, [selected]: [...list, name] };
    });
  };

  const createEpic = () => {
    const name = newEpicName.trim();
    if (!name || !selected) return;
    if (epicNames.includes(name)) {
      triggerToast(`La épica "${name}" ya existe`);
    } else {
      registerEpic(name);
      triggerToast(`Épica "${name}" creada`);
    }
    setNewEpicName('');
    setNewEpicOpen(false);
  };

  const renameEpic = (from: string, to: string) => {
    const name = to.trim();
    setEditingEpic(null);
    if (!selected || !name || name === from) return;
    setEpicRegistry((cur) => {
      const list = (cur[selected] ?? []).map((e) => (e === from ? name : e));
      // Si venía solo de los ítems, no estaba registrada: la añadimos ya renombrada
      return { ...cur, [selected]: list.includes(name) ? list : [...list, name] };
    });
    setItems((cur) =>
      cur.map((i) => (i.product === selected && i.epic === from ? { ...i, epic: name } : i))
    );
    setCollapsedEpics((cur) =>
      cur.map((k) => (k === `${selected}::${from}` ? `${selected}::${name}` : k))
    );
    triggerToast(`Épica renombrada a "${name}"`);
  };

  const deleteEpic = (name: string, count: number) => {
    if (!selected) return;
    const msg =
      count > 0
        ? `¿Eliminar la épica "${name}"? Sus ${count} ítems no se borran: pasan a "${UNSORTED_EPIC}".`
        : `¿Eliminar la épica vacía "${name}"?`;
    if (!window.confirm(msg)) return;

    setEpicRegistry((cur) => ({ ...cur, [selected]: (cur[selected] ?? []).filter((e) => e !== name) }));
    if (count > 0) {
      setItems((cur) =>
        cur.map((i) => (i.product === selected && i.epic === name ? { ...i, epic: UNSORTED_EPIC } : i))
      );
    }
    setCollapsedEpics((cur) => cur.filter((k) => k !== `${selected}::${name}`));
    triggerToast(`Épica "${name}" eliminada`);
  };

  /* ------------------------------ Sprints ---------------------------- */

  const saveSprint = (data: Omit<Sprint, 'id' | 'product'>) => {
    if (!selected) return;
    const editing = sprintModal?.sprint ?? null;

    if (editing) {
      setSprints((cur) => cur.map((s) => (s.id === editing.id ? { ...s, ...data } : s)));
      triggerToast(`${data.name} actualizado`);
    } else {
      const sprint: Sprint = {
        id: `sp-${selected.slice(0, 2)}-${Date.now().toString(36)}`,
        product: selected,
        ...data
      };
      setSprints((cur) => [...cur, sprint]);
      triggerToast(`Sprint "${data.name}" creado`);
    }
    setSprintModal(null);
  };

  const deleteSprint = (sprint: Sprint) => {
    const affected = items.filter((i) => i.sprintId === sprint.id).length;
    const msg =
      affected > 0
        ? `¿Eliminar ${sprint.name}? Sus ${affected} ítems vuelven al backlog sin sprint.`
        : `¿Eliminar ${sprint.name}?`;
    if (!window.confirm(msg)) return;

    setSprints((cur) => cur.filter((s) => s.id !== sprint.id));
    setItems((cur) => cur.map((i) => (i.sprintId === sprint.id ? { ...i, sprintId: null } : i)));
    setSprintModal(null);
    triggerToast(`${sprint.name} eliminado`);
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
  const allCollapsed = epics.length > 0 && epics.every(([name]) => isCollapsed(name));

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

        <div className="flex items-center gap-2 self-start">
          {tab === 'backlog' ? (
            <>
              <button
                onClick={() => { setNewEpicOpen(true); setNewEpicName(''); }}
                className="px-3.5 py-2 bg-white border border-[#e6eef4] hover:border-[#47B6E6] text-[#33475b] rounded-xl text-[13px] flex items-center gap-1.5 transition-all font-medium cursor-pointer"
              >
                <FolderPlus className="w-[15px] h-[15px]" /> Nueva épica
              </button>
              <button
                onClick={() => setItemModal({ item: null })}
                className="px-3.5 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-xl text-[13px] flex items-center gap-1.5 transition-all font-medium cursor-pointer"
              >
                <Plus className="w-[15px] h-[15px]" /> Nuevo ítem
              </button>
            </>
          ) : (
            <button
              onClick={() => setSprintModal({ sprint: null })}
              className="px-3.5 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-xl text-[13px] flex items-center gap-1.5 transition-all font-medium cursor-pointer"
            >
              <Plus className="w-[15px] h-[15px]" /> Nuevo sprint
            </button>
          )}
        </div>
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
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCollapsedEpics((cur) => {
                  const others = cur.filter((k) => !k.startsWith(`${selected}::`));
                  return allCollapsed ? others : [...others, ...epics.map(([n]) => epicKey(n))];
                })
              }
              className="px-3 py-2 bg-white border border-[#e6eef4] hover:border-[#47B6E6] text-[#64748B] hover:text-[#0F1A2C] rounded-xl text-[12.5px] flex items-center gap-1.5 transition-all cursor-pointer"
              title={allCollapsed ? 'Desplegar todas las épicas' : 'Plegar todas las épicas'}
            >
              {allCollapsed ? <ChevronsUpDown className="w-[14px] h-[14px]" /> : <ChevronsDownUp className="w-[14px] h-[14px]" />}
              {allCollapsed ? 'Desplegar' : 'Plegar'}
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar ítem, épica o ID..."
                className="bg-[#f4fafc] border border-[#dceaf2] rounded-xl pl-9 pr-4 py-2 text-[13px] text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] w-[220px] shadow-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* -------- BACKLOG -------- */}
      {tab === 'backlog' && (
        <div className="space-y-5">
          {/* Alta de épica en línea */}
          {newEpicOpen && (
            <div className="bg-white rounded-2xl border border-dashed border-[#47B6E6] shadow-sm px-5 py-4 flex items-center gap-2.5">
              <FolderPlus className="w-4 h-4 text-[#0E457F] flex-shrink-0" />
              <input
                autoFocus
                value={newEpicName}
                onChange={(e) => setNewEpicName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') createEpic();
                  if (e.key === 'Escape') setNewEpicOpen(false);
                }}
                placeholder="Nombre de la épica — Enter para crear"
                className="flex-1 bg-[#f4fafc] border border-[#dceaf2] rounded-xl px-3 py-1.5 text-[13px] text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6]"
              />
              <button
                onClick={createEpic}
                className="px-3 py-1.5 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg text-[12.5px] font-medium cursor-pointer"
              >
                Crear
              </button>
              <button
                onClick={() => setNewEpicOpen(false)}
                className="text-[#94a3b8] hover:text-[#0F1A2C] p-1 cursor-pointer"
                aria-label="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {epics.map(([epicName, epicItems]) => {
            const collapsed = isCollapsed(epicName);
            const isEditing = editingEpic === epicName;
            return (
              <div key={epicName} className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-[#eef2f6] flex items-center justify-between gap-3 bg-[#fbfdfe] group/epic">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <button
                      onClick={() => toggleEpic(epicName)}
                      className="text-[#64748B] hover:text-[#0E457F] transition-colors cursor-pointer flex-shrink-0"
                      title={collapsed ? 'Desplegar' : 'Plegar'}
                      aria-expanded={!collapsed}
                    >
                      {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isEditing ? (
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <input
                          autoFocus
                          value={epicDraft}
                          onChange={(e) => setEpicDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') renameEpic(epicName, epicDraft);
                            if (e.key === 'Escape') setEditingEpic(null);
                          }}
                          className="flex-1 min-w-0 bg-white border border-[#47B6E6] rounded-lg px-2 py-1 text-[13.5px] font-semibold text-[#0F1A2C] focus:outline-none"
                        />
                        <button
                          onClick={() => renameEpic(epicName, epicDraft)}
                          className="text-[#10CC82] hover:text-[#0f9c66] p-1 cursor-pointer"
                          title="Guardar"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingEpic(null)}
                          className="text-[#94a3b8] hover:text-[#0F1A2C] p-1 cursor-pointer"
                          title="Cancelar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleEpic(epicName)}
                          className="flex items-center gap-2 min-w-0 cursor-pointer"
                        >
                          <ListTree className="w-4 h-4 text-[#0E457F] flex-shrink-0" />
                          <h3 className="text-[13.5px] font-bold text-[#0F1A2C] truncate">{epicName}</h3>
                          <span className="text-[11px] text-[#64748B] bg-[#eef2f6] px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                            {epicItems.length}
                          </span>
                        </button>

                        <div className="flex items-center gap-0.5 md:opacity-0 md:group-hover/epic:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setEditingEpic(epicName); setEpicDraft(epicName); }}
                            className="text-[#94a3b8] hover:text-[#0E457F] p-1 cursor-pointer"
                            title="Renombrar épica"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setItemModal({ item: null, epic: epicName })}
                            className="text-[#94a3b8] hover:text-[#0E457F] p-1 cursor-pointer"
                            title="Añadir ítem a esta épica"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteEpic(epicName, epicItems.length)}
                            className="text-[#94a3b8] hover:text-[#F05252] p-1 cursor-pointer"
                            title="Eliminar épica"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <span className="text-[11.5px] text-[#64748B] font-mono flex-shrink-0">
                    {epicItems.reduce((s, i) => s + i.points, 0)} pts
                  </span>
                </div>

                {!collapsed && (
                  <div className="divide-y divide-[#f1f5f9]">
                    {epicItems.map((item) => (
                      <div key={item.id} className="px-5 py-3 hover:bg-[#fafcfe] transition-colors flex items-center gap-3 flex-wrap group/item">
                        <span className="font-mono text-[11.5px] text-[#94a3b8] w-[62px] flex-shrink-0">{item.id}</span>

                        <button
                          onClick={() => setOpenItemId(item.id)}
                          className="min-w-[220px] flex-1 text-left cursor-pointer group"
                          title="Ver detalle y comentarios"
                        >
                          <div className="text-[13.5px] font-medium text-[#0F1A2C] group-hover:text-[#0E457F] transition-colors flex items-center gap-2">
                            {item.title}
                            {(item.comments?.length ?? 0) > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#64748B] bg-[#eef2f6] px-1.5 py-0.5 rounded-full">
                                <MessageSquare className="w-3 h-3" />
                                {item.comments!.length}
                              </span>
                            )}
                          </div>
                          <div className="text-[11.5px] text-[#64748B] mt-0.5">{item.description}</div>
                        </button>

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

                        <button
                          onClick={() => setItemModal({ item })}
                          className="text-[#94a3b8] hover:text-[#0E457F] p-1 cursor-pointer md:opacity-0 md:group-hover/item:opacity-100 transition-opacity"
                          title="Editar ítem"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {epicItems.length === 0 && (
                      <div className="px-5 py-6 text-center">
                        <p className="text-[12.5px] text-[#94a3b8] italic">
                          Épica vacía.{' '}
                          <button
                            onClick={() => setItemModal({ item: null, epic: epicName })}
                            className="text-[#0E457F] font-medium not-italic hover:underline cursor-pointer"
                          >
                            Añade el primer ítem
                          </button>
                          .
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {epics.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-[#dbe9f0] py-14 text-center">
              <ListTree className="w-8 h-8 text-[#cbd5e1] mx-auto mb-2" />
              <p className="text-[13px] text-[#64748B]">
                {search.trim() ? 'No hay ítems que coincidan.' : 'Aún no hay épicas en este producto.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* -------- PROGRESO -------- */}
      {tab === 'progreso' && (
        <div className="space-y-5">
          {/* Métricas del sprint activo */}
          {(() => {
            const active = productSprints.find((s) => s.status === 'Activo');
            if (!active) return null;
            const closed = productSprints
              .filter((s) => s.status === 'Cerrado')
              .map((s) => ({ sprint: s, items: productItems.filter((i) => i.sprintId === s.id) }));
            return (
              <SprintMetrics
                sprint={active}
                items={productItems.filter((i) => i.sprintId === active.id)}
                history={closed}
              />
            );
          })()}

          {productSprints.map((sprint) => {
            const st = sprintStats(sprint.id);
            const isActive = sprint.status === 'Activo';
            return (
              <div
                key={sprint.id}
                className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm overflow-hidden relative group/sprint"
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
                    <button
                      onClick={() => setSprintModal({ sprint })}
                      className="text-[#94a3b8] hover:text-[#0E457F] p-1 cursor-pointer md:opacity-0 md:group-hover/sprint:opacity-100 transition-opacity"
                      title="Editar sprint"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
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
                        onClick={() => setOpenItemId(i.id)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#fafcfe] border border-[#f1f5f9] hover:border-[#dceaf2] cursor-pointer transition-colors"
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

          {productSprints.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-[#dbe9f0] py-14 text-center">
              <Activity className="w-8 h-8 text-[#cbd5e1] mx-auto mb-2" />
              <p className="text-[13px] text-[#64748B]">
                Este producto todavía no tiene sprints.{' '}
                <button
                  onClick={() => setSprintModal({ sprint: null })}
                  className="text-[#0E457F] font-medium hover:underline cursor-pointer"
                >
                  Crea el primero
                </button>
                .
              </p>
            </div>
          )}

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
                    <button
                      key={i.id}
                      onClick={() => setItemModal({ item: i })}
                      className="text-[11.5px] bg-[#f1f6fa] hover:bg-[#e4eef6] text-[#33475b] px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                      title="Editar y asignar a un sprint"
                    >
                      <span className="font-mono text-[#94a3b8] mr-1">{i.id}</span>
                      {i.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Detalle del ítem + comentarios */}
      {openItem && (
        <BacklogItemPanel
          item={openItem}
          onClose={() => setOpenItemId(null)}
          onAddComment={addComment}
          onDeleteComment={deleteComment}
          onUpdateStatus={updateStatus}
          onEdit={() => { setItemModal({ item: openItem }); setOpenItemId(null); }}
        />
      )}

      {/* Alta / edición de ítem */}
      {itemModal && (
        <BacklogItemModal
          productName={product.name}
          productKey={selected}
          sprints={productSprints}
          epics={epicNames}
          item={itemModal.item}
          defaultEpic={itemModal.epic}
          onClose={() => setItemModal(null)}
          onSave={saveItem}
          onDelete={itemModal.item ? () => deleteItem(itemModal.item!) : undefined}
        />
      )}

      {/* Alta / edición de sprint */}
      {sprintModal && (
        <SprintModal
          productName={product.name}
          sprint={sprintModal.sprint}
          onClose={() => setSprintModal(null)}
          onSave={saveSprint}
          onDelete={sprintModal.sprint ? () => deleteSprint(sprintModal.sprint!) : undefined}
        />
      )}
    </div>
  );
}
