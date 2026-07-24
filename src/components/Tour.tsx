import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export interface TourStep {
  /** value of the data-tour attribute to highlight; omit for a centered step */
  target?: string;
  title: string;
  body: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
}

interface TourProps {
  steps: TourStep[];
  onClose: () => void;
}

interface Rect { top: number; left: number; width: number; height: number; }

const PAD = 8;

export default function Tour({ steps, onClose }: TourProps) {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [tipPos, setTipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const step = steps[i];
  const isLast = i === steps.length - 1;

  // Locate + scroll to the current target
  const measure = () => {
    if (!step?.target) { setRect(null); return; }
    const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
    if (!el) { setRect(null); return; }
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  };

  useLayoutEffect(() => {
    measure();
    // re-measure shortly after (allow smooth scroll to settle)
    const t = setTimeout(measure, 320);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  // Position the tooltip relative to the highlighted rect
  useLayoutEffect(() => {
    const tip = tipRef.current;
    if (!tip) return;
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 14;

    if (!rect) {
      setTipPos({ top: vh / 2 - th / 2, left: vw / 2 - tw / 2 });
      return;
    }

    // Prefer below, then above, then right, then left
    let top: number, left: number;
    const spaceBelow = vh - (rect.top + rect.height);
    const spaceAbove = rect.top;

    if (spaceBelow > th + margin + PAD) {
      top = rect.top + rect.height + margin;
      left = rect.left + rect.width / 2 - tw / 2;
    } else if (spaceAbove > th + margin + PAD) {
      top = rect.top - th - margin;
      left = rect.left + rect.width / 2 - tw / 2;
    } else {
      top = rect.top + rect.height / 2 - th / 2;
      left = rect.left + rect.width + margin;
      if (left + tw > vw) left = rect.left - tw - margin;
    }

    left = Math.max(margin, Math.min(left, vw - tw - margin));
    top = Math.max(margin, Math.min(top, vh - th - margin));
    setTipPos({ top, left });
  }, [rect, i]);

  const next = () => (isLast ? onClose() : setI((v) => v + 1));
  const prev = () => setI((v) => Math.max(0, v - 1));

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'Enter') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, isLast]);

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Dim overlay with a spotlight hole via huge box-shadow */}
      {rect ? (
        <div
          className="absolute rounded-xl transition-all duration-300 pointer-events-none"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow: '0 0 0 9999px rgba(15,26,44,0.62)',
            outline: '2px solid #47B6E6',
            outlineOffset: '2px'
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#0F1A2C]/62" />
      )}

      {/* Click-catcher to advance (but not on the tooltip) */}
      <div className="absolute inset-0" onClick={next} />

      {/* Tooltip */}
      <div
        ref={tipRef}
        className="absolute w-[320px] bg-white rounded-xl shadow-2xl border border-[#e6eef4] overflow-hidden animate-zoom-in"
        style={{ top: tipPos.top, left: tipPos.left }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#0E457F]">
              <Sparkles className="w-3.5 h-3.5" /> Paso {i + 1} de {steps.length}
            </div>
            <button onClick={onClose} className="text-[#94a3b8] hover:text-[#0F1A2C]" title="Cerrar tour">
              <X className="w-4 h-4" />
            </button>
          </div>
          <h4 className="text-[15px] font-bold text-[#0F1A2C]">{step.title}</h4>
          <p className="text-[13px] text-[#64748B] mt-1 leading-relaxed">{step.body}</p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1 px-4">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`h-1 rounded-full transition-all ${idx === i ? 'w-5 bg-[#0E457F]' : 'w-1.5 bg-[#dbe9f0]'}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-3 mt-2 border-t border-[#eef2f6]">
          <button onClick={onClose} className="text-[12.5px] text-[#94a3b8] hover:text-[#64748B] cursor-pointer">
            Saltar
          </button>
          <div className="flex items-center gap-2">
            {i > 0 && (
              <button
                onClick={prev}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#e6eef4] text-[#33475b] hover:bg-[#f1f6fa] text-[12.5px] font-medium cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Atrás
              </button>
            )}
            <button
              onClick={next}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#0E457F] hover:bg-[#0A365F] text-white text-[12.5px] font-semibold cursor-pointer"
            >
              {isLast ? 'Finalizar' : 'Siguiente'} {!isLast && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
