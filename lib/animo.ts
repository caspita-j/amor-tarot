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
