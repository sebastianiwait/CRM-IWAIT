import React from 'react';
import { X, PlayCircle, GraduationCap } from 'lucide-react';
import { TUTORIALS } from '../data/tutorials';
import { TOURS } from '../data/tours';

interface TutorialsMenuProps {
  onClose: () => void;
  onSelect: (section: string) => void;
}

// Order shown in the picker
const ORDER = ['inicio', 'inversionstas', 'dataroom', 'producto', 'tareas', 'negocios'];

export default function TutorialsMenu({ onClose, onSelect }: TutorialsMenuProps) {
  const items = ORDER.filter((k) => TUTORIALS[k]);

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0F1A2C]/40 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-zoom-in max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-br from-[#0E457F] to-[#47B6E6] text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute -right-8 -bottom-10 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-6 h-6" />
              <div>
                <h3 className="text-[18px] font-bold leading-tight">Tutoriales</h3>
                <p className="text-[12.5px] text-white/80">Elige una sección y te guío paso a paso</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-1 -mr-1"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* List */}
        <div className="p-3 overflow-y-auto">
          {items.map((key) => {
            const t = TUTORIALS[key];
            const interactive = !!TOURS[key];
            return (
              <button
                key={key}
                onClick={() => onSelect(key)}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-[#f1f6fa] transition-colors text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0E457F]/8 text-[#0E457F] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0E457F] group-hover:text-white transition-colors">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#0F1A2C]">{t.title}</span>
                    {interactive && (
                      <span className="text-[9.5px] font-bold uppercase tracking-wide bg-[#10CC82]/12 text-[#0f9c66] px-1.5 py-0.5 rounded">Interactivo</span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-0.5 truncate">{t.intro}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
