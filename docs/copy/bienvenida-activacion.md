# Copy — Bienvenida y activación (D1 · D3 · D7)

> **Estado: escrito, sin conectar.** A diferencia de los otros correos de
> este lote, ESTE NO depende de Hotmart — depende solo de Resend + saber
> cuándo alguien creó su cuenta (`auth.users.created_at`, ya existe hoy). En
> cuanto exista Resend, esta secuencia se puede conectar SOLA, sin esperar
> el webhook de Hotmart — vale la pena priorizarla apenas Resend esté listo.
>
> Objetivo (mismo razonamiento ya documentado en ESTADO.md sobre
> monetización): que la persona sienta el ritual diario desde la primera
> semana, porque eso es lo que la hace quedarse más allá de resolver la duda
> puntual que la trajo. Cada correo empuja hacia UNA función ya construida
> que todavía no usó, nunca hacia "usa más la app" en genérico.

## Regla de negocio

- Se manda solo si la persona NO hizo ya la acción que el correo empuja
  (ej. no mandar "saca tu primera lectura" a alguien que ya sacó 3) — la
  condición exacta se revisa al conectar, contra los datos reales de
  `lecturas` / `estados_animo` / `racha_dias`.
- Tono cálido, cero presión de "no has vuelto" — enmarca todo como
  invitación, nunca como reclamo por ausencia.

---

## Correo D1 — Bienvenida

**Asunto (variante A):** Bienvenida a Amor & Tarot, {{nombre}}
**Asunto (variante B):** Tu primer paso con El Espejo de las 3 Cartas
**Preheader:** Cuéntanos qué te trae hoy y sal con algo más claro en un minuto.

**Cuerpo (si NO ha sacado ninguna lectura todavía):**

Hola {{nombre}},

Bienvenida a Amor & Tarot. Esto no es un horóscopo genérico — le cuentas tu
situación con tus propias palabras, y El Espejo de las 3 Cartas te responde
citando exactamente lo que dijiste.

Si ya tienes algo dando vueltas hoy, es un buen momento para probarlo:

[Sacar mis 3 cartas →]

El equipo de Amor & Tarot

**Cuerpo (si YA sacó su primera lectura):**

Hola {{nombre}},

Qué bueno que ya probaste El Espejo de las 3 Cartas. Una cosa que mucha
gente no descubre en el primer día: cada mañana tienes una Carta del día
esperándote en Inicio — toca el aro y, de paso, empiezas tu racha.

[Ver mi carta de hoy →]

El equipo de Amor & Tarot

---

## Correo D3 — Check-in de ánimo

**Asunto (variante A):** Una cosa rápida que quizás no viste
**Asunto (variante B):** ¿Cómo te has sentido estos días?
**Preheader:** Un toque después de tu carta del día — así empieza tu historial real.

**Cuerpo (si no ha usado el check-in de ánimo):**

Hola {{nombre}},

Justo después de revelar tu Carta del día, Amor & Tarot te pregunta cómo te
sientes — un toque, nada más. Con el tiempo arma una tira semanal con tu
estado real, día por día.

[Revelar mi carta de hoy →]

El equipo de Amor & Tarot

---

## Correo D7 — Tu semana en resumen

**Asunto (variante A):** Tu primera semana ya tiene un resumen
**Asunto (variante B):** Una semana después: esto es lo que vimos
**Preheader:** Tu ánimo y tus lecturas de esta semana, juntos en un solo reflejo.

**Cuerpo (si tiene suficientes datos — 2+ entre ánimo/lecturas esa semana):**

Hola {{nombre}},

Ya llevas una semana con nosotros. Entra a tu Historial: armamos "Tu
semana en resumen" con tu ánimo y tus lecturas juntos — entre más semanas
sigas, más se va afinando.

[Ver mi semana en resumen →]

El equipo de Amor & Tarot

**Cuerpo (si NO tiene suficientes datos esa semana):**

Hola {{nombre}},

Una idea para esta semana: cada vez que revelas tu Carta del día y nos
cuentas cómo te sientes, se arma un historial tuyo — y a partir de 2 o 3
registros en la semana, te armamos un resumen que junta todo. Todavía te
falta un poco para llegar ahí.

[Ir a mi carta de hoy →]

El equipo de Amor & Tarot
