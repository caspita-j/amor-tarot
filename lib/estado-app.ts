// Helpers de continuidad mock para la app interna (Sesión 5). Todo vive en
// sessionStorage porque no hay cuenta real todavía (Supabase llega en la
// Sesión 6) — mismo patrón ya usado por onboarding→paywall→login.

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

export type Racha = { dias: number; ultimaFecha: string | null };

const CLAVE_RACHA = 'amor-tarot:racha';

export function leerRacha(): Racha {
  if (typeof window === 'undefined') return { dias: 0, ultimaFecha: null };
  try {
    const guardado = sessionStorage.getItem(CLAVE_RACHA);
    return guardado ? (JSON.parse(guardado) as Racha) : { dias: 0, ultimaFecha: null };
  } catch {
    return { dias: 0, ultimaFecha: null };
  }
}

/** Marca el día de hoy como registrado. Si ya estaba registrado hoy, no hace
 * nada (evita doble conteo). Devuelve la racha resultante. */
export function registrarHoy(hoyISO: string): Racha {
  const actual = leerRacha();
  if (actual.ultimaFecha === hoyISO) return actual;
  const nueva: Racha = { dias: actual.dias + 1, ultimaFecha: hoyISO };
  try {
    sessionStorage.setItem(CLAVE_RACHA, JSON.stringify(nueva));
  } catch {
    // sessionStorage lleno o bloqueado (Safari privado): la racha no persiste
    // al recargar, pero la sesión actual sigue mostrando el registro de hoy.
  }
  return nueva;
}

export type Lectura = {
  id: string;
  fecha: string; // ISO
  situacion: string;
  cartas: [string, string, string]; // Tú / La Otra Persona / La Dinámica
  resumen: string;
  /** Data URLs ya comprimidas (comprimirProporcional en lib/imagen.ts) — foto
   * de la otra persona o captura de una conversación, para tener todo junto.
   * La lectura NO las analiza (no hay IA de visión todavía), son solo del
   * usuario para su propio contexto. */
  fotos?: string[];
};

const CLAVE_LECTURAS = 'amor-tarot:lecturas';

export function leerLecturas(): Lectura[] {
  if (typeof window === 'undefined') return [];
  try {
    const guardado = sessionStorage.getItem(CLAVE_LECTURAS);
    return guardado ? (JSON.parse(guardado) as Lectura[]) : [];
  } catch {
    return [];
  }
}

export function guardarLectura(lectura: Lectura): void {
  const actuales = leerLecturas();
  sessionStorage.setItem(CLAVE_LECTURAS, JSON.stringify([lectura, ...actuales]));
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
