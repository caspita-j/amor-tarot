# VEREDICTO revisor-visual — landing
Fecha: 2026-09-03 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:4 h3:3 h4:4 h5:3 h6:4 h7:3 h8:2 h9:3 h10:2
Detalle craft: jerarquía:3 profundidad:2 identidad:3 movimiento:4 encaje:2
Detalle copy: idea:4 especificidad:2 emoción:4 oferta:4 acción:4
Nota copy: EJE especificidad ≤2 — corregir aunque el total (18/20) pase el umbral de 16.
Nota gate: usabilidad 31/40 < 36 y craft 14/20 < 16 → gate doble no superado, independiente del copy.

Nota de esta pasada (5ª): se verificó en código el único fix reportado — Garantia.tsx, texto
"pisoLegal" (ícono candado) pasó de --text-tertiary a --text-secondary sobre fondo --surface.
Cálculo: --text-secondary #6e6885 sobre --surface #f2edfa ≈ 4.59:1 (antes ≈4.08:1) → ahora cumple
AA 4.5:1 para texto normal. Confirmado y retirado de TOP DEFECTOS. El resto de la pantalla no fue
releído a fondo (según indicación) — se asume sin cambios frente a la pasada anterior, por lo que
el puntaje total se mantiene: los defectos estructurales (carrusel con frames vacíos, ausencia de
cita real, falta de prueba social numérica, salto de profundidad casi imperceptible entre
--bg/--surface/--surface-2) siguen sin resolver a propósito y siguen bajando usabilidad y craft
por debajo del gate.

Top defectos:
1. [AppPorDentro — carrusel §5, frames "Tu situación" y "Compatibilidad"] mitad inferior vacía en 2 de 4 frames (capturas reales con poco contenido, defecto ya conocido y sin resolver a propósito) → recortar el screenshot al contenido real o rediseñar esas 2 pantallas antes de volver a capturarlas.
2. [AppPorDentro — ningún frame del carrusel] falta el frame que muestre la IA citando entre comillas una frase literal del usuario — es la prueba visual del único diferenciador del mecanismo (FICHA-AVATAR objeción #2 "va a ser una respuesta genérica") → agregar un 5º frame o reemplazar uno de los existentes con un mockup de la lectura citando texto real.
3. [tokens.css --surface/--surface-2, se nota en Problema/Agitación/AppPorDentro/Oferta/Garantía] la separación de fondo entre los 3 niveles de profundidad sigue siendo casi imperceptible sin el apoyo de sombras (contraste calculado: --bg→--surface ≈1.15:1, --surface→--surface-2 ≈1.04:1) → el orden ya es correcto pero la magnitud del salto sigue siendo mínima; subir 2-3% más la diferencia de luminancia entre los tres tokens sin perder la calidez pastel.
4. [Hero — franja de prueba social bajo el CTA] "Cero anuncios · Cero cobros ocultos · Cancelas cuando quieras" son promesas de política, no prueba con número/testimonio — la sección de mayor visibilidad de la página (justo bajo el CTA principal) queda sin ningún dato verificable que respalde el claim central de EJE2 (especificidad) → sumar una cifra real (usuarios en beta, rating) si existe, o dejarlo anotado como deuda conocida en ESTADO.md mientras no exista.
5. [Garantia.tsx — pisoLegal, RESUELTO en esta pasada] el contraste AA del texto bajo el ícono de candado ya cumple (~4.59:1) tras cambiar a --text-secondary → sin acción pendiente; queda documentado como referencia de patrón a replicar donde --text-tertiary siga cayendo sobre --surface en vez de --bg.
