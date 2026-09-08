// Proxy de Next.js 16 (reemplaza a "middleware", ver 26-AUTH-MODERNO.md) —
// corre en cada request para mantener viva la sesión de Supabase.

import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)'],
};
