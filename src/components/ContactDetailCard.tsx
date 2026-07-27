import React from 'react';
import { X, Mail, Linkedin, ExternalLink } from 'lucide-react';

export interface DetailField {
  label: string;
  value: string;
}

interface ContactDetailCardProps {
  title: string;
  subtitle?: string;
  badge?: { label: string; className: string };
  fields: DetailField[];
  email?: string;
  linkedin?: string;
  icon?: React.ReactNode;
  onClose: () => void;
}

export default function ContactDetailCard({
  title,
  subtitle,
  badge,
  fields,
  email,
  linkedin,
  icon,
  onClose
}: ContactDetailCardProps) {
  const initials = title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0F1A2C]/40 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-zoom-in">
        {/* Header */}
        <div className="px-6 pt-6 pb-5 bg-gradient-to-br from-[#0E457F] to-[#47B6E6] text-white relative overflow-hidden">
          <div className="absolute -right-8 -bottom-10 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white p-1"><X className="w-5 h-5" /></button>
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-[18px] font-extrabold flex-shrink-0">
              {icon ?? initials}
            </div>
            <div className="min-w-0">
              <h3 className="text-[19px] font-bold leading-tight truncate">{title}</h3>
              {subtitle && <p className="text-[13px] text-white/85 truncate">{subtitle}</p>}
              {badge && (
                <span className={`inline-block mt-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white`}>
                  {badge.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="px-6 py-5 grid grid-cols-2 gap-x-4 gap-y-4">
          {fields.map((f) => (
            <div key={f.label} className={f.value.length > 24 ? 'col-span-2' : ''}>
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">{f.label}</div>
              <div className="text-[14px] font-semibold text-[#0F1A2C] mt-0.5 break-words">{f.value}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        {(email || linkedin) && (
          <div className="px-6 pb-6 flex flex-wrap gap-2.5">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0E457F] hover:bg-[#0A365F] text-white text-[13px] font-semibold transition-colors"
              >
                <Mail className="w-4 h-4" /> Enviar correo
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0A66C2] hover:bg-[#08528f] text-white text-[13px] font-semibold transition-colors"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
