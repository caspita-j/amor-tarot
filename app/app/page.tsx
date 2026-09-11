'use client';

// Inicio — el ritual diario (M0 de 56-MOMENTOS-EMOCIONALES.md). 4 piezas
// fijas, en este orden, sin convertirse en dashboard: (1) dato de hoy — el
// aro medidor con la carta del día, (2) acción de 1 tap — tocar el aro
// revela la carta Y registra el día (mismo gesto), (3) racha visible pero no
// protagonista (M4: apagada/gris si aún no hay registro hoy, nunca roja),
// (4) insight en la voz de "El Espejo de las 3 Cartas". Debajo, accesos a
// Lecturas y Compatibilidad (grid de A) — no son parte del ritual, son
// navegación secundaria.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight, CloudRain, Feather, Leaf, Sparkles, Sunrise, Waves } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { AroMedidor } from '@/components/app/AroMedidor';
import { BolaDeCristal } from '@/components/app/BolaDeCristal';
import { RachaBanner } from '@/components/app/RachaBanner';
import { SemanaStrip } from '@/components/app/SemanaStrip';
import { VideoCartaDelDia } from '@/components/app/VideoCartaDelDia';
import { TarjetaTarot } from '@/components/onboarding/ui';
import { cartaDelDia, hoyISO, tituloFecha } from '@/lib/tarot-data';
import { ESTADOS, colorEstado, labelEstado, type Estado } from '@/lib/animo';
import { leerFotoPerfil, leerOnboarding } from '@/lib/estado-app';
import {
  guardarEstadoAnimo,
  leerEstadosAnimoRango,
  leerPerfil,
  registrarDia,
  sincronizarOnboardingSiHaceFalta,
} from '@/lib/supabase/datos';

const ICONO_ESTADO: Record<Estado, typeof Feather> = {
  tranquila: Feather,
  esperanzada: Sunrise,
  ansiosa: Waves,
  triste: CloudRain,
};

function inicioFinSemana(): { inicio: string; fin: string } {
  const hoy = new Date();
  const ini = new Date(hoy);
  ini.setDate(hoy.getDate() - hoy.getDay());
  const fin = new Date(ini);
  fin.setDate(ini.getDate() + 6);
  return { inicio: ini.toISOString().slice(0, 10), fin: fin.toISOString().slice(0, 10) };
}

export default function InicioPage() {
  const [listo, setListo] = useState(false);
  const [nombre, setNombre] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [racha, setRacha] = useState<{ dias: number; ultimaFecha: string | null }>({ dias: 0, ultimaFecha: null });
  const [cartaRevelada, setCartaRevelada] = useState(false);
  const [aroRevelado, setAroRevelado] = useState(false);
  const [estadosSemana, setEstadosSemana] = useState<Record<string, Estado>>({});
  const [guardandoEstado, setGuardandoEstado] = useState(false);
  const reduce = useReducedMotion();
  const hoy = hoyISO();
  const carta = cartaDelDia(hoy);

  useEffect(() => {
    (async () => {
      await sincronizarOnboardingSiHaceFalta(leerOnboarding());
      const perfil = await leerPerfil();
      setNombre(perfil.nombre?.trim() || 'ahí');
      setFoto(leerFotoPerfil());
      setRacha({ dias: perfil.rachaDias, ultimaFecha: perfil.rachaUltimaFecha });
      const { inicio, fin } = inicioFinSemana();
      setEstadosSemana(await leerEstadosAnimoRango(inicio, fin));
      setListo(true);
    })();
  }, []);

  const estadoHoy = estadosSemana[hoy];

  const elegirEstado = async (estado: Estado) => {
    if (guardandoEstado) return;
    setGuardandoEstado(true);
    setEstadosSemana((prev) => ({ ...prev, [hoy]: estado }));
    try {
      await guardarEstadoAnimo(hoy, estado);
    } finally {
      setGuardandoEstado(false);
    }
  };

  const registradoHoy = racha.ultimaFecha === hoy;

  // La carta se MONTA ya revelada al recargar un día ya registrado, pero
  // recién se REVELA (flip) un instante después de tocar el aro — mismo
  // patrón que el reveal del onboarding, para que el flip de TarjetaTarot
  // sí corra (revelada=true desde el primer render no anima nada).
  useEffect(() => {
    if (!registradoHoy) {
      setCartaRevelada(false);
      setAroRevelado(false);
      return;
    }
    const t = setTimeout(() => setCartaRevelada(true), reduce ? 0 : 350);
    return () => clearTimeout(t);
  }, [registradoHoy, reduce]);

  // Al tocar el aro, primero se rellena y cuenta hasta 74% (dispara su propia
  // animación en AroMedidor) y RECIÉN después se registra el día y se
  // intercambia por TarjetaTarot — antes el registro era instantáneo y el
  // aro nunca llegaba a mostrarse relleno.
  const revelarYRegistrar = () => {
    setAroRevelado(true);
    setTimeout(
      () => {
        registrarDia().then(setRacha);
      },
      reduce ? 0 : 900
    );
  };

  if (!listo) {
    return (
      <div className="flex h-64 items-center justify-center" role="status" aria-label="Cargando">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--surface-2)] border-t-[var(--accent)]" />
      </div>
    );
  }

  const contenedor = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div className="pt-4" initial="hidden" animate="visible" variants={contenedor}>
      <motion.header variants={item} className="flex items-start justify-between px-4">
        <div>
          <p className="text-xs font-bold text-[color-mix(in_oklab,var(--text-secondary)_85%,transparent)]">
            {tituloFecha()}
          </p>
          <h1 className="mt-0.5 flex items-center gap-1.5 text-2xl font-bold [font-family:var(--font-display)]">
            Hola, {nombre}
            <BolaDeCristal className="size-6 shrink-0" />
          </h1>
        </div>
        <Link
          href="/app/perfil"
          aria-label="Ir a tu perfil"
          className="mt-0.5 flex size-14 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-base font-bold text-[var(--bg)] [font-family:var(--font-display)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
        >
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={foto} alt="" className="size-full rounded-full object-cover" />
          ) : (
            nombre.charAt(0).toUpperCase()
          )}
        </Link>
      </motion.header>

      <motion.div
        variants={item}
        className="relative mx-4 mt-3.5 overflow-hidden rounded-[var(--radius-card)] bg-[var(--accent)] px-4 pb-4 pt-5 text-center shadow-[var(--shadow-2)]"
      >
        <p className="text-left text-xs font-bold tracking-wide text-[color-mix(in_oklab,var(--bg)_92%,transparent)]">
          CARTA DEL DÍA
        </p>
        <div className="mt-2.5 flex justify-center">
          {registradoHoy ? (
            <TarjetaTarot revelada={cartaRevelada} nombreCarta={carta.nombre} tamano="lg" />
          ) : (
            <AroMedidor
              revelada={aroRevelado}
              nombreCarta={carta.nombre}
              esencia={carta.esencia}
              onTap={revelarYRegistrar}
            />
          )}
        </div>
        {registradoHoy && (
          <p className="mt-2.5 text-xs font-bold uppercase tracking-wide text-[var(--bg)]">
            Energía de hoy: {carta.esencia}
          </p>
        )}
        <p className="mt-2.5 text-xs leading-relaxed text-[var(--bg)]">
          {registradoHoy ? carta.frase : 'Toca el aro para activar el hechizo de hoy.'}
        </p>
      </motion.div>

      {registradoHoy && cartaRevelada && (
        <motion.div variants={item} className="mx-4 mt-3.5 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
          {estadoHoy ? (
            <p className="text-sm font-semibold text-[var(--text-secondary)]">
              Hoy te sentiste{' '}
              <span className="font-bold" style={{ color: colorEstado(estadoHoy) }}>
                {labelEstado(estadoHoy)}
              </span>
            </p>
          ) : (
            <>
              <p className="text-sm font-bold [font-family:var(--font-display)]">¿Cómo te sientes hoy?</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {ESTADOS.map(({ id, label, color }) => {
                  const Icono = ICONO_ESTADO[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => elegirEstado(id)}
                      disabled={guardandoEstado}
                      className="flex flex-col items-center gap-1.5 rounded-[var(--radius-button)] py-1.5 outline-none disabled:opacity-50"
                    >
                      <span
                        className="flex size-9 items-center justify-center rounded-full"
                        style={{ backgroundColor: `color-mix(in oklab, ${color} 16%, transparent)` }}
                      >
                        <Icono size={16} color={color} aria-hidden="true" />
                      </span>
                      <span className="text-center text-xs font-semibold leading-tight text-[var(--text-secondary)]">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      )}

      <SemanaStrip estados={estadosSemana} />

      <RachaBanner dias={racha.dias} registradoHoy={registradoHoy} onRegistrar={revelarYRegistrar} />

      <VideoCartaDelDia />

      <motion.p variants={item} className="mx-4 mt-5 text-sm font-bold [font-family:var(--font-display)]">
        Tu momento
      </motion.p>
      <motion.div variants={item} className="mx-4 mt-2.5 flex flex-col gap-2.5">
        <Link
          href="/app/lecturas"
          className="flex min-h-32 flex-col justify-between rounded-[var(--radius-card)] bg-[var(--accent-2)] p-4 shadow-[0_12px_26px_-12px_var(--accent-2)] transition-transform active:scale-[0.98]"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="w-fit rounded-full bg-[var(--bg)] px-2 py-0.5 text-xs font-bold text-[var(--text-primary)]">
              Situación
            </span>
            <ArrowRight size={18} strokeWidth={2.5} color="var(--text-primary)" aria-hidden="true" />
          </div>
          <span>
            <span className="block text-base font-bold [font-family:var(--font-display)]">Cuéntame tu situación</span>
            <span className="mt-0.5 block text-xs text-[color-mix(in_oklab,var(--text-primary)_60%,transparent)]">
              3 cartas · pareja, trabajo, familia o lo que sea
            </span>
          </span>
        </Link>
        <Link
          href="/app/lecturas?ir=compatibilidad"
          className="flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--accent-3)] px-3.5 py-3 shadow-[0_8px_18px_-12px_var(--accent-3)] transition-transform active:scale-[0.98]"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--bg)]">
            <Sparkles size={16} strokeWidth={2} color="var(--text-primary)" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold [font-family:var(--font-display)]">Compatibilidad</span>
            <span className="block truncate text-xs text-[color-mix(in_oklab,var(--text-primary)_60%,transparent)]">
              Descubre qué dicen sus signos
            </span>
          </span>
          <ChevronRight size={16} strokeWidth={2} color="var(--text-primary)" aria-hidden="true" className="shrink-0" />
        </Link>
        <Link
          href="/app/bienestar"
          className="flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] px-3.5 py-3 transition-transform active:scale-[0.98]"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
            <Leaf size={16} strokeWidth={2} color="var(--accent)" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold [font-family:var(--font-display)]">Bienestar</span>
            <span className="block truncate text-xs text-[var(--text-secondary)]">
              Prácticas caseras para tu día a día
            </span>
          </span>
          <ChevronRight size={16} strokeWidth={2} color="var(--text-secondary)" aria-hidden="true" className="shrink-0" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
