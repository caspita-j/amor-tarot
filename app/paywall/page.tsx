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
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Check, Shield } from 'lucide-react';
import { FondoMistico } from '@/components/app/TemaMistico';
import { BotonPrincipal, TarjetaTarot } from '@/components/onboarding/ui';
import { Hairline } from '@/components/landing/ui';
import { registrarEvento } from '@/lib/eventos';

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
    // Lo que se cobra DE VERDAD al terminar la prueba (nunca precioMes: ese es
    // el equivalente mensual, solo para comparar planes en la tarjeta de precio
    // — mostrarlo como "monto que se cobra" en la línea de tiempo o el pie fue
    // el bug real que encontró el revisor: alguien en el plan Anual leía "se te
    // cobra $3.66" cuando el cargo real es $43.99, justo en la sección que
    // promete "sin sorpresas").
    cobroReal: '$43.99',
    cobroRealUnidad: '/año',
    ahorro: 'Ahorras $39.89 al año (casi 6 meses gratis)',
    // Link de venta REAL del producto en Hotmart (sin comisión de afiliado).
    checkoutUrl: 'https://pay.hotmart.com/G107642375M?off=tcud2c1t',
  },
  mensual: {
    id: 'mensual' as const,
    nombre: 'Mensual',
    badge: null,
    precioMes: '$6.99',
    cobroReal: '$6.99',
    cobroRealUnidad: '/mes',
    ahorro: null,
    checkoutUrl: 'https://pay.hotmart.com/G107642375M?off=qcmaw6ih',
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

  // Embudo de conversión (admin → Negocio → Conversión) — una sola vez por visita.
  useEffect(() => {
    registrarEvento('paywall_visto');
  }, []);

  const nombre = r.nombre?.trim() || 'de nuevo';
  const seleccionado = PLANES[plan];
  const nombreOtra = r.otraPersonaNombre?.trim() || 'La Otra Persona';

  const continuar = () => {
    if (cargando) return;
    setCargando(true);
    registrarEvento(plan === 'anual' ? 'checkout_click_anual' : 'checkout_click_mensual');
    // Checkout REAL de Hotmart (dominio externo) — nunca router.push, que es
    // solo para rutas internas. El webhook de Hotmart es quien crea la cuenta
    // y manda el correo de acceso una vez que la persona paga de verdad; nadie
    // entra a /app sin pasar por ahí (ver lib/supabase/proxy.ts).
    window.location.href = seleccionado.checkoutUrl;
  };

  return (
    // Tema oscuro/dorado, igual que el onboarding del que viene y la app a la que
    // lleva (FICHA-ARTE.md) — el recorrido no cambia de piel a mitad de camino.
    <main
      data-tema="mistico"
      className="flex h-dvh flex-col overflow-hidden bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]"
    >
      <div className="relative isolate min-h-0 flex-1">
      {/* Mismo fondo que el resto del producto (resplandores + estrellas). */}
      <FondoMistico posicion="absoluta" />
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
            {/* Emblema del logo real (sin el texto que el logo trae dentro: el
                nombre ya va al lado). Decorativo — de ahí el alt vacío. */}
            <Image src="/marca/emblema.png" alt="" width={210} height={160} className="h-7 w-auto shrink-0" />
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

          {/* 6. CUÁL PLAN ME CONVIENE — cards seleccionables. Se sumaron el
              check-in de ánimo y el Historial con patrones: son features
              reales de la app que no existían cuando se escribió este texto
              (quedó pendiente a propósito hasta tocar esta pantalla junto
              con Hotmart — ver ESTADO.md). El gate de /app ya los cubre a
              los dos, así que la promesa ahora es exacta. */}
          <motion.p variants={VARIANTS} className="mt-8 text-xs font-semibold text-[var(--text-secondary)]">
            Cada mes: El Espejo de las 3 Cartas sin límite, Compatibilidad de signos, tu Carta del día, tu
            check-in de ánimo y tu Historial con patrones.
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
                    // Centrado (como ya hace <Oferta> en la landing), no pegado a la
                    // derecha: ahí quedaba apilado sobre el círculo de selección,
                    // que también vive en la esquina derecha — esquina recargada.
                    <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--bg)]">
                      {p.badge}
                    </span>
                  )}
                  {/* pr-6 en vez de solo gap: el círculo de selección es absolute
                      (right-4 top-4, ~20px), y el precio grande nuevo llega hasta el
                      borde — sin este aire se solapan (bug real, visto en captura). */}
                  <div className="flex items-center justify-between gap-3 pr-6">
                    <div>
                      <p className="text-sm font-semibold">{p.nombre}</p>
                      {p.ahorro && <p className="mt-0.5 text-xs font-semibold text-[var(--accent)]">{p.ahorro}</p>}
                    </div>
                    {/* El número GRANDE es lo que de verdad se cobra (cobroReal), no el
                        equivalente mensual — el revisor lo marcó como el defecto #1:
                        justo la tarjeta que decide la compra no puede tener el cobro
                        real en letra chica cuando el avatar teme "cobros ocultos". El
                        equivalente mensual sigue visible, pero como nota secundaria. */}
                    <div className="text-right">
                      <p
                        className={`font-bold tabular-nums leading-none [font-family:var(--font-display)] ${activo ? 'text-2xl text-[var(--accent)]' : 'text-xl'}`}
                      >
                        {p.cobroReal}
                        <span className="text-sm font-semibold text-[var(--text-secondary)]">{p.cobroRealUnidad}</span>
                      </p>
                      {/* Solo tiene sentido en el Anual: en el Mensual cobroReal y
                          precioMes son el MISMO número ($6.99) — mostrar "equivale a
                          $6.99/mes" bajo un "$6.99/mes" ya visible repite el número
                          en la zona que más desconfianza genera (bug real, encontrado
                          por el revisor). */}
                      {p.precioMes !== p.cobroReal && (
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">equivale a {p.precioMes}/mes</p>
                      )}
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`absolute right-4 top-4 flex size-5 items-center justify-center rounded-full border-2 ${
                      activo
                        ? 'border-[var(--accent)] bg-[var(--accent)]'
                        // Subido de 40% a 60% de --text-secondary: a 40% el revisor lo vio
                        // "un aro fino y de bajo contraste, cuesta identificarlo como control".
                        : 'border-[color-mix(in_oklab,var(--text-secondary)_60%,transparent)]'
                    }`}
                  >
                    {activo && <Check size={12} strokeWidth={3} color="var(--bg)" />}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* 5. PUEDO CANCELAR — línea de tiempo de cobro (anti-cobro-sorpresa,
              responde directo la objeción #1 de FICHA-AVATAR.md). Con Hairline
              (borde degradé) en vez del fondo plano de antes: es la tarjeta que
              existe específicamente para prevenir la desconfianza del avatar,
              se gana el mismo tratamiento premium que ya usa la landing en su
              tarjeta de garantía/plan recomendado — no toda tarjeta lo lleva
              (regla del kit: 1-3 usos por página), pero esta lo amerita. */}
          <motion.div variants={VARIANTS} className="mt-6">
            <Hairline surface="surface-2" className="shadow-[inset_0_1px_2px_rgb(0_0_0_/_0.04)]">
              <div className="px-4 py-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
                  Así funciona tu prueba — sin sorpresas
                </p>
                <div className="mt-4 flex items-start justify-between">
                  {[
                    { dia: 'Hoy', detalle: '$0.00 — tu lectura completa' },
                    { dia: 'Día 2', detalle: 'Te avisamos antes de cobrar' },
                    { dia: 'Día 3', detalle: `${seleccionado.cobroReal} si no cancelaste` },
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
                {/* Antes era UNA oración corrida que mezclaba el cobro (día 3) con la
                    garantía (día 7) — alguien que lee rápido podía leer "tengo 7 días
                    gratis". Separadas en 2 líneas, cada una con su propio plazo.
                    text-sm (14px), no text-xs: es el copy que más necesita leerse bien
                    en toda la pantalla — el mínimo de cuerpo de la regla 5 de UX es 14px,
                    el revisor lo marcó en 12px. */}
                <p className="mt-4 text-sm leading-snug text-[var(--text-secondary)]">
                  Se te cobrará recién el{' '}
                  <strong className="font-semibold text-[var(--text-primary)]">{fechaDeCobro(3)}</strong> — cancela
                  cuando quieras desde tu perfil.
                </p>
                <p className="mt-1.5 text-sm leading-snug text-[var(--text-secondary)]">
                  ¿No te convenció igual? La Garantía de los 7 Días te devuelve tu dinero, ya cobrado.
                </p>
                {/* Efecty (pago en efectivo, dentro del checkout) no admite cobro
                    automático — Hotmart no puede ofrecer ahí el período gratis y
                    cobra de una vez. Aclarado ACÁ (antes de que la persona elija
                    el medio de pago en Hotmart) para que "3 días gratis" nunca se
                    sienta como una sorpresa rota — hallazgo real probando el
                    checkout, 2026-09-16. */}
                <p className="mt-1.5 text-xs leading-snug text-[var(--text-tertiary)]">
                  Si pagas en efectivo (Efecty), no aplica el período de prueba: se cobra el precio completo de una vez.
                </p>
              </div>
            </Hairline>
          </motion.div>

          {/* Insignia de confianza — honesta: sin nombrar una pasarela que aún no se elige
              (Sesión 6). Antes traía también "Cancela en 1 clic", pero esa misma frase ya
              aparece en la tarjeta de arriba Y en el pie fijo de abajo — el revisor marcó
              la repetición de "cancela cuando quieras" en 3 lugares como parte del problema
              de densidad de la pantalla; acá se recorta, no en los otros 2 (que sí cumplen
              un rol distinto: uno explica el plazo, el otro está junto al botón de pago). */}
          <motion.div variants={VARIANTS} className="mt-4 flex items-center justify-center">
            <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
              <Shield size={14} className="text-[var(--accent)]" /> Pago protegido
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
            Garantía de 7 días · después, {seleccionado.cobroReal}
            {seleccionado.cobroRealUnidad} — cancela cuando quieras.
          </p>
          {/* 7. SALIDA LIMPIA — sin culpa. Antes llevaba a /app prometiendo "lo
              básico" gratis, pero ese plan gratuito nunca se construyó (hoy
              /app es 100% de pago, ver lib/supabase/proxy.ts) — mandar para
              allá era una promesa falsa que además rebotaba en un loop
              contra este mismo paywall. Vuelve a la landing hasta que exista
              un plan gratis real que valga la pena ofrecer acá. */}
          <Link
            href="/"
            className="mt-3 block text-center text-sm font-medium text-[var(--text-secondary)] underline underline-offset-2"
          >
            Ahora no, gracias
          </Link>
        </div>
      </div>
    </main>
  );
}
