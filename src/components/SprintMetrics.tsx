import React from 'react';
import { TrendingDown, Users, Gauge, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { BacklogItem, Sprint, parseSprintRange } from '../data/productData';

interface SprintMetricsProps {
  sprint: Sprint;
  items: BacklogItem[];
  /** sprints ya cerrados del mismo producto, para la velocidad histórica */
  history: { sprint: Sprint; items: BacklogItem[] }[];
}

const initialsOf = (n: string) =>
  n.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export default function SprintMetrics({ sprint, items, history }: SprintMetricsProps) {
  const total = items.reduce((s, i) => s + i.points, 0);
  const done = items.filter((i) => i.status === 'Hecho');
  const donePts = done.reduce((s, i) => s + i.points, 0);
  const remaining = total - donePts;

  /* ---------------- Burndown ---------------- */
  const range = parseSprintRange(sprint.range);
  const totalDays = range
    ? Math.max(1, Math.round((range.end.getTime() - range.start.getTime()) / 86400000))
    : 14;
  const elapsed = range
    ? Math.min(totalDays, Math.max(0, Math.round((Date.now() - range.start.getTime()) / 86400000)))
    : Math.round(totalDays / 2);

  // Línea ideal: reparto lineal del total a lo largo del sprint
  const idealRemaining = Math.max(0, Math.round(total * (1 - elapsed / totalDays)));
  const delta = remaining - idealRemaining; // >0 = vamos retrasados
  const onTrack = delta <= 0;

  // Puntos del gráfico (ideal vs real hasta hoy)
  const steps = Math.min(totalDays, 14);
  const idealSeries = Array.from({ length: steps + 1 }, (_, i) => total * (1 - i / steps));
  const todayIdx = Math.round((elapsed / totalDays) * steps);

  const chartW = 100;
  const chartH = 100;
  const toXY = (i: number, val: number) => ({
    x: (i / steps) * chartW,
    y: total > 0 ? chartH - (val / total) * chartH : chartH
  });

  const idealPath = idealSeries
    .map((v, i) => {
      const { x, y } = toXY(i, v);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Real: de total al inicio hasta lo que queda hoy
  const realStart = toXY(0, total);
  const realNow = toXY(todayIdx, remaining);
  const realPath = `M${realStart.x},${realStart.y} L${realNow.x.toFixed(1)},${realNow.y.toFixed(1)}`;

  /* ---------------- Capacidad por persona ---------------- */
  const byAssignee = items.reduce<Record<string, { total: number; done: number; count: number }>>((acc, i) => {
    const k = i.assignee || 'Sin asignar';
    if (!acc[k]) acc[k] = { total: 0, done: 0, count: 0 };
    acc[k].total += i.points;
    acc[k].count += 1;
    if (i.status === 'Hecho') acc[k].done += i.points;
    return acc;
  }, {});
  const people = Object.entries(byAssignee).sort((a, b) => b[1].total - a[1].total);
  const maxLoad = Math.max(...people.map(([, v]) => v.total), 1);

  /* ---------------- Velocidad histórica ---------------- */
  const velocities = history.map((h) => ({
    name: h.sprint.name,
    pts: h.items.filter((i) => i.status === 'Hecho').reduce((s, i) => s + i.points, 0)
  }));
  const avgVelocity =
    velocities.length > 0 ? Math.round(velocities.reduce((s, v) => s + v.pts, 0) / velocities.length) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* ---- Burndown ---- */}
      <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-[17px] h-[17px] text-[#0E457F]" />
            <h4 className="text-[14px] font-bold text-[#0F1A2C]">Burndown — {sprint.name}</h4>
          </div>
          <span
            className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
              onTrack ? 'bg-[#10CC82]/12 text-[#0f9c66]' : 'bg-[#F5A623]/15 text-[#b8790f]'
            }`}
          >
            {onTrack ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {onTrack ? 'En ritmo' : `${delta} pts por detrás`}
          </span>
        </div>

        <div className="relative">
          <svg viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" className="w-full h-[150px]">
            {/* rejilla */}
            {[0, 25, 50, 75, 100].map((p) => (
              <line key={p} x1="0" y1={p} x2={chartW} y2={p} stroke="#eef2f6" strokeWidth="0.6" />
            ))}
            {/* ideal */}
            <path d={idealPath} fill="none" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
            {/* real */}
            <path d={realPath} fill="none" stroke={onTrack ? '#10CC82' : '#F5A623'} strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <circle cx={realNow.x} cy={realNow.y} r="2" fill={onTrack ? '#10CC82' : '#F5A623'} />
          </svg>
          <div className="flex justify-between text-[10.5px] text-[#94a3b8] mt-1.5 font-mono">
            <span>día 1</span>
            <span>hoy · día {elapsed}</span>
            <span>día {totalDays}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#eef2f6]">
          <div>
            <div className="text-[18px] font-bold text-[#0F1A2C]">{remaining}</div>
            <div className="text-[11px] text-[#64748B]">pts restantes</div>
          </div>
          <div>
            <div className="text-[18px] font-bold text-[#94a3b8]">{idealRemaining}</div>
            <div className="text-[11px] text-[#64748B]">ideal a hoy</div>
          </div>
          <div>
            <div className="text-[18px] font-bold text-[#10CC82]">{donePts}</div>
            <div className="text-[11px] text-[#64748B]">completados</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-[10.5px] text-[#94a3b8]">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0 border-t-2 border-dashed border-[#cbd5e1]" /> ideal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 rounded" style={{ backgroundColor: onTrack ? '#10CC82' : '#F5A623' }} /> real
          </span>
        </div>
      </div>

      {/* ---- Capacidad + velocidad ---- */}
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-[17px] h-[17px] text-[#8B63F5]" />
            <h4 className="text-[14px] font-bold text-[#0F1A2C]">Carga del equipo</h4>
            <span className="ml-auto text-[11px] text-[#64748B]">{total} pts en el sprint</span>
          </div>

          {people.length === 0 ? (
            <p className="text-[13px] text-[#94a3b8] py-4 text-center">Sin ítems asignados en este sprint.</p>
          ) : (
            <div className="space-y-3.5">
              {people.map(([name, v]) => {
                const unassigned = name === 'Sin asignar';
                const pct = Math.round((v.done / v.total) * 100) || 0;
                return (
                  <div key={name}>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[9.5px] font-bold flex-shrink-0 ${
                          unassigned ? 'bg-[#eef2f6] text-[#94a3b8]' : 'bg-gradient-to-br from-[#0E457F] to-[#47B6E6] text-white'
                        }`}
                      >
                        {unassigned ? '?' : initialsOf(name)}
                      </span>
                      <span className={`text-[13px] font-semibold ${unassigned ? 'text-[#94a3b8] italic' : 'text-[#0F1A2C]'}`}>
                        {name}
                      </span>
                      <span className="ml-auto text-[12px] font-mono text-[#64748B]">
                        {v.done}/{v.total} pts · {v.count} ít.
                      </span>
                    </div>
                    {/* barra: ancho relativo a la carga máxima, relleno = avance */}
                    <div className="h-2 rounded-full bg-[#f1f5f9] overflow-hidden" style={{ width: `${(v.total / maxLoad) * 100}%` }}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0E457F] to-[#47B6E6]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#e6eef4] shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-[17px] h-[17px] text-[#00C9A7]" />
            <h4 className="text-[14px] font-bold text-[#0F1A2C]">Velocidad</h4>
            {avgVelocity !== null && (
              <span className="ml-auto text-[11px] text-[#64748B]">
                promedio <span className="font-bold text-[#0F1A2C]">{avgVelocity} pts</span>
              </span>
            )}
          </div>

          {velocities.length === 0 ? (
            <p className="text-[12.5px] text-[#94a3b8] py-3">
              Aún no hay sprints cerrados. Al cerrar el primero podrás comparar la velocidad y estimar mejor.
            </p>
          ) : (
            <div className="flex items-end gap-3 h-[90px]">
              {velocities.map((v) => {
                const max = Math.max(...velocities.map((x) => x.pts), 1);
                return (
                  <div key={v.name} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#0F1A2C]">{v.pts}</span>
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-[#00C9A7] to-[#47B6E6] min-h-[4px]"
                      style={{ height: `${(v.pts / max) * 100}%` }}
                    />
                    <span className="text-[10px] text-[#94a3b8] truncate w-full text-center">{v.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
