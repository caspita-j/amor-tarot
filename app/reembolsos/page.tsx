import { LegalLayout, LegalSeccion, LegalLista, LegalDestacado } from '@/components/legal/LegalLayout';

export default function ReembolsosPage() {
  return (
    <LegalLayout titulo="Política de Reembolso" actualizado="9 de septiembre de 2026">
      <LegalSeccion titulo="La Garantía de los 7 Días">
        <LegalDestacado>
          Si dentro de los primeros <strong className="font-bold">7 días</strong> desde tu primer
          pago sientes que Amor & Tarot no te sirvió, te devolvemos tu dinero. Sin preguntas, sin
          letra chica.
        </LegalDestacado>
      </LegalSeccion>

      <LegalSeccion titulo="Cómo funciona">
        <LegalLista
          items={[
            'Empiezas con 3 días de prueba gratuita — no se te cobra nada durante ese período.',
            'Si sigues después de la prueba, se hace tu primer cobro (mensual o anual, según el plan que elegiste).',
            'Desde ese primer cobro tienes 7 días corridos para pedir tu reembolso completo, sin importar la razón.',
          ]}
        />
      </LegalSeccion>

      <LegalSeccion titulo="Cómo pedir tu reembolso">
        <p>
          Escríbenos a{' '}
          <a href="mailto:jonathanrd198@gmail.com" className="underline underline-offset-2">
            jonathanrd198@gmail.com
          </a>{' '}
          diciendo que quieres tu reembolso. Te lo confirmamos y procesamos el dinero de vuelta al
          mismo método de pago con el que compraste.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Fuera de la ventana de 7 días">
        <p>
          Pasados los 7 días desde tu primer cobro, no se realizan reembolsos por ese período ya
          consumido — pero puedes cancelar cuando quieras desde tu perfil para que no se te cobre
          el siguiente ciclo.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Cómo cancelar tu suscripción">
        <p>
          Cancelar es distinto de pedir un reembolso: cancelar detiene los cobros futuros, y sigues
          usando la app hasta que termine el período que ya pagaste. Puedes cancelar en cualquier
          momento desde tu perfil dentro de la app, o directamente desde el panel de Hotmart (la
          pasarela de pago) con el correo que usaste para comprar.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Contacto">
        <p>
          ¿Dudas sobre tu pago o tu reembolso? Escríbenos a{' '}
          <a href="mailto:jonathanrd198@gmail.com" className="underline underline-offset-2">
            jonathanrd198@gmail.com
          </a>
          .
        </p>
      </LegalSeccion>
    </LegalLayout>
  );
}
