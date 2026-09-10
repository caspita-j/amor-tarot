'use client';

// Medidor animado de compatibilidad — mismo lenguaje visual que AroMedidor
// (carta del día): un aro que se rellena y un número que cuenta, en vez del
// número plano que había antes. Se anima solo al montar, no necesita tap.

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { NumeroAnimado } from '@/components/app/NumeroAnimado';

const RADIO = 55;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

export function AnilloCompatibilidad({ porcentaje }: { porcentaje: number }) {
  const reduce = useReducedMotion();
  const [animado, setAnimado] = useState(reduce);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setAnimado(true), 150);
    return () => clearTimeout(t);
  }, [reduce]);

  const offset = CIRCUNFERENCIA * (1 - (animado ? porcentaje / 100 : 0));

  return (
    <div
      role="img"
      aria-label={`Compatibilidad: ${porcentaje} por ciento`}
      className="relative mx-auto flex size-40 items-center justify-center"
    >
      <svg width="160" height="160" viewBox="0 0 128 128" aria-hidden="true">
        <circle cx="64" cy="64" r={RADIO} fill="none" strokeWidth="11" stroke="var(--surface-2)" />
        <motion.circle
          cx="64"
          cy="64"
          r={RADIO}
          fill="none"
          strokeWidth="11"
          stroke="var(--accent)"
          strokeLinecap="round"
          strokeDasharray={CIRCUNFERENCIA}
          transform="rotate(-90 64 64)"
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: reduce ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
          <NumeroAnimado valor={animado ? porcentaje : 0} duracionMs={1100} />%
        </span>
      </div>
    </div>
  );
}
