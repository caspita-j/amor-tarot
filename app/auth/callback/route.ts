// Adonde llega el ENLACE del correo de magic link (no el código de 6 dígitos,
// ese se verifica directo en /login). Intercambia el `code` de la URL por una
// sesión real y cookies httpOnly — ver 26-AUTH-MODERNO.md.

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = '/app';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Enlace inválido, expirado o ya usado: de vuelta al login con un aviso.
  return NextResponse.redirect(`${origin}/login?error=enlace_invalido`);
}
