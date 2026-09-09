// Eliminar la propia cuenta (self-service) — el usuario solo puede borrar SU
// PROPIA cuenta, nunca la de otra persona: no recibe ningún id por parámetro,
// solo usa el id de la sesión ya verificada. Al borrar de auth.users, las
// claves foráneas "on delete cascade" de profiles/lecturas/ai_calls hacen que
// todo lo demás se elimine junto, sin pasos manuales.

import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'no_autenticado' }, { status: 401 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[api/cuenta/eliminar] Falta SUPABASE_SERVICE_ROLE_KEY en el servidor');
    return Response.json(
      { error: 'servidor_no_configurado', mensaje: 'Esta función todavía no está configurada del lado del servidor.' },
      { status: 500 }
    );
  }

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return Response.json(
      { error: 'error_eliminando_cuenta', mensaje: 'No pudimos eliminar tu cuenta. Intenta de nuevo.' },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
