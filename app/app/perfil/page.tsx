'use client';

// Perfil — protagonista: quién eres en la app + tu racha + salir. Nada de
// ajustes que todavía no existen (notificaciones reales, pago) para no
// prometer control que el producto no tiene en esta sesión.

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Flame, LogOut } from 'lucide-react';
import {
  guardarFotoPerfil,
  leerFotoPerfil,
  leerOnboarding,
  leerRacha,
  type Racha,
  type RespuestasOnboarding,
} from '@/lib/estado-app';
import { recortarCuadrado } from '@/lib/imagen';

export default function PerfilPage() {
  const router = useRouter();
  const [onboarding, setOnboarding] = useState<RespuestasOnboarding>({});
  const [racha, setRacha] = useState<Racha>({ dias: 0, ultimaFecha: null });
  const [foto, setFoto] = useState<string | null>(null);
  const inputFotoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOnboarding(leerOnboarding());
    setRacha(leerRacha());
    setFoto(leerFotoPerfil());
  }, []);

  const nombre = onboarding.nombre?.trim() || 'Tú';

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

  const cerrarSesion = () => {
    sessionStorage.clear();
    router.push('/login');
  };

  return (
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
        <input
          ref={inputFotoRef}
          type="file"
          accept="image/*"
          onChange={cambiarFoto}
          className="sr-only"
        />
        <div>
          <p className="text-base font-bold [font-family:var(--font-display)]">{nombre}</p>
          {onboarding.signo && <p className="text-sm text-[var(--text-secondary)]">{onboarding.signo}</p>}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--accent-4)] p-4">
        <Flame size={20} color="var(--accent-4-ink)" aria-hidden="true" />
        <p className="text-sm font-bold text-[var(--accent-4-ink)]">
          Racha: {racha.dias} {racha.dias === 1 ? 'día' : 'días'}
        </p>
      </div>

      <div className="mt-6 flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_18%,transparent)]">
        <a href="/terminos" className="border-b border-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)] px-4 py-3.5 text-sm font-semibold text-[var(--text-primary)]">
          Términos y condiciones
        </a>
        <a href="/privacidad" className="px-4 py-3.5 text-sm font-semibold text-[var(--text-primary)]">
          Aviso de privacidad
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
    </div>
  );
}
