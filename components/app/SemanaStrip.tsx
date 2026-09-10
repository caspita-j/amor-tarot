// Tira de "esta semana" bajo la carta del día — antes era puramente
// decorativa (no había datos reales por día que mostrar). Desde el check-in
// de ánimo (plan de retención, punto 3) cada día con registro pinta el color
// de ese estado — ahí nace el historial visual real. Los días sin check-in
// siguen mostrando solo la fecha, tal como antes; y sigue sin navegar a
// semanas pasadas (mismo motivo documentado desde el inicio: no hay una
// vista de calendario real que enlazar todavía).

import type { Estado } from '@/lib/animo';
import { colorEstado } from '@/lib/animo';

const DIAS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

function fechaISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function SemanaStrip({ estados = {} }: { estados?: Record<string, Estado> }) {
  const hoy = new Date();
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - hoy.getDay());

  const semana = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date(inicioSemana);
    fecha.setDate(inicioSemana.getDate() + i);
    return fecha;
  });

  return (
    <div className="mx-4 mt-3.5" role="group" aria-label="Esta semana">
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-tertiary)]">
        Esta semana
      </p>
      <div className="grid grid-cols-7 gap-1.5">
        {semana.map((fecha, i) => {
          const esHoy = fecha.toDateString() === hoy.toDateString();
          const estado = estados[fechaISO(fecha)];
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span
                className={`text-xs font-semibold tracking-wide ${
                  esHoy ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
                }`}
              >
                {DIAS[i]}
              </span>
              <span
                className={`flex size-8 items-center justify-center rounded-full text-sm tabular-nums ${
                  estado
                    ? 'font-bold text-[var(--bg)]'
                    : esHoy
                      ? 'bg-[var(--text-primary)] font-bold text-[var(--bg)]'
                      : 'font-normal text-[var(--text-tertiary)]'
                }`}
                style={estado ? { backgroundColor: colorEstado(estado) } : undefined}
              >
                {fecha.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
