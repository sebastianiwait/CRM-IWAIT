import React, { useState } from 'react';
import {
  X,
  Pencil,
  Plus,
  Mail,
  Linkedin,
  Phone,
  CalendarDays,
  StickyNote,
  Star,
  Building2,
  ExternalLink,
  Check
} from 'lucide-react';
import {
  Deal,
  DealContact,
  DealStage,
  ActivityKind,
  DEAL_STAGES,
  ACTIVITY_KINDS,
  money,
  formatDate,
  todayISO,
  dealProbability
} from '../../data/crmData';
import ContactDetailCard from '../ContactDetailCard';
import ContactFormModal from './ContactFormModal';

interface DealDetailPanelProps {
  deal: Deal;
  onClose: () => void;
  onMoveStage: (id: string, stage: DealStage) => void;
  onAddActivity: (dealId: string, input: { kind: ActivityKind; text: string; date?: string }) => void;
  onEditDeal: () => void;
  onUpsertContact: (dealId: string, contact: DealContact | Omit<DealContact, 'id'>) => void;
  onDeleteContact: (dealId: string, contactId: string) => void;
}

const kindMeta: Record<ActivityKind, { icon: React.ReactNode; color: string }> = {
  Nota: { icon: <StickyNote className="w-3.5 h-3.5" />, color: '#F5A623' },
  Llamada: { icon: <Phone className="w-3.5 h-3.5" />, color: '#0E457F' },
  Reunión: { icon: <CalendarDays className="w-3.5 h-3.5" />, color: '#8B63F5' },
  Email: { icon: <Mail className="w-3.5 h-3.5" />, color: '#47B6E6' }
};

const initialsOf = (n: string) =>
  n.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export default function DealDetailPanel({
  deal,
  onClose,
  onMoveStage,
  onAddActivity,
  onEditDeal,
  onUpsertContact,
  onDeleteContact
}: DealDetailPanelProps) {
  const [kind, setKind] = useState<ActivityKind>('Nota');
  const [text, setText] = useState('');
  const [date, setDate] = useState(todayISO());

  const [contactDetail, setContactDetail] = useState<DealContact | null>(null);
  const [contactForm, setContactForm] = useState<{ open: boolean; contact?: DealContact }>({ open: false });

  const submitActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddActivity(deal.id, { kind, text: text.trim(), date });
    setText('');
    setDate(todayISO());
  };

  const sortedActivities = [...deal.activities].sort((a, b) => b.date.localeCompare(a.date));
  const overdue = deal.closeDate < todayISO() && !DEAL_STAGES.find((s) => s.key === deal.stage)?.terminal;

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-[#0F1A2C]/40 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

        <aside className="relative w-full max-w-[920px] h-full bg-[#f7fafc] shadow-2xl flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-br from-[#0E457F] to-[#47B6E6] text-white relative overflow-hidden flex-shrink-0">
            <div className="absolute -right-10 -bottom-12 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[12px] text-white/75">
                  <Building2 className="w-3.5 h-3.5" /> {deal.company} · {deal.companyType}
                </div>
                <h2 className="text-[21px] font-bold mt-1 leading-tight">{deal.name}</h2>
                <div className="flex items-center gap-4 mt-2.5 text-[13px]">
                  <span className="text-[22px] font-extrabold">{money(deal.amount)}</span>
                  <span className="text-white/85">Cierre {formatDate(deal.closeDate)}</span>
                  <span className="text-white/85">{dealProbability(deal)}% prob.</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={onEditDeal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-sm text-[13px] font-medium transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </button>
                <button onClick={onClose} className="text-white/80 hover:text-white p-1.5"><X className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

          {/* Stage stepper */}
          <div className="bg-white border-b border-[#e6eef4] px-6 py-3 flex-shrink-0 overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-max">
              {DEAL_STAGES.map((s) => {
                const active = s.key === deal.stage;
                const idx = DEAL_STAGES.findIndex((x) => x.key === deal.stage);
                const passed = DEAL_STAGES.findIndex((x) => x.key === s.key) < idx && !s.terminal;
                return (
                  <button
                    key={s.key}
                    onClick={() => onMoveStage(deal.id, s.key)}
                    title={`Mover a ${s.key}`}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      active ? 'text-white shadow-sm' : passed ? 'text-[#0F1A2C] bg-[#eef2f6]' : 'text-[#94a3b8] bg-[#f5f9fc] hover:bg-[#eef2f6]'
                    }`}
                    style={active ? { backgroundColor: s.accent } : undefined}
                  >
                    {passed && <Check className="w-3 h-3" />}
                    {s.key}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 items-start">
              {/* --- Columna izquierda --- */}
              <div className="space-y-5">
                {/* Ficha */}
                <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm p-5">
                  <h3 className="text-[13px] font-bold text-[#0F1A2C] mb-3.5">Acerca de este negocio</h3>
                  <dl className="space-y-3">
                    {[
                      ['Valor', money(deal.amount)],
                      ['Cierre estimado', formatDate(deal.closeDate)],
                      ['Responsable', deal.owner],
                      ['Probabilidad', `${dealProbability(deal)}%`],
                      ['Hub', deal.hub ?? '—'],
                      ['Pax / mes', deal.passengersMonthly ? `${(deal.passengersMonthly / 1000).toFixed(0)}K` : '—'],
                      ['Origen', deal.source ?? '—'],
                      ['Creado', formatDate(deal.createdAt)]
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 text-[13px]">
                        <dt className="text-[#64748B] flex-shrink-0">{k}</dt>
                        <dd className={`font-semibold text-right ${k === 'Cierre estimado' && overdue ? 'text-[#F05252]' : 'text-[#0F1A2C]'}`}>{v}</dd>
                      </div>
                    ))}
                  </dl>

                  {deal.companyLinkedin && (
                    <a
                      href={deal.companyLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#0A66C2] hover:bg-[#08528f] text-white text-[12.5px] font-semibold transition-colors"
                    >
                      <Linkedin className="w-4 h-4" /> LinkedIn de la empresa <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {deal.notes && (
                    <div className="mt-4 pt-4 border-t border-[#eef2f6]">
                      <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide mb-1">Notas</div>
                      <p className="text-[13px] text-[#33475b] leading-relaxed">{deal.notes}</p>
                    </div>
                  )}
                </div>

                {/* Contactos */}
                <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3.5">
                    <h3 className="text-[13px] font-bold text-[#0F1A2C]">
                      Contactos <span className="text-[#94a3b8] font-medium">({deal.contacts.length})</span>
                    </h3>
                    <button
                      onClick={() => setContactForm({ open: true })}
                      className="flex items-center gap-1 text-[12px] font-semibold text-[#0E457F] hover:text-[#0A365F] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir
                    </button>
                  </div>

                  {deal.contacts.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-[#e6eef4] rounded-xl text-[12.5px] text-[#94a3b8]">
                      Sin contactos aún
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {deal.contacts.map((c) => (
                        <div
                          key={c.id}
                          className="group flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#fafcfe] border border-transparent hover:border-[#eef2f6] transition-colors"
                        >
                          <button onClick={() => setContactDetail(c)} className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer">
                            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0E457F] to-[#47B6E6] text-white flex items-center justify-center text-[12px] font-bold flex-shrink-0">
                              {initialsOf(c.name)}
                            </span>
                            <span className="min-w-0">
                              <span className="flex items-center gap-1.5">
                                <span className="text-[13px] font-semibold text-[#0F1A2C] truncate">{c.name}</span>
                                {c.isPrimary && <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623] flex-shrink-0" />}
                              </span>
                              <span className="block text-[11.5px] text-[#64748B] truncate">{c.role}</span>
                            </span>
                          </button>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            {c.email && (
                              <a href={`mailto:${c.email}`} onClick={(e) => e.stopPropagation()} title={c.email}
                                 className="p-1.5 rounded-lg text-[#0E457F] hover:bg-[#0E457F]/10 transition-colors">
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {c.linkedin && (
                              <a href={c.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} title="LinkedIn"
                                 className="p-1.5 rounded-lg text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-colors">
                                <Linkedin className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => setContactForm({ open: true, contact: c })}
                              title="Editar contacto"
                              className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#0F1A2C] opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* --- Columna derecha: actividad --- */}
              <div className="space-y-5">
                {/* Composer */}
                <form onSubmit={submitActivity} className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {ACTIVITY_KINDS.map((k) => (
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
                    rows={3}
                    placeholder={`Registrar ${kind.toLowerCase()} sobre ${deal.company}...`}
                    className="w-full bg-[#f4fafc] border border-[#dceaf2] rounded-xl px-3 py-2.5 text-[13px] text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] resize-none"
                  />
                  <div className="flex items-center justify-between mt-2.5 gap-3">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-[#f4fafc] border border-[#dceaf2] rounded-xl px-2.5 py-1.5 text-[12.5px] text-[#33475b] focus:outline-none focus:border-[#47B6E6]"
                    />
                    <button type="submit" className="px-3.5 py-2 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-xl text-[13px] font-medium flex items-center gap-1.5 cursor-pointer">
                      <Plus className="w-[15px] h-[15px]" /> Registrar actividad
                    </button>
                  </div>
                </form>

                {/* Timeline */}
                <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm p-5">
                  <h3 className="text-[13px] font-bold text-[#0F1A2C] mb-4">
                    Actividad <span className="text-[#94a3b8] font-medium">({deal.activities.length})</span>
                  </h3>

                  {sortedActivities.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-[#e6eef4] rounded-xl">
                      <StickyNote className="w-7 h-7 text-[#cbd5e1] mx-auto mb-2" />
                      <p className="text-[13px] text-[#64748B]">Sin actividad todavía</p>
                      <p className="text-[12px] text-[#94a3b8]">Registra la primera arriba</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {sortedActivities.map((a, i) => (
                        <div key={a.id} className="flex gap-3">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <span
                              className="w-7 h-7 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: a.system ? '#eef2f6' : `${kindMeta[a.kind].color}18`,
                                color: a.system ? '#94a3b8' : kindMeta[a.kind].color
                              }}
                            >
                              {kindMeta[a.kind].icon}
                            </span>
                            {i < sortedActivities.length - 1 && <span className="flex-1 w-px bg-[#eef2f6] my-1"></span>}
                          </div>
                          <div className="pb-5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[12.5px] font-bold ${a.system ? 'text-[#94a3b8]' : 'text-[#0F1A2C]'}`}>{a.kind}</span>
                              <span className="text-[11px] text-[#94a3b8]">· {formatDate(a.date)} · {a.author}</span>
                            </div>
                            <p className={`text-[13px] mt-0.5 leading-relaxed ${a.system ? 'text-[#94a3b8] italic' : 'text-[#33475b]'}`}>{a.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modales anidados */}
      {contactForm.open && (
        <ContactFormModal
          contact={contactForm.contact}
          dealName={deal.name}
          onSubmit={(values) => onUpsertContact(deal.id, values)}
          onDelete={contactForm.contact ? () => onDeleteContact(deal.id, contactForm.contact!.id) : undefined}
          onClose={() => setContactForm({ open: false })}
        />
      )}

      {contactDetail && (
        <ContactDetailCard
          title={contactDetail.name}
          subtitle={`${contactDetail.role} · ${deal.company}`}
          email={contactDetail.email}
          linkedin={contactDetail.linkedin}
          fields={[
            { label: 'Cargo', value: contactDetail.role },
            { label: 'Empresa', value: deal.company },
            ...(contactDetail.email ? [{ label: 'Email', value: contactDetail.email }] : []),
            ...(contactDetail.phone ? [{ label: 'Teléfono', value: contactDetail.phone }] : []),
            { label: 'Negocio', value: deal.name }
          ]}
          onClose={() => setContactDetail(null)}
        />
      )}
    </>
  );
}
