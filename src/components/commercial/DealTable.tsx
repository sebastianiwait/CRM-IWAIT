import React from 'react';
import { Pencil, Trash2, Star } from 'lucide-react';
import {
  Deal,
  money,
  formatDate,
  todayISO,
  stageMeta,
  lastActivity,
  primaryContact
} from '../../data/crmData';

interface DealTableProps {
  deals: Deal[];
  onOpenDeal: (id: string) => void;
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (id: string) => void;
}

export default function DealTable({ deals, onOpenDeal, onEditDeal, onDeleteDeal }: DealTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#fbfdfe] border-b border-[#eef2f6]">
              {['Negocio', 'Etapa', 'Valor', 'Cierre', 'Responsable', 'Contactos', 'Última actividad', ''].map((h) => (
                <th key={h} className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {deals.map((deal) => {
              const meta = stageMeta(deal.stage);
              const overdue = deal.closeDate < todayISO() && !meta.terminal;
              const last = lastActivity(deal);
              const pc = primaryContact(deal);

              return (
                <tr
                  key={deal.id}
                  onClick={() => onOpenDeal(deal.id)}
                  className="hover:bg-[#fafcfe] transition-colors group cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <div className="text-[13.5px] font-semibold text-[#0F1A2C]">{deal.name}</div>
                    <div className="text-[11.5px] text-[#64748B]">{deal.company} · {deal.companyType}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-[10.5px] font-bold px-2 py-0.5 rounded whitespace-nowrap"
                      style={{ backgroundColor: `${meta.accent}18`, color: meta.accent }}
                    >
                      {deal.stage}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13.5px] font-bold text-[#0F1A2C] whitespace-nowrap">{money(deal.amount)}</td>
                  <td className={`px-5 py-3.5 text-[12.5px] whitespace-nowrap ${overdue ? 'text-[#F05252] font-semibold' : 'text-[#64748B]'}`}>
                    {formatDate(deal.closeDate)}
                  </td>
                  <td className="px-5 py-3.5 text-[12.5px] text-[#33475b] whitespace-nowrap">{deal.owner}</td>
                  <td className="px-5 py-3.5 text-[12.5px] text-[#33475b]">
                    {deal.contacts.length === 0 ? (
                      <span className="text-[#94a3b8]">—</span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        {pc?.isPrimary && <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />}
                        <span className="truncate max-w-[140px]">{pc?.name}</span>
                        {deal.contacts.length > 1 && (
                          <span className="text-[10.5px] font-bold bg-[#eef2f6] text-[#64748B] px-1.5 py-0.5 rounded-full">
                            +{deal.contacts.length - 1}
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-[#64748B]">
                    {last ? (
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#33475b]">{last.kind}</span>
                        <span className="text-[#94a3b8]">{formatDate(last.date)}</span>
                      </span>
                    ) : (
                      <span className="text-[#94a3b8]">Sin actividad</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditDeal(deal); }}
                        title="Editar negocio"
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#0E457F] hover:bg-[#0E457F]/8 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-[15px] h-[15px]" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteDeal(deal.id); }}
                        title="Eliminar negocio"
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#F05252] hover:bg-[#F05252]/8 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-[15px] h-[15px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {deals.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-[13px] text-[#94a3b8]">
                  No hay negocios que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
