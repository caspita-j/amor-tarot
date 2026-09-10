'use client';

// Historial — protagonista: ver las lecturas guardadas. Estado vacío
// explícito (todavía no hay cuenta real, sessionStorage arranca vacío en
// cada sesión nueva del navegador) en vez de un hueco en blanco.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { BotonPrincipal } from '@/components/onboarding/ui';
import { leerLecturasReales, type LecturaGuardada } from '@/lib/supabase/datos';
import { labelCategoria } from '@/lib/categorias';

function formatearFecha(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

/** Si al menos 3 de las últimas 5 lecturas comparten categoría, se lo
 * señalamos — un patrón real, no algo inventado sobre pocos datos. */
function patronReciente(lecturas: LecturaGuardada[]): string | null {
  const ultimas = lecturas.slice(0, 5);
  if (ultimas.length < 3) return null;
  const conteo = new Map<string, number>();
  for (const l of ultimas) conteo.set(l.categoria, (conteo.get(l.categoria) ?? 0) + 1);
  const [categoriaTop, veces] = [...conteo.entries()].sort((a, b) => b[1] - a[1])[0];
  if (veces < 3) return null;
  return `${veces} de tus últimas ${ultimas.length} lecturas fueron sobre ${labelCategoria(categoriaTop as Parameters<typeof labelCategoria>[0]).toLowerCase()}.`;
}

export default function HistorialPage() {
  const [lecturas, setLecturas] = useState<LecturaGuardada[] | null>(null);

  useEffect(() => {
    leerLecturasReales().then(setLecturas);
  }, []);

  if (lecturas === null) {
    return (
      <div className="flex h-64 items-center justify-center" role="status" aria-label="Cargando">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--surface-2)] border-t-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <h1 className="text-2xl font-bold [font-family:var(--font-display)]">Historial</h1>

      {lecturas.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] px-6 py-10 text-center">
          <Sparkles size={26} color="var(--accent)" aria-hidden="true" />
          <p className="text-base font-bold [font-family:var(--font-display)]">Aún no tienes lecturas guardadas</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Cuando saques una lectura y la guardes, va a quedar acá.
          </p>
          <Link href="/app/lecturas" className="mt-2 w-full">
            <BotonPrincipal>Sacar mi primera lectura</BotonPrincipal>
          </Link>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {patronReciente(lecturas) && (
            <div className="flex items-start gap-2.5 rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-3.5">
              <TrendingUp size={16} color="var(--accent)" className="mt-0.5 shrink-0" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-[var(--text-primary)]">{patronReciente(lecturas)}</p>
            </div>
          )}
          {lecturas.map((l) => (
            <div key={l.id} className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[var(--text-secondary)]">{formatearFecha(l.fecha)}</p>
                    <span className="text-[var(--text-tertiary)]" aria-hidden="true">·</span>
                    <p className="text-xs font-bold text-[var(--accent)]">{labelCategoria(l.categoria)}</p>
                  </div>
                  <p className="mt-1.5 text-sm font-bold [font-family:var(--font-display)]">
                    {l.cartas[0]} · {l.cartas[1]} · {l.cartas[2]}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-sm text-[var(--text-secondary)]">{l.resumen}</p>
                </div>
                {l.fotos && l.fotos.length > 0 && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={l.fotos[0]}
                    alt=""
                    className="size-14 shrink-0 rounded-2xl object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
