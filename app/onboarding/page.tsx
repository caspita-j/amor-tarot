'use client';

// Onboarding de Amor & Tarot — 8 preguntas de alto rendimiento (02B: app de
// "consumo personalizado/bienestar" → 4-8 pasos) + reconocimiento + loading +
// teaser de 3 cartas, ANTES del paywall (reglas 5 y 6 de 02B). Cada pregunta
// ecoa un campo de FICHA-AVATAR.md o alimenta el mecanismo real (El Espejo de
// las 3 Cartas necesita el texto libre + el nombre/signo de ambas personas).
// Flujo revisado a pedido del usuario (comparado contra una propuesta externa
// de 9 pantallas): se sumaron signo propio + datos de la otra persona (para
// que "Tú / La Otra Persona / La Dinámica" tengan nombre real) y el resultado
// pasó de 1 aro a un teaser de 3 CARTAS DE TAROT reales boca abajo con la
// primera revelada — el aro medidor queda solo para "energía del día" en el
// home (ver FICHA-ARTE.md).
// Las respuestas se guardan en sessionStorage — el backend real (Supabase,
// guardar la lectura) se conecta en la Sesión 6; por ahora es la memoria
// mínima para que /paywall pueda personalizarse con lo que la persona escribió.

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Moon } from 'lucide-react';
import { BotonPrincipal, ChipGrid, ChipOpcion, PantallaOnboarding, TarjetaTarot } from '@/components/onboarding/ui';
import { sortearCartas, type Carta } from '@/lib/tarot-data';

const SITUACIONES = [
  'Una situationship (un casi algo)',
  'Poca comunicación o distancia',
  'Una ruptura reciente',
  'Ya no sé qué somos',
];

const DOLORES = [
  'Reviso sus redes sin parar',
  'No sé si escribir o esperar',
  'Me da migajas de atención',
  'Miedo a que aparezca con alguien más',
];

const MOMENTOS = ['Apenas despierto', 'Durante el día, sin parar', 'En la noche, antes de dormir'];

// Agrupados por elemento (fuego/tierra/aire/agua) en vez de una grilla plana de
// 12 — el revisor marcó los 12-a-la-vez como riesgo de parálisis (máximo
// recomendado por decisión: 4). Agrupar no reduce las opciones (siguen siendo
// 12), pero las presenta como 4 decisiones chicas y reconocibles en vez de una
// sola decisión grande — más fácil de escanear sin perder ninguna opción.
const ELEMENTOS_SIGNO: { nombre: string; signos: string[] }[] = [
  { nombre: 'Fuego', signos: ['Aries', 'Leo', 'Sagitario'] },
  { nombre: 'Tierra', signos: ['Tauro', 'Virgo', 'Capricornio'] },
  { nombre: 'Aire', signos: ['Géminis', 'Libra', 'Acuario'] },
  { nombre: 'Agua', signos: ['Cáncer', 'Escorpio', 'Piscis'] },
];

const NO_SE_SIGNO = 'No estoy segura/o';

type Respuestas = {
  situacion?: string;
  dolor?: string;
  nombre?: string;
  signo?: string;
  otraPersonaNombre?: string;
  otraPersonaSigno?: string;
  momento?: string;
  detalle?: string;
};

const TOTAL_PREGUNTAS = 8;

/** Grilla de signos agrupada por elemento, compartida por los pasos 3 y 5. */
function GridSignos({ seleccionado, onSelect }: { seleccionado?: string; onSelect: (signo: string) => void }) {
  return (
    <div className="mt-6 flex flex-col gap-5">
      {ELEMENTOS_SIGNO.map((el) => (
        <div key={el.nombre}>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
            {el.nombre}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {el.signos.map((s) => (
              <ChipGrid key={s} seleccionado={seleccionado === s} onClick={() => onSelect(s)}>
                {s}
              </ChipGrid>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [r, setR] = useState<Respuestas>({});
  const [fraseCarga, setFraseCarga] = useState(0);
  const [cartaRevelada, setCartaRevelada] = useState(false);
  const [cartaTu, setCartaTu] = useState<Carta | null>(null);
  const [navegando, setNavegando] = useState(false);
  // Pasos 2 y 4: el botón antes se apagaba sin explicar por qué (campo vacío).
  // El revisor-visual lo marcó como violación de "el CTA nunca está disabled
  // por defecto" — ahora el botón SIEMPRE está activo; si tocan con el campo
  // vacío, se muestra el mensaje en vez de no reaccionar.
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorOtraPersona, setErrorOtraPersona] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduce = useReducedMotion();

  const siguiente = () => setPaso((p) => p + 1);
  const atras = () => setPaso((p) => Math.max(0, p - 1));

  const nombreOtra = r.otraPersonaNombre?.trim() || 'esa persona';

  const frasesCarga = [
    r.signo ? `Conectando tu energía de ${r.signo} con la de ${nombreOtra}…` : 'Leyendo tu situación…',
    r.detalle ? `Analizando “${r.detalle.trim().split(/\s+/).slice(0, 6).join(' ')}…”` : 'Analizando tu situación…',
    `Barajando tus 3 cartas: Tú, ${nombreOtra}, La Dinámica…`,
  ];

  // Paso 9: loading — cicla la micro-copy y avanza solo al resultado.
  useEffect(() => {
    if (paso !== 9) return;
    setFraseCarga(0);
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      setFraseCarga(Math.min(i, frasesCarga.length - 1));
    }, 800);
    const salida = setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      siguiente();
    }, 2700);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearTimeout(salida);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paso]);

  // Paso 10: revela la primera carta con un pequeño delay dramático. La carta
  // se sortea acá (una sola vez al entrar al paso) a partir de lo que la
  // persona escribió — antes quedaba hardcodeada en "La Estrella" sin
  // importar el texto, un bug real que el usuario detectó probando la app.
  useEffect(() => {
    if (paso !== 10) return;
    setCartaRevelada(false);
    setCartaTu(sortearCartas(r.detalle ?? '')[0].carta);
    const t = setTimeout(() => setCartaRevelada(true), reduce ? 0 : 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paso, reduce]);

  const irAPaywall = () => {
    if (navegando) return;
    setNavegando(true);
    try {
      sessionStorage.setItem('amor-tarot:onboarding', JSON.stringify(r));
    } catch (err) {
      // Safari privado o storage bloqueado: el paywall igual funciona sin
      // personalización previa, solo pierde el nombre/situación en pantalla.
      console.warn('No se pudo guardar la personalización (storage bloqueado):', err);
    }
    router.push('/paywall');
  };

  // Contenido del paso actual, calculado en una función interna: así el
  // return final puede envolverlo en AnimatePresence+key={paso} sin tocar
  // ninguno de los 11 bloques de abajo (cada uno conserva su propio
  // `return (...)`, que ahora sale de esta función interna, no del componente).
  const contenido = (() => {
  // ── Paso 0: situación ──────────────────────────────────────────────
  if (paso === 0) {
    return (
      <PantallaOnboarding pasoActual={1} totalPasos={TOTAL_PREGUNTAS} onSaltar={siguiente}>
        {/* Centrado vertical: con solo 4 opciones, el bloque flotaba pegado
            arriba y dejaba la mitad inferior vacía (el revisor lo leyó como
            "pantalla a medio construir", no como calma deliberada). */}
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="text-balance text-2xl font-bold leading-tight [font-family:var(--font-display)]">
            ¿Qué te trae por acá hoy?
          </h1>
          <div className="mt-6 flex flex-col gap-3">
            {SITUACIONES.map((op) => (
              <ChipOpcion
                key={op}
                seleccionado={r.situacion === op}
                onClick={() => {
                  setR({ ...r, situacion: op });
                  siguiente();
                }}
              >
                {op}
              </ChipOpcion>
            ))}
          </div>
        </div>
      </PantallaOnboarding>
    );
  }

  // ── Paso 1: dolor ──────────────────────────────────────────────────
  if (paso === 1) {
    return (
      <PantallaOnboarding pasoActual={2} totalPasos={TOTAL_PREGUNTAS} onAtras={atras} onSaltar={siguiente}>
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="text-balance text-2xl font-bold leading-tight [font-family:var(--font-display)]">
            ¿Qué es lo que más te quita el sueño?
          </h1>
          <div className="mt-6 flex flex-col gap-3">
            {DOLORES.map((op) => (
              <ChipOpcion
                key={op}
                seleccionado={r.dolor === op}
                onClick={() => {
                  setR({ ...r, dolor: op });
                  siguiente();
                }}
              >
                {op}
              </ChipOpcion>
            ))}
          </div>
        </div>
      </PantallaOnboarding>
    );
  }

  // ── Paso 2: nombre ─────────────────────────────────────────────────
  if (paso === 2) {
    return (
      <PantallaOnboarding pasoActual={3} totalPasos={TOTAL_PREGUNTAS} onAtras={atras}>
        <h1 className="text-balance text-2xl font-bold leading-tight [font-family:var(--font-display)]">
          ¿Cómo te llamas?
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Así vas a ver tu lectura, cada mañana.</p>
        <input
          autoFocus
          value={r.nombre ?? ''}
          onChange={(e) => {
            setR({ ...r, nombre: e.target.value });
            if (errorNombre) setErrorNombre(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && r.nombre?.trim()) siguiente();
          }}
          placeholder="Tu nombre"
          aria-invalid={errorNombre}
          className={`mt-6 h-14 w-full rounded-[var(--radius-card)] border bg-[var(--bg)] px-5 text-base text-[var(--text-primary)] outline-none focus:border-[var(--accent)] ${
            errorNombre ? 'border-[var(--danger)]' : 'border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)]'
          }`}
        />
        {errorNombre && <p className="mt-2 text-xs text-[var(--danger)]">Escribe tu nombre para continuar.</p>}
        <div className="mt-auto pt-8">
          <BotonPrincipal
            onClick={() => {
              if (!r.nombre?.trim()) {
                setErrorNombre(true);
                return;
              }
              siguiente();
            }}
          >
            Continuar
          </BotonPrincipal>
        </div>
      </PantallaOnboarding>
    );
  }

  // ── Paso 3: tu signo (alimenta Compatibilidad de signos) ──────────
  if (paso === 3) {
    return (
      <PantallaOnboarding pasoActual={4} totalPasos={TOTAL_PREGUNTAS} onAtras={atras} onSaltar={siguiente}>
        {/* Mismo centrado que los pasos 0/1/6: aunque esta pantalla tiene más
            contenido (4 encabezados + 12 chips), sigue dejando aire abajo —
            el revisor lo marcó porque el primer arreglo solo tocó los pasos
            de lista simple y se saltó este. */}
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="text-balance text-2xl font-bold leading-tight [font-family:var(--font-display)]">
            ¿Cuál es tu signo?
          </h1>
          <GridSignos
            seleccionado={r.signo}
            onSelect={(s) => {
              setR({ ...r, signo: s });
              siguiente();
            }}
          />
        </div>
      </PantallaOnboarding>
    );
  }

  // ── Paso 4: nombre de la otra persona ─────────────────────────────
  if (paso === 4) {
    return (
      <PantallaOnboarding pasoActual={5} totalPasos={TOTAL_PREGUNTAS} onAtras={atras} onSaltar={siguiente}>
        <h1 className="text-balance text-2xl font-bold leading-tight [font-family:var(--font-display)]">
          ¿De quién quieres claridad hoy?
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Su nombre o una inicial — como prefieras.</p>
        <input
          autoFocus
          value={r.otraPersonaNombre ?? ''}
          onChange={(e) => {
            setR({ ...r, otraPersonaNombre: e.target.value });
            if (errorOtraPersona) setErrorOtraPersona(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && r.otraPersonaNombre?.trim()) siguiente();
          }}
          placeholder="Su nombre o inicial"
          aria-invalid={errorOtraPersona}
          className={`mt-6 h-14 w-full rounded-[var(--radius-card)] border bg-[var(--bg)] px-5 text-base text-[var(--text-primary)] outline-none focus:border-[var(--accent)] ${
            errorOtraPersona ? 'border-[var(--danger)]' : 'border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)]'
          }`}
        />
        {errorOtraPersona && (
          <p className="mt-2 text-xs text-[var(--danger)]">Escribe un nombre o inicial para continuar.</p>
        )}
        <div className="mt-auto pt-8">
          <BotonPrincipal
            onClick={() => {
              if (!r.otraPersonaNombre?.trim()) {
                setErrorOtraPersona(true);
                return;
              }
              siguiente();
            }}
          >
            Continuar
          </BotonPrincipal>
        </div>
      </PantallaOnboarding>
    );
  }

  // ── Paso 5: signo de la otra persona ──────────────────────────────
  if (paso === 5) {
    return (
      <PantallaOnboarding pasoActual={6} totalPasos={TOTAL_PREGUNTAS} onAtras={atras} onSaltar={siguiente}>
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="text-balance text-2xl font-bold leading-tight [font-family:var(--font-display)]">
            ¿Y el signo de {nombreOtra}?
          </h1>
          <GridSignos
            seleccionado={r.otraPersonaSigno}
            onSelect={(s) => {
              setR({ ...r, otraPersonaSigno: s });
              siguiente();
            }}
          />
          <button
            type="button"
            onClick={() => {
              setR({ ...r, otraPersonaSigno: NO_SE_SIGNO });
              siguiente();
            }}
            className="mt-4 text-center text-sm font-semibold text-[var(--text-secondary)] underline underline-offset-2"
          >
            No estoy segura/o de su signo
          </button>
        </div>
      </PantallaOnboarding>
    );
  }

  // ── Paso 6: momento del día (ancla la hora de la notificación) ────
  if (paso === 6) {
    return (
      <PantallaOnboarding pasoActual={7} totalPasos={TOTAL_PREGUNTAS} onAtras={atras} onSaltar={siguiente}>
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="text-balance text-2xl font-bold leading-tight [font-family:var(--font-display)]">
            ¿En qué momento del día te pega más fuerte?
          </h1>
          <div className="mt-6 flex flex-col gap-3">
            {MOMENTOS.map((op) => (
              <ChipOpcion
                key={op}
                seleccionado={r.momento === op}
                onClick={() => {
                  setR({ ...r, momento: op });
                  siguiente();
                }}
              >
                {op}
              </ChipOpcion>
            ))}
          </div>
        </div>
      </PantallaOnboarding>
    );
  }

  // ── Paso 7: texto libre — últimas 48h (el input real del mecanismo) ──
  if (paso === 7) {
    const caracteresDetalle = (r.detalle ?? '').trim().length;
    const listo = caracteresDetalle >= 10;
    return (
      <PantallaOnboarding pasoActual={8} totalPasos={TOTAL_PREGUNTAS} onAtras={atras}>
        <h1 className="text-balance text-2xl font-bold leading-tight [font-family:var(--font-display)]">
          ¿Qué pasó entre ustedes en las últimas 48 horas?
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Tu lectura va a citar exactamente lo que escribas aquí.
        </p>
        <textarea
          autoFocus
          value={r.detalle ?? ''}
          onChange={(e) => {
            setR({ ...r, detalle: e.target.value });
            if (errorDetalle) setErrorDetalle(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && listo) siguiente();
          }}
          placeholder="Ej: Vio mi historia pero no me escribió, y desde el viernes no sé si..."
          rows={6}
          aria-invalid={errorDetalle && !listo}
          className={`mt-6 w-full flex-1 resize-none rounded-[var(--radius-card)] border bg-[var(--bg)] p-5 text-base leading-relaxed text-[var(--text-primary)] outline-none focus:border-[var(--accent)] ${
            errorDetalle && !listo ? 'border-[var(--danger)]' : 'border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)]'
          }`}
        />
        {/* Contador EN VIVO mientras escribe (mejora pedida tras el veredicto:
            antes el mínimo de 10 caracteres solo se explicaba al fallar, sin
            ninguna señal mientras se escribía). Neutro y silencioso si nunca
            tocaron el campo (caracteresDetalle === 0, no se nagea un campo
            vacío); cuenta regresiva en cuanto empiezan a escribir; pasa a
            --danger solo si además ya intentaron avanzar sin llegar al
            mínimo (mismo patrón que los pasos 2 y 4: el botón nunca se apaga
            por defecto). */}
        {caracteresDetalle > 0 && !listo && (
          <p className={`mt-2 text-xs ${errorDetalle ? 'text-[var(--danger)]' : 'text-[var(--text-secondary)]'}`}>
            Te faltan {10 - caracteresDetalle} caracteres para continuar.
          </p>
        )}
        <div className="mt-6">
          <BotonPrincipal
            onClick={() => {
              if (!listo) {
                setErrorDetalle(true);
                return;
              }
              siguiente();
            }}
          >
            Sacar mis 3 cartas
          </BotonPrincipal>
        </div>
      </PantallaOnboarding>
    );
  }

  // ── Paso 8: reconocimiento (desculpabiliza con la causa, no con un dato) ──
  if (paso === 8) {
    return (
      <PantallaOnboarding onAtras={atras}>
        <div className="flex flex-1 flex-col justify-center">
          <span
            aria-hidden="true"
            className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--chip-bg)]"
          >
            <Moon size={28} strokeWidth={1.8} color="var(--accent)" />
          </span>
          <p className="mt-6 text-balance text-center text-xl font-semibold leading-snug [font-family:var(--font-display)]">
            {r.dolor ? `“${r.dolor}” no es que estés exagerando.` : 'No es que estés exagerando.'}
          </p>
          <p className="mt-3 text-center text-base leading-relaxed text-[var(--text-secondary)]">
            Es que nadie te ha dado una lectura que hable de tu caso real — no de cualquiera.
          </p>
        </div>
        <div className="mt-6">
          <BotonPrincipal onClick={siguiente}>Ver mi lectura</BotonPrincipal>
        </div>
      </PantallaOnboarding>
    );
  }

  // ── Paso 9: loading — el argumento de apertura del paywall (02B) ─
  if (paso === 9) {
    return (
      <PantallaOnboarding>
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <div className="relative flex size-32 items-center justify-center">
            <svg width="128" height="128" viewBox="0 0 128 128" className="absolute inset-0" aria-hidden="true">
              <circle cx="64" cy="64" r="55" fill="none" stroke="var(--surface-2)" strokeWidth="10" />
              <motion.circle
                cx="64"
                cy="64"
                r="55"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="345.6"
                initial={{ strokeDashoffset: reduce ? 20 : 345.6 }}
                animate={{ strokeDashoffset: 20 }}
                transition={{ duration: reduce ? 0 : 2.7, ease: 'easeInOut' }}
                transform="rotate(-90 64 64)"
              />
            </svg>
            <svg viewBox="0 0 100 100" className="size-14" aria-hidden="true">
              <path
                d="M50 14 L58 39 L84 39 L63 54 L71 79 L50 64 L29 79 L37 54 L16 39 L42 39 Z"
                fill="var(--accent)"
              />
            </svg>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={fraseCarga}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="max-w-xs text-balance text-center text-base font-medium text-[var(--text-secondary)]"
            >
              {frasesCarga[fraseCarga]}
            </motion.p>
          </AnimatePresence>
        </div>
      </PantallaOnboarding>
    );
  }

  // ── Paso 10: teaser de 3 cartas (crea deseo, prepara el paywall) ──
  const primerasPalabras = (r.detalle ?? '').trim().split(/\s+/).slice(0, 8).join(' ');
  const detalleLargo = (r.detalle ?? '').trim().split(/\s+/).length > 8;
  // Volver desde el resultado saltaría al loading (paso 9), que no tiene vuelta
  // y avanza solo — sería un callejón sin salida. Se salta directo al paso 8.
  const volverDesdeResultado = () => setPaso(8);
  return (
    <PantallaOnboarding onAtras={volverDesdeResultado}>
      <div className="flex flex-1 flex-col gap-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.09 } } }}
          className="mt-2 flex flex-col items-center text-center"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: reduce ? 0 : 10 }, visible: { opacity: 1, y: 0 } }}>
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Hola, {r.nombre || 'de nuevo'}</p>
            <h1 className="mt-1 text-2xl font-bold [font-family:var(--font-display)]">
              Tus <span className="text-[var(--accent)]">3 cartas</span> están listas
            </h1>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: reduce ? 0 : 10 }, visible: { opacity: 1, y: 0 } }}
            className="relative mt-8 flex items-end justify-center gap-4 rounded-[24px] px-4 py-5"
            style={{
              background:
                'radial-gradient(320px 200px at 50% 50%, color-mix(in oklab, var(--accent) 20%, transparent) 0%, transparent 72%)',
            }}
          >
            <TarjetaTarot revelada={cartaRevelada} nombreCarta={cartaTu?.nombre ?? ''} etiqueta="Tú" tamano="lg" />
            <TarjetaTarot revelada={false} etiqueta={nombreOtra} />
            <TarjetaTarot revelada={false} etiqueta="La Dinámica" />
          </motion.div>

          {primerasPalabras && cartaTu && (
            <motion.div
              variants={{ hidden: { opacity: 0, y: reduce ? 0 : 10 }, visible: { opacity: 1, y: 0 } }}
              className="relative mt-6 max-w-xs overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_18%,transparent)] bg-[var(--surface)] px-5 py-4 text-left"
            >
              <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                “{primerasPalabras}
                {detalleLargo ? '…' : ''}” — {cartaTu.nombre} marca un momento de {cartaTu.esencia} en tu
                situación.{' '}
                <strong className="font-bold">Pero eso es solo la mitad de tu lectura.</strong>
              </p>
            </motion.div>
          )}
        </motion.div>

        <div className="mt-auto">
          <BotonPrincipal onClick={irAPaywall} cargando={navegando}>
            {navegando ? 'Un momento…' : 'Ver mi lectura completa'}
          </BotonPrincipal>
        </div>
      </div>
    </PantallaOnboarding>
  );
  })();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={paso}
        initial={{ opacity: 0, x: reduce ? 0 : 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: reduce ? 0 : -16 }}
        transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {contenido}
      </motion.div>
    </AnimatePresence>
  );
}
