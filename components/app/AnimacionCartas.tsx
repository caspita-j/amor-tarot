'use client';

// Animación de "barajando/eligiendo tus cartas" para el momento de carga de
// Lecturas (22-LIBRERIAS-Y-CRAFT.md: Lottie para el toque "wow" que el CSS
// puro no logra). El JSON pesa ~4.2MB (trae 12 imágenes incrustadas) — muy
// por encima del presupuesto de 50KB del SO para gama media LATAM, así que
// se carga DIFERIDO: nunca entra al bundle de JS, lottie-react la trae por
// `src` (URL) solo cuando este componente se monta, y el navegador la cachea
// después de la primera vez — pesa una vez por persona, no por lectura.

import dynamic from 'next/dynamic';
import { Sparkles } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

const Lottie = dynamic(() => import('lottie-react').then((m) => m.Lottie), {
  ssr: false,
  loading: () => <Sparkles size={28} color="var(--accent)" className="animate-pulse" aria-hidden="true" />,
});

export function AnimacionCartas({ className = 'size-44' }: { className?: string }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <Sparkles size={28} color="var(--accent)" aria-hidden="true" />;
  }

  return <Lottie src="/lottie/sacando-cartas.json" autoplay loop className={className} aria-hidden="true" />;
}
