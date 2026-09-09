// Capa de datos del panel de administración — SOLO para Server Components y
// Route Handlers (usa el cliente de servidor, nunca el de navegador). Cada
// función llama a un RPC que verifica es_admin() DENTRO de la base de datos
// — defensa en profundidad real: aunque alguien lograra renderizar la
// pantalla, la base de datos igual le niega los datos si no es admin.

import { createClient } from '@/lib/supabase/server';

export async function esAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase.rpc('es_admin');
  if (error) return false;
  return data === true;
}

export type SaludDatos = {
  totalUsuarios: number;
  totalPerfiles: number;
  totalLecturas: number;
  totalLlamadasIa: number;
  ultimoRegistroUsuario: string | null;
  ultimaLectura: string | null;
  ultimaLlamadaIa: string | null;
};

export async function leerSaludDatos(): Promise<SaludDatos | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_salud_datos').single();
  if (error || !data) return null;
  const fila = data as {
    total_usuarios: number;
    total_perfiles: number;
    total_lecturas: number;
    total_llamadas_ia: number;
    ultimo_registro_usuario: string | null;
    ultima_lectura: string | null;
    ultima_llamada_ia: string | null;
  };
  return {
    totalUsuarios: fila.total_usuarios,
    totalPerfiles: fila.total_perfiles,
    totalLecturas: fila.total_lecturas,
    totalLlamadasIa: fila.total_llamadas_ia,
    ultimoRegistroUsuario: fila.ultimo_registro_usuario,
    ultimaLectura: fila.ultima_lectura,
    ultimaLlamadaIa: fila.ultima_llamada_ia,
  };
}

export type ResumenUsuarios = {
  totalUsuarios: number;
  usuariosRachaActivaHoy: number;
  usuariosNuevos7d: number;
  usuariosNuevos30d: number;
};

export async function leerResumenUsuarios(): Promise<ResumenUsuarios | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_resumen_usuarios').single();
  if (error || !data) return null;
  const fila = data as {
    total_usuarios: number;
    usuarios_racha_activa_hoy: number;
    usuarios_nuevos_7d: number;
    usuarios_nuevos_30d: number;
  };
  return {
    totalUsuarios: fila.total_usuarios,
    usuariosRachaActivaHoy: fila.usuarios_racha_activa_hoy,
    usuariosNuevos7d: fila.usuarios_nuevos_7d,
    usuariosNuevos30d: fila.usuarios_nuevos_30d,
  };
}

export type CostoIaPorDia = { dia: string; costo: number; llamadas: number };

export async function leerCostoIa(dias = 30): Promise<CostoIaPorDia[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_costo_ia', { dias });
  if (error || !data) return [];
  return (data as { dia: string; costo: number; llamadas: number }[]).map((f) => ({
    dia: f.dia,
    costo: Number(f.costo),
    llamadas: f.llamadas,
  }));
}

export type UsuarioAdmin = {
  id: string;
  email: string;
  creado: string;
  rachaDias: number;
  rachaUltimaFecha: string | null;
  totalLecturas: number;
};

export async function leerUsuarios(): Promise<UsuarioAdmin[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_listar_usuarios');
  if (error || !data) return [];
  return (
    data as {
      id: string;
      email: string;
      creado: string;
      racha_dias: number;
      racha_ultima_fecha: string | null;
      total_lecturas: number;
    }[]
  ).map((f) => ({
    id: f.id,
    email: f.email,
    creado: f.creado,
    rachaDias: f.racha_dias,
    rachaUltimaFecha: f.racha_ultima_fecha,
    totalLecturas: f.total_lecturas,
  }));
}
