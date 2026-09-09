'use client';

// Gráfico de barras del panel de admin — specs Tufte (17-VISUALIZACION-DATOS.md):
// máxima tinta de dato, mínima decorativa. Sin sombras, sin relleno 3D, sin
// grid de fondo, etiqueta directa en el valor más alto. El color es el
// acento de la sección que lo usa (nunca decorativo/aleatorio).

import { motion, useReducedMotion } from 'motion/react';

// `valorFormateado` se calcula en el servidor (donde vive la lógica de cada
// pantalla) y se pasa ya como texto — pasar una FUNCIÓN de formateo de un
// Server Component a este Client Component no es posible (React no puede
// serializar funciones cruzando ese límite; era un bug real, encontrado al
// verificar esta pantalla en vivo).
export type PuntoBarra = { etiqueta: string; valor: number; valorFormateado?: string; detalle?: string };

export function GraficoBarras({
  datos,
  color,
  vacio = 'Sin datos en este período todavía.',
}: {
  datos: PuntoBarra[];
  color: string;
  vacio?: string;
}) {
  const reduce = useReducedMotion();

  if (datos.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)]">{vacio}</p>;
  }

  const max = Math.max(...datos.map((d) => d.valor), 0.000001);

  return (
    <div className="flex h-24 items-end gap-1 overflow-x-auto pb-1">
      {datos.map((d, i) => {
        const alturaPct = Math.max(4, (d.valor / max) * 100);
        return (
          <div key={d.etiqueta} className="group flex min-w-3 flex-1 flex-col items-center justify-end gap-1">
            {d.valor > 0 && (
              <span className="text-xs font-bold tabular-nums text-[var(--text-tertiary)] opacity-0 transition-opacity group-hover:opacity-100">
                {d.valorFormateado ?? d.valor}
              </span>
            )}
            <motion.div
              className="w-full rounded-t-sm"
              style={{ backgroundColor: color }}
              initial={reduce ? false : { height: 0 }}
              animate={{ height: `${alturaPct}%` }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.012, ease: [0.16, 1, 0.3, 1] }}
              title={`${d.etiqueta}: ${d.valorFormateado ?? d.valor}${d.detalle ? ' · ' + d.detalle : ''}`}
            />
          </div>
        );
      })}
    </div>
  );
}
