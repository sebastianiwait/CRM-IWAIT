import { Deal, dealAlert, ALERT_META, daysInactive, formatDate, todayISO } from '../data/crmData';
import { KanbanTask } from '../data/iwaitData';
import { BacklogItem, Sprint, parseSprintRange } from '../data/productData';

export type NotificationSeverity = 'alta' | 'media' | 'baja';

/** Origen de la notificación: define a dónde navega al hacer clic */
export type NotificationSource = 'negocios' | 'tareas' | 'producto';

export interface AppNotification {
  id: string;
  severity: NotificationSeverity;
  source: NotificationSource;
  title: string;
  detail: string;
  /** id del negocio o del ítem de backlog, para abrirlo directamente */
  targetId?: string;
}

export const SEVERITY_META: Record<NotificationSeverity, { color: string; bg: string }> = {
  alta: { color: '#F05252', bg: 'rgba(240,82,82,0.12)' },
  media: { color: '#F5A623', bg: 'rgba(245,166,35,0.14)' },
  baja: { color: '#64748B', bg: 'rgba(100,116,139,0.12)' }
};

const SOURCE_LABEL: Record<NotificationSource, string> = {
  negocios: 'Negocios',
  tareas: 'Tareas',
  producto: 'Producto'
};

export const sourceLabel = (s: NotificationSource) => SOURCE_LABEL[s];

const SEVERITY_ORDER: NotificationSeverity[] = ['alta', 'media', 'baja'];

/**
 * Reúne en una sola lista lo que requiere acción hoy: negocios con alerta,
 * tareas vencidas y sprints que van por detrás del ritmo ideal.
 */
export const buildNotifications = (
  deals: Deal[],
  tasks: KanbanTask[],
  backlog: BacklogItem[],
  sprints: Sprint[]
): AppNotification[] => {
  const out: AppNotification[] = [];
  const today = todayISO();

  /* -------------------------- Negocios -------------------------- */
  deals.forEach((d) => {
    const alert = dealAlert(d);
    if (!alert) return;
    const meta = ALERT_META[alert];
    let detail = meta.label;
    if (alert === 'overdue') {
      detail = `Vencía el ${formatDate(d.nextActionDate!)}: ${d.nextAction ?? 'sin descripción'}`;
    } else if (alert === 'stale') {
      const days = daysInactive(d);
      detail = `Sin actividad registrada hace ${days} días`;
    } else {
      detail = 'Negocio abierto sin próxima acción definida';
    }
    out.push({
      id: `nt-deal-${d.id}`,
      severity: alert === 'overdue' ? 'alta' : alert === 'stale' ? 'media' : 'baja',
      source: 'negocios',
      title: `${d.company} — ${meta.short}`,
      detail,
      targetId: d.id
    });
  });

  /* --------------------------- Tareas --------------------------- */
  tasks.forEach((t) => {
    if (t.column === 'Hecho' || !t.dueDate) return;
    if (t.dueDate < today) {
      out.push({
        id: `nt-task-${t.id}`,
        severity: 'alta',
        source: 'tareas',
        title: `Tarea vencida — ${t.title}`,
        detail: `${t.assignedTo} · vencía el ${formatDate(t.dueDate)}`
      });
    } else if (t.dueDate === today) {
      out.push({
        id: `nt-task-${t.id}`,
        severity: 'media',
        source: 'tareas',
        title: `Vence hoy — ${t.title}`,
        detail: `${t.assignedTo} · ${t.column}`
      });
    }
  });

  /* -------------------------- Producto -------------------------- */
  sprints
    .filter((s) => s.status === 'Activo')
    .forEach((s) => {
      const items = backlog.filter((i) => i.sprintId === s.id);
      if (items.length === 0) return;
      const total = items.reduce((a, i) => a + i.points, 0);
      if (total === 0) return;
      const donePts = items.filter((i) => i.status === 'Hecho').reduce((a, i) => a + i.points, 0);

      const range = parseSprintRange(s.range);
      const totalDays = range
        ? Math.max(1, Math.round((range.end.getTime() - range.start.getTime()) / 86400000))
        : 14;
      const elapsed = range
        ? Math.min(totalDays, Math.max(0, Math.round((Date.now() - range.start.getTime()) / 86400000)))
        : Math.round(totalDays / 2);

      const idealPct = Math.round((elapsed / totalDays) * 100);
      const realPct = Math.round((donePts / total) * 100);
      // La ventana del sprint ya venció pero sigue marcado como activo
      const expired = !!range && Date.now() > range.end.getTime();

      // Margen de 15 puntos para no alarmar por ruido normal del sprint
      if (idealPct - realPct > 15) {
        out.push({
          id: `nt-sprint-${s.id}`,
          severity: idealPct - realPct > 35 ? 'alta' : 'media',
          source: 'producto',
          title: expired
            ? `${s.name} sigue abierto y su fecha ya pasó`
            : `${s.name} va por detrás del ritmo`,
          detail: expired
            ? `Terminaba el ${s.range.split('—')[1]?.trim() ?? s.range} con ${realPct}% completado (${donePts}/${total} pts)`
            : `${realPct}% completado y debería ir por ${idealPct}% (${donePts}/${total} pts)`
        });
      }
    });

  // Ítems críticos sin responsable: nadie los va a tomar solo
  backlog
    .filter((i) => i.priority === 'Crítica' && i.status !== 'Hecho' && i.assignee === 'Sin asignar')
    .forEach((i) => {
      out.push({
        id: `nt-item-${i.id}`,
        severity: 'media',
        source: 'producto',
        title: `${i.id} crítico sin responsable`,
        detail: i.title,
        targetId: i.id
      });
    });

  return out.sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  );
};
