// Check-in de ánimo diario — plan de retención, punto 3: la carta del día
// por sí sola es intercambiable con cualquier horóscopo; esto la conecta con
// un dato REAL de la persona que se acumula en un historial visual (la tira
// "Esta semana"). 4 estados, uno por cada acento que ya existe en la app —
// sin inventar paleta nueva.

export type Estado = 'tranquila' | 'esperanzada' | 'ansiosa' | 'triste';

export const ESTADOS: { id: Estado; label: string; color: string }[] = [
  { id: 'tranquila', label: 'Tranquila/o', color: 'var(--accent)' },
  { id: 'esperanzada', label: 'Con esperanza', color: 'var(--accent-2)' },
  { id: 'ansiosa', label: 'Ansiosa/o', color: 'var(--accent-3)' },
  { id: 'triste', label: 'Triste', color: 'var(--accent-4)' },
];

export function labelEstado(estado: Estado): string {
  return ESTADOS.find((e) => e.id === estado)?.label ?? '';
}

export function colorEstado(estado: Estado): string {
  return ESTADOS.find((e) => e.id === estado)?.color ?? 'var(--text-tertiary)';
}

/** Versión de `colorEstado` para usar como TEXTO sobre un círculo claro (la
 * tira de "Esta semana") — 3 de los 4 acentos ya son oscuros y funcionan
 * bien tal cual, pero "tranquila" (dorado claro) mide 1.7:1 de contraste
 * sobre el círculo casi blanco, muy por debajo del 4.5:1 mínimo. Se
 * oscurece SOLO para este uso. */
export function inkEstado(estado: Estado): string {
  if (estado === 'tranquila') return 'color-mix(in oklab, black 45%, var(--accent))';
  return colorEstado(estado);
}

/** Versión de `colorEstado` para usar como TEXTO sobre el fondo OSCURO de la
 * app (p. ej. "Hoy te sentiste [ánimo]" en la tarjeta de Inicio) — al revés
 * de `inkEstado`: acá "tranquila" (dorado) ya es clara y se deja igual, pero
 * las otras 3 (oscuras, pensadas para fondo de tarjeta con texto claro
 * encima) miden 1.3-1.5:1 sobre `--surface`, muy por debajo del 4.5:1
 * mínimo — se aclaran solo para este uso. */
export function colorEstadoSobreOscuro(estado: Estado): string {
  if (estado === 'tranquila') return colorEstado(estado);
  return `color-mix(in oklab, white 45%, ${colorEstado(estado)})`;
}
