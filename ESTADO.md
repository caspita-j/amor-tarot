# ESTADO — Amor & Tarot
Última actualización: 2026-09-10 | Sesión actual: 6 (Integraciones reales — Supabase Etapa 2 lista, GitHub+Vercel conectados, Bienestar, panel de admin, pop-up de salida en landing, auditoría legal, auditoría de seguridad, mecanismo ampliado a cualquier duda, check-in de ánimo, copy de win-back listo, informe semanal, avance por categoría, voseo reforzado, dominio propio conectado, nota de bienvenida en Historial)

✅ CHECKPOINT — Nota de bienvenida en Historial ("Así funciona tu Historial"), 2026-09-10, a pedido
del usuario. Aparece SOLO la primera vez que la persona entra a Historial: explica en 3 líneas que
ahí quedan sus lecturas, que cada semana arma "Tu semana en resumen", y que con 3+ lecturas de la
misma categoría aparece "Tu avance" — mencionando de paso que ese avance es honesto (nunca "todo
mejora" porque sí), para que no le sorprenda si algún día le dice que algo no avanzó.
Se recuerda "para siempre" en `localStorage` (a propósito, no `sessionStorage` — si no, reaparecería
cada vez que cierre el navegador) vía `vioIntroHistorial()`/`marcarIntroHistorialVista()` nuevas en
`lib/estado-app.ts`, mismo archivo que ya centraliza este tipo de preferencia de cliente. Se cierra
con la X o el botón "Entendido", cualquiera de los dos.
Verificado en vivo con un usuario de prueba real: aparece en la primera visita, se cierra, y al
recargar la página ya no vuelve a aparecer (confirmado leyendo el flag real de localStorage, no solo
mirando la pantalla). Usuario de prueba borrado al terminar. tsc/build limpios. Publicado.
✅ CHECKPOINT — Dominio propio conectado: **https://www.amorytarot.app**, 2026-09-10. El usuario
compró `amorytarot.app` (tras una lluvia de ideas de nombres — se quedó con el mismo nombre de marca,
solo TLD `.app` en vez de `.com`, que no estaba disponible). Guiado paso a paso por el chat (sin ver
ninguna clave — solo valores públicos de DNS):
- Vercel → Domains → se agregó `amorytarot.app` como dominio existente (no comprado ahí).
- El registro DNS del registrador tenía un registro A viejo apuntando a la IP de estacionamiento del
  propio registrador (`2.57.91.91`) — se corrigió (no se agregó uno nuevo, que hubiera creado
  conflicto) al valor real de Vercel (`216.198.79.1`). El CNAME de `www` ya apuntaba bien al dominio
  raíz desde antes, no necesitó cambio — al arreglar el A, ambos quedaron válidos en Vercel a la vez.
  Vercel dejó `www.amorytarot.app` como el dominio de Producción real, con `amorytarot.app` (sin www)
  redirigiendo (308) hacia él — así que el dominio "canónico" de la app de ahora en más es CON www.
- Supabase Auth → Site URL cambiada a `https://www.amorytarot.app`, agregada
  `https://www.amorytarot.app/**` a Redirect URLs (se dejó también la de `amor-tarot.vercel.app` por
  ahora, se puede quitar más adelante una vez todo esté estable).
Verificado en vivo con un usuario de prueba real: la landing carga con HTTPS en el dominio nuevo, y el
login completo (enlace mágico → `/auth/callback` → sesión real → `/app`) funciona de punta a punta en
`https://www.amorytarot.app`. Usuario de prueba borrado al terminar.
⚠️ Pendiente, no urgente: `amor-tarot.vercel.app` sigue funcionando en paralelo (documentado más
arriba, en "Pendientes del usuario" — se puede seguir usando temporalmente, y el correo de contacto
legal sigue siendo el Gmail personal hasta que se configure un correo real sobre este dominio nuevo,
ver esa misma sección).
✅ CHECKPOINT — Arreglo de voseo + "Tu avance en [categoría]", 2026-09-10, a pedido explícito del
usuario.
**Voseo**: al mostrarle un ejemplo real del informe semanal, el usuario notó que se colaron 2 verbos
en voseo ("mirá", "cruzás") a pesar de que el prompt ya decía "NUNCA voseo". Reforzado en LOS DOS
endpoints que generan texto con IA (`app/api/lectura/route.ts` y `app/api/informe-semanal/route.ts`)
con ejemplos explícitos de lo prohibido y su forma correcta ("mirá"→"mira", "cruzás"→"cruzas",
"tenés"→"tienes", etc.) + la instrucción de revisar cada verbo antes de terminar. Probado con 2
informes semanales nuevos, con usuarios distintos: ningún voseo en ninguno de los dos.
**"Tu avance en [categoría]"**: nueva sección en Historial (debajo de "Tu semana en resumen") — mira
TODAS las lecturas de la categoría con más historia (3+, la que tenga más) en orden cronológico y
refleja cómo se movió esa situación real. Regla más importante, pedida explícitamente por el
usuario: JAMÁS decir "estás mejorando" porque sí — si la situación sigue igual, empeoró, o cambió sin
resolverse, eso es lo que se dice, con calidez pero sin maquillar (para que la persona nunca sienta
que le están mintiendo). Tabla nueva `avances_categoria` (RLS select+insert propio, sin update — el
avance de un día no se reescribe), mismo patrón de "máximo 1 generación por día" que el informe
semanal (clave primaria `user_id+categoria+fecha`).
Verificado en vivo con 2 escenarios reales opuestos, a propósito, para confirmar que no se volvió ni
falsamente positivo ni sistemáticamente pesimista: (1) 3 lecturas de pareja a lo largo de 3 semanas
donde la situación NO mejora (silencio → respuesta cortante → misma pelea de siempre) — el informe
dijo explícitamente "esto no es una mejora disfrazada... nada de esto se ha resuelto todavía, y
decírtelo así, sin adornarlo, es más honesto que prometerte que ya viene la calma"; (2) 3 lecturas de
trabajo con mejora real y verificable (miedo a preguntar → preguntó → consiguió el ascenso) — el
informe reconoció el avance real citando sus propias palabras ("hice bien en no quedarme callada"),
sin prometer que todo seguirá así. Ambos sin voseo. Usuarios y datos de las 4 pruebas de esta ronda
borrados al terminar (la base volvió a 0 en las 4 tablas nuevas). tsc/build limpios. Publicado.
✅ CHECKPOINT — "Tu semana en resumen" (informe semanal con IA), 2026-09-10, a pedido explícito del
usuario. Nace de una conversación honesta sobre el negocio: el usuario preguntó si yo, como usuario,
pagaría mes a mes — la respuesta fue que el valor pago (lecturas puntuales) no da una razón mensual
de seguir pagando, a diferencia del ritual diario gratis (check-in de ánimo) que sí genera hábito.
Esta feature es el puente: un reflejo semanal generado con IA que usa el ánimo + las lecturas reales
de la persona, pensado para que el valor pago se sienta ACUMULATIVO (se afina mientras más semanas
sigue suscrita) en vez de puntual — mismo principio que "Spotify Wrapped" o los resúmenes anuales de
apps de journaling.
Implementado: tabla `informes_semanales` (Postgres, RLS solo select+insert propio — nunca update,
el informe de un día no se reescribe) — clave primaria `user_id+fecha` que limita a 1 generación por
persona por día (control de costo de IA, no hace falta contador aparte). `app/api/informe-semanal/
route.ts`: si ya existe el de hoy lo devuelve tal cual (sin llamar a la IA); si no, exige un mínimo
de 2 datos reales esa semana (ánimos + lecturas combinados) — si no hay suficientes, responde vacío
sin gastar ninguna llamada; el prompt tiene la misma regla anti-alucinación que el resto de la app
("basa todo en los datos reales, nunca inventes un patrón que no esté"). Mostrado en
`app/app/historial/page.tsx`, arriba de todo, con su propio esqueleto de carga — y si no hay
suficientes datos, la tarjeta simplemente no aparece (nunca un hueco vacío forzado).
Verificado en vivo con 2 usuarios de prueba reales: (1) uno con 4 días de ánimo + 2 lecturas —
el informe generado conectó de verdad el ánimo (2 días de ansiedad → calma → esperanza) con el
contenido real de ambas lecturas (un ascenso que no se confirma, un mensaje que no llega), con una
idea de cierre genuina y no genérica; recargar la página devolvió el mismo texto en 454ms (cache
funcionando, no se regeneró); confirmado con SQL que quedó exactamente 1 fila guardada. (2) uno sin
ningún dato esta semana — la tarjeta no apareció, cayó limpio al estado vacío ya existente de
Historial. Usuarios y datos de prueba borrados al terminar (la base volvió a 0 lecturas/ánimos/
informes). tsc/build limpios. Publicado.
Con esto, los 3 puntos "productivos" de la conversación sobre monetización quedan resueltos en
código (retención vía hábito diario + categorías ampliadas + informe acumulativo) — lo único que
falta para que el negocio se valide de verdad sigue siendo Hotmart (ver "Pendientes del usuario").
⚠️ BUG REAL encontrado y corregido, 2026-09-10 — a pedido del usuario ("revisa que el onboarding y el
paywall sigan funcionando") tras los cambios de la auditoría de seguridad. Onboarding y paywall en sí
compilan y se ven bien (probado de punta a punta con clics reales), pero el arreglo de ayer que
bloqueó la edición directa de `racha_dias`/`racha_ultima_fecha` (quitó UPDATE general de `profiles`
y lo devolvió solo a las columnas editables desde la app) rompió, sin quererlo, la sincronización del
onboarding: `sincronizarOnboardingSiHaceFalta()` hace un `upsert()`, y el `ON CONFLICT (id) DO UPDATE`
que genera Supabase/PostgREST incluye `id = excluded.id` en el SET aunque el valor no cambie — como
`id` no estaba en la lista de columnas con permiso, ese upsert fallaba en silencio (la función no
revisa el error) y el nombre/signo/otra persona del onboarding nunca llegaban al perfil real: el
usuario nuevo veía "Hola, ahí" en vez de su nombre. Corregido con
`grant update (id) on public.profiles to authenticated` — es seguro porque la política `update_own`
ya exige `auth.uid() = id` en el WITH CHECK, así que nadie puede cambiar su id al de otra persona,
solo "actualizarlo" a sí mismo (que es lo único que hace el upsert). Verificado con un usuario de
prueba real de punta a punta: onboarding completo (5 preguntas + reconocimiento citando la respuesta
real + resultado con nombre/cartas correctos) → paywall (precio, plan, fecha de cobro real) → login →
`/app` mostrando "Hola, Prueba Flujo" correctamente, Y confirmado que `racha_dias`/`racha_ultima_fecha`
siguen bloqueadas para edición directa (la protección de la auditoría de seguridad sigue intacta).
Usuario y datos de prueba borrados al terminar. tsc/build limpios. Publicado.
✅ CHECKPOINT — Copy de win-back escrito y guardado (plan de retención, punto 4), 2026-09-09 — SIN
automatizar todavía, a propósito. Antes de escribir nada se le avisó al usuario que este punto
depende de 2 piezas que el proyecto no tiene hoy: el webhook de Hotmart (es lo único que avisa quién
canceló y cuándo — sin eso no hay fecha desde la cual contar los días) y Resend/dominio propio (el
correo de Supabase es solo para el enlace mágico, con límite de envíos bajo, no sirve para esto). El
usuario eligió dejar el copy listo en vez de esperar. Escrito siguiendo la doctrina exacta de
`docs/sistema/58-RETENCION-DE-INGRESOS.md` (sección WIN-BACK): secuencia de 3 correos a los días
30/60/90, oferta = 3 días de prueba gratis (no descuento, más simple de operar sin cupones), sin
insistir después del 3er correo (sin dark patterns, per la doctrina). Guardado en
`docs/copy/winback.md`, con la regla de negocio y el enganche técnico exacto documentados arriba del
copy mismo, para que conectarlo cuando existan Hotmart+Resend sea cableo, no decisión. El correo del
día 60 aprovecha a propósito la ampliación de categorías de hoy ("ya no es solo para pareja").
No se tocó código ni se armó ninguna automatización — es contenido guardado, nada más.
✅ CHECKPOINT — Check-in de ánimo diario (plan de retención, punto 3), 2026-09-09, a pedido del
usuario. Objetivo: que el ritual diario deje de ser intercambiable con cualquier horóscopo y empiece
a generar un dato propio de la persona, acumulado en un historial visual real (antes, `SemanaStrip`
era "puramente decorativa a propósito" según su propio comentario, porque no existía ningún dato real
por día que mostrar — ahora sí existe).
Implementado: tabla nueva `estados_animo` (Postgres, RLS select/insert/update_own, una fila por
persona por día — upsert por clave primaria `user_id+fecha`) con 4 estados (tranquila, esperanzada,
ansiosa, triste), cada uno mapeado 1:1 a un acento YA existente de la app (lila/naranja/celeste/rosa
— sin paleta nueva). `lib/animo.ts` (tipo + labels + colores, mismo patrón que `lib/categorias.ts`).
`lib/supabase/datos.ts`: `guardarEstadoAnimo()` y `leerEstadosAnimoRango()`. En `app/app/page.tsx`:
justo después de revelar la carta del día (mismo tap de siempre, sin pasos extra), aparece "¿Cómo te
sientes hoy?" con 4 chips de ícono+color; un toque guarda y muestra "Hoy te sentiste: X" en su lugar
(no vuelve a preguntar ese día). `components/app/SemanaStrip.tsx` ahora recibe los estados de la
semana y pinta cada día con su color real en vez de solo el número — el "historial visual" que pedía
el plan de retención.
Verificado en vivo con un usuario de prueba real (creado y borrado en la sesión): reveló la carta,
apareció el check-in, tocó "Con esperanza", se guardó ("Hoy te sentiste Con esperanza"), el día de
hoy en la tira semanal pintó naranja, y recargando la página el estado siguió ahí (confirma que lee
de la base de datos, no solo memoria local). tsc/build limpios. Publicado.
Quedan del plan de retención: punto 4 (win-back automatizado cuando la duda se resuelve y la persona
cancela) y punto 5 (precio/plan) — pendientes de que el usuario decida si seguir.

✅ CHECKPOINT — DECISIÓN DE PRODUCTO: el mecanismo de lecturas ya NO es solo de pareja, 2026-09-09,
a pedido explícito del usuario (plan de retención, punto 1+2: "extender la app a problemas de día a
día... que la persona sienta que la app es un hombro en el cual puede desahogarse... guardando
historial y contexto de sus lecturas anteriores crea un vínculo más fuerte"). Diagnóstico previo que
motivó el cambio: el dolor real que resuelve la app (duda de pareja) tiende a RESOLVERSE solo en
semanas, así que apostar a retención mensual indefinida sobre ese único caso de uso no es realista;
la salida es que la app siga siendo útil cuando esa duda puntual ya se resolvió.
⚠️ IMPORTANTE: la PROMESA PÚBLICA (landing, onboarding, paywall, FICHA-AVATAR.md) se deja
EXPLÍCITAMENTE IGUAL por ahora ("duda o crisis de pareja") — decisión del usuario ("deja la promesa
como está por ahora"). Lo que cambió es el alcance PUERTAS ADENTRO de la app ya registrada. Si más
adelante se decide anunciarlo también afuera, hay que actualizar FICHA-AVATAR.md (hoy dice
literalmente "duda de pareja") y el copy de venta — no se tocó nada de eso hoy.
Implementado:
- `lib/categorias.ts` (nuevo): 6 categorías (Pareja, Trabajo, Familia, Amistad, Una decisión, Otro),
  con quién pide "otra persona" y las etiquetas de la carta 2/3 por categoría — "La Dinámica" se
  conserva tal cual para pareja/familia/amistad (es el nombre de marca del mecanismo, ya está en la
  landing: "Tú, La Otra Persona, La Dinámica"); trabajo/decisión/otro usan "El Camino".
- `lecturas` (Postgres): columna `categoria` nueva (default `'pareja'`, con CHECK de los 6 valores —
  las lecturas viejas quedan clasificadas como pareja automáticamente, sin migración de datos manual).
- `app/app/lecturas/page.tsx`: nuevo paso de "¿de qué se trata tu duda?" (grid de 6 categorías con
  ícono) ANTES del formulario de situación; el campo "¿con quién es tu situación?" solo aparece para
  categorías relacionales, y es opcional (si no se da nombre, la carta 2 se llama "La Situación").
  Menú y tarjeta de Inicio (`app/app/page.tsx`) renombrados de "Tu lectura de pareja" a "Cuéntame tu
  situación" para reflejar el alcance nuevo — sigue siendo el mismo mecanismo de 3 cartas.
- `app/api/lectura/route.ts`: el `SYSTEM_PROMPT` ya no asume pareja, es agnóstico de categoría;
  además trae del lado del SERVIDOR (nunca confiando en lo que mande el cliente) las últimas 2
  lecturas de la misma persona y se las pasa a la IA como contexto, con la instrucción explícita de
  usarlas SOLO si hay una conexión real con lo de hoy, nunca forzarla — probado en vivo: una lectura
  de trabajo seguida de una de pareja sin relación real NO generó ninguna conexión inventada (la IA
  respetó la regla).
- `app/app/historial/page.tsx`: cada lectura muestra su categoría; si ≥3 de las últimas 5 comparten
  categoría, aparece un aviso ("3 de tus últimas 5 lecturas fueron sobre trabajo") — umbral puesto a
  propósito para no inventar un patrón con pocos datos.
Verificado de punta a punta con usuarios de prueba reales (creados y borrados en la sesión, service
role nunca expuesto): (1) categoría "Trabajo" — sin campo de "otra persona", título e íconos
correctos, lectura generada 100% sobre el tema de trabajo con las cartas rotuladas "Tú / La Situación
/ El Camino"; (2) categoría "Pareja" a continuación — la IA NO mezcló el contexto de la lectura de
trabajo anterior (correcto, no había conexión real); (3) Historial mostrando ambas con su categoría
correcta; (4) aviso de patrón probado por separado con datos sembrados a propósito (3 de 5 en
"trabajo") — apareció el texto exacto esperado. tsc/build limpios. Publicado.
Siguiente paso sugerido (no iniciado): el resto del plan de retención (puntos 3-5 — ritual diario con
check-in real, y win-back automatizado para cuando la duda de la persona se resuelva) sigue pendiente
de que el usuario decida si avanzar.

✅ CHECKPOINT — Auditoría de seguridad completa (10 puntos, formato pedido por el usuario), 2026-09-09.
Hallazgo 🔴 CRÍTICO, sin corregir a propósito (decisión del usuario — "lo de Hotmart ya en el siguiente
módulo del curso lo haremos"): `/app` solo exige sesión iniciada, nunca revisa pago ni prueba vencida
— hoy cualquier correo puede crear cuenta gratis con acceso ilimitado, porque Hotmart todavía no está
conectado (confirmado leyendo el código: no existe webhook, no existe tabla de suscripción). Queda
pendiente de la próxima etapa del curso, no de esta sesión.
Corregido HOY, a pedido explícito ("hace los arreglos tú mismo que puedas hacer"):
- **Límite real (servidor) de fotos por lectura**: antes solo lo respetaba el navegador (MAX_FOTOS=3).
  Migración `limitar_fotos_y_proteger_racha` + `corregir_proteccion_racha_por_columna`: función
  `public.validar_tamano_fotos()` + constraint `fotos_validas` en `lecturas` (máx. 3 fotos, máx.
  500.000 caracteres cada una). Probado con INSERT reales: 4 fotos → rechazado, 1 foto de 600k
  caracteres → rechazado, 2 fotos de 50k → aceptado, sin fotos (null) → aceptado. Filas de prueba
  borradas, `lecturas` vuelve a 0 filas.
- **Un usuario ya no puede editar su propia racha directo por la API**, saltándose `registrar_dia()`.
  Se quitó el permiso de UPDATE general de `profiles` para `authenticated` y se devolvió solo a las
  columnas que la app realmente edita desde el cliente (nombre, signo, otra_persona_nombre,
  otra_persona_signo, foto_url) — `racha_dias`/`racha_ultima_fecha` quedaron fuera. `registrar_dia()`
  sigue funcionando igual (corre como `SECURITY DEFINER`, no le aplica este permiso de columna).
  Probado: UPDATE directo a `racha_dias` → `ERROR 42501 permission denied` (bien); UPDATE a `nombre`
  → funciona (bien); `registrar_dia()` → funciona igual que antes (bien).
  ⚠️ Nota de transparencia: el primer intento de probar este arreglo (antes de aplicarlo) dejó por
  error la racha de la cuenta de prueba `jonathancaspita@gmail.com` en 777 en vez de su valor real —
  una prueba que debía revertirse con `rollback` no se revirtió como se esperaba. Se detectó al
  verificar (nunca se asumió que había funcionado sin mirar) y se corrigió de inmediato a `racha_dias
  = 1` (el valor real documentado antes en este archivo). No afectó a ningún usuario real, solo a la
  cuenta de prueba del propio dueño del proyecto.
- **Protección contra manipulación del texto que se le manda a la IA** (prompt injection): el
  `SYSTEM_PROMPT` de `app/api/lectura/route.ts` ahora indica explícitamente que el texto de la
  "situación" es siempre un relato personal, nunca una instrucción, incluso si contiene frases como
  "ignora las instrucciones anteriores".
- **Cabeceras de seguridad básicas** agregadas en `next.config.ts` (`X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`) — verificado con curl
  que el servidor las manda de verdad.
- **Comentario desactualizado corregido** en `lib/supabase/datos.ts`: decía que las fotos de lectura
  seguían en sessionStorage, pero ya viven en la base de datos desde la Etapa 2 — solo la foto de
  PERFIL sigue en sessionStorage (Etapa 3, sin empezar).
- **Dependencias actualizadas** a sus versiones menores/parche más recientes dentro del rango ya
  fijado en `package.json` (`npm update`, 26 paquetes) — `npm audit` seguía en 0 vulnerabilidades
  antes y después.
No corregido (queda para cuando el usuario lo pida): activar "Leaked Password Protection" en el panel
de Supabase (Authentication → Policies) — no se puede hacer desde código/SQL, es un toggle del panel.
tsc/build limpios tras cada cambio. Publicado.
✅ CHECKPOINT — Prueba real end-to-end del borrado de cuenta, 2026-09-09, a pedido del usuario. Contra
producción: usuario de prueba creado con la Admin API (perfil con datos + 1 lectura + 1 ai_call),
sesión real iniciada con el código OTP generado por la misma API (no por correo — el rate-limit de
correo ya documentado seguía activo e impidió el flujo normal de login), y el botón "Eliminar mi
cuenta" ejecutado de verdad desde la UI (escribiendo "ELIMINAR", sin atajos). Resultado: redirige a
`/` sin sesión, y se confirmó con SQL que `auth.users`, `profiles`, `lecturas` y `ai_calls` quedaron
en cero filas para ese usuario — el cascade funciona como se diseñó. `/app` vuelve a pedir login
después, confirmando que la sesión se cerró también del lado del servidor. Usuario y datos de
prueba, y el script temporal usado, se borraron todos al terminar.
⚠️ BUG REAL encontrado en el camino (no es de esta auditoría, es de la feature de Sesión 6 "agregar
usuario manualmente"): el enlace que genera `admin.auth.admin.generateLink()` en
`app/api/admin/usuarios/route.ts` vuelve en flujo implícito (tokens en el `#fragmento` de la URL), no
en `?code=` — porque quien lo abre nunca inició el flujo desde su propio navegador (no hay
`code_verifier` guardado ahí). `app/auth/callback/route.ts` solo sabe leer `?code=`, así que la
persona termina en `/login?error=enlace_invalido` con el enlace "de acceso" sin dejarla entrar. La
nota anterior en ESTADO.md ("probó agregar usuario… funcionó, devolvió un enlace") solo confirmó que
el enlace se generó, nunca que alguien lo haya CLICKEADO y quedado adentro — quedó sin probar hasta
hoy. No se tocó código para corregirlo (fuera del pedido de esta tarea) — queda pendiente de que el
usuario decida si lo arreglamos (la solución es agregar en `/login` o `/auth/callback` una lectura del
`#access_token`/`refresh_token` del fragmento con `supabase.auth.setSession()` cuando no venga `code`).
✅ CORREGIDO el mismo día, a pedido del usuario: `app/login/page.tsx` ahora detecta
`window.location.hash` con `access_token`/`refresh_token` al montar y llama a `setSession()` a mano
(con un estado "Entrando con tu enlace…" mientras resuelve) — cubre el caso que `/auth/callback`
(server-only) no puede leer, porque el fragmento nunca llega al servidor. Probado de nuevo end-to-end
en producción con un usuario y un enlace nuevos (mismo patrón que la Admin API usa de verdad): abrir
el enlace ahora sí termina en `/app` con sesión real, en vez de `/login?error=enlace_invalido`.
Usuario y script de prueba borrados al terminar. tsc/build limpios. Publicado.

✅ CHECKPOINT — Auditoría legal completa, 2026-09-09, siguiendo `docs/sistema/47-LEGAL-FISCAL-Y-PRIVACIDAD.md`
al pie de la letra (skill `legal`, a pedido explícito del usuario). Responsable declarado: Jonathan,
persona natural, Colombia. Contacto legal: `jonathanrd198@gmail.com` (temporal — el usuario compró
dominio propio pendiente; cambiar el contacto en las 4 páginas + footer + perfil cuando eso pase).
Inventario real (antes de escribir nada): sin borrado de cuenta, sin analytics/cookies/píxeles, sin
Hotmart conectado, sin checkbox de consentimiento, `/privacidad` y `/terminos` eran placeholders.
Hecho: `components/legal/LegalLayout.tsx` (chrome compartido) + reescritas `app/privacidad/page.tsx`
y `app/terminos/page.tsx` + nueva `app/reembolsos/page.tsx` (Garantía de los 7 Días, PROVISIONAL —
ver Problemas conocidos) + `app/aviso/page.tsx` reforzada ("puede generar información incorrecta") +
disclaimer contextual de 1 línea en el resultado de la lectura (`app/app/lecturas/page.tsx`, junto al
texto de la IA, no solo en la página legal) + checkbox de consentimiento NO pre-marcado en
`app/login/page.tsx` (gatea el botón de enviar enlace Y el de Google — Ley 1581 de 2012 exige
autorización previa expresa, no un texto implícito) + borrado de cuenta real: `app/api/cuenta/eliminar/route.ts`
(verifica sesión propia, usa `admin.auth.admin.deleteUser()` con `SUPABASE_SERVICE_ROLE_KEY`, depende
de los `on delete cascade` ya existentes de `profiles`/`lecturas`/`ai_calls`) + UI de 2 pasos en
`app/app/perfil/page.tsx` (botón → escribir "ELIMINAR" para confirmar → cierra sesión y redirige a `/`).
⚠️ BUG REAL encontrado y corregido en el camino: `/reembolsos` (página nueva) no estaba en
`PUBLIC_PATHS` de `lib/supabase/proxy.ts` — redirigía a `/login` incluso siendo una página legal
pública. Corregido. Footer de la landing (`app/page.tsx`) y el box de enlaces del perfil actualizados
con el 4to enlace a Reembolsos; `soporteEmail` del footer corregido de `hola@amorytarot.app` (dominio
no conectado, bandeja inexistente) a `jonathanrd198@gmail.com` (coherencia con el resto de la capa legal).
Verificado: tsc/build limpios · las 4 páginas legales + el login con checkbox funcionando (gate
verificado con clic real, no solo `.checked`) + la pantalla de confirmación de borrado de cuenta,
revisadas en vivo a 375px con la técnica ya usada esta sesión (ruta agregada a `PUBLIC_PATHS` solo
mientras se miraba, revertida de inmediato, confirmado con curl que `/app/perfil` vuelve a redirigir).
NO se ejecutó un borrado real (el proyecto de Supabase es el mismo de producción — se verificó la
lógica y la UI, no se disparó `admin.auth.admin.deleteUser()` contra una cuenta real). Sin pasada de
`revisor-visual` (páginas legales/secundarias, mismo criterio que perfil/ajustes).
A pedido del usuario, se agregó una advertencia visible en la zona de eliminar cuenta
(`app/app/perfil/page.tsx`, visible tanto antes como durante la confirmación): borrar la cuenta NO
cancela la suscripción de Hotmart — es un sistema aparte — así que si sigue activa, hay que
cancelarla primero o el cobro automático sigue llegando sin que la persona pueda usar la app. Enlaza
a `/reembolsos` (ahí están los pasos para cancelar). Verificado en vivo a 375px + tsc/build limpios.
⚠️ Pendiente que solo un humano puede resolver: la Garantía de los 7 Días en `/reembolsos` sigue
PROVISIONAL — cuando se conecte Hotmart, confirmar que su panel realmente permite reembolso a ≥7 días
corridos desde el cobro (ver FICHA-MERCADO.md §4); si el plazo real es menor, hay que ajustar el
número ahí y en la landing/paywall ANTES de vender. Si en algún momento la app supera unos pocos
cientos de dólares al mes de facturación real, o empieza a manejar datos de salud/menores de edad,
esta auditoría (de completitud, no de asesoría legal colegiada) debe complementarse con un abogado
local — Colombia (Ley 1581) y el mercado hispano de EE.UU. tienen reglas propias que un review de
producto no reemplaza.

✅ CHECKPOINT — Pop-up de intención de salida (exit-intent) en la landing, 2026-09-09, a pedido del
usuario, siguiendo su propio brief paso a paso. Identificación previa (Paso 0): la razón #1 de duda no
es el precio, es la desconfianza al cobro (ya era la primera pregunta del FAQ de la landing). Mensaje
final elegido por el usuario tras 2 rondas de opciones — pérdida emocional dura, sin inventar ningún
descuento/bono (no confirmado): "En una semana vas a seguir despierta/o a la 1am, dándole vueltas a lo
mismo." / "O puedes sacar tus 3 cartas ahora mismo, gratis, y por fin tener una respuesta clara." /
botón "Sacar mis 3 cartas gratis".
Nuevo `components/landing/ExitIntentPopup.tsx`, conectado en `app/page.tsx`. 3 señales de salida: (1)
desktop — `mouseleave` en `document` con `clientY<=0` (el mouse sale por arriba de la ventana); (2)
mobile — scroll rápido hacia arriba (>120px en <400ms) tras haber bajado >40% de una pantalla; (3)
mobile — botón de atrás, interceptado con `history.pushState` + `popstate` UNA sola vez (si lo
presionan de nuevo tras ver el pop-up, se van de verdad — nunca queda atrapado). No se activa antes de
15s ni antes de scroll. Máximo una vez por visita vía `sessionStorage`. Cierra con el botón X, tocando
fuera, o Escape; bloquea el scroll del fondo SOLO mientras está abierto (se libera al cerrar).
Verificado en vivo (Playwright, esperando los 15s reales, no simulado): las 3 señales disparan
correctamente, no se dispara antes de tiempo, no reaparece tras cerrarlo, y el botón de atrás no
atrapa a la persona. tsc/build limpios. El usuario vio capturas de escritorio y celular y confirmó
antes de publicar (siguiendo su propio Paso 5 — nunca se publicó sin su OK explícito).

🔧 EN PROGRESO — Panel de administración (`/admin`), a pedido explícito del usuario, siguiendo el skill
`backoffice` (`PROMPT-BACKOFFICE.txt` + 21-BACKOFFICE/09-SEGURIDAD/26-AUTH-MODERNO/40-UNIT-ECONOMICS/
36-ANALITICA-Y-EVENTOS/17-VISUALIZACION-DATOS).
Auditoría de fuentes (Fase 1) — honesta, sin inventar: HOY existen datos reales de usuarios
(`auth.users`), perfiles/racha (`profiles`), lecturas (`lecturas`) y costo real de IA (`ai_calls`).
NO existen: Hotmart/webhook (cero ventas/MRR/churn reales), `event_log` (cero funnel de
conversión/trial ni retención D1/D7/D30 reales), `profiles.source` (cero LTV/CAC por canal), Sentry
(cero errores). El panel construido refleja esto tal cual — cada sección sin dato real muestra
"No instrumentado todavía" con qué falta conectar, nunca un número inventado.
Seguridad implementada y VERIFICADA con SQL simulando RLS (usuario admin real vs. uuid al azar):
columna `profiles.role` ('user'|'admin', default 'user'), con un trigger que bloquea CUALQUIER cambio
de `role` desde el cliente (ni el propio admin puede cambiárselo vía la app — solo por migración
directa) — sigue al pie de la letra 26-AUTH-MODERNO.md, que prohíbe explícitamente listas de correos
autorizados como sustituto de un rol real server-side. Función `es_admin()` + 4 RPCs
(`admin_salud_datos`, `admin_resumen_usuarios`, `admin_costo_ia`, `admin_listar_usuarios`), todas
`security definer` y TODAS verifican `es_admin()` POR DENTRO antes de devolver nada — un usuario
normal que las llame directo (saltándose la pantalla) recibe `NOT_AUTHORIZED`, verificado en vivo.
Admin seed: `jonathancaspita@gmail.com` (la cuenta de prueba ya confirmada — el usuario prefirió esta
sobre su correo real porque ese todavía no tiene cuenta creada, y crear una ahora chocaría con el
límite de correo de Supabase, ver más abajo). BUG REAL encontrado y corregido en el camino: la función
`admin_listar_usuarios` fallaba con "structure of query does not match function result type" porque
`auth.users.email` es `varchar(255)`, no `text` — se corrigió con un cast explícito.
Páginas: `app/admin/page.tsx` (resumen: salud del dato, usuarios, costo de IA con gráfico de barras de
30 días — todo real; conversión/trial/ventas/negocio marcados "no instrumentado") y
`app/admin/usuarios/page.tsx` (lista real de usuarios + formulario "agregar usuario manualmente").
`app/admin/layout.tsx` verifica `es_admin()` en el servidor y redirige a `/app` si no lo es — protege
antes de renderizar cualquier dato (no es "esconder la ruta").
Función de agregar usuario a mano: `app/api/admin/usuarios/route.ts` verifica sesión + admin en el
servidor ANTES de tocar nada, y usa la Admin API de Supabase (crea el usuario ya confirmado +
genera un enlace de acceso que el dueño puede copiar y mandar por cualquier canal — resuelve de raíz
el problema de "no le llega el correo"). Requiere `SUPABASE_SERVICE_ROLE_KEY` — el usuario todavía no
la ha configurado (es el primer uso real de esa clave en el proyecto; hasta ahora se evitó a
propósito). Sin esa variable, la ruta responde 500 con un mensaje claro en vez de romperse.
Verificado: tsc/build limpios en cada capa · `/admin` y `/admin/usuarios` confirmados con curl
redirigiendo a `/login` sin sesión · las 4 RPCs probadas con SQL como admin real y como usuario al
azar (todas correctas). Publicado en producción 2026-09-09 (commit `6115019`).
✅ Verificación visual: el usuario inició sesión real como `jonathancaspita@gmail.com` en
`https://amor-tarot.vercel.app` (el límite de correo de Supabase ya se había liberado) y confirmó con
captura que `/admin` carga con datos reales (1 usuario, 2 llamadas de IA, 1 perfil, 0 lecturas —
coincide con lo esperado) y que las secciones sin fuente real muestran "No instrumentado" tal como se
diseñó. No se guardó el archivo en `docs/revisiones/` (la plataforma del usuario pega las capturas
inline en el chat, no las adjunta como archivo) — evaluado a ojo en vez de con el subagente
`revisor-visual` formal; craft aceptable, consistente con el resto de la app.
✅ `SUPABASE_SERVICE_ROLE_KEY` configurada 2026-09-09 — el usuario la pegó él mismo en `.env.local`
(nunca se vio en el chat). Probada de verdad: un script temporal (creado y borrado en el momento, sin
imprimir la clave en ningún log) usó la Admin API de Supabase para crear un usuario de prueba, generar
su enlace de acceso, y borrarlo de nuevo — los 3 pasos funcionaron limpio. El usuario agregó la clave
también en Vercel (proyecto `amor-tarot`, el correcto — quedaron 3 proyectos de sobra en su cuenta de
Vercel de cuando fallé conectando el repo, sin usar, se pueden borrar cuando quiera) y probó "agregar
usuario" en producción: funcionó, creó la cuenta y devolvió un enlace.
⚠️ BUG REAL encontrado en esa misma prueba y corregido de inmediato: el enlace generado apuntaba a la
página principal (`redirect_to=https://amor-tarot.vercel.app`) en vez de a `/auth/callback` — la ruta
que intercambia el código por una sesión real. Sin ese redirectTo explícito en `generateLink()`,
Supabase usa el "Site URL" tal cual (la raíz), así que la persona hubiera abierto el enlace y quedado
en la landing SIN sesión iniciada — el enlace parecía funcionar pero no dejaba a nadie adentro.
Corregido en `app/api/admin/usuarios/route.ts`: `options: { redirectTo: `${origen}/auth/callback` }`,
usando el origin real de la request. Verificado con un script temporal (creado y borrado en el
momento) que el enlace generado ahora sí trae `redirect_to=.../auth/callback`. Publicado.

✅ CHECKPOINT — Panel de admin reestructurado en pestañas propias, 2026-09-09, a pedido del usuario
(sentía el Resumen "muy plano" y quería más variedad/gráficos). Nueva navegación en
`app/admin/AdminNav.tsx` (5 pestañas con ícono y color propio, reusando SOLO los acentos ya existentes
de la app — nunca colores nuevos): Resumen, Salud del dato (accent-3), Usuarios (accent-4), Operación
(accent), Negocio (accent-2, agrupa Conversión/Trial/Ventas/Ganancia/LTV-CAC ahí — no se les dio pestaña
propia a esas 5 porque hoy están todas vacías por igual, "no instrumentado"; llenar el nav de pestañas
en blanco no ayuda). Piezas compartidas movidas a `components/admin/ui.tsx` (Metrica, NoInstrumentado,
Seccion, hace) y nuevo `components/admin/GraficoBarras.tsx` (specs Tufte del propio pedido original:
sin sombras, sin relleno 3D, etiqueta directa al pasar el mouse, color = el acento de la sección).
Nueva función `admin_usuarios_por_dia()` (mismo patrón atómico/verificado que las otras RPCs admin) para
un gráfico real de registros nuevos en Usuarios — el segundo gráfico real del panel, junto al de costo
de IA que ya existía en Operación.
⚠️ BUG REAL encontrado y corregido verificando en vivo (con el usuario mirando el error al mismo
tiempo, en su propia captura): `AdminOperacionPage` (Server Component) le pasaba una función
(`formatear={(v) => ...}`) como prop a `GraficoBarras` (Client Component) — React no puede serializar
funciones cruzando ese límite, tira "Functions cannot be passed directly to Client Components". Se
corrigió calculando el texto ya formateado en el servidor (`valorFormateado` como string, no función) y
pasándolo como dato en vez de como callback — `PuntoBarra` ahora lleva `valorFormateado?: string`.
Explícitamente NO se agregaron animaciones 3D ni brillos decorativos que el usuario pidió — se le
explicó que eso es justo lo que las specs Tufte del pedido original piden evitar (hace los números más
difíciles de leer, no más fáciles); en cambio se usaron colores vivos ya existentes de la app +
entrada animada de las barras + números grandes con interpretación al lado.
Verificado: tsc/build limpios · las 5 pantallas revisadas visualmente con una página temporal de
solo-vista-previa (`app/dev-preview-temp/`, agregada a `PUBLIC_PATHS` solo mientras se revisaba, NUNCA
tocó el chequeo de admin real) — creada, usada, y borrada por completo en la misma sesión, junto con la
línea de `PUBLIC_PATHS`; confirmado con curl que las 5 rutas (`/admin`, `/admin/salud`,
`/admin/usuarios`, `/admin/operacion`, `/admin/negocio`) siguen protegidas y que la ruta temporal ya no
existe. Publicado.

✅ CHECKPOINT — Nueva sección "Bienestar" agregada 2026-09-09, a partir de un prompt externo que el
usuario pegó (pedía una sección "Rituales" con prácticas de amor/dinero/descanso/limpieza energética).
⚠️ Se detectó y se resolvió ANTES de construir un choque real con una decisión ya aprobada: la promesa
central dice explícitamente "sin ofrecer rituales o amarres" y `FICHA-AVATAR.md` prohíbe "lenguaje de
amarres/rituales" — el contenido original (baños para atraer el amor, velas de atracción, vaso de la
prosperidad) es justo eso. Se lo planteé al usuario con las 3 opciones (cambiar la promesa / no
agregarlo / reformular) y eligió **reformular**: mismo espíritu casero (agua, miel, canela, laurel,
velas, hierbas) pero el PORQUÉ de cada práctica es autocuidado propio — nunca atraer/retener a otra
persona ni causalidad mágica sobre dinero/energía. Se quitó la única práctica sin lectura de autocuidado
razonable ("sal en las esquinas de la casa") y se reemplazó por un hábito real ("10 minutos de orden").
Categorías reencuadradas: Amor→"Para tu corazón", Dinero→"Para tu enfoque con el dinero", Descanso→"Para
dormir mejor" (casi sin cambios, ya era neutral), Limpieza energética→"Para despejar tu espacio".
Detalle técnico: contenido en `lib/bienestar-data.ts` como dato ESTÁTICO (no tabla de Supabase) —
consistente con cómo vive el resto del contenido de tarot (`lib/tarot-data.ts`); es contenido fijo y
global, nadie lo crea/edita desde la app, así que una tabla habría sido complejidad sin beneficio. Nueva
pantalla `app/app/bienestar/page.tsx` (mismo patrón de estado local que `lecturas/page.tsx`: categorías
→ prácticas → detalle, sin rutas anidadas). NO se agregó como 5ta pestaña del nav inferior (ese nav
tiene un límite de 4 documentado a propósito en `BottomNav.tsx` — "5 tabs no cabe cómodo en 375px");
en vez de eso se agregó como 3ra fila en "Tu momento" del home, mismo patrón ya usado para
Compatibilidad. Sin color de acento nuevo (la ficha de arte reserva accent-2/3/4 para
lectura/compatibilidad/historial) — usa `--surface` neutro + `--accent` en los íconos, coherente con el
tono más calmado de la sección. Sin función de favoritos (se revisó y no existe ese patrón en ningún
otro lado de la app — no se inventó uno nuevo). Aviso legal fijo una sola vez en la pantalla de
categorías ("no sustituyen atención médica ni profesional"). Verificado: tsc/build limpios, probado en
vivo (categorías → detalle de una práctica con nota de seguridad visible en recuadro propio, y la
entrada desde Inicio). Sin pasada de `revisor-visual` (pantalla secundaria, no es de las 4 del dinero).
Ajuste de craft el mismo día, a pedido del usuario ("se ve muy plano"): las 4 tarjetas de categoría
pasaron de `--surface` neutro a color sólido, una por cada acento YA existente de la app (sin inventar
tonos — corazón→accent-4, dinero→accent-2, descanso→accent-3, espacio→accent), con íconos más
específicos del contenido (Flame/vela, Wallet, Moon, Wind) en un chip blanco. BUG REAL encontrado y
corregido en el mismo cambio: el texto y los números de paso sobre esos colores sólidos usaban un
color fijo (texto oscuro por defecto / blanco fijo) sin considerar que accent-2 y accent-3 son pasteles
claros (necesitan texto oscuro) y accent-4 necesita su tono AA propio (`--accent-4-ink`) — con blanco
fijo, "Para despejar tu espacio" (fondo lila oscuro) habría quedado con texto oscuro sobre oscuro, y
los números de paso en rosa/naranja/celeste habrían sido casi ilegibles. Se agregó un mapa
`INK_CATEGORIA` con el color de texto correcto por categoría. Verificado en vivo mirando el detalle de
una práctica en accent-4 (rosa, números oscuros legibles) y en accent (lila oscuro, números blancos
legibles).

✅ CHECKPOINT — GitHub + Vercel conectados, APP PUBLICADA EN INTERNET: 2026-09-08. Repo en
github.com/caspita-j/amor-tarot (privado/público según el usuario), conectado con push por SSH (llave
dedicada `~/.ssh/id_ed25519_amortarot`, solo para este proyecto). Proyecto de Vercel `amor-tarot` en el
equipo "Amor y tarot" (hobby), con las 4 variables de entorno cargadas (`ANTHROPIC_API_KEY`, `AI_MODEL`,
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) vía "Import .env" desde
`.env.local` — el usuario las cargó él mismo en el dashboard de Vercel, nunca se pegó ningún valor en
el chat. URL pública: **https://amor-tarot.vercel.app** — verificado en vivo: landing/onboarding/login
200, `/app` redirige a login si no hay sesión (protección real funcionando), las 78 imágenes de cartas
y el video cargan bien (se subieron completas vía git push, no hubo problema de tamaño).
⚠️ Nota técnica para la próxima sesión: la integración MCP de Vercel usada esta sesión (`list_projects`/
`get_project`) tiene un bug — nunca pudo ver el proyecto ni sus deployments desde las herramientas de
Claude, aunque el proyecto SÍ existe y funciona (confirmado en el dashboard del usuario). `create_git_project`
falló 4 veces seguidas con "git link no verificado" antes de funcionar por el dashboard directamente —
si se necesita tocar el proyecto de Vercel otra vez, ir directo al dashboard (vercel.com) en vez de
confiar en que las herramientas de Claude lo vean. Quedaron 3 proyectos vacíos/fantasma en el equipo de
Vercel del usuario (`amortarot-web`, `amor-tarot-app`, `amor-y-tarot`) — no hacen daño, se pueden borrar
cuando quiera desde el dashboard. Cada push a `main` en GitHub ahora despliega solo (CI/CD real).
⚠️ FIX — magic link/OTP mandaba a `localhost:3000` en vez de a la app publicada: la configuración de
Supabase Auth (Authentication → URL Configuration) todavía tenía el "Site URL" en localhost desde el
desarrollo local — nunca se actualizó al pasar a producción. Corregido por el usuario 2026-09-08:
Site URL → `https://amor-tarot.vercel.app`, Redirect URLs → `https://amor-tarot.vercel.app/**`. Si en el
futuro se agrega un dominio propio, este es el lugar donde también hay que actualizarlo (y agregar el
nuevo dominio a Redirect URLs sin borrar el de vercel.app, por si acaso).
⚠️ BLOQUEANTE conocido — el correo por defecto de Supabase (sin SMTP propio) tiene un límite de envíos
por hora muy bajo; ya se agotó probando el login en producción 2026-09-08 ("No pudimos enviarte el
correo"). Se decidió CON el usuario posponerlo: se resuelve junto con conectar dominio propio + Resend
(SMTP real) — no antes. Hasta entonces, el login por correo en producción puede fallar de forma
intermitente; no es un bug de código, es infraestructura de correo pendiente. Cuenta de prueba
`jonathancaspita@gmail.com` (id `92af52a2-7956-427e-a034-98ee277a3739`) quedó con una contraseña de
prueba puesta a mano en la base de datos (para un intento de login alterno que no se usó al final,
porque la app solo tiene UI de enlace mágico/código, sin campo de contraseña) — no representa un riesgo
real (es la cuenta de prueba del propio usuario) pero se puede limpiar (quitar `encrypted_password`)
cuando se conecte Resend y el login por correo vuelva a ser confiable.

⏸️ CHECKPOINT — Arte real de Canva integrado: LOS 22 ARCANOS MAYORES COMPLETOS. El usuario conectó
Canva a Claude (MCP), se generaron ilustraciones con simbología fiel al tarot Rider-Waite-Smith
tradicional (pedido explícito del usuario) en el estilo "Opción B" que él aprobó (línea fina, fondo
crema, marco doble, esquinas con sol, número romano, título). Las 3 últimas (El Sol, El Juicio, El
Mundo) se cerraron en esta sesión — en El Sol el usuario corrigió mi elección inicial pidiendo el
candidato con el sol de cara sonriente ("del sol deja esta"), ya reemplazado. Las 22 en
public/cartas-canva/ (JPG ~20-40KB c/u, 608KB en total). `IMAGENES_REALES` en lib/tarot-data.ts mapea
nombre→imagen; TarjetaTarot (components/onboarding/ui.tsx) muestra la imagen real cuando existe y cae
al ícono abstracto de SimboloCarta cuando no — nunca queda un hueco vacío. El nav inferior sigue
usando los íconos abstractos (la imagen completa no cabe bien en un ícono chico). El Mundo tuvo una
ronda extra: el marco que devolvió Canva no traía la mini-estrella de esquina que sí tienen las otras
21 cartas (el resto del marco — línea doble y margen — ya coincidía). En vez de regenerar toda la
ilustración (arriesgaba perder la corona cerrada y los 4 guardianes que ya le habían gustado al
usuario), se corrigió con edición de imagen local (PIL): se dibujaron las 4 estrellitas en las
posiciones exactas medidas de El Sol, sin tocar ningún otro píxel — el usuario confirmó el resultado
("exacto muy bien"). Verificado en vivo (las 3 últimas + tsc limpio). Nota técnica para próximas
generaciones en Canva: evitar la palabra "child"/"niño" en los prompts — dispara un rechazo de
seguridad de contenido genérico sin motivo explícito; usar "figure"/"figura" en su lugar (aprendido
con El Sol y El Juicio).

✅ CHECKPOINT — Arte real de Canva: MAZO COMPLETO DE 78 CARTAS (22 Mayores + 56 Menores, las 4 suits
Copas/Espadas/Bastos/Oros a 14/14 c/u, corte de Oros terminada: Sota, Caballo, Reina, Rey). Mismo
estilo y marco (línea doble + 4 estrellas de esquina) en las 78. IMAGENES_REALES en lib/tarot-data.ts
tiene 78 entradas (verificado por grep). tsc --noEmit limpio + `next build` limpio (15 rutas
estáticas generadas sin errores). No queda ninguna carta pendiente de generar.
Siguiente paso sugerido (no iniciado, sin pedido explícito del usuario): certificación visual de la
landing/onboarding/paywall con el subagente revisor-visual, por convención de la Regla 7 del SO.

✅ CHECKPOINT — Sesión 7 (certificación visual) CERRADA: landing, onboarding y paywall pasaron por 5
rondas completas de generar→revisar-con-revisor-visual→corregir→re-revisar en esta sesión (sumadas a
las rondas de una sesión anterior — 9/10/11 pasadas acumuladas por pantalla, ver "Problemas conocidos"
para el detalle completo). Se corrigieron >30 defectos reales y verificables — truncamiento de copy,
dobles biseles en imágenes, elementos táctiles sin función, footer/garantía mal ubicados, botones sin
estado de carga, focus-visible ausente, alineación de cartas, integración de color, un bug real de
z-index que ocultaba los gradientes de profundidad en onboarding Y paywall, falta de animación entre
los 11 pasos del onboarding (agregada), nombre del mecanismo ausente en el paywall (agregado), tokens
de diseño de la landing casi idénticos entre sí (corregidos con cálculo WCAG). Resultado final:
landing 31/40·14/20·18/20, onboarding 35/40·15/20 (a 1 punto del gate en cada eje), paywall
33/40·14/20·18/20 — ninguna alcanza el gate (≥36/40, ≥16/20, copy sin eje ≤2), pero las 3 mejoraron de
forma real y medible sesión a sesión (no varianza). Lo que queda para las 3 ya no es corregible con
código hoy: onboarding necesita 1-2 rondas más de pulido de craft; landing y paywall necesitan assets
y datos que no existen todavía (mockup de una cita real del usuario, prueba social real — la app no se
ha lanzado, inventar cifras/testimonios está PROHIBIDO —, y el logo real). Decisión: PAUSAR el
revisor-visual en las 3 — no se declaran "listas". tsc --noEmit y `next build` limpios con todos los
cambios. Verificado en vivo con Playwright (flujo completo end-to-end, incluidos los atajos de teclado
nuevos) tras cada ronda. Próxima sesión de certificación: empezar por onboarding (la más cerca), y
retomar landing/paywall recién cuando existan el logo real y los primeros datos de uso reales.
Aprendizajes técnicos de esta ronda (para las próximas cartas/sesiones):
- El prompt necesita pedir el marco de forma MUY explícita ("hairline rectangle... segunda línea
  inset 15-20px... 8-point sunburst en las 4 esquinas... plain sharp rectangle corners") — sin esa
  insistencia Canva a veces devuelve marco de una sola línea, sin estrellas, con adornos que no
  pegan (iconos dorados, sol arriba, bordes redondeados) o con un numeral de sobra (las menores NO
  llevan numeral). También pedir "outline only, no solid black fills" — si no, algunas figuras
  (capas, siluetas) salen rellenas de negro sólido, fuera de estilo.
- Cuando el candidato elegido tiene el contenido correcto pero el marco le falta una o más estrellas
  de esquina (o le falta la segunda línea del marco doble), NO regenerar: se corrige más rápido y
  más barato con edición de imagen local (PIL) — mismo patrón usado en El Mundo. El flujo: exportar
  PNG a 1000×1414 → medir con numpy la posición real de las líneas del marco en ese archivo
  específico (varía carta a carta, no asumir siempre los mismos píxeles) → dibujar la(s) estrella(s)
  o línea faltante → recién ahí comprimir a 360px y guardar en public/cartas-canva/.
- Plantilla de prompt que SÍ funciona bien queda de referencia en el historial de esta sesión (carta
  "Tres de Copas", segundo intento, y "Cinco de Copas"/"Cuatro de Copas", que pedían explícitamente
  "outline only" + conteo exacto de elementos).
El usuario cambió de cuenta de Canva a mitad de la Sesión 5 y "Caballo de Copas" salió perfecto al
primer intento (marco + contenido). Siguiente carta: Reina de Copas, mismo orden dentro de cada palo:
As→10, Sota, Caballo, Reina, Rey; palos en orden Copas → Espadas → Bastos → Oros.

⏸️ CHECKPOINT — Carrusel "Así se ve por dentro" de la landing: 3 de los 4 placeholders (gris con
nombre de pantalla) se reemplazaron por SCREENSHOTS REALES de la app ya construida (pedido explícito
del usuario, señalando el carrusel con capturas de referencia). Capturados con Playwright MCP (no con
el navegador de Claude — sus clics quedaron colgados/timeout toda la sesión, tecla y JS sí funcionaron;
si vuelve a pasar, usar Playwright como respaldo) navegando el flujo real: formulario de situación con
texto de ejemplo, resultado con 3 cartas (se repitió el sorteo unas pocas veces hasta que salieron
2-3 cartas con arte real de Copas y ninguna invertida, para la mejor imagen de marketing). El 2do
frame ("Saca tus 3 cartas") se ajustó de nuevo por pedido del usuario: ya no es un screenshot crudo
de la pantalla completa (cartas + texto de la lectura) sino una composición hecha con PIL — se
recortó SOLO la fila de las 3 cartas con sus etiquetas (Tú / la otra persona / La Dinámica, sin el
botón Volver ni el párrafo de la lectura) y se centró sobre un lienzo blanco de 320×694 (la misma
proporción 9:19.5 del marco del carrusel), para que el object-cover del componente no recorte nada
importante. Esta vez el sorteo salió con LAS 3 CARTAS con arte real al primer intento útil (La Rueda
de la Fortuna, La Fuerza, Ocho de Copas), gracias a que ya hay más palos con arte real (Copas
completo + Espadas 1-7). El 3er
frame se rehízo por pedido del usuario: en vez de "Tu lectura" (mostraba Reina de Copas sin arte real
todavía), ahora es la pantalla de Compatibilidad de signos (Escorpio + Piscis) con el PORCENTAJE
desenfocado (gaussian blur + velo del color de acento, aplicado con PIL sobre el screenshot real) —
efecto de curiosidad a propósito ("¿qué tan compatibles somos?"), pedido explícito del usuario para
generar más ganas de descargar/pagar. Guardados en public/landing-app-situacion.jpg, -cartas.jpg,
-lectura.jpg (320px de ancho, ~17-55KB c/u) y conectados en app/page.tsx → AppPorDentro →
frames[0..2].src (label del 3er frame: "Descubre qué tan compatibles son"). El 4to frame (Inicio) ya
tenía screenshot real de antes. Verificado en vivo deslizando el carrusel completo + tsc limpio.
⚠️ Esto resuelve PARCIALMENTE el techo estructural anotado en "Problemas conocidos" (veredicto:landing):
las 4 pantallas del carrusel ya tienen screenshot real, pero el veredicto formal del revisor-visual
para landing/onboarding/paywall sigue pendiente y pausado hasta la Sesión 7 (sin cambios en esa
decisión) — no declarar la landing "lista" solo por esto.

⏸️ CHECKPOINT — Sesión 5 (App interna) CERRADA: shell de 4 tabs + Inicio (ritual diario M0+M4) +
Lecturas (flujo central) + Historial + Perfil, con logo del usuario como favicon/ícono de app (SOLO
ahí, confirmado — ver "Decisiones del usuario"), animación Lottie del usuario en el loading de
Lecturas (diferida) y una bola de cristal animada junto al saludo de Inicio. Compila limpio.

⚠️ FIX DE SEGURIDAD (encontrado por el usuario probando la app): alguien escribió sobre haber sido
golpeada por su pareja y el mock le devolvió consejo genérico de tarot. `esSituacionDeCrisis()` en
lib/tarot-data.ts corta el flujo ANTES de barajar cartas y muestra un mensaje de cuidado + línea de
emergencia (911) — nunca "consejo de tarot" ahí. IMPORTANTE para la Sesión 6: este piso de seguridad
tiene que preservarse o mejorarse cuando se conecte el mecanismo real — nunca regresar a una versión
que no lo tenga.

⏸️ CHECKPOINT — Mazo de tarot COMPLETO: 78 cartas (22 Arcanos Mayores + 56 Menores), a pedido del
usuario, contenido verificado contra 2 fuentes reales (tradición Rider-Waite-Smith 1910, dominio
público — no un mazo comercial). Cada carta tiene significado derecho E invertido en
lib/tarot-data.ts; las lecturas usan orientación real (~35% invertida por carta) y TarjetaTarot gira
la carta 180° cuando sale invertida (fiel a como se lee una carta real) + etiqueta "· invertida".
Íconos: los 22 mayores tienen símbolo propio (Venus, Marte, balanza, reloj de arena, etc.); los 56
menores reusan el símbolo de su PALO (copa/espada/vara/moneda — el número ya lo dice el nombre debajo,
como en un mazo real simplificado) — mismo lenguaje visual abstracto ya aprobado, NO ilustraciones
figurativas como la referencia que mandó el usuario; se le explicó que eso está fuera de lo que se
puede dibujar bien a mano vía SVG, y quedó de acuerdo en usar Canva más adelante para subir el nivel
de arte cuando quiera (él diseña/consigue las imágenes, yo las integro — mismo patrón que el logo y
el GIF). Lecturas ahora baraja del mazo completo de 78, no solo mayores; la carta del día (Inicio)
se queda solo con los 22 mayores a propósito (ritual diario más gentil). Verificado en vivo: los 4
símbolos de palo se ven claros, y una lectura real sacó 2 cartas de Copas + 1 de Bastos con su
contenido correcto. Compila limpio. Siguiente acción exacta: Sesión 6 (Supabase, IA real, Hotmart).

## Qué es esta app (3 líneas máximo)
Tarot situacional que interpreta la duda o crisis de pareja real de la persona (no cartas genéricas),
con IA en el backend pero SIN mencionar "IA" en marca/copy — se vende como una experiencia de tarot
cálida y precisa. Público: cualquier persona de 22-38 años en LATAM/hispano-EE.UU. viviendo una duda
sentimental. Monetización: freemium con trial de 3 días y suscripción mensual/anual transparente.

## Promesa central
"Esta app ayuda a quienes viven una duda o crisis de pareja a recuperar la calma en minutos, sin
cobros a traición ni anuncios que interrumpan, mediante lecturas de tarot que leen su situación real y
le dicen qué hacer hoy — sin prometer resultados garantizados, sin ofrecer rituales o amarres, y sin
presionar ni asustar."

## Reporte de validación (Sesión 1)
- Veredicto: Viable con ajustes — mercado grande y en crecimiento, pero saturado en "tarot + IA"
  genérico (33+ competidores); la salida es nichar 100% en relaciones de pareja.
- Apps de referencia: Nebula (cobros engañosos $42-69/mes), Faladdin (exceso de anuncios), Co-Star
  (tono frío/críptico)
- Brecha LATAM confirmada: sí — mercado hispano desatendido en el sub-nicho "tarot de relaciones" con
  precio transparente

## Dirección de Arte (Sesión 2 — CERRADA)
- FICHA-ARTE.md: SÍ, aprobada 2026-08-27
- Resumen: fondo #FFFFFF · acento app interna #8D7FEF · acento CTA landing #6E5EE5 (AA) · Display
  "Baloo 2" · Body "Mulish" · radio 26px cards / 999px píldora · dispositivo ownable: aro medidor con
  el nombre de la carta del día — se repite ahora en el mini-ring de cada Kicker de la landing, en el
  loading y en el resultado del onboarding, y en el paywall
- REGISTRO ANTI-REPETICIÓN: paleta lila/naranja/azul/rosa + par Baloo 2/Mulish — vetados para el
  próximo proyecto del SO

## Avatar y venta (Sesión 1 — cerrada)
- FICHA-AVATAR.md: SÍ, aprobada 2026-08-27
- Resumen: persona de 22-38 años (cualquier género) en duda/crisis de pareja · dolor #1: "me estoy
  volviendo loca revisando sus redes" · deseo #1: "saber si realmente piensa buscarme" · nivel de
  consciencia 4/5 · sofisticación: mercado saturado, requiere ángulo de mecanismo, no promesa genérica

## Estrategia de monetización (Sesión 1, precio ajustado por el usuario en Sesión 3 — NO cambiar sin validar)
- Modelo: Freemium con trial de 3 días → paywall dentro del onboarding (Modelo 2, onboarding-first)
- Pricing vigente: mensual $6.99 USD · anual $43.99 USD/año ($3.66/mes, "ahorras casi 6 meses al año")
- Garantía: "la Garantía de los 7 Días" (reembolso si no sirvió) — PROVISIONAL, ver Problemas conocidos
- Puente del trial D1-D7: pendiente de diseñar (Sesión 5, con la app interna ya construida)

## Loop de retención (definido en Sesión 4 — HOOKED)
- Gatillo: hora del día que la persona marcó en el onboarding (paso "momento del día") + racha
- Acción: sacar 3 cartas o revisar la carta del día
- Recompensa: la lectura cita sus propias palabras + un paso concreto (variable, nunca genérica)
- Inversión: el texto que escribe sobre su situación + su historial de lecturas guardado — cuanto más
  cuenta, más precisa se siente la próxima lectura (aunque el mecanismo real no reentrena nada todavía:
  la sensación de inversión es real, la personalización profunda es trabajo de Sesión 6+)
- Mecánica elegida: carta del día (ritual matutino) + racha, sin XP ni ligas — encaja con el tono
  íntimo del nicho, no gamificación competitiva

## Secuencia maestra de construcción
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: CONSTRUIDA — protagonista: hero + oferta · CTA primario: "Sacar mis 3 cartas"
- Onboarding: CONSTRUIDO — 5 preguntas + reconocimiento + loading + resultado personalizado
- Paywall: CONSTRUIDO — responde las 7 preguntas de 02B, plan anual preseleccionado
- Login/Auth: CONSTRUIDO (mock) — magic link/OTP primario + Google secundario, sin Supabase todavía
- App interna: CONSTRUIDA — Inicio (ritual diario) + Lecturas (flujo central) + Historial + Perfil
- Servicios externos (Supabase, IA real, Hotmart, dominio): pendiente — Sesión 6

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js (App Router) · Stack: Next.js + Supabase (EN PROGRESO, ver abajo) + IA por servidor
- IA de texto (Sesión 6, CONECTADA — 2026-09-07): Anthropic, modelo `claude-sonnet-5` en env var
  `AI_MODEL` (investigado contra Haiku 4.5: Sonnet gana en matiz emocional para el caso de uso —
  lectura personal que cita literalmente al usuario — y además quedó más barato que la referencia
  vieja del SO de Sonnet 4.6, $2/$10 vs $3/$15 por millón de tokens). Endpoint BFF en
  app/api/lectura/route.ts, streaming, la clave vive SOLO en .env.local/servidor. El SORTEO de las
  3 cartas sigue siendo aleatorio en el cliente (lib/tarot-data.ts → sortearCartas) — la IA solo
  escribe la interpretación, nunca decide qué carta sale. Guardrail de crisis (esSituacionDeCrisis)
  se corre ANTES de llamar a la IA, tanto en el cliente como de nuevo en el servidor (defensa en
  profundidad) — si detecta crisis, nunca se le manda nada a la IA.
- Auth: magic link/OTP por correo (combo enlace+código, PRIMARIO) + Google OAuth como mejora
  secundaria — decidido en Sesión 4, CONECTADO a Supabase Auth real 2026-09-07 (`app/login/page.tsx`).
  Google OAuth queda con el código listo pero SIN activar el proveedor en el dashboard de Supabase
  todavía (falta crear las credenciales en Google Cloud) — el botón no va a funcionar hasta ese paso.
- Límite de gasto de la IA (2026-09-08, hallazgo de auditoría cerrado): `app/api/lectura/route.ts`
  exige sesión real (401 si no hay) y llama a la función `public.registrar_lectura_ia()` (RPC
  security definer en Supabase) ANTES de generar — máximo 10 lecturas/hora y 30/día por persona,
  verificado y registrado en una sola transacción atómica (evita el race condition de "leer→decidir
  en JS→escribir"). Tabla `public.ai_calls` (user_id, costo_usd, created_at) con RLS, solo
  lectura propia, sin política de INSERT directo (solo vía la función). El proxy (`lib/supabase/proxy.ts`)
  NO redirige rutas bajo `/api/*` a /login (rompería al cliente que espera JSON/streaming) — cada
  ruta de API valida su propia sesión y responde 401 en JSON. Tope global: el usuario cargó $5 en la
  consola de Anthropic (~800 lecturas) — ESE saldo ya es el techo real, no se configuró un límite de
  gasto separado porque no puede superarlo. Avisar al usuario para recargar antes de necesitarlo.
- Modelo de datos real para Supabase (reemplaza el borrador viejo de `readings`/`subscriptions`, que
  no correspondía a lo que se construyó): `profiles` (1:1 con auth.users — nombre, signo,
  otra_persona_nombre, otra_persona_signo, racha_dias, racha_ultima_fecha, foto_url) y `lecturas`
  (user_id, situacion, cartas jsonb, resumen, fotos — array de URLs de Storage, NO base64). RLS con
  `(select auth.uid())` en ambas, política por comando (25-BASE-DE-DATOS.md). Fotos (perfil y de
  lecturas) van a Supabase Storage con URL firmada, nunca como base64 en una columna — eso es la
  Etapa 3 del plan de Supabase.
- Arquitectura de IA: generación de texto SÍNCRONA con streaming (lecturas cortas, <10s) — el paso de
  loading del onboarding ya está diseñado para ese tiempo de espera real
- Traspaso de datos onboarding→paywall→login: HOY sessionStorage del navegador (sin cuenta todavía) —
  se reemplaza por Supabase real en 3 etapas (Etapa 1: auth real · Etapa 2: lecturas/racha/perfil en
  Postgres · Etapa 3: fotos en Storage) — arrancado 2026-09-07, ver Sesión en progreso.
- Features del MVP en orden: 1) generador de lectura de 3 cartas contextual 2) formulario de situación
  + pregunta libre 3) compatibilidad de signos 4) carta del día / historial
- Fuera del MVP: chat de voz, lecturas con astrólogos humanos, venta de amuletos físicos

## Sesiones completadas ✅
- Sesión 1 — Validación de mercado, FICHA-AVATAR, FICHA-MERCADO, monetización — 2026-08-27
- Sesión 2 — Identidad visual: FICHA-ARTE.md aprobada — 2026-08-27
- Sesión 3 — Landing construida (10 secciones + ajustes pedidos por el usuario) — 2026-08-28
- Sesión 4 — Onboarding (5 preguntas + resultado) + Paywall (7 preguntas de 02B) + Login (magic
  link/OTP + Google, mock) — 2026-08-28
- Sesión 5 — App interna: shell de 4 tabs + Inicio (ritual diario M0+M4) + Lecturas (flujo central)
  + Historial + Perfil — 2026-08-31

## Sesión en progreso 🔧
- Sesión 6 (Integraciones reales), arrancada 2026-09-07. IA real de texto: LISTA (ver Decisiones
  técnicas). Supabase Etapa 1 (auth real): LISTA — proyecto creado por el usuario (ref
  `bevnbpphapljvkmpnoaf`), login conectado a Supabase Auth (magic link/OTP + Google, `app/login/page.tsx`),
  proxy de sesión (`proxy.ts` + `lib/supabase/proxy.ts`, patrón Next 16) protegiendo `/app` y sus rutas
  de datos. Control de versiones (git) activado 2026-09-08 — primer commit hecho, identidad de git
  configurada SOLO para este repo (no global). Auditoría `/auditoria --rapido` corrida 2026-09-08
  (6.5/10) y re-corrida 2026-09-08 tras los fixes (7.5/10) — los 2 hallazgos críticos de la primera
  pasada (endpoint de IA sin protección, sin control de versiones) ya resueltos.
- 2026-09-08 — Supabase Etapa 2 (lecturas/racha/perfil en Postgres) LISTA: la app interna ya NO usa
  sessionStorage para racha/perfil/lecturas — pedido explícito del usuario ("avanza") tras la
  re-auditoría. Migración `crear_perfiles_y_lecturas` (+ `restringir_handle_new_user` para cerrar un
  hallazgo del linter de seguridad sobre esa función): tabla `profiles` (1:1 con `auth.users` —
  nombre, signo, otra_persona_nombre, otra_persona_signo, racha_dias, racha_ultima_fecha, foto_url
  todavía NULL) con RLS (`select_own`/`update_own`/`insert_own`) y un trigger `on_auth_user_created`
  que crea la fila automáticamente al registrarse; tabla `lecturas` (user_id, situacion, cartas jsonb,
  resumen, fotos text[] — todavía data URLs, Etapa 3 las mueve a Storage) con RLS
  (`select_own`/`insert_own`/`delete_own`) e índice `(user_id, created_at desc)`. Nueva función
  `registrar_dia()` (RPC security definer, mismo patrón atómico que `registrar_lectura_ia()`: hace el
  insert-if-missing del perfil + el incremento de racha en una sola transacción, usa
  `(now() at time zone 'utc')::date` para alinear con `hoyISO()` del cliente que también es UTC) —
  preserva el comportamiento exacto de la racha mock anterior (siempre +1 si no es el mismo día, sin
  detectar huecos/días saltados — no se tocó esa lógica, fuera de alcance de esta tarea).
  Nuevo `lib/supabase/datos.ts`: capa de datos real (leerPerfil, sincronizarOnboardingSiHaceFalta —
  copia las respuestas del onboarding hechas ANTES de tener cuenta a la fila real, una sola vez y solo
  si el perfil sigue vacío, para no pisar ediciones futuras —, actualizarPerfil, registrarDia,
  guardarLecturaReal, leerLecturasReales). Conectadas las 4 pantallas: `app/app/page.tsx` (Inicio),
  `app/app/lecturas/page.tsx` (guardar lectura ahora es async con estado de carga),
  `app/app/historial/page.tsx`, `app/app/perfil/page.tsx`. `lib/estado-app.ts` se redujo: se eliminó el
  código muerto de racha/lecturas en sessionStorage (ya no lo usa nadie) — solo quedan
  `leerOnboarding` (onboarding pre-cuenta) y las funciones de foto de perfil (sin cambios, Etapa 3
  pendiente). BUG REAL encontrado y corregido de paso: "Cerrar sesión" en Perfil solo limpiaba
  sessionStorage, nunca invalidaba la sesión real de Supabase (`auth.signOut()` faltaba) — con auth
  mock esto no se notaba, con auth real dejaba la cookie de sesión viva.
  Verificado: tsc/build limpios · `get_advisors` de seguridad limpio (solo quedan los 2 RPC
  intencionalmente expuestos a `authenticated` + el interruptor de contraseñas filtradas, ya conocido)
  · probado el flujo completo con SQL simulando RLS como el usuario de prueba real
  (`92af52a2-…`, `jonathancaspita@gmail.com`): `registrar_dia()` crea el perfil solo, sube la racha a 1
  sin duplicar en una segunda llamada, insertar una lectura funciona, y un usuario distinto (uuid al
  azar) NO puede verla — RLS confirmado. Dato de prueba de la lectura limpiado después; el racha_dias=1
  del usuario de prueba se dejó (es un estado real válido, no hace falta revertirlo).
  Etapa 3 (fotos en Storage) sigue sin empezar — perfil y fotos de lecturas siguen en sessionStorage
  como data URLs, documentado explícitamente en los comentarios de los archivos que la tocan.
- 2026-09-08 — Pantalla principal (Inicio), primera pasada de `revisor-visual` (nunca se había
  certificado, es una de las 4 del dinero por Regla 7): 27/40 usabilidad, 11/20 craft, NO LISTA. 5
  defectos: (1) el flip de `TarjetaTarot` no animaba al montar ya revelada (mismo bug de Framer Motion
  ya visto en onboarding — `revelada` sin `initial` no anima si arranca en `true`), (2) radio
  inconsistente (`rounded-2xl` en vez de `--radius-card`) en RachaBanner y las 2 tarjetas de categoría,
  (3) esas mismas tarjetas sin la sombra tintada que exige FICHA-ARTE.md, (4) la tira de la semana
  (`SemanaStrip`) mostraba 6 círculos rellenos con apariencia de botón que no hacen nada, (5) sin
  stagger de entrada, sin `whileTap` en el botón de racha, sin celebración de hitos de racha. Aprobados
  los 5 por el usuario ("si arreglalos") y corregidos en esta sesión: `app/app/page.tsx` (estado
  `cartaRevelada` + `useEffect` con el mismo patrón de onboarding, `motion.div` con stagger en toda la
  pantalla, radio y sombra tintada en las 2 tarjetas), `components/app/RachaBanner.tsx` (radio
  consistente, `whileTap` en el botón, celebración de hito con Sparkles en 3/7/14/30/60/100 días),
  `components/app/SemanaStrip.tsx` (los 6 días que no son hoy ya no llevan fondo de píldora, solo el
  círculo de "hoy" se ve interactivo). tsc/build limpios tras cada cambio. Screenshot nuevo compuesto
  (mismo método anti-artefacto de `fullPage` con el nav fijo) en `docs/revisiones/app-inicio-375.png`.
  Re-revisión de `revisor-visual`: 30/40 usabilidad, 13/20 craft — mejora real (27→30, 11→13) pero
  SIGUE NO LISTA (gate ≥36/40 y ≥16/20). 5 defectos nuevos encontrados: (1) los 3 textos de la tarjeta
  "Carta del día" (label, "Energía de hoy", el párrafo interpretativo) usan `color-mix` muy transparente
  sobre el fondo `--accent` → contraste ~3-3.6:1, no pasa AA 4.5:1 — el texto de más valor de la
  pantalla se ve deslavado; (2) el fondo de toda la pantalla es `--bg` blanco plano, sin usar los
  tokens `--surface`/`--surface-2` que ya existen en tokens.css — falta el 3er nivel de profundidad;
  (3) cambiar de tab en el `BottomNav` es un corte seco, sin transición (`app/app/layout.tsx` no tiene
  `template.tsx`/`AnimatePresence`); (4) ningún número héroe (el % del `AroMedidor`, los días de racha)
  cuenta animado desde 0; (5) la tira de la semana no tiene navegación ← → a semanas previas ni enlace
  al Historial. Veredicto completo en `docs/revisiones/app-inicio-veredicto.md`. Usuario aprobó
  ("si sigue con esos defectos") y se corrigieron los 5: (1) los 3 textos de la tarjeta acento pasaron
  a `var(--bg)` sólido (blanco puro da ~4.78:1 sobre `--accent` #6e5ee5 — sí pasa AA; se verificó el
  cálculo de contraste antes de aplicar); (2) `app/app/layout.tsx` ahora tiene un gradiente radial sutil
  (`--accent` al 14%) detrás del header; (3) nuevo `app/app/template.tsx` (se remonta en cada
  navegación de Next — ahí es donde va la transición entre tabs, `layout.tsx` no remonta) con
  fade+slide de 250ms; (4) nuevo componente `components/app/NumeroAnimado.tsx` (cuenta con
  requestAnimationFrame desde el valor previo, respeta `prefers-reduced-motion`) conectado a la racha
  en `RachaBanner.tsx` y al 74% en `AroMedidor.tsx`; (5) `SemanaStrip.tsx` ganó el rótulo visible
  "ESTA SEMANA" y los días que no son hoy perdieron toda apariencia de botón — se decidió NO agregar
  navegación a semanas pasadas: el Historial guarda lecturas de pareja (otro tipo de dato), no el
  ritual diario, así que no hay una vista de calendario real que enlazar todavía (documentado también
  en el comentario del archivo). tsc/build limpios. Screenshot re-compuesto en
  `docs/revisiones/app-inicio-375.png`. 3ª pasada de `revisor-visual`: 29/40 usabilidad, 14/20 craft —
  SIGUE NO LISTA. 5 defectos: (1) BUG REAL encontrado — `AroMedidor` se montaba SIEMPRE con
  `revelada={false}` (grep confirmó que es el único uso del componente): el relleno del aro al 74% y
  su conteo animado nunca corrían porque `registradoHoy` pasaba a `true` de inmediato al tocar,
  sustituyendo el aro por `TarjetaTarot` antes de que la animación arrancara; (2) contraste ~3.7:1 en
  los chips "Situación"/"Rápido" (texto y fondo ambos con opacidad reducida, componen mal); (3) sin
  navegación en `SemanaStrip` (mismo punto ya documentado arriba, decisión consciente); (4) las 2
  tarjetas de "Tu momento" compiten con el mismo peso visual sin una jerarquía clara entre ellas; (5)
  `registrarHoy()` en `lib/estado-app.ts` escribía en sessionStorage sin try/catch (a diferencia de
  `guardarFotoPerfil`, que sí lo tiene). Corregidos (1), (2) y (5): el tap ahora primero deja el aro
  visible con `revelada=true` ~900ms (se ve relleno + el número contando 0→74) y RECIÉN después
  registra el día y cambia a `TarjetaTarot` (antes el cambio era instantáneo) — verificado en vivo
  midiendo el DOM a los 200ms del tap (aro presente, contando "44%" a mitad de camino) y a los 900ms
  (ya cambiado, racha registrada); los chips pasaron a fondo/texto sólidos; `registrarHoy()` ahora
  tiene el mismo try/catch que el resto de `estado-app.ts`. tsc/build limpios, screenshot
  re-compuesto. (3) y (4) quedan SIN resolver a propósito — son llamadas de diseño/alcance (agregar
  una vista de calendario real, o rediseñar la jerarquía del grid de 2 tarjetas) que no son un fix
  rápido de código y no se tomaron unilateralmente; quedan pendientes de que el usuario decida si
  seguir invirtiendo en esta pantalla o pausarla aquí (mismo patrón que landing/onboarding/paywall,
  ver Problemas conocidos) antes de gastar otra pasada cara de `revisor-visual`.
  Usuario pidió resolver SOLO (4): las 2 tarjetas de "Tu momento" pasaron de un grid de 2 columnas
  iguales a una jerarquía real — "Tu lectura de pareja" (el mecanismo central de la app, "El Espejo de
  las 3 Cartas") ahora es la tarjeta principal, más grande (min-h-32, ícono ArrowRight, título text-base),
  y "Compatibilidad" bajó a una fila secundaria compacta (ícono en círculo + ChevronRight, texto más
  chico) debajo — mismo componente `Link`, tratamiento visual claramente distinto. tsc/build limpios,
  verificado en vivo (Playwright, viewport 375px) y screenshot re-compuesto en
  `docs/revisiones/app-inicio-375.png`. (3) — SemanaStrip sin navegación a semanas pasadas — sigue
  documentado y sin resolver, a la espera de que el usuario lo pida explícitamente (necesita guardar
  historial diario del ritual, que no existe hoy). Sin nueva pasada de `revisor-visual` todavía (el
  usuario pidió resolver solo este punto, no re-certificar) — pendiente decidir si vale la pena una 4ª
  pasada o dejarla pausada como las otras 3 pantallas del dinero.

## Próximas sesiones 📋
- Terminar Sesión 6: Hotmart, Vercel, dominio, auditoría de seguridad (lo de Supabase/IA ya está
  arrancado, ver arriba)
- Sesión 7: Testing, pulido y certificación final (incluye re-certificar la landing con screenshots
  reales de la app ya construida)
- Sesión 8: Adquisición y lanzamiento

## Problemas conocidos ⚠️
- FICHA-MERCADO.md tiene campos "NO ENCONTRADO" (medios de pago LATAM, conversión típica) — se
  completan al elegir pasarela en Sesión 6, no bloquean nada hasta ahí
- garantía / FICHA-MERCADO: "la Garantía de los 7 Días" está PROVISIONAL — al elegir la pasarela real
  en Sesión 6, verificar que admite reembolso a ≥7 días; si no, ajustar el número aquí y en el copy
  (landing y paywall) antes de vender
- veredicto:landing — 9 pasadas acumuladas (4 de una sesión anterior + 5 de esta sesión). Progreso de
  esta sesión: 28→29→31→31→31/40 usabilidad, 13→11→14→14→14/20 craft, 17→18→18→18/20 copy. Bugs REALES
  corregidos: subtítulo del hero truncado a mitad del nombre del mecanismo, hero y carrusel con
  teléfono-dentro-de-teléfono (bisel doble), fila de "Tipos de lectura" con flecha sin función, CTA con
  3 etiquetas distintas, secciones fundidas sin separador, --surface casi idéntico a --bg y
  --text-tertiary duplicando --text-secondary en tokens.css (ahora --surface: #f2edfa, --text-tertiary:
  #77708a — verificado con cálculo WCAG, incluido el caso borde de texto tertiary sobre superficie
  elevada en Garantia.tsx). Techo real, no más fixes de código posibles hoy: (1) ningún frame del
  carrusel muestra la IA citando entre comillas una frase real del usuario (el diferenciador central
  de FICHA-AVATAR.md) — necesita un mockup/asset nuevo; (2) los frames "Tu situación" y "Compatibilidad"
  del carrusel son capturas reales de pantallas cortas, quedan con la mitad inferior vacía sin importar
  el recorte — arreglarlo de raíz implica rediseñar esas 2 pantallas de la app, no la landing; (3) la
  franja de prueba social del hero ("Cero anuncios · Cero cobros ocultos...") son promesas de política,
  no un número/testimonio real — la app no se ha lanzado, no hay dato real que poner y está PROHIBIDO
  inventar uno. Estancada en 31/40 · 14/20 — no pasa el gate (≥36/40, ≥16/20).
- veredicto:onboarding — 10 pasadas acumuladas (5 de una sesión anterior + 5 de esta sesión). Progreso
  de esta sesión: 28→30→32→33→35/40 usabilidad, 12→13→13→15→15/20 craft — mejora sostenida y real en
  cada ronda, no varianza. Bugs REALES corregidos: alineación de las 3 etiquetas de carta (descuadre de
  ~80px), integración visual de la carta con arte real (borde + halo compartido con las 2 dorso),
  sessionStorage sin manejo de error (ahora con try/catch + console.warn), hueco vertical de ~140px
  bajo "volver", botón sin estado pendiente (ahora con spinner Loader2), ícono "←" de texto → SVG,
  fade decorativo que no ocultaba nada real, AnimatePresence entre los 11 pasos (antes corte duro —
  causa raíz real: bug de z-index en el gradiente de fondo, `-z-10` dentro de un `<main>` sin contexto
  de apilamiento propio lo pintaba invisible; corregido a `z-0`/`relative z-10`), Enter para avanzar en
  los inputs de texto (Cmd/Ctrl+Enter en el textarea), párrafo de interpretación acortado de 6 a 4
  líneas, palabra en acento en el título ("3 cartas"). A 1 SOLO PUNTO del gate en cada eje (35/40,
  15/20 — se exige ≥36/40 y ≥16/20). Lo que queda son matices de craft (jerarquía del título, remate
  visual del momento de revelar la carta) — con más presupuesto probablemente cruza el gate en 1-2
  rondas más; no se hizo una 6ª pasada esta sesión por longitud de sesión, no por rendimientos
  decrecientes (acá SÍ había margen real de mejora).
- veredicto:paywall — 11 pasadas acumuladas (6 de una sesión anterior + 5 de esta sesión). Progreso de
  esta sesión: 29→28→30→30→33/40 usabilidad, 15→14→14→15→14/20 craft, 16→18→18→18/20 copy. Bugs REALES
  corregidos: garantía lejos del CTA (ahora pegada con ícono), botón sin estado pendiente (spinner),
  ahorro del plan sin monto exacto, controles sin focus-visible, sin copy de valor mensual, tarjetas
  bloqueadas con markup duplicado a mano (ahora TarjetaTarot con prop `bloqueada`), ícono "←" de texto,
  mecanismo "El Espejo de las 3 Cartas" sin nombrar (invalidaba el eje "idea" del copy — ahora nombrado
  en el teaser y junto al selector de plan), teaser recortado de 5-6 a 2 líneas (los 3 ítems del
  checklist ya caben sin scroll), mismo bug de z-index del gradiente que en onboarding, precio del plan
  sin tratamiento de número héroe, caja "Así funciona tu prueba" sin su propio nivel de profundidad
  (ahora --surface-2 + sombra interior). Lo que QUEDA ya no es corregible con código hoy: (1) sin prueba
  social real (mismo motivo que landing — app no lanzada, prohibido inventar); (2) sin estado de error
  visible si falla el cobro — prematuro, el pago real se conecta en la Sesión 6; (3) logo es un chip de
  color plano sin símbolo — falta el asset real del monograma, no es un bug de código. 33/40 · 14/20 —
  no pasa el gate.
  DECISIÓN FINAL de esta sesión: se PAUSAN más pasadas del revisor en las 3 pantallas. 5 rondas
  completas de generar→revisar→corregir→re-revisar, con mejora real y verificable en cada una (no solo
  varianza) — landing y paywall llegaron a un techo genuino (necesitan assets/datos que hoy no existen:
  mockup de cita real, prueba social real, logo real, pago real conectado); onboarding quedó a 1 punto
  del gate en ambos ejes y seguía mejorando, es la más cercana a certificarse en una sesión futura corta.
  Ninguna de las 3 se declara "lista" en este archivo. Próxima sesión de certificación: (1) onboarding
  primero (más cerca, sin bloqueos de asset/dato), (2) recién con el logo real + primeros datos de uso
  reales, retomar paywall y landing.
- Onboarding/paywall/login: el guardado de respuestas es sessionStorage (no hay cuenta ni base de
  datos real todavía) — se pierde si el usuario cierra el navegador. Se reemplaza por Supabase en
  Sesión 6. El botón "Continuar con Google" y "Enviarme el enlace mágico" son MOCK (no envían nada de
  verdad) — documentado en los comentarios de app/login/page.tsx.
- veredicto:app-interna — construida y probada a mano de punta a punta, pero sin pasada del
  revisor-visual todavía (mismo criterio que landing/onboarding/paywall: se certifican juntas en la
  Sesión 7). La "lectura de pareja" y la "compatibilidad" son generadores MOCK (mazo fijo + plantillas
  de texto, sin IA real) — se reemplazan por el mecanismo real en la Sesión 6. La racha y el historial
  viven en sessionStorage: se reinician si el usuario cierra el navegador, hasta que haya cuenta real.

## Pendientes del usuario (acciones que el usuario debe hacer)
Actualizado 2026-09-10 — pedido explícito del usuario: mantener esta lista al día para que, al
conectar Hotmart, no tenga que volver a revisar toda la sesión buscando qué quedó suelto.

**Servicios externos por conectar (lo grande):**
- [ ] Hotmart — sin esto, nada de lo de abajo se puede activar. Es el "siguiente módulo del curso"
  del usuario, no se toca hasta que él lo traiga.
- [ ] Resend + dominio propio — el correo de Supabase (login) tiene límite de envíos bajo y solo
  sirve para el enlace mágico; ningún otro correo del negocio (win-back, recibos, avisos) puede
  mandarse sin esto.

**En cuanto Hotmart esté conectado, queda pendiente (ninguno se puede hacer antes):**
- [ ] 🔴 Hacer cumplir el pago de verdad: hoy `/app` solo revisa "¿inició sesión?", nunca "¿pagó o
  sigue en prueba?" — cualquiera con cualquier correo tiene acceso gratis e ilimitado (hallazgo
  crítico de la auditoría de seguridad). Falta: guardar el estado de suscripción que manda el
  webhook de Hotmart, y que `/app` (toda la app interna, no solo las lecturas) lo revise.
- [ ] Decidir qué queda detrás del pago una vez exista ese control: el paywall YA promete "El
  Espejo de las 3 Cartas sin límite, Compatibilidad de signos y tu Carta del día" como parte de lo
  pago — o sea, el ritual diario completo (Carta del día + check-in de ánimo + Compatibilidad),
  no solo las lecturas nuevas. Falta hacerlo cumplir con código cuando el trial se acabe sin pago.
- [ ] Actualizar el copy del paywall para mencionar el check-in de ánimo / historial de patrones
  (features nuevas de esta sesión, no existían cuando se escribió ese texto) — decisión explícita
  del usuario: dejarlo para cuando se toque esta pantalla de una sola vez junto con Hotmart.
- [ ] Verificar la Garantía de los 7 Días contra el panel real de Hotmart (FICHA-MERCADO.md ya lo
  marca como PROVISIONAL desde antes de esta sesión): confirmar que admite reembolso a ≥7 días
  corridos desde el cobro. Si el plazo real es menor, bajar el número en `/reembolsos`, landing y
  paywall ANTES de vender.
- [ ] Conectar la secuencia de win-back (correos de los días 30/60/90, ya escritos en
  `docs/copy/winback.md`) — necesita el webhook de Hotmart (saber quién canceló y cuándo) + Resend
  (poder mandarlo). El copy y la regla de negocio ya están decididos, falta el cableado técnico.
- [ ] Cuando exista un plan anual vendiéndose de verdad: armar los avisos pre-renovación del mes 12
  (30 días y 7 días antes del cobro) — doctrina `58-RETENCION-DE-INGRESOS.md`, no arrancado todavía.
- [ ] El webhook de Hotmart, cuando se construya, necesita verificar la firma (HOTTOK) sobre el
  cuerpo crudo de la petición ANTES de confiar en nada que llegue — sin eso, cualquiera podría
  mandar un aviso falso de "compra exitosa" y darse acceso gratis (era la pregunta #4 del pedido de
  auditoría de seguridad original del usuario, sin responder todavía porque Hotmart no existe).
  También necesita ser idempotente (que reenviar el mismo aviso dos veces no active el acceso dos
  veces) — patrón ya usado en este proyecto en `registrar_lectura_ia()`, reusar la misma idea.
- [ ] **Panel de admin → pestaña "Negocio" (`app/admin/negocio/page.tsx`) — completamente vacía,
  sus 4 secciones dependen de piezas que no existen todavía**, y NO son todas "conectar Hotmart":
  - Conversión (landing → onboarding → pago): necesita un `event_log` nuevo — una tabla que no
    existe hoy, para guardar cada paso del recorrido. Esto NO llega solo con Hotmart.
  - Prueba gratis (trial): necesita ese mismo `event_log` + Hotmart (para saber cuándo empieza
    cada prueba).
  - Ventas: necesita Hotmart (ingresos, cancelaciones, reembolsos llegan por su webhook).
  - Ganancia real: necesita Hotmart (ingresos) + Resend (costo de email) + confirmar la tarifa de
    infraestructura — el costo real de IA ya se calcula bien, es lo único que sí funciona ahí.
  - LTV/CAC por canal: necesita una columna nueva `profiles.source` (de dónde vino cada usuario,
    no existe hoy) + el gasto de adquisición por canal (dato que solo el usuario tiene).
  - El resumen general del admin (`app/admin/page.tsx`) tiene el mismo aviso: no genera alertas
    automáticas de negocio todavía por la misma falta de datos.

**Sueltos, sin relación con Hotmart:**
- [ ] Activar "Leaked Password Protection" en el panel de Supabase (Authentication → Sign In /
  Providers → Email) — no se puede hacer por código, y puede pedir plan Pro de Supabase (de pago).
  Baja prioridad: el login real de la app es sin contraseña.
- [ ] Correo de contacto legal: hoy usa `jonathanrd198@gmail.com` (personal) en Privacidad,
  Términos, Reembolsos, footer y perfil. El dominio propio ya se compró y se conectó
  (`amorytarot.app`, 2026-09-10) — falta crear el correo real sobre ese dominio (el usuario decidió
  empezar con reenvío gratis a su Gmail, guía ya dada, pospuesto explícitamente "para después") y
  recién ahí cambiar estas 5 páginas de `jonathanrd198@gmail.com` a `hola@amorytarot.app`.

## Decisiones del usuario (ya resueltas, no volver a preguntar)
- Logo/isotipo del usuario: CONFIRMADO — queda SOLO como favicon + ícono de app (app/icon.png,
  app/apple-icon.png). NO se usa dentro de las pantallas (choca con la paleta clara de
  FICHA-ARTE.md) — decisión del usuario 2026-09-02, no volver a proponerlo sin que lo pida.

## Notas para la próxima sesión
- Regla de marca dura: JAMÁS usar la palabra "IA" / "inteligencia artificial" en copy visible al
  usuario — la experiencia se presenta como tarot, no como tecnología
- Sesión 6 reemplaza 3 mocks por lo real: el generador de lecturas/compatibilidad (hoy plantillas
  fijas en lib/tarot-data.ts), el guardado (hoy sessionStorage en lib/estado-app.ts) y el login
  (hoy simulado en app/login/page.tsx) — los tres están aislados en esos archivos a propósito, para
  que conectar Supabase/IA real no obligue a tocar las pantallas.
