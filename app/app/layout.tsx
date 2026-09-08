import { BottomNav } from '@/components/app/BottomNav';

export default function AppInternaLayout({ children }: LayoutProps<'/app'>) {
  return (
    <div className="flex min-h-dvh flex-col bg-[radial-gradient(ellipse_140%_50%_at_50%_-8%,color-mix(in_oklab,var(--accent)_14%,var(--bg))_0%,var(--bg)_55%)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="mx-auto w-full max-w-md flex-1 pb-28">{children}</div>
      <BottomNav />
    </div>
  );
}
