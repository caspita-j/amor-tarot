// Cliente de Supabase para SERVER COMPONENTS y Route Handlers. Lee/escribe las
// cookies de sesión del request actual — nunca usar el cliente de
// lib/supabase/client.ts en el servidor (perdería el contexto de cookies).

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // set() llamado desde un Server Component sin poder escribir cookies
            // (no hay response que las lleve) — el proxy (ver proxy.ts) ya se
            // encarga de refrescar la sesión en cada request, así que ignorar
            // acá es seguro.
          }
        },
      },
    }
  );
}
