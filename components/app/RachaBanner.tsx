'use client';

// M4 — RACHA EN RIESGO (56-MOMENTOS-EMOCIONALES.md). Es un ESTADO visual, no
// una pantalla ni un modal: emblema apagado en gris (nunca rojo/pánico)
// cuando hoy aún no hay registro, encendido en acento cuando sí lo hay.
// Micro-animación de "respirar" solo en el estado apagado (dormido, no
// muerto) — se desactiva con prefers-reduced-motion.

import { Flame, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { NumeroAnimado } from '@/components/app/NumeroAnimado';

const HITOS = [3, 7, 14, 30, 60, 100];

export function RachaBanner({
  dias,
  registradoHoy,
  onRegistrar,
}: {
  dias: number;
  registradoHoy: boolean;
  onRegistrar: () => void;
}) {
  const reduce = useReducedMotion();
  const horaLocal = new Date().getHours();
  const mostrarUrgencia = !registradoHoy && horaLocal >= 20;
  const esHito = registradoHoy && HITOS.includes(dias);

  if (registradoHoy) {
    return (
      <div className="mx-4 mt-3 rounded-[var(--radius-card)] bg-[var(--accent-4)] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Flame size={18} strokeWidth={2} color="var(--accent-4-ink)" aria-hidden="true" />
          <p className="text-sm font-bold text-[var(--accent-4-ink)]">
            Racha activa: <NumeroAnimado valor={dias} /> {dias === 1 ? 'día seguido' : 'días seguidos'} leyendo tu
            carta
          </p>
        </div>
        {esHito && (
          <motion.p
            initial={reduce ? false : { opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.4 }}
            className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[var(--accent-4-ink)]"
          >
            <Sparkles size={14} strokeWidth={2} aria-hidden="true" />
            ¡<NumeroAnimado valor={dias} /> días seguidos! Nuevo hito de tu racha.
          </motion.p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-4 mt-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_18%,transparent)] px-4 py-3">
      <div className="flex items-center gap-2.5">
        <motion.span
          animate={reduce ? undefined : { opacity: [0.5, 0.75, 0.5] }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
        >
          <Flame size={18} strokeWidth={1.5} color="var(--text-secondary)" aria-hidden="true" />
        </motion.span>
        <p className="text-sm font-semibold text-[var(--text-secondary)]">
          {dias > 0
            ? `Tu racha de ${dias} días sigue viva. El registro de hoy la mantiene.`
            : 'Empieza hoy tu racha de lecturas.'}
          {mostrarUrgencia && <span className="text-[var(--text-secondary)]"> Se apaga a medianoche.</span>}
        </p>
      </div>
      <motion.button
        type="button"
        onClick={onRegistrar}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        className="mt-3 flex h-11 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--surface-2)] text-sm font-bold text-[var(--text-primary)]"
      >
        Activar el hechizo de hoy →
      </motion.button>
    </div>
  );
}
