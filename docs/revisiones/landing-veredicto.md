# VEREDICTO revisor-visual — landing
Fecha: 2026-09-15 00:00
Screenshot: docs/revisiones/landing-A-375.png
Usabilidad: 37/40
Craft: 19/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA

Top defectos:
1. [Sección "Tipos de lectura", las 4 filas] La descripción de cada fila se corta a mitad de palabra con "..." (ej. "Tú, La Otra Persona y La...", "cada ...") por el `truncate` en una sola línea → subir `line-clamp-2` o acortar el copy fuente para que nunca corte a mitad de palabra.
2. [Sección "Tipos de lectura", filas 1 y 4] El chip "Tu lectura de pareja" (tono naranja sólido #4a2f18) y el chip "Tu historial" (tono accent, tinte 18% sobre casi-negro) se ven como el mismo café oscuro en el tema místico, perdiendo la distinción de color por tipo que sí funciona en las filas 2 y 3 → dar a `tono="accent"` un fondo sólido propio (ej. un 5º tono derivado de --accent) en `[data-tema='mistico']`, igual que ya se hizo con naranja/azul/rosa.

Verificado en código (heurísticas 3 y 7, eje 4 de craft):
- Control y libertad: ExitIntentPopup con cierre por X, Escape, click en backdrop y "Ahora no, gracias" (ya no confirm-shaming); intercepta el botón atrás UNA sola vez sin atrapar al usuario.
- Flexibilidad: navegación por teclado nativa (enlaces/botones reales), focus-visible en CTA y FAQ, Escape cierra modal.
- Movimiento: stagger de entrada (useReveal + reduced-motion), RuedaAstral dibuja sus anillos al entrar, whileTap 0.97 en todos los CTA, acordeón de FAQ animado por altura/opacidad, modal de exit-intent con spring suave. Sin número héroe animable ni hito de celebración (no aplican a una landing).
- Colores fijos corregidos: Solucion.tsx y Agitacion.tsx usan var(--danger) (no hex fijo); contraste medido 6.3:1 en el tema oscuro. TiposDeLectura.tsx usa var(--accent-2/3/4) con override sólido en [data-tema='mistico'] (tokens.css), ya no se funde con el fondo.
- Enlaces del footer verificados: /privacidad, /terminos, /reembolsos, /aviso existen (sin rutas muertas).
