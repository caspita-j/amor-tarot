# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-15 00:00
Screenshot: docs/revisiones/paywall-A-375.png (+ docs/revisiones/paywall-A-scrolled.png)
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): 14/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:4 h3:3 h4:3 h5:1 h6:4 h7:3 h8:3 h9:3 h10:4
Detalle craft: jerarquía:3 profundidad:3 identidad:2 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:1 emoción:4 oferta:2 acción:4

Sub-checks binarios de copy:
- Message-match: N/A (no hay creativo/anuncio de origen para comparar).
- Garantía nombrada: PASA — "Garantía de 7 días" aparece con plazo, cerca del CTA de compra.

Anclas del CTA héroe: las 4 pasan (contraste alto acento-dorado/negro, whileTap 0.97 definido en
BotonPrincipal, nunca disabled por defecto salvo `cargando`, área h-14 ancho completo).

Gate de carga cognitiva: pasa (listas ≤3 ítems, 1 acción primaria + 1 salida secundaria, sin
memoria entre pantallas, texto por bloque corto, siguiente paso obvio).

TOP DEFECTOS (máx 5, ordenados por impacto):

1. [app/paywall/page.tsx líneas 227-231 y 290-293] El monto de cobro que se muestra para el plan
   Anual (seleccionado por DEFECTO) es el precio mensual equivalente ($3.66) y no el monto real que
   se cobra ($43.99/año). Tanto en "Así funciona tu prueba" ("Día 3: $3.66 si no cancelaste") como
   en el pie fijo bajo el CTA ("después, $3.66") se usa `seleccionado.precioMes`, que para el plan
   mensual sí coincide con el cobro real pero para el anual NO. Esto contradice exactamente la
   promesa "sin sorpresas" y la objeción #1 de FICHA-AVATAR.md ("seguro es otra app trampa con
   cobros ocultos") — es el peor lugar posible para tener un número inexacto porque el usuario ya
   entra desconfiado de cifras. FIX: cuando `plan === 'anual'`, mostrar el monto total del cargo
   ($43.99) en ambos textos, no el equivalente mensual; o aclarar explícitamente "$43.99 (equivale a
   $3.66/mes)" en las dos ubicaciones.

2. [app/paywall/page.tsx, toda la pantalla] Cero hairline degradé: ninguna tarjeta usa un borde con
   gradiente de 1-2px (el componente `Hairline` ya existe en components/landing/ui.tsx y se usa en
   Garantia.tsx/Oferta.tsx/Solucion.tsx de la landing, pero el paywall no lo reutiliza en ningún
   lado — solo bordes sólidos planos). Es un gate binario de conversión (docs/sistema/55) y también
   pesa sobre el eje de identidad (craft). FIX: envolver la tarjeta "Así funciona tu prueba — sin
   sorpresas" o el plan Anual destacado con `<Hairline>` en vez de su `bg-[var(--surface-2)]` plano.

3. [app/paywall/page.tsx líneas 247-251, sección "Así funciona tu prueba"] La frase "cancela cuando
   quieras desde tu perfil, y la Garantía de los 7 Días te cubre igual" mezcla en una sola oración
   dos plazos distintos (cobro al día 3, garantía hasta el día 7) sin separación visual. Un usuario
   que solo lee rápido puede creer que tiene 7 días gratis, no 3, y descubrir el cobro real antes de
   lo que esperaba — el peor tipo de sorpresa para este avatar. FIX: separar en dos líneas/pasos:
   "Día 3 · se cobra $X" y, aparte, "¿No te convenció? Devolución garantizada hasta el día 7 (ya
   cobrado)" — nunca en la misma oración corrida.

4. [app/paywall/page.tsx línea 209-211, plan "Mensual" sin seleccionar] El aro de selección no
   marcado usa `border-[var(--surface-2)]` (#241D34), un tono casi idéntico al fondo de su propia
   tarjeta (`bg-[var(--surface)]` #1A1526) — en el screenshot scrolleado el círculo del plan Mensual
   es apenas perceptible como control seleccionable. FIX: usar un borde con más contraste para el
   estado no-activo, ej. `border-[color-mix(in_oklab,var(--text-secondary)_40%,transparent)]`.

5. [components/onboarding/ui.tsx BotonPrincipal / app/paywall/page.tsx] No hay confirmación
   explícita post-tap más allá del cambio de texto a "Un momento…" con spinner — correcto para la
   latencia 100ms-1s, pero al no estar aún conectada la pasarela (nota del contexto), no hay forma
   de verificar en código qué feedback recibirá el usuario si el `router.push('/login')` tarda o
   falla; dejar anotado en ESTADO.md para revisar cuando se conecte el pago real (25/26/27).
