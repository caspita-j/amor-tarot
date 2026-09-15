'use client';

// RUEDA ASTRAL — dispositivo ownable de la PÁGINA DE VENTAS (FICHA-ARTE.md,
// dirección "A · Carta Astral", elegida 2026-09-15 sobre la referencia del
// usuario). No reemplaza los 2 dispositivos de la app (el aro medidor y la
// carta de tarot): es el símbolo propio de la superficie de venta.
//
// Geometría fija en un viewBox de 200×200 (se escala con CSS). Los colores
// salen SIEMPRE de los tokens del tema — nunca hex sueltos.

import { motion, useReducedMotion } from 'motion/react';

const CIRC_84 = 2 * Math.PI * 84;
const CIRC_46 = 2 * Math.PI * 46;

/** Redondeo a 2 decimales. NO es cosmético: sin él, el seno/coseno da flotantes
 *  de 17 dígitos que Node y el navegador serializan distinto (…52043 vs …52044)
 *  y React aborta la hidratación con "server HTML didn't match". A este tamaño
 *  (viewBox de 200) 2 decimales son de sobra. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Marcas zodiacales: 12 radios cada 30°, del anillo interno (r=72) al externo (r=84). */
const MARCAS = Array.from({ length: 12 }, (_, k) => {
  const rad = ((-90 + k * 30) * Math.PI) / 180;
  return {
    x1: r2(100 + 72 * Math.cos(rad)),
    y1: r2(100 + 72 * Math.sin(rad)),
    x2: r2(100 + 84 * Math.cos(rad)),
    y2: r2(100 + 84 * Math.sin(rad)),
  };
});

/** Los 3 puntos del anillo interior = las 3 cartas del mecanismo. */
const PUNTOS = [
  { cx: 100, cy: 54, r: 3.4, fill: 'var(--accent)' },
  { cx: 139.8, cy: 123, r: 2.8, fill: 'var(--accent-frio)' },
  { cx: 60.2, cy: 123, r: 2.8, fill: 'var(--accent)' },
];

export function RuedaAstral({
  className = '',
  etiqueta = 'Carta del día',
  carta = 'El Ermitaño',
  energia = 'Introspección',
}: {
  className?: string;
  etiqueta?: string;
  carta?: string;
  energia?: string;
}) {
  const reduce = useReducedMotion();
  const dur = (s: number) => (reduce ? 0 : s);

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="block size-full" aria-hidden="true">
        <defs>
          <radialGradient id="rueda-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="65%" stopColor="var(--accent)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="96" fill="url(#rueda-glow)" />

        {/* Anillo externo: se dibuja al entrar — el gesto de "calcular" */}
        <motion.circle
          cx="100"
          cy="100"
          r="84"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.6"
          strokeWidth="1"
          strokeDasharray={CIRC_84}
          initial={{ strokeDashoffset: reduce ? 0 : CIRC_84 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: dur(1.6), ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 100 100)"
        />

        {/* Corona de marcas: gira muy lento, como una carta astral viva */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: reduce ? 0 : 360 }}
          transition={{
            opacity: { duration: dur(0.9), delay: dur(0.5) },
            rotate: { duration: reduce ? 0 : 240, ease: 'linear', repeat: reduce ? 0 : Infinity },
          }}
          style={{ transformOrigin: '100px 100px' }}
        >
          <circle cx="100" cy="100" r="72" fill="none" stroke="var(--accent)" strokeOpacity="0.3" strokeWidth="1" />
          {MARCAS.map((m, i) => (
            <line
              key={i}
              x1={m.x1}
              y1={m.y1}
              x2={m.x2}
              y2={m.y2}
              stroke="var(--accent)"
              strokeOpacity="0.55"
              strokeWidth="1"
              strokeLinecap="round"
            />
          ))}
        </motion.g>

        {/* Aspectos: el triángulo frío y el cuadrilátero dorado */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: dur(0.9), delay: dur(0.9) }}>
          <circle cx="100" cy="100" r="30" fill="none" stroke="var(--accent-frio)" strokeOpacity="0.3" strokeWidth="1" />
          <polygon
            points="100,54 139.8,123 60.2,123"
            fill="none"
            stroke="var(--accent-frio)"
            strokeOpacity="0.55"
            strokeWidth="1"
          />
          <polygon
            points="143.2,84.3 115.7,143.2 56.8,115.7 84.3,56.8"
            fill="none"
            stroke="var(--accent)"
            strokeOpacity="0.32"
            strokeWidth="1"
          />
          <circle cx="143.2" cy="84.3" r="2.2" fill="var(--accent)" fillOpacity="0.75" />
          <circle cx="56.8" cy="115.7" r="2.2" fill="var(--accent-frio)" fillOpacity="0.8" />
          <circle cx="172" cy="100" r="2.4" fill="var(--accent)" fillOpacity="0.9" />
        </motion.g>

        {/* Anillo interior + los 3 puntos del mecanismo */}
        <motion.circle
          cx="100"
          cy="100"
          r="46"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.4"
          strokeWidth="1"
          strokeDasharray={CIRC_46}
          initial={{ strokeDashoffset: reduce ? 0 : CIRC_46 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: dur(1.2), delay: dur(0.4), ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 100 100)"
        />
        {PUNTOS.map((p, i) => (
          <motion.circle
            key={i}
            {...p}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: dur(0.5), delay: dur(1.2 + i * 0.12), ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: `${p.cx}px ${p.cy}px` }}
          />
        ))}
      </svg>

      {/* Centro: preview de la función "carta del día". Deliberadamente NO dice
          "tu carta de hoy": quien visita todavía no tiene cuenta y la app no
          calculó nada suyo — sería una promesa falsa. */}
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur(0.6), delay: dur(1.1), ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
      >
        <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">{etiqueta}</span>
        <span className="mt-1 text-[32px] font-semibold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
          {carta}
        </span>
        <span className="mt-1 text-[12px] font-bold text-[var(--accent)]">{energia}</span>
      </motion.div>
    </div>
  );
}
