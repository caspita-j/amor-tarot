import { LegalLayout, LegalSeccion, LegalLista, LegalDestacado } from '@/components/legal/LegalLayout';

export default function PrivacidadPage() {
  return (
    <LegalLayout titulo="Política de Privacidad" actualizado="9 de septiembre de 2026">
      <LegalSeccion titulo="¿Quién es el responsable de tus datos?">
        <p>
          Amor & Tarot es operada por Jonathan, como persona natural, desde Colombia. Puedes
          escribirle directamente a{' '}
          <a href="mailto:jonathanrd198@gmail.com" className="underline underline-offset-2">
            jonathanrd198@gmail.com
          </a>{' '}
          para cualquier duda sobre tus datos.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Qué datos recopilamos">
        <p>Solo pedimos lo que necesitamos para que la app funcione:</p>
        <LegalLista
          items={[
            'Tu correo electrónico (para que puedas iniciar sesión, sin contraseñas).',
            'Tu nombre y tu signo (para personalizar tu lectura).',
            'El nombre y el signo de la otra persona sobre la que preguntas, si los compartes.',
            'El texto que escribes describiendo tu situación (esto es lo que la lectura interpreta).',
            'Fotos que decidas adjuntar a una lectura (opcional — nunca se piden, tú eliges subirlas).',
            'Tu racha de uso (cuántos días seguidos usas la app) y tu historial de lecturas guardadas.',
          ]}
        />
        <p>
          No te pedimos datos financieros, número de identificación, ni fecha de nacimiento. Si en
          algún momento agregamos cobros, esos datos los procesa directamente nuestra pasarela de
          pago (Hotmart) — nunca los vemos ni los guardamos nosotros.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Para qué usamos tus datos">
        <LegalLista
          items={[
            'Generar tu lectura personalizada — el texto que escribes se envía a nuestro proveedor de IA para producir la interpretación.',
            'Mantener tu sesión iniciada y tu historial guardado.',
            'Mostrarte tu racha y tu progreso dentro de la app.',
            'Comunicarnos contigo si hay un cambio importante en esta política o en el servicio.',
          ]}
        />
      </LegalSeccion>

      <LegalSeccion titulo="Con quién compartimos tus datos">
        <p>
          Nunca vendemos tus datos. Los compartimos únicamente con los proveedores que hacen
          posible que la app funcione, cada uno con una función específica:
        </p>
        <LegalLista
          items={[
            <span key="supabase">
              <strong className="font-bold text-[var(--text-primary)]">Supabase</strong> — guarda tu
              cuenta, tu perfil y tus lecturas, y por ahora también envía los correos de acceso.
            </span>,
            <span key="anthropic">
              <strong className="font-bold text-[var(--text-primary)]">Anthropic (el proveedor de la
              IA)</strong> — recibe el texto de tu situación para generar la interpretación de tu
              lectura. Este proveedor está en Estados Unidos, así que tu texto viaja fuera de
              Colombia para ser procesado (ver más abajo).
            </span>,
            <span key="vercel">
              <strong className="font-bold text-[var(--text-primary)]">Vercel</strong> — aloja la
              aplicación (el servidor donde vive Amor & Tarot).
            </span>,
            <span key="hotmart">
              <strong className="font-bold text-[var(--text-primary)]">Hotmart</strong> — procesará
              los pagos cuando la suscripción esté activa. Hoy todavía no está conectado, así que no
              se procesa ningún cobro real.
            </span>,
          ]}
        />
        <p>No usamos herramientas de analítica ni cookies de publicidad de terceros.</p>
      </LegalSeccion>

      <LegalSeccion titulo="Transferencia internacional de datos (importante)">
        <LegalDestacado>
          El texto que escribes sobre tu situación se envía a Anthropic, nuestro proveedor de IA, que
          procesa la información en servidores fuera de Colombia (Estados Unidos). Al usar Amor &
          Tarot, autorizas este envío — es necesario para que la lectura funcione. No incluyas en tu
          texto contraseñas, números de tarjeta, ni información médica o financiera sensible: solo
          cuenta tu situación.
        </LegalDestacado>
      </LegalSeccion>

      <LegalSeccion titulo="Tus derechos sobre tus datos">
        <p>
          Como titular de tus datos, según la Ley 1581 de 2012 de Colombia, tienes derecho a
          conocerlos, actualizarlos, rectificarlos y pedir que los eliminemos.
        </p>
        <LegalLista
          items={[
            'Puedes borrar tu cuenta y todos tus datos en cualquier momento desde Perfil → Eliminar mi cuenta, dentro de la app. Esto borra tu perfil, tus lecturas y tu historial de uso de la IA — no queda nada guardado.',
            <span key="contacto">
              También puedes escribirnos a{' '}
              <a href="mailto:jonathanrd198@gmail.com" className="underline underline-offset-2">
                jonathanrd198@gmail.com
              </a>{' '}
              para pedir acceso, corrección o eliminación de tus datos.
            </span>,
          ]}
        />
      </LegalSeccion>

      <LegalSeccion titulo="Cuánto tiempo guardamos tus datos">
        <p>
          Mientras tu cuenta esté activa. Si eliminas tu cuenta, borramos tu perfil, tus lecturas y
          tu historial de uso de la IA de inmediato — no se conserva ninguna copia.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Edad mínima">
        <p>
          Amor & Tarot es para personas mayores de 18 años. Si tienes menos de 18, por favor no uses
          la app.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Cambios a esta política">
        <p>
          Si hacemos un cambio importante a esta política, te avisamos por correo antes de que entre
          en vigor. La fecha de "última actualización" en la parte de arriba siempre refleja la
          versión vigente.
        </p>
      </LegalSeccion>

      <LegalSeccion titulo="Contacto">
        <p>
          ¿Dudas sobre tus datos o esta política? Escríbenos a{' '}
          <a href="mailto:jonathanrd198@gmail.com" className="underline underline-offset-2">
            jonathanrd198@gmail.com
          </a>
          .
        </p>
      </LegalSeccion>
    </LegalLayout>
  );
}
