'use client';

// KIT DE LANDING — §5 LA APP POR DENTRO, variante "lista de lecturas"
// Reemplaza el carrusel de frames de teléfono por una lista escaneable de los
// TIPOS de lectura que ofrece la app — a pedido del usuario, inspirada en un
// patrón de otra app (miniatura + título + descripción + flecha), adaptado a
// nuestra paleta e íconos (no hay assets de arte de cartas todavía). Cada fila
// es honesta: no promete una pantalla que no existe, describe una FUNCIÓN real
// del MVP (ver ESTADO.md → Decisiones técnicas → Features del MVP).

import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CtaButton, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { warnCopy, warnRango } from './MarkedCopy';

export interface TipoDeLectura {
  icon: LucideIcon;
  /** Fondo de la miniatura: una nota de color del brand kit por tipo. */
  tono: 'accent' | 'naranja' | 'azul' | 'rosa';
  titulo: string;
  descripcion: string;
}

export interface TiposDeLecturaProps {
  kicker?: string;
  tituloMarked?: string;
  items: TipoDeLectura[];
  ctaLabel: string;
  ctaHref: string;
  id?: string;
}

const TONOS: Record<TipoDeLectura['tono'], string> = {
  accent: 'bg-[var(--chip-bg)]',
  naranja: 'bg-[color-mix(in_oklab,#FFA24C_18%,transparent)]',
  azul: 'bg-[color-mix(in_oklab,#ABDBF7_35%,transparent)]',
  rosa: 'bg-[color-mix(in_oklab,#F6A8DC_28%,transparent)]',
};

export function TiposDeLectura({
  kicker = 'ASÍ SE VE POR DENTRO',
  tituloMarked,
  items,
  ctaLabel,
  ctaHref,
  id,
}: TiposDeLecturaProps) {
  warnRango('TiposDeLectura → ítems', items.length, 3, 5);
  items.forEach((it, i) => warnCopy(`TiposDeLectura → descripción ${i + 1}`, it.descripcion, 16));
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="base" compacta ariaLabel="Tipos de lectura">
      <motion.div variants={contenedor} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
        <motion.div variants={item} className="mx-auto max-w-[620px] text-center">
          <Kicker>{kicker}</Kicker>
          {tituloMarked && (
            <h2 className="text-balance text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[40px]">
              {tituloMarked}
            </h2>
          )}
        </motion.div>

        <motion.ul
          variants={item}
          className="mx-auto mt-10 flex max-w-[620px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--bg)] shadow-[var(--shadow-2)]"
        >
          {items.map((it, i) => {
            const Icono = it.icon;
            return (
              <li
                key={i}
                className={i > 0 ? 'border-t border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)]' : ''}
              >
                <a href={ctaHref} className="flex items-center gap-4 px-5 py-5 outline-none focus-visible:bg-[var(--surface)]">
                  <span
                    aria-hidden="true"
                    className={`flex size-14 shrink-0 items-center justify-center rounded-[var(--radius-card)] ${TONOS[it.tono]}`}
                  >
                    <Icono size={24} strokeWidth={1.8} color="var(--accent)" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{it.titulo}</h3>
                    <p className="mt-0.5 truncate text-[14px] text-[var(--text-secondary)]">{it.descripcion}</p>
                  </div>
                  <ChevronRight size={20} className="shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </motion.ul>

        <motion.div variants={item} className="mt-8 flex justify-center">
          <CtaButton href={ctaHref} fullMobile={false}>
            {ctaLabel}
          </CtaButton>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
