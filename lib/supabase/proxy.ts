// Refresca la sesión de Supabase en cada request (Server Components no pueden
// escribir cookies — ver 26-AUTH-MODERNO.md). Sin esto, el usuario "se
// desloguea solo" cuando el access token expira y nadie lo refresca.

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { tieneAccesoCompleto } from '@/lib/membership-fsm';

// Rutas públicas del funnel (modelo onboarding-first): / → /onboarding →
// /paywall → /login → /app. Solo /app y sus rutas de datos exigen sesión.
const PUBLIC_PATHS = [
  '/',
  '/onboarding',
  '/paywall',
  '/login',
  '/auth',
  '/terminos',
  '/privacidad',
  '/reembolsos',
  '/aviso',
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  // getUser() valida el JWT contra Supabase y dispara el refresh si expiró —
  // nunca getSession() acá, no revalida.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const esPublica = PUBLIC_PATHS.some((p) => path === p || (p !== '/' && path.startsWith(p + '/')));
  // Las rutas de API no son "páginas": redirigirlas a /login rompe al cliente
  // que espera JSON/streaming. Cada ruta bajo /api hace su propio chequeo de
  // sesión y responde 401 en JSON (ver app/api/lectura/route.ts) — acá solo
  // se refresca la cookie, nunca se redirige.
  const esApi = path.startsWith('/api/');

  if (!user && !esPublica && !esApi) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Puerta de pago: `/app/*` es la app completa (Regla de Oro, hallazgo de la
  // auditoría de seguridad — antes CUALQUIER cuenta entraba gratis, pagara o
  // no). Se revisa acá, en el único lugar por el que pasa cada request, en
  // vez de duplicar el chequeo pantalla por pantalla.
  if (user && path.startsWith('/app')) {
    const { data: perfil } = await supabase
      .from('profiles')
      .select('status, access_until, grace_ends_at, role')
      .eq('id', user.id)
      .maybeSingle();
    // El admin (el dueño del negocio) siempre entra a probar la app por
    // dentro, pague o no — es la misma cuenta que ya usa /admin.
    const acceso =
      perfil?.role === 'admin' ||
      tieneAccesoCompleto((perfil?.status as any) ?? null, new Date(), perfil?.access_until, perfil?.grace_ends_at);
    if (!acceso) {
      const url = request.nextUrl.clone();
      url.pathname = '/paywall';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
