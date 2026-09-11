import { BottomNav } from '@/components/app/BottomNav';
import { FondoAura } from '@/components/app/FondoAura';

export default function AppInternaLayout({ children }: LayoutProps<'/app'>) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <FondoAura />
      <div className="relative z-10 mx-auto w-full max-w-md flex-1 pb-28">{children}</div>
      <BottomNav />
    </div>
  );
}
