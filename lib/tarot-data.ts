// Mazo de Arcanos Mayores (22 cartas) para la app interna. Los significados
// derecho/invertido están basados en el sistema tradicional del tarot
// Rider-Waite-Smith (1910, dominio público) — verificados contra una fuente
// editorial (no un mazo comercial específico) y reescritos en la voz de "El
// Espejo de las 3 Cartas" (el mecanismo de marca). Los Arcanos Menores (56
// cartas, 4 palos) quedan para una siguiente tanda. El backend real de
// generación vive en el servidor a partir de la Sesión 6 — hasta entonces,
// este mazo fijo + plantillas de voz alimentan la carta del día (M0) y el
// flujo de "Lecturas". Nunca se menciona "IA" — el copy siempre habla en la
// voz de El Espejo, nunca en la de un sistema técnico.

export type Carta = {
  nombre: string;
  numero: number; // 0-21, orden tradicional de los arcanos mayores (El Loco = 0)
  esencia: string; // 1 palabra que ancla el estado emocional cuando sale derecha
  frase: string; // frase derecha, en la voz de El Espejo
  esenciaInvertida: string;
  fraseInvertida: string;
  temas: string[]; // etiquetas de situación con las que esta carta conecta mejor
};

export const MAZO_MAYOR: Carta[] = [
  {
    nombre: 'El Loco',
    numero: 0,
    esencia: 'libertad',
    frase:
      'Hoy no necesitas tener todo resuelto para dar el paso. Empezar de nuevo no es un error — es el primer tramo de un camino que todavía no conoces, y eso también puede ser hermoso.',
    esenciaInvertida: 'impulsividad',
    fraseInvertida:
      'Antes de saltar, respira. Lo que sientes como urgencia puede ser miedo disfrazado de decisión — no todo lo que se siente libre es realmente tuyo. Date un momento más antes de moverte.',
    temas: ['esperanza'],
  },
  {
    nombre: 'El Mago',
    numero: 1,
    esencia: 'creación',
    frase:
      'Tienes más poder sobre esta situación del que crees. Ya tienes las herramientas — la claridad, las palabras, la voluntad — para mover esto en la dirección que quieres. Solo falta usarlas.',
    esenciaInvertida: 'manipulación',
    fraseInvertida:
      'Cuidado con usar tu inteligencia para evitar en vez de resolver. Las medias verdades — las tuyas o las de la otra persona — están complicando más de lo que aclaran.',
    temas: ['esperanza', 'duda'],
  },
  {
    nombre: 'La Sacerdotisa',
    numero: 2,
    esencia: 'misterio',
    frase:
      'Hay algo que sabes pero todavía no puedes explicar con palabras — y está bien dejarlo así por ahora. Confía en lo que sientes por dentro antes de necesitar que todo tenga lógica.',
    esenciaInvertida: 'bloqueo',
    fraseInvertida:
      'Te estás escondiendo de algo que ya sabes. Hay secretos que pesan más por callarlos — lo que no te dices a ti misma/o termina saliendo de otra forma.',
    temas: ['distancia', 'duda'],
  },
  {
    nombre: 'La Emperatriz',
    numero: 3,
    esencia: 'abundancia',
    frase:
      'Mereces una relación que te haga sentir plena/o, no que te reste. Cuidarte a ti como cuidarías a alguien que amas cambia cómo se acomoda todo lo demás.',
    esenciaInvertida: 'vacío',
    fraseInvertida:
      'Cuando das todo y no queda nada para ti, algo está desbalanceado. Hace cuánto no te dedicas el mismo cuidado que le das a los demás.',
    temas: ['esperanza'],
  },
  {
    nombre: 'El Emperador',
    numero: 4,
    esencia: 'estructura',
    frase:
      'Necesitas claridad, no promesas. Esta situación pide límites firmes y una conversación real — no otra vez la misma duda dando vueltas sin que nadie diga lo que de verdad piensa.',
    esenciaInvertida: 'control',
    fraseInvertida:
      'Cuidado con confundir control con seguridad. Intentar manejarlo todo puede ser una forma de no sentir lo que en realidad te da miedo sentir.',
    temas: ['duda'],
  },
  {
    nombre: 'El Hierofante',
    numero: 5,
    esencia: 'tradición',
    frase:
      'A veces la respuesta no está en romper todo, sino en volver a lo que sí ha funcionado. Vale la pena mirar qué acuerdos claros les harían bien a los dos, en vez de improvisar cada vez.',
    esenciaInvertida: 'rigidez',
    fraseInvertida:
      'No todas las reglas viejas te sirven hoy. Seguir un molde solo porque "así se supone que es" puede estarte alejando de lo que realmente necesitas.',
    temas: ['duda'],
  },
  {
    nombre: 'Los Enamorados',
    numero: 6,
    esencia: 'elección',
    frase:
      'Hoy hay una decisión pendiente, y no es la que otros esperan que tomes — es la que tú realmente quieres tomar cuando nadie más está mirando. Escúchate a ti antes que a cualquier consejo, incluido este.',
    esenciaInvertida: 'desconexión',
    fraseInvertida:
      'Hay una elección que se está evitando. Hay una desalineación entre lo que dicen y lo que hacen — la tuya, la suya, o las dos — y fingir que no está ahí no la resuelve.',
    temas: ['duda', 'esperanza'],
  },
  {
    nombre: 'El Carro',
    numero: 7,
    esencia: 'avance',
    frase:
      'Tienes más control del que sientes en este momento. Deja de reaccionar a cada señal y decide tú hacia dónde quieres ir — con calma, pero sin quedarte parada/o.',
    esenciaInvertida: 'estancamiento',
    fraseInvertida:
      'Sientes que vas para todos lados menos hacia adelante. Dos fuerzas contrarias — lo que quieres y lo que temes — están tirando cada una para su lado.',
    temas: ['duda', 'ruptura'],
  },
  {
    nombre: 'La Fuerza',
    numero: 8,
    esencia: 'entereza',
    frase:
      'No necesitas gritar ni demostrar nada para sostenerte. Lo que sientes hoy no es debilidad, es fuerza tranquila — la que no necesita que nadie más la valide para ser real.',
    esenciaInvertida: 'agotamiento',
    fraseInvertida:
      'No tienes que ser fuerte todo el tiempo. Llevas cargando esto sola/o por más tiempo del que deberías — pedir ayuda no te hace menos entera/o.',
    temas: ['celos', 'ruptura'],
  },
  {
    nombre: 'El Ermitaño',
    numero: 9,
    esencia: 'introspección',
    frase:
      'Antes de buscar respuestas afuera, date un rato contigo misma/o. No toda pregunta necesita resolverse hoy hablando con alguien más — a veces primero hay que escucharte a ti.',
    esenciaInvertida: 'aislamiento',
    fraseInvertida:
      'Alejarte para pensar es sano; desaparecer del todo no. La soledad que buscabas para claridad se puede convertir en una forma de evitar lo que hay que decir.',
    temas: ['distancia', 'duda'],
  },
  {
    nombre: 'La Rueda de la Fortuna',
    numero: 10,
    esencia: 'cambio',
    frase:
      'Nada de esto se queda como está para siempre — ni lo bueno ni lo difícil. Estás en medio de un ciclo, no al final de la historia.',
    esenciaInvertida: 'resistencia',
    fraseInvertida:
      'Repetir el mismo patrón esperando un resultado distinto no es paciencia, es quedarte atascada/o. Qué parte tuya se está negando a soltar lo que ya cambió.',
    temas: ['ruptura', 'esperanza'],
  },
  {
    nombre: 'La Justicia',
    numero: 11,
    esencia: 'equilibrio',
    frase:
      'Sé honesta/o, incluso si la verdad no es cómoda. Mira esta situación sin adornarla ni para bien ni para mal — solo así vas a saber qué es justo para ti.',
    esenciaInvertida: 'desequilibrio',
    fraseInvertida:
      'Algo en esta situación no está siendo parejo, y lo sabes. Hay una balanza inclinada — donde uno da o cede mucho más que el otro — que necesita nombrarse, no ignorarse.',
    temas: ['duda', 'celos'],
  },
  {
    nombre: 'El Colgado',
    numero: 12,
    esencia: 'pausa',
    frase:
      'No todo se resuelve moviéndote. Esto pide una pausa consciente — mirarlo desde otro ángulo antes de actuar, aunque la espera incomode.',
    esenciaInvertida: 'parálisis',
    fraseInvertida:
      'Quedarte quieta/o por miedo no es lo mismo que elegir esperar. Hay una demora que ya no aporta nada — a veces la pausa se vence y toca moverse igual.',
    temas: ['duda'],
  },
  {
    nombre: 'La Muerte',
    numero: 13,
    esencia: 'transformación',
    frase:
      'Algo tiene que terminar para que empiece lo que sigue — y eso no es una tragedia, aunque duela. Esto no habla de un final literal, habla de dejar ir la versión de esto que ya no existe.',
    esenciaInvertida: 'negación',
    fraseInvertida:
      'Aferrarte a lo que ya se terminó solo alarga el dolor. Hay miedo a soltar, aunque en el fondo ya sepas que esta versión de la historia llegó a su fin.',
    temas: ['ruptura'],
  },
  {
    nombre: 'La Templanza',
    numero: 14,
    esencia: 'paciencia',
    frase:
      'No todo se resuelve hoy, y eso está bien. Lo que es real entre ustedes puede esperar un paso más — la paciencia no es debilidad, es la forma en que las cosas verdaderas se sostienen en el tiempo.',
    esenciaInvertida: 'desborde',
    fraseInvertida:
      'Cuando todo se siente urgente, es fácil perder la mesura. Baja el ritmo — una reacción apresurada ahora puede costar más que la espera que tanto te cuesta sostener.',
    temas: ['distancia', 'duda'],
  },
  {
    nombre: 'El Diablo',
    numero: 15,
    esencia: 'atadura',
    frase:
      'Hay patrones que se sienten intensos pero no te hacen bien — y una parte de ti ya lo sabe. Mira de frente qué te está costando esta situación, sin minimizarlo.',
    esenciaInvertida: 'liberación',
    fraseInvertida:
      'Estás más cerca de soltar esas cadenas de lo que crees. Este es el momento en que decides que ya no quieres seguir atada/o a algo que te hace más mal que bien.',
    temas: ['celos', 'ruptura'],
  },
  {
    nombre: 'La Torre',
    numero: 16,
    esencia: 'quiebre',
    frase:
      'Algo que ya no te sostenía se está cayendo, y aunque duela, no es el final: es el espacio que se abre para lo que sigue. A veces hace falta que se derrumbe lo viejo para construir algo que sí te merezca.',
    esenciaInvertida: 'encierro',
    fraseInvertida:
      'A veces lo más doloroso no es que algo se caiga, sino que no termine de caerse del todo. Estás en una grieta que ya se ve venir, posponiendo lo inevitable.',
    temas: ['ruptura', 'celos', 'redes'],
  },
  {
    nombre: 'La Estrella',
    numero: 17,
    esencia: 'calma',
    frase:
      'Después de la duda, llega un momento de calma. Hoy no necesitas responderle a nadie más que a ti — la claridad que buscas ya está empezando a asomarse, aunque todavía no la veas del todo.',
    esenciaInvertida: 'desánimo',
    fraseInvertida:
      'Cuesta ver luz cuando llevas tiempo esperando que algo mejore. La esperanza no se acabó — necesita recuperarse desde adentro, no desde lo que la otra persona haga.',
    temas: ['esperanza', 'duda'],
  },
  {
    nombre: 'La Luna',
    numero: 18,
    esencia: 'intuición',
    frase:
      'Hay algo que ya intuyes pero no te has atrevido a decir en voz alta. Confía en esa corazonada: lo que sientes por dentro suele saber más de lo que alcanzas a explicar con palabras.',
    esenciaInvertida: 'confusión',
    fraseInvertida:
      'Hay demasiado ruido — dudas, suposiciones, cosas que imaginas pero no confirmas. Baja la ansiedad antes de sacar conclusiones sobre algo que todavía no tienes claro del todo.',
    temas: ['distancia', 'redes', 'celos'],
  },
  {
    nombre: 'El Sol',
    numero: 19,
    esencia: 'claridad',
    frase:
      'Lo que hoy parece complicado, en el fondo es más simple de lo que crees. Confía en lo que ves con tus propios ojos, no en lo que temes que pueda pasar — la claridad llega cuando dejas de anticipar el peor escenario.',
    esenciaInvertida: 'nubosidad',
    fraseInvertida:
      'Hoy cuesta ver lo bueno, y está bien reconocerlo. La alegría no desapareció — solo toca ser paciente contigo mientras la nube pasa.',
    temas: ['esperanza', 'celos'],
  },
  {
    nombre: 'El Juicio',
    numero: 20,
    esencia: 'renacer',
    frase:
      'Estás en un momento de mirar atrás con otros ojos — no para quedarte ahí, sino para entender qué aprendiste. Esto marca un antes y un después que ya empezaste a cruzar.',
    esenciaInvertida: 'autocrítica',
    fraseInvertida:
      'Juzgarte con dureza no es lo mismo que ser honesta/o contigo. Date el mismo permiso de crecer que le darías a cualquier persona que quieres.',
    temas: ['ruptura', 'duda'],
  },
  {
    nombre: 'El Mundo',
    numero: 21,
    esencia: 'cierre',
    frase:
      'Un ciclo se está cerrando, aunque todavía no le hayas puesto nombre. Date permiso de soltarlo del todo — cerrar bien una historia es lo que te deja las manos libres para la que viene.',
    esenciaInvertida: 'pendiente',
    fraseInvertida:
      'Todavía queda algo sin cerrar, aunque quieras avanzar. Hay un capítulo que no terminó de escribirse del todo — date el permiso de terminarlo antes de empezar el siguiente.',
    temas: ['ruptura'],
  },
];

// Arcanos Menores (56 cartas, 4 palos de 14) — Parte 2. Mismo origen de
// contenido que los mayores (sistema tradicional Rider-Waite-Smith, dominio
// público): cada palo tiene un elemento y un territorio emocional (Copas =
// agua/lo que sientes, Espadas = aire/lo que piensas o se dice, Bastos =
// fuego/lo que quieres hacer, Oros = tierra/lo concreto y cotidiano), y cada
// número del 1 al 10 + las 4 cartas de corte (Sota, Caballo, Reina, Rey)
// tienen un arquetipo que se repite en los 4 palos con su propio matiz.
export const MAZO_MENOR: Carta[] = [
  // ── COPAS — lo que sientes ─────────────────────────────────────────
  { nombre: 'As de Copas', numero: 22, esencia: 'apertura', frase: 'Un sentimiento nuevo se abre paso — date permiso de sentirlo sin analizarlo todavía. El corazón sabe antes que la cabeza.', esenciaInvertida: 'represión', fraseInvertida: 'Estás conteniendo algo que sí sientes. Guardarte lo que de verdad te importa no lo hace desaparecer, solo lo aplaza.', temas: ['esperanza'] },
  { nombre: 'Dos de Copas', numero: 23, esencia: 'conexión', frase: 'Hay una posibilidad real de encontrarse en el medio — los dos dando un paso, no solo uno esperando al otro.', esenciaInvertida: 'desbalance', fraseInvertida: 'Uno está poniendo más corazón que el otro en este momento, y eso se siente aunque nadie lo diga.', temas: ['esperanza', 'duda'] },
  { nombre: 'Tres de Copas', numero: 24, esencia: 'celebración', frase: 'Hay algo bueno que merece reconocerse, aunque sea pequeño. No todo tiene que resolverse hoy para poder disfrutar lo que sí está funcionando.', esenciaInvertida: 'aislamiento', fraseInvertida: 'Te has alejado de las personas que normalmente te sostienen. No tienes que procesar esto sola/o.', temas: ['distancia'] },
  { nombre: 'Cuatro de Copas', numero: 25, esencia: 'apatía', frase: 'Algo bueno está frente a ti y todavía no lo ves — la desilusión de antes no te deja notar lo que sí está presente ahora.', esenciaInvertida: 'despertar', fraseInvertida: 'Estás empezando a salir de ese bajón donde nada parecía suficiente. Es un buen momento para volver a prestar atención.', temas: ['duda'] },
  { nombre: 'Cinco de Copas', numero: 26, esencia: 'duelo', frase: 'Estás mirando lo que se perdió y no lo que todavía queda de pie. Hay dos copas ahí paradas — vale la pena voltear a verlas.', esenciaInvertida: 'aceptación', fraseInvertida: 'Estás empezando a hacer las paces con lo que pasó. Soltar el arrepentimiento es lo que te deja avanzar de verdad.', temas: ['ruptura'] },
  { nombre: 'Seis de Copas', numero: 27, esencia: 'nostalgia', frase: 'Algo de esto te recuerda a una época más simple entre ustedes. No es malo mirar atrás, siempre que no te quedes viviendo ahí.', esenciaInvertida: 'idealización', fraseInvertida: 'Estás comparando esto con una versión idealizada del pasado que quizás nunca fue tan perfecta como la recuerdas.', temas: ['esperanza'] },
  { nombre: 'Siete de Copas', numero: 28, esencia: 'fantasía', frase: 'Tienes muchas versiones posibles de cómo podría ser esto en tu cabeza. Toca elegir cuál es real y cuál solo te hace sentir mejor por ahora.', esenciaInvertida: 'claridad', fraseInvertida: 'Las cosas se están volviendo más concretas. Ya sabes distinguir qué es una ilusión y qué es algo con lo que de verdad puedes contar.', temas: ['duda'] },
  { nombre: 'Ocho de Copas', numero: 29, esencia: 'alejamiento', frase: 'Una parte de ti ya está lista para irse, aunque quede algo bueno atrás. No pasa nada por reconocer que buscas algo que esto no te está dando.', esenciaInvertida: 'estancamiento', fraseInvertida: 'Sabes que ya no encaja, pero te cuesta soltar. Quedarte por costumbre no es lo mismo que quedarte por convicción.', temas: ['ruptura', 'duda'] },
  { nombre: 'Nueve de Copas', numero: 30, esencia: 'satisfacción', frase: 'Estás más cerca de sentirte en paz con esto de lo que crees. No necesitas que todo sea perfecto para sentir que vale la pena.', esenciaInvertida: 'insatisfacción', fraseInvertida: 'Sientes que nada es suficiente, aunque en el papel las cosas estén bien. Vale la pena preguntarte qué es lo que en verdad esperabas.', temas: ['esperanza'] },
  { nombre: 'Diez de Copas', numero: 31, esencia: 'plenitud', frase: 'Esto se siente como lo que realmente buscabas — una conexión que no necesita esfuerzo para sentirse bien. Disfrútalo sin buscarle peros.', esenciaInvertida: 'grieta', fraseInvertida: 'La imagen de "todo bien" no coincide con lo que sientes por dentro. Hay una grieta que merece nombrarse, no esconderse detrás de las apariencias.', temas: ['esperanza', 'duda'] },
  { nombre: 'Sota de Copas', numero: 32, esencia: 'curiosidad', frase: 'Te llega una noticia o un gesto inesperado — algo tierno y todavía sin forma definida. Déjalo ser lo que es, sin adelantarte a lo que podría significar.', esenciaInvertida: 'evasión', fraseInvertida: 'Alguien —quizás tú— está evitando hablar de lo que siente en serio. Los gestos bonitos no reemplazan una conversación real.', temas: ['duda'] },
  { nombre: 'Caballo de Copas', numero: 33, esencia: 'romance', frase: 'Hay una invitación a moverte desde el corazón, no desde el cálculo. Si vas a dar un paso, que sea porque de verdad lo sientes.', esenciaInvertida: 'idealización', fraseInvertida: 'Te estás dejando llevar por cómo te gustaría que fueran las cosas, no por cómo son. Cuidado con prometer —o esperar— más de lo real.', temas: ['esperanza'] },
  { nombre: 'Reina de Copas', numero: 34, esencia: 'empatía', frase: 'Tienes la capacidad de entender lo que el otro siente sin perderte a ti misma/o en el intento. Esa es tu fuerza aquí, no tu debilidad.', esenciaInvertida: 'sobreentrega', fraseInvertida: 'Estás sintiendo tanto por el otro que dejaste de sentir por ti. Cuidar no debería costarte perderte.', temas: ['esperanza', 'celos'] },
  { nombre: 'Rey de Copas', numero: 35, esencia: 'serenidad', frase: 'Puedes sentir intensamente sin que eso te desborde. Responder desde la calma, no desde la reacción, es lo que esto te pide hoy.', esenciaInvertida: 'frialdad', fraseInvertida: 'Te estás guardando lo que sientes detrás de una calma que ya no es calma, es distancia. No tienes que endurecerte para protegerte.', temas: ['distancia'] },

  // ── ESPADAS — lo que piensas o se dice ─────────────────────────────
  { nombre: 'As de Espadas', numero: 36, esencia: 'claridad', frase: 'Una verdad se está abriendo paso, y aunque incomode, es lo que necesitas ver con precisión. La claridad corta, pero también libera.', esenciaInvertida: 'distorsión', fraseInvertida: 'Estás dándole vueltas a lo mismo sin llegar a ningún lado. Antes de decidir algo, necesitas bajar el ruido en tu cabeza.', temas: ['duda'] },
  { nombre: 'Dos de Espadas', numero: 37, esencia: 'evitación', frase: 'Estás evitando una decisión tapándote los ojos a propósito. En algún momento vas a tener que mirar de frente lo que estás posponiendo.', esenciaInvertida: 'sobrecarga', fraseInvertida: 'Ya no puedes seguir sin decidir — la indecisión misma se volvió el problema. Cualquier movimiento es mejor que seguir congelada/o.', temas: ['duda'] },
  { nombre: 'Tres de Espadas', numero: 38, esencia: 'dolor', frase: 'Hay una verdad que duele, y fingir que no la escuchaste no la hace menos cierta. Nombrar el dolor es el primer paso para que deje de gobernarte.', esenciaInvertida: 'sanación', fraseInvertida: 'Ya cruzaste la parte más dura de esto. Lo que antes dolía al nombrarlo, hoy empieza a doler un poco menos.', temas: ['ruptura', 'celos'] },
  { nombre: 'Cuatro de Espadas', numero: 39, esencia: 'descanso', frase: 'Antes de la próxima conversación difícil, date un respiro real. No todo pensamiento necesita resolverse en el momento en que aparece.', esenciaInvertida: 'desgaste', fraseInvertida: 'Llevas demasiado tiempo dándole vueltas a lo mismo sin parar. Tu mente también necesita permiso para descansar de esto.', temas: ['distancia', 'duda'] },
  { nombre: 'Cinco de Espadas', numero: 40, esencia: 'conflicto', frase: 'No toda discusión necesita un ganador. Pregúntate si lo que quieres es tener la razón o de verdad resolver esto.', esenciaInvertida: 'reconciliación', fraseInvertida: 'Hay una oportunidad de bajar las armas primero. Ceder en lo que no importa tanto puede abrir la puerta a lo que sí importa.', temas: ['celos', 'ruptura'] },
  { nombre: 'Seis de Espadas', numero: 41, esencia: 'transición', frase: 'Estás dejando atrás una parte difícil, aunque el camino todavía no se sienta cómodo del todo. Avanzar, aunque sea despacio, ya es avanzar.', esenciaInvertida: 'estancamiento', fraseInvertida: 'Sientes que no puedes dejar esto atrás por más que lo intentas. Algo te sigue atando a la versión anterior de la historia.', temas: ['ruptura', 'distancia'] },
  { nombre: 'Siete de Espadas', numero: 42, esencia: 'estrategia', frase: 'Hay algo que no estás diciendo del todo, y vale la pena preguntarte por qué. A veces callar es cuidado, a veces es evasión — solo tú sabes cuál es hoy.', esenciaInvertida: 'exposición', fraseInvertida: 'Algo que se estaba ocultando —tuyo o del otro— está saliendo a la luz. Mejor que se sepa ahora que seguir cargando el peso de esconderlo.', temas: ['celos'] },
  { nombre: 'Ocho de Espadas', numero: 43, esencia: 'atrapamiento', frase: 'Sientes que no tienes opciones, pero las ataduras aquí son más de percepción que reales. Date la posibilidad de mirar esto desde otro ángulo.', esenciaInvertida: 'desahogo', fraseInvertida: 'Estás empezando a ver que tenías más libertad de la que creías. El miedo se sentía más grande que la situación real.', temas: ['duda', 'distancia'] },
  { nombre: 'Nueve de Espadas', numero: 44, esencia: 'ansiedad', frase: 'Las tres de la mañana siempre exageran las cosas. Lo que te quita el sueño hoy probablemente se vea distinto a la luz del día.', esenciaInvertida: 'alivio', fraseInvertida: 'Lo que tanto te angustiaba empieza a perder tamaño. No todo lo que imaginaste en lo peor termina siendo cierto.', temas: ['duda'] },
  { nombre: 'Diez de Espadas', numero: 45, esencia: 'colapso', frase: 'Algo llegó a su punto más bajo — y precisamente porque ya tocó fondo, de aquí en más solo se puede reconstruir.', esenciaInvertida: 'recuperación', fraseInvertida: 'Ya pasaste lo peor de esto. Lo que sigue, aunque lento, va en dirección de sanar, no de seguir cayendo.', temas: ['ruptura'] },
  { nombre: 'Sota de Espadas', numero: 46, esencia: 'vigilancia', frase: 'Estás procesando información nueva y todavía armando el rompecabezas. No te apresures a sacar conclusiones con piezas que faltan.', esenciaInvertida: 'chisme', fraseInvertida: 'Cuidado con sacar conclusiones de cosas a medias — de terceros, de redes, de suposiciones. No toda información es información real.', temas: ['redes', 'duda'] },
  { nombre: 'Caballo de Espadas', numero: 47, esencia: 'impulso', frase: 'Tienes claridad y ganas de actuar rápido — solo asegúrate de que sea la claridad real, no la de un momento de rabia.', esenciaInvertida: 'imprudencia', fraseInvertida: 'Estás por decir algo que no vas a poder retirar después. Antes de hablar desde el enojo, respira una vez más de las que crees necesitar.', temas: ['celos'] },
  { nombre: 'Reina de Espadas', numero: 48, esencia: 'honestidad', frase: 'Puedes decir la verdad sin ser cruel — esa es la línea que esta situación te pide caminar. Clara, no fría.', esenciaInvertida: 'dureza', fraseInvertida: 'Te estás protegiendo detrás de un tono más cortante de lo que hace falta. Puedes bajar la guardia sin dejar de ser clara/o.', temas: ['distancia'] },
  { nombre: 'Rey de Espadas', numero: 49, esencia: 'objetividad', frase: 'Mira esta situación con la cabeza fría por un momento, sin el ruido de lo que sientes. A veces la claridad viene de dar un paso atrás.', esenciaInvertida: 'desapego', fraseInvertida: 'Te estás distanciando tanto de lo que sientes que dejaste de estar presente del todo. La lógica no tiene por qué reemplazar al corazón.', temas: ['distancia'] },

  // ── BASTOS — lo que quieres hacer al respecto ──────────────────────
  { nombre: 'As de Bastos', numero: 50, esencia: 'impulso', frase: 'Sientes ganas reales de moverte en esto — esa chispa es información, no solo entusiasmo pasajero. Síguela.', esenciaInvertida: 'titubeo', fraseInvertida: 'Tienes las ganas pero no terminas de animarte. Algo te está frenando antes de siquiera intentarlo.', temas: ['esperanza'] },
  { nombre: 'Dos de Bastos', numero: 51, esencia: 'planeación', frase: 'Estás mirando más allá de hoy — pensando qué tan lejos quieres llegar con esto. Es un buen momento para imaginar el futuro sin apurarlo.', esenciaInvertida: 'indecisión', fraseInvertida: 'Te cuesta comprometerte con una dirección. Seguir abierta/o a todo también es una forma de no elegir nada.', temas: ['duda'] },
  { nombre: 'Tres de Bastos', numero: 52, esencia: 'expansión', frase: 'Diste ya un primer paso, y ahora toca esperar a ver qué responde. La paciencia aquí no es pasividad, es dejar que las cosas maduren.', esenciaInvertida: 'obstáculo', fraseInvertida: 'Algo se está demorando más de lo que esperabas. No es que se haya cancelado, solo está tardando más en llegar.', temas: ['esperanza'] },
  { nombre: 'Cuatro de Bastos', numero: 53, esencia: 'celebración', frase: 'Hay un motivo real para alegrarte de cómo va esto, aunque no sea perfecto todavía. Date el permiso de disfrutar los avances pequeños.', esenciaInvertida: 'inestabilidad', fraseInvertida: 'La base de esto se siente menos firme de lo que aparenta. Antes de celebrar, vale la pena asegurar los cimientos.', temas: ['esperanza'] },
  { nombre: 'Cinco de Bastos', numero: 54, esencia: 'fricción', frase: 'Hay tensión, pero no necesariamente destructiva — a veces chocar de frente es lo que aclara qué quiere cada uno de verdad.', esenciaInvertida: 'evasión', fraseInvertida: 'Están esquivando la discusión que en realidad necesitan tener. Postergarla no la hace desaparecer, solo la acumula.', temas: ['celos'] },
  { nombre: 'Seis de Bastos', numero: 55, esencia: 'reconocimiento', frase: 'Algo que hiciste bien está por notarse — un logro, una decisión valiente, un paso que valió la pena dar. Déjate sentir orgullo por eso.', esenciaInvertida: 'desilusión', fraseInvertida: 'Esperabas un reconocimiento que no llegó como imaginabas. Eso no borra el valor de lo que sí hiciste.', temas: ['esperanza'] },
  { nombre: 'Siete de Bastos', numero: 56, esencia: 'defensa', frase: 'Estás sosteniendo una postura frente a algo o alguien, y tienes derecho a hacerlo. No te disculpes por poner un límite que es justo.', esenciaInvertida: 'agotamiento', fraseInvertida: 'Llevas mucho tiempo defendiéndote de lo mismo y ya te cansó. Está bien bajar la guardia un momento, no todo es una batalla.', temas: ['celos', 'ruptura'] },
  { nombre: 'Ocho de Bastos', numero: 57, esencia: 'velocidad', frase: 'Las cosas se están moviendo rápido — una respuesta, una decisión, un giro inesperado. Prepárate, pero no le tengas miedo a la velocidad.', esenciaInvertida: 'retraso', fraseInvertida: 'Todo se siente más lento de lo que esperabas. La demora frustra, pero no significa que no vaya a llegar.', temas: ['duda'] },
  { nombre: 'Nueve de Bastos', numero: 58, esencia: 'resiliencia', frase: 'Ya has resistido bastante en esto — y esa fuerza es real, aunque estés cansada/o. Falta poco, no sueltes justo ahora.', esenciaInvertida: 'agotamiento', fraseInvertida: 'Sientes que ya no te queda nada más para dar. Es válido parar a recargarte antes de decidir cualquier próximo paso.', temas: ['celos'] },
  { nombre: 'Diez de Bastos', numero: 59, esencia: 'sobrecarga', frase: 'Estás cargando más de lo que te corresponde en esto. Pregúntate qué parte de ese peso puedes soltar o compartir.', esenciaInvertida: 'delegar', fraseInvertida: 'Estás aprendiendo, por fin, a no cargar todo sola/o. Pedir ayuda o repartir la responsabilidad no es rendirse.', temas: ['celos', 'ruptura'] },
  { nombre: 'Sota de Bastos', numero: 60, esencia: 'entusiasmo', frase: 'Hay una idea o un impulso nuevo que te tiene emocionada/o. Déjate ilusionar un poco, sin necesidad de tener todo resuelto todavía.', esenciaInvertida: 'impaciencia', fraseInvertida: 'Quieres que todo pase ya, y esa prisa te puede jugar en contra. No todo lo bueno llega al ritmo que uno quisiera.', temas: ['esperanza'] },
  { nombre: 'Caballo de Bastos', numero: 61, esencia: 'acción', frase: 'Es momento de moverte, no de seguir pensándolo. Tienes la energía — solo falta que decidas usarla.', esenciaInvertida: 'impulsividad', fraseInvertida: 'Estás por actuar sin pensar del todo las consecuencias. Un poco de pausa no le hace daño a las ganas de avanzar.', temas: ['duda'] },
  { nombre: 'Reina de Bastos', numero: 62, esencia: 'confianza', frase: 'Tienes más seguridad de la que te estás permitiendo mostrar. No necesitas encogerte para que esto funcione.', esenciaInvertida: 'inseguridad', fraseInvertida: 'Estás dudando de tu propio valor en esta situación. Lo que sientes que falta no es de ti, es de cómo te están tratando.', temas: ['duda', 'esperanza'] },
  { nombre: 'Rey de Bastos', numero: 63, esencia: 'liderazgo', frase: 'Puedes tomar las riendas de esto sin necesidad de imponerte. Liderar aquí es dar el ejemplo, no dar órdenes.', esenciaInvertida: 'control', fraseInvertida: 'Estás empujando esto más de lo que se está dejando llevar. No todo se resuelve con más fuerza o más urgencia.', temas: ['duda'] },

  // ── OROS — lo concreto y cotidiano ──────────────────────────────────
  { nombre: 'As de Oros', numero: 64, esencia: 'oportunidad', frase: 'Se abre una posibilidad concreta — un gesto real, un cambio tangible, algo que no es solo palabras. Vale la pena tomarlo en serio.', esenciaInvertida: 'desperdicio', fraseInvertida: 'Hay una posibilidad real que se está dejando pasar por duda o por miedo. Todavía estás a tiempo de no dejarla ir del todo.', temas: ['esperanza'] },
  { nombre: 'Dos de Oros', numero: 65, esencia: 'malabares', frase: 'Estás equilibrando varias cosas a la vez en esto — el tiempo, las ganas, lo práctico. Es normal que algunos días se sienta más difícil que otros.', esenciaInvertida: 'desequilibrio', fraseInvertida: 'Algo se te está cayendo mientras sostienes todo lo demás. No puedes con todo al mismo tiempo, y está bien soltar una cosa.', temas: ['duda'] },
  { nombre: 'Tres de Oros', numero: 66, esencia: 'colaboración', frase: 'Esto funciona mejor cuando los dos ponen de su parte de forma concreta, no solo con intención. El esfuerzo compartido se nota.', esenciaInvertida: 'desalineación', fraseInvertida: 'Cada uno está remando para un lado distinto. Antes de seguir, necesitan ponerse de acuerdo en qué están construyendo juntos.', temas: ['duda'] },
  { nombre: 'Cuatro de Oros', numero: 67, esencia: 'seguridad', frase: 'Buscas algo estable, y no hay nada de malo en eso. Solo cuida que la necesidad de seguridad no se vuelva control.', esenciaInvertida: 'aferramiento', fraseInvertida: 'Estás sosteniendo esto con demasiada fuerza, con miedo a que se te escape. A veces aflojar la mano es lo que deja que algo se quede.', temas: ['duda', 'celos'] },
  { nombre: 'Cinco de Oros', numero: 68, esencia: 'carencia', frase: 'Sientes que falta algo — apoyo, tiempo, esfuerzo de parte del otro. Nombrar esa carencia es más útil que solo sentirla en silencio.', esenciaInvertida: 'recuperación', fraseInvertida: 'Lo peor de esa sensación de escasez ya empezó a quedar atrás. Las cosas se están acomodando, aunque todavía no se sienta del todo.', temas: ['distancia', 'ruptura'] },
  { nombre: 'Seis de Oros', numero: 69, esencia: 'reciprocidad', frase: 'Pregúntate si lo que dan y lo que reciben está parejo. Una relación sana se siente como un intercambio, no como una deuda de un solo lado.', esenciaInvertida: 'desbalance', fraseInvertida: 'Uno de los dos está dando —o cediendo— mucho más que el otro. Esa diferencia, sin nombrarse, con el tiempo pesa.', temas: ['duda', 'celos'] },
  { nombre: 'Siete de Oros', numero: 70, esencia: 'evaluación', frase: 'Es un buen momento para mirar hacia atrás y ver qué tanto has invertido en esto — y si lo que está creciendo vale la pena seguir regando.', esenciaInvertida: 'impaciencia', fraseInvertida: 'Quieres resultados ya, y las cosas de raíz profunda no funcionan a ese ritmo. Sigues invirtiendo, solo que sin ver todavía el fruto.', temas: ['duda'] },
  { nombre: 'Ocho de Oros', numero: 71, esencia: 'dedicación', frase: 'Estás poniendo esfuerzo real y constante en esto, aunque no siempre se note desde afuera. Ese trabajo silencioso también cuenta.', esenciaInvertida: 'desgaste', fraseInvertida: 'Sientes que todo lo que das no está rindiendo lo que debería. Vale la pena revisar si el esfuerzo va en la dirección correcta.', temas: ['celos'] },
  { nombre: 'Nueve de Oros', numero: 72, esencia: 'independencia', frase: 'Estás bien parada/o sola/o, y eso no te hace menos capaz de amar a alguien más. La estabilidad no depende de que el otro te la dé.', esenciaInvertida: 'dependencia', fraseInvertida: 'Estás poniendo tu bienestar en manos de que la otra persona haga algo. Tu paz no debería depender solo de su decisión.', temas: ['duda', 'esperanza'] },
  { nombre: 'Diez de Oros', numero: 73, esencia: 'legado', frase: 'Esto tiene el potencial de ser algo duradero, con raíces, no solo un momento pasajero. Piensa en el largo plazo sin perder lo de hoy.', esenciaInvertida: 'fragilidad', fraseInvertida: 'Lo que se veía sólido tiene grietas que no se estaban nombrando. La estructura necesita atención antes de seguir construyendo encima.', temas: ['ruptura'] },
  { nombre: 'Sota de Oros', numero: 74, esencia: 'aprendizaje', frase: 'Estás en una etapa de aprender cómo se construye algo real con esta persona, paso a paso. No hace falta tener todas las respuestas todavía.', esenciaInvertida: 'superficialidad', fraseInvertida: 'Hay buenas intenciones pero pocos hechos concretos detrás. Las palabras solas no construyen algo estable.', temas: ['duda'] },
  { nombre: 'Caballo de Oros', numero: 75, esencia: 'constancia', frase: 'El progreso aquí es lento pero real — un paso seguro detrás de otro. No necesitas que sea rápido para que sea válido.', esenciaInvertida: 'estancamiento', fraseInvertida: 'Te has quedado en piloto automático, haciendo lo mismo sin avanzar. La constancia sin dirección se vuelve rutina vacía.', temas: ['distancia'] },
  { nombre: 'Reina de Oros', numero: 76, esencia: 'arraigo', frase: 'Cuidas de esta relación con gestos concretos, no solo con palabras bonitas. Esa forma de amar, aunque silenciosa, es real y se nota.', esenciaInvertida: 'desgaste', fraseInvertida: 'Estás dando más cuidado del que estás recibiendo de vuelta. Cuidar a alguien no debería vaciarte a ti.', temas: ['esperanza', 'celos'] },
  { nombre: 'Rey de Oros', numero: 77, esencia: 'estabilidad', frase: 'Tienes la capacidad de sostener esto con calma y firmeza, sin dramatizar ni minimizar. Esa solidez es justo lo que la situación necesita.', esenciaInvertida: 'materialismo', fraseInvertida: 'Estás midiendo esto en términos muy prácticos — quién da más, quién gasta más — y se te está escapando lo que no se puede medir así.', temas: ['duda'] },
];

// Alias de compatibilidad — todo el código interno de este archivo usa
// MAZO_MAYOR; este nombre corto queda disponible si hace falta en el futuro.
export const MAZO = MAZO_MAYOR;

// El mazo completo de 78 cartas — se usa para barajar las lecturas reales
// (Lecturas). La carta del día (M0) se queda solo con los mayores: es un
// ritual diario gentil, y los mayores tienen más peso narrativo para eso.
export const MAZO_COMPLETO: Carta[] = [...MAZO_MAYOR, ...MAZO_MENOR];

// Temas que el mock puede reconocer en lo que la persona escribe, para que la
// carta elegida tenga que ver con la situación real (en vez de salir al azar
// sin conexión). Sigue siendo un mock por palabras clave, no comprensión real
// del texto — eso llega con el mecanismo real de la Sesión 6.
const PATRONES_TEMA: Array<{ tema: string; patron: RegExp }> = [
  { tema: 'distancia', patron: /no (me )?(habla|contesta|responde)|silencio|distancia|se aleg?j[oó]|fr[ií]ald?ad|ausente|ignora/i },
  { tema: 'ruptura', patron: /terminamos|ruptura|se acab[oó]|ya no estamos|corte|tronamos|me dej[oó]/i },
  { tema: 'duda', patron: /no s[eé] si|duda|confundid|indecis|no s[eé] qu[eé] hacer|no s[eé] qu[eé] somos/i },
  { tema: 'celos', patron: /celos|enga[ñn]|infiel|otra persona|otro chico|otra chica|coquete/i },
  { tema: 'esperanza', patron: /lo amo|la amo|lo extra[ñn]o|la extra[ñn]o|quiero que funcione|quiero recuperar/i },
  { tema: 'redes', patron: /redes|instagram|whats ?app|visto|elimin[oó]|bloque[oó]|stories?/i },
];

function temasDeSituacion(texto: string): string[] {
  return PATRONES_TEMA.filter(({ patron }) => patron.test(texto)).map(({ tema }) => tema);
}

// Situaciones donde una lectura de tarot no es la respuesta correcta — el
// mock nunca debe tratar violencia física o riesgo de autolesión como una
// duda de pareja más. Se detecta ANTES de barajar cualquier carta.
const PATRONES_CRISIS = [
  /me (golpe|peg)[oóaá]/i,
  /me (est[aá] )?golpeando/i,
  /violencia/i,
  /me (abus|amenaz)[oóaá]/i,
  /me (hizo|hace) da[ñn]o/i,
  /me lastim[oó]/i,
  /suicid/i,
  /quitarme la vida/i,
  /matarme/i,
  /no quiero vivir/i,
  /hacerme da[ñn]o/i,
  /lastimarme/i,
];

export function esSituacionDeCrisis(texto: string): boolean {
  return PATRONES_CRISIS.some((patron) => patron.test(texto));
}

export function mensajeDeCrisis(): string {
  return 'Lo que estás describiendo es serio, y no es algo que unas cartas deban decidir por ti — El Espejo se detiene acá a propósito. Si estás en peligro ahora mismo, comunícate con la línea de emergencia de tu país (en la mayoría de LATAM es el 911) o con alguien de confianza cerca de ti. Mereces estar a salvo — eso importa más que cualquier lectura.';
}

/** Elige una carta de forma determinística según la fecha (YYYY-MM-DD), para
 * que la "carta del día" sea la misma todo el día y cambie mañana. Siempre
 * sale derecha — el ritual diario es gentil a propósito, la orientación
 * invertida se reserva para el momento de mayor peso: la lectura de pareja. */
export function cartaDelDia(fechaISO: string): Carta {
  let hash = 0;
  for (let i = 0; i < fechaISO.length; i++) {
    hash = (hash * 31 + fechaISO.charCodeAt(i)) >>> 0;
  }
  return MAZO_MAYOR[hash % MAZO_MAYOR.length];
}

export function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

export function tituloFecha(): string {
  const d = new Date();
  return `${DIAS[d.getDay()]
    .replace(/^./, (c) => c.toUpperCase())} ${d.getDate()} de ${d.toLocaleDateString('es-ES', { month: 'long' })}`;
}

function barajar<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/** Una carta ya elegida para una lectura, con su orientación. El tarot real
 * tiene cartas derechas e invertidas — no es solo estética, cambia el
 * significado que se lee (ver `esencia`/`frase` vs `esenciaInvertida`/
 * `fraseInvertida` en Carta). ~35% de probabilidad de salir invertida, en
 * línea con la convención más común entre lectores de tarot. */
export type CartaSalida = { carta: Carta; invertida: boolean };

function elegirOrientacion(): boolean {
  return Math.random() < 0.35;
}

/** Elige 3 cartas distintas del mazo completo de 78 (mayores + menores).
 * Cuando la situación menciona temas reconocibles (distancia, ruptura, duda,
 * celos, esperanza, redes), prioriza cartas cuyo `temas` conecta con eso —
 * así la lectura no sale desconectada de lo que la persona realmente
 * escribió. Sigue siendo por palabras clave (mock), no comprensión real del
 * texto. */
function elegirTresCartas(temas: string[]): [Carta, Carta, Carta] {
  if (temas.length === 0) {
    const [a, b, c] = barajar(MAZO_COMPLETO);
    return [a, b, c];
  }
  const conectadas = barajar(MAZO_COMPLETO.filter((c) => c.temas.some((t) => temas.includes(t))));
  const resto = barajar(MAZO_COMPLETO.filter((c) => !conectadas.includes(c)));
  const orden = [...conectadas, ...resto];
  return [orden[0], orden[1], orden[2]];
}

export function esenciaDe(salida: CartaSalida): string {
  return salida.invertida ? salida.carta.esenciaInvertida : salida.carta.esencia;
}

export function fraseDe(salida: CartaSalida): string {
  return salida.invertida ? salida.carta.fraseInvertida : salida.carta.frase;
}

/** Nombre para guardar en el historial — incluye "(invertida)" cuando aplica,
 * ya que el historial solo guarda el nombre como texto plano. */
export function nombreConOrientacion(salida: CartaSalida): string {
  return salida.invertida ? `${salida.carta.nombre} (invertida)` : salida.carta.nombre;
}

/** Sortea las 3 cartas de una lectura de pareja (Tú / La Otra Persona / La
 * Dinámica) — el sorteo SIEMPRE es al azar, nunca lo decide la IA (eso sería
 * hacer trampa con el tarot). El TEXTO que interpreta estas cartas ya no se
 * genera acá: desde que se conectó la IA real (Sesión 6), lo escribe el
 * endpoint /api/lectura a partir de estas mismas cartas + lo que la persona
 * escribió. Para situaciones de riesgo real (violencia, autolesión) usar
 * primero `esSituacionDeCrisis` — esta función asume que ya se descartó ese
 * caso. */
export function sortearCartas(situacion: string): [CartaSalida, CartaSalida, CartaSalida] {
  const temas = temasDeSituacion(situacion);
  const [tuCarta, otraCarta, dinamicaCarta] = elegirTresCartas(temas);
  const tu: CartaSalida = { carta: tuCarta, invertida: elegirOrientacion() };
  const otra: CartaSalida = { carta: otraCarta, invertida: elegirOrientacion() };
  const dinamica: CartaSalida = { carta: dinamicaCarta, invertida: elegirOrientacion() };
  return [tu, otra, dinamica];
}

const TEXTOS_COMPATIBILIDAD = [
  'una conexión que exige paciencia — se entienden bien, pero a ritmos distintos, y eso genera roces cuando ninguno de los dos lo nombra en voz alta',
  'una química evidente desde el principio, aunque los dos evitan dar el primer paso por miedo a exponerse más rápido que el otro',
  'un vínculo que crece cuando hay comunicación directa, y se enfría apenas empieza a faltar — la clave está en no dar por hecho lo que el otro siente',
  'una atracción fuerte que necesita más honestidad que intensidad; lo físico ya está resuelto, lo que falta es hablar claro',
  'una compatibilidad que depende de cuánto espacio se dan mutuamente — funciona mejor cuando ninguno de los dos intenta controlar el ritmo del otro',
];

export function compatibilidad(signoA: string, signoB: string): { puntaje: number; texto: string } {
  let hash = 0;
  const clave = `${signoA}-${signoB}`;
  for (let i = 0; i < clave.length; i++) hash = (hash * 31 + clave.charCodeAt(i)) >>> 0;
  const puntaje = 52 + (hash % 43); // 52–94%, nunca 0 ni 100 (ninguna lectura es absoluta)
  const texto = TEXTOS_COMPATIBILIDAD[hash % TEXTOS_COMPATIBILIDAD.length];
  return { puntaje, texto };
}

// Ilustraciones reales (hechas en Canva por el usuario, con simbología fiel
// al tarot tradicional) para las cartas ya terminadas. TarjetaTarot las usa
// en vez del ícono abstracto de SimboloCarta cuando existen. Las cartas que
// todavía no tienen ilustración real siguen mostrando su ícono — nunca se
// deja un hueco vacío. Se van agregando a medida que se generan más.
export const IMAGENES_REALES: Record<string, string> = {
  'El Loco': '/cartas-canva/el-loco.jpg',
  'El Mago': '/cartas-canva/el-mago.jpg',
  'La Sacerdotisa': '/cartas-canva/la-sacerdotisa.jpg',
  'La Emperatriz': '/cartas-canva/la-emperatriz.jpg',
  'El Emperador': '/cartas-canva/el-emperador.jpg',
  'El Hierofante': '/cartas-canva/el-hierofante.jpg',
  'Los Enamorados': '/cartas-canva/los-enamorados.jpg',
  'El Carro': '/cartas-canva/el-carro.jpg',
  'La Fuerza': '/cartas-canva/la-fuerza.jpg',
  'El Ermitaño': '/cartas-canva/el-ermitano.jpg',
  'La Rueda de la Fortuna': '/cartas-canva/la-rueda-de-la-fortuna.jpg',
  'La Justicia': '/cartas-canva/la-justicia.jpg',
  'El Colgado': '/cartas-canva/el-colgado.jpg',
  'La Muerte': '/cartas-canva/la-muerte.jpg',
  'La Templanza': '/cartas-canva/la-templanza.jpg',
  'El Diablo': '/cartas-canva/el-diablo.jpg',
  'La Torre': '/cartas-canva/la-torre.jpg',
  'La Estrella': '/cartas-canva/la-estrella.jpg',
  'La Luna': '/cartas-canva/la-luna.jpg',
  'El Sol': '/cartas-canva/el-sol.jpg',
  'El Juicio': '/cartas-canva/el-juicio.jpg',
  'El Mundo': '/cartas-canva/el-mundo.jpg',
  // Arcanos menores — Copas (en progreso, se van agregando a medida que se generan)
  'As de Copas': '/cartas-canva/as-de-copas.jpg',
  'Dos de Copas': '/cartas-canva/dos-de-copas.jpg',
  'Tres de Copas': '/cartas-canva/tres-de-copas.jpg',
  'Cuatro de Copas': '/cartas-canva/cuatro-de-copas.jpg',
  'Cinco de Copas': '/cartas-canva/cinco-de-copas.jpg',
  'Seis de Copas': '/cartas-canva/seis-de-copas.jpg',
  'Siete de Copas': '/cartas-canva/siete-de-copas.jpg',
  'Ocho de Copas': '/cartas-canva/ocho-de-copas.jpg',
  'Nueve de Copas': '/cartas-canva/nueve-de-copas.jpg',
  'Diez de Copas': '/cartas-canva/diez-de-copas.jpg',
  'Sota de Copas': '/cartas-canva/sota-de-copas.jpg',
  'Caballo de Copas': '/cartas-canva/caballo-de-copas.jpg',
  'Reina de Copas': '/cartas-canva/reina-de-copas.jpg',
  'Rey de Copas': '/cartas-canva/rey-de-copas.jpg',
  'As de Espadas': '/cartas-canva/as-de-espadas.jpg',
  'Dos de Espadas': '/cartas-canva/dos-de-espadas.jpg',
  'Tres de Espadas': '/cartas-canva/tres-de-espadas.jpg',
  'Cuatro de Espadas': '/cartas-canva/cuatro-de-espadas.jpg',
  'Cinco de Espadas': '/cartas-canva/cinco-de-espadas.jpg',
  'Seis de Espadas': '/cartas-canva/seis-de-espadas.jpg',
  'Siete de Espadas': '/cartas-canva/siete-de-espadas.jpg',
  'Ocho de Espadas': '/cartas-canva/ocho-de-espadas.jpg',
  'Nueve de Espadas': '/cartas-canva/nueve-de-espadas.jpg',
  'Diez de Espadas': '/cartas-canva/diez-de-espadas.jpg',
  'Sota de Espadas': '/cartas-canva/sota-de-espadas.jpg',
  'Caballo de Espadas': '/cartas-canva/caballo-de-espadas.jpg',
  'Reina de Espadas': '/cartas-canva/reina-de-espadas.jpg',
  'Rey de Espadas': '/cartas-canva/rey-de-espadas.jpg',
  'As de Bastos': '/cartas-canva/as-de-bastos.jpg',
  'Dos de Bastos': '/cartas-canva/dos-de-bastos.jpg',
  'Tres de Bastos': '/cartas-canva/tres-de-bastos.jpg',
  'Cuatro de Bastos': '/cartas-canva/cuatro-de-bastos.jpg',
  'Cinco de Bastos': '/cartas-canva/cinco-de-bastos.jpg',
  'Seis de Bastos': '/cartas-canva/seis-de-bastos.jpg',
  'Siete de Bastos': '/cartas-canva/siete-de-bastos.jpg',
  'Ocho de Bastos': '/cartas-canva/ocho-de-bastos.jpg',
  'Nueve de Bastos': '/cartas-canva/nueve-de-bastos.jpg',
  'Diez de Bastos': '/cartas-canva/diez-de-bastos.jpg',
  'Sota de Bastos': '/cartas-canva/sota-de-bastos.jpg',
  'Caballo de Bastos': '/cartas-canva/caballo-de-bastos.jpg',
  'Reina de Bastos': '/cartas-canva/reina-de-bastos.jpg',
  'Rey de Bastos': '/cartas-canva/rey-de-bastos.jpg',
  'As de Oros': '/cartas-canva/as-de-oros.jpg',
  'Dos de Oros': '/cartas-canva/dos-de-oros.jpg',
  'Tres de Oros': '/cartas-canva/tres-de-oros.jpg',
  'Cuatro de Oros': '/cartas-canva/cuatro-de-oros.jpg',
  'Cinco de Oros': '/cartas-canva/cinco-de-oros.jpg',
  'Seis de Oros': '/cartas-canva/seis-de-oros.jpg',
  'Siete de Oros': '/cartas-canva/siete-de-oros.jpg',
  'Ocho de Oros': '/cartas-canva/ocho-de-oros.jpg',
  'Nueve de Oros': '/cartas-canva/nueve-de-oros.jpg',
  'Diez de Oros': '/cartas-canva/diez-de-oros.jpg',
  'Sota de Oros': '/cartas-canva/sota-de-oros.jpg',
  'Caballo de Oros': '/cartas-canva/caballo-de-oros.jpg',
  'Reina de Oros': '/cartas-canva/reina-de-oros.jpg',
  'Rey de Oros': '/cartas-canva/rey-de-oros.jpg',
};
