# FICHA DE DIRECCIÓN DE ARTE — Amor & Tarot

- Estado: APROBADA — 2026-08-27 (combinación de A + B confirmada por el usuario)

## Referencia del usuario (CONTRATO)
- ¿Hay imagen(es) de referencia del usuario?: SÍ — captura de una app de wellness/fitness (estilo tarjetas de colores + ilustraciones 3D), subida en el chat 2026-08-27
- Extracción:
  - Modo: claro · Fondo: #FFFFFF · Superficie/hero: #8D7FEF · Texto 1º/2º: #16131F / #6E6885
  - Acento(s): #8D7FEF (tarjeta hero/protagonista) · #FFA24C, #ABDBF7, #F6A8DC (tarjetas secundarias de categoría — dónde aparece: grid de tarjetas debajo del héroe)
  - Display: clase redonda/bold — Baloo 2 · Body: clase sans limpia y cálida — Mulish
  - Radio: cards ~26-28px · botones/nav en píldora (999px) · Espaciado: aireado (~18-20px)
  - Sombras: sutiles, tintadas del color de cada tarjeta · Bordes: ninguno, tarjetas de color plano
  - Textura/gradiente: ninguna en las tarjetas base; ilustraciones 3D tipo "clay" flotando dentro del héroe
  - Layout: hero card + grid de tarjetas de categoría + nav inferior en píldora oscura con ítem activo en círculo blanco
  - Detalle firma a replicar: objetos 3D flotantes dentro de la tarjeta principal + nav inferior en píldora negra con círculo activo
- Prohibiciones anti-IA que la referencia LEVANTA: ninguna — la referencia ya es clara/cálida/multicolor, coincide con la Regla 2 (evitar oscuro+neón por defecto)

## Personalidad compilada
- 3 adjetivos: cálida, cercana, esperanzadora
- Compilación: spring suave (no rebote exagerado) · duración base ~220ms · exclamaciones máx 1/pantalla (el hero) · celebración nivel medio (hitos de racha) · radio tendencial 24-28px

## Brand kit (definitivo)
- Fondo: #FFFFFF · Superficie hero: #8D7FEF · Texto 1º/2º: #16131F / #6E6885
- Acento principal (decorativo, sobre fondo claro, SIN texto blanco encima): #8D7FEF — trazos de aro, chips de ícono, texto en acento, bordes
- Acento AA (relleno sólido que lleva texto/ícono blanco encima — botones, círculo héroe/carta del día, badges): #6E5EE5 — misma familia lila, oscurecido a propósito para que el texto blanco cumpla contraste AA 4.5:1 (verificado; #8D7FEF con texto blanco daba ~3.2:1, no pasa)
- Regla de aplicación (app-wide, no solo landing): la variable `--accent` del proyecto vale #6E5EE5 globalmente porque casi todo uso "de marca" termina llevando texto blanco encima (botones, badges, el círculo del aro medidor). #8D7FEF queda para el caso decorativo puntual (trazo de un aro sobre fondo blanco sin relleno, texto en acento sobre fondo claro) — no es un token separado por pantalla (landing vs app), es una elección por CONTRASTE: relleno-sólido-con-texto-blanco usa el tono AA, decorativo-sobre-claro puede usar el tono base.
- Acentos secundarios: #FFA24C / #ABDBF7 / #F6A8DC (SOLO en: tarjetas de categoría — lectura, compatibilidad, historial)
- Semánticos: pendiente de definir en Sesión 5 (estados éxito/error)
- Display: Baloo 2 (600/700) · Body: Mulish (400/600/700)
- Radio: 26px cards · 999px botones/nav/aro · Espaciado base: escala 4·8·12·16·24·32·48·64
- Dispositivo ownable, DOS usos distintos (decisión 2026-08-29, a pedido del usuario tras comparar
  con una propuesta externa de onboarding): (1) el ARO MEDIDOR circular con el nombre de la carta en
  el centro — se usa SOLO como medidor de "energía del día" en el home (carta del día); (2) la
  CARTA DE TAROT real (proporción ~5:8.7, esquinas redondeadas, símbolo + nombre) — se usa en TODO
  momento donde se revela o se muestra una carta como objeto (el teaser de 3 cartas del onboarding,
  el recap del paywall). No confundir los dos: el aro es un indicador, la carta es la carta.
- Saludo personalizado: "Hola, [nombre]" en el encabezado (dato dinámico del perfil del usuario, con fecha como línea pequeña arriba)
- Motion signature: pendiente de definir con detalle en Sesión 5

## Trazabilidad
- Protocolo A/B/C: 3 interpretaciones FIELES renderizadas — misma paleta/tipografía, divergen en composición
  - A: Carta del día + duo de cards (más cercana 1:1 a la referencia)
  - B: Anillo de energía + lista vertical
  - C: Héroe compacto + carrusel horizontal
- Página comparativa: `docs/revisiones/direcciones-abc.html` (y copia en la raíz `direcciones-abc.html`)
- ELEGIDA: combinación A + B — distribución/tarjetas de A, aro medidor de B para la carta del día, saludo con nombre agregado a pedido del usuario. Render de confirmación: `docs/revisiones/carta-del-dia-combinada.html`
- Descartado de cada opción: de B se descartó la lista vertical (se queda con el grid 2×2 de A); de C se descartó el carrusel horizontal y el héroe compacto
- Paleta derivada de: referencia del usuario (imagen subida en el chat) — tomada tal cual, no de un líder del nicho
- Registro anti-repetición: paleta lila #8D7FEF + naranja/azul/pastel + par tipográfico Baloo 2/Mulish — VETADOS para el próximo proyecto de este SO

## Idioma UI: español latino neutro · Fecha de cierre: 2026-08-27 · Aprobada por el usuario: SÍ
