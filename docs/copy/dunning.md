# Copy — Dunning (cobro fallido, 3 correos)

> **Estado: escrito, sin conectar.** Se dispara cuando Hotmart avisa que un
> cobro recurrente falló (tarjeta vencida, fondos insuficientes, etc.).
> Depende de: webhook de Hotmart (evento de cobro fallido) + Resend.
> Doctrina: `docs/sistema/58-RETENCION-DE-INGRESOS.md`.

## Regla de negocio

- 3 correos: inmediato, +3 días, +7 días (Hotmart suele reintentar el cobro
  automáticamente en ese rango — estos correos avisan y acompañan, no
  reemplazan sus reintentos).
- El 3er correo avisa CLARAMENTE que el acceso se pausa si no se resuelve —
  sin esto sería deshonesto (la persona debe saber qué va a pasar).
- Nunca usa un tono de reclamo o culpa ("no pagaste") — un cobro fallido casi
  siempre es un problema técnico de la tarjeta, no una decisión de la
  persona. Tono: informativo y de ayuda, no de cobranza agresiva.
- Un solo CTA en los 3: actualizar el método de pago (enlace directo al
  panel de Hotmart donde se gestiona eso).

---

## Correo 1 — Inmediato

**Asunto (variante A):** Hubo un problema con tu último cobro
**Asunto (variante B):** No pudimos procesar tu pago, {{nombre}}
**Preheader:** Pasa seguido con tarjetas vencidas — se resuelve en 1 minuto.

**Cuerpo:**

Hola {{nombre}},

Intentamos cobrar tu suscripción de Amor & Tarot y no se pudo procesar —
suele pasar por una tarjeta vencida o fondos insuficientes, nada grave.

Tu acceso sigue activo por ahora. Para no perderlo, actualiza tu método de
pago cuando puedas:

[Actualizar mi método de pago →]

El equipo de Amor & Tarot

---

## Correo 2 — Día +3

**Asunto (variante A):** Seguimos sin poder cobrar tu suscripción
**Asunto (variante B):** Un recordatorio sobre tu pago pendiente
**Preheader:** Tu acceso sigue activo — actualízalo antes de que se pause.

**Cuerpo:**

Hola {{nombre}},

Todavía no logramos procesar tu cobro. Tu acceso sigue funcionando por
ahora, pero para que no se interrumpa, actualiza tu método de pago:

[Actualizar mi método de pago →]

Si ya lo actualizaste y este correo te llegó igual, puedes ignorarlo — a
veces se cruzan por unas horas.

El equipo de Amor & Tarot

---

## Correo 3 — Día +7 (aviso final)

**Asunto (variante A):** Tu acceso se pausa si no actualizas tu pago
**Asunto (variante B):** Último aviso antes de pausar tu cuenta
**Preheader:** Un minuto para actualizar tu tarjeta y seguir sin interrupción.

**Cuerpo:**

Hola {{nombre}},

Después de varios intentos, no pudimos cobrar tu suscripción. Si no
actualizas tu método de pago, tu acceso a Amor & Tarot se pausa hoy.

[Actualizar mi método de pago →]

Nada de lo que guardaste se pierde — en cuanto se resuelva el pago, tu
cuenta vuelve a funcionar exactamente como la dejaste.

El equipo de Amor & Tarot
