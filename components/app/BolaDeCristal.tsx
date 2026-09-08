'use client';

// Bola de cristal animada — GIF que trajo el usuario (no es un Lottie: es un
// GIF con un manifiesto que describe cómo mostrarlo, ver
// public/animaciones/). Va junto al saludo de Inicio, del mismo tamaño que el
// texto. Un GIF no se puede pausar por CSS, así que en prefers-reduced-motion
// se cambia por el primer fotograma estático (misma pieza, sin movimiento).

import { useReducedMotion } from 'motion/react';

export function BolaDeCristal({ className = 'size-7' }: { className?: string }) {
  const reduce = useReducedMotion();
  const src = reduce ? '/animaciones/bola-de-cristal-estatica.png' : '/animaciones/bola-de-cristal.gif';

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className={`${className} object-contain`} aria-hidden="true" />;
}
