// Piezas compartidas del panel de admin — mismo lenguaje visual en todas las
// secciones (Salud del dato, Usuarios, Operación, Negocio, Resumen).

export function Metrica({
  valor,
  label,
  insight,
  color,
}: {
  valor: string;
  label: string;
  insight?: string;
  color?: string;
}) {
  return (
    <div
      className="rounded-[var(--radius-card)] p-4"
      style={{ backgroundColor: color ? `color-mix(in oklab, ${color} 12%, var(--surface))` : 'var(--surface)' }}
    >
      <p className="text-3xl font-bold leading-none [font-family:var(--font-display)]" style={color ? { color } : undefined}>
        {valor}
      </p>
      <p className="mt-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-tertiary)]">{label}</p>
      {insight && <p className="mt-1.5 text-xs text-[var(--text-secondary)]">{insight}</p>}
    </div>
  );
}

export function NoInstrumentado({ falta }: { falta: string }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-secondary)_30%,transparent)] p-4">
      <p className="text-sm font-bold text-[var(--text-secondary)]">No instrumentado todavía</p>
      <p className="mt-1 text-xs text-[var(--text-tertiary)]">Falta conectar: {falta}</p>
    </div>
  );
}

export function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--text-tertiary)]">{titulo}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function hace(iso: string | null): string {
  if (!iso) return 'nunca';
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'hace un momento';
  if (min < 60) return `hace ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
}
