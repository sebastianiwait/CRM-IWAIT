import React from 'react';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

interface LoginScreenProps {
  onGoogle: () => void;
  onDemo: () => void;
  loading: boolean;
  error: string | null;
  /** false en producción: oculta el acceso sin autenticación */
  demoEnabled: boolean;
  /** dominio de correo permitido, para mostrarlo al usuario */
  allowedDomain: string;
}

/** Logotipo oficial de Google para el botón de acceso */
const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

export default function LoginScreen({
  onGoogle,
  onDemo,
  loading,
  error,
  demoEnabled,
  allowedDomain
}: LoginScreenProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* --- Panel de marca --- */}
      <div className="lg:w-[45%] bg-gradient-to-br from-[#0E457F] to-[#47B6E6] text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-16 -bottom-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -left-10 top-10 w-56 h-56 rounded-full bg-white/10 blur-2xl"></div>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center font-extrabold text-[14px]">
            iw
          </div>
          <div>
            <div className="text-[17px] font-extrabold tracking-tight leading-tight">
              iwait<span className="text-white/60">.</span>
            </div>
            <div className="text-[9.5px] tracking-wider uppercase font-mono font-bold text-white/70">Platform CRM</div>
          </div>
        </div>

        <div className="relative z-10 py-12 lg:py-0">
          <h1 className="text-[30px] sm:text-[38px] font-extrabold leading-[1.1] tracking-tight">
            El mejor socio digital<br className="hidden sm:block" /> en un aeropuerto.
          </h1>
          <p className="text-[15px] text-white/85 mt-4 max-w-md leading-relaxed">
            Inversionistas, pipeline comercial y el progreso del equipo de producto — todo en un mismo lugar.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-x-8 gap-y-2 text-[11px] font-mono uppercase tracking-wider text-white/60">
          <span>Fundraising</span>
          <span>CRM comercial</span>
          <span>Sprints & backlog</span>
        </div>
      </div>

      {/* --- Panel de acceso --- */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[380px]">
          <h2 className="text-[24px] font-bold text-[#0F1A2C] tracking-tight">Inicia sesión</h2>
          <p className="text-[13.5px] text-[#64748B] mt-1.5">Accede con tu cuenta corporativa de iwait.</p>

          <button
            onClick={onGoogle}
            disabled={loading}
            className="mt-7 w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[#e6eef4] bg-white hover:bg-[#f5f9fc] hover:border-[#cbd5e1] shadow-sm text-[14px] font-semibold text-[#33475b] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <GoogleMark />}
            Continuar con Google
          </button>

          {error && (
            <div className="mt-4 flex items-start gap-2.5 bg-[#F5A623]/8 border border-[#F5A623]/30 rounded-xl p-3.5">
              <AlertCircle className="w-4 h-4 text-[#F5A623] flex-shrink-0 mt-0.5" />
              <p className="text-[12.5px] text-[#33475b] leading-relaxed">{error}</p>
            </div>
          )}

          {/* El acceso sin autenticación solo existe en desarrollo: en un build
              de producción demoEnabled es false y Vite elimina este bloque. */}
          {demoEnabled && (
            <>
              <div className="flex items-center gap-3 my-6">
                <span className="flex-1 h-px bg-[#e6eef4]" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                  solo desarrollo
                </span>
                <span className="flex-1 h-px bg-[#e6eef4]" />
              </div>

              <button
                onClick={onDemo}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-[#dceaf2] hover:border-[#0E457F] text-[#33475b] hover:text-[#0E457F] text-[14px] font-semibold transition-colors cursor-pointer"
              >
                Entrar en modo demo <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11.5px] text-[#94a3b8] mt-2.5 text-center leading-relaxed">
                Salta la autenticación. No aparece en producción.
              </p>
            </>
          )}

          <p className="text-[11.5px] text-[#94a3b8] mt-7 text-center leading-relaxed">
            Acceso restringido a cuentas <strong className="text-[#64748B]">@{allowedDomain}</strong>.
          </p>

          <p className="text-[11px] text-[#94a3b8] mt-6 text-center">
            © 2026 iwait · Plataforma interna
          </p>
        </div>
      </div>
    </div>
  );
}
