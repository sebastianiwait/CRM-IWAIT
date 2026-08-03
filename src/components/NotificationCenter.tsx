import React, { useEffect, useRef, useState } from 'react';
import { Bell, Briefcase, CheckSquare, Rocket, CheckCircle2 } from 'lucide-react';
import { AppNotification, SEVERITY_META, sourceLabel, NotificationSource } from '../lib/notifications';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onOpen: (n: AppNotification) => void;
}

const sourceIcon = (s: NotificationSource) => {
  if (s === 'negocios') return Briefcase;
  if (s === 'tareas') return CheckSquare;
  return Rocket;
};

export default function NotificationCenter({ notifications, onOpen }: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra al hacer clic fuera o con Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const urgent = notifications.filter((n) => n.severity === 'alta').length;
  const count = notifications.length;

  return (
    <div className="relative flex-shrink-0" ref={ref} data-tour="notifications">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
          open
            ? 'bg-[#0E457F] border-[#0E457F] text-white'
            : 'bg-white border-[#c3dae4] text-[#33475b] hover:text-[#0E457F] hover:border-[#0E457F]'
        }`}
        aria-label={`Notificaciones${count ? ` (${count})` : ''}`}
        title="Notificaciones"
      >
        <Bell className="w-[18px] h-[18px]" />
        {count > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white"
            style={{ backgroundColor: urgent > 0 ? '#F05252' : '#F5A623' }}
          >
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-white border border-[#e6eef4] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-[#eef2f6] flex items-center justify-between">
            <h4 className="text-[13px] font-bold text-[#0F1A2C]">Notificaciones</h4>
            {count > 0 && (
              <span className="text-[11px] text-[#64748B]">
                {urgent > 0 ? `${urgent} urgente${urgent > 1 ? 's' : ''}` : `${count} pendiente${count > 1 ? 's' : ''}`}
              </span>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {count === 0 ? (
              <div className="py-10 text-center px-6">
                <CheckCircle2 className="w-8 h-8 text-[#10CC82] mx-auto mb-2" />
                <p className="text-[13px] font-medium text-[#0F1A2C]">Todo al día</p>
                <p className="text-[11.5px] text-[#64748B] mt-1">
                  Sin negocios enfriándose, tareas vencidas ni sprints retrasados.
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = sourceIcon(n.source);
                const sev = SEVERITY_META[n.severity];
                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      onOpen(n);
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 flex gap-3 hover:bg-[#fafcfe] border-b border-[#f1f5f9] last:border-b-0 transition-colors cursor-pointer"
                  >
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: sev.bg, color: sev.color }}
                    >
                      <Icon className="w-[14px] h-[14px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[12.5px] font-semibold text-[#0F1A2C] truncate">{n.title}</span>
                        <span
                          className="text-[9.5px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{ backgroundColor: sev.bg, color: sev.color }}
                        >
                          {n.severity}
                        </span>
                      </span>
                      <span className="block text-[11.5px] text-[#64748B] mt-0.5 leading-snug">{n.detail}</span>
                      <span className="block text-[10.5px] text-[#94a3b8] mt-1 font-medium">
                        {sourceLabel(n.source)}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
