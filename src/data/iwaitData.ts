export type InvestorStage = 'Contactado' | 'Reunión' | 'Due Diligence' | 'Compromiso' | 'Cerrado';

export interface Investor {
  id: string;
  name: string;
  firm: string;
  committedAmount: number;
  status: 'Firmado' | 'Pendiente' | 'Negociando';
  email: string;
  round: string;
  sharesPercent: number;
  stage?: InvestorStage;
  contact?: string;
  linkedin?: string;
}

export interface DataRoomFile {
  id: string;
  name: string;
  category: 'Legal' | 'Finanzas' | 'Producto' | 'Marketing';
  size: string;
  date: string;
  confidentiality: 'Público' | 'Confidencial' | 'Solo Directiva';
  description: string;
  detailedContent: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  column: 'Por Hacer' | 'En Progreso' | 'Hecho';
  priority: 'Alta' | 'Media' | 'Baja';
  department: 'Producto' | 'Clientes' | 'Inversionistas' | 'Aeropuerto' | 'Legal';
  assignedTo: string;
  dueDate: string;
}

export interface FlightDelay {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  scheduledTime: string;
  delayMinutes: number;
  status: 'A Tiempo' | 'Retrasado' | 'Crítico' | 'Cancelado' | 'Compensado';
  passengersCount: number;
}

export const INITIAL_INVESTORS: Investor[] = [
  { id: 'inv-1', name: 'Santiago de Alvear', firm: 'Pre-Seed Lead / Venture Capital', committedAmount: 150000, status: 'Firmado', email: 's.alvear@latamvc.com', round: 'Pre-Seed', sharesPercent: 3.5, stage: 'Cerrado', contact: 'Santiago de Alvear' },
  { id: 'inv-2', name: 'Mariana Gomez', firm: 'Angel Investor (Ex-Iata)', committedAmount: 50000, status: 'Firmado', email: 'mariana.gomez@exata.net', round: 'Pre-Seed', sharesPercent: 1.2, stage: 'Cerrado', contact: 'Mariana Gomez' },
  { id: 'inv-3', name: 'Andrés Pastrana', firm: 'Andes Ventures LLC', committedAmount: 250000, status: 'Firmado', email: 'pastrana@andesventures.com', round: 'Semilla', sharesPercent: 5.0, stage: 'Cerrado', contact: 'Andrés Pastrana', linkedin: 'https://www.linkedin.com/in/andrespastrana/' },
  { id: 'inv-4', name: 'Clara Ortiz', firm: 'SaaS Global Fund', committedAmount: 180000, status: 'Pendiente', email: 'c.ortiz@saasglobal.io', round: 'Semilla', sharesPercent: 3.6, stage: 'Due Diligence', contact: 'Clara Ortiz' },
  { id: 'inv-5', name: 'Sebastian Mazorra', firm: 'Founder & Investor Pool', committedAmount: 400000, status: 'Firmado', email: 'sebastian@iwait.io', round: 'Fundadores', sharesPercent: 52.4, stage: 'Cerrado', contact: 'Sebastian Mazorra' },
  { id: 'inv-6', name: 'AeroCapital SL', firm: 'Syndicate Airport Sector EMEA', committedAmount: 120000, status: 'Negociando', email: 'dealflow@aerocapital.es', round: 'Semilla', sharesPercent: 2.4, stage: 'Compromiso', contact: 'Luis Restrepo' },
  { id: 'inv-7', name: 'Nordic Angels', firm: 'Angel Syndicate (Nordics)', committedAmount: 90000, status: 'Negociando', email: 'deals@nordicangels.io', round: 'Semilla', sharesPercent: 0, stage: 'Reunión', contact: 'Erik Lund' },
  { id: 'inv-8', name: 'Blue Runway Capital', firm: 'Aviation-focused VC', committedAmount: 300000, status: 'Negociando', email: 'ir@bluerunway.vc', round: 'Semilla', sharesPercent: 0, stage: 'Contactado', contact: 'Priya Nair' }
];

export const INITIAL_DATA_ROOM: DataRoomFile[] = [
  {
    id: 'dr-1',
    name: 'IWAIT Pitch Deck - Inversionistas v2.4.pdf',
    category: 'Marketing',
    size: '14.2 MB',
    date: '12 Jun 2026',
    confidentiality: 'Público',
    description: 'Presentación oficial comercial de IWAIT para aeropuertos y aerolíneas. Incluye visión de mercado, NPS del pasajero y modelo SaaS de compensaciones.',
    detailedContent: `IWAIT - Pitch Deck de Negocio:
• Visión: Convertirse en el pasaporte digital de compensaciones más grande del mundo.
• Retorno de inversión (ROI): Ahorro del 60% en gestión de bonos físicos para aerolíneas.
• Alianzas comerciales: Integrado con 38 comercios en el Aeropuerto de Madrid (MAD) t4 y Bogotá (BOG).
• Modelo de Negocio: Fee por voucher emitido + suscripción mensual corporativa (SaaS).`
  },
  {
    id: 'dr-2',
    name: 'Proyecciones Financieras 2026-2029 [IWAIT].xlsx',
    category: 'Finanzas',
    size: '8.4 MB',
    date: '10 Jun 2026',
    confidentiality: 'Confidencial',
    description: 'Planilla de cashflow proyectado, margen operacional por volumen de pasajeros compensados en EMEA y LATAM.',
    detailedContent: `Resumen Financiero Proyectado:
• Ingresos Estimados Q4 2026: 350,000 USD.
• Costo de Adquisición de Cliente (CAC): 4,500 USD por Aerolínea.
• Margen Bruto: 76.5% impulsado por digitalización en WhatsApp.
• EBITDA Reconciliado: Estimado positivo para Q2 2027.`
  },
  {
    id: 'dr-3',
    name: 'Acuerdo de Privacidad (NDA) - IWAIT Estándar.pdf',
    category: 'Legal',
    size: '1.8 MB',
    date: '02 Ene 2026',
    confidentiality: 'Público',
    description: 'Acuerdo de no divulgación estándar internacional adaptado a regulaciones aeroportuarias de la IACO y GDPR.',
    detailedContent: `Acuerdo Legal General:
• Protección recíproca de bases de datos de pasajeros en tránsito.
• Marco de cumplimiento RGPD europeo y regulaciones de la Aeronáutica Civil Colombiana.
• Jurisdicción legal por defecto: Madrid, España / Bogotá, Colombia.`
  },
  {
    id: 'dr-4',
    name: 'Arquitectura de Integración API y WhatsApp API.pdf',
    category: 'Producto',
    size: '5.6 MB',
    date: '15 May 2026',
    confidentiality: 'Solo Directiva',
    description: 'Documentación técnica de microservicios. Expone la infraestructura de triggers automáticos tras retrasos de aerolíneas.',
    detailedContent: `Especificación Técnica (IWAIT Engine):
• Notificación vía Meta WhatsApp Cloud API mediante broker de mensajeria asíncrono.
• Generador dinámico de códigos QR con firma criptográfica simétrica SHA-256.
• Pasarela de pagos integrada de compensación (clearing automático en 24 horas con comercios de terminal).`
  },
  {
    id: 'dr-5',
    name: 'Contrato Marco de Operación - Iberia Airlines MAD.pdf',
    category: 'Legal',
    size: '4.1 MB',
    date: '18 Abr 2026',
    confidentiality: 'Confidencial',
    description: 'Contrato comercial firmado con Iberia para gestionar las contingencias de vuelos de larga distancia desde el HUB de Barajas.',
    detailedContent: `Detalle del Contrato con Iberia S.A.:
• Exclusividad parcial en Terminal T4 para vuelos con demoras mayores a 60 minutos.
• Compensación mínima parametrizada: $15 USD por pasajero (refrigerio); $45 USD (alimentación extendida).
• Conciliación quincenal automática contra cuenta corriente corporativa.`
  }
];

export const INITIAL_TASKS: KanbanTask[] = [
  { id: 'task-1', title: 'Rediseño del Wallet Apple Pass', description: 'Actualizar colores al cobre oficial #C48138 en la versión de producción del ticket de pasajero.', column: 'En Progreso', priority: 'Alta', department: 'Producto', assignedTo: 'Juan Diego', dueDate: '25 Jun 2026' },
  { id: 'task-2', title: 'Cierre legal SAFE Clara Ortiz', description: 'Enviar firmas del SAFE por $180k USD con SaaS Global Fund.', column: 'Por Hacer', priority: 'Alta', department: 'Inversionistas', assignedTo: 'Sebastian M.', dueDate: '28 Jun 2026' },
  { id: 'task-3', title: 'Integrar base de datos de comercios JFK', description: 'Dar de alta los terminales de pago en 12 restaurantes de la terminal 4 en Nueva York.', column: 'Por Hacer', priority: 'Media', department: 'Aeropuerto', assignedTo: 'Juan Diego', dueDate: '15 Jul 2026' },
  { id: 'task-4', title: 'Dashboard de Conciliación Comercial BOG', description: 'Finalizar interfaz de gráficos bento para restaurantes asociados en el Dorado.', column: 'Hecho', priority: 'Media', department: 'Producto', assignedTo: 'Juan Diego', dueDate: '10 Jun 2026' },
  { id: 'task-5', title: 'Firma de Contrato con Air Europa', description: 'Revisión final de tarifas de contingencias del counter de Madrid.', column: 'En Progreso', priority: 'Alta', department: 'Legal', assignedTo: 'Sebastian M.', dueDate: '30 Jun 2026' },
  { id: 'task-6', title: 'Presentación del Data Room trimestral', description: 'Reunir balance de NPS general de 82 puntos y subir el resumen al Data Room.', column: 'Hecho', priority: 'Baja', department: 'Inversionistas', assignedTo: 'Sebastian M.', dueDate: '18 Jun 2026' }
];

export const INITIAL_FLIGHTS: FlightDelay[] = [
  { id: 'flk-1', flightNumber: 'IB-2601', airline: 'Iberia', origin: 'Madrid (MAD)', destination: 'Bogotá (BOG)', scheduledTime: '12:45', delayMinutes: 140, status: 'Retrasado', passengersCount: 184 },
  { id: 'flk-2', flightNumber: 'UX-103', airline: 'Air Europa', origin: 'Madrid (MAD)', destination: 'Miami (MIA)', scheduledTime: '15:20', delayMinutes: 45, status: 'A Tiempo', passengersCount: 220 },
  { id: 'flk-3', flightNumber: 'AV-026', airline: 'Avianca', origin: 'Bogotá (BOG)', destination: 'Madrid (MAD)', scheduledTime: '21:30', delayMinutes: 195, status: 'Crítico', passengersCount: 245 },
  { id: 'flk-4', flightNumber: 'IB-6841', airline: 'Iberia', origin: 'Madrid (MAD)', destination: 'San José (SJO)', scheduledTime: '11:15', delayMinutes: 0, status: 'A Tiempo', passengersCount: 162 },
  { id: 'flk-5', flightNumber: 'UX-244', airline: 'Air Europa', origin: 'Medellín (MDE)', destination: 'Madrid (MAD)', scheduledTime: '18:50', delayMinutes: 280, status: 'Cancelado', passengersCount: 204 }
];
