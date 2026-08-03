import React, { useState } from 'react';
import { Users, Clock, CalendarDays, AlertTriangle } from 'lucide-react';
import {
  Deal,
  DealStage,
  DEAL_STAGES,
  money,
  formatDate,
  todayISO,
  lastActivity,
  primaryContact,
  dealAlert,
  ALERT_META
} from '../../data/crmData';

interface DealPipelineProps {
  deals: Deal[];
  onMoveStage: (id: string, stage: DealStage) => void;
  onOpenDeal: (id: string) => void;
}

const initialsOf = (n: string) =>
  n.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export default function DealPipeline({ deals, onMoveStage, onOpenDeal }: DealPipelineProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<DealStage | null>(null);

  return (
    <div data-tour="deal-board" className="flex gap-4 overflow-x-auto pb-3 items-start">
      {DEAL_STAGES.map((col) => {
        const cards = deals.filter((d) => d.stage === col.key);
        const sum = cards.reduce((a, c) => a + c.amount, 0);

        return (
          <div
            key={col.key}
            onDragOver={(e) => { e.preventDefault(); if (overCol !== col.key) setOverCol(col.key); }}
            onDragLeave={() => setOverCol(null)}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('text/plain') || draggingId;
              if (id) onMoveStage(id, col.key);
              setDraggingId(null);
              setOverCol(null);
            }}
            className={`min-w-[272px] w-[272px] shrink-0 bg-white rounded-xl border p-3 min-h-[380px] transition-all ${
              overCol === col.key ? 'border-[#47B6E6] shadow-md' : 'border-[#e6eef4] shadow-sm'
            }`}
          >
            {/* Cabecera de columna */}
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: col.accent }}></span>
              <span className="text-[12px] font-bold text-[#0F1A2C] truncate">{col.key}</span>
              <span className="ml-auto text-[10px] font-bold bg-[#eef2f6] text-[#64748B] px-2 py-0.5 rounded-full flex-shrink-0">
                {cards.length}
              </span>
            </div>
            <div className="text-[11px] text-[#64748B] px-1 mb-3 font-mono">{money(sum)}</div>

            <div className="space-y-2.5">
              {cards.map((deal) => {
                const overdue = deal.closeDate < todayISO() && !col.terminal;
                const last = lastActivity(deal);
                const pc = primaryContact(deal);

                return (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => { setDraggingId(deal.id); e.dataTransfer.setData('text/plain', deal.id); }}
                    onDragEnd={() => { setDraggingId(null); setOverCol(null); }}
                    onClick={() => onOpenDeal(deal.id)}
                    className={`bg-white border rounded-lg p-3 shadow-sm hover:shadow-md hover:border-[#47B6E6] cursor-pointer transition-all ${
                      draggingId === deal.id ? 'opacity-40 border-dashed border-[#47B6E6]' : 'border-[#eef2f6]'
                    }`}
                  >
                    <div className="text-[13px] font-semibold text-[#0F1A2C] leading-snug">{deal.name}</div>
                    <div className="text-[11.5px] text-[#64748B] mt-0.5 truncate">{deal.company}</div>

                    {(() => {
                      const alert = dealAlert(deal);
                      if (!alert) return null;
                      const meta = ALERT_META[alert];
                      return (
                        <div
                          className="flex items-center gap-1 mt-2 text-[10.5px] font-bold px-1.5 py-1 rounded-lg"
                          style={{ backgroundColor: `${meta.color}14`, color: meta.color }}
                          title={meta.label}
                        >
                          <AlertTriangle className="w-3 h-3 flex-shrink-0" /> {meta.short}
                        </div>
                      );
                    })()}

                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-[13.5px] font-bold text-[#0E457F]">{money(deal.amount)}</span>
                      <span
                        className={`flex items-center gap-1 text-[10.5px] font-semibold px-1.5 py-0.5 rounded ${
                          overdue ? 'bg-[#F05252]/12 text-[#F05252]' : 'bg-[#eef2f6] text-[#64748B]'
                        }`}
                      >
                        <CalendarDays className="w-3 h-3" /> {formatDate(deal.closeDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-[#f1f5f9]">
                      <span
                        className="w-5 h-5 rounded-full bg-[#0E457F]/10 text-[#0E457F] flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                        title={deal.owner}
                      >
                        {initialsOf(deal.owner)}
                      </span>
                      {deal.contacts.length > 0 && (
                        <span className="flex items-center gap-1 text-[10.5px] text-[#64748B]" title={pc?.name}>
                          <Users className="w-3 h-3" /> {deal.contacts.length}
                        </span>
                      )}
                      {last && (
                        <span className="flex items-center gap-1 text-[10.5px] text-[#94a3b8] ml-auto truncate" title={last.text}>
                          <Clock className="w-3 h-3 flex-shrink-0" /> {formatDate(last.date)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

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
  );
}
