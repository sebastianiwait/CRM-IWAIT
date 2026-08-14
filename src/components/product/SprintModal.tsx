import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Sprint, parseSprintRange } from '../../data/productData';

interface SprintModalProps {
  productName: string;
  /** null = alta; un sprint = edición */
  sprint: Sprint | null;
  onClose: () => void;
  onSave: (data: Omit<Sprint, 'id' | 'product'>) => void;
  onDelete?: () => void;
}

const field =
  'w-full bg-[#f4fafc] border border-[#dceaf2] rounded-xl px-3 py-2 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-sm';
const labelSm = 'block text-[11px] font-semibold text-[#64748B] uppercase mb-1';

export default function SprintModal({ productName, sprint, onClose, onSave, onDelete }: SprintModalProps) {
  const isEdit = !!sprint;

  const [name, setName] = useState(sprint?.name ?? '');
  const [goal, setGoal] = useState(sprint?.goal ?? '');
  const [range, setRange] = useState(sprint?.range ?? '');
  const [status, setStatus] = useState<Sprint['status']>(sprint?.status ?? 'Planificado');

  // El burndown y las alertas de ritmo dependen de poder leer las fechas
  const rangeOk = range.trim() === '' || parseSprintRange(range) !== null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      goal: goal.trim() || 'Sin objetivo definido.',
      range: range.trim(),
      status
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1A2C]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
        <div className="border-b border-[#eef2f6] px-5 py-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#0F1A2C]">
            {isEdit ? `Editar ${sprint!.name}` : `Nuevo sprint — ${productName}`}
          </h3>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#0F1A2C] transition-colors p-1 cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <label className={labelSm}>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Tarjetas Visa / prepago"
              className={field}
              autoFocus
              required
            />
          </div>

          <div>
            <label className={labelSm}>Objetivo</label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={2}
              placeholder="Qué queda demostrado si el sprint sale bien"
              className={`${field} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelSm}>Fechas</label>
              <input
                type="text"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="10 Ago — 4 Sep 2026"
                className={`${field} ${rangeOk ? '' : 'border-[#F5A623]'}`}
              />
            </div>
            <div>
              <label className={labelSm}>Estado</label>
              <select value={status} onChange={(e: any) => setStatus(e.target.value)} className={field}>
                <option>Planificado</option>
                <option>Activo</option>
                <option>Cerrado</option>
              </select>
            </div>
          </div>

          {!rangeOk && (
            <p className="text-[11.5px] text-[#b8790f] bg-[#F5A623]/10 rounded-lg px-3 py-2">
              Formato no reconocido. Usa <span className="font-mono">10 Ago — 4 Sep 2026</span> (con guion largo —)
              o el burndown no podrá calcular el ritmo.
            </p>
          )}

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
                {isEdit ? 'Guardar cambios' : 'Crear sprint'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
