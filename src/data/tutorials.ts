export interface TutorialStep {
  title: string;
  body: string;
}

export interface Tutorial {
  title: string;
  intro: string;
  steps: TutorialStep[];
  tip: string;
}

/** Keyed by the App `activeTab` id */
export const TUTORIALS: Record<string, Tutorial> = {
  inicio: {
    title: 'Inicio · Dashboard',
    intro: 'Tu vista ejecutiva. En 5 segundos deberías saber cómo va la empresa: capital, pipeline, producto y tareas.',
    steps: [
      { title: 'Lee los KPIs de arriba', body: 'Capital levantado, aeropuertos activos, clientes en pipeline y tareas pendientes. La barra de color a la izquierda te ayuda a distinguirlos de un vistazo.' },
      { title: 'Cambia el periodo', body: 'Usa las pestañas Resumen / Actividad hoy / Ayer para acotar lo que ves.' },
      { title: 'Crea con Acciones rápidas', body: 'Los botones Nuevo Inversor, Nuevo Lead y Crear Tarea te dejan registrar algo sin salir del dashboard.' },
      { title: 'Revisa Actividad y Pipeline', body: 'La columna izquierda muestra lo último que pasó; la derecha, cómo avanza cada etapa del funnel.' }
    ],
    tip: 'Empieza tu día aquí. Si un KPI se ve mal, entra a su sección para actuar.'
  },
  inversionstas: {
    title: 'Inversionistas',
    intro: 'Gestiona la ronda: quién invierte, cuánto, en qué etapa va y cuánto falta para el objetivo.',
    steps: [
      { title: 'Mira la Ronda activa', body: 'La barra superior muestra cuánto llevas comprometido vs. el objetivo de la ronda. Es tu norte.' },
      { title: 'Base de datos', body: 'La tabla lista todos los inversores con su contacto, monto, equity y estado. Úsala para consultar y buscar.' },
      { title: 'Pipeline', body: 'Cambia a la pestaña Pipeline y arrastra cada inversor por las etapas: Contactado → Reunión → Due Diligence → Compromiso → Cerrado.' },
      { title: 'Añade un inversor', body: 'Con "Añadir inversor" registras nombre, monto, ronda y etapa inicial. Aparecerá en la tabla y en el pipeline.' }
    ],
    tip: 'Mantén el pipeline al día: mover una tarjeta a "Cerrado" suma al progreso de la ronda automáticamente.'
  },
  dataroom: {
    title: 'Data Room',
    intro: 'El repositorio de documentos para due diligence: term sheets, financieros, legales y de producto.',
    steps: [
      { title: 'Explora por categoría', body: 'Los documentos están organizados por tipo (Legal, Finanzas, Producto...).' },
      { title: 'Revisa la confidencialidad', body: 'Cada archivo indica si es Público, Confidencial o Solo Directiva. Compártelo en consecuencia.' },
      { title: 'Sube documentos', body: 'Agrega los materiales que un inversor pediría en una due diligence, manteniéndolos versionados.' }
    ],
    tip: 'Tener el Data Room ordenado acelera el cierre: es lo primero que revisa un inversor serio.'
  },
  producto: {
    title: 'Aerolíneas & Aeropuertos',
    intro: 'El seguimiento de desarrollo. Cada producto (Aerolíneas y AI Aeropuertos) tiene su propio backlog y sus sprints.',
    steps: [
      { title: 'Elige un producto', body: 'Entra a Aerolíneas o AI Aeropuertos. Cada uno lleva su backlog y progreso por separado.' },
      { title: 'Backlog', body: 'Los ítems se agrupan por épica. Cada uno tiene tipo (Historia/Bug/Spike), prioridad, story points, responsable y estado editable.' },
      { title: 'Cambia estados', body: 'Usa el selector de estado de cada ítem (Backlog → Por hacer → En progreso → Review → Hecho) para reflejar el avance real.' },
      { title: 'Progreso', body: 'La pestaña Progreso muestra los sprints con su % completado, calculado desde los mismos ítems del backlog.' }
    ],
    tip: 'Trabaja desde el Backlog; el Progreso se actualiza solo. Un sprint bien definido tiene un objetivo claro.'
  },
  compensaciones: {
    title: 'Compensaciones & Progreso',
    intro: 'La foto de equity, salarios e hitos financieros ligados al progreso de la compañía.',
    steps: [
      { title: 'Revisa hitos por fase', body: 'Cada fase tiene su financiación, fecha objetivo y % de avance.' },
      { title: 'Consulta la estructura de equipo', body: 'Salarios, equity y vesting de cada integrante clave.' },
      { title: 'Ajusta supuestos', body: 'Modifica los parámetros para ver cómo cambian runway y masa salarial.' }
    ],
    tip: 'Úsalo antes de una ronda: te dice cuánto runway compras con cuánta dilución.'
  },
  tareas: {
    title: 'Tareas',
    intro: 'Tablero Kanban del equipo. Tareas comunes asignadas a Juan Diego o Sebastián, etiquetadas por área.',
    steps: [
      { title: 'Tres columnas', body: 'Pendiente, En progreso y Completado. Arrastra las tarjetas o usa los botones de acción al pasar el mouse.' },
      { title: 'Crea una tarea', body: 'Con "Nueva tarea" defines título, responsable (Juan Diego / Sebastián), prioridad, área y fecha límite.' },
      { title: 'Filtra y busca', body: 'Usa el buscador y el filtro de prioridad para enfocarte en lo importante.' },
      { title: 'Cierra el ciclo', body: 'Mueve a Completado lo que termines; lo vencido se resalta para que no se te escape.' }
    ],
    tip: 'Una tarea buena tiene responsable y fecha. Si no los tiene, probablemente no se hará.'
  },
  leads: {
    title: 'Leads & Pipeline',
    intro: 'Los prospectos comerciales (aerolíneas, aeropuertos, comercios) antes de convertirse en clientes.',
    steps: [
      { title: 'Revisa el pipeline comercial', body: 'Cada lead tiene su etapa, valor de deal y contacto.' },
      { title: 'Registra un lead', body: 'Añade la cuenta, su hub y el valor estimado del negocio.' },
      { title: 'Haz seguimiento', body: 'Actualiza el estado a medida que avanza la conversación comercial.' }
    ],
    tip: 'Prioriza por valor de deal y probabilidad: no todos los leads merecen el mismo esfuerzo.'
  },
  clientes: {
    title: 'Clientes',
    intro: 'Las cuentas ya activas. Aquí registras actividad y das seguimiento a la relación.',
    steps: [
      { title: 'Consulta la base de clientes', body: 'Tipo de cuenta, hub, contacto y valor. Es tu CRM operativo.' },
      { title: 'Registra actividad', body: 'Anota llamadas, reuniones y notas para mantener el historial de la relación.' },
      { title: 'Detecta oportunidades', body: 'Un cliente operativo es candidato a expandir a más terminales o módulos.' }
    ],
    tip: 'La retención vive de la actividad registrada: lo que no se anota, se olvida.'
  }
};
