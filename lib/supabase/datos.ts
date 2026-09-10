'use client';

// Capa de datos REAL de la app interna (Etapa 2 de Supabase — ver ESTADO.md).
// Reemplaza el sessionStorage de lib/estado-app.ts para perfil/racha/lecturas.
// La foto de PERFIL sigue en sessionStorage por ahora (Etapa 3, Supabase
// Storage, a propósito no incluida acá). Las fotos de una LECTURA sí se
// guardan ya en la base de datos (columna lecturas.fotos, como texto/base64
// — con límite de tamaño y cantidad puesto a nivel de base de datos), a la
// espera de moverse a Storage más adelante.

import { createClient } from '@/lib/supabase/client';
import type { Categoria } from '@/lib/categorias';
import type { Estado } from '@/lib/animo';

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

/** Guarda (o reemplaza) el estado de ánimo del día indicado — un toque, un
 * registro por día (upsert por la clave primaria user_id+fecha). */
export async function guardarEstadoAnimo(fecha: string, estado: Estado): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('estados_animo').upsert({ user_id: user.id, fecha, estado });
}

/** Estados de ánimo entre dos fechas (incluidas), como mapa fecha→estado —
 * pensado para pintar la tira "Esta semana" con datos reales. */
export async function leerEstadosAnimoRango(desde: string, hasta: string): Promise<Record<string, Estado>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const { data, error } = await supabase
    .from('estados_animo')
    .select('fecha, estado')
    .eq('user_id', user.id)
    .gte('fecha', desde)
    .lte('fecha', hasta);
  if (error || !data) return {};

  const mapa: Record<string, Estado> = {};
  for (const fila of data) mapa[fila.fecha as string] = fila.estado as Estado;
  return mapa;
}

export type LecturaGuardada = {
  id: string;
  fecha: string;
  situacion: string;
  cartas: [string, string, string];
  resumen: string;
  fotos?: string[];
  categoria: Categoria;
};

export async function guardarLecturaReal(lectura: {
  situacion: string;
  cartas: [string, string, string];
  resumen: string;
  fotos?: string[];
  categoria: Categoria;
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
    categoria: lectura.categoria,
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
    .select('id, situacion, cartas, resumen, fotos, created_at, categoria')
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
    categoria: (fila.categoria ?? 'pareja') as Categoria,
  }));
}
