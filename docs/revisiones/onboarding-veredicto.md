# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-15 00:00
Screenshot: docs/revisiones/onboarding-A-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Paso 7 — "¿Qué pasó entre ustedes en las últimas 48 horas?", botón "Sacar mis 3 cartas"] El CTA sigue deshabilitado (disabled={!listo}, opacidad 40%) hasta escribir 10 caracteres, y no hay ningún mensaje cuando el campo está vacío — contradice el propio patrón ya corregido en los pasos 2 y 4 (botón siempre activo, error al tocar) y viola la regla de "CTA nunca disabled por defecto" que esos mismos pasos citan como motivo del fix → quitar `disabled={!listo}`, validar al click y mostrar el mismo mensaje rojo si hay menos de 10 caracteres, igual que en nombre/otraPersonaNombre.
2. [ChipOpcion vs ChipGrid, toda la app] Dos firmas de "seleccionado" distintas conviven en el mismo flujo: ChipOpcion invierte a borde+fondo tenue del acento con un check circular completo; ChipGrid invierte a relleno sólido del acento con un check diminuto en la esquina. Comparten ahora el check, pero el tratamiento de fondo sigue siendo opuesto → unificar a un solo tratamiento de "seleccionado" (borde acento + fondo acento ~10%) en ambos componentes.
3. [Paso 10 — teaser de 3 cartas, cita bajo las cartas] El recorte de la respuesta libre del usuario a 8 palabras con "…" puede cortar la frase en un punto poco natural según lo que la persona haya escrito (no hay corte por oración) → cortar en el límite de oración más cercano o subir el tope a ~12-14 palabras.
4. [Paso "¿Cuál es tu signo?" — grid de signos] 12 opciones visibles a la vez (agrupadas en 4 filas de 3): agrupar por elemento ayuda a escanear, pero sigue por encima del límite de 4-5 ítems por decisión — no es un problema visible para el usuario común, pero un ojo entrenado lo detecta como el punto más denso del flujo → si se suman más pasos al onboarding, considerar reducir aún más (ej. autocompletar por texto) en vez de agregar densidad.
