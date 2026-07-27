/* ------------------------------------------------------------------ */
/*  Importador del CSV oficial de conexiones de LinkedIn                */
/*  (Configuración → Privacidad de datos → Obtener una copia de tus     */
/*   datos → Conexiones). No hay scraping: es la exportación propia.    */
/* ------------------------------------------------------------------ */

export interface LinkedInConnection {
  firstName: string;
  lastName: string;
  url: string;
  email: string;
  company: string;
  position: string;
  connectedOn: string;
}

export interface ScoredConnection extends LinkedInConnection {
  /** true si parece pertenecer a un fondo de inversión */
  isFund: boolean;
  /** términos que dispararon la detección, para explicarle al usuario */
  matches: string[];
}

/* ----------------------------- CSV ------------------------------- */

/** Parser de una línea CSV que respeta comillas y comas internas */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // Comilla escapada ("") dentro de un campo entrecomillado
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

/**
 * Parsea el CSV de LinkedIn. El archivo trae unas líneas de aviso antes
 * de la cabecera real, así que buscamos la fila que contiene "First Name".
 */
export function parseLinkedInCsv(text: string): LinkedInConnection[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
  const headerIdx = lines.findIndex(
    (l) => l.toLowerCase().includes('first name') && l.toLowerCase().includes('last name')
  );
  if (headerIdx === -1) return [];

  const header = parseCsvLine(lines[headerIdx]).map((h) => h.toLowerCase().replace(/^"|"$/g, ''));
  const idx = (...names: string[]) => {
    for (const n of names) {
      const i = header.indexOf(n);
      if (i !== -1) return i;
    }
    return -1;
  };

  const iFirst = idx('first name');
  const iLast = idx('last name');
  const iUrl = idx('url', 'profile url');
  const iEmail = idx('email address', 'email');
  const iCompany = idx('company');
  const iPosition = idx('position');
  const iDate = idx('connected on');

  const rows: LinkedInConnection[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const c = parseCsvLine(lines[i]);
    if (c.length < 2) continue;
    const at = (n: number) => (n >= 0 && n < c.length ? c[n].replace(/^"|"$/g, '') : '');

    const firstName = at(iFirst);
    const lastName = at(iLast);
    if (!firstName && !lastName) continue;

    rows.push({
      firstName,
      lastName,
      url: at(iUrl),
      email: at(iEmail),
      company: at(iCompany),
      position: at(iPosition),
      connectedOn: at(iDate)
    });
  }
  return rows;
}

/* ------------------------ Detección de fondos --------------------- */

/** Señales en el nombre de la empresa */
const COMPANY_SIGNALS = [
  'capital', 'ventures', 'venture', 'partners', 'fund', 'funds', 'vc',
  'invest', 'investment', 'investments', 'angel', 'equity', 'asset management',
  'holdings', 'seed', 'growth', 'accelerator', 'incubator', 'family office'
];

/** Señales en el cargo */
const POSITION_SIGNALS = [
  'investor', 'inversor', 'partner', 'socio', 'principal', 'associate',
  'venture', 'investment', 'portfolio', 'general partner', 'limited partner',
  'managing director', 'analyst', 'dealflow', 'deal flow'
];

/** Empresas que contienen "partners" pero rara vez son fondos */
const NEGATIVE_SIGNALS = ['law', 'legal', 'abogados', 'consulting', 'consultoría', 'recruit', 'staffing'];

const norm = (s: string) => s.toLowerCase();

export function scoreConnection(c: LinkedInConnection): ScoredConnection {
  const company = norm(c.company);
  const position = norm(c.position);
  const matches: string[] = [];

  for (const s of COMPANY_SIGNALS) {
    if (company.includes(s)) matches.push(s);
  }
  for (const s of POSITION_SIGNALS) {
    if (position.includes(s)) matches.push(s);
  }

  const negative = NEGATIVE_SIGNALS.some((s) => company.includes(s) || position.includes(s));

  // Un solo match de cargo genérico ("partner", "associate") es débil por sí solo;
  // pedimos señal en la empresa o al menos dos coincidencias.
  const companyHit = COMPANY_SIGNALS.some((s) => company.includes(s));
  const isFund = !negative && (companyHit || matches.length >= 2);

  return { ...c, isFund, matches: Array.from(new Set(matches)) };
}

export function scoreConnections(rows: LinkedInConnection[]): ScoredConnection[] {
  return rows
    .map(scoreConnection)
    // los detectados primero, luego alfabético por empresa
    .sort((a, b) => {
      if (a.isFund !== b.isFund) return a.isFund ? -1 : 1;
      return a.company.localeCompare(b.company);
    });
}

export const fullName = (c: LinkedInConnection) => `${c.firstName} ${c.lastName}`.trim();
