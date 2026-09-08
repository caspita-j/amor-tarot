'use client';

// KIT DE LANDING — §4 SOLUCIÓN (blueprint: 55 §4)
// Vuelve al fondo BASE (el alivio también es visual). Kicker + título + el
// MECANISMO BAUTIZADO en su chip con <Accent> y hairline (uno de los 1-3 usos
// permitidos por vista) + Big Idea + EXACTAMENTE 3 pasos con number chip 44px
// (tupla en el tipo: ni 2 ni 4) + antes/después opcional. Pasos entran
// escalonados (whileInView + stagger, reduced-motion respetado).

import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { Accent, Hairline, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy, warnCopy } from './MarkedCopy';

export interface PasoMecanismo {
  /** Título del paso — 16px/600. */
  titulo: string;
  /** UNA línea (warn a las 14 palabras). */
  detalle: string;
  /** Ícono Lucide del paso; sin ícono cae al number chip "01/02/03". */
  icon?: LucideIcon;
}

export interface SolucionProps {
  /** Kicker en acento — default "EL MECANISMO". */
  kicker?: string;
  /** Copy MARCADO del título de sección (máx 8 palabras). */
  tituloMarked: string;
  /** Nombre PROPIO del mecanismo bautizado (19) — se pinta en el chip con <Accent>. */
  mecanismo: string;
  /** Big Idea en 1-2 líneas, copy MARCADO. */
  bigIdeaMarked: string;
  /** Los 3 pasos del mecanismo — la tupla obliga a que sean exactamente 3. */
  pasos: [PasoMecanismo, PasoMecanismo, PasoMecanismo];
  /** Antes/después opcional: split 2 columnas, el "después" con acento sutil. */
  antesDespues?: {
    labelAntes: string;
    antes: string;
    labelDespues: string;
    despues: string;
  };
  id?: string;
}

export function Solucion({
  kicker = 'EL MECANISMO',
  tituloMarked,
  mecanismo,
  bigIdeaMarked,
  pasos,
  antesDespues,
  id,
}: SolucionProps) {
  warnCopy('Solución → título', tituloMarked, 8);
  warnCopy('Solución → Big Idea', bigIdeaMarked, 30);
  pasos.forEach((p, i) => warnCopy(`Solución → paso ${i + 1}`, p.detalle, 14));
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="Cómo funciona">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[780px]"
      >
        <motion.div variants={item}>
          <Kicker>{kicker}</Kicker>
          <h2 className="text-balance text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[40px]">
            <MarkedCopy text={tituloMarked} />
          </h2>
        </motion.div>

        {/* El chip del mecanismo bautizado — hairline + <Accent> (55 §4) */}
        <motion.div variants={item} className="mt-4">
          <Hairline surface="bg" className="w-fit">
            <span className="block px-4 py-2 text-[15px] font-semibold">
              <Accent>{mecanismo}</Accent>
            </span>
          </Hairline>
        </motion.div>

        <motion.p variants={item} className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-[var(--text-secondary)] md:text-[18px]">
          <MarkedCopy text={bigIdeaMarked} />
        </motion.p>

        {/* 3 pasos: tarjetas propias (bordered, centradas) — 1 por fila en mobile, 3 columnas en desktop */}
        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {pasos.map((p, i) => {
            const Icono = p.icon;
            return (
              <motion.li
                key={i}
                variants={item}
                className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] px-6 py-8 text-center shadow-[var(--shadow-1)]"
              >
                <span
                  aria-hidden="true"
                  className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--chip-bg)]"
                >
                  {Icono ? (
                    <Icono size={24} strokeWidth={2} color="var(--accent)" aria-hidden="true" />
                  ) : (
                    <span className="text-[17px] font-bold tabular-nums text-[var(--accent)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{p.titulo}</h3>
                  <p className="mt-1 text-[15px] leading-snug text-[var(--text-secondary)]">{p.detalle}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>

        {antesDespues && (
          <motion.div variants={item} className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius-card)] border-l-4 border-[#FFA24C] bg-[color-mix(in_oklab,#FFA24C_14%,var(--bg))] p-5">
              <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#B5701F]">
                {antesDespues.labelAntes}
              </p>
              <p className="mt-2 text-[15px] leading-snug font-medium text-[var(--text-primary)]">{antesDespues.antes}</p>
            </div>
            {/* El "después" con acento vivo — el beneficio se ve, no se susurra */}
            <div className="rounded-[var(--radius-card)] border-l-4 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_12%,var(--bg))] p-5">
              <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--accent)]">
                {antesDespues.labelDespues}
              </p>
              <p className="mt-2 text-[15px] font-medium leading-snug text-[var(--text-primary)]">
                {antesDespues.despues}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </SectionShell>
  );
}
