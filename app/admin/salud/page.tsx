// Salud del dato — última actividad real de cada tabla, para detectar rápido
// si algo dejó de llegar (ej. si "última lectura" lleva días quietos).

import { Activity } from 'lucide-react';
import { leerSaludDatos } from '@/lib/supabase/admin-datos';
import { Metrica, Seccion, hace } from '@/components/admin/ui';

export default async function AdminSaludPage() {
  const salud = await leerSaludDatos();

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <Activity size={20} color="var(--accent-3)" aria-hidden="true" />
        <h1 className="text-xl font-bold [font-family:var(--font-display)]">Salud del dato</h1>
      </div>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Cuándo llegó lo último de cada fuente — si algo lleva mucho tiempo sin moverse, es la primera
        señal de que algo se rompió.
      </p>

      <Seccion titulo="Última actividad">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <Metrica
            valor={hace(salud?.ultimoRegistroUsuario ?? null)}
            label="Último usuario registrado"
            color="var(--accent-3)"
          />
          <Metrica valor={hace(salud?.ultimaLectura ?? null)} label="Última lectura guardada" color="var(--accent-3)" />
          <Metrica valor={hace(salud?.ultimaLlamadaIa ?? null)} label="Última llamada a la IA" color="var(--accent-3)" />
        </div>
      </Seccion>

      <Seccion titulo="Totales acumulados">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Metrica valor={String(salud?.totalUsuarios ?? 0)} label="Usuarios" />
          <Metrica valor={String(salud?.totalPerfiles ?? 0)} label="Perfiles" />
          <Metrica valor={String(salud?.totalLecturas ?? 0)} label="Lecturas" />
          <Metrica valor={String(salud?.totalLlamadasIa ?? 0)} label="Llamadas a la IA" />
        </div>
      </Seccion>
    </div>
  );
}
