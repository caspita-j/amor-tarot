# Copy — Acceso post-compra (el correo MÁS crítico del negocio)

> **Estado: escrito, sin conectar.** Este es el correo que llega apenas alguien
> paga en Hotmart. Si no llega, o llega tarde, o llega a spam: la persona PAGÓ
> y no puede entrar → pide reembolso y deja una reseña mala. Es el correo que
> menos margen de error tiene de todo el negocio.
>
> **Depende de 2 piezas que hoy no existen:**
> 1. El webhook de Hotmart (avisa "compra aprobada" con el correo del
>    comprador).
> 2. Resend con `amorytarot.app` verificado (para que el correo no caiga en
>    spam — un correo de acceso en spam equivale a que no llegó).
>
> **Cómo se conecta cuando existan esas 2 piezas** (decisión técnica ya
> tomada, documentada acá para no tener que redecidirla): el webhook de
> Hotmart, al recibir "compra aprobada", (a) crea el usuario en Supabase si
> no existe (`admin.auth.admin.createUser`, mismo método que ya usa
> `app/api/admin/usuarios/route.ts` para altas manuales), (b) genera un
> enlace mágico de un solo uso (`admin.auth.admin.generateLink`), (c) le pasa
> ese enlace a Resend para mandar el correo de abajo. El enlace usa el mismo
> mecanismo de `app/login/page.tsx` que ya sabe leer tokens del fragmento de
> la URL — no hace falta tocar esa pantalla.

## Regla de negocio

- Se manda UNA vez, inmediatamente después de "compra aprobada" (nunca
  "compra pendiente" — eso es para el carrito abandonado, ver
  `carrito-abandonado.md`).
- El enlace vence en 24 horas (configuración estándar de Supabase) — si la
  persona no lo usa a tiempo, necesita pedir uno nuevo desde `/login` (mismo
  flujo que cualquier usuario, sin trato especial).
- Nunca menciona el precio ni el plan (ya lo vio y lo aceptó en el checkout
  de Hotmart) — el único trabajo de este correo es UNA cosa: que entre.
- Un solo CTA, el enlace de acceso. Nada de "mira también esto otro".

---

## Correo — Acceso a tu cuenta

**Asunto (variante A):** Ya puedes entrar a Amor & Tarot
**Asunto (variante B):** Tu acceso está listo, {{nombre}}
**Preheader:** Un solo toque y quedas adentro — sin contraseña que recordar.

**Cuerpo:**

Hola {{nombre}},

Tu compra quedó confirmada. Ya puedes entrar a Amor & Tarot y sacar tu
primera lectura con El Espejo de las 3 Cartas.

[Entrar a mi cuenta →]

Este enlace es solo tuyo y vence en 24 horas. Si ya venció cuando lo abras,
entra a amorytarot.app y pide uno nuevo con el mismo correo — es igual de
rápido.

Cualquier cosa, respóndenos este correo.

El equipo de Amor & Tarot

---

## Variante — si la compra fue de alguien que YA tenía cuenta gratis/trial

Mismo asunto y estructura, cambia solo la primera línea del cuerpo:

> Tu pago quedó confirmado — ya tienes acceso completo, sin límites. No
> necesitas hacer nada más, tu cuenta ya está activa.

(Sin enlace de acceso nuevo: ya tiene sesión iniciada la mayoría de las
veces. Se agrega igual el botón "Entrar a mi cuenta →" por si acaso.)
