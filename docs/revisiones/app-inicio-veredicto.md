# VEREDICTO revisor-visual — app-inicio
Fecha: 2026-09-08 00:00
Screenshot: docs/revisiones/app-inicio-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. AroMedidor siempre monta con revelada={false} (app/app/page.tsx:112) — el relleno del aro al 74% y el conteo NumeroAnimado del 74% nunca se muestran al usuario real; al tocar, el componente se sustituye al instante por TarjetaTarot antes de que la animación del aro corra → fix: mantener el aro visible con revelada=true unos ~900ms antes de intercambiar a TarjetaTarot, o eliminar la rama muerta.
2. Chips "Situación"/"Rápido" (grid "Tu momento") con contraste ~3.7:1 (texto text-primary al 55% sobre chip bg al 55% de --bg sobre accent-2/accent-3) — falla AA 4.5:1 para texto de 12px → fix: subir la opacidad del texto del chip a ≥80% o fijar un color sólido verificado.
3. SemanaStrip ("Esta semana") muestra fechas reales pero sin navegación entre periodos, violando la Regla UX 13 del propio sistema ("toda vista temporal: fechas reales + navegación ← →") pese a estar documentada como decisión consciente → fix: enlazar a una vista de calendario real o quitar el rótulo que promete contexto temporal navegable.
4. Home apila 6 bloques de peso visual similar (header, hero, semana, racha, video, grid) — el propio comentario del código dice "sin convertirse en dashboard" pero el resultado se acerca; las 2 tarjetas finales compiten con el mismo peso sin una acción primaria dominante → fix: jerarquizar una tarjeta como principal (mayor/con más contraste) y la otra como secundaria.
5. registrarHoy() (lib/estado-app.ts:42-48) escribe en sessionStorage sin try/catch (a diferencia de guardarFotoPerfil) — si falla (Safari privado/cuota llena) la racha no se guarda y el usuario no se entera → fix: envolver en try/catch y avisar con un mensaje breve si falla.
