// Layout del panel de admin — verifica el rol EN EL SERVIDOR antes de
// renderizar nada (09-SEGURIDAD.md: ocultar la ruta no alcanza, eso es
// IDOR). Si no hay sesión, al login; si hay sesión pero no es admin, de
// vuelta a la app normal — nunca revela que /admin existe con un mensaje
// distinto para "no autorizado" vs "no encontrado".

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users } from 'lucide-react';
import { esAdmin } from '@/lib/supabase/admin-datos';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const autorizado = await esAdmin();
  if (!autorizado) {
    redirect('/app');
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <header className="border-b border-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)] px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <p className="text-sm font-bold [font-family:var(--font-display)]">Panel de administración</p>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]"
            >
              <LayoutDashboard size={15} aria-hidden="true" />
              Resumen
            </Link>
            <Link
              href="/admin/usuarios"
              className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]"
            >
              <Users size={15} aria-hidden="true" />
              Usuarios
            </Link>
            <Link href="/app" className="text-sm font-semibold text-[var(--text-secondary)]">
              Volver a la app
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
