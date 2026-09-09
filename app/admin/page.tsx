// Panel de administración — resumen. Cada sección muestra datos REALES
// donde existen, y "No instrumentado" (con qué falta conectar) donde no —
// nunca un número inventado. Ver ESTADO.md para el detalle de qué fuentes
// existen hoy y cuáles faltan (Hotmart, event_log, profiles.source, Sentry).

import { AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';
import {
  leerCostoIa,
  leerResumenUsuarios,
  leerSaludDatos,
  type CostoIaPorDia,
} from '@/lib/supabase/admin-datos';

function hace(iso: string | null): string {
  if (!iso) return 'nunca';
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'hace un momento';
  if (min < 60) return `hace ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
}

function Metrica({
  valor,
  label,
  insight,
}: {
  valor: string;
  label: string;
  insight?: string;
}) {
  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
      <p className="text-3xl font-bold leading-none [font-family:var(--font-display)]">{valor}</p>
      <p className="mt-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-tertiary)]">{label}</p>
      {insight && <p className="mt-1.5 text-xs text-[var(--text-secondary)]">{insight}</p>}
    </div>
  );
}

function NoInstrumentado({ falta }: { falta: string }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-secondary)_30%,transparent)] p-4">
      <p className="text-sm font-bold text-[var(--text-secondary)]">No instrumentado todavía</p>
      <p className="mt-1 text-xs text-[var(--text-tertiary)]">Falta conectar: {falta}</p>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--text-tertiary)]">{titulo}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function SparklineCostoIa({ datos }: { datos: CostoIaPorDia[] }) {
  if (datos.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)]">Sin llamadas de IA registradas todavía.</p>;
  }
  const max = Math.max(...datos.map((d) => d.costo), 0.001);
  return (
    <div className="flex h-16 items-end gap-1 overflow-x-auto">
      {datos.map((d) => (
        <div key={d.dia} className="flex min-w-3 flex-1 flex-col items-center justify-end" title={`${d.dia}: $${d.costo.toFixed(4)}`}>
          <div
            className="w-full rounded-t-sm bg-[var(--accent)]"
            style={{ height: `${Math.max(4, (d.costo / max) * 56)}px` }}
          />
        </div>
      ))}
    </div>
  );
}

export default async function AdminPage() {
  const [salud, resumenUsuarios, costoIaDias] = await Promise.all([
    leerSaludDatos(),
    leerResumenUsuarios(),
    leerCostoIa(30),
  ]);

  const costoIaTotal30d = costoIaDias.reduce((acc, d) => acc + d.costo, 0);
  const costoIaHoy = (() => {
    const hoy = new Date().toISOString().slice(0, 10);
    return costoIaDias.find((d) => d.dia === hoy)?.costo ?? 0;
  })();

  return (
    <div>
      <div className="flex items-start gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
        <AlertTriangle size={18} color="var(--text-secondary)" className="mt-0.5 shrink-0" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          Todavía no hay suficientes datos conectados (ventas, canal de origen, errores) para generar
          avisos automáticos de negocio con confianza. Esto se activa solo cuando conectes Hotmart y el
          registro de eventos — hasta entonces, no se inventa un veredicto de "todo bien" ni de alerta.
        </p>
      </div>

      <Seccion titulo="Salud del dato">
        <div className="grid grid-cols-2 gap-2.5">
          <Metrica
            valor={String(salud?.totalUsuarios ?? 0)}
            label="Usuarios registrados"
            insight={`Último: ${hace(salud?.ultimoRegistroUsuario ?? null)}`}
          />
          <Metrica
            valor={String(salud?.totalLecturas ?? 0)}
            label="Lecturas guardadas"
            insight={`Última: ${hace(salud?.ultimaLectura ?? null)}`}
          />
          <Metrica
            valor={String(salud?.totalLlamadasIa ?? 0)}
            label="Llamadas a la IA"
            insight={`Última: ${hace(salud?.ultimaLlamadaIa ?? null)}`}
          />
          <Metrica valor={String(salud?.totalPerfiles ?? 0)} label="Perfiles creados" />
        </div>
      </Seccion>

      <Seccion titulo="Conversión (landing → onboarding → pago)">
        <NoInstrumentado falta="un registro de eventos (event_log) que guarde cada paso del recorrido" />
      </Seccion>

      <Seccion titulo="Prueba gratis (trial)">
        <NoInstrumentado falta="el registro de eventos + la conexión con Hotmart (para saber cuándo empieza cada prueba)" />
      </Seccion>

      <Seccion titulo="Ventas">
        <NoInstrumentado falta="conectar Hotmart (ingresos, cancelaciones, reembolsos llegan por su webhook)" />
      </Seccion>

      <Seccion titulo="Usuarios">
        <div className="grid grid-cols-2 gap-2.5">
          <Metrica valor={String(resumenUsuarios?.totalUsuarios ?? 0)} label="Total registrados" />
          <Metrica
            valor={String(resumenUsuarios?.usuariosRachaActivaHoy ?? 0)}
            label="Con racha activa hoy"
          />
          <Metrica valor={String(resumenUsuarios?.usuariosNuevos7d ?? 0)} label="Nuevos, 7 días" />
          <Metrica valor={String(resumenUsuarios?.usuariosNuevos30d ?? 0)} label="Nuevos, 30 días" />
        </div>
        <p className="mt-2.5 text-xs text-[var(--text-tertiary)]">
          Retención D1/D7/D30 real: no instrumentado — falta un registro de eventos con fecha de cada
          visita (hoy solo se guarda la última fecha de racha, no el historial completo).
        </p>
      </Seccion>

      <Seccion titulo="Ganancia real">
        <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Ingresos: <span className="font-bold text-[var(--text-primary)]">Sin datos</span> (Hotmart no
            conectado)
          </p>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            Costo real de IA (últimos 30 días):{' '}
            <span className="font-bold text-[var(--text-primary)]">${costoIaTotal30d.toFixed(4)}</span>
          </p>
          <p className="mt-3 text-xs text-[var(--text-tertiary)]">
            No se puede calcular "lo que te queda limpio" sin conectar Hotmart (ingresos), Resend (costo
            de email) y confirmar la tarifa de infra. En cuanto eso exista, esta sección va a mostrar
            "Facturaste $X y te quedaron $Y limpios" de verdad.
          </p>
        </div>
      </Seccion>

      <Seccion titulo="Operación">
        <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} color="var(--accent)" aria-hidden="true" />
            <p className="text-sm font-bold">Costo de IA por día (últimos 30 días)</p>
          </div>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Hoy: ${costoIaHoy.toFixed(4)} · Total del período: ${costoIaTotal30d.toFixed(4)}
          </p>
          <div className="mt-3">
            <SparklineCostoIa datos={costoIaDias} />
          </div>
        </div>
        <div className="mt-2.5">
          <NoInstrumentado falta="Sentry u otro registro de errores — todavía no está conectado" />
        </div>
      </Seccion>

      <Seccion titulo="Negocio (LTV, CAC, margen por canal)">
        <NoInstrumentado falta="la columna de canal de origen (profiles.source) y el gasto de adquisición por canal" />
      </Seccion>

      <div className="mt-8 flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
        <TrendingUp size={13} aria-hidden="true" />
        Todas las cifras se leen en tiempo real de la base de datos — nada de esta pantalla es de
        prueba.
      </div>
    </div>
  );
}
