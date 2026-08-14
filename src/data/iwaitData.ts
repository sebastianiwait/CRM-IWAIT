export type InvestorStage = 'Prospecto' | 'Contactado' | 'Reunión' | 'Due Diligence' | 'Compromiso' | 'Cerrado';

/** Fondo institucional frente a persona que invierte su propio dinero */
export type InvestorKind = 'VC' | 'Ángel';

export const INVESTOR_KINDS: InvestorKind[] = ['VC', 'Ángel'];

/**
 * Comparador alfanumérico: ignora acentos y mayúsculas, y ordena los números
 * por valor y no por dígito ("17sigma" < "99 Startups" < "500 Latam").
 */
export const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, 'es', { numeric: true, sensitivity: 'base' });

/** Sube esto para que un cambio en INITIAL_INVESTORS reemplace lo ya guardado en el navegador */
export const INVESTOR_SEED_VERSION = 4;

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
  /** Ausente en registros creados antes de la clasificación */
  kind?: InvestorKind;
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
 * Directorio de inversores, ordenado alfanuméricamente por nombre.
 *
 * Origen: export de Notion "VC Investor Directory" (278 contactos, 221 entidades).
 * Es una lista de prospección, no un cap table: por eso todo entra en la etapa
 * "Prospecto", con 0 comprometido y 0% de participación. El CSV traía cheques y
 * valoraciones en 5 filas que NO se han importado como capital de IWAIT: no consta
 * que sean inversiones en esta empresa.
 *
 * `kind` distingue fondo de ángel. El CSV solo lo traía en 12 de 278 filas; el
 * resto está deducido del nombre, así que puede fallar y se corrige desde la app.
 *
 * La única fila que no viene del CSV es la del fundador, que sí es cap table real.
 */
export const INITIAL_INVESTORS: Investor[] = [
  { id: 'inv-001', name: '17sigma', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Bianca Sassoon' },
  { id: 'inv-002', name: '17sigma', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Pierpaolo Barbieri' },
  { id: 'inv-003', name: '99 Startups', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Luis Nicolás Bustan' },
  { id: 'inv-004', name: '99 Startups', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Alex Galves' },
  { id: 'inv-005', name: '500 Latam', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Regina' },
  { id: 'inv-006', name: '500 Latam', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Rene' },
  { id: 'inv-007', name: 'Acongagua Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Ignacio Pereyra' },
  { id: 'inv-008', name: 'Acurio Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Kate Cornel' },
  { id: 'inv-009', name: 'Acurio Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/ander-michelena-778a2b7/overlay/about-this-profile/' },
  { id: 'inv-010', name: 'Agunsa Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Alfonso Torres Vidaurre' },
  { id: 'inv-011', name: 'Akira T', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Pre-Seed', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-012', name: 'Alaya Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/claudiobarahona/overlay/about-this-profile/' },
  { id: 'inv-013', name: 'Alaya Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Luis Bermejo' },
  { id: 'inv-014', name: 'Alejandro Arenas', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-015', name: 'Amadeus', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-016', name: 'Amador Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/adrian-gerbaud-635181a0/overlay/about-this-profile/' },
  { id: 'inv-017', name: 'Amador Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Roberto Sierra Eleta' },
  { id: 'inv-018', name: 'Amador Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Guillermo Chapman' },
  { id: 'inv-019', name: 'Amador Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-020', name: 'Andres Bilbao', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-021', name: 'Angel Hub Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Santiago Sada' },
  { id: 'inv-022', name: 'Angel Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Camilo Kejner' },
  { id: 'inv-023', name: 'Angel Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Fernando Lelo de Larrea H' },
  { id: 'inv-024', name: 'Animo Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Nico Berardi' },
  { id: 'inv-025', name: 'Animo Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Antonio Osio' },
  { id: 'inv-026', name: 'Antonio Moreira Salles', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-027', name: 'Ariel Lambrecht', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-028', name: 'Arkangeles', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Luis X Barrios' },
  { id: 'inv-029', name: 'Arnaud Thevenet', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Zenani Capital', linkedin: 'https://www.linkedin.com/in/arnaud-thevenet/overlay/about-this-profile/' },
  { id: 'inv-030', name: 'Arrebol VC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Semilla', sharesPercent: 0, stage: 'Prospecto', contact: 'William Mejia' },
  { id: 'inv-031', name: 'Arrebol VC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Semilla', sharesPercent: 0, stage: 'Prospecto', contact: 'Javier Barreiro' },
  { id: 'inv-032', name: 'Ataria', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'JP Ortiz' },
  { id: 'inv-033', name: 'Avalancha Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Rodrigo Ocejo' },
  { id: 'inv-034', name: 'Avalancha Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Lorenzo Garza' },
  { id: 'inv-035', name: 'AVP Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Greg Mitchell' },
  { id: 'inv-036', name: 'AVP Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Elizabeth Acuñaa' },
  { id: 'inv-037', name: 'B Venture Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/alejandrotroll/overlay/about-this-profile/' },
  { id: 'inv-038', name: 'B Venture Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Ana María Prieto' },
  { id: 'inv-039', name: 'Banan Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Turner Novak' },
  { id: 'inv-040', name: 'Barbara Gonzales', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-041', name: 'Bashar Hamood', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-042', name: 'Beatriz D', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-043', name: 'Blainevess', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/blainevess/overlay/about-this-profile/' },
  { id: 'inv-044', name: 'Bossa Invest', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Antonio Patrus' },
  { id: 'inv-045', name: 'Bossa Invest', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-046', name: 'Bridge', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Patricio Aznar Leon de la Barr' },
  { id: 'inv-047', name: 'Bridge', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Luis Andrés Enriquez Arias' },
  { id: 'inv-048', name: 'Buen Trip Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/fernandorivera/overlay/about-this-profile/' },
  { id: 'inv-049', name: 'Buen Trip Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Carmen de la Cerda' },
  { id: 'inv-050', name: 'Canary', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Julio Vasconcellos' },
  { id: 'inv-051', name: 'Canary', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/patrick-de-picciotto-0017357/overlay/about-this-profile/' },
  { id: 'inv-052', name: 'Capria Vc', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Daniel Ballesteros' },
  { id: 'inv-053', name: 'Carabela', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Javier Sánchez Aldana' },
  { id: 'inv-054', name: 'Carabela', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Paulina Melo' },
  { id: 'inv-055', name: 'Carabela', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Francisco Ruiz Izaguirre' },
  { id: 'inv-056', name: 'Carao Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Allan Boruchowicz' },
  { id: 'inv-057', name: 'Carao Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Edwin Meyers' },
  { id: 'inv-058', name: 'Carao Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Valentina Silva' },
  { id: 'inv-059', name: 'Caravela Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-060', name: 'Carlos Chaves', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-061', name: 'Carlos Enrique Mata Saravia', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-062', name: 'Cisca Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Angel Cisneros' },
  { id: 'inv-063', name: 'Claire Diaz', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-064', name: 'Claire Diaz Ortiz', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-065', name: 'Clas 5', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Joel A' },
  { id: 'inv-066', name: 'Clas 5', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Zach Finkelstein' },
  { id: 'inv-067', name: 'Claudio Schlegel', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-068', name: 'Clocktower Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-069', name: 'Clyde H', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-070', name: 'Colectivo Jaguar', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Matthieu Dahire' },
  { id: 'inv-071', name: 'Colectivo Jaguar', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Pierre-Etienne Lambert' },
  { id: 'inv-072', name: 'Cometa', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Rafa de Haro' },
  { id: 'inv-073', name: 'Cometa', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Pepe Bolaños' },
  { id: 'inv-074', name: 'Cory Levy', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-075', name: 'Cristobal Perdomo', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-076', name: 'Cube Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Carolina cepeda' },
  { id: 'inv-077', name: 'Cube Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Santiago Rojas Montoya' },
  { id: 'inv-078', name: 'Cupido Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Isma Tejon' },
  { id: 'inv-079', name: 'CVC Latam', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-080', name: 'Daneo', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Sebastián Ibáñez' },
  { id: 'inv-081', name: 'Daniel Bilbabo', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-082', name: 'Daniel Undarraga', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-083', name: 'Darian Shirazi', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-084', name: 'David Velez', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-085', name: 'Davidbaggett', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/davidbaggett/overlay/about-this-profile/' },
  { id: 'inv-086', name: 'Devlabs', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Jose D Lopez' },
  { id: 'inv-087', name: 'DGF Investimentos', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Frederico Greve' },
  { id: 'inv-088', name: 'Diamond Streams', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-089', name: 'Diegoserebrisky', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/diegoserebrisky/overlay/about-this-profile/' },
  { id: 'inv-090', name: 'Dmitry Stepanov', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-091', name: 'Domo VC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Stella Leone' },
  { id: 'inv-092', name: 'Draper B1', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Enrique' },
  { id: 'inv-093', name: 'Drapper B1', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Enrique Penichet García' },
  { id: 'inv-094', name: 'Dux Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/jlsdux/overlay/about-this-profile/' },
  { id: 'inv-095', name: 'Eduardo Ronzano', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-096', name: 'Edward Lando', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-097', name: 'Edward Lando', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-098', name: 'EFS', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Andrés Cifuentes' },
  { id: 'inv-099', name: 'EFS', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Diana Cifuentes' },
  { id: 'inv-100', name: 'Elad Gill', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Pre-Seed', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-101', name: 'Enrique Santa Cruz', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-102', name: 'Enrique Santacruz', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-103', name: 'Enrique Villamarin', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-104', name: 'Epakon', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Diego T. Salas' },
  { id: 'inv-105', name: 'Eric Blachford', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-106', name: 'Eric Reiner', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-107', name: 'Escaletc', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/alvaro-villarroel-val/overlay/about-this-profile/' },
  { id: 'inv-108', name: 'Esteban Reyes Gutierrez', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-109', name: 'Estefania Bello', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-110', name: 'Ethan James A', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-111', name: 'Ewa Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Patricia Saenz' },
  { id: 'inv-112', name: 'Fabian Frubana', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-113', name: 'Faster Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-114', name: 'Felipe Gedeon', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-115', name: 'Fen Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Cristobal Silva Bengolea' },
  { id: 'inv-116', name: 'Fen Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Ricardo Levy' },
  { id: 'inv-117', name: 'Fen Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Eduardo Beffermann' },
  { id: 'inv-118', name: 'Fernando Okamura', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-119', name: 'Fernando Pontanza', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-120', name: 'Fika Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-121', name: 'FJ Labs', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Fabrice Grinda' },
  { id: 'inv-122', name: 'FJ Labs', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Jose Marin' },
  { id: 'inv-123', name: 'Flori Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Ryan Nesbit' },
  { id: 'inv-124', name: 'Frontier Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-125', name: 'Fuse Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Joao Zecchin' },
  { id: 'inv-126', name: 'Fuse Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Dan Yamamura' },
  { id: 'inv-127', name: 'G2 Momentun', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/jorge-gonzalez-gasque-ba048713/overlay/about-this-profile/' },
  { id: 'inv-128', name: 'Gabriel Bernasconi', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-129', name: 'GAIN Angels', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Rodrigo Ramírez Organista' },
  { id: 'inv-130', name: 'GG Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-131', name: 'Globant Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/juanbertiche/overlay/about-this-profile/' },
  { id: 'inv-132', name: 'Guilherme Bonifacio', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-133', name: 'Headline', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-134', name: 'Henrik Zillmer', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-135', name: 'Hernán Guerrero Hinojosa', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/hern%C3%A1n-guerrero-hinojosa-/overlay/about-this-profile/' },
  { id: 'inv-136', name: 'Hesham Zreik', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-137', name: 'Hi Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Federico Antoni' },
  { id: 'inv-138', name: 'Hustle Fund', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-139', name: 'IAGI Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-140', name: 'Ignacio Gonzales', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-141', name: 'Ignaciocanals', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/ignaciocanals/overlay/about-this-profile/' },
  { id: 'inv-142', name: 'Igor Marchesini', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-143', name: 'Immeasurable VC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-144', name: 'Indicator Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/jacobodecal/overlay/about-this-profile/' },
  { id: 'inv-145', name: 'Inqlab', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-146', name: 'Invariantes Fund', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-147', name: 'InverTup', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Marcelo Lebendiker' },
  { id: 'inv-148', name: 'Investin', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Ivan Perez' },
  { id: 'inv-149', name: 'IthinckVc', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/juan-cruz-valdez-rojas/overlay/about-this-profile/' },
  { id: 'inv-150', name: 'iTHINK VC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-151', name: 'Jaime Arrieta', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-152', name: 'Jaime Mutus', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-153', name: 'Jaime Sotomayor', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-154', name: 'Jetblue Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-155', name: 'Joaquin Navasal', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-156', name: 'Joaquin Navasal', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-157', name: 'John Rocha17', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/john-rocha17/overlay/about-this-profile/' },
  { id: 'inv-158', name: 'Jose Bonilla', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-159', name: 'Jose Gio', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-160', name: 'Joshwaksman', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/joshwaksman/overlay/about-this-profile/' },
  { id: 'inv-161', name: 'JP Morgan', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Contacto Camilo' },
  { id: 'inv-162', name: 'Juan Pablo Montoya', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-163', name: 'Juan Pablo Ortega', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Pre-Seed', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-164', name: 'Julio Zaguini', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-165', name: 'K50 Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-166', name: 'Kalei Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Leandro Pisaroni Gerbaldo' },
  { id: 'inv-167', name: 'Kalei Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Tomas Braun' },
  { id: 'inv-168', name: 'Kalei Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Juan Santiago' },
  { id: 'inv-169', name: 'Kalei Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-170', name: 'Kolab Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-171', name: 'Latin Leap', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/stefankrautwald/overlay/about-this-profile/' },
  { id: 'inv-172', name: 'Latin Leap', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Jessica Maldonado' },
  { id: 'inv-173', name: 'Latitud', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/brianrequarth/overlay/about-this-profile/' },
  { id: 'inv-174', name: 'Latitud', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Gina Gotthilf' },
  { id: 'inv-175', name: 'Leap Global Partners', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Roberto Aguayo' },
  { id: 'inv-176', name: 'Leap Global Partners', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Cuco Vega' },
  { id: 'inv-177', name: 'Leonardo Borrero', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-178', name: 'leveluP Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-179', name: 'Liquid2vc', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-180', name: 'Lotus VC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-181', name: 'Lotux Vc', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Matevz (Mat) Gantar' },
  { id: 'inv-182', name: 'Lotux Vc', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Alejandro Romero' },
  { id: 'inv-183', name: 'Loyal VC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/kamalhassan/overlay/about-this-profile/' },
  { id: 'inv-184', name: 'Loyal VC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Michael Kosic' },
  { id: 'inv-185', name: 'Lucasmlameiras', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/lucasmlameiras/overlay/about-this-profile/' },
  { id: 'inv-186', name: 'Lucianno', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Pre-Seed', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-187', name: 'Magical Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Juan Eduardo' },
  { id: 'inv-188', name: 'Magma Partners', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Eugenio Perea' },
  { id: 'inv-189', name: 'Magma Partners', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Pedro P. del Campo' },
  { id: 'inv-190', name: 'Manatura Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/pablotraub/overlay/about-this-profile/' },
  { id: 'inv-191', name: 'Mandi Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-192', name: 'Marathon Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Alejandro Echavarria' },
  { id: 'inv-193', name: 'Marathon Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Leon Papu' },
  { id: 'inv-194', name: 'Marc Blumenthal', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-195', name: 'Marco Valta', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-196', name: 'Martin Ott', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-197', name: 'Martinaspillaga', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/martinaspillaga/overlay/about-this-profile/' },
  { id: 'inv-198', name: 'Mati Botero', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-199', name: 'Matter Scale', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Roberto Charvel' },
  { id: 'inv-200', name: 'Matter Scale', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Fernando Fabre' },
  { id: 'inv-201', name: 'Mauricio Hoyos', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-202', name: 'Maymann', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/maymann/overlay/about-this-profile/' },
  { id: 'inv-203', name: 'Melek Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Francisco García Osuna' },
  { id: 'inv-204', name: 'Michaellhennessey', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/michaellhennessey/overlay/about-this-profile/' },
  { id: 'inv-205', name: 'Michaelma8', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/michaelma8/overlay/about-this-profile/' },
  { id: 'inv-206', name: 'Miguel Vanegas Torres', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-207', name: 'Miyelin Vc', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/federicojack/overlay/about-this-profile/' },
  { id: 'inv-208', name: 'Monashees', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Carlo Dapuzzo' },
  { id: 'inv-209', name: 'Monashees', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Sebastian Cardenas' },
  { id: 'inv-210', name: 'Movtech Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Guillermo del Conte' },
  { id: 'inv-211', name: 'Mrpink VC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Hernan Haro' },
  { id: 'inv-212', name: 'Mrpink VC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Santiago Pehar' },
  { id: 'inv-213', name: 'Nadav Ben-Chanoch', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-214', name: 'Nascent Vc', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/archie-cochrane-59848234/overlay/about-this-profile/' },
  { id: 'inv-215', name: 'Nascent Vc', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-216', name: 'Naval Ravikant', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-217', name: 'New StackVentures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-218', name: 'Newtopia VC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Patricio Jutard' },
  { id: 'inv-219', name: 'Newtopia VC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Sacha Spitz' },
  { id: 'inv-220', name: 'Nick Moran', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-221', name: 'Nicolasserranom', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/nicolasserranom/overlay/about-this-profile/' },
  { id: 'inv-222', name: 'Nilo Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'XXX' },
  { id: 'inv-223', name: 'Niuu Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Reinaldo Normand' },
  { id: 'inv-224', name: 'Numundo Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Ivan Montoya' },
  { id: 'inv-225', name: 'NutVC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Moises Cohen' },
  { id: 'inv-226', name: 'NXTP Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Pre-Seed', sharesPercent: 0, stage: 'Prospecto', contact: 'Daniel Prior' },
  { id: 'inv-227', name: 'OBS', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Federico Casas Alatriste' },
  { id: 'inv-228', name: 'OBS', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/jjmolina/overlay/about-this-profile/' },
  { id: 'inv-229', name: 'OBS', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Anna Raptis' },
  { id: 'inv-230', name: 'OBS', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Adrián Fernández de Mendoza' },
  { id: 'inv-231', name: 'Ocean Azul Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Alex Tellez' },
  { id: 'inv-232', name: 'Ocean Azul Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'David Zinn' },
  { id: 'inv-233', name: 'Opera Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-234', name: 'Orbit Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-235', name: 'Outbound Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/luisgonzalez15/overlay/about-this-profile/?trk=pub-pbmap' },
  { id: 'inv-236', name: 'Pablo Garfinkel', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/pablo-garfinkel/overlay/about-this-profile/' },
  { id: 'inv-237', name: 'Pablo Garfinkel', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-238', name: 'Pablo Gonzales Bitso', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-239', name: 'Pareto Holdings', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-240', name: 'Predective', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Juan Pablo Montoya' },
  { id: 'inv-241', name: 'Punto Cero Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-242', name: 'QP Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-243', name: 'Ricardo Weder', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-244', name: 'Romero', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/romero/overlay/about-this-profile/' },
  { id: 'inv-245', name: 'Rouven Dresselhaus', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-246', name: 'Sahinboydas', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/sahinboydas/overlay/about-this-profile/' },
  { id: 'inv-247', name: 'Sakantay Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-248', name: 'Santiago Sada', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-000', name: 'Sebastian Mazorra', kind: 'Ángel', firm: 'Founder & Investor Pool', committedAmount: 400000, status: 'Firmado', email: 'sebastian@iwait.io', round: 'Fundadores', sharesPercent: 52.4, stage: 'Cerrado', contact: 'Sebastian Mazorra' },
  { id: 'inv-249', name: 'Sebastian Mejia', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-250', name: 'Semilla Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Isabella Rodriguez' },
  { id: 'inv-251', name: 'Sergio Mendoza', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-252', name: 'Shutterstock', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/shutterstock/overlay/about-this-profile/' },
  { id: 'inv-253', name: 'Simma Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Daniel Blandon' },
  { id: 'inv-254', name: 'Simma Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Carlos Gutierrez' },
  { id: 'inv-255', name: 'Simon Borrero', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-256', name: 'Stage Venture Partners', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-257', name: 'Tomaszpawliszyn', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/tomaszpawliszyn/overlay/about-this-profile/' },
  { id: 'inv-258', name: 'Upview Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-259', name: 'Urca Angels', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-260', name: 'Valor Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Fabiana Scionti' },
  { id: 'inv-261', name: 'Valuaty VC', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', linkedin: 'https://www.linkedin.com/in/madeleineclavijoverjel/overlay/about-this-profile/' },
  { id: 'inv-262', name: 'Valure Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Anibal Obregón V' },
  { id: 'inv-263', name: 'Valure Capital', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Daniel Obregon V' },
  { id: 'inv-264', name: 'Vanesa Kolodziej', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-265', name: 'Varsha Rao', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-266', name: 'Ventura Family', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Juan Fernando Jiménez' },
  { id: 'inv-267', name: 'Veronorte', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Camilo Botero Gaviria' },
  { id: 'inv-268', name: 'Veronorte', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'David Toro Gutierrez' },
  { id: 'inv-269', name: 'Veronorte', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-270', name: 'Vertical Partners', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Esteban Urrea' },
  { id: 'inv-271', name: 'Vine Ventur', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-272', name: 'Volans Group', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-273', name: 'Wayne Chang', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-274', name: 'Winipeg Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto', contact: 'Jose Garcia Herz' },
  { id: 'inv-275', name: 'Wollef Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-276', name: 'Xavier Baillères Zambrano', kind: 'Ángel', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-277', name: 'Yango Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' },
  { id: 'inv-278', name: 'Zetta Ventures', kind: 'VC', firm: '', committedAmount: 0, status: 'Pendiente', email: '', round: 'Prospecto', sharesPercent: 0, stage: 'Prospecto' }
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
