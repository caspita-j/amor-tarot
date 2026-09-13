# Copy — Carrito abandonado (2 correos)

> **Estado: escrito, sin conectar.** Se dispara para quien llegó al checkout
> de Hotmart y no completó el pago. Depende de 2 piezas que hoy no existen:
> 1. El webhook/pixel de "checkout iniciado, no completado" de Hotmart (es
>    una función de la plataforma, se activa en su panel cuando exista la
>    cuenta).
> 2. Resend con dominio verificado.
>
> Doctrina: `docs/sistema/35-LANZAMIENTO.md`. Objeciones que este correo
> responde (de `FICHA-AVATAR.md`, objeciones #1 y #4): miedo a cobros
> ocultos, "es caro / no lo voy a usar".

## Regla de negocio

- Correo 1: unas horas después (mismo día). Correo 2: al día siguiente —
  después de eso, no se insiste más (mismo criterio anti-dark-pattern que
  win-back: 2 intentos, no una cadena infinita).
- Nunca usa urgencia falsa ("¡se acaba el descuento!") — no hay descuento
  que ofrecer, y no se inventa uno solo para este correo.
- Cada correo repite, sin sonar repetitivo, el dato que más tranquiliza al
  avatar: **3 días gratis, no se cobra nada hoy, cancelas cuando quieras**.

---

## Correo 1 — Mismo día

**Asunto (variante A):** Se te quedó algo a medias
**Asunto (variante B):** ¿Seguimos con tu duda, {{nombre}}?
**Preheader:** Tus 3 días gratis siguen esperando, sin que se te cobre hoy.

**Cuerpo:**

Hola {{nombre}},

Vimos que llegaste hasta el último paso y no alcanzaste a terminar. Sin
problema — tu lugar sigue ahí.

Un recordatorio rápido de cómo funciona: empiezas con 3 días gratis, no se
te cobra nada hoy, y puedes cancelar cuando quieras desde tu perfil, en un
clic.

[Terminar y sacar mis 3 cartas →]

El equipo de Amor & Tarot

---

## Correo 2 — Al día siguiente

**Asunto (variante A):** Última vez que te lo recordamos
**Asunto (variante B):** Tu duda sigue ahí dando vueltas, ¿o ya se resolvió?
**Preheader:** Si sigue rondándote, El Espejo de las 3 Cartas te espera.

**Cuerpo:**

Hola {{nombre}},

No queremos ser un correo más — esta es la última vez que te escribimos
por esto.

Si esa duda que te trajo hasta acá sigue dando vueltas, tus 3 días gratis
siguen disponibles, sin ningún cobro hoy.

[Sacar mis 3 cartas →]

Y si ya se resolvió sola, también nos alegra. Aquí seguimos si más
adelante aparece otra cosa.

El equipo de Amor & Tarot
