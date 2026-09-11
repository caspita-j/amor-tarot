'use client';

// Piezas compartidas del onboarding (02B/50): barra de progreso SIEMPRE visible
// (efecto goal gradient), chips de selección única, y el shell de pantalla
// (1 decisión por pantalla, min-h-dvh, sin nav que distraiga). Reutiliza los
// tokens del kit de landing (mismo brand kit de FICHA-ARTE.md).

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Check, Loader2, Lock } from 'lucide-react';
import { SimboloCarta } from '@/components/app/SimboloCarta';
import { IMAGENES_REALES } from '@/lib/tarot-data';

export function ProgressBar({ pasoActual, totalPasos }: { pasoActual: number; totalPasos: number }) {
  const pct = Math.round((pasoActual / totalPasos) * 100);
  const reduce = useReducedMotion();
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
      <motion.div
        className="h-full rounded-full bg-[var(--accent)]"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

export function PantallaOnboarding({
  pasoActual,
  totalPasos,
  onAtras,
  onSaltar,
  children,
}: {
  pasoActual?: number;
  totalPasos?: number;
  onAtras?: () => void;
  onSaltar?: () => void;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <main
      className="relative flex min-h-dvh flex-col overflow-hidden bg-[var(--bg)] px-6 pt-6 pb-8 text-[var(--text-primary)] [font-family:var(--font-body)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(720px 460px at 50% -10%, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 62%), ' +
            'radial-gradient(560px 380px at 85% 75%, color-mix(in oklab, var(--accent-2, var(--accent)) 24%, transparent) 0%, transparent 55%)',
        }}
      />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="flex items-center gap-3">
          {onAtras ? (
            <motion.button
              type="button"
              whileTap={reduce ? undefined : { scale: 0.92 }}
              onClick={onAtras}
              aria-label="Volver"
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] outline-none hover:bg-[var(--surface-2)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </motion.button>
          ) : (
            <span className="size-11 shrink-0" aria-hidden="true" />
          )}
          {pasoActual !== undefined && totalPasos !== undefined && (
            <div className="flex-1">
              <ProgressBar pasoActual={pasoActual} totalPasos={totalPasos} />
            </div>
          )}
          {onSaltar ? (
            <button
              type="button"
              onClick={onSaltar}
              className="shrink-0 text-sm font-semibold text-[var(--text-secondary)]"
            >
              Saltar
            </button>
          ) : (
            <span className="w-10 shrink-0" aria-hidden="true" />
          )}
        </div>

        <div className="mt-8 flex flex-1 flex-col">{children}</div>
      </div>
    </main>
  );
}

export function ChipOpcion({
  seleccionado,
  onClick,
  children,
}: {
  seleccionado: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      whileTap={reduce ? undefined : { scale: 0.98 }}
      onClick={onClick}
      aria-pressed={seleccionado}
      className={`flex w-full items-center justify-between gap-3 rounded-[var(--radius-card)] border px-5 py-4 text-left text-base font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
        seleccionado
          ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--text-primary)]'
          : 'border-[color-mix(in_oklab,var(--text-secondary)_22%,transparent)] bg-[var(--bg)] text-[var(--text-primary)]'
      }`}
    >
      <span>{children}</span>
      {seleccionado && (
        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]"
        >
          <Check size={14} strokeWidth={3} color="var(--bg)" />
        </span>
      )}
    </motion.button>
  );
}

/** Chip compacto para grillas (ej. los 12 signos) — mismo lenguaje visual que
 * ChipOpcion pero pensado para caber 3 por fila. */
export function ChipGrid({
  seleccionado,
  onClick,
  children,
}: {
  seleccionado: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      whileTap={reduce ? undefined : { scale: 0.95 }}
      onClick={onClick}
      aria-pressed={seleccionado}
      className={`rounded-[var(--radius-card)] border px-2 py-3 text-center text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
        seleccionado
          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
          : 'border-[color-mix(in_oklab,var(--text-secondary)_22%,transparent)] bg-[var(--bg)] text-[var(--text-primary)]'
      }`}
    >
      {children}
    </motion.button>
  );
}

/** La carta de tarot real — boca abajo (dorso) o revelada (con el nombre de la
 * carta). Es el dispositivo ownable para el MOMENTO DE REVELAR (distinto del
 * aro medidor, que es el indicador de "energía del día" en el home — ver
 * FICHA-ARTE.md). Proporción real de carta de tarot (~5:8.7). */
export function TarjetaTarot({
  revelada,
  invertida = false,
  nombreCarta,
  etiqueta,
  tamano = 'md',
  bloqueada = false,
}: {
  revelada: boolean;
  invertida?: boolean;
  nombreCarta?: string;
  etiqueta?: string;
  tamano?: 'sm' | 'md' | 'lg';
  /** Carta aún no desbloqueada (paywall): candado en vez de dorso/frente. */
  bloqueada?: boolean;
}) {
  const reduce = useReducedMotion();
  const dims = tamano === 'lg' ? 'w-36' : tamano === 'sm' ? 'w-20' : 'w-24';

  if (bloqueada) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className={`${dims} aspect-[5/8.7] shrink-0 flex cursor-not-allowed items-center justify-center rounded-[14%] border border-dashed border-[color-mix(in_oklab,var(--text-secondary)_35%,transparent)]`}
        >
          <Lock size={18} className="text-[var(--text-secondary)]" aria-hidden="true" />
        </div>
        {etiqueta && <span className="text-center text-xs font-medium text-[var(--text-secondary)]">{etiqueta}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`${dims} aspect-[5/8.7] shrink-0`}
        style={{ perspective: 800 }}
      >
        <motion.div
          className="relative size-full [transform-style:preserve-3d]"
          animate={{ rotateY: revelada ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Dorso: patrón discreto, [backface-hidden] la esconde al revelar */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-[14%] border-2 border-[color-mix(in_oklab,var(--bg)_35%,transparent)] bg-[var(--accent)] [backface-visibility:hidden]"
          >
            <div className="flex size-full items-center justify-center rounded-[10%] border border-dashed border-[color-mix(in_oklab,var(--bg)_30%,transparent)] m-1.5">
              <svg viewBox="0 0 24 24" className="size-1/3 opacity-70" fill="none" stroke="var(--bg)" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 3a6 6 0 1 0 6 9.4A7.5 7.5 0 0 1 12 3Z" />
              </svg>
            </div>
          </div>
          {/* Frente: solo visible tras el flip de 180° — si la carta salió
              invertida, gira también en su propio plano (Z), igual que una
              carta de tarot real boca abajo: el arte y el nombre quedan
              cabeza abajo, fiel a como se lee una carta invertida. Si la
              carta ya tiene ilustración real (Canva, simbología fiel al
              tarot tradicional), se muestra esa imagen completa en vez del
              ícono abstracto — la imagen ya trae su propio marco y título. */}
          {nombreCarta && IMAGENES_REALES[nombreCarta] ? (
            <div
              className="absolute inset-0 overflow-hidden rounded-[14%] border-2 border-[var(--accent)] shadow-[var(--shadow-1)] [backface-visibility:hidden]"
              style={{ transform: invertida ? 'rotateY(180deg) rotate(180deg)' : 'rotateY(180deg)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGENES_REALES[nombreCarta]} alt={nombreCarta} className="size-full object-cover" />
            </div>
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-between rounded-[14%] border-2 border-[color-mix(in_oklab,var(--bg)_35%,transparent)] bg-[var(--accent)] p-2 [backface-visibility:hidden]"
              style={{ transform: invertida ? 'rotateY(180deg) rotate(180deg)' : 'rotateY(180deg)' }}
            >
              <span className="mt-1 flex flex-1 items-center justify-center">
                <SimboloCarta nombre={nombreCarta} />
              </span>
              {nombreCarta && (
                <span className="mb-1 text-center text-xs font-bold leading-tight text-[var(--bg)] [font-family:var(--font-display)]">
                  {nombreCarta}
                </span>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
      {(etiqueta || invertida) && (
        <span className="text-center text-xs font-medium text-[var(--text-secondary)]">
          {etiqueta}
          {invertida && ' · invertida'}
        </span>
      )}
    </div>
  );
}

export function BotonPrincipal({
  onClick,
  disabled,
  cargando,
  children,
  type = 'button',
}: {
  onClick?: () => void;
  disabled?: boolean;
  /** Muestra un spinner + deshabilita — para navegación/envío en curso. */
  cargando?: boolean;
  children: ReactNode;
  type?: 'button' | 'submit';
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type={type}
      whileTap={disabled || cargando || reduce ? undefined : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || cargando}
      className="boton-principal relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-button)] bg-[var(--accent)] px-6 text-base font-semibold text-[var(--bg)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_35%,transparent)] outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {cargando && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
      {children}
    </motion.button>
  );
}
