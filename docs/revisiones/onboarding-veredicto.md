# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-03 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 35/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Título "Tus 3 cartas están listas"] Texto plano, ninguna palabra en color de acento — el onboarding es superficie de conversión y el titular debe resaltar 1-3 palabras clave en acento (regla de énfasis) → envolver "3 cartas" o "listas" en un `<span style={{color:'var(--accent)'}}>`.
2. [Fila de cartas, "Mateo" y "La Dinámica"] Siguen sin candado ni microcopy — mismo borde/sombra/forma que una carta tocable en el resto de la app, sin nada que explique por qué no se abren aquí (defecto ya señalado, persiste a propósito) → agregar "se abre en tu lectura completa" bajo cada una o usar la variante `bloqueada` (candado) que ya existe en `TarjetaTarot`.
3. [`irAPaywall`, catch de sessionStorage] El fix solo agrega `console.warn` — invisible para un usuario real; si el guardado falla (Safari privado), la persona pierde su personalización y nunca se entera → mostrar un aviso discreto (toast) en vez de solo loguear.
4. [Revelación de "La Estrella"] Ningún acento extra (glow, chip, partícula) marca el hito más allá del flip de 0.7s — el momento más importante del mecanismo del producto se siente como una transición de UI más, no como el remate emocional que debería empujar al paywall.
5. [Grid de 12 signos, pasos 3 y 5 del flujo — código] Sin navegación por flechas de teclado entre chips; solo Tab+Enter por comportamiento nativo del botón, sin mejora real de eficiencia frente al mouse/touch.
