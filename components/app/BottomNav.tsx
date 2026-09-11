'use client';

// Nav inferior de la app interna — píldora oscura con el ítem activo en
// círculo blanco (FICHA-ARTE.md §detalle firma a replicar). 4 tabs: Inicio,
// Lecturas, Historial, Perfil. Compatibilidad vive como tile dentro de
// Lecturas, no como tab propia (5 tabs no cabe cómodo en 375px).
// Los íconos son 4 de los símbolos de SimboloCarta.tsx (no lucide genérico),
// a pedido del usuario, para que hasta la navegación se sienta tarot: La
// Estrella (Inicio — guía/entrada), Los Enamorados (Lecturas — la lectura de
// pareja), La Luna (Historial — mirar hacia atrás, intuición), La Fuerza
// (Perfil — el sostén propio, sin validación externa).

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SimboloCarta } from '@/components/app/SimboloCarta';

const ITEMS = [
  { href: '/app', label: 'Inicio', carta: 'La Estrella' },
  { href: '/app/lecturas', label: 'Lecturas', carta: 'Los Enamorados' },
  { href: '/app/historial', label: 'Historial', carta: 'La Luna' },
  { href: '/app/perfil', label: 'Perfil', carta: 'La Fuerza' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[max(14px,env(safe-area-inset-bottom))]"
    >
      <div className="flex h-16 w-full max-w-md items-center justify-around rounded-[var(--radius-button)] bg-[var(--nav-bg)] px-2 shadow-[var(--shadow-2)]">
        {ITEMS.map(({ href, label, carta }) => {
          const activo = href === '/app' ? pathname === '/app' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={activo ? 'page' : undefined}
              className={`flex size-11 items-center justify-center rounded-full transition-colors ${
                activo
                  ? 'bg-[var(--bg)] shadow-[inset_0_1px_1px_rgb(255_255_255/0.9),inset_0_-2px_3px_rgb(0_0_0/0.15),0_3px_8px_-2px_rgb(0_0_0/0.4)]'
                  : 'bg-transparent'
              }`}
            >
              <span className="flex size-8 items-center justify-center">
                <SimboloCarta
                  nombre={carta}
                  color={activo ? 'var(--nav-bg)' : 'var(--nav-icon)'}
                  fondo={activo ? 'var(--bg)' : 'var(--nav-bg)'}
                />
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
