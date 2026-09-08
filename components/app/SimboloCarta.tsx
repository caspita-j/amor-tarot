// Simbología por carta — cada carta del MAZO (lib/tarot-data.ts) tiene su
// propio símbolo, como en un mazo de tarot real, en vez de una única estrella
// genérica repetida. Estilo silueta monocromática, coherente con el resto del
// kit de íconos. `color` es el trazo/relleno del símbolo; `fondo` es SOLO el
// color de "recorte" que usa La Luna para su creciente — debe ser igual al
// fondo real donde se dibuja el ícono (la carta usa var(--accent), el nav
// inferior usa el color de su píldora/círculo — ver BottomNav.tsx).
// Arcanos menores (Parte 2): en vez de un ícono único por cada una de las 56
// cartas, se usa el símbolo del PALO — así se lee un mazo real de tarot
// simplificado (el número/rango ya lo dice el nombre debajo del ícono, ej.
// "Tres de Copas"). Copas = copa, Espadas = espada, Bastos = vara con hojas,
// Oros = moneda con estrella — mismo lenguaje visual que los mayores.
function palo(nombre?: string): 'Copas' | 'Espadas' | 'Bastos' | 'Oros' | null {
  if (!nombre) return null;
  if (nombre.endsWith('de Copas')) return 'Copas';
  if (nombre.endsWith('de Espadas')) return 'Espadas';
  if (nombre.endsWith('de Bastos')) return 'Bastos';
  if (nombre.endsWith('de Oros')) return 'Oros';
  return null;
}

export function SimboloCarta({
  nombre,
  color = 'var(--bg)',
  fondo = 'var(--accent)',
}: {
  nombre?: string;
  color?: string;
  fondo?: string;
}) {
  const paloDetectado = palo(nombre);
  if (paloDetectado === 'Copas') {
    return (
      <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
        <path d="M28 32 L72 32 L60 62 Q50 71 40 62 Z" fill={color} />
        <rect x="46" y="62" width="8" height="15" fill={color} />
        <rect x="33" y="77" width="34" height="6" fill={color} />
      </svg>
    );
  }
  if (paloDetectado === 'Espadas') {
    return (
      <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
        <path d="M50 14 L57 26 L57 64 L43 64 L43 26 Z" fill={color} />
        <rect x="30" y="61" width="40" height="6" fill={color} />
        <rect x="45" y="67" width="10" height="14" fill={color} />
        <circle cx="50" cy="86" r="5" fill={color} />
      </svg>
    );
  }
  if (paloDetectado === 'Bastos') {
    return (
      <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
        <line x1="28" y1="82" x2="72" y2="18" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="62" cy="30" rx="8" ry="4" fill={color} transform="rotate(-35 62 30)" />
        <ellipse cx="48" cy="50" rx="8" ry="4" fill={color} transform="rotate(-35 48 50)" />
        <ellipse cx="34" cy="70" rx="8" ry="4" fill={color} transform="rotate(-35 34 70)" />
      </svg>
    );
  }
  if (paloDetectado === 'Oros') {
    return (
      <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
        <circle cx="50" cy="50" r="28" stroke={color} strokeWidth="4" fill="none" />
        <path d="M50 34 L54 45 L66 45 L56 52 L60 64 L50 57 L40 64 L44 52 L34 45 L46 45 Z" fill={color} />
      </svg>
    );
  }

  switch (nombre) {
    case 'El Loco':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <line x1="28" y1="78" x2="68" y2="28" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <circle cx="72" cy="24" r="9" fill={color} />
          <circle cx="24" cy="18" r="1.8" fill={color} />
          <circle cx="82" cy="55" r="1.6" fill={color} />
        </svg>
      );

    case 'El Mago':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <line x1="35" y1="75" x2="60" y2="26" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <path d="M62 16 L65 22 L71 24 L65 26 L62 32 L59 26 L53 24 L59 22 Z" fill={color} />
          <line x1="24" y1="78" x2="76" y2="78" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'La Sacerdotisa':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <rect x="24" y="32" width="11" height="46" fill={color} />
          <rect x="65" y="32" width="11" height="46" fill={color} />
          <circle cx="50" cy="34" r="11" fill={color} />
          <circle cx="55" cy="30" r="10" fill={fondo} />
        </svg>
      );

    case 'La Emperatriz':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <circle cx="50" cy="38" r="16" stroke={color} strokeWidth="5" fill="none" />
          <line x1="50" y1="54" x2="50" y2="80" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <line x1="37" y1="66" x2="63" y2="66" stroke={color} strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    case 'El Emperador':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <circle cx="42" cy="58" r="16" stroke={color} strokeWidth="5" fill="none" />
          <line x1="53" y1="47" x2="78" y2="22" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <path d="M78 22 L64 22 M78 22 L78 36" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'El Hierofante':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <g stroke={color} strokeWidth="3.5" strokeLinecap="round">
            <line x1="26" y1="26" x2="66" y2="66" />
            <line x1="58" y1="58" x2="66" y2="58" />
            <line x1="58" y1="58" x2="58" y2="66" />
          </g>
          <circle cx="26" cy="26" r="7" stroke={color} strokeWidth="3.5" fill="none" />
          <g stroke={color} strokeWidth="3.5" strokeLinecap="round">
            <line x1="74" y1="26" x2="34" y2="66" />
            <line x1="42" y1="58" x2="34" y2="58" />
            <line x1="42" y1="58" x2="42" y2="66" />
          </g>
          <circle cx="74" cy="26" r="7" stroke={color} strokeWidth="3.5" fill="none" />
        </svg>
      );

    case 'El Carro':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <path
            d="M35 25 L65 50 L35 75"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="14" y1="40" x2="27" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <line x1="14" y1="60" x2="27" y2="60" stroke={color} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'El Ermitaño':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <path d="M38 35 Q50 20 62 35" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <rect x="37" y="35" width="26" height="32" rx="4" stroke={color} strokeWidth="4" fill="none" />
          <rect x="43" y="68" width="14" height="6" fill={color} />
          <path d="M50 44 L52.5 49 L58 50 L52.5 51 L50 56 L47.5 51 L42 50 L47.5 49 Z" fill={color} />
        </svg>
      );

    case 'La Rueda de la Fortuna':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <circle cx="50" cy="52" r="26" stroke={color} strokeWidth="4" fill="none" />
          <g stroke={color} strokeWidth="3" strokeLinecap="round">
            <line x1="50" y1="26" x2="50" y2="78" />
            <line x1="24" y1="52" x2="76" y2="52" />
            <line x1="32" y1="34" x2="68" y2="70" />
            <line x1="68" y1="34" x2="32" y2="70" />
          </g>
          <path d="M50 16 L45 24 L55 24 Z" fill={color} />
        </svg>
      );

    case 'La Justicia':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <line x1="50" y1="18" x2="50" y2="76" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <line x1="26" y1="30" x2="74" y2="30" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <line x1="26" y1="30" x2="26" y2="42" stroke={color} strokeWidth="3" />
          <line x1="74" y1="30" x2="74" y2="42" stroke={color} strokeWidth="3" />
          <ellipse cx="26" cy="45" rx="10" ry="4" stroke={color} strokeWidth="3" fill="none" />
          <ellipse cx="74" cy="45" rx="10" ry="4" stroke={color} strokeWidth="3" fill="none" />
          <path d="M50 76 L42 84 L58 84 Z" fill={color} />
        </svg>
      );

    case 'El Colgado':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <line x1="28" y1="24" x2="72" y2="24" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <line x1="28" y1="24" x2="28" y2="78" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <line x1="58" y1="24" x2="58" y2="42" stroke={color} strokeWidth="3" />
          <circle cx="58" cy="49" r="7" stroke={color} strokeWidth="3" fill="none" />
          <line x1="58" y1="56" x2="58" y2="76" stroke={color} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'La Muerte':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <rect x="32" y="21" width="36" height="4" fill={color} />
          <rect x="32" y="75" width="36" height="4" fill={color} />
          <path d="M35 25 L65 25 L50 50 Z" fill={color} />
          <path d="M35 75 L65 75 L50 50 Z" fill={color} />
          <circle cx="50" cy="50" r="2" fill={fondo} />
        </svg>
      );

    case 'El Diablo':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <ellipse cx="38" cy="42" rx="15" ry="10" stroke={color} strokeWidth="5" fill="none" transform="rotate(-20 38 42)" />
          <ellipse cx="62" cy="58" rx="15" ry="10" stroke={color} strokeWidth="5" fill="none" transform="rotate(-20 62 58)" />
        </svg>
      );

    case 'El Juicio':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <line x1="16" y1="50" x2="32" y2="50" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <path d="M32 40 L60 32 L60 68 L32 60 Z" fill={color} />
          <g stroke={color} strokeWidth="3" strokeLinecap="round">
            <line x1="68" y1="38" x2="78" y2="30" />
            <line x1="70" y1="50" x2="82" y2="50" />
            <line x1="68" y1="62" x2="78" y2="70" />
          </g>
        </svg>
      );

    case 'La Estrella':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <path d="M50 14 L58 39 L84 39 L63 54 L71 79 L50 64 L29 79 L37 54 L16 39 L42 39 Z" fill={color} />
          <circle cx="20" cy="22" r="2.4" fill={color} />
          <circle cx="82" cy="18" r="1.8" fill={color} />
          <circle cx="85" cy="58" r="1.6" fill={color} />
        </svg>
      );

    case 'La Luna':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <circle cx="52" cy="50" r="24" fill={color} />
          <circle cx="64" cy="41" r="22" fill={fondo} />
          <circle cx="22" cy="30" r="2" fill={color} />
          <circle cx="28" cy="72" r="1.6" fill={color} />
        </svg>
      );

    case 'El Sol':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <g stroke={color} strokeWidth="4" strokeLinecap="round">
            <line x1="70" y1="52" x2="81" y2="52" />
            <line x1="64" y1="66" x2="72" y2="74" />
            <line x1="50" y1="72" x2="50" y2="83" />
            <line x1="36" y1="66" x2="28" y2="74" />
            <line x1="30" y1="52" x2="19" y2="52" />
            <line x1="36" y1="38" x2="28" y2="30" />
            <line x1="50" y1="32" x2="50" y2="21" />
            <line x1="64" y1="38" x2="72" y2="30" />
          </g>
          <circle cx="50" cy="52" r="15" fill={color} />
        </svg>
      );

    case 'La Templanza':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <path d="M56 20 L80 20 L76 34 Q68 40 60 34 Z" fill={color} />
          <rect x="66" y="34" width="4" height="8" fill={color} />
          <path d="M20 58 L44 58 L40 72 Q32 78 24 72 Z" fill={color} />
          <rect x="30" y="72" width="4" height="8" fill={color} />
          <path d="M70 32 C 54 28, 42 38, 34 56" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'La Torre':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <rect x="40" y="42" width="20" height="36" fill={color} />
          <rect x="40" y="35" width="5" height="7" fill={color} />
          <rect x="47.5" y="35" width="5" height="7" fill={color} />
          <rect x="55" y="35" width="5" height="7" fill={color} />
          <path d="M72 16 L64 34 L70 34 L60 56 L76 32 L69 32 Z" fill={color} />
        </svg>
      );

    case 'El Mundo':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <circle cx="50" cy="50" r="26" stroke={color} strokeWidth="4" fill="none" />
          <ellipse cx="50" cy="50" rx="38" ry="14" stroke={color} strokeWidth="3" fill="none" transform="rotate(-20 50 50)" />
          <circle cx="50" cy="50" r="7" fill={color} />
        </svg>
      );

    case 'Los Enamorados':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <path d="M36,56.8 C10.4,34.4 23.2,15.2 36,28 C48.8,15.2 61.6,34.4 36,56.8 Z" fill={color} />
          <path d="M64,84.8 C38.4,62.4 51.2,43.2 64,56 C76.8,43.2 89.6,62.4 64,84.8 Z" fill={color} />
        </svg>
      );

    case 'La Fuerza':
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <path
            d="M22,50 C22,34 40,34 50,50 C60,66 78,66 78,50 C78,34 60,34 50,50 C40,66 22,66 22,50 Z"
            stroke={color}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" className="size-3/4" aria-hidden="true">
          <path d="M50 14 L58 39 L84 39 L63 54 L71 79 L50 64 L29 79 L37 54 L16 39 L42 39 Z" fill={color} />
        </svg>
      );
  }
}
