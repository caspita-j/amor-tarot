'use client';

// Bienestar — catálogo de prácticas caseras de autocuidado (agua, sal, miel,
// canela, laurel, hierbas, velas), organizado por categoría. Independiente
// del sorteo de cartas — es de consulta directa, no depende de una lectura.
// Ver lib/bienestar-data.ts para el porqué del reencuadre (autocuidado, no
// "atraer/retener" — FICHA-AVATAR.md prohíbe lenguaje de amarres/rituales).

import { useState } from 'react';
import { Clock, Flame, Moon, Wallet, Wind, TriangleAlert } from 'lucide-react';
import { BotonPrincipal } from '@/components/onboarding/ui';
import {
  CATEGORIAS_BIENESTAR,
  practicasDeCategoria,
  type CategoriaBienestar,
  type PracticaBienestar,
} from '@/lib/bienestar-data';

// Un color de marca ya existente por categoría (sin inventar tonos nuevos —
// FICHA-ARTE.md reserva la paleta) para que la sección se sienta viva, a
// pedido del usuario ("se ve muy plano"). Íconos más específicos del
// contenido real: vela, billetera, luna, viento.
const ICONO_CATEGORIA: Record<string, typeof Flame> = {
  corazon: Flame,
  dinero: Wallet,
  descanso: Moon,
  espacio: Wind,
};

const COLOR_CATEGORIA: Record<string, string> = {
  corazon: 'var(--accent-4)',
  dinero: 'var(--accent-2)',
  descanso: 'var(--accent-3)',
  espacio: 'var(--accent)',
};

// Color de texto/número LEGIBLE sobre el color sólido de cada categoría —
// accent-2/3 son pasteles claros (necesitan texto oscuro, igual que las
// tarjetas de categoría del home), accent-4 tiene su propio tono AA
// (--accent-4-ink, definido en tokens.css), y --accent es el lila oscuro
// (necesita texto claro).
const INK_CATEGORIA: Record<string, string> = {
  corazon: 'var(--accent-4-ink)',
  dinero: 'var(--text-primary)',
  descanso: 'var(--text-primary)',
  espacio: 'var(--bg)',
};

type Modo = 'categorias' | 'practicas' | 'detalle';

export default function BienestarPage() {
  const [modo, setModo] = useState<Modo>('categorias');
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaBienestar | null>(null);
  const [practicaActiva, setPracticaActiva] = useState<PracticaBienestar | null>(null);

  const abrirCategoria = (c: CategoriaBienestar) => {
    setCategoriaActiva(c);
    setModo('practicas');
  };

  const abrirPractica = (p: PracticaBienestar) => {
    setPracticaActiva(p);
    setModo('detalle');
  };

  // ── Categorías ─────────────────────────────────────────────────────
  if (modo === 'categorias') {
    return (
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold [font-family:var(--font-display)]">Bienestar</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Prácticas caseras y sencillas para tu día a día, con cosas que ya tienes en casa.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {CATEGORIAS_BIENESTAR.map((c) => {
            const Icono = ICONO_CATEGORIA[c.id] ?? Flame;
            const color = COLOR_CATEGORIA[c.id] ?? 'var(--accent)';
            const ink = INK_CATEGORIA[c.id] ?? 'var(--text-primary)';
            const total = practicasDeCategoria(c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => abrirCategoria(c)}
                className="flex min-h-36 flex-col justify-between rounded-[var(--radius-card)] p-4 text-left transition-transform active:scale-[0.97]"
                style={{ backgroundColor: color, boxShadow: `0 10px 22px -12px ${color}`, color: ink }}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--bg)]">
                  <Icono size={20} color={color} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-base font-bold [font-family:var(--font-display)]">{c.label}</span>
                  <span className="mt-1 block text-xs leading-snug opacity-70">
                    {c.descripcion} · {total} {total === 1 ? 'práctica' : 'prácticas'}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mx-1 mt-6 text-xs leading-relaxed text-[var(--text-secondary)]">
          Estos son hábitos de autocuidado, no sustituyen atención médica ni profesional. Realízalos
          bajo tu propio criterio.
        </p>
      </div>
    );
  }

  // ── Prácticas de una categoría ────────────────────────────────────
  if (modo === 'practicas' && categoriaActiva) {
    const practicas = practicasDeCategoria(categoriaActiva.id);
    const Icono = ICONO_CATEGORIA[categoriaActiva.id] ?? Flame;
    const color = COLOR_CATEGORIA[categoriaActiva.id] ?? 'var(--accent)';
    return (
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={() => setModo('categorias')}
          className="w-fit text-sm font-semibold text-[var(--text-secondary)]"
        >
          ← Volver
        </button>
        <div className="mt-4 flex items-center gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `color-mix(in oklab, ${color} 16%, transparent)` }}
          >
            <Icono size={20} color={color} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-bold [font-family:var(--font-display)]">{categoriaActiva.label}</h1>
            <p className="text-sm text-[var(--text-secondary)]">{categoriaActiva.descripcion}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          {practicas.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => abrirPractica(p)}
              className="flex flex-col rounded-[var(--radius-card)] bg-[var(--surface)] p-4 text-left transition-transform active:scale-[0.98]"
            >
              <span className="text-base font-bold [font-family:var(--font-display)]">{p.titulo}</span>
              <span className="mt-1 text-sm text-[var(--text-secondary)]">{p.intencion}</span>
              <span className="mt-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-tertiary)]">
                <Clock size={13} aria-hidden="true" />
                {p.duracionMinutos} min · {p.frecuencia}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Detalle de una práctica ────────────────────────────────────────
  if (modo === 'detalle' && practicaActiva) {
    const colorDetalle = COLOR_CATEGORIA[practicaActiva.categoriaId] ?? 'var(--accent)';
    const inkDetalle = INK_CATEGORIA[practicaActiva.categoriaId] ?? 'var(--bg)';
    return (
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={() => setModo('practicas')}
          className="w-fit text-sm font-semibold text-[var(--text-secondary)]"
        >
          ← Volver
        </button>
        <h1 className="mt-4 text-2xl font-bold leading-tight [font-family:var(--font-display)]">
          {practicaActiva.titulo}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{practicaActiva.intencion}</p>

        <div className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-tertiary)]">
          <Clock size={13} aria-hidden="true" />
          {practicaActiva.duracionMinutos} min · {practicaActiva.frecuencia}
        </div>

        <p className="mt-5 text-sm font-bold text-[var(--text-secondary)]">Necesitas</p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {practicaActiva.materiales.map((m, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-primary)]">
              <span
                className="mt-2 size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: colorDetalle }}
                aria-hidden="true"
              />
              {m}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-sm font-bold text-[var(--text-secondary)]">Pasos</p>
        <ol className="mt-2 flex flex-col gap-3">
          {practicaActiva.pasos.map((paso, i) => (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text-primary)]">
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ backgroundColor: colorDetalle, color: inkDetalle }}
              >
                {i + 1}
              </span>
              <span className="pt-0.5">{paso}</span>
            </li>
          ))}
        </ol>

        {practicaActiva.notaSeguridad && (
          <div className="mt-5 flex items-start gap-2.5 rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--danger)_10%,var(--surface))] p-4">
            <TriangleAlert size={18} color="var(--danger)" className="mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">{practicaActiva.notaSeguridad}</p>
          </div>
        )}

        <div className="mt-6 mb-2">
          <BotonPrincipal onClick={() => setModo('practicas')}>Listo</BotonPrincipal>
        </div>
      </div>
    );
  }

  return null;
}
