# VEREDICTO revisor-visual — landing
Fecha: 2026-09-15 00:00
Screenshot: docs/revisiones/landing-A-375.png
Usabilidad: 33/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA

Top defectos:
1. [components/landing/Agitacion.tsx líneas 55-66, sección "Agitación" — mini-cards Hoy/Futuro] Usa hex hardcodeados (#FFA24C, #B5701F) en vez de tokens del kit, rompiendo la regla "tokens CSS para todo color" y produciendo una tarjeta ajena a la paleta dorado/oscuro del tema místico (probable contraste ~3.8:1 en el label 12px bold, por debajo de AA 4.5:1). Fix: reemplazar por var(--accent-2)/color-mix del tema místico, igual que el resto del kit.
2. [components/landing/Oferta.tsx, cards de "Anual"/"Mensual"] La Garantía de los 7 Días vive en una sección aparte tras la oferta, no junto al botón de cada plan — falla el sub-check binario "garantía nombrada cerca del CTA de compra" de la Rúbrica 4. Fix: agregar una línea corta "Respaldado por la Garantía de los 7 Días" bajo cada CtaButton dentro de la card de precio.
3. [components/landing/ui.tsx → CtaButton, y en general todos los <a>/<button> del kit] No hay :focus-visible custom definido para los CTAs (dependen del outline por defecto del navegador) — en un fondo casi negro con acento dorado el foco de teclado puede quedar poco visible. Fix: agregar un anillo de foco explícito con var(--accent) en CtaButton y StickyCtaMobile.
4. [app/page.tsx — secciones "5. LA APP POR DENTRO" y la lista "TiposDeLectura" inmediatamente después] Dos secciones consecutivas muestran esencialmente lo mismo (qué se puede hacer en la app) en dos formatos distintos (carrusel de capturas + lista de tarjetas), alargando el scroll sin agregar información nueva — afecta el eje "estético y minimalista" (h8) y la carga cognitiva. Fix: fusionar en una sola sección o diferenciar mejor el propósito de cada una (ej. la segunda solo para compatibilidad/pricing de features, no repetir "tipos de lectura" ya mostrados en el carrusel).
5. [components/app/TemaMistico.tsx / RuedaAstral.tsx — identidad visual] La estética oscuro+dorado+serif+carta astral es un patrón ya frecuente en apps de tarot/astrología; aunque la rueda es un dispositivo bespoke bien ejecutado, falta un segundo detalle de firma (textura, motivo de fondo distinto, tratamiento propio) que blinde más la diferenciación frente al resto del nicho. Fix: sumar un segundo elemento ownable (ej. textura de papel estelar sutil o motivo de fondo propio) documentado en FICHA-ARTE.md.
