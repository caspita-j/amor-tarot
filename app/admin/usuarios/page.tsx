// Lista de usuarios reales + acción de agregar uno manualmente (por si el
// correo automático no le llega a alguien — ver AgregarUsuarioForm).

import { leerUsuarios } from '@/lib/supabase/admin-datos';
import { AgregarUsuarioForm } from './AgregarUsuarioForm';

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function AdminUsuariosPage() {
  const usuarios = await leerUsuarios();

  return (
    <div>
      <h1 className="text-xl font-bold [font-family:var(--font-display)]">Usuarios</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        {usuarios.length} {usuarios.length === 1 ? 'persona registrada' : 'personas registradas'}
      </p>

      <div className="mt-5 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
        <p className="text-sm font-bold">Agregar usuario manualmente</p>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Úsalo si a alguien no le llegó el correo de acceso — le crea la cuenta directo, sin depender
          del envío automático.
        </p>
        <div className="mt-3">
          <AgregarUsuarioForm />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[color-mix(in_oklab,var(--text-secondary)_18%,transparent)] text-left text-xs font-bold uppercase tracking-wide text-[var(--text-tertiary)]">
              <th className="py-2 pr-3">Correo</th>
              <th className="py-2 pr-3">Registrado</th>
              <th className="py-2 pr-3">Racha</th>
              <th className="py-2 pr-3">Lecturas</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-[var(--text-secondary)]">
                  Todavía no hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id} className="border-b border-[color-mix(in_oklab,var(--text-secondary)_10%,transparent)]">
                  <td className="py-2.5 pr-3">{u.email}</td>
                  <td className="py-2.5 pr-3 text-[var(--text-secondary)]">{formatearFecha(u.creado)}</td>
                  <td className="py-2.5 pr-3 text-[var(--text-secondary)]">
                    {u.rachaDias} {u.rachaDias === 1 ? 'día' : 'días'}
                  </td>
                  <td className="py-2.5 pr-3 text-[var(--text-secondary)]">{u.totalLecturas}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
