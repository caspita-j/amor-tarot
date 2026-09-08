export default function AvisoPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--bg)] px-6 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      <p className="text-sm font-bold uppercase tracking-wide text-[var(--accent)]">
        Aviso de uso
      </p>
      <h1 className="max-w-sm text-2xl font-bold leading-tight [font-family:var(--font-display)]">
        Amor & Tarot es entretenimiento y autorreflexión
      </h1>
      <p className="max-w-md text-base text-[var(--text-secondary)]">
        No sustituye consejo profesional psicológico, legal ni financiero. Si estás pasando por
        una crisis emocional seria, habla con alguien de confianza o un profesional de salud
        mental.
      </p>
    </main>
  );
}
