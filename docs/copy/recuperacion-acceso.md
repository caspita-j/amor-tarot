# Copy — Recuperación de acceso ("no puedo entrar")

> **Estado: escrito, parcialmente ya resuelto por el producto.** El botón
> "Enviarme el enlace mágico" en `/login` YA hace esto hoy mismo — cualquiera
> puede pedir un enlace nuevo con su correo, en cualquier momento, sin ayuda
> de nadie. Ese correo hoy lo manda Supabase (límite de envíos bajo, puede
> fallar en silencio — ver ESTADO.md). Cuando exista Resend, ese mismo botón
> debería mandar el correo de abajo en vez del genérico de Supabase — mismo
> flujo, mejor entrega y mejor voz de marca.
>
> Este archivo cubre 2 casos:
> 1. El correo automático que reemplaza al de Supabase (mismo botón de hoy).
> 2. La plantilla para cuando alguien escribe a soporte diciendo "no puedo
>    entrar" — para responder rápido y con la voz correcta, sin
>    improvisar cada vez.

## Regla de negocio

- Nunca confirma ni niega si un correo tiene cuenta o no (anti-enumeración,
  misma regla que ya sigue `app/login/page.tsx` hoy) — el mensaje es igual
  se tenga cuenta o no.
- El enlace vence en 24 horas, igual que el de acceso post-compra.
- Tono: tranquilizador, nunca hace sentir torpe a quien no encuentra el
  correo o no sabe usar un enlace mágico (el método es nuevo para mucha
  gente que viene de apps con contraseña).

---

## Correo — Nuevo enlace de acceso

**Asunto (variante A):** Aquí tienes tu enlace para entrar
**Asunto (variante B):** Tu acceso a Amor & Tarot, listo
**Preheader:** Un toque y quedas adentro, sin contraseñas.

**Cuerpo:**

Hola,

Aquí tienes tu enlace para entrar a Amor & Tarot:

[Entrar a mi cuenta →]

Vence en 24 horas. Si necesitas otro, entra a amorytarot.app y pídelo de
nuevo con el mismo correo — las veces que haga falta.

El equipo de Amor & Tarot

---

## Plantilla de soporte — "No puedo entrar a mi cuenta"

Para responder un correo/mensaje real de una persona con este problema:

> Hola {{nombre}},
>
> Sin problema — te mando un enlace nuevo ahora mismo. Revisa también la
> carpeta de spam o promociones, a veces el correo cae ahí la primera vez.
>
> [Entrar a mi cuenta →]
>
> Si en 10 minutos no te llega nada, respóndeme y lo resolvemos por acá
> directamente.
>
> {{nombre del que responde}} · Amor & Tarot

**Nota para quien responda soporte:** si la persona dice que "nunca le
llega nada", antes de escalar revisar (1) que escribió bien su correo, (2)
que no tiene un filtro raro en su bandeja, (3) recién ahí sospechar de un
problema real de entrega (ver `docs/sistema/46-EMAIL-DELIVERABILITY.md`).
