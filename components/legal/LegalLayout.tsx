// Layout compartido de las páginas legales (Privacidad, Términos, Reembolsos,
// Aviso) — misma tipografía y estructura en las 4, para que se sientan parte
// de la misma app y no 4 páginas sueltas. Server component, sin hooks.

import Link from 'next/link';
import type { ReactNode } from 'react';

export function LegalLayout({
  titulo,
  actualizado,
  children,
}: {
  titulo: string;
  actualizado: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-[var(--bg)] px-5 py-10 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm font-semibold text-[var(--text-secondary)]">
          ← Volver
        </Link>
        <h1 className="mt-4 text-3xl font-bold leading-tight [font-family:var(--font-display)]">{titulo}</h1>
        <p className="mt-1.5 text-xs font-semibold text-[var(--text-tertiary)]">Última actualización: {actualizado}</p>
        <div className="mt-8 flex flex-col gap-6">{children}</div>
      </div>
    </main>
  );
}

export function LegalSeccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold [font-family:var(--font-display)]">{titulo}</h2>
      <div className="mt-2 flex flex-col gap-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">{children}</div>
    </section>
  );
}

export function LegalLista({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalDestacado({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4 text-sm leading-relaxed text-[var(--text-primary)]">
      {children}
    </div>
  );
}
