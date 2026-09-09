# ESTADO — Amor & Tarot
Última actualización: 2026-09-08 | Sesión actual: 6 (Integraciones reales — Supabase Etapa 2 lista, GitHub+Vercel conectados)

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
- [ ] Ninguna cuenta todavía — se avisará cuando lleguemos a crear cuentas (Supabase, Vercel,
  pasarela de pago, dominio)

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
