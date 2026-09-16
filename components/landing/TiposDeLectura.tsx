'use client';

// KIT DE LANDING — §5 LA APP POR DENTRO, variante "lista de lecturas"
// Reemplaza el carrusel de frames de teléfono por una lista escaneable de los
// TIPOS de lectura que ofrece la app — a pedido del usuario, inspirada en un
// patrón de otra app (miniatura + título + descripción + flecha), adaptado a
// nuestra paleta e íconos (no hay assets de arte de cartas todavía). Cada fila
// es honesta: no promete una pantalla que no existe, describe una FUNCIÓN real
// del MVP (ver ESTADO.md → Decisiones técnicas → Features del MVP).
// Va justo DESPUÉS del carrusel <AppPorDentro> y comparte 2-3 conceptos con él
// (compatibilidad, carta del día) — el revisor marcó eso como redundante si
// las dos secciones se leen como "la misma demo dos veces". El `subtituloMarked`
// existe para eso: convierte esta lista en un ÍNDICE rápido para quien ya vio
// el carrusel y quiere saltar directo a lo que le interesa, no en una segunda
// demostración — misión distinta a la del carrusel (probar, no repasar).

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
  /** 1 línea que aclara el propósito de ÍNDICE (evita que se lea como una
   *  segunda demo del carrusel de arriba). Sin ella, no se pinta ningún subtítulo. */
  subtituloMarked?: string;
  items: TipoDeLectura[];
  ctaLabel: string;
  ctaHref: string;
  id?: string;
}

// Bug real que encontró el revisor: usaba hex fijos del tema claro
// (#FFA24C/#ABDBF7/#F6A8DC) en un tinte 18-35% — invisible sobre el fondo
// oscuro de la lista una vez la landing pasó al tema místico, porque esos
// tokens en oscuro (--accent-2/3/4) son colores YA oscuros: un tinte
// transparente de un color oscuro sobre un fondo casi negro se funde con él.
// En el tema claro, en cambio, un tinte SUAVE es lo correcto (son colores
// vivos que necesitan diluirse para no gritar). No hay una sola opacidad que
// sirva para los dos temas — por eso, igual que .boton-principal en
// tokens.css, el tema místico define su PROPIO fondo (sólido) para estas
// clases; acá solo se pone el nombre de clase + el valor por defecto (claro).
// El ícono, siempre dorado/lila (var(--accent)), mide buen contraste en
// ambos: 5.9-6.6:1 sobre los 3 sólidos del tema oscuro (verificado).
// ⚠️ tono="accent" (Historial) tenía el mismo problema pero al revés: --chip-bg
// es un TINTE de --accent (dorado), y un dorado diluido sobre fondo oscuro se
// ve como un marrón cálido — casi el mismo tono que el sólido de "naranja"
// (--accent-2, ámbar), así que las dos categorías se confundían entre sí (2º
// hallazgo menor del revisor). En vez de un 4º tono cálido, se usa
// --surface-2 (violeta neutro oscuro) en el tema místico: contraste del
// ícono dorado 8.04:1 (medido) y una nota fría/neutra que no compite con las
// 3 cálidas/frías ya usadas — coherente con que "Historial" es la categoría
// menos "emocional" de las 4.
const TONOS: Record<TipoDeLectura['tono'], string> = {
  accent: 'tono-chip-accent bg-[var(--chip-bg)]',
  naranja: 'tono-chip-naranja bg-[color-mix(in_oklab,var(--accent-2)_18%,transparent)]',
  azul: 'tono-chip-azul bg-[color-mix(in_oklab,var(--accent-3)_35%,transparent)]',
  rosa: 'tono-chip-rosa bg-[color-mix(in_oklab,var(--accent-4)_28%,transparent)]',
};

export function TiposDeLectura({
  kicker = 'ASÍ SE VE POR DENTRO',
  tituloMarked,
  subtituloMarked,
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
          {subtituloMarked && (
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">{subtituloMarked}</p>
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
                    {/* line-clamp-2, no truncate (1 línea): con descripciones de hasta
                        16 palabras, 1 línea cortaba a media palabra sin comunicar nada
                        ("Tú, La Otra Persona y La..." — el revisor lo marcó como
                        defecto menor). 2 líneas alcanzan para leer la idea completa
                        en casi todos los casos, y donde no, el corte cae al final de
                        una palabra real, no a la mitad. */}
                    <p className="mt-0.5 line-clamp-2 text-[14px] leading-snug text-[var(--text-secondary)]">
                      {it.descripcion}
                    </p>
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
