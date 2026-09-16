'use client';

// Página de ventas de Amor & Tarot — compuesta desde el KIT CANÓNICO
// (components/landing/) siguiendo el orden inmutable de 19-PAGINA-DE-VENTAS.md.
// Copy 100% derivado de docs/copy/landing.md (trazable a FICHA-AVATAR.md).
// Modelo de monetización: Freemium con prueba de 3 días (onboarding-first) —
// el CTA lleva a /onboarding, nunca directo a un checkout.

import {
  Ban,
  CircleHelp,
  Clock,
  Eye,
  Heart,
  HeartCrack,
  HeartHandshake,
  MessageCircle,
  Moon,
  PenLine,
  Shuffle,
  Sparkles,
  Tag,
  Undo2,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { FondoMistico } from '@/components/app/TemaMistico';
import { RuedaAstral } from '@/components/landing/RuedaAstral';
import { SellosConfianza } from '@/components/landing/ui';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { TiposDeLectura } from '@/components/landing/TiposDeLectura';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';
import { ExitIntentPopup } from '@/components/landing/ExitIntentPopup';

const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Sacar mis 3 cartas';

/* Emblema del logo real: el recorte del logo completo SIN la palabra "Amor y
   Tarot" que este trae dentro — el nombre ya va al lado como texto, y repetirlo
   dentro de la imagen lo volvería un borrón ilegible a 32px.
   `alt=""` a propósito: es decorativo, el nombre accesible lo da el texto
   contiguo del mismo enlace (si no, un lector de pantalla lo diría dos veces). */
const EMBLEMA_HERO = (
  <Image src="/marca/emblema.png" alt="" width={210} height={160} priority className="h-8 w-auto" />
);
const EMBLEMA_PIE = <Image src="/marca/emblema.png" alt="" width={210} height={160} className="h-6 w-auto" />;

export default function LandingPage() {
  return (
    /* Tema oscuro/dorado también acá (FICHA-ARTE.md → "A · Carta Astral"): el
       mismo mecanismo que ya usa la app por dentro, así las 10 secciones cambian
       de piel sin re-estilarse una por una — el kit consume solo tokens. El fondo
       (base oscura + resplandores + estrellas) lo pinta <FondoMistico>, por eso
       este contenedor ya no lleva bg-[var(--bg)]: taparía las estrellas. */
    <div
      data-tema="mistico"
      className="relative isolate min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]"
    >
      {/* `isolate` no es decorativo: crea el contexto de apilamiento propio para
          que el fondo (-z-10) quede DETRÁS del contenido pero DELANTE del color
          base de este contenedor. Sin él se escapa al ancestro y desaparece —
          el mismo bug de z-index que ya apareció en onboarding y paywall. */}
      <FondoMistico posicion="absoluta" />
      {/* 1. HERO */}
      <Hero
        appName="Amor & Tarot"
        logo={EMBLEMA_HERO}
        loginHref="/login"
        h1Marked="[acento]Tu verdad[/acento], en 3 cartas y 60 segundos"
        subtitleMarked="Recibe una lectura que [b]cita tu situación[/b] con El Espejo de las 3 Cartas"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={
          <div className="flex flex-col items-center gap-4">
            <span>Cero anuncios · Cero cobros ocultos · Cancelas cuando quieras</span>
            <SellosConfianza
              items={[
                { icon: Ban, label: 'Sin anuncios' },
                { icon: Tag, label: 'Precio visible' },
                { icon: Undo2, label: 'Cancelas en 1 toque' },
              ]}
            />
          </div>
        }
        dispositivo={<RuedaAstral className="mx-auto size-64 md:size-80" />}
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { icon: Eye, textoMarked: '¿Estás en un [acento]casi algo[/acento] (una situationship) y revisas su última conexión contando los minutos desde que te dejó en visto?' },
          { icon: MessageCircle, textoMarked: '¿No sabes si aplicar contacto cero o escribirle, con miedo a sonar desesperada/o?' },
          { icon: HeartCrack, textoMarked: 'Sientes que te da [acento]migajas de atención[/acento] y no sabes si vale la pena seguir?' },
          { icon: Users, textoMarked: '¿Ya les preguntaste tanto a tus amigas que te da vergüenza volver a sacar el tema?' },
          { icon: CircleHelp, textoMarked: '¿Te da rabia pagar por lecturas con conceptos abstractos que no responden tu duda real?' },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        frases={[
          'Cada semana igual son [b]más horas revisando redes[/b] y más noches sin dormir bien.',
          'Si nada cambia, en un mes sigues en el mismo lugar — solo que con [acento]menos paciencia de tus amigas[/acento].',
          'Horóscopos genéricos, tarot masivo de TikTok y apps caras fallan por lo mismo: [b]ninguno lee tu caso real[/b].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Revisando su última conexión, sin saber qué paso dar.',
          labelFuturo: 'En un mes, si nada cambia',
          futuro: 'La misma pregunta sin responder — con un mes menos.',
        }}
      />

      {/* 4. SOLUCIÓN */}
      <Solucion
        tituloMarked="Una lectura de [acento]tu[/acento] caso, no de cualquiera"
        mecanismo="El Espejo de las 3 Cartas"
        bigIdeaMarked="No te falta decidir bien — te falta la [acento]verdad cruda[/acento] de tu situación real, no un significado genérico de carta."
        pasos={[
          { titulo: 'Cuéntale tu situación', detalle: 'Escribe con tus palabras qué está pasando.', icon: PenLine },
          { titulo: 'Saca tus 3 cartas', detalle: 'Tú, La Otra Persona, La Dinámica.', icon: Shuffle },
          { titulo: 'Recibe tu lectura', detalle: 'Cita tus palabras y te da un paso concreto.', icon: Sparkles },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Un significado de carta que le sirve a cualquiera.',
          labelDespues: 'Después',
          despues: 'Una lectura que cita tu situación real, palabra por palabra.',
        }}
      />

      {/* 5. LA APP POR DENTRO — carrusel de pantallas + lista de tipos de lectura */}
      <AppPorDentro
        tituloMarked="Así se ve [acento]tu claridad[/acento]"
        frames={[
          {
            label: 'Cuéntale tu situación, sin miedo a ser juzgada/o',
            nombrePantalla: 'Tu situación',
            src: '/landing-app-situacion.jpg',
            alt: 'Pantalla para contar tu situación con tus propias palabras',
          },
          {
            label: 'Saca tus 3 cartas',
            nombrePantalla: 'Tus 3 cartas',
            src: '/landing-app-cartas.jpg',
            alt: 'Las 3 cartas reveladas: Tú, la otra persona y la Dinámica',
          },
          {
            label: 'Descubre qué tan compatibles son',
            nombrePantalla: 'Compatibilidad',
            src: '/landing-app-lectura.jpg',
            alt: 'Pantalla de compatibilidad de signos con el porcentaje oculto',
          },
          {
            label: 'Tu carta de hoy, siempre a mano',
            nombrePantalla: 'Inicio',
            src: '/landing-app-inicio.jpg',
            alt: "Pantalla de inicio 'Tu carta de hoy' con el aro medidor",
          },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      <TiposDeLectura
        kicker="TIPOS DE LECTURA"
        tituloMarked="Todo lo que puedes hacer"
        subtituloMarked="Un resumen rápido de toda la app, por si ya sabes lo que buscas."
        items={[
          {
            icon: HeartHandshake,
            tono: 'naranja',
            titulo: 'Tu lectura de pareja',
            descripcion: 'Tú, La Otra Persona y La Dinámica, en 3 cartas.',
          },
          {
            icon: Heart,
            tono: 'rosa',
            titulo: 'Compatibilidad de signos',
            descripcion: 'Qué tan compatibles son tu signo y el suyo.',
          },
          {
            icon: Moon,
            tono: 'azul',
            titulo: 'Carta del día',
            descripcion: 'Tu energía de hoy, cada mañana, en segundos.',
          },
          {
            icon: Clock,
            tono: 'accent',
            titulo: 'Tu historial',
            descripcion: 'Vuelve a leer tus lecturas guardadas cuando quieras.',
          },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* 6. OFERTA */}
      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]menos de un café[/acento]"
        trialDias={3}
        anual={{
          nombre: 'Anual',
          badge: 'MÁS POPULAR',
          precioMes: '$3.66',
          totalAnual: 'Se cobra $43.99/año',
          ahorro: 'Ahorras casi 6 meses al año',
          descomposicionDia: 'menos de $0.13 al día',
          ctaLabel: 'Empezar mis 3 días gratis',
          ctaHref: CTA_HREF,
          features: [
            'El Espejo de las 3 Cartas sin límite',
            'Compatibilidad de signos sin límite',
            'Tu historial de lecturas guardado',
            'Carta del día todos los días',
            'Cero anuncios, siempre',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$6.99',
          ctaLabel: 'Empezar mis 3 días gratis',
          ctaHref: CTA_HREF,
          features: [
            'El Espejo de las 3 Cartas sin límite',
            'Compatibilidad de signos sin límite',
            'Tu historial de lecturas guardado',
            'Cancelas cuando quieras',
          ],
        }}
        garantiaLabel="la Garantía de los 7 Días"
      />

      {/* 7. GARANTÍA — 7 días > 3 de prueba (FICHA-MERCADO.md §4), provisional
          hasta confirmar el plazo real de la pasarela en Sesión 6 */}
      <Garantia
        nombre="la Garantía de los 7 Días"
        condicionMarked="Si en 7 días sientes que no te sirvió, nos escribes y te devolvemos tu dinero. [b]Sin preguntas, sin letra chica.[/b]"
        pisoLegal="Precio siempre visible antes de pagar · cancelas cuando quieras desde tu perfil"
      />

      {/* 8. FAQ */}
      <Faq
        items={[
          {
            pregunta: '¿Me van a cobrar sin avisar?',
            respuestaMarked:
              'No. Ves el precio exacto antes de empezar tu prueba, y [b]cancelas en un toque[/b] desde tu perfil.',
          },
          {
            pregunta: '¿La lectura va a ser igual para todas las personas, o me va a decir qué siente la otra persona?',
            respuestaMarked:
              'Ni una cosa ni la otra. [b]Cita literalmente lo que tú escribiste[/b] sobre tu situación — no un significado genérico de carta — pero no prometemos leer la mente de nadie: te da claridad y un paso concreto para hoy.',
          },
          {
            pregunta: '¿Voy a ver anuncios?',
            respuestaMarked: 'Nunca. [b]Cero anuncios[/b], siempre.',
          },
          {
            pregunta: '¿Es solo para mujeres?',
            respuestaMarked: 'No — es para cualquier persona viviendo una duda o crisis de pareja.',
          },
          {
            pregunta: '¿Es seguro poner los datos de mi tarjeta?',
            respuestaMarked:
              'Sí — el pago se procesa por una pasarela reconocida, nunca guardamos tu tarjeta en nuestros servidores, y tienes [b]la Garantía de los 7 Días[/b] si algo sale mal.',
          },
        ]}
      />

      {/* 9. CTA FINAL EMOCIONAL */}
      <CtaFinal
        h2Marked="[acento]Duerme en paz[/acento] esta noche"
        futurePacingMarked="Esta noche puedes seguir revisando su última conexión, o sacar tus 3 cartas y [acento]por fin descansar con la cabeza tranquila[/acento]."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Prueba gratis de 3 días · Garantía de los 7 Días · cancela cuando quieras"
        psMarked="PS: Amor & Tarot no te dice qué siente la otra persona — te devuelve claridad sobre tu situación real con El Espejo de las 3 Cartas, y un paso concreto para hoy. Empiezas con 3 días gratis."
      />

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="Amor & Tarot"
        logo={EMBLEMA_PIE}
        soporteEmail="hola@amorytarot.app"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos y Condiciones', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Aviso de IA', href: '/aviso' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
      <ExitIntentPopup ctaHref={CTA_HREF} />
    </div>
  );
}
