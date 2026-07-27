import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { DealContact } from '../../data/crmData';

interface ContactFormModalProps {
  contact?: DealContact;
  dealName: string;
  onSubmit: (values: DealContact | Omit<DealContact, 'id'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const input =
  'w-full bg-white border border-[#e6eef4] rounded-lg px-3 py-2 text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] text-[13.5px]';
const label = 'block text-[11px] font-semibold text-[#64748B] uppercase tracking-wide mb-1';

export default function ContactFormModal({
  contact,
  dealName,
  onSubmit,
  onDelete,
  onClose
}: ContactFormModalProps) {
  const [name, setName] = useState(contact?.name ?? '');
  const [role, setRole] = useState(contact?.role ?? '');
  const [email, setEmail] = useState(contact?.email ?? '');
  const [phone, setPhone] = useState(contact?.phone ?? '');
  const [linkedin, setLinkedin] = useState(contact?.linkedin ?? '');
  const [isPrimary, setIsPrimary] = useState(contact?.isPrimary ?? false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const base = {
      name: name.trim(),
      role: role.trim() || 'Sin cargo',
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      isPrimary
    };
    onSubmit(contact ? { ...base, id: contact.id } : base);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0F1A2C]/40 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-zoom-in">
        <div className="border-b border-[#eef2f6] px-5 py-4 flex items-start justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-[#0F1A2C]">
              {contact ? 'Editar contacto' : 'Nuevo contacto'}
            </h3>
            <p className="text-[12px] text-[#64748B] mt-0.5 truncate max-w-[280px]">{dealName}</p>
          </div>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#0F1A2C] p-1"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-3.5">
          <div>
            <label className={label}>Nombre</label>
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Camila Reyes" required />
          </div>
          <div>
            <label className={label}>Cargo</label>
            <input className={input} value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ej. Gerente de Experiencia de Pasajero" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Email</label>
              <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@empresa.com" />
            </div>
            <div>
              <label className={label}>Teléfono</label>
              <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+56 9 ..." />
            </div>
          </div>
          <div>
            <label className={label}>LinkedIn</label>
            <input className={input} value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://www.linkedin.com/in/..." />
          </div>

          <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="w-4 h-4 accent-[#0E457F] cursor-pointer"
            />
            <span className="text-[13px] text-[#33475b]">Contacto principal del negocio</span>
          </label>

          <div className="border-t border-[#eef2f6] pt-4 flex justify-between items-center gap-2.5">
            {onDelete ? (
              <button
                type="button"
                onClick={() => { onDelete(); onClose(); }}
                className="flex items-center gap-1.5 text-[13px] text-[#F05252] hover:text-[#c53030] cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            ) : <span />}
            <div className="flex gap-2.5">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white border border-[#e6eef4] text-[#64748B] hover:text-[#0F1A2C] text-sm cursor-pointer">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg font-medium text-sm cursor-pointer">Guardar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
