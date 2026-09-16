# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-15 00:00
Screenshot: docs/revisiones/paywall-A-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Tarjeta plan Mensual, sección de planes] El número grande "$6.99/mes" repite exactamente el mismo valor en la línea secundaria "equivale a $6.99/mes" justo debajo — para el plan Mensual `cobroReal` y `precioMes` son idénticos ($6.99), así que la nota de "equivalencia" no aporta nada y se lee como un glitch en el área donde el avatar más desconfía (cobros/"letra chica"). Fix: en `app/paywall/page.tsx`, ocultar la línea "equivale a…" cuando `p.cobroReal === p.precioMes` (o quitarla directamente del plan Mensual).
2. [Tarjeta "Así funciona tu prueba — sin sorpresas"] El párrafo que explica cuándo se cobra ("Se te cobrará recién el 18 de septiembre…") y el de la garantía van en `text-xs` (~12px) — por debajo del mínimo de 14px para texto de lectura del propio sistema (regla UX #5). Es justo el copy que responde la objeción #1 de FICHA-AVATAR.md ("cobros ocultos"): no debería ser el texto más chico de la tarjeta. Fix: subir esos 2 párrafos a `text-sm`.
3. [Debajo del H1, tarjeta "El Espejo de las 3 Cartas ya leyó tu carta…"] Repite casi la misma idea que el titular ("Tu lectura completa está lista") sin sumar información nueva salvo el nombre del mecanismo — un lector rápido procesa dos veces el mismo mensaje antes de llegar a las cartas. Fix: fusionar el nombre del mecanismo dentro del H1 o del subtítulo y usar la tarjeta solo para el cierre de bucle ("faltan Mateo y La Dinámica").
4. [Pantalla completa] 10+ bloques apilados antes del pie fijo (header, hero, teaser, 3 cartas, checklist, línea de "Cada mes", 2 planes, timeline, badge de pago, legales) — cada uno se justifica por separado pero en conjunto piden bastante scroll para llegar a la decisión de plan. No es bloqueante (el CTA queda sticky todo el tiempo) pero es la brecha más grande frente al 4/4 en minimalismo.

Nota: feedback de carga del pago ("Un momento…" + spinner) y ausencia de estado de error de pago son pendientes YA ACEPTADOS (pasarela no conectada aún) — no se cuentan contra este veredicto.
