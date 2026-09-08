// Tira de "esta semana" bajo la carta del día — contexto de calendario en un
// vistazo, PURAMENTE decorativa a propósito: no inventa qué días se registró
// leyendo (el mock de racha no guarda ese historial por día — ver
// lib/estado-app.ts) y no navega a semanas pasadas (no hay una vista de
// calendario real que mostrar todavía — el Historial guarda lecturas de
// pareja, no el ritual diario). Por eso lleva su propio rótulo "Esta semana"
// y NINGÚN día tiene apariencia de botón salvo el de hoy — así no promete una
// interacción que no existe (Regla de UX 11). Domingo a sábado, semana actual.

const DIAS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

export function SemanaStrip() {
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
                  esHoy ? 'bg-[var(--text-primary)] font-bold text-[var(--bg)]' : 'font-normal text-[var(--text-tertiary)]'
                }`}
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
