'use client';

// Pop-up de intención de salida — aparece UNA vez por sesión cuando alguien
// está a punto de irse sin haber empezado. 3 señales de salida:
// 1. Desktop: el mouse sale por el borde superior de la ventana (hacia la
//    barra de direcciones o la X de cerrar).
// 2. Mobile: scroll rápido hacia arriba después de haber bajado buena parte
//    de la página (no hay mouse que "salga" en celular).
// 3. Mobile: botón de atrás del navegador — se intercepta UNA vez (empuja
//    una entrada extra al historial); si la persona presiona atrás de
//    nuevo después de ver el pop-up, se va de verdad, nunca queda atrapada.
// No se activa antes de 15s NI antes de que la persona haya hecho scroll —
// pedirlo a quien recién llegó no tiene sentido. Guardado en sessionStorage:
// una vez por visita, nunca más en la misma sesión del navegador.

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

const CLAVE_VISTO = 'amor-tarot:exit-intent-visto';
const ESPERA_MS = 15000;
const SCROLL_MINIMO_PX = 60;

export function ExitIntentPopup({ ctaHref }: { ctaHref: string }) {
  const [visible, setVisible] = useState(false);
  const [pasaronSegundos, setPasaronSegundos] = useState(false);
  const [huboScroll, setHuboScroll] = useState(false);
  const yaVistoRef = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    try {
      yaVistoRef.current = sessionStorage.getItem(CLAVE_VISTO) === '1';
    } catch {
      // sessionStorage bloqueado: se comporta como si nunca se hubiera visto
      // (peor caso: se muestra una vez más de lo ideal, nunca deja de mostrarse).
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPasaronSegundos(true), ESPERA_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > SCROLL_MINIMO_PX) setHuboScroll(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const elegible = pasaronSegundos && huboScroll;

  const mostrar = () => {
    if (yaVistoRef.current || visible) return;
    yaVistoRef.current = true;
    try {
      sessionStorage.setItem(CLAVE_VISTO, '1');
    } catch {
      // no persiste entre recargas, pero igual se comporta bien en esta visita.
    }
    setVisible(true);
  };

  // Señal 1 — desktop: el mouse sale por arriba de la ventana.
  useEffect(() => {
    if (!elegible || yaVistoRef.current) return;
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) mostrar();
    };
    document.addEventListener('mouseleave', onMouseLeave);
    return () => document.removeEventListener('mouseleave', onMouseLeave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elegible]);

  // Señal 2 — mobile: scroll rápido hacia arriba tras haber bajado bastante.
  useEffect(() => {
    if (!elegible || yaVistoRef.current) return;
    let ultimoY = window.scrollY;
    let ultimoT = Date.now();
    let maxBajada = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const t = Date.now();
      maxBajada = Math.max(maxBajada, y);
      const subioRapido = ultimoY - y > 120 && t - ultimoT < 400;
      const bajoLoSuficienteAntes = maxBajada > window.innerHeight * 0.4;
      if (subioRapido && bajoLoSuficienteAntes) mostrar();
      ultimoY = y;
      ultimoT = t;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elegible]);

  // Señal 3 — mobile: botón de atrás. Se intercepta SOLO una vez — si la
  // persona presiona atrás de nuevo tras ver el pop-up, se va de verdad.
  useEffect(() => {
    if (!elegible || yaVistoRef.current) return;
    window.history.pushState({ exitIntentGuard: true }, '');
    const onPopState = () => {
      if (!yaVistoRef.current) mostrar();
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elegible]);

  const cerrar = () => setVisible(false);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar();
    };
    document.addEventListener('keydown', onKeyDown);
    const scrollPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = scrollPrevio;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_oklab,black_55%,transparent)] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          onClick={cerrar}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-intent-titulo"
        >
          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-[var(--radius-card)] bg-[var(--accent)] p-6 text-center shadow-[var(--shadow-2)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', duration: reduce ? 0 : 0.4, bounce: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar"
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--bg)_20%,transparent)] text-[var(--bg)] transition-colors hover:bg-[color-mix(in_oklab,var(--bg)_30%,transparent)]"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <h2
              id="exit-intent-titulo"
              className="mt-2 text-balance text-xl font-bold leading-tight text-[var(--bg)] [font-family:var(--font-display)]"
            >
              En una semana vas a seguir despierta/o a la 1am, dándole vueltas a lo mismo.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color-mix(in_oklab,var(--bg)_88%,transparent)]">
              O puedes sacar tus 3 cartas ahora mismo, gratis, y por fin tener una respuesta clara.
            </p>

            <motion.a
              href={ctaHref}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className="mt-5 inline-flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--bg)] px-6 text-base font-bold text-[var(--accent)] [touch-action:manipulation]"
            >
              Sacar mis 3 cartas gratis
            </motion.a>

            <button
              type="button"
              onClick={cerrar}
              className="mt-3 text-xs font-semibold text-[color-mix(in_oklab,var(--bg)_75%,transparent)] underline underline-offset-2"
            >
              No, prefiero seguir dudando
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
