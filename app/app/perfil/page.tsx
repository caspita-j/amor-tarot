'use client';

// Perfil — protagonista: quién eres en la app + tu racha + salir. Nada de
// ajustes que todavía no existen (notificaciones reales, pago) para no
// prometer control que el producto no tiene en esta sesión.

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Flame, LogOut, TriangleAlert } from 'lucide-react';
import { guardarFotoPerfil, leerFotoPerfil } from '@/lib/estado-app';
import { leerPerfil, type Perfil } from '@/lib/supabase/datos';
import { recortarCuadrado } from '@/lib/imagen';
import { createClient } from '@/lib/supabase/client';
import { imagenSigno } from '@/lib/zodiaco';
import { TemaMistico } from '@/components/app/TemaMistico';

export default function PerfilPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const inputFotoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    leerPerfil().then(setPerfil);
    setFoto(leerFotoPerfil());
  }, []);

  const nombre = perfil?.nombre?.trim() || 'Tú';
  const dias = perfil?.rachaDias ?? 0;

  const cambiarFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;
    try {
      const dataUrl = await recortarCuadrado(archivo);
      guardarFotoPerfil(dataUrl);
      setFoto(dataUrl);
    } catch {
      // Formato no soportado o imagen corrupta: se ignora, el usuario puede
      // intentar con otra foto — no hay nada que romper en el resto de la app.
    }
  };

  const cerrarSesion = async () => {
    // Antes solo limpiaba sessionStorage — con Supabase Auth real, la
    // cookie de sesión seguía viva del lado del servidor. signOut() la
    // invalida de verdad.
    const supabase = createClient();
    await supabase.auth.signOut();
    sessionStorage.clear();
    router.push('/login');
  };

  return (
    <TemaMistico>
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold [font-family:var(--font-display)]">Perfil</h1>

        <div className="mt-5 flex items-center gap-3.5 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
          <button
            type="button"
            onClick={() => inputFotoRef.current?.click()}
            aria-label={foto ? 'Cambiar foto de perfil' : 'Agregar foto de perfil'}
            className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-lg font-bold text-[var(--bg)] [font-family:var(--font-display)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
          >
            {foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={foto} alt="" className="size-full rounded-full object-cover" />
            ) : (
              nombre.charAt(0).toUpperCase()
            )}
            <span className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-[var(--text-primary)] ring-2 ring-[var(--surface)]">
              <Camera size={11} color="var(--bg)" aria-hidden="true" />
            </span>
          </button>
          <input ref={inputFotoRef} type="file" accept="image/*" onChange={cambiarFoto} className="sr-only" />
          <div>
            <p className="text-base font-bold [font-family:var(--font-display)]">{nombre}</p>
            {perfil?.signo && (
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                {imagenSigno(perfil.signo) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagenSigno(perfil.signo)} alt="" className="size-4 shrink-0 rounded-full" />
                )}
                {perfil.signo}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--accent-4)] p-4">
          <Flame size={20} color="var(--accent-4-ink)" aria-hidden="true" />
          <p className="text-sm font-bold text-[var(--accent-4-ink)]">
            Racha: {dias} {dias === 1 ? 'día' : 'días'}
          </p>
        </div>

        <div className="mt-6 flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_18%,transparent)]">
          <a
            href="/terminos"
            className="border-b border-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)] px-4 py-3.5 text-sm font-semibold text-[var(--text-primary)]"
          >
            Términos y condiciones
          </a>
          <a
            href="/privacidad"
            className="border-b border-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)] px-4 py-3.5 text-sm font-semibold text-[var(--text-primary)]"
          >
            Aviso de privacidad
          </a>
          <a href="/reembolsos" className="px-4 py-3.5 text-sm font-semibold text-[var(--text-primary)]">
            Reembolsos
          </a>
        </div>

        <button
          type="button"
          onClick={cerrarSesion}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 text-sm font-bold text-[var(--text-secondary)]"
        >
          <LogOut size={17} aria-hidden="true" />
          Cerrar sesión
        </button>

        <ZonaPeligro />
      </div>
    </TemaMistico>
  );
}

function ZonaPeligro() {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [texto, setTexto] = useState('');
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState('');

  const eliminarCuenta = async () => {
    if (texto.trim().toUpperCase() !== 'ELIMINAR' || eliminando) return;
    setEliminando(true);
    setError('');
    try {
      const resp = await fetch('/api/cuenta/eliminar', { method: 'POST' });
      if (!resp.ok) {
        setError('No pudimos eliminar tu cuenta. Intenta de nuevo o escríbenos a jonathanrd198@gmail.com.');
        setEliminando(false);
        return;
      }
      const supabase = createClient();
      await supabase.auth.signOut();
      sessionStorage.clear();
      router.push('/');
    } catch {
      setError('No pudimos eliminar tu cuenta. Intenta de nuevo o escríbenos a jonathanrd198@gmail.com.');
      setEliminando(false);
    }
  };

  return (
    <div className="mt-8 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--danger)_35%,transparent)] p-4">
      <p className="text-sm font-bold text-[var(--danger)]">Eliminar mi cuenta</p>
      <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
        Esto borra tu perfil, tus lecturas y tu historial de forma permanente. No se puede deshacer.
      </p>

      <div className="mt-3 flex items-start gap-2 rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--danger)_10%,transparent)] p-3">
        <TriangleAlert size={16} color="var(--danger)" className="mt-0.5 shrink-0" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-[var(--text-primary)]">
          Si tienes una suscripción activa, <strong className="font-bold">cancélala primero en Hotmart</strong>.
          Eliminar tu cuenta no cancela el cobro automático — sigues pagando aunque ya no tengas acceso.{' '}
          <a href="/reembolsos" className="font-bold underline underline-offset-2">
            Ver cómo cancelar
          </a>
          .
        </p>
      </div>

      {!confirmando ? (
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          className="mt-3 text-sm font-bold text-[var(--danger)] underline underline-offset-2"
        >
          Quiero eliminar mi cuenta
        </button>
      ) : (
        <div className="mt-3 flex flex-col gap-2.5">
          <label className="text-xs font-bold text-[var(--text-secondary)]" htmlFor="confirmar-eliminar">
            Escribe ELIMINAR para confirmar
          </label>
          <input
            id="confirmar-eliminar"
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="ELIMINAR"
            className="h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--danger)_35%,transparent)] bg-[var(--bg)] px-3.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--danger)]"
          />
          {error && <p className="text-xs font-medium text-[var(--danger)]">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirmando(false);
                setTexto('');
                setError('');
              }}
              className="h-11 flex-1 rounded-[var(--radius-button)] text-sm font-bold text-[var(--text-secondary)]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={eliminarCuenta}
              disabled={texto.trim().toUpperCase() !== 'ELIMINAR' || eliminando}
              className="h-11 flex-1 rounded-[var(--radius-button)] bg-[var(--danger)] text-sm font-bold text-white disabled:opacity-40"
            >
              {eliminando ? 'Eliminando…' : 'Eliminar para siempre'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
