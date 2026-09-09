import { LegalLayout, LegalSeccion, LegalLista, LegalDestacado } from '@/components/legal/LegalLayout';

export default function AvisoPage() {
  return (
    <LegalLayout titulo="Aviso sobre la Inteligencia Artificial" actualizado="9 de septiembre de 2026">
      <LegalSeccion titulo="Tus lecturas las escribe una IA">
        <LegalDestacado>
          Cada lectura de Amor & Tarot la genera un modelo de inteligencia artificial a partir de lo
          que tú escribes.{' '}
          <strong className="font-bold">Puede generar información incorrecta</strong>, incompleta o
          que no aplique bien a tu situación real. No es magia ni tiene información que tú no le
          diste — interpreta tu texto, nada más.
        </LegalDestacado>
      </LegalSeccion>

      <LegalSeccion titulo="No sustituye ayuda profesional">
        <p>
          Amor & Tarot es entretenimiento y una herramienta de autorreflexión.{' '}
          <strong className="font-bold text-[var(--text-primary)]">
            No sustituye consejo psicológico, legal ni financiero
          </strong>{' '}
          de un profesional. Las lecturas no predicen el futuro ni garantizan ningún resultado en tu
          relación.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="La decisión final siempre es tuya">
        <LegalLista
          items={[
            'Usa la lectura como un punto de partida para pensar tu situación, no como una instrucción a seguir al pie de la letra.',
            'Tú decides bajo tu propia responsabilidad qué hacer con lo que lees.',
            'Si estás pasando por una crisis emocional seria o una situación de riesgo, busca ayuda de un profesional de salud mental o de alguien de confianza — no de esta app.',
          ]}
        />
      </LegalSeccion>

      <LegalSeccion titulo="Contacto">
        <p>
          ¿Dudas sobre cómo funciona la IA en Amor & Tarot? Escríbenos a{' '}
          <a href="mailto:jonathanrd198@gmail.com" className="underline underline-offset-2">
            jonathanrd198@gmail.com
          </a>
          .
        </p>
      </LegalSeccion>
    </LegalLayout>
  );
}
