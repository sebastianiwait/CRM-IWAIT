import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  Deal,
  DealStage,
  CompanyType,
  DEAL_STAGES,
  COMPANY_TYPES,
  DEAL_OWNERS,
  todayISO,
  newId
} from '../../data/crmData';
import { NewDealInput } from '../../hooks/useDeals';

interface DealFormModalProps {
  mode: 'create' | 'edit';
  deal?: Deal;
  onSubmit: (values: NewDealInput | Partial<Omit<Deal, 'id'>>) => void;
  onClose: () => void;
}

const input =
  'w-full bg-white border border-[#e6eef4] rounded-lg px-3 py-2 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-[13.5px]';
const label = 'block text-[11px] font-semibold text-[#64748B] uppercase tracking-wide mb-1';

/** Fecha por defecto: hoy + 60 días */
const defaultCloseDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().slice(0, 10);
};

export default function DealFormModal({ mode, deal, onSubmit, onClose }: DealFormModalProps) {
  const [name, setName] = useState(deal?.name ?? '');
  const [company, setCompany] = useState(deal?.company ?? '');
  const [companyType, setCompanyType] = useState<CompanyType>(deal?.companyType ?? 'Aerolínea');
  const [stage, setStage] = useState<DealStage>(deal?.stage ?? 'Prospecto');
  const [amount, setAmount] = useState(deal?.amount ? String(deal.amount) : '');
  const [closeDate, setCloseDate] = useState(deal?.closeDate ?? defaultCloseDate());
  const [owner, setOwner] = useState(deal?.owner ?? DEAL_OWNERS[0]);
  const [hub, setHub] = useState(deal?.hub ?? '');
  const [pax, setPax] = useState(deal?.passengersMonthly ? String(deal.passengersMonthly) : '');
  const [source, setSource] = useState(deal?.source ?? '');
  const [companyLinkedin, setCompanyLinkedin] = useState(deal?.companyLinkedin ?? '');
  const [notes, setNotes] = useState(deal?.notes ?? '');

  // Primer contacto inline (solo al crear)
  const [ctName, setCtName] = useState('');
  const [ctRole, setCtRole] = useState('');
  const [ctEmail, setCtEmail] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;

    const base = {
      name: name.trim(),
      company: company.trim(),
      companyType,
      stage,
      amount: Number(amount) || 0,
      closeDate: closeDate || todayISO(),
      owner,
      hub: hub.trim() || undefined,
      passengersMonthly: Number(pax) || undefined,
      source: source.trim() || undefined,
      companyLinkedin: companyLinkedin.trim() || undefined,
      notes: notes.trim() || undefined
    };

    if (mode === 'edit') {
      onSubmit(base);
    } else {
      const contacts = ctName.trim()
        ? [{
            id: newId('ct'),
            name: ctName.trim(),
            role: ctRole.trim() || 'Sin cargo',
            email: ctEmail.trim() || undefined,
            isPrimary: true
          }]
        : [];
      onSubmit({ ...base, contacts, activities: [] } as NewDealInput);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0F1A2C]/40 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-zoom-in max-h-[90vh] flex flex-col">
        <div className="border-b border-[#eef2f6] px-5 py-4 flex items-center justify-between flex-shrink-0">
          <h3 className="text-[15px] font-bold text-[#0F1A2C]">
            {mode === 'edit' ? 'Editar negocio' : 'Nuevo negocio'}
          </h3>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#0F1A2C] p-1"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-3.5 overflow-y-auto">
          <div>
            <label className={label}>Nombre del negocio</label>
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. JetSMART — Piloto de compensaciones SCL" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Empresa</label>
              <input className={input} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Ej. JetSMART Airlines" required />
            </div>
            <div>
              <label className={label}>Tipo</label>
              <select className={input} value={companyType} onChange={(e) => setCompanyType(e.target.value as CompanyType)}>
                {COMPANY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Etapa</label>
              <select className={input} value={stage} onChange={(e) => setStage(e.target.value as DealStage)}>
                {DEAL_STAGES.map((s) => <option key={s.key} value={s.key}>{s.key}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Valor (USD)</label>
              <input className={input} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="80000" />
            </div>
            <div>
              <label className={label}>Fecha de cierre</label>
              <input className={input} type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} />
            </div>
            <div>
              <label className={label}>Responsable</label>
              <select className={input} value={owner} onChange={(e) => setOwner(e.target.value)}>
                {DEAL_OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Hub / aeropuerto</label>
              <input className={input} value={hub} onChange={(e) => setHub(e.target.value)} placeholder="Ej. Santiago (SCL)" />
            </div>
            <div>
              <label className={label}>Pax / mes</label>
              <input className={input} type="number" value={pax} onChange={(e) => setPax(e.target.value)} placeholder="300000" />
            </div>
            <div>
              <label className={label}>Origen</label>
              <input className={input} value={source} onChange={(e) => setSource(e.target.value)} placeholder="Ej. Outbound LinkedIn" />
            </div>
            <div>
              <label className={label}>LinkedIn empresa</label>
              <input className={input} value={companyLinkedin} onChange={(e) => setCompanyLinkedin(e.target.value)} placeholder="https://linkedin.com/company/..." />
            </div>
          </div>

          <div>
            <label className={label}>Notas</label>
            <textarea className={`${input} resize-none`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Contexto de la cuenta, necesidad detectada..." />
          </div>

          {mode === 'create' && (
            <div className="border-t border-[#eef2f6] pt-3.5">
              <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide mb-2">
                Primer contacto <span className="normal-case font-normal text-[#94a3b8]">(opcional)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className={input} value={ctName} onChange={(e) => setCtName(e.target.value)} placeholder="Nombre" />
                <input className={input} value={ctRole} onChange={(e) => setCtRole(e.target.value)} placeholder="Cargo" />
              </div>
              <input className={`${input} mt-3`} type="email" value={ctEmail} onChange={(e) => setCtEmail(e.target.value)} placeholder="Email" />
            </div>
          )}

          <div className="border-t border-[#eef2f6] pt-4 flex justify-end gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white border border-[#e6eef4] text-[#64748B] hover:text-[#0F1A2C] text-sm cursor-pointer">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg font-medium text-sm cursor-pointer">
              {mode === 'edit' ? 'Guardar cambios' : 'Crear negocio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
