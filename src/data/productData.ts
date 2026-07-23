export type ProductKey = 'aerolineas' | 'aeropuertos';

export type BacklogStatus = 'Backlog' | 'Por hacer' | 'En progreso' | 'Review' | 'Hecho';
export type BacklogType = 'Historia' | 'Bug' | 'Spike' | 'Tarea';
export type BacklogPriority = 'Crítica' | 'Alta' | 'Media' | 'Baja';

export interface BacklogItem {
  id: string;
  product: ProductKey;
  epic: string;
  title: string;
  description: string;
  type: BacklogType;
  priority: BacklogPriority;
  points: number;
  status: BacklogStatus;
  /** Sprint id, or null when still in the raw backlog */
  sprintId: string | null;
  assignee: string;
}

export interface Sprint {
  id: string;
  product: ProductKey;
  name: string;
  goal: string;
  range: string;
  status: 'Activo' | 'Planificado' | 'Cerrado';
}

export const PRODUCTS: {
  key: ProductKey;
  name: string;
  tagline: string;
  accent: string;
}[] = [
  {
    key: 'aerolineas',
    name: 'Aerolíneas',
    tagline: 'Compensaciones, vouchers y experiencia del pasajero',
    accent: '#0E457F'
  },
  {
    key: 'aeropuertos',
    name: 'AI Aeropuertos',
    tagline: 'Predicción de colas, dashboards y operación en terminal',
    accent: '#47B6E6'
  }
];

export const INITIAL_SPRINTS: Sprint[] = [
  { id: 'sp-al-12', product: 'aerolineas', name: 'Sprint 12', goal: 'Cerrar el flujo de compensación automática', range: '19 Jun — 2 Jul 2026', status: 'Activo' },
  { id: 'sp-al-13', product: 'aerolineas', name: 'Sprint 13', goal: 'Wallet pass y notificaciones al pasajero', range: '3 Jul — 16 Jul 2026', status: 'Planificado' },
  { id: 'sp-ap-08', product: 'aeropuertos', name: 'Sprint 8', goal: 'Predictor de colas v2 en producción', range: '19 Jun — 2 Jul 2026', status: 'Activo' },
  { id: 'sp-ap-09', product: 'aeropuertos', name: 'Sprint 9', goal: 'Dashboard en vivo multi-terminal', range: '3 Jul — 16 Jul 2026', status: 'Planificado' }
];

export const INITIAL_BACKLOG: BacklogItem[] = [
  // ---------- Aerolíneas ----------
  { id: 'AL-101', product: 'aerolineas', epic: 'Compensaciones', title: 'Motor de reglas de compensación', description: 'Calcular compensación según normativa EU261 y política de la aerolínea', type: 'Historia', priority: 'Crítica', points: 13, status: 'En progreso', sprintId: 'sp-al-12', assignee: 'Juan Diego' },
  { id: 'AL-102', product: 'aerolineas', epic: 'Compensaciones', title: 'Emisión automática de vouchers', description: 'Generar y enviar voucher digital al confirmar la compensación', type: 'Historia', priority: 'Alta', points: 8, status: 'En progreso', sprintId: 'sp-al-12', assignee: 'Juan Diego' },
  { id: 'AL-103', product: 'aerolineas', epic: 'Compensaciones', title: 'Pagos SEPA instantáneos', description: 'Integración con bancos europeos para transferencias automáticas', type: 'Historia', priority: 'Media', points: 8, status: 'Por hacer', sprintId: 'sp-al-12', assignee: 'Sebastian M.' },
  { id: 'AL-104', product: 'aerolineas', epic: 'Onboarding pasajero', title: 'Validación de pasaporte vía OCR', description: 'Escaneo de ID nacional desde WhatsApp para asentar el cupón', type: 'Historia', priority: 'Media', points: 8, status: 'Hecho', sprintId: 'sp-al-12', assignee: 'Juan Diego' },
  { id: 'AL-105', product: 'aerolineas', epic: 'Onboarding pasajero', title: 'Bug: duplicado de cupón al reintentar', description: 'Si el pasajero reintenta, se emite un segundo cupón', type: 'Bug', priority: 'Alta', points: 3, status: 'Hecho', sprintId: 'sp-al-12', assignee: 'Juan Diego' },
  { id: 'AL-106', product: 'aerolineas', epic: 'Wallet & notificaciones', title: 'Apple Wallet Pass del voucher', description: 'Añadir el voucher al Wallet con actualización en vivo', type: 'Historia', priority: 'Alta', points: 8, status: 'Backlog', sprintId: 'sp-al-13', assignee: 'Sin asignar' },
  { id: 'AL-107', product: 'aerolineas', epic: 'Wallet & notificaciones', title: 'Push proactivo de estado de vuelo', description: 'Avisar al pasajero antes de que pregunte', type: 'Historia', priority: 'Media', points: 5, status: 'Backlog', sprintId: 'sp-al-13', assignee: 'Sin asignar' },
  { id: 'AL-108', product: 'aerolineas', epic: 'Integraciones', title: 'Spike: API de Air Europa', description: 'Investigar viabilidad y límites de su API de vuelos', type: 'Spike', priority: 'Media', points: 5, status: 'Backlog', sprintId: null, assignee: 'Sin asignar' },
  { id: 'AL-109', product: 'aerolineas', epic: 'Integraciones', title: 'Conector Iberia T4', description: 'Sincronizar incidencias de vuelo en tiempo real', type: 'Historia', priority: 'Baja', points: 13, status: 'Backlog', sprintId: null, assignee: 'Sin asignar' },

  // ---------- Aeropuertos ----------
  { id: 'AP-201', product: 'aeropuertos', epic: 'AI Queue Predictor', title: 'Endpoint /predict de colas', description: 'Servir el modelo v2 vía API interna', type: 'Historia', priority: 'Crítica', points: 5, status: 'Hecho', sprintId: 'sp-ap-08', assignee: 'Juan Diego' },
  { id: 'AP-202', product: 'aeropuertos', epic: 'AI Queue Predictor', title: 'Refactor pipeline de ingesta', description: 'Normalizar eventos de sensores de aeropuerto', type: 'Tarea', priority: 'Media', points: 3, status: 'Hecho', sprintId: 'sp-ap-08', assignee: 'Juan Diego' },
  { id: 'AP-203', product: 'aeropuertos', epic: 'AI Queue Predictor', title: 'Alertas de degradación de modelo', description: 'Notificar cuando la precisión baje de 90%', type: 'Historia', priority: 'Alta', points: 5, status: 'Por hacer', sprintId: 'sp-ap-08', assignee: 'Juan Diego' },
  { id: 'AP-204', product: 'aeropuertos', epic: 'Live Dashboard', title: 'Dashboard live — websockets', description: 'Push de métricas en tiempo real al panel de terminal', type: 'Historia', priority: 'Crítica', points: 8, status: 'En progreso', sprintId: 'sp-ap-08', assignee: 'Juan Diego' },
  { id: 'AP-205', product: 'aeropuertos', epic: 'Live Dashboard', title: 'Cache de resultados por terminal', description: 'Reducir latencia de consultas repetidas', type: 'Tarea', priority: 'Media', points: 5, status: 'En progreso', sprintId: 'sp-ap-08', assignee: 'Sebastian M.' },
  { id: 'AP-206', product: 'aeropuertos', epic: 'Live Dashboard', title: 'Vista multi-terminal', description: 'Comparar terminales de un mismo aeropuerto', type: 'Historia', priority: 'Alta', points: 8, status: 'Backlog', sprintId: 'sp-ap-09', assignee: 'Sin asignar' },
  { id: 'AP-207', product: 'aeropuertos', epic: 'Escalabilidad', title: 'Sharding de datos multi-aeropuerto', description: 'Preparar el modelo para la red AENA completa', type: 'Historia', priority: 'Alta', points: 13, status: 'Backlog', sprintId: 'sp-ap-09', assignee: 'Sin asignar' },
  { id: 'AP-208', product: 'aeropuertos', epic: 'Analytics', title: 'Exportador de métricas a BI', description: 'Conector para el módulo de analytics', type: 'Tarea', priority: 'Baja', points: 8, status: 'Backlog', sprintId: null, assignee: 'Sin asignar' },
  { id: 'AP-209', product: 'aeropuertos', epic: 'I+D', title: 'Spike: AI Baggage Tracking', description: 'Investigación de viabilidad de tracking de equipaje', type: 'Spike', priority: 'Baja', points: 5, status: 'Backlog', sprintId: null, assignee: 'Sin asignar' }
];

export const BACKLOG_STATUSES: BacklogStatus[] = ['Backlog', 'Por hacer', 'En progreso', 'Review', 'Hecho'];

export const TEAM_MEMBERS = ['Juan Diego', 'Sebastian M.', 'Sin asignar'];
