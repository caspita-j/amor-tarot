// Layout del panel de admin — verifica el rol EN EL SERVIDOR antes de
// renderizar nada (09-SEGURIDAD.md: ocultar la ruta no alcanza, eso es
// IDOR). Si no hay sesión, al login; si hay sesión pero no es admin, de
// vuelta a la app normal — nunca revela que /admin existe con un mensaje
// distinto para "no autorizado" vs "no encontrado".

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { esAdmin } from '@/lib/supabase/admin-datos';
import { AdminNav } from './AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const autorizado = await esAdmin();
  if (!autorizado) {
    redirect('/app');
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <header className="border-b border-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)] px-4 py-3">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold [font-family:var(--font-display)]">Panel de administración</p>
          <div className="flex flex-wrap items-center gap-3">
            <AdminNav />
            <Link href="/app" className="text-sm font-semibold text-[var(--text-secondary)]">
              Volver a la app
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
