'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Activity, Users, Sparkles, Briefcase } from 'lucide-react';

const ITEMS = [
  { href: '/admin', label: 'Resumen', icono: LayoutDashboard, color: 'var(--text-primary)' },
  { href: '/admin/salud', label: 'Salud del dato', icono: Activity, color: 'var(--accent-3)' },
  { href: '/admin/usuarios', label: 'Usuarios', icono: Users, color: 'var(--accent-4)' },
  { href: '/admin/operacion', label: 'Operación', icono: Sparkles, color: 'var(--accent)' },
  { href: '/admin/negocio', label: 'Negocio', icono: Briefcase, color: 'var(--accent-2)' },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-1.5">
      {ITEMS.map(({ href, label, icono: Icono, color }) => {
        const activo = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={activo ? 'page' : undefined}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: activo ? `color-mix(in oklab, ${color} 14%, transparent)` : 'transparent',
              color: activo ? color : 'var(--text-secondary)',
            }}
          >
            <Icono size={15} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
