export interface Investor {
  id: string;
  name: string;
  firm: string;
  committedAmount: number;
  status: 'Firmado' | 'Pendiente' | 'Negociando';
  email: string;
  round: string;
  sharesPercent: number;
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
  assigneeEmail?: string;
  reminderAt?: string;
  notificationSentAt?: string;
}

export interface ClientEntity {
  id: string;
  name: string;
  type: 'Aerolínea' | 'Aeropuerto' | 'Comercio';
  status: 'Lead' | 'Negociando' | 'Contrato' | 'Operativo';
  dealValue: number;
  hub: string;
  contactPerson: string;
  passengersMonthly: number;
  linkedin?: string;
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
  { id: 'inv-1', name: 'Santiago de Alvear', firm: 'Pre-Seed Lead / Venture Capital', committedAmount: 150000, status: 'Firmado', email: 's.alvear@latamvc.com', round: 'Pre-Seed', sharesPercent: 3.5 },
  { id: 'inv-2', name: 'Mariana Gomez', firm: 'Angel Investor (Ex-Iata)', committedAmount: 50000, status: 'Firmado', email: 'mariana.gomez@exata.net', round: 'Pre-Seed', sharesPercent: 1.2 },
  { id: 'inv-3', name: 'Andrés Pastrana', firm: 'Andes Ventures LLC', committedAmount: 250000, status: 'Firmado', email: 'pastrana@andesventures.com', round: 'Semilla', sharesPercent: 5.0 },
  { id: 'inv-4', name: 'Clara Ortiz', firm: 'SaaS Global Fund', committedAmount: 180000, status: 'Pendiente', email: 'c.ortiz@saasglobal.io', round: 'Semilla', sharesPercent: 3.6 },
  { id: 'inv-5', name: 'Sebastian Mazorra', firm: 'Founder & Investor Pool', committedAmount: 400000, status: 'Firmado', email: 'sebastian@iwait.io', round: 'Fundadores', sharesPercent: 52.4 },
  { id: 'inv-6', name: 'AeroCapital SL', firm: 'Syndicate Airport Sector EMEA', committedAmount: 120000, status: 'Negociando', email: 'dealflow@aerocapital.es', round: 'Semilla', sharesPercent: 2.4 }
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
  { id: 'task-1', title: 'Rediseño del Wallet Apple Pass', description: 'Actualizar colores al cobre oficial #C48138 en la versión de producción del ticket de pasajero.', column: 'En Progreso', priority: 'Alta', department: 'Producto', assignedTo: 'Laura Diaz', dueDate: '25 Jun 2026' },
  { id: 'task-2', title: 'Cierre legal SAFE Clara Ortiz', description: 'Enviar firmas del SAFE por $180k USD con SaaS Global Fund.', column: 'Por Hacer', priority: 'Alta', department: 'Inversionistas', assignedTo: 'Sebastian Mazorra', dueDate: '28 Jun 2026' },
  { id: 'task-3', title: 'Integrar base de datos de comercios JFK', description: 'Dar de alta los terminales de pago en 12 restaurantes de la terminal 4 en Nueva York.', column: 'Por Hacer', priority: 'Media', department: 'Aeropuerto', assignedTo: 'Mateo Restrepo', dueDate: '15 Jul 2026' },
  { id: 'task-4', title: 'Dashboard de Conciliación Comercial BOG', description: 'Finalizar interfaz de gráficos bento para restaurantes asociados en el Dorado.', column: 'Hecho', priority: 'Media', department: 'Producto', assignedTo: 'Laura Diaz', dueDate: '10 Jun 2026' },
  { id: 'task-5', title: 'Firma de Contrato con Air Europa', description: 'Revisión final de tarifas de contingencias del counter de Madrid.', column: 'En Progreso', priority: 'Alta', department: 'Legal', assignedTo: 'Dr. Alejandro Peña', dueDate: '30 Jun 2026' },
  { id: 'task-6', title: 'Presentación del Data Room trimestral', description: 'Reunir balance de NPS general de 82 puntos y subir el resumen al Data Room.', column: 'Hecho', priority: 'Baja', department: 'Inversionistas', assignedTo: 'Carlos Rivas', dueDate: '18 Jun 2026' }
];

export const INITIAL_CLIENTS: ClientEntity[] = [
  { id: 'cli-1', name: 'Iberia Airlines', type: 'Aerolínea', status: 'Operativo', dealValue: 125000, hub: 'Madrid Barajas T4', contactPerson: 'Marta Villanueva', passengersMonthly: 450000 },
  { id: 'cli-2', name: 'Aeropuerto El Dorado (OPAIN)', type: 'Aeropuerto', status: 'Operativo', dealValue: 95000, hub: 'Bogotá El Dorado', contactPerson: 'Felipe Holguín', passengersMonthly: 980000 },
  { id: 'cli-3', name: 'Air Europa', type: 'Aerolínea', status: 'Contrato', dealValue: 85000, hub: 'Madrid Barajas T1', contactPerson: 'Juan Carlos Ruiz', passengersMonthly: 210000 },
  { id: 'cli-4', name: 'Avianca', type: 'Aerolínea', status: 'Negociando', dealValue: 140000, hub: 'Bogotá T1 / Medellín MDE', contactPerson: 'Claudia Patricia Gil', passengersMonthly: 620000 },
  { id: 'cli-5', name: 'Dufry Duty Free', type: 'Comercio', status: 'Operativo', dealValue: 45000, hub: 'EMEA & LATAM Hubs', contactPerson: 'Hans-Peter Steiner', passengersMonthly: 1200000 },
  { id: 'cli-6', name: 'LATAM Airlines', type: 'Aerolínea', status: 'Lead', dealValue: 180000, hub: 'Santiago SCL / Lima LIM', contactPerson: 'Eduardo Valenzuela', passengersMonthly: 750000 },
  { id: 'cli-7', name: 'Starbucks Airport', type: 'Comercio', status: 'Operativo', dealValue: 35000, hub: 'Múltiples Terminales', contactPerson: 'Lucía Fernández', passengersMonthly: 300000 },
  { id: 'cli-air-1', name: 'Avianca Express', type: 'Aerolínea', status: 'Lead', dealValue: 40000, hub: 'Colombia', contactPerson: 'Colombia Segment', passengersMonthly: 120000 },
  { id: 'cli-air-2', name: 'LATAM Airlines Colombia', type: 'Aerolínea', status: 'Lead', dealValue: 90000, hub: 'Colombia', contactPerson: 'Colombia Segment', passengersMonthly: 300000 },
  { id: 'cli-air-3', name: 'Wingo', type: 'Aerolínea', status: 'Lead', dealValue: 60000, hub: 'Colombia', contactPerson: 'Colombia Segment', passengersMonthly: 180000 },
  { id: 'cli-air-4', name: 'SATENA', type: 'Aerolínea', status: 'Lead', dealValue: 30000, hub: 'Colombia', contactPerson: 'Colombia Segment', passengersMonthly: 50000 },
  { id: 'cli-air-5', name: 'Clic Air', type: 'Aerolínea', status: 'Lead', dealValue: 40000, hub: 'Colombia', contactPerson: 'Colombia Segment', passengersMonthly: 70000 },
  { id: 'cli-air-6', name: 'Copa Airlines Colombia', type: 'Aerolínea', status: 'Lead', dealValue: 50000, hub: 'Colombia', contactPerson: 'Colombia Segment', passengersMonthly: 100000 },
  { id: 'cli-air-7', name: 'JetSMART Colombia', type: 'Aerolínea', status: 'Lead', dealValue: 60000, hub: 'Colombia', contactPerson: 'Colombia Segment', passengersMonthly: 150000 },
  { id: 'cli-air-8', name: 'Moon Flights', type: 'Aerolínea', status: 'Lead', dealValue: 20000, hub: 'Colombia', contactPerson: 'Colombia Segment', passengersMonthly: 10000 },
  { id: 'cli-air-9', name: 'Avianca (grupo)', type: 'Aerolínea', status: 'Lead', dealValue: 150000, hub: 'Colombia', contactPerson: 'Latam Segment', passengersMonthly: 900000 },
  { id: 'cli-air-10', name: 'Aerolíneas Argentinas', type: 'Aerolínea', status: 'Lead', dealValue: 80000, hub: 'Argentina', contactPerson: 'Latam Segment', passengersMonthly: 400000 },
  { id: 'cli-air-11', name: 'GOL Linhas Aéreas', type: 'Aerolínea', status: 'Lead', dealValue: 110000, hub: 'Brasil', contactPerson: 'Latam Segment', passengersMonthly: 800000 },
  { id: 'cli-air-12', name: 'Azul Airlines', type: 'Aerolínea', status: 'Lead', dealValue: 100000, hub: 'Brasil', contactPerson: 'Latam Segment', passengersMonthly: 750000 },
  { id: 'cli-air-13', name: 'Sky Airline', type: 'Aerolínea', status: 'Lead', dealValue: 70000, hub: 'Chile', contactPerson: 'Latam Segment', passengersMonthly: 250000 },
  { id: 'cli-air-14', name: 'JetSMART', type: 'Aerolínea', status: 'Lead', dealValue: 80000, hub: 'Chile', contactPerson: 'Latam Segment', passengersMonthly: 300000 },
  { id: 'cli-air-15', name: 'Copa Airlines', type: 'Aerolínea', status: 'Lead', dealValue: 95000, hub: 'Panamá', contactPerson: 'Latam Segment', passengersMonthly: 500000 },
  { id: 'cli-air-16', name: 'Aeroméxico', type: 'Aerolínea', status: 'Lead', dealValue: 120000, hub: 'México', contactPerson: 'Latam Segment', passengersMonthly: 600000 },
  { id: 'cli-air-17', name: 'Volaris', type: 'Aerolínea', status: 'Lead', dealValue: 110000, hub: 'México', contactPerson: 'Latam Segment', passengersMonthly: 800000 },
  { id: 'cli-air-18', name: 'Viva Aerobus', type: 'Aerolínea', status: 'Lead', dealValue: 90000, hub: 'México', contactPerson: 'Latam Segment', passengersMonthly: 500000 },
  { id: 'cli-air-19', name: 'Paranair', type: 'Aerolínea', status: 'Lead', dealValue: 30000, hub: 'Paraguay', contactPerson: 'Latam Segment', passengersMonthly: 40000 },
  { id: 'cli-air-20', name: 'Star Perú', type: 'Aerolínea', status: 'Lead', dealValue: 40000, hub: 'Perú', contactPerson: 'Latam Segment', passengersMonthly: 80000 },
  { id: 'cli-air-21', name: 'Tropic Air', type: 'Aerolínea', status: 'Lead', dealValue: 20000, hub: 'Belice', contactPerson: 'Centroamérica', passengersMonthly: 30000 },
  { id: 'cli-air-22', name: 'Maya Island Air', type: 'Aerolínea', status: 'Lead', dealValue: 20000, hub: 'Belice', contactPerson: 'Centroamérica', passengersMonthly: 25000 },
  { id: 'cli-air-23', name: 'SANSA', type: 'Aerolínea', status: 'Lead', dealValue: 25000, hub: 'Costa Rica', contactPerson: 'Centroamérica', passengersMonthly: 40000 },
  { id: 'cli-air-24', name: 'Costa Rica Green Airways', type: 'Aerolínea', status: 'Lead', dealValue: 15000, hub: 'Costa Rica', contactPerson: 'Centroamérica', passengersMonthly: 15000 },
  { id: 'cli-air-25', name: 'TAG Airlines', type: 'Aerolínea', status: 'Lead', dealValue: 35000, hub: 'Guatemala', contactPerson: 'Centroamérica', passengersMonthly: 60000 },
  { id: 'cli-air-26', name: 'CM Airlines', type: 'Aerolínea', status: 'Lead', dealValue: 25000, hub: 'Honduras', contactPerson: 'Centroamérica', passengersMonthly: 30000 },
  { id: 'cli-air-27', name: 'Aerolíneas Sosa', type: 'Aerolínea', status: 'Lead', dealValue: 20000, hub: 'Honduras', contactPerson: 'Centroamérica', passengersMonthly: 25000 },
  { id: 'cli-air-28', name: 'La Costeña', type: 'Aerolínea', status: 'Lead', dealValue: 20000, hub: 'Nicaragua', contactPerson: 'Centroamérica', passengersMonthly: 20000 },
  { id: 'cli-air-29', name: 'Air Panama', type: 'Aerolínea', status: 'Lead', dealValue: 30000, hub: 'Panamá', contactPerson: 'Centroamérica', passengersMonthly: 50000 },
  { id: 'cli-air-30', name: 'American Airlines', type: 'Aerolínea', status: 'Lead', dealValue: 250000, hub: 'Estados Unidos', contactPerson: 'Norteamérica', passengersMonthly: 2000000 },
  { id: 'cli-air-31', name: 'Delta Air Lines', type: 'Aerolínea', status: 'Lead', dealValue: 250000, hub: 'Estados Unidos', contactPerson: 'Norteamérica', passengersMonthly: 1900000 },
  { id: 'cli-air-32', name: 'United Airlines', type: 'Aerolínea', status: 'Lead', dealValue: 240000, hub: 'Estados Unidos', contactPerson: 'Norteamérica', passengersMonthly: 1800000 },
  { id: 'cli-air-33', name: 'Southwest Airlines', type: 'Aerolínea', status: 'Lead', dealValue: 200000, hub: 'Estados Unidos', contactPerson: 'Norteamérica', passengersMonthly: 1500000 },
  { id: 'cli-air-34', name: 'Alaska Airlines', type: 'Aerolínea', status: 'Lead', dealValue: 150000, hub: 'Estados Unidos', contactPerson: 'Norteamérica', passengersMonthly: 800000 },
  { id: 'cli-air-35', name: 'JetBlue', type: 'Aerolínea', status: 'Lead', dealValue: 140000, hub: 'Estados Unidos', contactPerson: 'Norteamérica', passengersMonthly: 700000 },
  { id: 'cli-air-36', name: 'Spirit Airlines', type: 'Aerolínea', status: 'Lead', dealValue: 100000, hub: 'Estados Unidos', contactPerson: 'Norteamérica', passengersMonthly: 600000 },
  { id: 'cli-air-37', name: 'Frontier Airlines', type: 'Aerolínea', status: 'Lead', dealValue: 90000, hub: 'Estados Unidos', contactPerson: 'Norteamérica', passengersMonthly: 500000 },
  { id: 'cli-air-38', name: 'Air Canada', type: 'Aerolínea', status: 'Lead', dealValue: 180000, hub: 'Canadá', contactPerson: 'Norteamérica', passengersMonthly: 900000 },
  { id: 'cli-air-39', name: 'WestJet', type: 'Aerolínea', status: 'Lead', dealValue: 120000, hub: 'Canadá', contactPerson: 'Norteamérica', passengersMonthly: 600000 },
  { id: 'cli-air-40', name: 'Emirates', type: 'Aerolínea', status: 'Lead', dealValue: 250000, hub: 'Emiratos Árabes', contactPerson: 'Global-Latam', passengersMonthly: 1500000 },
  { id: 'cli-air-41', name: 'Qatar Airways', type: 'Aerolínea', status: 'Lead', dealValue: 250000, hub: 'Catar', contactPerson: 'Global-Latam', passengersMonthly: 1400000 },
  { id: 'cli-air-42', name: 'Air France', type: 'Aerolínea', status: 'Lead', dealValue: 200000, hub: 'Francia', contactPerson: 'Maria Chacon', passengersMonthly: 1200000, linkedin: 'https://www.linkedin.com/in/mariachacon-marketing/' },
  { id: 'cli-air-43', name: 'Lufthansa', type: 'Aerolínea', status: 'Lead', dealValue: 200000, hub: 'Alemania', contactPerson: 'Global-Latam', passengersMonthly: 1200000 },
  { id: 'cli-air-44', name: 'Turkish Airlines', type: 'Aerolínea', status: 'Lead', dealValue: 190000, hub: 'Turquía', contactPerson: 'Global-Latam', passengersMonthly: 1100000 },
  { id: 'cli-air-45', name: 'KLM', type: 'Aerolínea', status: 'Lead', dealValue: 180000, hub: 'Países Bajos', contactPerson: 'Maria Chacon', passengersMonthly: 1000000, linkedin: 'https://www.linkedin.com/in/mariachacon-marketing/' }
];

export const INITIAL_FLIGHTS: FlightDelay[] = [
  { id: 'flk-1', flightNumber: 'IB-2601', airline: 'Iberia', origin: 'Madrid (MAD)', destination: 'Bogotá (BOG)', scheduledTime: '12:45', delayMinutes: 140, status: 'Retrasado', passengersCount: 184 },
  { id: 'flk-2', flightNumber: 'UX-103', airline: 'Air Europa', origin: 'Madrid (MAD)', destination: 'Miami (MIA)', scheduledTime: '15:20', delayMinutes: 45, status: 'A Tiempo', passengersCount: 220 },
  { id: 'flk-3', flightNumber: 'AV-026', airline: 'Avianca', origin: 'Bogotá (BOG)', destination: 'Madrid (MAD)', scheduledTime: '21:30', delayMinutes: 195, status: 'Crítico', passengersCount: 245 },
  { id: 'flk-4', flightNumber: 'IB-6841', airline: 'Iberia', origin: 'Madrid (MAD)', destination: 'San José (SJO)', scheduledTime: '11:15', delayMinutes: 0, status: 'A Tiempo', passengersCount: 162 },
  { id: 'flk-5', flightNumber: 'UX-244', airline: 'Air Europa', origin: 'Medellín (MDE)', destination: 'Madrid (MAD)', scheduledTime: '18:50', delayMinutes: 280, status: 'Cancelado', passengersCount: 204 }
];
