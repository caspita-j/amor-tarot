'use client';

// Video ambiental entre la racha y "Tu momento" — puramente decorativo (una
// persona barajando cartas), refuerza el ritual sin agregar una acción nueva.
// Marco tipo "paspartú" OSCURO: mate de --nav-bg (mismo tono que la píldora
// de navegación) + anillo en acento bien visible, para que tenga presencia
// y no se sienta plano/opaco contra el resto de la pantalla, clara. Sin
// controles (no es contenido que el usuario necesite pausar/buscar) y
// respeta prefers-reduced-motion mostrando el primer cuadro estático.

import { useReducedMotion } from 'motion/react';

export function VideoCartaDelDia() {
  const reduce = useReducedMotion();

  return (
    <div className="mx-4 mt-3.5 rounded-[var(--radius-card)] bg-[var(--nav-bg)] p-2 shadow-[var(--shadow-2)]">
      <div className="relative overflow-hidden rounded-[calc(var(--radius-card)-8px)] ring-1 ring-inset ring-[color-mix(in_oklab,var(--accent)_60%,transparent)]">
        <video
          src="/video-barajando-cartas.mp4"
          className="aspect-video w-full object-cover"
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/45 to-transparent"
        />
        <span className="absolute bottom-2.5 left-3 text-xs font-bold tracking-wide text-white/90">
          El ritual de barajar
        </span>
      </div>
    </div>
  );
}
