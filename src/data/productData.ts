export type ProductKey = 'aerolineas' | 'aeropuertos';

export type BacklogStatus = 'Backlog' | 'Por hacer' | 'En progreso' | 'Review' | 'Hecho';
export type BacklogType = 'Historia' | 'Bug' | 'Spike' | 'Tarea';
export type BacklogPriority = 'Crítica' | 'Alta' | 'Media' | 'Baja';

/**
 * Versión de los datos semilla de Producto.
 *
 * Súbela cada vez que cambien INITIAL_BACKLOG / INITIAL_SPRINTS / INITIAL_EPICS
 * y quieras que el cambio reemplace lo que ya está guardado en el navegador.
 * Sin esto, quien ya abrió el CRM se queda con la versión antigua para siempre.
 */
export const PRODUCT_SEED_VERSION = 2;

export interface BacklogComment {
  id: string;
  author: string;
  text: string;
  /** ISO 'yyyy-mm-dd' */
  date: string;
}

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
  /** Hilo de comentarios del equipo. Ausente en ítems creados antes de la función. */
  comments?: BacklogComment[];
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
    tagline: 'API de compensación al pasajero — vouchers, tarjetas y, después, SaaS y MCP',
    accent: '#0E457F'
  },
  {
    key: 'aeropuertos',
    name: 'AI Aeropuertos',
    tagline: 'En descubrimiento — maqueta de la interfaz e investigación de APIs',
    accent: '#47B6E6'
  }
];

/**
 * Épicas por producto, en orden de roadmap.
 *
 * Se guardan aparte de los ítems para poder crear una épica vacía y para que
 * el orden del backlog sea el del roadmap, no el de creación de los ítems.
 */
export const INITIAL_EPICS: Record<ProductKey, string[]> = {
  aerolineas: [
    'Compensación · Vouchers',
    'Compensación · Tarjetas',
    'API',
    'Plataforma SaaS',
    'MCP'
  ],
  aeropuertos: ['Descubrimiento', 'Maqueta de interfaz', 'Datos e integraciones']
};

export const INITIAL_SPRINTS: Sprint[] = [
  // ---------------------------- Aerolíneas ----------------------------
  {
    id: 'sp-al-mvp',
    product: 'aerolineas',
    name: 'MVP Vouchering',
    goal: 'Compensación por voucher de punta a punta, expuesta como API',
    range: '15 Jun — 31 Jul 2026',
    status: 'Cerrado'
  },
  {
    id: 'sp-al-cards',
    product: 'aerolineas',
    name: 'Tarjetas Visa / prepago',
    goal: 'Segundo método de compensación: tarjeta prepago además del voucher',
    range: '10 Ago — 4 Sep 2026',
    status: 'Activo'
  },
  {
    id: 'sp-al-saas',
    product: 'aerolineas',
    name: 'Plataforma SaaS',
    goal: 'Maqueta del panel para que la aerolínea opere sin tocar la API',
    range: '7 Sep — 2 Oct 2026',
    status: 'Planificado'
  },

  // ---------------------------- Aeropuertos ---------------------------
  {
    id: 'sp-ap-disc',
    product: 'aeropuertos',
    name: 'Descubrimiento',
    goal: 'Entender el problema, mapear las APIs disponibles y maquetar la interfaz',
    range: '10 Ago — 4 Sep 2026',
    status: 'Activo'
  }
];

export const INITIAL_BACKLOG: BacklogItem[] = [
  /* =========================== AEROLÍNEAS ===========================
   * Estado real: el MVP de compensación por voucher funciona y está
   * expuesto como API documentada. Lo que se está construyendo ahora es
   * el segundo método de compensación (tarjeta Visa / prepago). SaaS y
   * MCP están planteados, sin empezar.
   * ================================================================= */

  // ---- Compensación · Vouchers (MVP funcional) ----
  {
    id: 'AL-001',
    product: 'aerolineas',
    epic: 'Compensación · Vouchers',
    title: 'Motor de emisión de vouchers',
    description: 'Generar el voucher de compensación a partir de la incidencia del vuelo',
    type: 'Historia',
    priority: 'Crítica',
    points: 13,
    status: 'Hecho',
    sprintId: 'sp-al-mvp',
    assignee: 'Juan Diego'
  },
  {
    id: 'AL-002',
    product: 'aerolineas',
    epic: 'Compensación · Vouchers',
    title: 'Canje y validación del voucher',
    description: 'Validar el voucher en el punto de canje y marcarlo como consumido',
    type: 'Historia',
    priority: 'Alta',
    points: 8,
    status: 'Hecho',
    sprintId: 'sp-al-mvp',
    assignee: 'Juan Diego'
  },
  {
    id: 'AL-003',
    product: 'aerolineas',
    epic: 'Compensación · Vouchers',
    title: 'Reglas de elegibilidad de la compensación',
    description: 'Decidir si el pasajero tiene derecho a compensación y por cuánto',
    type: 'Historia',
    priority: 'Crítica',
    points: 8,
    status: 'Hecho',
    sprintId: 'sp-al-mvp',
    assignee: 'Juan Diego'
  },

  // ---- Compensación · Tarjetas (en curso) ----
  {
    id: 'AL-010',
    product: 'aerolineas',
    epic: 'Compensación · Tarjetas',
    title: 'Spike: proveedor de emisión de tarjetas prepago',
    description: 'Comparar emisores (fees, cobertura, tiempos de alta y requisitos regulatorios)',
    type: 'Spike',
    priority: 'Crítica',
    points: 5,
    status: 'En progreso',
    sprintId: 'sp-al-cards',
    assignee: 'Sebastian M.'
  },
  {
    id: 'AL-011',
    product: 'aerolineas',
    epic: 'Compensación · Tarjetas',
    title: 'Emisión de tarjeta prepago Visa',
    description: 'Crear la tarjeta a nombre del pasajero al aprobarse la compensación',
    type: 'Historia',
    priority: 'Crítica',
    points: 13,
    status: 'Por hacer',
    sprintId: 'sp-al-cards',
    assignee: 'Juan Diego'
  },
  {
    id: 'AL-012',
    product: 'aerolineas',
    epic: 'Compensación · Tarjetas',
    title: 'Carga de saldo desde la compensación aprobada',
    description: 'Abonar en la tarjeta el importe que hoy se emite como voucher',
    type: 'Historia',
    priority: 'Alta',
    points: 8,
    status: 'Por hacer',
    sprintId: 'sp-al-cards',
    assignee: 'Juan Diego'
  },
  {
    id: 'AL-013',
    product: 'aerolineas',
    epic: 'Compensación · Tarjetas',
    title: 'Elección del método de compensación',
    description: 'Que la aerolínea (o el pasajero) elija entre voucher y tarjeta en la misma llamada',
    type: 'Historia',
    priority: 'Alta',
    points: 5,
    status: 'Por hacer',
    sprintId: 'sp-al-cards',
    assignee: 'Sin asignar'
  },
  {
    id: 'AL-014',
    product: 'aerolineas',
    epic: 'Compensación · Tarjetas',
    title: 'Verificación de identidad del pasajero (KYC)',
    description: 'Requisito del emisor para poder entregar una tarjeta nominativa',
    type: 'Historia',
    priority: 'Alta',
    points: 8,
    status: 'Backlog',
    sprintId: null,
    assignee: 'Sin asignar'
  },

  // ---- API (el producto tal y como se vende hoy) ----
  {
    id: 'AL-020',
    product: 'aerolineas',
    epic: 'API',
    title: 'Endpoints de compensación',
    description: 'Superficie pública de la API: alta de incidencia, cálculo y emisión',
    type: 'Historia',
    priority: 'Crítica',
    points: 8,
    status: 'Hecho',
    sprintId: 'sp-al-mvp',
    assignee: 'Juan Diego'
  },
  {
    id: 'AL-021',
    product: 'aerolineas',
    epic: 'API',
    title: 'Documentación de la API',
    description: 'Referencia publicada para que un cliente integre sin acompañamiento',
    type: 'Tarea',
    priority: 'Alta',
    points: 5,
    status: 'Hecho',
    sprintId: 'sp-al-mvp',
    assignee: 'Sebastian M.'
  },
  {
    id: 'AL-022',
    product: 'aerolineas',
    epic: 'API',
    title: 'Entorno sandbox para clientes',
    description: 'Credenciales de prueba y datos simulados para que integren sin riesgo',
    type: 'Historia',
    priority: 'Media',
    points: 5,
    status: 'Backlog',
    sprintId: null,
    assignee: 'Sin asignar'
  },

  // ---- Plataforma SaaS (siguiente) ----
  {
    id: 'AL-030',
    product: 'aerolineas',
    epic: 'Plataforma SaaS',
    title: 'Maqueta del panel de la aerolínea',
    description: 'Cómo ve la aerolínea sus incidencias y compensaciones sin tocar la API',
    type: 'Historia',
    priority: 'Media',
    points: 8,
    status: 'Backlog',
    sprintId: 'sp-al-saas',
    assignee: 'Sin asignar'
  },
  {
    id: 'AL-031',
    product: 'aerolineas',
    epic: 'Plataforma SaaS',
    title: 'Multi-tenant y roles',
    description: 'Separar los datos por aerolínea y definir qué puede hacer cada rol',
    type: 'Historia',
    priority: 'Media',
    points: 13,
    status: 'Backlog',
    sprintId: 'sp-al-saas',
    assignee: 'Sin asignar'
  },
  {
    id: 'AL-032',
    product: 'aerolineas',
    epic: 'Plataforma SaaS',
    title: 'Autoservicio de alta y credenciales',
    description: 'Que una aerolínea nueva se dé de alta y obtenga su API key sola',
    type: 'Historia',
    priority: 'Baja',
    points: 8,
    status: 'Backlog',
    sprintId: null,
    assignee: 'Sin asignar'
  },

  // ---- MCP (planteado) ----
  {
    id: 'AL-040',
    product: 'aerolineas',
    epic: 'MCP',
    title: 'Spike: alcance del servidor MCP',
    description: 'Qué herramientas expone y a qué agente/cliente sirve',
    type: 'Spike',
    priority: 'Media',
    points: 3,
    status: 'Backlog',
    sprintId: null,
    assignee: 'Sin asignar'
  },
  {
    id: 'AL-041',
    product: 'aerolineas',
    epic: 'MCP',
    title: 'Servidor MCP sobre la API de compensación',
    description: 'Envolver los endpoints existentes como herramientas MCP',
    type: 'Historia',
    priority: 'Media',
    points: 8,
    status: 'Backlog',
    sprintId: null,
    assignee: 'Sin asignar'
  },

  /* =========================== AEROPUERTOS ==========================
   * Producto desde cero: aún no hay nada construido. La fase actual es
   * descubrimiento — entender el problema, mapear qué APIs existen
   * (Meta entre ellas) y maquetar la interfaz antes de escribir código.
   * ================================================================= */

  // ---- Descubrimiento ----
  {
    id: 'AP-001',
    product: 'aeropuertos',
    epic: 'Descubrimiento',
    title: 'Definir el problema y a quién se lo resolvemos',
    description: 'Usuario objetivo dentro del aeropuerto y decisión concreta que le ayudamos a tomar',
    type: 'Tarea',
    priority: 'Alta',
    points: 3,
    status: 'En progreso',
    sprintId: 'sp-ap-disc',
    assignee: 'Sebastian M.'
  },
  {
    id: 'AP-002',
    product: 'aeropuertos',
    epic: 'Descubrimiento',
    title: 'Spike: APIs de Meta — alcance, límites y coste',
    description: 'Qué se puede hacer, qué permisos y revisión exige, y qué cuesta a nuestro volumen',
    type: 'Spike',
    priority: 'Alta',
    points: 5,
    status: 'Por hacer',
    sprintId: 'sp-ap-disc',
    assignee: 'Sin asignar'
  },
  {
    id: 'AP-003',
    product: 'aeropuertos',
    epic: 'Descubrimiento',
    title: 'Mapa de fuentes de datos del aeropuerto',
    description: 'Qué datos existen, quién los tiene y en qué condiciones los cede',
    type: 'Spike',
    priority: 'Alta',
    points: 5,
    status: 'Por hacer',
    sprintId: 'sp-ap-disc',
    assignee: 'Sin asignar'
  },

  // ---- Maqueta de interfaz ----
  {
    id: 'AP-010',
    product: 'aeropuertos',
    epic: 'Maqueta de interfaz',
    title: 'Wireframes de las pantallas principales',
    description: 'Trazo rápido de las vistas clave antes de invertir en diseño fino',
    type: 'Historia',
    priority: 'Alta',
    points: 8,
    status: 'Por hacer',
    sprintId: 'sp-ap-disc',
    assignee: 'Sin asignar'
  },
  {
    id: 'AP-011',
    product: 'aeropuertos',
    epic: 'Maqueta de interfaz',
    title: 'Maqueta navegable',
    description: 'Prototipo clicable para enseñar y validar sin backend',
    type: 'Historia',
    priority: 'Media',
    points: 13,
    status: 'Backlog',
    sprintId: null,
    assignee: 'Sin asignar'
  },
  {
    id: 'AP-012',
    product: 'aeropuertos',
    epic: 'Maqueta de interfaz',
    title: 'Validar la maqueta con un aeropuerto',
    description: 'Enseñarla a alguien de operación y recoger qué sobra y qué falta',
    type: 'Tarea',
    priority: 'Media',
    points: 3,
    status: 'Backlog',
    sprintId: null,
    assignee: 'Sin asignar'
  },

  // ---- Datos e integraciones ----
  {
    id: 'AP-020',
    product: 'aeropuertos',
    epic: 'Datos e integraciones',
    title: 'Spike: viabilidad técnica de la ingesta',
    description: 'Cómo entrarían los datos y qué haría falta para sostenerlo',
    type: 'Spike',
    priority: 'Media',
    points: 5,
    status: 'Backlog',
    sprintId: null,
    assignee: 'Sin asignar'
  }
];

/** Parsea "19 Jun — 2 Jul 2026" a fechas aproximadas (burndown y alertas de ritmo) */
export const parseSprintRange = (range: string): { start: Date; end: Date } | null => {
  const MONTHS: Record<string, number> = {
    ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
    jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11
  };
  const m = range.match(/(\d{1,2})\s+(\w{3})\w*\s*—\s*(\d{1,2})\s+(\w{3})\w*\s+(\d{4})/i);
  if (!m) return null;
  const [, d1, mo1, d2, mo2, yr] = m;
  const monthOf = (s: string) => MONTHS[s.toLowerCase().slice(0, 3)];
  const y = Number(yr);
  return {
    start: new Date(y, monthOf(mo1) ?? 0, Number(d1)),
    end: new Date(y, monthOf(mo2) ?? 0, Number(d2))
  };
};

export const BACKLOG_STATUSES: BacklogStatus[] = ['Backlog', 'Por hacer', 'En progreso', 'Review', 'Hecho'];

export const TEAM_MEMBERS = ['Juan Diego', 'Sebastian M.', 'Sin asignar'];

export const ID_PREFIX: Record<ProductKey, string> = {
  aerolineas: 'AL',
  aeropuertos: 'AP'
};

/**
 * Siguiente id libre del producto (AL-042, AP-021…).
 *
 * Correlativo en vez de aleatorio: con ids al azar dos ítems podían salir
 * con el mismo número y React los trataba como uno solo.
 */
export const nextItemId = (items: BacklogItem[], product: ProductKey): string => {
  const prefix = ID_PREFIX[product];
  const max = items
    .filter((i) => i.product === product)
    .reduce((acc, i) => {
      const n = Number(i.id.split('-')[1]);
      return Number.isFinite(n) && n > acc ? n : acc;
    }, 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
};

/** Épicas del producto: las registradas primero (orden de roadmap), luego las que solo existen en ítems */
export const epicsOf = (
  registry: Record<ProductKey, string[]>,
  items: BacklogItem[],
  product: ProductKey
): string[] => {
  const registered = registry[product] ?? [];
  const extra = items
    .filter((i) => i.product === product && !registered.includes(i.epic))
    .map((i) => i.epic);
  return [...registered, ...Array.from(new Set(extra)).sort()];
};
