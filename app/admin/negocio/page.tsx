// Negocio — ventas, conversión, ganancia real y LTV/CAC. Las 3 primeras YA
// tienen fuente real (Hotmart conectado 2026-09-17 + event_log agregado el
// mismo día para el embudo landing→onboarding→pago). LTV/CAC sigue sin dato
// propio — necesita la columna de canal de origen (profiles.source), que no
// existe todavía.

import { Briefcase } from 'lucide-react';
import { leerCostoIa, leerEmbudoConversion, leerResumenNegocio } from '@/lib/supabase/admin-datos';
import { Metrica, NoInstrumentado, Seccion, hace } from '@/components/admin/ui';

function porcentaje(parte: number, total: number): string {
  if (total <= 0) return '—';
  return `${Math.round((parte / total) * 100)}%`;
}

export default async function AdminNegocioPage() {
  const [costoIa30d, negocio, embudo] = await Promise.all([
    leerCostoIa(30).then((dias) => dias.reduce((acc, d) => acc + d.costo, 0)),
    leerResumenNegocio(),
    leerEmbudoConversion(30),
  ]);
  const checkoutClicks = embudo.checkoutClickMensual + embudo.checkoutClickAnual;

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <Briefcase size={20} color="var(--accent-2)" aria-hidden="true" />
        <h1 className="text-xl font-bold [font-family:var(--font-display)]">Negocio</h1>
      </div>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Ventas, prueba gratis y conversión con datos reales. LTV/CAC sigue esperando el canal de
        origen de cada usuario (no depende de Hotmart, falta aparte).
      </p>

      <Seccion titulo="Conversión (landing → onboarding → pago) — últimos 30 días">
        <div className="flex flex-col gap-1.5 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
          {[
            { label: 'Vieron la landing', valor: embudo.landingVisto, base: embudo.landingVisto },
            { label: 'Empezaron el onboarding', valor: embudo.onboardingIniciado, base: embudo.landingVisto },
            { label: 'Completaron el onboarding', valor: embudo.onboardingCompletado, base: embudo.onboardingIniciado },
            { label: 'Vieron el paywall', valor: embudo.paywallVisto, base: embudo.onboardingCompletado },
            { label: 'Tocaron "Empezar mis días gratis"', valor: checkoutClicks, base: embudo.paywallVisto },
          ].map((paso, i, arr) => (
            <div key={paso.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[var(--text-secondary)]">{paso.label}</span>
              <span className="shrink-0 font-bold text-[var(--text-primary)]">
                {paso.valor}
                {i > 0 && (
                  <span className="ml-1.5 font-normal text-[var(--text-tertiary)]">
                    ({porcentaje(paso.valor, arr[i - 1].valor)} del paso anterior)
                  </span>
                )}
              </span>
            </div>
          ))}
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">
            De cada 100 que ven la landing, {porcentaje(checkoutClicks, embudo.landingVisto || 1)} llegan a
            tocar el botón de pago.
          </p>
        </div>
      </Seccion>

      <Seccion titulo="Prueba gratis (trial)">
        {negocio ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <Metrica valor={String(negocio.enPrueba)} label="En prueba ahora" color="var(--accent)" />
            <Metrica valor={String(negocio.nuevosPagos30d)} label="Pasaron a pago (30 días)" color="var(--accent-2)" />
            <Metrica valor={String(negocio.vencidos)} label="Prueba vencida sin pagar" />
          </div>
        ) : (
          <NoInstrumentado falta="no se pudo leer el resumen de negocio (revisa que seas admin)" />
        )}
      </Seccion>

      <Seccion titulo="Ventas">
        {negocio ? (
          <>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <Metrica valor={String(negocio.pagando)} label="Pagando activo" color="var(--accent-2)" />
              <Metrica valor={String(negocio.cancelados)} label="Cancelados (con acceso hasta el fin)" />
              <Metrica valor={String(negocio.reembolsados)} label="Reembolsados" color="var(--danger)" />
              <Metrica valor={String(negocio.contracargos)} label="Contracargos" color="var(--danger)" />
            </div>
            <div className="mt-3 flex flex-col gap-1.5 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Pago atrasado (dunning): <span className="font-bold text-[var(--text-primary)]">{negocio.pagoAtrasado}</span>
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Avisos de Hotmart en las últimas 24h:{' '}
                <span className="font-bold text-[var(--text-primary)]">{negocio.webhooksUltimas24h}</span>
                {negocio.webhooksError24h > 0 && (
                  <span className="text-[var(--danger)]"> ({negocio.webhooksError24h} con error)</span>
                )}
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                Último aviso recibido: {hace(negocio.ultimoWebhookRecibido)}
                {!negocio.ultimoWebhookRecibido && ' — nunca llegó ninguno todavía'}
              </p>
            </div>
          </>
        ) : (
          <NoInstrumentado falta="no se pudo leer el resumen de negocio (revisa que seas admin)" />
        )}
      </Seccion>

      <Seccion titulo="Ganancia real">
        <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Usuarios pagando ahora mismo:{' '}
            <span className="font-bold text-[var(--text-primary)]">{negocio?.pagando ?? 0}</span>
          </p>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            Costo real de IA (últimos 30 días):{' '}
            <span className="font-bold text-[var(--text-primary)]">${costoIa30d.toFixed(4)}</span>
          </p>
          <p className="mt-3 text-xs text-[var(--text-tertiary)]">
            Todavía no se guarda QUÉ plan (Mensual o Anual) tiene cada quien, así que no se puede
            multiplicar por su precio para mostrar "facturaste $X" exacto — solo el conteo de personas.
            En cuanto se guarde el plan de cada suscripción, esta sección calcula el ingreso real.
          </p>
        </div>
      </Seccion>

      <Seccion titulo="LTV, CAC y margen por canal">
        <NoInstrumentado falta="la columna de canal de origen (profiles.source) y el gasto de adquisición por canal" />
      </Seccion>
    </div>
  );
}
