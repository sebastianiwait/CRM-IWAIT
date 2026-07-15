import { KanbanTask } from '../data/iwaitData';

export async function notifyTaskAssignee(task: KanbanTask): Promise<void> {
  if (!task.assigneeEmail) return;

  const response = await fetch('/api/notifications/task-assigned', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'No se pudo enviar la notificación.');
}
