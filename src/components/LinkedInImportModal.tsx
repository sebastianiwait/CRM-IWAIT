import React, { useMemo, useRef, useState } from 'react';
import {
  X,
  Upload,
  Linkedin,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileText,
  ArrowRight
} from 'lucide-react';
import {
  parseLinkedInCsv,
  scoreConnections,
  fullName,
  ScoredConnection
} from '../lib/linkedinImport';
import { Investor } from '../data/iwaitData';

interface LinkedInImportModalProps {
  onImport: (investors: Omit<Investor, 'id'>[]) => void;
  onClose: () => void;
  triggerToast: (msg: string) => void;
}

type Step = 'upload' | 'review';

export default function LinkedInImportModal({ onImport, onClose, triggerToast }: LinkedInImportModalProps) {
  const [step, setStep] = useState<Step>('upload');
  const [rows, setRows] = useState<ScoredConnection[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [onlyDetected, setOnlyDetected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const keyOf = (c: ScoredConnection) => `${c.url || ''}|${fullName(c)}|${c.company}`;

  const handleFile = async (file: File) => {
    setError(null);
    setFileName(file.name);
    try {
      const text = await file.text();
      const parsed = parseLinkedInCsv(text);
      if (parsed.length === 0) {
        setError('No pude leer conexiones en ese archivo. Asegúrate de subir el "Connections.csv" que te envía LinkedIn.');
        return;
      }
      const scored = scoreConnections(parsed);
      setRows(scored);
      setSelected(new Set(scored.filter((c) => c.isFund).map(keyOf)));
      setStep('review');
    } catch {
      setError('No se pudo leer el archivo. ¿Es un CSV válido?');
    }
  };

  const filtered = useMemo(() => {
    let list = rows;
    if (onlyDetected) list = list.filter((c) => c.isFund);
    if (search.trim()) {
      const t = search.toLowerCase();
      list = list.filter(
        (c) =>
          fullName(c).toLowerCase().includes(t) ||
          c.company.toLowerCase().includes(t) ||
          c.position.toLowerCase().includes(t)
      );
    }
    return list;
  }, [rows, onlyDetected, search]);

  const toggle = (c: ScoredConnection) => {
    const k = keyOf(c);
    setSelected((cur) => {
      const next = new Set(cur);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  };

  const toggleAllVisible = () => {
    const visibleKeys = filtered.map(keyOf);
    const allSelected = visibleKeys.every((k) => selected.has(k));
    setSelected((cur) => {
      const next = new Set(cur);
      visibleKeys.forEach((k) => (allSelected ? next.delete(k) : next.add(k)));
      return next;
    });
  };

  const doImport = () => {
    const chosen = rows.filter((c) => selected.has(keyOf(c)));
    if (chosen.length === 0) {
      triggerToast('Selecciona al menos un contacto');
      return;
    }
    const investors: Omit<Investor, 'id'>[] = chosen.map((c) => ({
      name: c.company || fullName(c),
      firm: c.position || 'Contacto de LinkedIn',
      committedAmount: 0,
      status: 'Negociando',
      email: c.email || '',
      round: 'Semilla',
      sharesPercent: 0,
      stage: 'Contactado',
      contact: fullName(c),
      linkedin: c.url || undefined
    }));
    onImport(investors);
    onClose();
  };

  const detectedCount = rows.filter((c) => c.isFund).length;

  return (
    <div className="fixed inset-0 z-[58] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0F1A2C]/40 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-zoom-in max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-br from-[#0A66C2] to-[#47B6E6] text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute -right-8 -bottom-10 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Linkedin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold leading-tight">Importar contactos de LinkedIn</h3>
                <p className="text-[12.5px] text-white/85">
                  {step === 'upload'
                    ? 'Sube tu exportación de conexiones y detecto los fondos'
                    : `${detectedCount} fondos detectados de ${rows.length} conexiones`}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-1"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* ---------- PASO 1: subir ---------- */}
        {step === 'upload' && (
          <div className="p-6 overflow-y-auto">
            <div className="bg-[#f5f9fc] border border-[#e6eef4] rounded-xl p-4 mb-5">
              <h4 className="text-[13px] font-bold text-[#0F1A2C] mb-2.5">Cómo obtener el archivo (2 minutos)</h4>
              <ol className="space-y-2 text-[13px] text-[#33475b]">
                {[
                  'En LinkedIn, entra a Configuración y privacidad.',
                  'Ve a Privacidad de datos → Obtener una copia de tus datos.',
                  'Marca solo "Conexiones" y pide el archivo.',
                  'LinkedIn te envía un correo con el ZIP en unos minutos. Descomprímelo y sube aquí el Connections.csv.'
                ].map((t, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
              <a
                href="https://www.linkedin.com/mypreferences/d/download-my-data"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#0A66C2] hover:underline"
              >
                Abrir la página de descarga en LinkedIn <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl py-12 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-[#0A66C2] bg-[#0A66C2]/5' : 'border-[#dbe9f0] hover:border-[#47B6E6] hover:bg-[#fafcfe]'
              }`}
            >
              <Upload className="w-9 h-9 text-[#94a3b8] mx-auto mb-3" />
              <p className="text-[14px] font-semibold text-[#0F1A2C]">Arrastra tu Connections.csv aquí</p>
              <p className="text-[12.5px] text-[#64748B] mt-1">o haz clic para seleccionarlo</p>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2.5 bg-[#F05252]/8 border border-[#F05252]/25 rounded-xl p-3.5">
                <AlertCircle className="w-4 h-4 text-[#F05252] flex-shrink-0 mt-0.5" />
                <p className="text-[13px] text-[#33475b]">{error}</p>
              </div>
            )}

            <p className="mt-4 text-[11.5px] text-[#94a3b8] leading-relaxed">
              El archivo se procesa en tu navegador. Nada se envía a ningún servidor.
            </p>
          </div>
        )}

        {/* ---------- PASO 2: revisar ---------- */}
        {step === 'review' && (
          <>
            <div className="px-6 py-3.5 border-b border-[#eef2f6] flex flex-wrap items-center gap-2.5 flex-shrink-0">
              <span className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
                <FileText className="w-3.5 h-3.5" /> {fileName}
              </span>
              <div className="relative ml-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar nombre, fondo o cargo..."
                  className="bg-[#f4fafc] border border-[#dceaf2] rounded-xl pl-9 pr-3 py-1.5 text-[12.5px] text-[#0F1A2C] placeholder-[#94a3b8] focus:outline-none focus:border-[#47B6E6] w-[220px]"
                />
              </div>
              <label className="flex items-center gap-2 text-[12.5px] text-[#33475b] cursor-pointer">
                <input type="checkbox" checked={onlyDetected} onChange={(e) => setOnlyDetected(e.target.checked)} className="w-4 h-4 accent-[#0E457F] cursor-pointer" />
                Solo fondos detectados
              </label>
            </div>

            <div className="px-6 py-2 border-b border-[#eef2f6] flex items-center justify-between flex-shrink-0 bg-[#fbfdfe]">
              <button onClick={toggleAllVisible} className="text-[12px] font-semibold text-[#0E457F] hover:text-[#0A365F] cursor-pointer">
                Seleccionar / quitar visibles ({filtered.length})
              </button>
              <span className="text-[12px] text-[#64748B]">{selected.size} seleccionados</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="py-16 text-center text-[13px] text-[#94a3b8]">Nada que mostrar con ese filtro.</div>
              ) : (
                <table className="w-full text-left">
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {filtered.map((c) => {
                      const k = keyOf(c);
                      const isSel = selected.has(k);
                      return (
                        <tr key={k} onClick={() => toggle(c)} className={`cursor-pointer transition-colors ${isSel ? 'bg-[#0E457F]/4' : 'hover:bg-[#fafcfe]'}`}>
                          <td className="pl-6 pr-2 py-3 w-10">
                            <input type="checkbox" checked={isSel} onChange={() => toggle(c)} onClick={(e) => e.stopPropagation()} className="w-4 h-4 accent-[#0E457F] cursor-pointer" />
                          </td>
                          <td className="px-2 py-3">
                            <div className="text-[13.5px] font-semibold text-[#0F1A2C]">{fullName(c)}</div>
                            <div className="text-[11.5px] text-[#64748B]">{c.position || '—'}</div>
                          </td>
                          <td className="px-2 py-3">
                            <div className="text-[13px] text-[#33475b] font-medium">{c.company || '—'}</div>
                            {c.matches.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {c.matches.slice(0, 3).map((m) => (
                                  <span key={m} className="text-[9.5px] font-bold uppercase bg-[#10CC82]/12 text-[#0f9c66] px-1.5 py-0.5 rounded">{m}</span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-2 py-3 text-right">
                            {c.isFund && <CheckCircle2 className="w-4 h-4 text-[#10CC82] inline-block" />}
                          </td>
                          <td className="pr-6 pl-2 py-3 text-right w-10">
                            {c.url && (
                              <a href={c.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} title="Ver perfil"
                                 className="p-1.5 rounded-lg text-[#0A66C2] hover:bg-[#0A66C2]/10 inline-block">
                                <Linkedin className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[#eef2f6] flex justify-between items-center flex-shrink-0">
              <button onClick={() => { setStep('upload'); setRows([]); setSelected(new Set()); }} className="text-[13px] text-[#64748B] hover:text-[#0F1A2C] cursor-pointer">
                ← Subir otro archivo
              </button>
              <button
                onClick={doImport}
                disabled={selected.size === 0}
                className="px-4 py-2.5 bg-[#0E457F] hover:bg-[#0A365F] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-[13.5px] flex items-center gap-2 cursor-pointer"
              >
                Importar {selected.size} a Inversionistas <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
