// Cliente de Supabase para COMPONENTES DE CLIENTE ('use client'). La
// publishable key es pública por diseño — la protección real la da RLS en
// cada tabla (ver 25-BASE-DE-DATOS.md), no el secreto de esta clave.

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
