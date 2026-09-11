// Fondo "con aura" — 3 manchas de color desenfocadas detrás del contenido,
// en modo claro (paleta de FICHA-ARTE.md sin tocar). Es el eco elegido por
// el usuario del brillo/profundidad que le gustó en su imagen de referencia
// oscura, adaptado a la paleta clara ya aprobada. Puramente decorativo.
export function FondoAura() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <span className="absolute -left-12 -top-16 size-56 rounded-full bg-[var(--accent)] opacity-30 blur-3xl" />
      <span className="absolute -right-14 top-16 size-44 rounded-full bg-[var(--accent-4)] opacity-25 blur-3xl" />
      <span className="absolute -left-6 -bottom-16 size-52 rounded-full bg-[var(--accent-3)] opacity-30 blur-3xl" />
    </div>
  );
}
