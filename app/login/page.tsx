'use client';

// Login de Amor & Tarot — método PRIMARIO: enlace mágico / código de 6 dígitos
// por correo (26-AUTH-MODERNO: passwordless, el combo enlace+código en el
// mismo correo — el código existe porque el enlace solo puede fallar si el
// correo se abre en otra app/dispositivo). Google como mejora secundaria.
// Conectado a Supabase Auth real (Sesión 6, Etapa 1).

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail } from 'lucide-react';
import { BotonPrincipal } from '@/components/onboarding/ui';
import { TemaMistico } from '@/components/app/TemaMistico';
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
  const [autoriza, setAutoriza] = useState(false);
  // Algunos enlaces de acceso (los que genera el panel de admin para "agregar
  // usuario a mano") no traen `?code=` sino los tokens directo en el
  // `#fragmento` de la URL — porque quien los abre nunca inició el pedido
  // desde su propio navegador, así que Supabase no puede usar el flujo con
  // code_verifier que sí usa /auth/callback. El fragmento nunca llega al
  // servidor, así que solo un componente de cliente puede leerlo y crear la
  // sesión a mano con setSession(). Sin esto, esos enlaces dejaban a la
  // persona en /login sin poder entrar aunque el enlace fuera válido.
  const [entrandoConEnlace, setEntrandoConEnlace] = useState(
    () => typeof window !== 'undefined' && window.location.hash.includes('access_token'),
  );

  useEffect(() => {
    if (!window.location.hash.includes('access_token')) return;
    const parametros = new URLSearchParams(window.location.hash.slice(1));
    const access_token = parametros.get('access_token');
    const refresh_token = parametros.get('refresh_token');
    // Limpia el fragmento de la URL cuanto antes — son credenciales de un
    // solo uso, no deben quedar visibles ni reutilizables en el historial.
    window.history.replaceState(null, '', window.location.pathname);
    if (!access_token || !refresh_token) {
      setEntrandoConEnlace(false);
      return;
    }
    supabase.auth.setSession({ access_token, refresh_token }).then(({ error: err }) => {
      if (err) {
        setEntrandoConEnlace(false);
        setError('Ese enlace ya venció o no es válido. Pide uno nuevo.');
        return;
      }
      router.push('/app');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emailValido = /\S+@\S+\.\S+/.test(email);

  const enviarEnlace = async () => {
    if (!emailValido || !autoriza || enviando) return;
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
    if (!autoriza) return;
    setError('');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <TemaMistico>
      <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-10 [font-family:var(--font-body)]">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marca/logo-completo.png" alt="Amor y Tarot" className="h-24 w-auto" />
          </div>

          {entrandoConEnlace ? (
            <div className="mt-8 flex flex-col items-center gap-3 text-center">
              <Loader2 size={28} color="var(--accent)" className="animate-spin" aria-hidden="true" />
              <p className="text-sm font-semibold text-[var(--text-secondary)]">Entrando con tu enlace…</p>
            </div>
          ) : !enviado ? (
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

                <label className="flex items-start gap-2.5 text-left">
                  <input
                    type="checkbox"
                    checked={autoriza}
                    onChange={(e) => setAutoriza(e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 rounded-[4px] border border-[color-mix(in_oklab,var(--text-secondary)_40%,transparent)] accent-[var(--accent)]"
                  />
                  <span className="text-xs leading-relaxed text-[var(--text-secondary)]">
                    Autorizo el tratamiento de mis datos según la{' '}
                    <a href="/privacidad" className="underline underline-offset-2">
                      Política de Privacidad
                    </a>{' '}
                    y acepto los{' '}
                    <a href="/terminos" className="underline underline-offset-2">
                      Términos y Condiciones
                    </a>
                    .
                  </span>
                </label>

                <BotonPrincipal disabled={!emailValido || !autoriza} cargando={enviando} onClick={enviarEnlace}>
                  {enviando ? 'Enviando…' : 'Enviarme el enlace mágico'}
                </BotonPrincipal>
              </div>

              <div className="my-6 flex items-center gap-3 text-xs font-medium text-[var(--text-secondary)]">
                <span className="h-px flex-1 bg-[var(--surface-2)]" />o
                <span className="h-px flex-1 bg-[var(--surface-2)]" />
              </div>

              <button
                type="button"
                onClick={continuarConGoogle}
                disabled={!autoriza}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] text-base font-semibold text-[var(--text-primary)] disabled:opacity-40"
              >
                Continuar con Google
              </button>
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
                  <BotonPrincipal
                    disabled={codigo.trim().length !== 6}
                    cargando={verificando}
                    onClick={verificarCodigo}
                  >
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
    </TemaMistico>
  );
}
