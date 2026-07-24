import { TourStep } from '../components/Tour';

/** Interactive tours keyed by App `activeTab`. Steps anchor to [data-tour] ids. */
export const TOURS: Record<string, TourStep[]> = {
  inicio: [
    { title: '¡Bienvenido a iwait CRM!', body: 'Te muestro en 6 pasos cómo moverte. Puedes avanzar con "Siguiente" o las flechas del teclado. Empecemos.' },
    { target: 'sidebar', title: 'El menú lateral', body: 'Desde aquí navegas todo: Inversiones, Producto, Operaciones y Comercial. Las secciones se pueden colapsar.' },
    { target: 'global-search', title: 'Búsqueda global', body: 'Busca inversores, clientes o tareas desde cualquier lugar. Es el atajo más rápido.' },
    { target: 'dash-tabs', title: 'Periodo', body: 'Cambia entre Resumen, Actividad de hoy o de ayer para acotar lo que ves.' },
    { target: 'dash-kpis', title: 'Tus KPIs', body: 'La foto ejecutiva: capital, aeropuertos, clientes y tareas. La barra de color a la izquierda los diferencia.' },
    { target: 'dash-quick', title: 'Acciones rápidas', body: 'Crea un inversor, un lead o una tarea sin salir del dashboard. Aquí termina el tour. 🎉' }
  ],
  inversionstas: [
    { title: 'Módulo Inversionistas', body: 'Aquí gestionas la ronda de principio a fin. Vamos por las partes clave.' },
    { target: 'inv-round', title: 'Ronda activa', body: 'Cuánto llevas comprometido vs. el objetivo. Es tu norte durante el fundraising.' },
    { target: 'inv-tabs', title: 'Base de datos y Pipeline', body: 'Alterna entre la tabla de todos los inversores y el tablero por etapas.' },
    { target: 'inv-add', title: 'Añadir inversor', body: 'Registra nombre, monto, ronda y etapa. Aparecerá en la tabla y en el pipeline.' }
  ],
  producto: [
    { title: 'Aerolíneas & Aeropuertos', body: 'El seguimiento de desarrollo. Cada producto lleva su propio backlog y sprints.' },
    { target: 'prod-cards', title: 'Elige un producto', body: 'Entra a Aerolíneas o AI Aeropuertos para ver su backlog y su progreso.' }
  ],
  tareas: [
    { title: 'Tablero de Tareas', body: 'Kanban del equipo, asignado a Juan Diego o Sebastián. Veamos cómo se usa.' },
    { target: 'tasks-add', title: 'Nueva tarea', body: 'Define título, responsable, prioridad, área y fecha. Cae en la columna que elijas.' },
    { target: 'tasks-board', title: 'Arrastra entre columnas', body: 'Mueve las tarjetas de Pendiente → En progreso → Completado según avancen.' }
  ]
};
