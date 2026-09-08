// Helpers de continuidad para la app interna. `RespuestasOnboarding` sigue en
// sessionStorage porque se completa ANTES de tener cuenta (onboarding→
// paywall→login) — se sincroniza a Supabase una vez que hay sesión real (ver
// lib/supabase/datos.ts → sincronizarOnboardingSiHaceFalta). La foto de
// perfil también sigue acá por ahora: eso es la Etapa 3 (Supabase Storage),
// todavía sin empezar. Racha y lecturas YA SON reales — viven en Supabase
// (lib/supabase/datos.ts), no acá.

export type RespuestasOnboarding = {
  situacion?: string;
  dolor?: string;
  nombre?: string;
  signo?: string;
  otraPersonaNombre?: string;
  otraPersonaSigno?: string;
  momento?: string;
  detalle?: string;
};

export function leerOnboarding(): RespuestasOnboarding {
  if (typeof window === 'undefined') return {};
  try {
    const guardado = sessionStorage.getItem('amor-tarot:onboarding');
    return guardado ? (JSON.parse(guardado) as RespuestasOnboarding) : {};
  } catch {
    return {};
  }
}

const CLAVE_FOTO_PERFIL = 'amor-tarot:foto-perfil';

/** Data URL (JPEG, ya recortada/comprimida en el cliente) o null si no subió ninguna. */
export function leerFotoPerfil(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(CLAVE_FOTO_PERFIL);
  } catch {
    return null;
  }
}

export function guardarFotoPerfil(dataUrl: string): void {
  try {
    sessionStorage.setItem(CLAVE_FOTO_PERFIL, dataUrl);
  } catch {
    // sessionStorage lleno o bloqueado (Safari privado): la foto no persiste,
    // pero la sesión actual sigue funcionando con lo que ya está en memoria.
  }
}
