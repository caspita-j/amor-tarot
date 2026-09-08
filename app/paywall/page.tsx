'use client';

// Paywall de Amor & Tarot — responde las 7 preguntas de 02B en este orden:
// qué desbloqueo · por qué ahora · qué pierdo · qué gano hoy · puedo cancelar ·
// qué plan me conviene · salida limpia. Lee el nombre/situación que la persona
// escribió en /onboarding (sessionStorage — el guardado real en cuenta llega
// en la Sesión 6) para que el encabezado se sienta personal, nunca genérico.
// El CTA de pago es STICKY: en una pantalla con varias secciones, la acción
// de conversión tiene que estar a un toque sin importar cuánto se haya
// scrolleado (mismo principio que StickyCtaMobile del kit de landing).

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Check, Shield, XCircle } from 'lucide-react';
import { BotonPrincipal, TarjetaTarot } from '@/components/onboarding/ui';

type Respuestas = {
  nombre?: string;
  detalle?: string;
  situacion?: string;
  otraPersonaNombre?: string;
};

const PLANES = {
  anual: {
    id: 'anual' as const,
    nombre: 'Anual',
    badge: 'MÁS POPULAR',
    precioMes: '$3.66',
    totalAnual: 'Se cobra $43.99/año',
    ahorro: 'Ahorras $39.89 al año (casi 6 meses gratis)',
  },
  mensual: {
    id: 'mensual' as const,
    nombre: 'Mensual',
    badge: null,
    precioMes: '$6.99',
    totalAnual: 'Se cobra $6.99/mes',
    ahorro: null,
  },
};

function fechaDeCobro(diasPrueba: number): string {
  const d = new Date();
  d.setDate(d.getDate() + diasPrueba);
  return d.toLocaleDateString('es', { day: 'numeric', month: 'long' });
}

const VARIANTS = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function PaywallPage() {
  const router = useRouter();
  const [r, setR] = useState<Respuestas>({});
  const [plan, setPlan] = useState<'anual' | 'mensual'>('anual');
  const [cargando, setCargando] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const guardado = sessionStorage.getItem('amor-tarot:onboarding');
    if (!guardado) return;
    try {
      setR(JSON.parse(guardado));
    } catch {
      // sessionStorage corrupto o de otra versión — se sigue con valores vacíos,
      // el encabezado ya tiene su copy genérico de respaldo (nombre "de nuevo").
    }
  }, []);

  const nombre = r.nombre?.trim() || 'de nuevo';
  const seleccionado = PLANES[plan];
  const nombreOtra = r.otraPersonaNombre?.trim() || 'La Otra Persona';

  const continuar = () => {
    if (cargando) return;
    setCargando(true);
    try {
      sessionStorage.setItem('amor-tarot:plan', plan);
    } catch {
      // Safari privado o storage bloqueado: se sigue al login igual, el plan
      // elegido se puede volver a confirmar ahí.
    }
    router.push('/login');
  };

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="relative min-h-0 flex-1">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(720px 460px at 50% -10%, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 62%)',
        }}
      />
      <div className="relative z-10 h-full overflow-y-auto px-6 pt-6 pb-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.08 } } }}
          className="mx-auto flex w-full max-w-md flex-col"
        >
          <motion.div variants={VARIANTS} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Volver"
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] outline-none hover:bg-[var(--surface-2)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <span className="size-7 shrink-0 rounded-xl bg-[var(--accent)]" aria-hidden="true" />
            <span className="text-sm font-bold [font-family:var(--font-display)]">Amor & Tarot</span>
          </motion.div>

          {/* 1. QUÉ DESBLOQUEO + 2. POR QUÉ AHORA — personalizado con su propia situación */}
          <motion.h1
            variants={VARIANTS}
            className="mt-5 text-balance text-2xl font-bold leading-tight [font-family:var(--font-display)]"
          >
            Tu lectura <span className="text-[var(--accent)]">completa</span> está lista, {nombre}
          </motion.h1>
          <motion.p variants={VARIANTS} className="mt-3 text-sm font-medium leading-relaxed text-[var(--text-primary)]">
            Ese nudo en el estómago por no saber qué paso dar no se resuelve solo con 1 carta.
          </motion.p>
          {/* Teaser corto: nombra el mecanismo y deja el cierre de bucle
              incompleto (faltan 2 cartas) — sin alargar el párrafo. */}
          <motion.div
            variants={VARIANTS}
            className="mt-3 rounded-[var(--radius-card)] bg-[var(--surface)] px-4 py-3"
          >
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              <strong className="font-semibold text-[var(--text-primary)]">El Espejo de las 3 Cartas</strong> ya
              leyó tu carta — faltan {nombreOtra} y La Dinámica para terminar
              <span className="text-[var(--text-primary)]">…</span>
            </p>
          </motion.div>

          {/* 3. QUÉ PIERDO — recap: 1 carta de tarot real revelada + 2 bloqueadas */}
          <motion.div variants={VARIANTS} className="mt-5 flex items-start justify-center gap-4">
            <TarjetaTarot revelada nombreCarta="La Estrella" etiqueta="Tú" tamano="sm" />
            <TarjetaTarot revelada={false} etiqueta={nombreOtra} tamano="sm" bloqueada />
            <TarjetaTarot revelada={false} etiqueta="La Dinámica" tamano="sm" bloqueada />
          </motion.div>

          {/* 4. QUÉ GANO HOY — en resultado, no en función */}
          <motion.ul variants={VARIANTS} className="mt-5 flex flex-col gap-2">
            {[
              'Saber si escribirle o mantener la distancia, sin dudar',
              'Entender qué significa lo que está pasando entre ustedes',
              'La compatibilidad real de sus signos, no un genérico',
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
                  <Check size={13} strokeWidth={3} color="var(--accent)" />
                </span>
                {f}
              </li>
            ))}
          </motion.ul>

          {/* 6. CUÁL PLAN ME CONVIENE — cards seleccionables */}
          <motion.p variants={VARIANTS} className="mt-8 text-xs font-semibold text-[var(--text-secondary)]">
            Cada mes: El Espejo de las 3 Cartas sin límite, Compatibilidad de signos y tu Carta del día.
          </motion.p>
          <motion.div variants={VARIANTS} className="mt-3 flex flex-col gap-3">
            {(['anual', 'mensual'] as const).map((id) => {
              const p = PLANES[id];
              const activo = plan === id;
              return (
                <motion.button
                  key={id}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPlan(id)}
                  className={`relative rounded-[var(--radius-card)] border-2 p-4 text-left shadow-[var(--shadow-1)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
                    activo
                      ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)]'
                      : 'border-transparent bg-[var(--surface)]'
                  }`}
                >
                  {p.badge && (
                    <span className="absolute -top-3 right-4 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--bg)]">
                      {p.badge}
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{p.nombre}</p>
                      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{p.totalAnual}</p>
                      {p.ahorro && <p className="mt-0.5 text-xs font-semibold text-[var(--accent)]">{p.ahorro}</p>}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`font-bold tabular-nums [font-family:var(--font-display)] ${activo ? 'text-2xl text-[var(--accent)]' : 'text-xl'}`}
                      >
                        {p.precioMes}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">/mes</span>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`absolute right-4 top-4 flex size-5 items-center justify-center rounded-full border-2 ${
                      activo ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--surface-2)]'
                    }`}
                  >
                    {activo && <Check size={12} strokeWidth={3} color="var(--bg)" />}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* 5. PUEDO CANCELAR — línea de tiempo de cobro (anti-cobro-sorpresa,
              responde directo la objeción #1 de FICHA-AVATAR.md) */}
          <motion.div variants={VARIANTS} className="mt-6 rounded-[var(--radius-card)] bg-[var(--surface-2)] px-4 py-5 shadow-[inset_0_1px_2px_rgb(0_0_0_/_0.04)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
              Así funciona tu prueba — sin sorpresas
            </p>
            <div className="mt-4 flex items-start justify-between">
              {[
                { dia: 'Hoy', detalle: '$0.00 — tu lectura completa' },
                { dia: 'Día 2', detalle: 'Te avisamos antes de cobrar' },
                { dia: 'Día 3', detalle: `${seleccionado.precioMes.replace('/mes', '')} si no cancelaste` },
              ].map((paso, i) => (
                <div key={paso.dia} className="flex flex-1 flex-col items-center text-center">
                  <div className="flex w-full items-center">
                    <div className={`h-0.5 flex-1 ${i === 0 ? 'bg-transparent' : 'bg-[var(--accent)]'}`} />
                    <span
                      className={`flex size-3 shrink-0 items-center justify-center rounded-full ${
                        i === 0 ? 'bg-[var(--accent)]' : 'border-2 border-[var(--accent)] bg-[var(--surface)]'
                      }`}
                    />
                    <div className={`h-0.5 flex-1 ${i === 2 ? 'bg-transparent' : 'bg-[var(--accent)]'}`} />
                  </div>
                  <p className="mt-2 text-xs font-bold text-[var(--text-primary)]">{paso.dia}</p>
                  <p className="mt-0.5 px-1 text-xs leading-snug text-[var(--text-secondary)]">{paso.detalle}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-snug text-[var(--text-secondary)]">
              Se te cobrará recién el{' '}
              <strong className="font-semibold text-[var(--text-primary)]">{fechaDeCobro(3)}</strong> — cancela
              cuando quieras desde tu perfil, y la Garantía de los 7 Días te cubre igual.
            </p>
          </motion.div>

          {/* Insignias de confianza — honestas: sin nombrar una pasarela que aún no se elige (Sesión 6) */}
          <motion.div variants={VARIANTS} className="mt-4 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
              <Shield size={14} className="text-[var(--accent)]" /> Pago protegido
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
              <XCircle size={14} className="text-[var(--accent)]" /> Cancela en 1 clic
            </span>
          </motion.div>

          {/* Enlaces legales — deben existir en toda pantalla de cobro (47) */}
          <motion.div variants={VARIANTS} className="mt-4 flex items-center justify-center gap-3 text-xs text-[var(--text-secondary)]">
            <Link href="/terminos" className="underline underline-offset-2">
              Términos
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/privacidad" className="underline underline-offset-2">
              Privacidad
            </Link>
          </motion.div>
        </motion.div>
      </div>
      {/* Aviso de que hay más para ver scrolleando — vignette fija, no se va con el scroll */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--bg)] to-transparent"
      />
      </div>

      {/* CTA fija abajo: el contenido scrollea DENTRO de su propio contenedor (alto = pantalla
          − footer), así el footer nunca puede taparlo, sin importar el alto real del teléfono. */}
      <div className="shrink-0 border-t border-[color-mix(in_oklab,var(--text-secondary)_14%,transparent)] bg-[var(--bg)] px-6 pb-[max(env(safe-area-inset-bottom),16px)] pt-4">
        <div className="mx-auto w-full max-w-md">
          <BotonPrincipal onClick={continuar} cargando={cargando}>
            {cargando ? 'Un momento…' : 'Empezar mis 3 días gratis'}
          </BotonPrincipal>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-[var(--text-secondary)]">
            <Shield size={12} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
            Garantía de 7 días · después, {seleccionado.precioMes} — cancela cuando quieras.
          </p>
          {/* 7. SALIDA LIMPIA — sin culpa */}
          <Link
            href="/app"
            className="mt-3 block text-center text-sm font-medium text-[var(--text-secondary)] underline underline-offset-2"
          >
            Ahora no, seguir con lo básico
          </Link>
        </div>
      </div>
    </main>
  );
}
