import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import {
  BacklogItem,
  BacklogType,
  BacklogPriority,
  BacklogStatus,
  BACKLOG_STATUSES,
  TEAM_MEMBERS,
  Sprint,
  ProductKey
} from '../../data/productData';

interface BacklogItemModalProps {
  productName: string;
  productKey: ProductKey;
  sprints: Sprint[];
  epics: string[];
  /** null = alta; un ítem = edición */
  item: BacklogItem | null;
  /** épica preseleccionada al crear desde la cabecera de una épica */
  defaultEpic?: string;
  onClose: () => void;
  onSave: (data: Omit<BacklogItem, 'id' | 'product' | 'comments'>) => void;
  onDelete?: () => void;
}

const field =
  'w-full bg-[#f4fafc] border border-[#dceaf2] rounded-xl px-3 py-2 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-sm';
const fieldSm =
  'w-full bg-[#f4fafc] border border-[#dceaf2] rounded-xl px-2.5 py-1.5 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-[12.5px]';
const labelSm = 'block text-[11px] font-semibold text-[#64748B] uppercase mb-1';

export default function BacklogItemModal({
  productName,
  sprints,
  epics,
  item,
  defaultEpic,
  onClose,
  onSave,
  onDelete
}: BacklogItemModalProps) {
  const isEdit = !!item;

  const [title, setTitle] = useState(item?.title ?? '');
  const [desc, setDesc] = useState(item?.description ?? '');
  const [epic, setEpic] = useState(item?.epic ?? defaultEpic ?? epics[0] ?? '');
  const [type, setType] = useState<BacklogType>(item?.type ?? 'Historia');
  const [priority, setPriority] = useState<BacklogPriority>(item?.priority ?? 'Media');
  const [points, setPoints] = useState(item?.points ?? 5);
  const [assignee, setAssignee] = useState(item?.assignee ?? 'Sin asignar');
  const [sprintId, setSprintId] = useState<string>(item?.sprintId ?? '');
  const [status, setStatus] = useState<BacklogStatus>(item?.status ?? 'Backlog');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      epic: epic.trim() || 'Sin épica',
      title: title.trim(),
      description: desc.trim() || 'Sin detalles.',
      type,
      priority,
      points,
      // Al crear, el estado lo marca el sprint; al editar manda lo que elija el usuario
      status: isEdit ? status : sprintId ? 'Por hacer' : 'Backlog',
      sprintId: sprintId || null,
      assignee
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1A2C]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in max-h-[92vh] flex flex-col">
        <div className="border-b border-[#eef2f6] px-5 py-4 flex items-center justify-between flex-shrink-0">
          <h3 className="text-[15px] font-bold text-[#0F1A2C]">
            {isEdit ? (
              <>
                Editar <span className="font-mono text-[#64748B]">{item!.id}</span>
              </>
            ) : (
              `Nuevo ítem — ${productName}`
            )}
          </h3>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#0F1A2C] transition-colors p-1 cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Emisión de tarjeta prepago Visa"
              className={field}
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
              Descripción
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              placeholder="Detalle técnico o criterio de aceptación"
              className={`${field} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelSm}>Épica</label>
              <input
                type="text"
                value={epic}
                onChange={(e) => setEpic(e.target.value)}
                list="epic-options"
                placeholder="Ej. Compensación · Tarjetas"
                className={fieldSm}
              />
              <datalist id="epic-options">
                {epics.map((e) => (
                  <option key={e} value={e} />
                ))}
              </datalist>
            </div>

            <div>
              <label className={labelSm}>Tipo</label>
              <select value={type} onChange={(e: any) => setType(e.target.value)} className={fieldSm}>
                <option>Historia</option>
                <option>Bug</option>
                <option>Spike</option>
                <option>Tarea</option>
              </select>
            </div>
            <div>
              <label className={labelSm}>Prioridad</label>
              <select value={priority} onChange={(e: any) => setPriority(e.target.value)} className={fieldSm}>
                <option>Crítica</option>
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </select>
            </div>
            <div>
              <label className={labelSm}>Story points</label>
              <select value={points} onChange={(e: any) => setPoints(Number(e.target.value))} className={fieldSm}>
                {[1, 2, 3, 5, 8, 13].map((p) => (
                  <option key={p} value={p}>
                    {p} pts
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelSm}>Responsable</label>
              <select value={assignee} onChange={(e: any) => setAssignee(e.target.value)} className={fieldSm}>
                {TEAM_MEMBERS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className={isEdit ? '' : 'col-span-2'}>
              <label className={labelSm}>Sprint</label>
              <select value={sprintId} onChange={(e: any) => setSprintId(e.target.value)} className={fieldSm}>
                <option value="">Sin sprint (backlog)</option>
                {sprints.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            {isEdit && (
              <div>
                <label className={labelSm}>Estado</label>
                <select value={status} onChange={(e: any) => setStatus(e.target.value)} className={fieldSm}>
                  {BACKLOG_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="border-t border-[#eef2f6] pt-4 flex justify-between items-center gap-2.5">
            {isEdit && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="px-3 py-2 rounded-lg text-[#F05252] hover:bg-[#F05252]/10 text-sm cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white border border-[#e6eef4] text-[#64748B] hover:text-[#0F1A2C] text-sm cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-xl font-medium text-sm cursor-pointer"
              >
                {isEdit ? 'Guardar cambios' : 'Añadir al backlog'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
