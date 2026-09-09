// Operación — costo real de la IA, día por día (única fuente de "operación"
// que existe hoy; Sentry/errores todavía no está conectado).

import { Sparkles, TriangleAlert } from 'lucide-react';
import { leerCostoIa } from '@/lib/supabase/admin-datos';
import { Metrica, NoInstrumentado, Seccion } from '@/components/admin/ui';
import { GraficoBarras } from '@/components/admin/GraficoBarras';

export default async function AdminOperacionPage() {
  const costoIaDias = await leerCostoIa(30);

  const totalMes = costoIaDias.reduce((acc, d) => acc + d.costo, 0);
  const totalLlamadas = costoIaDias.reduce((acc, d) => acc + d.llamadas, 0);
  const promedioDiario = costoIaDias.length > 0 ? totalMes / costoIaDias.length : 0;
  const diaMasCaro = costoIaDias.reduce(
    (max, d) => (d.costo > (max?.costo ?? -1) ? d : max),
    null as (typeof costoIaDias)[number] | null
  );

  const datosGrafico = costoIaDias.map((d) => ({
    etiqueta: d.dia,
    valor: d.costo,
    valorFormateado: `$${d.costo.toFixed(4)}`,
    detalle: `${d.llamadas} ${d.llamadas === 1 ? 'llamada' : 'llamadas'}`,
  }));

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <Sparkles size={20} color="var(--accent)" aria-hidden="true" />
        <h1 className="text-xl font-bold [font-family:var(--font-display)]">Operación</h1>
      </div>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        El costo real que te cobra el proveedor de IA por cada lectura — la única cifra de "operación"
        que existe hoy.
      </p>

      <Seccion titulo="Costo de IA (últimos 30 días)">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Metrica valor={`$${totalMes.toFixed(4)}`} label="Total del período" color="var(--accent)" />
          <Metrica valor={`$${promedioDiario.toFixed(4)}`} label="Promedio por día" color="var(--accent)" />
          <Metrica valor={String(totalLlamadas)} label="Llamadas totales" color="var(--accent)" />
          <Metrica
            valor={diaMasCaro ? `$${diaMasCaro.costo.toFixed(4)}` : '—'}
            label="Día más caro"
            insight={diaMasCaro?.dia}
          />
        </div>
        <div className="mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
          <GraficoBarras datos={datosGrafico} color="var(--accent)" />
        </div>
      </Seccion>

      <Seccion titulo="Errores">
        <div className="flex items-start gap-2.5">
          <TriangleAlert size={16} color="var(--text-tertiary)" className="mt-3 shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <NoInstrumentado falta="Sentry u otro registro de errores — todavía no está conectado" />
          </div>
        </div>
      </Seccion>
    </div>
  );
}
