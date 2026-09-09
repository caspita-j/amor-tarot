'use client';

// Formulario para que el dueño agregue un usuario a mano (nombre + correo).
// Pega contra /api/admin/usuarios, que valida admin EN EL SERVIDOR antes de
// tocar nada — ver esa ruta para el detalle de seguridad.

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

type Resultado = { tipo: 'ok'; enlace: string } | { tipo: 'error'; mensaje: string } | null;

export function AgregarUsuarioForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<Resultado>(null);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || cargando) return;
    setCargando(true);
    setResultado(null);
    try {
      const resp = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), email: email.trim() }),
      });
      const data = (await resp.json()) as { error?: string; mensaje?: string; enlace?: string };
      if (!resp.ok) {
        setResultado({ tipo: 'error', mensaje: data.mensaje ?? 'No se pudo crear el usuario.' });
        return;
      }
      setResultado({ tipo: 'ok', enlace: data.enlace ?? '' });
      setNombre('');
      setEmail('');
    } catch {
      setResultado({ tipo: 'error', mensaje: 'No se pudo conectar con el servidor. Intenta de nuevo.' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={enviar} className="flex flex-col gap-2.5 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="text-xs font-bold text-[var(--text-secondary)]" htmlFor="nombre-usuario">
          Nombre
        </label>
        <input
          id="nombre-usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Opcional"
          className="mt-1 h-10 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] bg-[var(--bg)] px-3 text-sm outline-none focus:border-[var(--accent)]"
        />
      </div>
      <div className="flex-1">
        <label className="text-xs font-bold text-[var(--text-secondary)]" htmlFor="email-usuario">
          Correo
        </label>
        <input
          id="email-usuario"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="persona@correo.com"
          className="mt-1 h-10 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] bg-[var(--bg)] px-3 text-sm outline-none focus:border-[var(--accent)]"
        />
      </div>
      <button
        type="submit"
        disabled={cargando || !email.trim()}
        className="flex h-10 items-center justify-center gap-1.5 rounded-[var(--radius-button)] bg-[var(--accent)] px-4 text-sm font-bold text-[var(--bg)] disabled:opacity-50"
      >
        {cargando && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
        {cargando ? 'Creando…' : 'Agregar'}
      </button>

      {resultado?.tipo === 'error' && (
        <p className="w-full text-xs text-[var(--danger)]" role="alert">
          {resultado.mensaje}
        </p>
      )}
      {resultado?.tipo === 'ok' && (
        <div className="w-full rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--accent)_10%,var(--bg))] p-3 text-xs text-[var(--text-primary)]">
          <p className="font-bold">Usuario creado. Copia y envíale este enlace de acceso:</p>
          <p className="mt-1 break-all font-mono">{resultado.enlace}</p>
        </div>
      )}
    </form>
  );
}
