// Cron diario (vercel.json) — dispara los correos de win-back (cancelados,
// día 30/60/90) y dunning (cobro fallido, inmediato/+3/+7). Doctrina y copy
// en docs/sistema/58-RETENCION-DE-INGRESOS.md, docs/copy/winback.md y
// docs/copy/dunning.md.
//
// Diseño: en vez de comparar "¿es EXACTAMENTE el día 30?" (frágil — si el
// cron falla un día, se pierde la ventana para siempre), cada perfil guarda
// en qué ETAPA de la secuencia va (winback_stage/dunning_stage, 0-3) y el
// cron avanza a la siguiente etapa en cuanto se cumplió el plazo mínimo,
// sin importar cuántos días de más hayan pasado. Así un cron que se saltó
// un día se pone al día solo, nunca pierde a nadie.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enviarDunning, enviarWinback } from '@/lib/email';

export const runtime = 'nodejs';

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DIA_MS = 24 * 60 * 60 * 1000;
function diasDesde(fecha: string): number {
  return (Date.now() - new Date(fecha).getTime()) / DIA_MS;
}

export async function GET(req: NextRequest) {
  // Fail-secure: sin CRON_SECRET configurado, o sin que coincida, la ruta no
  // hace nada — nunca un cron público que cualquiera pueda disparar a mano
  // para gastar tu cuota de Resend.
  const secreto = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');
  if (!secreto || auth !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let winbackEnviados = 0;
  let dunningEnviados = 0;
  const errores: string[] = [];

  // ── WIN-BACK: cancelados con winback_stage < 3 ──
  const { data: cancelados } = await admin
    .from('profiles')
    .select('id, email, nombre, cancelled_at, winback_stage')
    .eq('status', 'cancelled')
    .lt('winback_stage', 3)
    .not('cancelled_at', 'is', null);

  for (const p of cancelados ?? []) {
    const dias = diasDesde(p.cancelled_at as string);
    const etapa = p.winback_stage as number;
    const [umbral, diaCorreo] = etapa === 0 ? [30, 30] : etapa === 1 ? [60, 60] : [90, 90];
    if (dias < umbral) continue;

    const resultado = await enviarWinback(p.email, p.nombre ?? '', diaCorreo as 30 | 60 | 90);
    if (!resultado.ok) {
      errores.push(`winback ${p.id} etapa ${etapa}: ${resultado.error}`);
      continue;
    }
    await admin.from('profiles').update({ winback_stage: etapa + 1 }).eq('id', p.id);
    winbackEnviados++;
  }

  // ── DUNNING: cobro fallido con dunning_stage < 3 ──
  const { data: atrasados } = await admin
    .from('profiles')
    .select('id, email, nombre, past_due_at, dunning_stage')
    .eq('status', 'past_due')
    .lt('dunning_stage', 3)
    .not('past_due_at', 'is', null);

  for (const p of atrasados ?? []) {
    const dias = diasDesde(p.past_due_at as string);
    const etapa = p.dunning_stage as number;
    const umbral = etapa === 0 ? 0 : etapa === 1 ? 3 : 7;
    if (dias < umbral) continue;

    const resultado = await enviarDunning(p.email, p.nombre ?? '', umbral as 0 | 3 | 7);
    if (!resultado.ok) {
      errores.push(`dunning ${p.id} etapa ${etapa}: ${resultado.error}`);
      continue;
    }
    await admin.from('profiles').update({ dunning_stage: etapa + 1 }).eq('id', p.id);
    dunningEnviados++;
  }

  return NextResponse.json({ ok: true, winbackEnviados, dunningEnviados, errores });
}
