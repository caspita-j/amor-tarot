# Copy — Secuencia de win-back (días 30 / 60 / 90)

> **Estado: LISTO PARA CONECTAR, sin automatizar todavía.** Esta secuencia sigue
> la doctrina de `docs/sistema/58-RETENCION-DE-INGRESOS.md` (sección WIN-BACK).
> No se puede activar hoy porque depende de 2 piezas que el proyecto todavía
> no tiene:
> 1. **El webhook de Hotmart** — es lo único que avisa que alguien canceló y
>    cuándo. Sin eso, no hay fecha desde la cual contar los 30/60/90 días.
> 2. **Resend (o similar) con dominio propio** — el correo de login de
>    Supabase no sirve para esto (es solo para el enlace mágico, y tiene un
>    límite de envíos muy bajo).
>
> Cuando esas dos piezas existan, conectar esto es: guardar la fecha de
> cancelación que manda el webhook de Hotmart → una tarea programada (cron)
> que cada día busca cancelados hace exactamente 30/60/90 días → le pasa el
> correo correspondiente de abajo a Resend. El copy y la regla de negocio ya
> están decididos; falta solo el cableado técnico.

## Regla de negocio (igual para los 3 correos)

- Se dispara para cualquier persona cuya suscripción se canceló o venció
  (webhook de Hotmart), sin importar el motivo.
- Oferta de regreso: **3 días de prueba gratis, igual que la primera vez**
  (no un descuento — más simple de operar sin sistema de cupones, y
  coherente con el modelo de trial que ya existe). Si más adelante se arma
  un cupón de precio especial en Hotmart, se reemplaza acá sin tocar el
  resto del correo.
- Después del 3er correo (día 90), no se manda ningún otro automático — se
  respeta el "no insistir" explícito (`58`: sin dark patterns).
- Tono: cálido, nunca culpa a la persona por haberse ido, nunca urgencia
  falsa ni descuentos que caducan en 2 horas. Español latino neutro, tuteo,
  voz de "El Espejo de las 3 Cartas" (misma voz que las lecturas).

---

## Correo 1 — Día 30

**Asunto:** ¿Cómo va todo, {{nombre}}?

**Cuerpo:**

Hola {{nombre}},

Hace un mes que no nos vemos por acá, y quería saber cómo has estado.

Amor & Tarot sigue siendo lo mismo: un espacio para poner en palabras lo
que te da vueltas en la cabeza y salir con algo más claro que cuando
entraste — El Espejo de las 3 Cartas sigue ahí, cuando lo necesites.

Si quieres volver a probarlo, te regalamos otros 3 días gratis. Sin
compromiso, sin que tengas que explicar nada.

[Volver a Amor & Tarot →]

Un abrazo,
El equipo de Amor & Tarot

---

## Correo 2 — Día 60

**Asunto:** ¿Otra duda dando vueltas?

**Cuerpo:**

Hola {{nombre}},

Sé que la razón por la que entraste la primera vez puede que ya se haya
resuelto, de una forma o de otra. Eso pasa — las dudas de pareja no duran
para siempre, cambian o se resuelven solas.

Pero seguro apareció otra cosa: algo en el trabajo, una decisión que no
sabes cómo tomar, algo con tu familia. El Espejo de las 3 Cartas ya no es
solo para pareja — sirve para cualquier duda que te esté dando vueltas hoy.

Si quieres probarlo con lo que sea que tengas en la cabeza ahora, te
regalamos 3 días gratis, otra vez.

[Sacar mis 3 cartas →]

Un abrazo,
El equipo de Amor & Tarot

---

## Correo 3 — Día 90

**Asunto:** Última vez que te escribimos por esto

**Cuerpo:**

Hola {{nombre}},

Esta es la última vez que te escribimos para invitarte a volver — no
porque no nos importes, sino porque no queremos ser un correo más que te
llega sin que lo pidas.

La invitación sigue en pie, sin fecha de vencimiento: si en algún momento
tienes una duda que quieras poner en claro, ahí va a estar Amor & Tarot,
con tus 3 días gratis esperando.

[Volver cuando quieras →]

Gracias por haber sido parte de esto.
El equipo de Amor & Tarot
