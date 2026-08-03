/* ------------------------------------------------------------------ */
/*  CRM comercial — modelo "deal con contactos embebidos" (tipo HubSpot) */
/* ------------------------------------------------------------------ */

export type DealStage =
  | 'Prospecto'
  | 'Contacto establecido'
  | 'Demo / Piloto'
  | 'Propuesta'
  | 'Negociación'
  | 'Cerrado ganado'
  | 'Cerrado perdido';

export type CompanyType = 'Aerolínea' | 'Aeropuerto' | 'Comercio' | 'Handling' | 'OTA / Agencia';

export type ActivityKind = 'Nota' | 'Llamada' | 'Reunión' | 'Email';

export interface DealContact {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  isPrimary?: boolean;
}

export interface DealActivity {
  id: string;
  kind: ActivityKind;
  text: string;
  /** ISO 'yyyy-mm-dd' */
  date: string;
  author: string;
  /** true para eventos generados por el sistema (p. ej. cambio de etapa) */
  system?: boolean;
}

export interface Deal {
  id: string;
  name: string;
  company: string;
  companyType: CompanyType;
  stage: DealStage;
  amount: number;
  /** ISO 'yyyy-mm-dd' */
  closeDate: string;
  owner: string;
  hub?: string;
  passengersMonthly?: number;
  source?: string;
  /** override manual de probabilidad; si falta se deriva de la etapa */
  probability?: number;
  companyLinkedin?: string;
  notes?: string;
  /** Siguiente paso concreto acordado con la cuenta */
  nextAction?: string;
  /** ISO 'yyyy-mm-dd' en que debe hacerse ese siguiente paso */
  nextActionDate?: string;
  createdAt: string;
  updatedAt?: string;
  contacts: DealContact[];
  activities: DealActivity[];
}

/* ---------------------------- Etapas ------------------------------ */

export interface StageMeta {
  key: DealStage;
  accent: string;
  probability: number;
  /** etapas finales: ya no cuentan como pipeline abierto */
  terminal?: boolean;
}

export const DEAL_STAGES: StageMeta[] = [
  { key: 'Prospecto', accent: '#64748B', probability: 10 },
  { key: 'Contacto establecido', accent: '#47B6E6', probability: 25 },
  { key: 'Demo / Piloto', accent: '#8B63F5', probability: 45 },
  { key: 'Propuesta', accent: '#F5A623', probability: 65 },
  { key: 'Negociación', accent: '#0E457F', probability: 85 },
  { key: 'Cerrado ganado', accent: '#10CC82', probability: 100, terminal: true },
  { key: 'Cerrado perdido', accent: '#F05252', probability: 0, terminal: true }
];

export const COMPANY_TYPES: CompanyType[] = ['Aerolínea', 'Aeropuerto', 'Comercio', 'Handling', 'OTA / Agencia'];

export const DEAL_OWNERS = ['Sebastian M.', 'Juan Diego'];

export const ACTIVITY_KINDS: ActivityKind[] = ['Nota', 'Llamada', 'Reunión', 'Email'];

/* ---------------------------- Helpers ----------------------------- */

export const money = (n: number): string => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
};

/** Formatea 'yyyy-mm-dd' sin desfase de zona horaria */
export const formatDate = (iso: string): string => {
  if (!iso) return '—';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

export const stageMeta = (stage: DealStage): StageMeta =>
  DEAL_STAGES.find((s) => s.key === stage) ?? DEAL_STAGES[0];

export const isOpen = (deal: Deal): boolean => !stageMeta(deal.stage).terminal;

export const dealProbability = (deal: Deal): number =>
  deal.probability ?? stageMeta(deal.stage).probability;

export const weightedValue = (deal: Deal): number =>
  Math.round((deal.amount * dealProbability(deal)) / 100);

export const lastActivity = (deal: Deal): DealActivity | null => {
  if (deal.activities.length === 0) return null;
  return [...deal.activities].sort((a, b) => b.date.localeCompare(a.date))[0];
};

export const newId = (prefix: string): string => {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
};

export const primaryContact = (deal: Deal): DealContact | undefined =>
  deal.contacts.find((c) => c.isPrimary) ?? deal.contacts[0];

/* ------------------------ Alertas de seguimiento ------------------- */

/** Días transcurridos desde una fecha ISO (negativo si es futura) */
export const daysSince = (iso: string): number =>
  Math.floor((new Date(`${todayISO()}T00:00:00`).getTime() - new Date(`${iso}T00:00:00`).getTime()) / 86400000);

/** Días sin ninguna actividad registrada. null si nunca hubo. */
export const daysInactive = (deal: Deal): number | null => {
  const last = lastActivity(deal);
  return last ? daysSince(last.date) : null;
};

/** Umbral a partir del cual un negocio abierto se considera enfriándose */
export const STALE_DAYS = 10;

export const isStale = (deal: Deal): boolean => {
  if (!isOpen(deal)) return false;
  const d = daysInactive(deal);
  return d !== null && d >= STALE_DAYS;
};

/** La próxima acción venció y el negocio sigue abierto */
export const isNextActionOverdue = (deal: Deal): boolean =>
  isOpen(deal) && !!deal.nextActionDate && deal.nextActionDate < todayISO();

/** Negocio abierto sin próxima acción definida: nadie sabe qué sigue */
export const hasNoNextAction = (deal: Deal): boolean => isOpen(deal) && !deal.nextAction;

export type DealAlert = 'overdue' | 'stale' | 'no-next-step';

/** Alerta más urgente del negocio, o null si va bien */
export const dealAlert = (deal: Deal): DealAlert | null => {
  if (isNextActionOverdue(deal)) return 'overdue';
  if (isStale(deal)) return 'stale';
  if (hasNoNextAction(deal)) return 'no-next-step';
  return null;
};

export const ALERT_META: Record<DealAlert, { label: string; color: string; short: string }> = {
  overdue: { label: 'Próxima acción vencida', color: '#F05252', short: 'Vencida' },
  stale: { label: `Sin actividad hace ${STALE_DAYS}+ días`, color: '#F5A623', short: 'Enfriándose' },
  'no-next-step': { label: 'Sin próxima acción definida', color: '#94a3b8', short: 'Sin plan' }
};

/* ------------------------- Datos iniciales ------------------------ */

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-jetsmart-scl',
    name: 'JetSMART — Piloto de compensaciones SCL',
    company: 'JetSMART Airlines',
    companyType: 'Aerolínea',
    stage: 'Demo / Piloto',
    amount: 80000,
    closeDate: '2026-10-15',
    owner: 'Sebastian M.',
    hub: 'Santiago (SCL) — A. M. Benítez',
    passengersMonthly: 300000,
    source: 'Outbound LinkedIn',
    companyLinkedin: 'https://www.linkedin.com/company/jetsmart/',
    notes:
      'ULCC del grupo Indigo Partners con operación en Chile, Argentina y Perú. Interés en digitalizar los vouchers de contingencia (hoy en papel) en SCL y luego replicar en AEP y LIM.',
    nextAction: 'Enviar propuesta con precio por pasajero compensado',
    nextActionDate: '2026-08-05',
    createdAt: '2026-06-12',
    updatedAt: '2026-07-20',
    contacts: [
      {
        id: 'ct-js-1',
        name: 'Camila Reyes',
        role: 'Gerente de Experiencia de Pasajero',
        email: 'camila.reyes@jetsmart.example',
        phone: '+56 9 5544 1122',
        linkedin: 'https://www.linkedin.com/company/jetsmart/',
        isPrimary: true
      },
      {
        id: 'ct-js-2',
        name: 'Rodrigo Fuentes',
        role: 'Jefe de Operaciones Aeroportuarias SCL',
        email: 'rodrigo.fuentes@jetsmart.example',
        phone: '+56 9 7788 3344'
      },
      {
        id: 'ct-js-3',
        name: 'Valentina Soto',
        role: 'Compras / Procurement',
        email: 'valentina.soto@jetsmart.example'
      }
    ],
    activities: [
      {
        id: 'ac-js-1',
        kind: 'Email',
        text: 'Primer contacto con one-pager de compensaciones automáticas. Respondieron pidiendo una llamada.',
        date: '2026-06-12',
        author: 'Sebastian M.'
      },
      {
        id: 'ac-js-2',
        kind: 'Llamada',
        text: 'Discovery con Camila Reyes: manejan ~40 vuelos/mes con demora mayor a 2h en SCL. Hoy entregan vouchers en papel.',
        date: '2026-06-25',
        author: 'Sebastian M.'
      },
      {
        id: 'ac-js-3',
        kind: 'Reunión',
        text: 'Demo del flujo WhatsApp + QR con el equipo de operaciones. Piden un piloto de 60 días acotado a SCL.',
        date: '2026-07-08',
        author: 'Juan Diego'
      },
      {
        id: 'ac-js-4',
        kind: 'Nota',
        text: 'Pendiente enviar propuesta con precio por pasajero compensado antes del 5 de agosto.',
        date: '2026-07-20',
        author: 'Sebastian M.'
      }
    ]
  }
];
