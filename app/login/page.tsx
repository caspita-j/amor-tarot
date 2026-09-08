'use client';

// Login de Amor & Tarot — método PRIMARIO: enlace mágico / código de 6 dígitos
// por correo (26-AUTH-MODERNO: passwordless, el combo enlace+código en el
// mismo correo — el código existe porque el enlace solo puede fallar si el
// correo se abre en otra app/dispositivo). Google como mejora secundaria.
// Conectado a Supabase Auth real (Sesión 6, Etapa 1).

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { BotonPrincipal } from '@/components/onboarding/ui';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [error, setError] = useState('');

  const emailValido = /\S+@\S+\.\S+/.test(email);

  const enviarEnlace = async () => {
    if (!emailValido || enviando) return;
    setEnviando(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setEnviando(false);
    if (err) {
      // Mensaje genérico (anti-enumeración, 26-AUTH-MODERNO): nunca decir si
      // el correo existe o no, ni distinguir el motivo real del fallo.
      setError('No pudimos enviarte el correo. Intenta de nuevo en un momento.');
      return;
    }
    setEnviado(true);
  };

  const verificarCodigo = async () => {
    if (codigo.trim().length !== 6 || verificando) return;
    setVerificando(true);
    setError('');
    const { error: err } = await supabase.auth.verifyOtp({ email, token: codigo.trim(), type: 'email' });
    setVerificando(false);
    if (err) {
      setError('Ese código no es válido o ya venció. Puedes pedir uno nuevo.');
      return;
    }
    router.push('/app');
  };

  const continuarConGoogle = async () => {
    setError('');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[var(--bg)] px-6 py-10 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2">
          <span className="size-8 shrink-0 rounded-xl bg-[var(--accent)]" aria-hidden="true" />
          <span className="text-base font-bold [font-family:var(--font-display)]">Amor & Tarot</span>
        </div>

        {!enviado ? (
          <>
            <h1 className="mt-8 text-balance text-center text-2xl font-bold leading-tight [font-family:var(--font-display)]">
              Guarda tu lectura
            </h1>
            <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
              Entra con tu correo — sin contraseñas que recordar.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <label className="sr-only" htmlFor="email">
                Correo
              </label>
              <input
                id="email"
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] bg-[var(--bg)] px-5 text-base text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              />
              {error && <p className="text-sm font-medium text-[var(--danger)]">{error}</p>}
              <BotonPrincipal disabled={!emailValido} cargando={enviando} onClick={enviarEnlace}>
                {enviando ? 'Enviando…' : 'Enviarme el enlace mágico'}
              </BotonPrincipal>
            </div>

            <div className="my-6 flex items-center gap-3 text-xs font-medium text-[var(--text-secondary)]">
              <span className="h-px flex-1 bg-[var(--surface-2)]" />o<span className="h-px flex-1 bg-[var(--surface-2)]" />
            </div>

            <button
              type="button"
              onClick={continuarConGoogle}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] text-base font-semibold text-[var(--text-primary)]"
            >
              Continuar con Google
            </button>

            <p className="mt-6 text-center text-xs leading-relaxed text-[var(--text-secondary)]">
              Al continuar aceptas los{' '}
              <a href="/terminos" className="underline underline-offset-2">
                Términos
              </a>{' '}
              y la{' '}
              <a href="/privacidad" className="underline underline-offset-2">
                Privacidad
              </a>
              .
            </p>
          </>
        ) : (
          <div className="mt-8 flex flex-col items-center text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[var(--chip-bg)]">
              <Mail size={26} color="var(--accent)" />
            </span>
            <h1 className="mt-5 text-xl font-bold [font-family:var(--font-display)]">Revisa tu correo</h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              Te mandamos un enlace y un código de 6 dígitos a <strong className="font-semibold">{email}</strong>.
              Cualquiera de los dos te deja entrar.
            </p>

            <div className="mt-6 w-full">
              <label className="text-left text-xs font-bold text-[var(--text-secondary)]" htmlFor="codigo">
                ¿Recibiste un código? Escríbelo aquí
              </label>
              <input
                id="codigo"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                placeholder="481 372"
                className="mt-2 h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] bg-[var(--bg)] px-5 text-center text-lg tracking-[0.3em] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              />
              {error && <p className="mt-2 text-sm font-medium text-[var(--danger)]">{error}</p>}
              <div className="mt-3">
                <BotonPrincipal disabled={codigo.trim().length !== 6} cargando={verificando} onClick={verificarCodigo}>
                  {verificando ? 'Verificando…' : 'Entrar con el código'}
                </BotonPrincipal>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setEnviado(false);
                setCodigo('');
                setError('');
              }}
              className="mt-6 text-sm font-semibold text-[var(--accent)]"
            >
              Usar otro correo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
