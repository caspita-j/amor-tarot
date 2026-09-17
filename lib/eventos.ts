'use client';

// Registro del embudo de conversión (landing → onboarding → pago) — analítica
// de producto de primera parte, sin PII: solo un id anónimo por navegador
// (localStorage, no cookie de terceros) hasta que la persona tenga cuenta.
// Escribe directo a `event_log` (RLS: insert abierto, lectura solo admin vía
// RPC) — no hace falta una ruta de API para esto.

import { createClient } from '@/lib/supabase/client';

export type EventoFunnel =
  | 'landing_visto'
  | 'onboarding_iniciado'
  | 'onboarding_completado'
  | 'paywall_visto'
  | 'checkout_click_mensual'
  | 'checkout_click_anual';

const CLAVE_ANON_ID = 'amor-tarot:anon-id';

function leerOCrearAnonId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    let id = localStorage.getItem(CLAVE_ANON_ID);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(CLAVE_ANON_ID, id);
    }
    return id;
  } catch {
    return null; // localStorage bloqueado (Safari privado): se registra sin anon_id
  }
}

const CLAVE_YA_REGISTRADOS = 'amor-tarot:eventos-registrados';

/** Una sola vez por evento y por sesión de navegador (sessionStorage, no
 * localStorage: cada visita nueva debe poder volver a contar). Sin esto, el
 * doble-render de desarrollo de React (o un usuario yendo y viniendo entre
 * pantallas) infla el embudo — probado en vivo 2026-09-17: cada evento
 * llegaba duplicado. */
function yaRegistradoEstaSesion(evento: EventoFunnel): boolean {
  try {
    const lista: string[] = JSON.parse(sessionStorage.getItem(CLAVE_YA_REGISTRADOS) ?? '[]');
    if (lista.includes(evento)) return true;
    sessionStorage.setItem(CLAVE_YA_REGISTRADOS, JSON.stringify([...lista, evento]));
    return false;
  } catch {
    return false; // sessionStorage bloqueado: se registra igual, sin dedupe.
  }
}

/** Dispara-y-olvida: un evento de analítica nunca debe romper ni frenar la
 * pantalla que lo llama (por eso no se espera el resultado ni se muestra error). */
export function registrarEvento(evento: EventoFunnel): void {
  try {
    if (yaRegistradoEstaSesion(evento)) return;
    const supabase = createClient();
    supabase.from('event_log').insert({ evento, anon_id: leerOCrearAnonId() }).then(() => {});
  } catch {
    // Nunca interrumpe la experiencia del usuario por un fallo de analítica.
  }
}
