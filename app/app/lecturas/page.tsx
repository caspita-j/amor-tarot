'use client';

// Lecturas — el flujo central del producto: sacar una lectura de CUALQUIER
// duda del día a día (no solo pareja — pedido explícito del usuario para que
// la app se sienta como un hombro donde desahogarse) o ver compatibilidad de
// signos. Protagonista único: SACAR una lectura, no navegar una lista.

import { useEffect, useRef, useState } from 'react';
import { Briefcase, Heart, HeartHandshake, ImagePlus, MessageCircleHeart, Scale, Sparkles, Users, X } from 'lucide-react';
import { AnimacionCartas } from '@/components/app/AnimacionCartas';
import { AnilloCompatibilidad } from '@/components/app/AnilloCompatibilidad';
import { BotonPrincipal, TarjetaTarot } from '@/components/onboarding/ui';
import {
  compatibilidad,
  esenciaDe,
  esSituacionDeCrisis,
  fraseDe,
  mensajeDeCrisis,
  nombreConOrientacion,
  sortearCartas,
  type CartaSalida,
} from '@/lib/tarot-data';
import { CATEGORIAS, etiquetaCarta2, etiquetaCarta3, pideOtraPersona, type Categoria } from '@/lib/categorias';
import { SIGNOS, imagenSigno } from '@/lib/zodiaco';
import { leerOnboarding, type RespuestasOnboarding } from '@/lib/estado-app';
import { guardarLecturaReal, registrarDia } from '@/lib/supabase/datos';
import { comprimirProporcional } from '@/lib/imagen';

const MAX_FOTOS = 3;

const ICONO_CATEGORIA: Record<Categoria, typeof Heart> = {
  pareja: Heart,
  trabajo: Briefcase,
  familia: Users,
  amistad: HeartHandshake,
  decision: Scale,
  otro: Sparkles,
};

function tituloSituacion(categoria: Categoria, nombreOtra: string): string {
  if (pideOtraPersona(categoria) && nombreOtra.trim()) return `¿Qué está pasando con ${nombreOtra.trim()}?`;
  switch (categoria) {
    case 'pareja':
      return '¿Qué está pasando en tu relación?';
    case 'trabajo':
      return '¿Qué está pasando en el trabajo?';
    case 'familia':
      return '¿Qué está pasando en tu familia?';
    case 'amistad':
      return '¿Qué está pasando con esa amistad?';
    case 'decision':
      return '¿Qué decisión tienes que tomar?';
    default:
      return 'Cuéntame qué está pasando';
  }
}

function SignoChip({ signo, seleccionado, onClick }: { signo: string; seleccionado: boolean; onClick: () => void }) {
  const imagen = imagenSigno(signo);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={seleccionado}
      className="flex flex-col items-center gap-1.5"
    >
      <span
        className={`flex size-14 items-center justify-center overflow-hidden rounded-full outline-none transition-transform ${
          seleccionado ? 'scale-105 ring-2 ring-[var(--accent)]' : 'ring-1 ring-[color-mix(in_oklab,var(--text-secondary)_18%,transparent)]'
        }`}
      >
        {imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagen} alt="" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center bg-[var(--surface)] text-xs font-bold">
            {signo.slice(0, 2)}
          </span>
        )}
      </span>
      <span className="text-xs font-semibold text-[var(--text-secondary)]">{signo}</span>
    </button>
  );
}

type Modo = 'menu' | 'categoria' | 'situacion-form' | 'cargando' | 'resultado' | 'crisis' | 'compat-form' | 'compat-resultado';

export default function LecturasPage() {
  const [modo, setModo] = useState<Modo>('menu');
  const [onboarding, setOnboarding] = useState<RespuestasOnboarding>({});
  const [categoria, setCategoria] = useState<Categoria>('pareja');
  const [nombreOtraInput, setNombreOtraInput] = useState('');
  const [situacion, setSituacion] = useState('');
  const [cartas, setCartas] = useState<[CartaSalida, CartaSalida, CartaSalida] | null>(null);
  const [resumen, setResumen] = useState('');
  const [resumenListo, setResumenListo] = useState(false);
  const [errorLectura, setErrorLectura] = useState<string | null>(null);
  const [guardada, setGuardada] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [signoA, setSignoA] = useState('');
  const [signoB, setSignoB] = useState('');
  const [compat, setCompat] = useState<{ puntaje: number; texto: string } | null>(null);
  const [fotos, setFotos] = useState<string[]>([]);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const inputFotoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const r = leerOnboarding();
    setOnboarding(r);
    setSignoA(r.signo ?? '');
    setSignoB(r.otraPersonaSigno ?? '');
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('ir') === 'compatibilidad') {
      setModo('compat-form');
    }
  }, []);

  const nombreOtra = etiquetaCarta2(categoria, nombreOtraInput);
  const carta3 = etiquetaCarta3(categoria);

  const elegirCategoria = (c: Categoria) => {
    setCategoria(c);
    if (c === 'pareja') {
      setNombreOtraInput(onboarding.otraPersonaNombre ?? '');
      if (!situacion.trim()) setSituacion(onboarding.detalle ?? '');
    } else {
      setNombreOtraInput('');
    }
    setModo('situacion-form');
  };

  const sacarLectura = async () => {
    if (!situacion.trim()) return;
    if (esSituacionDeCrisis(situacion)) {
      setModo('crisis');
      return;
    }
    const situacionTexto = situacion.trim();
    const nuevasCartas = sortearCartas(situacionTexto);
    setCartas(nuevasCartas);
    setResumen('');
    setResumenListo(false);
    setErrorLectura(null);
    setGuardada(false);
    setModo('cargando');

    try {
      const resp = await fetch('/api/lectura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situacion: situacionTexto,
          categoria,
          nombreOtra,
          cartas: nuevasCartas.map((c) => ({
            nombre: c.carta.nombre,
            invertida: c.invertida,
            esencia: esenciaDe(c),
            frase: fraseDe(c),
          })),
        }),
      });

      if (resp.status === 422) {
        setModo('crisis');
        return;
      }
      if (resp.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (!resp.ok || !resp.body) {
        let mensaje = 'No pudimos escribir tu lectura esta vez. Tus cartas ya salieron — puedes intentar de nuevo.';
        try {
          const data = (await resp.clone().json()) as { mensaje?: string };
          if (data?.mensaje) mensaje = data.mensaje;
        } catch {
          // La respuesta no traía JSON (ej. error de red) — se usa el mensaje genérico.
        }
        setErrorLectura(mensaje);
        setModo('resultado');
        return;
      }

      setModo('resultado');
      const lector = resp.body.getReader();
      const decodificador = new TextDecoder();
      let acumulado = '';
      for (;;) {
        const { done, value } = await lector.read();
        if (done) break;
        acumulado += decodificador.decode(value, { stream: true });
        setResumen(acumulado);
      }
      setResumenListo(true);
    } catch {
      setErrorLectura('No pudimos escribir tu lectura esta vez. Tus cartas ya salieron — puedes intentar de nuevo.');
      setModo('resultado');
    }
  };

  const guardarEnHistorial = async () => {
    if (!cartas || !resumenListo || guardada || guardando) return;
    setGuardando(true);
    try {
      await guardarLecturaReal({
        situacion: situacion.trim(),
        cartas: [
          nombreConOrientacion(cartas[0]),
          nombreConOrientacion(cartas[1]),
          nombreConOrientacion(cartas[2]),
        ],
        resumen,
        fotos: fotos.length > 0 ? fotos : undefined,
        categoria,
      });
      await registrarDia();
      setGuardada(true);
    } finally {
      setGuardando(false);
    }
  };

  const agregarFotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(e.target.files ?? []).slice(0, MAX_FOTOS - fotos.length);
    e.target.value = '';
    if (archivos.length === 0) return;
    setSubiendoFoto(true);
    try {
      const comprimidas = await Promise.all(archivos.map((a) => comprimirProporcional(a)));
      setFotos((prev) => [...prev, ...comprimidas].slice(0, MAX_FOTOS));
    } catch {
      // Formato no soportado o imagen corrupta: se ignora, el usuario puede
      // intentar con otra — no bloquea el resto del formulario.
    } finally {
      setSubiendoFoto(false);
    }
  };

  const quitarFoto = (i: number) => setFotos((prev) => prev.filter((_, idx) => idx !== i));

  const volverAlMenu = () => {
    setModo('menu');
    setSituacion('');
    setFotos([]);
  };

  const verCompatibilidad = () => {
    if (!signoA || !signoB) return;
    setCompat(compatibilidad(signoA, signoB));
    setModo('compat-resultado');
  };

  // ── Menú ───────────────────────────────────────────────────────────
  if (modo === 'menu') {
    return (
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold [font-family:var(--font-display)]">Lecturas</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Elige qué quieres entender hoy.</p>

        <button
          type="button"
          onClick={() => setModo('categoria')}
          className="mt-5 flex w-full items-start gap-3.5 rounded-[var(--radius-card)] bg-[var(--accent-2)] p-4 text-left"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--bg)_55%,transparent)]">
            <MessageCircleHeart size={20} color="var(--text-primary)" />
          </span>
          <span>
            <span className="block text-base font-bold [font-family:var(--font-display)]">Cuéntame tu situación</span>
            <span className="mt-1 block text-sm text-[color-mix(in_oklab,var(--text-primary)_65%,transparent)]">
              De pareja, trabajo, familia o lo que sea — recibe 3 cartas y un paso concreto.
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setModo('compat-form')}
          className="mt-3 flex w-full items-start gap-3.5 rounded-[var(--radius-card)] bg-[var(--accent-3)] p-4 text-left"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--bg)_55%,transparent)]">
            <Heart size={20} color="var(--text-primary)" />
          </span>
          <span>
            <span className="block text-base font-bold [font-family:var(--font-display)]">Compatibilidad de signos</span>
            <span className="mt-1 block text-sm text-[color-mix(in_oklab,var(--text-primary)_65%,transparent)]">
              Compara tu signo con el de quien quieras.
            </span>
          </span>
        </button>
      </div>
    );
  }

  // ── Elegir categoría ───────────────────────────────────────────────
  if (modo === 'categoria') {
    return (
      <div className="px-4 pt-4">
        <button type="button" onClick={() => setModo('menu')} className="w-fit text-sm font-semibold text-[var(--text-secondary)]">
          ← Volver
        </button>
        <h1 className="mt-4 text-balance text-2xl font-bold leading-tight [font-family:var(--font-display)]">
          ¿De qué se trata tu duda?
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Elige lo que más se le parezca.</p>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {CATEGORIAS.map(({ id, label }) => {
            const Icono = ICONO_CATEGORIA[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => elegirCategoria(id)}
                className="flex flex-col items-start gap-2.5 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 text-left"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-[var(--chip-bg)]">
                  <Icono size={17} color="var(--accent)" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold [font-family:var(--font-display)]">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Situación: formulario ────────────────────────────────────────────
  if (modo === 'situacion-form') {
    return (
      <div className="flex min-h-[70dvh] flex-col px-4 pt-4">
        <button type="button" onClick={() => setModo('categoria')} className="w-fit text-sm font-semibold text-[var(--text-secondary)]">
          ← Volver
        </button>

        {pideOtraPersona(categoria) && (
          <div className="mt-4">
            <label className="text-sm font-bold text-[var(--text-secondary)]" htmlFor="nombre-otra">
              ¿Con quién es tu situación? (opcional)
            </label>
            <input
              id="nombre-otra"
              type="text"
              value={nombreOtraInput}
              onChange={(e) => setNombreOtraInput(e.target.value)}
              placeholder="Su nombre"
              className="mt-2 h-12 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] bg-[var(--bg)] px-4 text-base text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            />
          </div>
        )}

        <h1 className="mt-4 text-balance text-2xl font-bold leading-tight [font-family:var(--font-display)]">
          {tituloSituacion(categoria, nombreOtraInput)}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Escribe con tus propias palabras — entre más real, más precisa la lectura.
        </p>
        <textarea
          autoFocus
          value={situacion}
          onChange={(e) => setSituacion(e.target.value)}
          placeholder="Cuéntame qué está pasando…"
          rows={5}
          className="mt-5 w-full resize-none rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] bg-[var(--bg)] p-4 text-base text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
        />

        <p className="mt-5 text-sm font-bold text-[var(--text-secondary)]">Fotos (opcional)</p>
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
          Una foto o una captura que ayude a explicar tu situación, para tener todo junto.
        </p>
        <div className="mt-2.5 flex gap-2.5">
          {fotos.map((foto, i) => (
            <div key={i} className="relative size-20 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto} alt="" className="size-full rounded-[var(--radius-card)] object-cover" />
              <button
                type="button"
                onClick={() => quitarFoto(i)}
                aria-label="Quitar foto"
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-[var(--text-primary)] ring-2 ring-[var(--bg)]"
              >
                <X size={11} color="var(--bg)" aria-hidden="true" />
              </button>
            </div>
          ))}
          {fotos.length < MAX_FOTOS && (
            <button
              type="button"
              onClick={() => inputFotoRef.current?.click()}
              disabled={subiendoFoto}
              className="flex size-20 shrink-0 flex-col items-center justify-center gap-1 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-secondary)_35%,transparent)] text-[var(--text-secondary)] disabled:opacity-50"
            >
              <ImagePlus size={18} aria-hidden="true" />
              <span className="text-xs font-bold">{subiendoFoto ? '...' : 'Agregar'}</span>
            </button>
          )}
        </div>
        <input ref={inputFotoRef} type="file" accept="image/*" multiple onChange={agregarFotos} className="sr-only" />

        <div className="mt-auto pt-8">
          <BotonPrincipal disabled={!situacion.trim()} onClick={sacarLectura}>
            Sacar mis 3 cartas
          </BotonPrincipal>
        </div>
      </div>
    );
  }

  // ── Cargando ───────────────────────────────────────────────────────
  if (modo === 'cargando') {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-2 px-4 text-center">
        <AnimacionCartas />
        <p className="text-base font-semibold text-[var(--text-secondary)]">
          Barajando tus 3 cartas: Tú, {nombreOtra}, {carta3}…
        </p>
      </div>
    );
  }

  // ── Crisis — no se saca lectura, se prioriza el cuidado ─────────────
  if (modo === 'crisis') {
    return (
      <div className="flex min-h-[70dvh] flex-col px-4 pt-4">
        <button type="button" onClick={volverAlMenu} className="w-fit text-sm font-semibold text-[var(--text-secondary)]">
          ← Volver
        </button>
        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-[var(--surface)]">
            <HeartHandshake size={28} color="var(--accent)" aria-hidden="true" />
          </span>
          <p className="text-base leading-relaxed text-[var(--text-primary)]">{mensajeDeCrisis()}</p>
        </div>
      </div>
    );
  }

  // ── Resultado ────────────────────────────────────────────────────────
  if (modo === 'resultado' && cartas) {
    return (
      <div className="px-4 pt-4">
        <button type="button" onClick={volverAlMenu} className="w-fit text-sm font-semibold text-[var(--text-secondary)]">
          ← Volver
        </button>
        <div className="mt-4 flex justify-center gap-4">
          <TarjetaTarot revelada invertida={cartas[0].invertida} nombreCarta={cartas[0].carta.nombre} etiqueta="Tú" tamano="md" />
          <TarjetaTarot
            revelada
            invertida={cartas[1].invertida}
            nombreCarta={cartas[1].carta.nombre}
            etiqueta={nombreOtra}
            tamano="md"
          />
          <TarjetaTarot
            revelada
            invertida={cartas[2].invertida}
            nombreCarta={cartas[2].carta.nombre}
            etiqueta={carta3}
            tamano="md"
          />
        </div>
        {errorLectura ? (
          <div className="mt-5 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">{errorLectura}</p>
            <div className="mt-3">
              <BotonPrincipal onClick={sacarLectura}>Reintentar</BotonPrincipal>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">
              {resumen}
              {!resumenListo && <span className="inline-block w-0.5 animate-pulse bg-[var(--text-primary)]">&nbsp;</span>}
            </p>
          </div>
        )}
        {!errorLectura && resumenListo && (
          <p className="mt-2.5 text-xs leading-relaxed text-[var(--text-tertiary)]">
            Generado por IA — puede no ser exacto. No sustituye consejo profesional.
          </p>
        )}
        {fotos.length > 0 && (
          <div className="mt-5 flex gap-2.5">
            {fotos.map((foto, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={foto} alt="" className="size-20 shrink-0 rounded-[var(--radius-card)] object-cover" />
            ))}
          </div>
        )}
        {!errorLectura && (
          <div className="mt-5">
            <BotonPrincipal onClick={guardarEnHistorial} disabled={!resumenListo || guardada} cargando={guardando}>
              {guardada ? 'Guardada en tu historial ✓' : 'Guardar en mi historial'}
            </BotonPrincipal>
          </div>
        )}
      </div>
    );
  }

  // ── Compatibilidad: formulario ─────────────────────────────────────
  if (modo === 'compat-form') {
    return (
      <div className="px-4 pt-4">
        <button type="button" onClick={() => setModo('menu')} className="w-fit text-sm font-semibold text-[var(--text-secondary)]">
          ← Volver
        </button>
        <h1 className="mt-4 text-2xl font-bold [font-family:var(--font-display)]">Compatibilidad</h1>

        <p className="mt-5 text-sm font-bold text-[var(--text-secondary)]">Tu signo</p>
        <div className="mt-2 grid grid-cols-4 gap-2.5">
          {SIGNOS.map((s) => (
            <SignoChip key={s} signo={s} seleccionado={signoA === s} onClick={() => setSignoA(s)} />
          ))}
        </div>

        <p className="mt-5 text-sm font-bold text-[var(--text-secondary)]">Su signo</p>
        <div className="mt-2 grid grid-cols-4 gap-2.5">
          {SIGNOS.map((s) => (
            <SignoChip key={s} signo={s} seleccionado={signoB === s} onClick={() => setSignoB(s)} />
          ))}
        </div>

        <div className="mt-6 mb-8">
          <BotonPrincipal disabled={!signoA || !signoB} onClick={verCompatibilidad}>
            Activar el hechizo de claridad
          </BotonPrincipal>
        </div>
      </div>
    );
  }

  // ── Compatibilidad: resultado ──────────────────────────────────────
  if (modo === 'compat-resultado' && compat) {
    return (
      <div className="px-4 pt-4">
        <button type="button" onClick={() => setModo('compat-form')} className="w-fit text-sm font-semibold text-[var(--text-secondary)]">
          ← Volver
        </button>
        <div className="mt-5 rounded-[var(--radius-card)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)]">
          <div className="flex items-center justify-center gap-4">
            {imagenSigno(signoA) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagenSigno(signoA)} alt={signoA} className="size-14 rounded-full" />
            )}
            <span className="text-sm font-bold text-[var(--text-secondary)]">+</span>
            {imagenSigno(signoB) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagenSigno(signoB)} alt={signoB} className="size-14 rounded-full" />
            )}
          </div>
          <p className="mt-2 text-center text-sm font-bold text-[var(--text-secondary)]">
            {signoA} + {signoB}
          </p>
          <AnilloCompatibilidad porcentaje={compat.puntaje} />
        </div>
        <div className="mt-5 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
          <p className="text-sm leading-relaxed text-[var(--text-primary)]">
            {signoA} y {signoB} tienen {compat.texto}.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
