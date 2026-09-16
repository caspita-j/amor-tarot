# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-15 00:00
Screenshot: docs/revisiones/onboarding-A-paso1.png, docs/revisiones/onboarding-A-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad (h1..h10): 3, 3, 3, 3, 3, 3, 3, 2, 3, 3
Detalle craft (jerarquía, profundidad, identidad, movimiento, encaje): 3, 3, 3, 3, 2

Top defectos:
1. [paso 1 — app/onboarding/page.tsx líneas 135-156, "¿Qué te trae por acá hoy?"] La mitad inferior de la pantalla queda completamente vacía (4 chips ocupan ~40% del alto, el resto es solo fondo estrellado repetido) → primera impresión del flujo se lee como pantalla a medio construir, no como "calma deliberada" (no hay ilustración, glow, ni ancla visual que justifique el vacío) → fix: centrar verticalmente el bloque con `justify-center` cuando hay ≤4 opciones, o sumar un elemento decorativo (glow de carta, símbolo) bajo los chips en `PantallaOnboarding`/pasos 0, 1 y 6 de `app/onboarding/page.tsx`.
2. [pasos 2, 4 y 7 — app/onboarding/page.tsx líneas 192-207, 244-259, 334-349] El botón "Continuar"/"Sacar mis 3 cartas" queda deshabilitado al 40% de opacidad sin ningún texto que explique la condición (el mínimo de 10 caracteres del paso 7 no se comunica en ningún lado) → el usuario no sabe por qué no puede avanzar → fix: agregar un hint visible bajo el input/textarea ("Cuéntanos un poco más, mínimo 10 caracteres") o habilitar el botón siempre y validar al toque mostrando el mensaje, en `BotonPrincipal` (`components/onboarding/ui.tsx` líneas 259-286) y los 3 pasos afectados.
3. [pasos 3 y 5 — app/onboarding/page.tsx líneas 212-296, grid de signos] Una sola decisión presenta 12 opciones simultáneas (excede el máximo de 4 recomendado para evitar parálisis) → aunque es una lista cerrada y reconocible (signos zodiacales), el gate de carga cognitiva la marca como riesgo → fix: si se mantiene el grid completo, al menos reforzar que es "reconocer, no decidir" con una jerarquía visual más suave (menor contraste en las 11 no relevantes) o agrupar por elemento (fuego/tierra/aire/agua) en 4 filas con encabezado.
4. [components/onboarding/ui.tsx líneas 96-158, ChipOpcion vs ChipGrid] El estado "seleccionado" se resuelve con dos lenguajes visuales distintos para el mismo concepto: `ChipOpcion` usa borde dorado + tint 10% + check circular, `ChipGrid` usa relleno sólido dorado con texto oscuro → inconsistencia de componente que un ojo entrenado nota entre paso 0/1 y paso 3/5 → fix: unificar el tratamiento de "seleccionado" (o documentar la diferencia list/grid como decisión consciente en el código).
5. [FICHA-ARTE.md líneas 85-90 vs código actual + commit "feat: onboarding y paywall al tema oscuro/dorado"] La ficha dice explícitamente que el TEMA MÍSTICO es "exclusivo de las pantallas de adentro (/app/* y /login)" y que "la paleta clara sigue siendo la única aprobada para landing/onboarding/paywall" — pero el código ya pinta todo el onboarding con `data-tema="mistico"` y el commit más reciente lo confirma. El contrato visual quedó desincronizado del código real → fix: actualizar la sección del tema místico en `FICHA-ARTE.md` para reflejar que ahora también cubre onboarding y paywall, con fecha y motivo del cambio (igual que se hizo para la landing en la sección de arriba).
