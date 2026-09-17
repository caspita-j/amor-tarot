// Máquina de estados de la suscripción (18-VENTA-HOTMART.md). Un evento viejo
// reentregado por Hotmart nunca debe "resucitar" un reembolso/contracargo —
// por eso el acceso se decide con esta función, no con un if suelto en cada
// pantalla.

export type EstadoSuscripcion =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired'
  | 'refunded'
  | 'chargeback';

// ⚠️ PLACEHOLDER — verificar contra el panel de Hotmart y una compra sandbox
// real antes de confiar en la métrica trial→pago (procedimiento de 5 pasos
// en 18-VENTA-HOTMART.md, sección "OPERACIONES DE SUSCRIPCIÓN"). Es posible
// que el inicio de prueba llegue como PURCHASE_APPROVED con valor 0 en vez de
// un evento propio — si es así, ajustar este mapa a la realidad del payload.
const TRIAL_START_EVENT = 'SUBSCRIPTION_TRIAL_START'; // (verificar)

export const EVENT_TO_STATUS: Record<string, EstadoSuscripcion> = {
  [TRIAL_START_EVENT]: 'trialing',
  PURCHASE_APPROVED: 'active',
  PURCHASE_COMPLETE: 'active',
  PURCHASE_DELAYED: 'past_due',
  SUBSCRIPTION_CANCELLATION: 'cancelled',
  PURCHASE_EXPIRED: 'expired',
  PURCHASE_REFUNDED: 'refunded',
  PURCHASE_CHARGEBACK: 'chargeback',
};

// SWITCH_PLAN (cambio nativo mensual↔anual) no transiciona de estado — se
// maneja aparte en el handler, actualizando el plan sin tocar el status.
export const PLAN_CHANGE_EVENT = 'SWITCH_PLAN';

const TERMINAL_NEGATIVE: EstadoSuscripcion[] = ['refunded', 'chargeback'];
const ACCESO_COMPLETO: EstadoSuscripcion[] = ['trialing', 'active'];

export function statusForEvent(event: string): EstadoSuscripcion | null {
  return EVENT_TO_STATUS[event] ?? null;
}

/** ¿Es legal pasar de `from` a `to`? Bloquea reactivaciones ilegales por eventos viejos. */
export function canTransition(from: EstadoSuscripcion | null, to: EstadoSuscripcion): boolean {
  if (from === null) return true;
  if (TERMINAL_NEGATIVE.includes(from) && (to === 'active' || to === 'trialing')) return false;
  return true;
}

/** Misma lógica de acceso que usa la base de datos (RPC) y el proxy — vive acá
 * también porque el proxy (Edge) y la UI la necesitan sin ir a Postgres. */
export function tieneAccesoCompleto(
  status: EstadoSuscripcion | null | undefined,
  ahora: Date,
  accessUntil?: string | Date | null,
  graceEndsAt?: string | Date | null,
): boolean {
  if (!status) return false;
  if (ACCESO_COMPLETO.includes(status)) return true;
  if (status === 'cancelled') return !!accessUntil && ahora < new Date(accessUntil);
  if (status === 'past_due') return !!graceEndsAt && ahora < new Date(graceEndsAt);
  return false;
}
