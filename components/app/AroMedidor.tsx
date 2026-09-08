'use client';

// El ARO MEDIDOR — dispositivo ownable exclusivo del home para "energía del
// día" (FICHA-ARTE.md: no confundir con la CARTA DE TAROT, que es para
// momentos de revelar). Dos estados: sin revelar (contorno tenue, invita al
// tap) y revelado (aro relleno de acento + nombre de la carta al centro).

import { motion, useReducedMotion } from 'motion/react';
import { NumeroAnimado } from '@/components/app/NumeroAnimado';

const RADIO = 55;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

export function AroMedidor({
  revelada,
  nombreCarta,
  esencia,
  onTap,
}: {
  revelada: boolean;
  nombreCarta: string;
  esencia: string;
  onTap: () => void;
}) {
  const reduce = useReducedMotion();
  const pct = revelada ? 0.74 : 0;
  const offset = CIRCUNFERENCIA * (1 - pct);

  return (
    <motion.button
      type="button"
      onClick={onTap}
      disabled={revelada}
      whileTap={revelada || reduce ? undefined : { scale: 0.96 }}
      aria-label={
        revelada
          ? `Carta del día: ${nombreCarta}, ${esencia} al 74 por ciento`
          : 'Toca para revelar tu carta del día'
      }
      className="relative mx-auto flex size-32 items-center justify-center disabled:cursor-default"
    >
      <svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true">
        <circle cx="64" cy="64" r={RADIO} fill="none" strokeWidth="11" stroke="rgba(255,255,255,0.22)" />
        <motion.circle
          cx="64"
          cy="64"
          r={RADIO}
          fill="none"
          strokeWidth="11"
          stroke="var(--bg)"
          strokeLinecap="round"
          strokeDasharray={CIRCUNFERENCIA}
          transform="rotate(-90 64 64)"
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-4 text-center">
        {revelada ? (
          <>
            <span className="text-base font-bold text-[var(--bg)] [font-family:var(--font-display)]">
              {nombreCarta}
            </span>
            <span className="text-xs font-bold text-[color-mix(in_oklab,var(--bg)_70%,transparent)]">
              {esencia} · <NumeroAnimado valor={74} />%
            </span>
          </>
        ) : (
          <span className="text-xs font-bold leading-snug text-[color-mix(in_oklab,var(--bg)_85%,transparent)]">
            Toca para revelar
          </span>
        )}
      </div>
    </motion.button>
  );
}
