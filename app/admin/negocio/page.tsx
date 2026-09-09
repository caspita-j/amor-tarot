// Negocio — ventas, conversión, ganancia real y LTV/CAC. Ninguna tiene fuente
// real hoy (falta Hotmart + un registro de eventos) — agrupadas acá para no
// llenar la navegación de pestañas vacías; cuando se conecten, cada una pasa
// a tener sus propios números reales en esta misma pantalla.

import { Briefcase } from 'lucide-react';
import { leerCostoIa } from '@/lib/supabase/admin-datos';
import { NoInstrumentado, Seccion } from '@/components/admin/ui';

export default async function AdminNegocioPage() {
  const costoIa30d = (await leerCostoIa(30)).reduce((acc, d) => acc + d.costo, 0);

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <Briefcase size={20} color="var(--accent-2)" aria-hidden="true" />
        <h1 className="text-xl font-bold [font-family:var(--font-display)]">Negocio</h1>
      </div>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Ventas, conversión y ganancia real — hoy sin fuente de datos conectada. En cuanto conectes
        Hotmart y el registro de eventos, cada sección de acá abajo se llena con números reales.
      </p>

      <Seccion titulo="Conversión (landing → onboarding → pago)">
        <NoInstrumentado falta="un registro de eventos (event_log) que guarde cada paso del recorrido" />
      </Seccion>

      <Seccion titulo="Prueba gratis (trial)">
        <NoInstrumentado falta="el registro de eventos + la conexión con Hotmart (para saber cuándo empieza cada prueba)" />
      </Seccion>

      <Seccion titulo="Ventas">
        <NoInstrumentado falta="conectar Hotmart (ingresos, cancelaciones, reembolsos llegan por su webhook)" />
      </Seccion>

      <Seccion titulo="Ganancia real">
        <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Ingresos: <span className="font-bold text-[var(--text-primary)]">Sin datos</span> (Hotmart no
            conectado)
          </p>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            Costo real de IA (últimos 30 días):{' '}
            <span className="font-bold text-[var(--text-primary)]">${costoIa30d.toFixed(4)}</span>
          </p>
          <p className="mt-3 text-xs text-[var(--text-tertiary)]">
            No se puede calcular "lo que te queda limpio" sin conectar Hotmart (ingresos), Resend (costo
            de email) y confirmar la tarifa de infra. En cuanto eso exista, esta sección va a mostrar
            "Facturaste $X y te quedaron $Y limpios" de verdad.
          </p>
        </div>
      </Seccion>

      <Seccion titulo="LTV, CAC y margen por canal">
        <NoInstrumentado falta="la columna de canal de origen (profiles.source) y el gasto de adquisición por canal" />
      </Seccion>
    </div>
  );
}
