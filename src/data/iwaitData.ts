export type InvestorStage = 'Prospecto' | 'Contactado' | 'Reunión' | 'Due Diligence' | 'Compromiso' | 'Cerrado';

/** Sube esto para que un cambio en INITIAL_INVESTORS reemplace lo ya guardado en el navegador */
export const INVESTOR_SEED_VERSION = 2;

/** Ronda que se está levantando ahora mismo. La leen Inversionistas y el Dashboard. */
export const ACTIVE_ROUND = 'Semilla';
export const ROUND_TARGET = 1_200_000;

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

/** Qué es cada elemento del Data Room: archivo subido, página HTML o enlace externo */
export type DataRoomKind = 'file' | 'html' | 'link';

export interface DataRoomFile {
  id: string;
  name: string;
  /** Carpeta a la que pertenece (texto libre: se pueden crear carpetas nuevas) */
  category: string;
  size: string;
  date: string;
  confidentiality: 'Público' | 'Confidencial' | 'Solo Directiva';
  description: string;
  detailedContent: string;
  /** 'html' renderiza detailedContent como HTML en un iframe aislado (legado) */
  contentType?: 'text' | 'html';
  kind?: DataRoomKind;
  /** URL externa cuando kind === 'link' (Google Docs, Canva, Figma…) */
  url?: string;
  /** data URL del archivo subido (solo si pesa poco), para previsualizarlo */
  dataUrl?: string;
}

/** Tipo efectivo del elemento, tolerando datos guardados antes del campo `kind` */
export const dataRoomKind = (f: DataRoomFile): DataRoomKind =>
  f.kind ?? (f.contentType === 'html' ? 'html' : 'file');

/** Carpetas sugeridas al crear contenido (la lista real sale de los archivos) */
export const DATA_ROOM_FOLDERS = ['Finanzas', 'Legal', 'Producto', 'Marketing'];

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

/**
 * Directorio de inversores.
 *
 * Origen: export de Notion "VC Investor Directory" (278 contactos, 221 entidades).
 * Es una lista de prospección, no un cap table: por eso todo entra en la etapa
 * "Prospecto", con 0 comprometido y 0% de participación. El CSV traía cheques y
 * valoraciones en 5 filas que NO se han importado como capital de IWAIT: no consta
 * que sean inversiones en esta empresa.
 *
 * La única fila que no viene del CSV es la del fundador, que sí es cap table real.
 */
export const INITIAL_INVESTORS: Investor[] = [
  { id: 'inv-000', name: 'Sebastian Mazorra', firm: 'Founder & Investor Pool', committedAmount: 400000, status: 'Firmado', email: 'sebastian@iwait.io', round: 'Fundadores', sharesPercent: 52.4, stage: 'Cerrado', contact: 'Sebastian Mazorra' },
  { id: 'inv-002', name: 'NXTP Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Pre-Seed', sharesPercent: 0, stage: 'Prospecto', contact: 'Daniel Prior' },
  { id: 'inv-003', name: 'Akira T', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Pre-Seed', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-004', name: 'Juan Pablo Ortega', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Pre-Seed', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-005', name: 'Lucianno', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Pre-Seed', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-006', name: 'Elad Gill', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Pre-Seed', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-007', name: 'Arrebol VC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Semilla', sharesPercent: 0, stage: 'Prospecto', contact: 'William Mejia' },
  { id: 'inv-008', name: 'Arrebol VC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Semilla', sharesPercent: 0, stage: 'Prospecto', contact: 'Javier Barreiro' },
  { id: 'inv-009', name: 'Simma Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Daniel Blandon' },
  { id: 'inv-010', name: 'Simma Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Carlos Gutierrez' },
  { id: 'inv-011', name: 'Latin Leap', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/stefankrautwald/overlay/about-this-profile/' },
  { id: 'inv-012', name: 'Latin Leap', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Jessica Maldonado' },
  { id: 'inv-013', name: 'Marathon Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Alejandro Echavarria' },
  { id: 'inv-014', name: 'Marathon Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Leon Papu' },
  { id: 'inv-015', name: 'Ignacio Gonzales', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-016', name: 'Valure Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Anibal Obregón V' },
  { id: 'inv-017', name: 'Valure Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Daniel Obregon V' },
  { id: 'inv-018', name: 'Veronorte', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Camilo Botero Gaviria' },
  { id: 'inv-019', name: 'Veronorte', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'David Toro Gutierrez' },
  { id: 'inv-020', name: 'Ventura Family', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Juan Fernando Jiménez' },
  { id: 'inv-021', name: 'Vertical Partners', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Esteban Urrea' },
  { id: 'inv-022', name: 'OBS', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Federico Casas Alatriste' },
  { id: 'inv-023', name: 'OBS', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/jjmolina/overlay/about-this-profile/' },
  { id: 'inv-024', name: 'OBS', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Anna Raptis' },
  { id: 'inv-025', name: 'OBS', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Adrián Fernández de Mendoza' },
  { id: 'inv-026', name: '17sigma', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Bianca Sassoon' },
  { id: 'inv-027', name: '17sigma', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Pierpaolo Barbieri' },
  { id: 'inv-028', name: '500 Latam', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Regina' },
  { id: 'inv-029', name: '500 Latam', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Rene' },
  { id: 'inv-030', name: '99 Startups', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Luis Nicolás Bustan' },
  { id: 'inv-031', name: '99 Startups', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Alex Galves' },
  { id: 'inv-032', name: 'Acongagua Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Ignacio Pereyra' },
  { id: 'inv-033', name: 'Agunsa Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Alfonso Torres Vidaurre' },
  { id: 'inv-034', name: 'Alaya Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/claudiobarahona/overlay/about-this-profile/' },
  { id: 'inv-035', name: 'Alaya Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Luis Bermejo' },
  { id: 'inv-036', name: 'Hi Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Federico Antoni' },
  { id: 'inv-037', name: 'Acurio Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Kate Cornel' },
  { id: 'inv-038', name: 'Acurio Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/ander-michelena-778a2b7/overlay/about-this-profile/' },
  { id: 'inv-039', name: 'Amador Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/adrian-gerbaud-635181a0/overlay/about-this-profile/' },
  { id: 'inv-040', name: 'Amador Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Roberto Sierra Eleta' },
  { id: 'inv-041', name: 'Amador Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Guillermo Chapman' },
  { id: 'inv-042', name: 'Angel Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Camilo Kejner' },
  { id: 'inv-043', name: 'Angel Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Fernando Lelo de Larrea H' },
  { id: 'inv-044', name: 'Angel Hub Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Santiago Sada' },
  { id: 'inv-045', name: 'Carabela', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Javier Sánchez Aldana' },
  { id: 'inv-046', name: 'Carabela', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Paulina Melo' },
  { id: 'inv-047', name: 'Carabela', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Francisco Ruiz Izaguirre' },
  { id: 'inv-048', name: 'AVP Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Greg Mitchell' },
  { id: 'inv-049', name: 'AVP Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Elizabeth Acuñaa' },
  { id: 'inv-050', name: 'Animo Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Nico Berardi' },
  { id: 'inv-051', name: 'Animo Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Antonio Osio' },
  { id: 'inv-052', name: 'Arkangeles', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Luis X Barrios' },
  { id: 'inv-053', name: 'Ataria', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'JP Ortiz' },
  { id: 'inv-054', name: 'Avalancha Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Rodrigo Ocejo' },
  { id: 'inv-055', name: 'Avalancha Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Lorenzo Garza' },
  { id: 'inv-056', name: 'Banan Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Turner Novak' },
  { id: 'inv-057', name: 'Bridge', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Patricio Aznar Leon de la Barr' },
  { id: 'inv-058', name: 'Bridge', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Luis Andrés Enriquez Arias' },
  { id: 'inv-059', name: 'Buen Trip Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/fernandorivera/overlay/about-this-profile/' },
  { id: 'inv-060', name: 'Buen Trip Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Carmen de la Cerda' },
  { id: 'inv-061', name: 'B Venture Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/alejandrotroll/overlay/about-this-profile/' },
  { id: 'inv-062', name: 'B Venture Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Ana María Prieto' },
  { id: 'inv-063', name: 'Canary', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Julio Vasconcellos' },
  { id: 'inv-064', name: 'Canary', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/patrick-de-picciotto-0017357/overlay/about-this-profile/' },
  { id: 'inv-065', name: 'Carao Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Allan Boruchowicz' },
  { id: 'inv-066', name: 'Carao Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Edwin Meyers' },
  { id: 'inv-067', name: 'Carao Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Valentina Silva' },
  { id: 'inv-068', name: 'Cisca Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Angel Cisneros' },
  { id: 'inv-069', name: 'Clas 5', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Joel A' },
  { id: 'inv-070', name: 'Clas 5', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Zach Finkelstein' },
  { id: 'inv-071', name: 'Claudio Schlegel', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-072', name: 'Cometa', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Rafa de Haro' },
  { id: 'inv-073', name: 'Cometa', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Pepe Bolaños' },
  { id: 'inv-074', name: 'Cupido Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Isma Tejon' },
  { id: 'inv-075', name: 'Devlabs', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Jose D Lopez' },
  { id: 'inv-076', name: 'Daneo', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Sebastián Ibáñez' },
  { id: 'inv-077', name: 'Diegoserebrisky', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/diegoserebrisky/overlay/about-this-profile/' },
  { id: 'inv-078', name: 'Carlos Enrique Mata Saravia', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-079', name: 'Domo VC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Stella Leone' },
  { id: 'inv-080', name: 'Drapper B1', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Enrique Penichet García' },
  { id: 'inv-081', name: 'Dux Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/jlsdux/overlay/about-this-profile/' },
  { id: 'inv-082', name: 'EFS', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Andrés Cifuentes' },
  { id: 'inv-083', name: 'EFS', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Diana Cifuentes' },
  { id: 'inv-084', name: 'Epakon', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Diego T. Salas' },
  { id: 'inv-085', name: 'Ethan James A', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-086', name: 'Ewa Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Patricia Saenz' },
  { id: 'inv-087', name: 'Julio Zaguini', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-088', name: 'Colectivo Jaguar', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Matthieu Dahire' },
  { id: 'inv-089', name: 'Colectivo Jaguar', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Pierre-Etienne Lambert' },
  { id: 'inv-090', name: 'Cube Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Carolina cepeda' },
  { id: 'inv-091', name: 'Cube Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Santiago Rojas Montoya' },
  { id: 'inv-092', name: 'DGF Investimentos', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Frederico Greve' },
  { id: 'inv-093', name: 'Escaletc', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/alvaro-villarroel-val/overlay/about-this-profile/' },
  { id: 'inv-094', name: 'Fen Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Cristobal Silva Bengolea' },
  { id: 'inv-095', name: 'Fen Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Ricardo Levy' },
  { id: 'inv-096', name: 'Fen Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Eduardo Beffermann' },
  { id: 'inv-097', name: 'FJ Labs', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Fabrice Grinda' },
  { id: 'inv-098', name: 'FJ Labs', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Jose Marin' },
  { id: 'inv-099', name: 'Flori Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Ryan Nesbit' },
  { id: 'inv-100', name: 'Fuse Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Joao Zecchin' },
  { id: 'inv-101', name: 'Marc Blumenthal', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-102', name: 'Fuse Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Dan Yamamura' },
  { id: 'inv-103', name: 'Latitud', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/brianrequarth/overlay/about-this-profile/' },
  { id: 'inv-104', name: 'Latitud', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Gina Gotthilf' },
  { id: 'inv-105', name: 'G2 Momentun', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/jorge-gonzalez-gasque-ba048713/overlay/about-this-profile/' },
  { id: 'inv-106', name: 'Gabriel Bernasconi', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-107', name: 'GAIN Angels', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Rodrigo Ramírez Organista' },
  { id: 'inv-108', name: 'Globant Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/juanbertiche/overlay/about-this-profile/' },
  { id: 'inv-109', name: 'Clyde H', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-110', name: 'Kalei Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Leandro Pisaroni Gerbaldo' },
  { id: 'inv-111', name: 'Kalei Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Tomas Braun' },
  { id: 'inv-112', name: 'Leap Global Partners', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Roberto Aguayo' },
  { id: 'inv-113', name: 'Leap Global Partners', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Cuco Vega' },
  { id: 'inv-114', name: 'Loyal VC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/kamalhassan/overlay/about-this-profile/' },
  { id: 'inv-115', name: 'Loyal VC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Michael Kosic' },
  { id: 'inv-116', name: 'Manatura Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/pablotraub/overlay/about-this-profile/' },
  { id: 'inv-117', name: 'Matter Scale', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Roberto Charvel' },
  { id: 'inv-118', name: 'Matter Scale', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Fernando Fabre' },
  { id: 'inv-119', name: 'Melek Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Francisco García Osuna' },
  { id: 'inv-120', name: 'Magma Partners', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Eugenio Perea' },
  { id: 'inv-121', name: 'Magma Partners', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Pedro P. del Campo' },
  { id: 'inv-122', name: 'Lotux Vc', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Matevz (Mat) Gantar' },
  { id: 'inv-123', name: 'Lotux Vc', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Alejandro Romero' },
  { id: 'inv-124', name: 'Predective', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Juan Pablo Montoya' },
  { id: 'inv-125', name: 'Juan Pablo Montoya', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-126', name: 'InverTup', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Marcelo Lebendiker' },
  { id: 'inv-127', name: 'IthinckVc', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/juan-cruz-valdez-rojas/overlay/about-this-profile/' },
  { id: 'inv-128', name: 'Kalei Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Juan Santiago' },
  { id: 'inv-129', name: 'Kalei Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-130', name: 'Magical Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Juan Eduardo' },
  { id: 'inv-131', name: 'Niuu Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Reinaldo Normand' },
  { id: 'inv-132', name: 'Ocean Azul Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Alex Tellez' },
  { id: 'inv-133', name: 'Ocean Azul Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'David Zinn' },
  { id: 'inv-134', name: 'Outbound Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/luisgonzalez15/overlay/about-this-profile/?trk=pub-pbmap' },
  { id: 'inv-135', name: 'Nilo Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'XXX' },
  { id: 'inv-136', name: 'Newtopia VC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Patricio Jutard' },
  { id: 'inv-137', name: 'Newtopia VC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Sacha Spitz' },
  { id: 'inv-138', name: 'Mrpink VC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Hernan Haro' },
  { id: 'inv-139', name: 'Mrpink VC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Santiago Pehar' },
  { id: 'inv-140', name: 'Miyelin Vc', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/federicojack/overlay/about-this-profile/' },
  { id: 'inv-141', name: 'Monashees', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Carlo Dapuzzo' },
  { id: 'inv-142', name: 'Monashees', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Sebastian Cardenas' },
  { id: 'inv-143', name: 'Bossa Invest', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Antonio Patrus' },
  { id: 'inv-144', name: 'Investin', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Ivan Perez' },
  { id: 'inv-145', name: 'Semilla Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Isabella Rodriguez' },
  { id: 'inv-146', name: 'Movtech Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Guillermo del Conte' },
  { id: 'inv-147', name: 'Jetblue Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-148', name: 'NutVC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Moises Cohen' },
  { id: 'inv-149', name: 'Martin Ott', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-150', name: 'Rouven Dresselhaus', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-151', name: 'Marco Valta', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-152', name: 'Wayne Chang', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-153', name: 'Maymann', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/maymann/overlay/about-this-profile/' },
  { id: 'inv-154', name: 'Henrik Zillmer', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-155', name: 'Tomaszpawliszyn', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/tomaszpawliszyn/overlay/about-this-profile/' },
  { id: 'inv-156', name: 'Naval Ravikant', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-157', name: 'Eric Blachford', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-158', name: 'Eduardo Ronzano', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-159', name: 'Edward Lando', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-160', name: 'Pareto Holdings', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-161', name: 'Leonardo Borrero', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-162', name: 'Daniel Undarraga', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-163', name: 'Enrique Villamarin', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-164', name: 'Ricardo Weder', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-165', name: 'Daniel Bilbabo', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-166', name: 'Andres Bilbao', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-167', name: 'David Velez', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-168', name: 'Simon Borrero', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-169', name: 'Opera Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-170', name: 'Fabian Frubana', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-171', name: 'Jose Bonilla', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-172', name: 'Hesham Zreik', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-173', name: 'Claire Diaz', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-174', name: 'Lucasmlameiras', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/lucasmlameiras/overlay/about-this-profile/' },
  { id: 'inv-175', name: 'Darian Shirazi', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-176', name: 'Sahinboydas', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/sahinboydas/overlay/about-this-profile/' },
  { id: 'inv-177', name: 'Volans Group', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-178', name: 'Joaquin Navasal', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-179', name: 'Fernando Okamura', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-180', name: 'Jose Gio', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-181', name: 'Pablo Gonzales Bitso', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-182', name: 'Upview Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-183', name: 'IAGI Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-184', name: 'Varsha Rao', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-185', name: 'Bashar Hamood', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-186', name: 'Faster Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-187', name: 'Sergio Mendoza', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-188', name: 'Yango Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-189', name: 'Dmitry Stepanov', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-190', name: 'Sebastian Mejia', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-191', name: 'Santiago Sada', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-192', name: 'Joaquin Navasal', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-193', name: 'Enrique Santa Cruz', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-194', name: 'Veronorte', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-195', name: 'Alejandro Arenas', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-196', name: 'Jaime Sotomayor', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-197', name: 'Barbara Gonzales', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-198', name: 'Vanesa Kolodziej', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-199', name: 'Xavier Baillères Zambrano', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-200', name: 'Winipeg Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Jose Garcia Herz' },
  { id: 'inv-201', name: 'Vine Ventur', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-202', name: 'Beatriz D', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-203', name: 'Eric Reiner', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-204', name: 'iTHINK VC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-205', name: 'Urca Angels', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-206', name: 'Mandi Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-207', name: 'Antonio Moreira Salles', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-208', name: 'Stage Venture Partners', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-209', name: 'K50 Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-210', name: 'Nadav Ben-Chanoch', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-211', name: 'Shutterstock', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/shutterstock/overlay/about-this-profile/' },
  { id: 'inv-212', name: 'Cory Levy', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-213', name: 'Valor Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Fabiana Scionti' },
  { id: 'inv-214', name: 'Nascent Vc', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/archie-cochrane-59848234/overlay/about-this-profile/' },
  { id: 'inv-215', name: 'Nascent Vc', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-216', name: 'leveluP Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-217', name: 'Clocktower Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-218', name: 'Edward Lando', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-219', name: 'Claire Diaz Ortiz', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-220', name: 'Guilherme Bonifacio', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-221', name: 'Ariel Lambrecht', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-222', name: 'Invariantes Fund', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-223', name: 'Fernando Pontanza', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-224', name: 'Jaime Mutus', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-225', name: 'Zetta Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-226', name: 'Frontier Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-227', name: 'CVC Latam', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-228', name: 'Kolab Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-229', name: 'New StackVentures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-230', name: 'John Rocha17', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/john-rocha17/overlay/about-this-profile/' },
  { id: 'inv-231', name: 'Nick Moran', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-232', name: 'Punto Cero Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-233', name: 'Esteban Reyes Gutierrez', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-234', name: 'Nicolasserranom', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/nicolasserranom/overlay/about-this-profile/' },
  { id: 'inv-235', name: 'Sakantay Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-236', name: 'Martinaspillaga', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/martinaspillaga/overlay/about-this-profile/' },
  { id: 'inv-237', name: 'Hustle Fund', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-238', name: 'Amador Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-239', name: 'Romero', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/romero/overlay/about-this-profile/' },
  { id: 'inv-240', name: 'Headline', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-241', name: 'Michaellhennessey', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/michaellhennessey/overlay/about-this-profile/' },
  { id: 'inv-242', name: 'Ignaciocanals', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/ignaciocanals/overlay/about-this-profile/' },
  { id: 'inv-243', name: 'Wollef Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-244', name: 'Cristobal Perdomo', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-245', name: 'Igor Marchesini', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-246', name: 'Pablo Garfinkel', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/pablo-garfinkel/overlay/about-this-profile/' },
  { id: 'inv-247', name: 'Liquid2vc', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-248', name: 'Michaelma8', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/michaelma8/overlay/about-this-profile/' },
  { id: 'inv-249', name: 'Bossa Invest', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-250', name: 'GG Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-251', name: 'Enrique Santacruz', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-252', name: 'Hern%C3%A1N Guerrero Hinojosa ', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/hern%C3%A1n-guerrero-hinojosa-/overlay/about-this-profile/' },
  { id: 'inv-253', name: 'QP Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-254', name: 'Joshwaksman', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/joshwaksman/overlay/about-this-profile/' },
  { id: 'inv-255', name: 'Diamond Streams', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-256', name: 'Davidbaggett', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/davidbaggett/overlay/about-this-profile/' },
  { id: 'inv-257', name: 'Blainevess', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/blainevess/overlay/about-this-profile/' },
  { id: 'inv-258', name: 'Immeasurable VC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-259', name: 'Carlos Chaves', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-260', name: 'Pablo Garfinkel', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-261', name: 'Lotus VC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-262', name: 'Fika Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-263', name: 'Numundo Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Ivan Montoya' },
  { id: 'inv-264', name: 'Amadeus', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-265', name: 'Draper B1', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Enrique' },
  { id: 'inv-266', name: 'Miguel Vanegas Torres', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-267', name: 'Jaime Arrieta', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-268', name: 'Felipe Gedeon', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-269', name: 'Mauricio Hoyos', firm: 'Ángel', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-270', name: 'Inqlab', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-271', name: 'Valuaty VC', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/madeleineclavijoverjel/overlay/about-this-profile/' },
  { id: 'inv-272', name: 'JP Morgan', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Contacto Camilo' },
  { id: 'inv-273', name: 'Mati Botero', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-274', name: 'Estefania Bello', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-275', name: 'Arnaud Thevenet', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Zenani Capital', linkedin: 'https://www.linkedin.com/in/arnaud-thevenet/overlay/about-this-profile/' },
  { id: 'inv-276', name: 'Orbit Ventures', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-277', name: 'Caravela Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-278', name: 'Indicator Capital', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/jacobodecal/overlay/about-this-profile/' },
  { id: 'inv-279', name: 'Capria Vc', firm: 'Fondo VC', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Daniel Ballesteros' }
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
  },
  {
    id: 'dr-6',
    name: 'One-pager comercial (Google Docs)',
    category: 'Marketing',
    kind: 'link',
    url: 'https://docs.google.com/document/d/EJEMPLO-cambia-este-enlace/edit',
    size: '—',
    date: '20 Jul 2026',
    confidentiality: 'Público',
    description: 'Documento vivo con el resumen comercial de IWAIT. Se edita directamente en Google Docs; este enlace siempre apunta a la última versión.',
    detailedContent: 'Enlace externo a Google Docs.'
  },
  {
    id: 'dr-7',
    name: 'Plantillas de marca (Canva)',
    category: 'Marketing',
    kind: 'link',
    url: 'https://www.canva.com/design/EJEMPLO-cambia-este-enlace/view',
    size: '—',
    date: '15 Jul 2026',
    confidentiality: 'Público',
    description: 'Carpeta de diseños en Canva con las plantillas oficiales: pitch deck, posts y one-pagers con la paleta IWAIT.',
    detailedContent: 'Enlace externo a Canva.'
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
