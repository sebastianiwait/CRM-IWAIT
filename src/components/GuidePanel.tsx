import React, { useEffect, useState } from 'react';
import { HelpCircle, X, Lightbulb, Check, PlayCircle, BookOpen } from 'lucide-react';
import { TUTORIALS } from '../data/tutorials';
import { TOURS } from '../data/tours';
import Tour from './Tour';

interface GuidePanelProps {
  activeTab: string;
}

const STORAGE_KEY = 'iwait_seen_guides';

const getSeen = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export default function GuidePanel({ activeTab }: GuidePanelProps) {
  const [open, setOpen] = useState(false);
  const [tourRunning, setTourRunning] = useState(false);

  const tutorial = TUTORIALS[activeTab];
  const tour = TOURS[activeTab];

  // On first visit of a section: start the interactive tour if it exists, else open the panel
  useEffect(() => {
    if (!tutorial && !tour) return;
    const seen = getSeen();
    if (seen.includes(activeTab)) return;
    const t = setTimeout(() => {
      if (tour) setTourRunning(true);
      else setOpen(true);
    }, 600);
    return () => clearTimeout(t);
  }, [activeTab, tutorial, tour]);

  const markSeen = () => {
    const seen = getSeen();
    if (!seen.includes(activeTab)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, activeTab]));
    }
  };

  const closePanel = () => { markSeen(); setOpen(false); };
  const closeTour = () => { markSeen(); setTourRunning(false); };
  const startTour = () => { setOpen(false); setTourRunning(true); };

  if (!tutorial && !tour) return null;

  return (
    <>
      {/* Interactive tour overlay */}
      {tourRunning && tour && <Tour steps={tour} onClose={closeTour} />}

      {/* Floating trigger */}
      <button
        onClick={() => (tour ? startTour() : setOpen(true))}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-full bg-[#0E457F] hover:bg-[#0A365F] text-white shadow-lg shadow-[#0E457F]/25 transition-all cursor-pointer"
        title="Cómo usar esta sección"
      >
        <HelpCircle className="w-[18px] h-[18px]" />
        <span className="text-[13px] font-semibold">Guía</span>
      </button>

      {/* Slide-over manual */}
      {open && tutorial && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-[#0F1A2C]/40 backdrop-blur-sm animate-fade-in" onClick={closePanel}></div>

          <aside className="relative w-full max-w-[420px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
            <div className="px-6 py-5 bg-gradient-to-br from-[#0E457F] to-[#47B6E6] text-white relative overflow-hidden flex-shrink-0">
              <div className="absolute -right-8 -bottom-10 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/70">Cómo usar</div>
                  <h3 className="text-[19px] font-bold mt-0.5">{tutorial.title}</h3>
                </div>
                <button onClick={closePanel} className="text-white/80 hover:text-white p-1 -mr-1"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-[13px] text-white/90 mt-2.5 leading-relaxed relative z-10">{tutorial.intro}</p>
            </div>

            {/* Start interactive tour CTA */}
            {tour && (
              <button
                onClick={startTour}
                className="mx-6 mt-5 flex items-center gap-3 p-3.5 rounded-xl border border-[#0E457F]/20 bg-[#0E457F]/5 hover:bg-[#0E457F]/10 transition-colors text-left cursor-pointer"
              >
                <PlayCircle className="w-6 h-6 text-[#0E457F] flex-shrink-0" />
                <div>
                  <div className="text-[13.5px] font-bold text-[#0F1A2C]">Tour interactivo</div>
                  <div className="text-[12px] text-[#64748B]">Te guío paso a paso sobre la pantalla</div>
                </div>
              </button>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#64748B]">
                <BookOpen className="w-3.5 h-3.5" /> Manual
              </div>
              {tutorial.steps.map((step, i) => (
                <div key={i} className="flex gap-3.5">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#0E457F]/10 text-[#0E457F] flex items-center justify-center text-[13px] font-bold">{i + 1}</div>
                  <div className="flex-1 pb-4 border-b border-[#eef2f6] last:border-b-0">
                    <div className="text-[14px] font-bold text-[#0F1A2C]">{step.title}</div>
                    <p className="text-[13px] text-[#64748B] mt-1 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}

              <div className="flex gap-3 bg-[#F5A623]/8 border border-[#F5A623]/25 rounded-xl p-4 mt-2">
                <Lightbulb className="w-[18px] h-[18px] text-[#F5A623] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[12px] font-bold text-[#b8790f] uppercase tracking-wide">Tip</div>
                  <p className="text-[13px] text-[#33475b] mt-0.5 leading-relaxed">{tutorial.tip}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#eef2f6] flex-shrink-0">
              <button onClick={closePanel} className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0E457F] hover:bg-[#0A365F] text-white rounded-lg font-semibold text-[13.5px] transition-colors cursor-pointer">
                <Check className="w-4 h-4" /> Entendido
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
