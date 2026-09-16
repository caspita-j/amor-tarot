# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-15 00:00
Screenshot: docs/revisiones/onboarding-A-375.png
Usabilidad: 31/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad (h1-h10): 3, 4, 3, 2, 3, 4, 3, 3, 3, 3
Detalle craft (jerarquía/profundidad/identidad/movimiento/encaje): 3, 2, 3, 3, 2

Top defectos:
1. [app/onboarding/page.tsx líneas 248-263 y 293-318 — pasos 3 y 5 "¿Cuál es tu signo?"] El bloque
   título+GridSignos NO quedó envuelto en el mismo wrapper `flex flex-1 flex-col justify-center` que
   sí se aplicó a los pasos 0/1/6; queda pegado arriba y deja ~40% de la pantalla vacía abajo
   (visible en onboarding-A-signos.png). Es el mismo problema de "pantalla a medio construir" que se
   corrigió en otros pasos pero no en estos dos → envolver el `<h1>` + `<GridSignos>` en el wrapper
   centrado, igual que en los pasos 0/1/6.
2. [components/onboarding/ui.tsx líneas 96-129 y 139-164] `ChipOpcion` y `ChipGrid` usan
   `bg-[var(--bg)]` (el mismo color del fondo de la pantalla) como estado NO seleccionado — la única
   señal de que existe un chip es una línea de borde de 1px, no hay superficie elevada real. Esto
   aplana la sensación de profundidad en los pasos 0,1,3,5,6 (fondo y "tarjetas" son el mismo plano)
   → usar `var(--surface)` como fondo del chip no seleccionado y reservar `var(--bg)` solo para el
   fondo de página.
3. [components/onboarding/ui.tsx líneas 139-164, ChipGrid vs ChipOpcion] El estado "seleccionado" se
   resuelve distinto entre los dos componentes (relleno sólido vs borde+check) — está documentado
   como decisión consciente por espacio, pero sigue siendo una firma visual distinta para el MISMO
   patrón de interacción (chip de selección única) en pasos consecutivos del mismo flujo → si el
   espacio no alcanza para el check circular completo, usar al menos un check pequeño en la esquina
   del ChipGrid en vez de solo invertir el relleno, para que ambas variantes compartan una misma
   "firma" de seleccionado.
4. [app/onboarding/page.tsx líneas 221-245 y 266-290, pasos 2 y 4 — nombre propio / nombre de la otra
   persona] El botón "Continuar" queda con `opacity-40` sin ningún hint visible mientras el campo
   está vacío. La condición es autoevidente para un input vacío, pero no cumple la ancla "CTA nunca
   disabled por defecto" del sistema (BotonPrincipal, components/onboarding/ui.tsx líneas 265-292) →
   si se mantiene el enfoque, considerar habilitarlo siempre y mostrar el mensaje de campo requerido
   al intentar avanzar en lugar de opacar el botón; es un ajuste menor, no bloqueante por sí solo.
5. [app/onboarding/page.tsx paso 9, líneas 412-456] El paso de carga (loading) no tiene `onAtras` ni
   `onSaltar` y avanza solo tras 2.7s — correcto que no tenga salida (es una transición breve), pero
   si el usuario cierra pestaña/pierde conexión en ese punto no hay ningún manejo de error visible; no
   se pudo verificar en código un fallback si `sortearCartas` fallara o el timer no corriera → agregar
   un timeout de seguridad o manejo de error mínimo antes de depender de que el efecto siempre
   complete.
