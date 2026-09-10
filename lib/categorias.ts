// Categorías de lectura — antes la app solo leía dudas de pareja; ahora
// cualquier duda del día a día entra en el mismo mecanismo (El Espejo de las
// 3 Cartas), pedido explícito del usuario para que la app se sienta como un
// hombro donde desahogarse, no solo una herramienta de pareja. Un solo lugar
// para la lista + las etiquetas de las 3 cartas por categoría, para que la
// UI (selector, historial) y el prompt de la IA usen exactamente lo mismo.

export type Categoria = 'pareja' | 'trabajo' | 'familia' | 'amistad' | 'decision' | 'otro';

export const CATEGORIAS: { id: Categoria; label: string; pideOtraPersona: boolean }[] = [
  { id: 'pareja', label: 'Pareja', pideOtraPersona: true },
  { id: 'trabajo', label: 'Trabajo', pideOtraPersona: false },
  { id: 'familia', label: 'Familia', pideOtraPersona: true },
  { id: 'amistad', label: 'Amistad', pideOtraPersona: true },
  { id: 'decision', label: 'Una decisión', pideOtraPersona: false },
  { id: 'otro', label: 'Otro', pideOtraPersona: false },
];

export function labelCategoria(categoria: Categoria): string {
  return CATEGORIAS.find((c) => c.id === categoria)?.label ?? 'Otro';
}

export function pideOtraPersona(categoria: Categoria): boolean {
  return CATEGORIAS.find((c) => c.id === categoria)?.pideOtraPersona ?? false;
}

/** Etiqueta de la 2ª carta: el nombre de la otra persona si aplica y se dio,
 * o "La Situación" para dudas sin una persona puntual del otro lado. */
export function etiquetaCarta2(categoria: Categoria, nombreOtra?: string): string {
  if (pideOtraPersona(categoria) && nombreOtra?.trim()) return nombreOtra.trim();
  return 'La Situación';
}

/** Etiqueta de la 3ª carta — "La Dinámica" es el nombre de marca del
 * mecanismo (ver landing: "Tú, La Otra Persona, La Dinámica"), se conserva
 * tal cual para las categorías relacionales; las demás usan "El Camino". */
export function etiquetaCarta3(categoria: Categoria): string {
  return categoria === 'pareja' || categoria === 'familia' || categoria === 'amistad'
    ? 'La Dinámica'
    : 'El Camino';
}
