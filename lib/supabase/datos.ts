'use client';

// Capa de datos REAL de la app interna (Etapa 2 de Supabase — ver ESTADO.md).
// Reemplaza el sessionStorage de lib/estado-app.ts para perfil/racha/lecturas.
// Las fotos (perfil y de lecturas) siguen en sessionStorage por ahora — eso
// es la Etapa 3 (Supabase Storage), a propósito no incluida acá.

import { createClient } from '@/lib/supabase/client';

export type Perfil = {
  nombre: string | null;
  signo: string | null;
  otraPersonaNombre: string | null;
  otraPersonaSigno: string | null;
  rachaDias: number;
  rachaUltimaFecha: string | null; // 'YYYY-MM-DD' o null
};

const PERFIL_VACIO: Perfil = {
  nombre: null,
  signo: null,
  otraPersonaNombre: null,
  otraPersonaSigno: null,
  rachaDias: 0,
  rachaUltimaFecha: null,
};

export async function leerPerfil(): Promise<Perfil> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return PERFIL_VACIO;

  const { data, error } = await supabase
    .from('profiles')
    .select('nombre, signo, otra_persona_nombre, otra_persona_signo, racha_dias, racha_ultima_fecha')
    .eq('id', user.id)
    .maybeSingle();
  if (error || !data) return PERFIL_VACIO;

  return {
    nombre: data.nombre,
    signo: data.signo,
    otraPersonaNombre: data.otra_persona_nombre,
    otraPersonaSigno: data.otra_persona_signo,
    rachaDias: data.racha_dias,
    rachaUltimaFecha: data.racha_ultima_fecha,
  };
}

/** Copia las respuestas del onboarding (guardadas en sessionStorage ANTES de
 * tener cuenta) a la fila real de `profiles` — solo si el perfil todavía no
 * tiene nombre, para no pisar cambios que la persona ya haya hecho a mano en
 * Perfil. Se llama una vez, la primera vez que hay sesión real. */
export async function sincronizarOnboardingSiHaceFalta(datos: {
  nombre?: string;
  signo?: string;
  otraPersonaNombre?: string;
  otraPersonaSigno?: string;
}): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: actual } = await supabase.from('profiles').select('nombre').eq('id', user.id).maybeSingle();
  if (actual?.nombre) return;

  await supabase.from('profiles').upsert({
    id: user.id,
    nombre: datos.nombre?.trim() || null,
    signo: datos.signo || null,
    otra_persona_nombre: datos.otraPersonaNombre?.trim() || null,
    otra_persona_signo: datos.otraPersonaSigno || null,
  });
}

export async function actualizarPerfil(cambios: { nombre?: string; signo?: string }): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const cuerpo: Record<string, string> = {};
  if (cambios.nombre !== undefined) cuerpo.nombre = cambios.nombre;
  if (cambios.signo !== undefined) cuerpo.signo = cambios.signo;
  if (Object.keys(cuerpo).length === 0) return;

  await supabase.from('profiles').update(cuerpo).eq('id', user.id);
}

/** Registra el día de hoy de forma atómica en el servidor (RPC
 * `registrar_dia`) — evita doble conteo por doble tap o pestañas paralelas. */
export async function registrarDia(): Promise<{ dias: number; ultimaFecha: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('registrar_dia');
  if (error || !data || data.length === 0) return { dias: 0, ultimaFecha: null };
  const fila = data[0] as { dias: number; ultima_fecha: string | null };
  return { dias: fila.dias, ultimaFecha: fila.ultima_fecha };
}

export type LecturaGuardada = {
  id: string;
  fecha: string;
  situacion: string;
  cartas: [string, string, string];
  resumen: string;
  fotos?: string[];
};

export async function guardarLecturaReal(lectura: {
  situacion: string;
  cartas: [string, string, string];
  resumen: string;
  fotos?: string[];
}): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('lecturas').insert({
    user_id: user.id,
    situacion: lectura.situacion,
    cartas: lectura.cartas,
    resumen: lectura.resumen,
    fotos: lectura.fotos ?? null,
  });
}

export async function leerLecturasReales(): Promise<LecturaGuardada[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('lecturas')
    .select('id, situacion, cartas, resumen, fotos, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error || !data) return [];

  return data.map((fila) => ({
    id: fila.id,
    fecha: fila.created_at,
    situacion: fila.situacion,
    cartas: fila.cartas as [string, string, string],
    resumen: fila.resumen,
    fotos: fila.fotos ?? undefined,
  }));
}
