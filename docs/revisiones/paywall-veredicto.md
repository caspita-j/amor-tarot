# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-15 00:00
Screenshot: docs/revisiones/paywall-A-375.png
Usabilidad: 29/40
Craft: 15/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:2 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:4 oferta:4 acción:4

Confirmación de las 4 correcciones de la ronda anterior (verificadas en código y screenshot):
1. Precio real ($43.99) en "Así funciona tu prueba" y en el pie fijo → CORREGIDO. `cobroReal`/`cobroRealUnidad`
   se usan en app/paywall/page.tsx líneas 252 y 322-323; el screenshot muestra "$43.99 si no cancelaste"
   y "después, $43.99/año" para el plan Anual, nunca $3.66.
2. Tarjeta "Así funciona tu prueba" envuelta en `<Hairline>` → CORREGIDO. Línea 243, borde degradé visible
   en el screenshot (antes fondo plano bg-[var(--surface-2)]).
3. Frase que mezclaba cancelación con garantía → CORREGIDO. Ahora son 2 `<p>` independientes (líneas 272-279),
   visibles como 2 líneas separadas en el screenshot scrolled.
4. Círculo de selección del plan no elegido → MEJORADO, no perfecto. Pasó de `border-[var(--surface-2)]`
   (invisible) a `border-[color-mix(...text-secondary_40%...)]` (línea 225): ya se distingue a simple vista
   en el screenshot, pero sigue siendo un aro fino y de bajo contraste — ver defecto #3 abajo.

TOP DEFECTOS (máx 5, ordenados por impacto):
1. [Tarjeta "Anual", precio grande] El número dominante en dorado es el equivalente mensual ($3.66),
   mientras el monto real que se cobra ($43.99/año) queda en texto secundario pequeño arriba — justo la
   objeción #1 del avatar ("cobros ocultos", FICHA-AVATAR.md) se resuelve mejor si el número grande es el
   que se cobra de verdad → fix en app/paywall/page.tsx líneas 203-217: invertir el énfasis tipográfico
   (cobroReal grande, precioMes como nota secundaria "equivale a $3.66/mes").
2. [Pantalla completa, densidad] Teaser + 3 cartas + checklist de 3 + caption "Cada mes..." + 2 tarjetas de
   plan + tarjeta de línea de tiempo + 2 sellos + 2 links legales, todo apilado en una sola columna larga —
   cada bloque es breve pero el conjunto exige mucho scroll antes de llegar a la garantía → fix: fusionar
   el checklist de beneficios con la línea "Cada mes: ..." (app/paywall/page.tsx líneas 163-181) en un solo
   bloque, o mover los sellos de confianza (líneas 285-292) junto al CTA sticky donde ya vive el texto de
   garantía, para no repetir "cancela cuando quieras" en 3 lugares distintos de la pantalla.
3. [Tarjeta "Mensual", círculo de selección] Mejoró respecto a la versión anterior pero el aro sigue siendo
   fino (2px) y de bajo contraste (color-mix 40%) — a simple vista cuesta identificarlo como control
   seleccionable → fix en app/paywall/page.tsx línea 225: subir el mix a ~55-60% de --text-secondary sólido.
4. [Esquina superior de la tarjeta "Anual"] El badge "MÁS POPULAR" (línea 198, `-top-3 right-4`) y el
   círculo de check (línea 220, `top-4 right-4`) quedan muy próximos entre sí, generando una esquina
   recargada → fix: bajar el check ~4-6px o centrar el badge sobre el borde superior en vez de a la derecha.
5. [Heurística 9 — errores] No existe ningún estado de error visible en esta pantalla; el catch de
   `sessionStorage.setItem` (línea 92-96) falla en silencio y sigue a /login sin avisar nada al usuario.
   Aceptable mientras la pasarela de pago no esté conectada (pendiente ya anotado), pero cuando se conecte
   el pago real (próxima sesión) hay que agregar un estado de error visible con qué-pasó + qué-hacer antes
   de declarar esta pantalla lista para vender de verdad → fix en app/paywall/page.tsx, función `continuar`.
