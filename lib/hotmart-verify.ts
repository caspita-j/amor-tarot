// Verificación de autenticidad del webhook de Hotmart (18-VENTA-HOTMART.md).
// Camino principal de esa cuenta: comparar el hottok en TIEMPO CONSTANTE
// sobre HTTPS — Hotmart no firma el body con HMAC, el hottok compartido
// viajando por TLS es la única prueba de que la petición es suya.

import crypto from 'node:crypto';

function timingSafeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/**
 * Fail-secure a propósito, pero comprobado en cada llamada (no al importar el
 * módulo): Next.js evalúa los route handlers al buildear ("collecting page
 * data"), así que lanzar en el top-level del archivo tumbaba el build entero
 * cuando la variable todavía no existía en el entorno. Comprobarlo acá logra
 * lo mismo — sin el secreto, NINGÚN hottok pasa la verificación, nunca un
 * default de juguete — sin depender de que la variable ya exista al buildear.
 */
export function verifyHotmart(opts: { hottok?: string }): boolean {
  const HOTTOK = process.env.HOTMART_HOTTOK;
  if (!HOTTOK) {
    console.error('FALTA HOTMART_HOTTOK — el webhook no puede operar de forma segura');
    return false;
  }
  if (!opts.hottok) return false;
  return timingSafeEqualStr(opts.hottok, HOTTOK);
}
