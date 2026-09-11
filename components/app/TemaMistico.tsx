import type { CSSProperties, ReactNode } from 'react';

// Tema "místico" — fondo oscuro/dorado a pedido explícito del usuario
// (referencias de apps de tarot/horóscopo oscuras y ornamentadas), aplicado
// SOLO adentro de la app (nunca en landing/onboarding/paywall, que ya están
// certificadas con la paleta clara de FICHA-ARTE.md — ver ESTADO.md).
// Los valores de color viven en components/landing/tokens.css bajo
// [data-tema="mistico"] (no acá, para que el linter de diseño los trate
// como tokens legítimos, no como hex sueltos). Este archivo solo activa el
// atributo y dibuja el fondo decorativo (resplandor + estrellas).
// Empieza en Lecturas ("la sección de las cartas", el pedido más puntual del
// usuario); se extiende a Inicio/Perfil/Historial en rondas siguientes, cada
// una con su propio motivo de fondo pero la misma familia de colores.

// Estrellas: un mosaico chico repetido (tile) en vez de coordenadas fijas —
// escala solo con CSS, sin depender del tamaño real de la pantalla.
const ESTRELLAS = {
  backgroundImage: [
    'radial-gradient(1.6px 1.6px at 20px 30px, rgba(255,255,255,0.85), transparent)',
    'radial-gradient(1.2px 1.2px at 90px 60px, rgba(255,255,255,0.55), transparent)',
    'radial-gradient(1.8px 1.8px at 140px 20px, rgba(255,255,255,0.75), transparent)',
    'radial-gradient(1.2px 1.2px at 170px 110px, rgba(255,255,255,0.45), transparent)',
    'radial-gradient(1.4px 1.4px at 40px 140px, rgba(255,255,255,0.65), transparent)',
    'radial-gradient(1px 1px at 110px 165px, rgba(255,255,255,0.45), transparent)',
    'radial-gradient(1.6px 1.6px at 190px 190px, rgba(255,255,255,0.55), transparent)',
    'radial-gradient(1px 1px at 10px 100px, var(--accent), transparent)',
  ].join(', '),
  backgroundSize: '200px 200px',
  backgroundRepeat: 'repeat',
} satisfies CSSProperties;

/** Fondo decorativo del tema místico: base oscura + 2 resplandores difusos
 * (dorado arriba, azul abajo) + textura de estrellas. Puramente visual. */
function FondoMistico() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg)]">
      <span className="absolute left-1/2 top-[-12%] size-96 -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-20 blur-3xl" />
      <span className="absolute -bottom-24 -right-16 size-80 rounded-full bg-[var(--accent-frio)] opacity-20 blur-3xl" />
      <div className="absolute inset-0 opacity-70" style={ESTRELLAS} />
    </div>
  );
}

/** Envuelve una pantalla completa con el tema místico: activa la paleta
 * oscura ([data-tema="mistico"] en tokens.css) y dibuja el fondo. Uso:
 * `<TemaMistico><ContenidoDeLaPantalla /></TemaMistico>` como único return
 * del componente de página. */
export function TemaMistico({ children }: { children: ReactNode }) {
  return (
    <div data-tema="mistico" className="relative min-h-dvh text-[var(--text-primary)]">
      <FondoMistico />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
