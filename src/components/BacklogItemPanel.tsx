import React, { useState } from 'react';
import { X, MessageSquare, Send, Trash2 } from 'lucide-react';
import { BacklogItem, BacklogComment, BACKLOG_STATUSES, BacklogStatus, TEAM_MEMBERS } from '../data/productData';

interface BacklogItemPanelProps {
  item: BacklogItem;
  onClose: () => void;
  onAddComment: (itemId: string, text: string, author: string) => void;
  onDeleteComment: (itemId: string, commentId: string) => void;
  onUpdateStatus: (itemId: string, status: BacklogStatus) => void;
}

const statusStyle = (s: string) => {
  switch (s) {
    case 'Hecho': return 'bg-[#10CC82]/12 text-[#0f9c66]';
    case 'En progreso': return 'bg-[#0E457F]/10 text-[#0E457F]';
    case 'Review': return 'bg-[#8B63F5]/12 text-[#6d43d6]';
    case 'Por hacer': return 'bg-[#F5A623]/12 text-[#b8790f]';
    default: return 'bg-[#64748B]/10 text-[#64748B]';
  }
};

const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const formatDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es', { day: '2-digit', month: 'short' });
};

export default function BacklogItemPanel({
  item,
  onClose,
  onAddComment,
  onDeleteComment,
  onUpdateStatus
}: BacklogItemPanelProps) {
  const [text, setText] = useState('');
  // Autor por defecto: el dueño de la sesión
  const [author, setAuthor] = useState(TEAM_MEMBERS[1] ?? TEAM_MEMBERS[0]);

  const comments: BacklogComment[] = item.comments ?? [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(item.id, text.trim(), author);
    setText('');
  };

  const meta = (label: string, value: React.ReactNode) => (
    <div>
      <div className="text-[10.5px] font-semibold text-[#64748B] uppercase tracking-wide mb-1">{label}</div>
      <div className="text-[13px] text-[#0F1A2C] font-medium">{value}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[#0F1A2C]/40 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

      <div className="relative w-full max-w-[560px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0E457F] to-[#47B6E6] px-5 py-4 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-mono text-[11px] text-white/70">{item.id} · {item.epic}</div>
              <h3 className="text-[16px] font-bold text-white mt-1 leading-snug">{item.title}</h3>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white p-1 flex-shrink-0 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Ficha */}
          <div className="px-5 py-4 border-b border-[#eef2f6] space-y-4">
            <p className="text-[13px] text-[#33475b] leading-relaxed">{item.description}</p>

            <div className="grid grid-cols-3 gap-4">
              {meta('Tipo', item.type)}
              {meta('Prioridad', item.priority)}
              {meta('Puntos', <span className="font-mono">{item.points}p</span>)}
              {meta('Responsable', item.assignee)}
              {meta('Sprint', item.sprintId ?? 'Sin sprint')}
              <div>
                <div className="text-[10.5px] font-semibold text-[#64748B] uppercase tracking-wide mb-1">Estado</div>
                <select
                  value={item.status}
                  onChange={(e) => onUpdateStatus(item.id, e.target.value as BacklogStatus)}
                  className={`text-[11px] font-bold px-2 py-1 rounded border-none cursor-pointer focus:outline-none ${statusStyle(item.status)}`}
                >
                  {BACKLOG_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Comentarios */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-[15px] h-[15px] text-[#0E457F]" />
              <h4 className="text-[13px] font-bold text-[#0F1A2C]">Comentarios</h4>
              <span className="text-[11px] text-[#64748B] bg-[#eef2f6] px-2 py-0.5 rounded-full font-semibold">
                {comments.length}
              </span>
            </div>

            {comments.length === 0 ? (
              <p className="text-[12.5px] text-[#94a3b8] italic py-3">
                Sin comentarios todavía. Deja el primero para dar contexto al equipo.
              </p>
            ) : (
              <div className="space-y-3">
                {[...comments]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((c) => (
                    <div key={c.id} className="flex gap-2.5 group">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0E457F] to-[#47B6E6] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {initials(c.author)}
                      </div>
                      <div className="flex-1 min-w-0 bg-[#fafcfe] border border-[#f1f5f9] rounded-xl px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-semibold text-[#0F1A2C]">{c.author}</span>
                            <span className="text-[10.5px] text-[#94a3b8] font-mono">{formatDate(c.date)}</span>
                          </div>
                          <button
                            onClick={() => onDeleteComment(item.id, c.id)}
                            className="text-[#cbd5e1] hover:text-[#F05252] opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            title="Eliminar comentario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[12.5px] text-[#33475b] mt-1 whitespace-pre-wrap break-words">{c.text}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <form onSubmit={submit} className="border-t border-[#eef2f6] p-4 flex-shrink-0 bg-[#fbfdfe]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10.5px] font-semibold text-[#64748B] uppercase tracking-wide">Comentar como</span>
            <select
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="text-[11.5px] bg-white border border-[#dceaf2] rounded-lg px-2 py-1 text-[#33475b] cursor-pointer focus:outline-none focus:border-[#47B6E6]"
            >
              {TEAM_MEMBERS.filter((m) => m !== 'Sin asignar').map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                // Cmd/Ctrl+Enter envía, Enter simple salta línea
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(e as unknown as React.FormEvent);
              }}
              rows={2}
              placeholder="Escribe un comentario…  (⌘+Enter para enviar)"
              className="flex-1 bg-white border border-[#dceaf2] rounded-xl px-3 py-2 text-[13px] text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] resize-none"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-3.5 bg-[#0E457F] hover:bg-[#0A365F] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl cursor-pointer transition-all flex items-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
