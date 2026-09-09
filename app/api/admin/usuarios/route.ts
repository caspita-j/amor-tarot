// Crear un usuario a mano (admin-only) — para cuando el correo automático
// no le llega a alguien. Usa la Admin API de Supabase (requiere la clave
// service_role, que vive SOLO acá, nunca en el frontend) para: 1) crear la
// cuenta ya confirmada (sin depender del envío de correo), 2) generar un
// enlace de acceso que el dueño puede copiar y mandar por cualquier canal
// (WhatsApp, otro correo, etc.) — así el envío automático deja de ser el
// único camino para entrar.
//
// Seguridad: se verifica sesión + rol admin EN EL SERVIDOR antes de tocar
// nada — igual que el resto de los endpoints de esta app (ver
// app/api/lectura/route.ts). El cliente con service_role se crea DESPUÉS de
// esa verificación, nunca antes.

import { createClient as createServiceClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const CuerpoSchema = z.object({
  nombre: z.string().trim().max(80).optional().default(''),
  email: z.string().trim().email().max(255),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'no_autenticado' }, { status: 401 });
  }

  const { data: esAdmin, error: errorAdmin } = await supabase.rpc('es_admin');
  if (errorAdmin || esAdmin !== true) {
    return Response.json({ error: 'no_autorizado' }, { status: 403 });
  }

  let cuerpo: z.infer<typeof CuerpoSchema>;
  try {
    cuerpo = CuerpoSchema.parse(await req.json());
  } catch {
    return Response.json({ error: 'datos_invalidos', mensaje: 'Revisa el correo ingresado.' }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[api/admin/usuarios] Falta SUPABASE_SERVICE_ROLE_KEY en el servidor');
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

  const { data: creado, error: errorCrear } = await admin.auth.admin.createUser({
    email: cuerpo.email,
    email_confirm: true,
    user_metadata: cuerpo.nombre ? { nombre: cuerpo.nombre } : undefined,
  });

  if (errorCrear || !creado.user) {
    const yaExiste = errorCrear?.message?.toLowerCase().includes('already');
    return Response.json(
      {
        error: 'error_creando_usuario',
        mensaje: yaExiste
          ? 'Ya existe una cuenta con ese correo.'
          : 'No se pudo crear el usuario. Intenta de nuevo.',
      },
      { status: yaExiste ? 409 : 502 }
    );
  }

  // redirectTo tiene que apuntar a /auth/callback (la ruta que intercambia el
  // código por una sesión real) — sin esto, Supabase manda a la persona a la
  // página principal con un `?code=` que nadie procesa, y nunca queda con
  // sesión iniciada de verdad (bug real encontrado al probar el enlace).
  const origen = new URL(req.url).origin;
  const { data: enlace, error: errorEnlace } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: cuerpo.email,
    options: { redirectTo: `${origen}/auth/callback` },
  });

  if (errorEnlace || !enlace?.properties?.action_link) {
    // El usuario ya quedó creado — igual avisamos que el enlace falló, para
    // que el dueño sepa que puede pedirle a la persona que use "Enviarme el
    // enlace mágico" normal desde /login.
    return Response.json(
      {
        error: 'enlace_no_generado',
        mensaje: 'El usuario se creó, pero no se pudo generar el enlace de acceso. Puede entrar normalmente desde /login.',
      },
      { status: 502 }
    );
  }

  return Response.json({ enlace: enlace.properties.action_link });
}
