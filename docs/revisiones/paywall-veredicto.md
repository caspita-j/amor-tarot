# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-03 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 33/40
Craft: 14/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Franja completa de la pantalla] Falta prueba social externa real (testimonio, rating, cifra de usuarias) — ningún elemento de validación social en todo el paywall → agregar en cuanto existan datos reales de lanzamiento; prohibido inventar cifra/testimonio, queda como deuda documentada.
2. [Tras tocar "Empezar mis 3 días gratis" → flujo de login/cobro] No hay estado de error diseñado si el cobro o el login fallan (qué pasó + qué hacer) — heurística 9 en 1/4 porque no hay ningún manejo visible de fallos → diseñar el estado de error cuando se conecte el cobro real (sesión futura dedicada a pagos).
3. [Recap de cartas, bajo el header — cartas "Mateo" y "La Dinámica"] Candado genérico (ícono Lock sobre borde punteado) en vez del dorso tenue de la carta con overlay que especifica el dispositivo ownable de FICHA-ARTE — se ve como placeholder de plantilla, no como el resto del sistema de cartas → reusar `TarjetaTarot` con el dorso ilustrado atenuado (opacity baja) + candado encima, en vez del div dashed genérico.
4. [Header, chip junto a "Amor & Tarot"] Logo es un cuadrado de color plano sin símbolo — placeholder de wireframe en la franja de mayor peso de marca de la pantalla → reemplazar por el SVG del monograma en cuanto exista el asset de logo.
5. [Fondo de toda la pantalla, especialmente la caja "Así funciona tu prueba — sin sorpresas"] Solo hay 2 niveles de profundidad (fondo con degradé leve + tarjetas elevadas con shadow-1); falta un tercer nivel hundido que distinga la franja informativa de las tarjetas interactivas de plan — al entrecerrar los ojos todo el contenido flota sobre el mismo tono de superficie → dar a esa caja un tono de superficie más oscuro o inset shadow para diferenciarla de las tarjetas de plan.
