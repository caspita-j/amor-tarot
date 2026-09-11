import { BottomNav } from '@/components/app/BottomNav';

// Sin fondo propio: las 5 pantallas de /app/* ya se envuelven en <TemaMistico>
// (oscuro/dorado) o lo que corresponda a futuro — este layout solo da la
// estructura (nav + ancho máximo), no pinta nada detrás.
export default function AppInternaLayout({ children }: LayoutProps<'/app'>) {
  return (
    <div className="flex min-h-dvh flex-col text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="mx-auto w-full max-w-md flex-1 pb-28">{children}</div>
      <BottomNav />
    </div>
  );
}
