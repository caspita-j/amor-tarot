// Correos transaccionales de retención (18-VENTA-HOTMART.md + copy en
// docs/copy/winback.md y docs/copy/dunning.md) — se mandan SOLO desde el
// cron de retención (app/api/cron/retencion/route.ts), nunca desde el
// cliente. El magic link de login sigue siendo el de Supabase/Resend SMTP;
// esto es aparte, para correos con diseño propio que Supabase no puede
// mandar.

import { Resend } from 'resend';

const SITE_URL = 'https://www.amorytarot.app';
const FROM = 'Amor & Tarot <hola@amorytarot.app>';
// Portal REAL del comprador en Hotmart para gestionar su método de pago
// (fuente: help.hotmart.com/es/article/115000393187, 2026-09-17) — nunca
// inventar esta URL, un link roto en un correo de cobro fallido es peor que
// no mandar el correo.
const HOTMART_PORTAL_COMPRADOR = 'https://consumer.hotmart.com/purchase';

function resend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null; // fail-secure: sin clave, no se manda nada (nunca un default)
  return new Resend(apiKey);
}

function envoltorio(tituloInterno: string, cuerpoHtml: string, ctaHref: string, ctaLabel: string): string {
  return `
  <div style="background-color:#0e0b17;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:480px;margin:0 auto;background-color:#1a1526;border-radius:20px;padding:32px 28px;">
      <img src="${SITE_URL}/marca/emblema.png" alt="Amor & Tarot" width="40" height="40" style="display:block;margin-bottom:16px;" />
      <!-- ${tituloInterno} -->
      <div style="color:#f4ecd8;font-size:15px;line-height:1.6;">
        ${cuerpoHtml}
      </div>
      <a href="${ctaHref}"
         style="display:inline-block;margin-top:24px;padding:14px 28px;background-color:#d8b25f;color:#1a1526;
                border-radius:999px;text-decoration:none;font-weight:700;font-size:15px;">
        ${ctaLabel}
      </a>
    </div>
  </div>`;
}

function parrafos(lineas: string[]): string {
  return lineas.map((l) => `<p style="margin:0 0 16px;">${l}</p>`).join('\n');
}

type ResultadoEnvio = { ok: boolean; error?: string };

// ── WIN-BACK (docs/copy/winback.md) ──────────────────────────────────────
export async function enviarWinback(email: string, nombre: string, dia: 30 | 60 | 90): Promise<ResultadoEnvio> {
  const client = resend();
  if (!client) return { ok: false, error: 'FALTA RESEND_API_KEY' };
  const n = nombre.trim() || 'de nuevo';

  const variantes = {
    30: {
      asunto: `¿Cómo va todo, ${n}?`,
      cta: 'Volver a Amor & Tarot →',
      cuerpo: parrafos([
        `Hola ${n},`,
        'Hace un mes que no nos vemos por acá, y quería saber cómo has estado.',
        'Amor & Tarot sigue siendo lo mismo: un espacio para poner en palabras lo que te da vueltas en la cabeza y salir con algo más claro que cuando entraste — El Espejo de las 3 Cartas sigue ahí, cuando lo necesites.',
        'Si quieres volver a probarlo, te regalamos otros 3 días gratis. Sin compromiso, sin que tengas que explicar nada.',
      ]),
    },
    60: {
      asunto: '¿Otra duda dando vueltas?',
      cta: 'Sacar mis 3 cartas →',
      cuerpo: parrafos([
        `Hola ${n},`,
        'Sé que la razón por la que entraste la primera vez puede que ya se haya resuelto, de una forma o de otra. Eso pasa — las dudas de pareja no duran para siempre, cambian o se resuelven solas.',
        'Pero seguro apareció otra cosa: algo en el trabajo, una decisión que no sabes cómo tomar, algo con tu familia. El Espejo de las 3 Cartas ya no es solo para pareja — sirve para cualquier duda que te esté dando vueltas hoy.',
        'Si quieres probarlo con lo que sea que tengas en la cabeza ahora, te regalamos 3 días gratis, otra vez.',
      ]),
    },
    90: {
      asunto: 'Última vez que te escribimos por esto',
      cta: 'Volver cuando quieras →',
      cuerpo: parrafos([
        `Hola ${n},`,
        'Esta es la última vez que te escribimos para invitarte a volver — no porque no nos importes, sino porque no queremos ser un correo más que te llega sin que lo pidas.',
        'La invitación sigue en pie, sin fecha de vencimiento: si en algún momento tienes una duda que quieras poner en claro, ahí va a estar Amor & Tarot, con tus 3 días gratis esperando.',
        'Gracias por haber sido parte de esto.',
      ]),
    },
  } as const;

  const v = variantes[dia];
  const { error } = await client.emails.send({
    from: FROM,
    to: email,
    subject: v.asunto,
    html: envoltorio(`Win-back día ${dia}`, v.cuerpo, SITE_URL, v.cta),
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function enviarDunning(email: string, nombre: string, etapa: 0 | 3 | 7): Promise<ResultadoEnvio> {
  const client = resend();
  if (!client) return { ok: false, error: 'FALTA RESEND_API_KEY' };
  const n = nombre.trim() || 'de nuevo';
  const cta = 'Actualizar mi método de pago →';

  const variantes = {
    0: {
      asunto: `No pudimos procesar tu pago, ${n}`,
      cuerpo: parrafos([
        `Hola ${n},`,
        'Intentamos cobrar tu suscripción de Amor & Tarot y no se pudo procesar — suele pasar por una tarjeta vencida o fondos insuficientes, nada grave.',
        'Tu acceso sigue activo por ahora. Para no perderlo, actualiza tu método de pago cuando puedas:',
      ]),
    },
    3: {
      asunto: 'Un recordatorio sobre tu pago pendiente',
      cuerpo: parrafos([
        `Hola ${n},`,
        'Todavía no logramos procesar tu cobro. Tu acceso sigue funcionando por ahora, pero para que no se interrumpa, actualiza tu método de pago:',
      ]),
    },
    7: {
      asunto: 'Último aviso antes de pausar tu cuenta',
      cuerpo: parrafos([
        `Hola ${n},`,
        'Después de varios intentos, no pudimos cobrar tu suscripción. Si no actualizas tu método de pago, tu acceso a Amor & Tarot se pausa hoy.',
        'Nada de lo que guardaste se pierde — en cuanto se resuelva el pago, tu cuenta vuelve a funcionar exactamente como la dejaste.',
      ]),
    },
  } as const;

  const v = variantes[etapa];
  const { error } = await client.emails.send({
    from: FROM,
    to: email,
    subject: v.asunto,
    html: envoltorio(`Dunning día ${etapa}`, v.cuerpo, HOTMART_PORTAL_COMPRADOR, cta),
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}
