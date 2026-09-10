'use client';

// Historial — protagonista: ver las lecturas guardadas. Estado vacío
// explícito (todavía no hay cuenta real, sessionStorage arranca vacío en
// cada sesión nueva del navegador) en vez de un hueco en blanco.
//
// "Tu semana en resumen" (arriba de todo): la pieza pensada para que el
// valor pago se sienta acumulativo, no solo puntual — un reflejo de la
// semana armado con el ánimo + las lecturas reales, que se afina mientras
// más se usa la app. Se pide sola al entrar; si no hay datos suficientes
// esa semana, no se fuerza nada — sencillamente no aparece.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Route, Sparkles, TrendingUp, X } from 'lucide-react';
import { BotonPrincipal } from '@/components/onboarding/ui';
import { leerLecturasReales, type LecturaGuardada } from '@/lib/supabase/datos';
import { labelCategoria, type Categoria } from '@/lib/categorias';
import { marcarIntroHistorialVista, vioIntroHistorial } from '@/lib/estado-app';

const MINIMO_AVANCE = 3;

/** La categoría con más historia (3+ lecturas) — solo esa tiene un arco real
 * que reflejar. Si dos empatan, gana la que tiene la lectura más reciente. */
function categoriaConMasHistoria(lecturas: LecturaGuardada[]): Categoria | null {
  const conteo = new Map<Categoria, number>();
  for (const l of lecturas) conteo.set(l.categoria, (conteo.get(l.categoria) ?? 0) + 1);
  const candidatas = [...conteo.entries()].filter(([, n]) => n >= MINIMO_AVANCE);
  if (candidatas.length === 0) return null;
  candidatas.sort((a, b) => b[1] - a[1]);
  return candidatas[0][0];
}

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

function IntroHistorial({ onCerrar }: { onCerrar: () => void }) {
  return (
    <div className="mt-5 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[var(--chip-bg)] p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold [font-family:var(--font-display)]">Así funciona tu Historial</p>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="shrink-0 text-[var(--text-secondary)]"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <ul className="mt-2.5 flex flex-col gap-2 text-sm leading-relaxed text-[var(--text-secondary)]">
        <li>Acá va quedando cada lectura que guardes, con su fecha y su categoría.</li>
        <li>
          Cada semana armamos{' '}
          <strong className="font-bold text-[var(--text-primary)]">Tu semana en resumen</strong>, con
          tu ánimo y tus lecturas juntos.
        </li>
        <li>
          Si tienes 3 o más lecturas sobre lo mismo, va a aparecer{' '}
          <strong className="font-bold text-[var(--text-primary)]">Tu avance</strong> — te muestra
          cómo se movió esa situación real, con honestidad (nunca "todo mejora" porque sí).
        </li>
      </ul>
      <button type="button" onClick={onCerrar} className="mt-3 text-sm font-bold text-[var(--accent)]">
        Entendido
      </button>
    </div>
  );
}

function InformeSemanal() {
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'vacio'>('cargando');
  const [texto, setTexto] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('/api/informe-semanal', { method: 'POST' });
        const data = (await resp.json()) as { texto?: string; error?: string };
        if (data.texto) {
          setTexto(data.texto);
          setEstado('listo');
        } else {
          setEstado('vacio');
        }
      } catch {
        setEstado('vacio');
      }
    })();
  }, []);

  if (estado === 'vacio') return null;

  return (
    <div className="mt-5 overflow-hidden rounded-[var(--radius-card)] bg-[var(--accent)] p-4 shadow-[var(--shadow-2)]">
      <p className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_oklab,var(--bg)_92%,transparent)]">
        Tu semana en resumen
      </p>
      {estado === 'cargando' ? (
        <div className="mt-2.5 flex flex-col gap-2">
          <div className="h-3 w-full animate-pulse rounded-full bg-[color-mix(in_oklab,var(--bg)_25%,transparent)]" />
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--bg)_25%,transparent)]" />
          <div className="h-3 w-3/5 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--bg)_25%,transparent)]" />
        </div>
      ) : (
        <p className="mt-2.5 text-sm leading-relaxed text-[var(--bg)]">{texto}</p>
      )}
    </div>
  );
}

function AvanceCategoria({ categoria }: { categoria: Categoria }) {
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'vacio'>('cargando');
  const [texto, setTexto] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('/api/avance-categoria', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoria }),
        });
        const data = (await resp.json()) as { texto?: string; error?: string };
        if (data.texto) {
          setTexto(data.texto);
          setEstado('listo');
        } else {
          setEstado('vacio');
        }
      } catch {
        setEstado('vacio');
      }
    })();
  }, [categoria]);

  if (estado === 'vacio') return null;

  return (
    <div className="mt-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2">
        <Route size={16} color="var(--accent)" aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
          Tu avance en {labelCategoria(categoria).toLowerCase()}
        </p>
      </div>
      {estado === 'cargando' ? (
        <div className="mt-2.5 flex flex-col gap-2">
          <div className="h-3 w-full animate-pulse rounded-full bg-[var(--surface-2)]" />
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-[var(--surface-2)]" />
          <div className="h-3 w-3/5 animate-pulse rounded-full bg-[var(--surface-2)]" />
        </div>
      ) : (
        <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-primary)]">{texto}</p>
      )}
    </div>
  );
}

export default function HistorialPage() {
  const [lecturas, setLecturas] = useState<LecturaGuardada[] | null>(null);
  const [mostrarIntro, setMostrarIntro] = useState(false);

  useEffect(() => {
    leerLecturasReales().then(setLecturas);
    setMostrarIntro(!vioIntroHistorial());
  }, []);

  const cerrarIntro = () => {
    marcarIntroHistorialVista();
    setMostrarIntro(false);
  };

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

      {mostrarIntro && <IntroHistorial onCerrar={cerrarIntro} />}

      <InformeSemanal />
      {categoriaConMasHistoria(lecturas) && <AvanceCategoria categoria={categoriaConMasHistoria(lecturas)!} />}

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
