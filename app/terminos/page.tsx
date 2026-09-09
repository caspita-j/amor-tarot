import { LegalLayout, LegalSeccion, LegalLista, LegalDestacado } from '@/components/legal/LegalLayout';

export default function TerminosPage() {
  return (
    <LegalLayout titulo="Términos y Condiciones" actualizado="9 de septiembre de 2026">
      <LegalSeccion titulo="Quién ofrece este servicio">
        <p>
          Amor & Tarot es operada por Jonathan, como persona natural, desde Colombia. Al usar la
          app, aceptas estos términos.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Qué es Amor & Tarot">
        <p>
          Amor & Tarot es una app de tarot situacional: describes tu duda o situación de pareja con
          tus propias palabras, y recibes una lectura de 3 cartas cuya interpretación se genera con
          inteligencia artificial, citando literalmente parte de lo que escribiste.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Qué NO es Amor & Tarot">
        <LegalDestacado>
          Amor & Tarot es entretenimiento y una herramienta de autorreflexión. Las lecturas{' '}
          <strong className="font-bold">no son consejo psicológico, legal ni financiero</strong>, y no
          garantizan ningún resultado en tu relación. La interpretación la genera un modelo de
          inteligencia artificial y puede ser incorrecta, incompleta o no aplicar a tu caso — la
          decisión final siempre es tuya. Si estás pasando por una crisis emocional seria o una
          situación de riesgo, busca ayuda de un profesional o de alguien de confianza, no de esta
          app.
        </LegalDestacado>
      </LegalSeccion>

      <LegalSeccion titulo="Tu cuenta">
        <LegalLista
          items={[
            'Necesitas una cuenta (con tu correo) para guardar tu historial y tu racha.',
            'Eres responsable de mantener el acceso a tu correo seguro — es la forma en la que entras a tu cuenta.',
            'Puedes eliminar tu cuenta cuando quieras desde Perfil → Eliminar mi cuenta.',
          ]}
        />
      </LegalSeccion>

      <LegalSeccion titulo="Uso aceptable">
        <p>
          Usa Amor & Tarot solo para tu propio uso personal. No está permitido usar la app para
          acosar a otra persona, para automatizar consultas a gran escala, ni para ningún fin
          ilegal. Nos reservamos el derecho de suspender o cerrar cuentas que incumplan esto.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Precio, prueba gratis y suscripción">
        <LegalLista
          items={[
            'La app ofrece 3 días de prueba gratuita, seguidos de una suscripción mensual o anual (el precio exacto se muestra siempre antes de que empieces la prueba).',
            'La suscripción se renueva automáticamente al terminar cada período, salvo que la canceles antes.',
            'Puedes cancelar en cualquier momento; la cancelación aplica desde el siguiente ciclo de cobro, y sigues teniendo acceso hasta que termine el período ya pagado.',
            'Los pagos se procesan a través de Hotmart, nuestra pasarela de pago — nosotros nunca vemos ni guardamos los datos de tu tarjeta.',
          ]}
        />
      </LegalSeccion>

      <LegalSeccion titulo="Propiedad de las lecturas que recibes">
        <p>
          El texto de tu lectura es para tu uso personal. Puedes guardarlo, leerlo y compartirlo
          como quieras. No garantizamos que el texto generado sea único ni que no se parezca al de
          otra persona con una situación similar.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Limitación de responsabilidad">
        <p>
          Amor & Tarot se ofrece "tal cual". No garantizamos que el servicio esté libre de errores
          o interrupciones, ni que la interpretación de la IA sea siempre precisa. En la medida
          permitida por la ley, no somos responsables por decisiones que tomes basándote en una
          lectura, ni por daños indirectos derivados del uso de la app.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Terminación del servicio">
        <p>
          Puedes dejar de usar la app y eliminar tu cuenta cuando quieras. Nosotros podemos
          suspender o cerrar cuentas que incumplan estos términos, avisando por correo cuando sea
          posible.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Ley aplicable">
        <p>
          Estos términos se rigen por las leyes de Colombia. Cualquier disputa se resuelve ante las
          autoridades colombianas competentes.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Cambios a estos términos">
        <p>
          Si hacemos un cambio importante, te avisamos por correo antes de que entre en vigor.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Contacto">
        <p>
          ¿Dudas sobre estos términos? Escríbenos a{' '}
          <a href="mailto:jonathanrd198@gmail.com" className="underline underline-offset-2">
            jonathanrd198@gmail.com
          </a>
          .
        </p>
      </LegalSeccion>
    </LegalLayout>
  );
}
