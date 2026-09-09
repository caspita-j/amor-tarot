// Resumen — vista general al entrar: lo más importante de un vistazo, con
// enlaces a cada sección para el detalle completo.

import Link from 'next/link';
import { AlertTriangle, Activity, Users, Sparkles, Briefcase, ChevronRight } from 'lucide-react';
import { leerCostoIa, leerResumenUsuarios, leerSaludDatos } from '@/lib/supabase/admin-datos';
import { Metrica, hace } from '@/components/admin/ui';

function TarjetaSeccion({
  href,
  icono: Icono,
  color,
  titulo,
  descripcion,
}: {
  href: string;
  icono: typeof Activity;
  color: string;
  titulo: string;
  descripcion: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 transition-transform active:scale-[0.98]"
    >
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `color-mix(in oklab, ${color} 16%, transparent)` }}
      >
        <Icono size={18} color={color} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{titulo}</span>
        <span className="block truncate text-xs text-[var(--text-secondary)]">{descripcion}</span>
      </span>
      <ChevronRight size={16} color="var(--text-tertiary)" aria-hidden="true" className="shrink-0" />
    </Link>
  );
}

export default async function AdminPage() {
  const [salud, resumenUsuarios, costoIaDias] = await Promise.all([
    leerSaludDatos(),
    leerResumenUsuarios(),
    leerCostoIa(1),
  ]);
  const costoIaHoy = costoIaDias.reduce((acc, d) => acc + d.costo, 0);

  return (
    <div>
      <div className="flex items-start gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
        <AlertTriangle size={18} color="var(--text-secondary)" className="mt-0.5 shrink-0" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          Todavía no hay suficientes datos conectados (ventas, canal de origen, errores) para generar
          avisos automáticos de negocio con confianza — se activa al conectar Hotmart y el registro de
          eventos. Mientras tanto, no se inventa un veredicto de "todo bien" ni de alerta.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Metrica valor={String(resumenUsuarios?.totalUsuarios ?? 0)} label="Usuarios" color="var(--accent-4)" />
        <Metrica
          valor={String(resumenUsuarios?.usuariosRachaActivaHoy ?? 0)}
          label="Con racha hoy"
          color="var(--accent-4)"
        />
        <Metrica valor={`$${costoIaHoy.toFixed(3)}`} label="Costo de IA hoy" color="var(--accent)" />
        <Metrica
          valor={String(salud?.totalLecturas ?? 0)}
          label="Lecturas guardadas"
          insight={`Última: ${hace(salud?.ultimaLectura ?? null)}`}
        />
      </div>

      <p className="mt-8 text-sm font-bold uppercase tracking-wide text-[var(--text-tertiary)]">Explorar</p>
      <div className="mt-3 flex flex-col gap-2.5">
        <TarjetaSeccion
          href="/admin/salud"
          icono={Activity}
          color="var(--accent-3)"
          titulo="Salud del dato"
          descripcion="Última actividad, totales, si algo se ve raro"
        />
        <TarjetaSeccion
          href="/admin/usuarios"
          icono={Users}
          color="var(--accent-4)"
          titulo="Usuarios"
          descripcion="Lista completa, registros nuevos por día, agregar a mano"
        />
        <TarjetaSeccion
          href="/admin/operacion"
          icono={Sparkles}
          color="var(--accent)"
          titulo="Operación"
          descripcion="Costo real de la IA, día por día"
        />
        <TarjetaSeccion
          href="/admin/negocio"
          icono={Briefcase}
          color="var(--accent-2)"
          titulo="Negocio"
          descripcion="Ventas, conversión, ganancia real — qué falta conectar"
        />
      </div>
    </div>
  );
}
