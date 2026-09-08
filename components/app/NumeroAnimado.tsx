'use client';

// Número héroe animado (baseline de movimiento no negociable — ver
// CLAUDE.md "ANIMACIONES BASELINE"): cuenta desde el valor previo hasta el
// nuevo en vez de saltar directo, para racha/porcentajes en pantallas clave.

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export function NumeroAnimado({
  valor,
  duracionMs = 700,
  className,
}: {
  valor: number;
  duracionMs?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [mostrado, setMostrado] = useState(reduce ? valor : 0);
  const anterior = useRef(reduce ? valor : 0);

  useEffect(() => {
    if (reduce) {
      setMostrado(valor);
      anterior.current = valor;
      return;
    }
    const inicio = anterior.current;
    const delta = valor - inicio;
    if (delta === 0) return;
    const t0 = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duracionMs);
      const suavizado = 1 - Math.pow(1 - p, 3);
      setMostrado(Math.round(inicio + delta * suavizado));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        anterior.current = valor;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [valor, duracionMs, reduce]);

  return <span className={className}>{mostrado}</span>;
}
