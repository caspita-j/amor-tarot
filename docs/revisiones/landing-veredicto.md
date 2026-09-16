# VEREDICTO revisor-visual — landing
Fecha: 2026-09-15 00:00
Screenshot: docs/revisiones/landing-A-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA

Detalle usabilidad: h1:3 h2:3 h3:3 h4:2 h5:3 h6:4 h7:3 h8:2 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2
Detalle copy: idea:4 especificidad:3 emoción:4 oferta:4 acción:4
Sub-checks copy: message-match N/A (sin creativo de origen) · garantía nombrada cerca del CTA: SÍ (confirmado en landing-A-oferta.png, "Respaldado por la Garantía de los 7 Días" bajo cada CTA de plan).

Verificación de las 4 correcciones reportadas por quien construyó:
1. Color hardcodeado (Agitacion.tsx #FFA24C/#B5701F → var(--danger)): RESUELTO en Agitacion.tsx —
   confirmado en código, usa var(--danger) y responde al tema. PERO el mismo defecto sigue VIVO,
   sin tocar, en Solucion.tsx (bloque antes/después, líneas 121-122): sigue con border-[#FFA24C] y
   text-[#B5701F] hardcodeados. Es el defecto TOP #1 de este reporte — no está resuelto a nivel de
   pantalla, solo en el archivo que se mencionó.
2. Garantía cerca del CTA (Oferta.tsx, prop garantiaLabel): RESUELTO — visible en el screenshot de
   oferta, bajo el botón de cada plan, con ícono de escudo.
3. Foco de teclado (CtaButton / StickyCtaMobile, ui.tsx): RESUELTO — ambos tienen
   focus-visible:ring-2 + ring-offset explícitos, confirmado en código.
4. Secciones redundantes (TiposDeLectura con subtituloMarked): RESUELTO A NIVEL DE INTENCIÓN — el
   subtítulo "Un resumen rápido de toda la app, por si ya sabes lo que buscas" sí reencuadra la
   sección como índice y no como segunda demo; queda sin verificar visualmente porque esa sección no
   está en las capturas entregadas (solo se aportó héroe + oferta).

Top defectos:
1. [components/landing/Solucion.tsx líneas 119-136, bloque "antes/después"] Mismo bug que se dio
   por corregido: border-[#FFA24C] y text-[#B5701F] hardcodeados en vez de var(--danger). En el
   tema místico oscuro (fondo #0E0B17) ese marrón sobre un fondo mezclado con naranja da un
   contraste estimado muy por debajo de 4.5:1 (aprox. 2.2:1) — prácticamente ilegible, y además
   rompe la restricción de 1 solo color de marca metiendo un naranja/marrón que no existe en la
   paleta mística aprobada → fix: reemplazar por var(--danger) igual que ya se hizo en
   Agitacion.tsx línea 59.
2. [components/landing/TiposDeLectura.tsx líneas 43-48, objeto TONOS] Los fondos de las 4
   miniaturas usan hex fijos (#FFA24C/#ABDBF7/#F6A8DC, los del tema CLARO) en lugar de
   var(--accent-2)/var(--accent-3)/var(--accent-4), que en el tema místico valen
   #4A2F18/#1F3A4A/#3A2A42 (ámbar, azul-noche, ciruela). Resultado: esta sección se ve con la
   paleta pastel del modo claro incrustada en medio de una landing que ya cambió de piel al tema
   oscuro/dorado → fix: usar color-mix(in oklab, var(--accent-2) 18%, transparent) etc., como ya
   hace el resto del kit.
3. [components/landing/Agitacion.tsx línea 59, tarjeta "Hoy"] Con el fix aplicado (var(--danger))
   el color del tema místico es #E2867A sobre un fondo mezclado al 12% con #0E0B17: el contraste
   estimado del texto de la etiqueta (~4.2:1) queda apenas por debajo del 4.5:1 exigido para texto
   normal de 12px — no se pudo confirmar con una herramienta de contraste real porque la sección no
   está en las capturas entregadas → fix: medir con una herramienta real; si falla, oscurecer el
   fondo mezclado o subir el tono de --danger unos puntos en el tema místico.
4. [Cobertura de esta revisión] Solo se entregaron capturas del héroe (landing-A-375.png) y de la
   oferta (landing-A-oferta.png); 6 de las 10 secciones (Problema, Agitación, Solución, App por
   Dentro, Tipos de Lectura, Garantía, FAQ, CTA Final) no tienen captura a 375px — los defectos #1 y
   #2 se detectaron solo leyendo el código, no se pudieron confirmar visualmente → fix: antes de
   cerrar, tomar el screenshot de scroll completo de la landing y volver a pasar el revisor con esa
   evidencia.
5. [components/landing/ExitIntentPopup.tsx línea 176-182, botón de rechazo] El copy "No, prefiero
   seguir dudando" es confirm-shaming (culpa a quien no quiere convertir) — roza el "cero dark
   patterns" de la regla de copy humano del sistema, aunque el popup sí tiene X, Escape y clic fuera
   para cerrar → fix: cambiar a un rechazo neutro ("Ahora no, gracias") sin juicio de valor.
