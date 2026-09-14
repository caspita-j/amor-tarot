'use client';

// Botón "deslizar para activar" — a pedido del usuario, con referencia de un
// CTA de onboarding con una perilla circular (flecha) que se arrastra hacia
// la derecha y llena una barra a medida que avanza. Mismo pedido explícito:
// mantener el acabado del BotonPrincipal actual (vidrio/cromo dorado), solo
// agregar la perilla + el deslizar. Usado hoy SOLO en "Activar el hechizo de
// mis 3 cartas" (Lecturas) — no reemplaza BotonPrincipal en el resto de la
// app.
//
// Accesibilidad (regla dura de UX: todo gesto necesita fallback por tap):
// el texto entero es un <button> normal — un tap/clic en cualquier parte, o
// Enter/Espacio con teclado, activa la acción de inmediato, sin necesidad de
// arrastrar. La perilla es solo un affordance adicional para quien la
// descubre; arrastrarla hasta el final también completa la acción.

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion, useMotionValue, useReducedMotion, useTransform, animate } from 'motion/react';

const TAMANO_PERILLA = 48; // px
const PADDING_PISTA = 4; // px, aire entre la perilla y el borde de la píldora
const UMBRAL_COMPLETAR = 0.7; // 70% del recorrido ya cuenta como "deslizado"

export function BotonDeslizar({
  onCompletar,
  disabled,
  cargando,
  children,
}: {
  onCompletar: () => void;
  disabled?: boolean;
  cargando?: boolean;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const pistaRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);
  const x = useMotionValue(0);
  const bloqueado = disabled || cargando;

  useEffect(() => {
    const medir = () => {
      const ancho = pistaRef.current?.offsetWidth ?? 0;
      setMaxX(Math.max(0, ancho - TAMANO_PERILLA - PADDING_PISTA * 2));
    };
    medir();
    const obs = new ResizeObserver(medir);
    if (pistaRef.current) obs.observe(pistaRef.current);
    return () => obs.disconnect();
  }, []);

  // Mientras carga, la perilla queda fija al final (completada).
  useEffect(() => {
    if (cargando) animate(x, maxX, { type: 'spring', duration: 0.3, bounce: 0 });
  }, [cargando, maxX, x]);

  const anchoRelleno = useTransform(x, (v) => v + TAMANO_PERILLA + PADDING_PISTA);

  const activar = () => {
    if (bloqueado) return;
    onCompletar();
  };

  const alSoltar = () => {
    if (bloqueado) return;
    if (maxX > 0 && x.get() >= maxX * UMBRAL_COMPLETAR) {
      animate(x, maxX, { type: 'spring', duration: 0.25, bounce: 0.15 });
      onCompletar();
    } else {
      animate(x, 0, { type: 'spring', duration: 0.4, bounce: 0.3 });
    }
  };

  return (
    <div
      ref={pistaRef}
      className="boton-principal relative h-14 w-full overflow-hidden rounded-[var(--radius-button)] bg-[var(--accent)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
    >
      {/* Relleno tipo "barra de carga": crece con la perilla. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 rounded-[var(--radius-button)] bg-[color-mix(in_oklab,white_30%,transparent)]"
        style={{ width: anchoRelleno }}
      />

      {/* Tap/clic en cualquier parte del texto = fallback accesible. */}
      <button
        type="button"
        onClick={activar}
        disabled={bloqueado}
        className="relative z-10 flex h-full w-full items-center justify-center px-6 text-base font-semibold text-[var(--bg)] outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {children}
      </button>

      {/* Perilla arrastrable con la flecha. */}
      <motion.button
        type="button"
        aria-label="Deslizar o tocar para activar"
        onClick={activar}
        disabled={bloqueado}
        drag={bloqueado || reduce ? false : 'x'}
        dragConstraints={{ left: 0, right: maxX }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={alSoltar}
        style={{
          x,
          left: PADDING_PISTA,
          top: '50%',
          translateY: '-50%',
          width: TAMANO_PERILLA,
          height: TAMANO_PERILLA,
        }}
        whileTap={bloqueado ? undefined : { scale: 0.94 }}
        className="absolute z-20 flex items-center justify-center rounded-full bg-[var(--bg)] text-[var(--accent)] shadow-[0_2px_6px_rgb(0_0_0/0.35)] outline-none disabled:cursor-not-allowed"
      >
        {cargando ? (
          <Loader2 size={20} className="animate-spin" aria-hidden="true" />
        ) : (
          <ArrowRight size={20} aria-hidden="true" />
        )}
      </motion.button>
    </div>
  );
}
