// Webhook de Hotmart — el único lugar donde una compra real se convierte en
// acceso real dentro de la app (18-VENTA-HOTMART.md). Pipeline obligatorio:
// autenticidad -> frescura -> parse -> catálogo -> idempotencia -> ledger ->
// transición -> email -> 200. Cualquier atajo acá significa regalar Premium
// gratis o dejar a alguien que pagó sin acceso — no hay "casi bien".

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';
import { verifyHotmart } from '@/lib/hotmart-verify';
import { statusForEvent, PLAN_CHANGE_EVENT } from '@/lib/membership-fsm';

export const runtime = 'nodejs'; // necesitamos node:crypto y el raw body — no Edge

const SITE_URL = 'https://www.amorytarot.app';

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const REPLAY_WINDOW_MS = 5 * 60 * 1000;

async function log(event_id: string | null, type: string | null, result: string) {
  await admin.from('webhook_log').insert({ event_id, type, result });
}

export async function POST(req: NextRequest) {
  // 1. RAW body — nunca req.json() antes de verificar (si algún día Hotmart
  //    documenta una firma sobre el body, necesita los bytes exactos).
  const rawBody = await req.text();

  // 2. Autenticidad — hottok en tiempo constante, sobre HTTPS (Vercel ya lo fuerza).
  const hottok = req.headers.get('x-hotmart-hottok') ?? undefined;
  if (!verifyHotmart({ hottok })) {
    await log(null, null, 'unauthorized');
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // 3. Parsear SOLO después de verificar.
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }

  // 4. Frescura (anti-replay).
  const ts = payload.creation_date ?? payload.data?.purchase?.approved_date;
  if (ts && Date.now() - Number(ts) > REPLAY_WINDOW_MS) {
    return NextResponse.json({ error: 'stale' }, { status: 400 });
  }

  const event: string = payload.event;
  const eventId: string =
    payload.id ?? payload.event_id ?? payload.data?.purchase?.transaction ?? `${event}:${payload.data?.buyer?.email}:${ts ?? ''}`;
  // El nombre del comprador NO se usa para pisar `profiles.nombre`: ese campo
  // es del onboarding/Perfil de la app y ya tiene su propia protección
  // (ver sincronizarOnboardingSiHaceFalta) — mezclar las dos fuentes fue el
  // bug de "usuario que regresa" que se corrigió antes en esta misma sesión.
  const email: string | undefined = (payload.data?.buyer?.email ?? payload.email)?.toLowerCase();
  const subscriberCode: string | undefined = payload.data?.subscription?.subscriber?.code;
  // Fecha en la que termina el ciclo ya pagado (si Hotmart la manda) — para no
  // cortarle el acceso a quien canceló pero ya pagó el período actual.
  const accessUntilRaw = payload.data?.subscription?.date_next_charge;
  const accessUntil = accessUntilRaw ? new Date(Number(accessUntilRaw)).toISOString() : null;

  if (event === PLAN_CHANGE_EVENT) {
    // Cambio nativo mensual↔anual: hoy el esquema solo distingue free/pro
    // (no qué periodicidad), así que no hay nada que actualizar en el
    // acceso — se registra igual para tener el rastro en el log.
    await log(eventId, event, 'applied');
    return NextResponse.json({ received: true, ignored: 'switch_plan_sin_cambio_de_acceso' });
  }

  const newStatus = statusForEvent(event);
  if (!newStatus) {
    return NextResponse.json({ received: true, ignored: event });
  }
  if (!email) {
    await log(eventId, event, 'error');
    return NextResponse.json({ error: 'sin email en el payload' }, { status: 400 });
  }

  // 5. Resolver la cuenta: ¿ya existe (por correo) o hay que crearla?
  const { data: existente } = await admin.from('profiles').select('id').eq('email', email).maybeSingle();

  let userId = existente?.id as string | undefined;
  let esCuentaNueva = false;

  if (!userId) {
    const { data: creado, error: errCrear } = await admin.auth.admin.createUser({ email, email_confirm: true });
    if (errCrear || !creado?.user) {
      // No marcar el evento como procesado si esto falla: así Hotmart
      // reintenta y el cliente no queda "pagó y no entra" en silencio.
      console.error('webhook hotmart: no se pudo crear la cuenta', { code: (errCrear as any)?.code });
      await log(eventId, event, 'error');
      return NextResponse.json({ error: 'no se pudo crear la cuenta' }, { status: 500 });
    }
    userId = creado.user.id;
    esCuentaNueva = true;
  }

  const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex');

  // 6. Idempotencia + transición de estado, atómico en una sola RPC.
  const { data, error } = await admin.rpc('apply_hotmart_event', {
    p_event_id: eventId,
    p_event_type: event,
    p_payload_hash: payloadHash,
    p_user_id: userId,
    p_subscriber_code: subscriberCode ?? null,
    p_new_status: newStatus,
    p_access_until: accessUntil,
  });

  if (error) {
    console.error('webhook hotmart error', { event, code: error.code }); // nunca loguear el payload completo (PII)
    await log(eventId, event, 'error');
    return NextResponse.json({ error: 'processing failed' }, { status: 500 }); // 5xx → Hotmart reintenta
  }

  const result: string = data?.status ?? 'applied';
  await log(eventId, event, result === 'not_found' ? 'error' : result);

  // 7. Bienvenida SOLO a cuentas nuevas con acceso recién concedido — reutiliza
  //    el mismo signInWithOtp de /login, que ya manda el correo con marca
  //    propia vía Resend (Supabase Auth ya está configurado con ese SMTP).
  if (result === 'applied' && esCuentaNueva && (newStatus === 'trialing' || newStatus === 'active')) {
    await admin.auth.signInWithOtp({ email, options: { emailRedirectTo: `${SITE_URL}/auth/callback` } });
  }

  // 8. Siempre 200 cuando la decisión ya se tomó (incluido duplicate/illegal): Hotmart deja de reintentar.
  return NextResponse.json({ received: true, result });
}
