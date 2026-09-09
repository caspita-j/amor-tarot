// Contenido de la sección "Bienestar" — prácticas caseras de autocuidado con
// cosas que la persona ya tiene en casa (agua, sal, miel, canela, laurel,
// hierbas, velas). Contenido FIJO y global (no depende del usuario, no se
// crea/edita desde la app) — por eso vive acá como dato estático, igual que
// el resto del contenido de tarot en tarot-data.ts, y no en una tabla de
// Supabase.
//
// IMPORTANTE — reencuadre a propósito: FICHA-AVATAR.md prohíbe "lenguaje de
// amarres/rituales" y la promesa central dice explícitamente "sin ofrecer
// rituales o amarres". Esta sección mantiene el espíritu casero/sensorial
// (velas, baños, aromas) pero el PORQUÉ de cada práctica es siempre
// autocuidado o un hábito/recordatorio propio — nunca "atraer" o "retener"
// a otra persona, ni causalidad mágica sobre el dinero o el ambiente. Se
// quitó a propósito cualquier práctica que solo tenía sentido como
// superstición pura, sin una lectura de autocuidado razonable (ej. sal en
// las esquinas de la casa "para renovar energía").

export type CategoriaBienestar = {
  id: string;
  label: string;
  descripcion: string;
};

export type PracticaBienestar = {
  id: string;
  categoriaId: string;
  titulo: string;
  intencion: string;
  duracionMinutos: number;
  frecuencia: string;
  materiales: string[];
  pasos: string[];
  notaSeguridad?: string;
};

export const CATEGORIAS_BIENESTAR: CategoriaBienestar[] = [
  { id: 'corazon', label: 'Para tu corazón', descripcion: 'Cuidarte a ti antes de conectar con alguien' },
  { id: 'dinero', label: 'Para tu enfoque con el dinero', descripcion: 'Hábitos simples para tu tranquilidad' },
  { id: 'descanso', label: 'Para dormir mejor', descripcion: 'Rutinas para relajarte antes de dormir' },
  { id: 'espacio', label: 'Para despejar tu espacio', descripcion: 'Orden y aire fresco para sentirte mejor' },
];

export const PRACTICAS_BIENESTAR: PracticaBienestar[] = [
  {
    id: 'bano-calma-miel-canela',
    categoriaId: 'corazon',
    titulo: 'Baño de calma con miel y canela',
    intencion: 'Un momento para sentirte en paz contigo mismo/a antes de escribirle a alguien o de una cita',
    duracionMinutos: 10,
    frecuencia: 'cuando lo necesites',
    materiales: ['2 cucharadas de miel', 'canela en polvo o 3 ramitas', 'una jarra de agua tibia'],
    pasos: [
      'Disuelve la miel y la canela en la jarra de agua tibia.',
      'Al terminar tu ducha normal, vierte la mezcla desde los hombros hacia abajo.',
      'Mientras lo haces, respira profundo y suelta lo que traías en la cabeza.',
      'Deja secar al aire si puedes, o enjuaga suave con agua tibia después de unos minutos.',
    ],
  },
  {
    id: 'vela-poner-en-palabras',
    categoriaId: 'corazon',
    titulo: 'Vela para poner en palabras lo que sientes',
    intencion: 'Un espacio para escucharte antes de decidir qué hacer con tu situación',
    duracionMinutos: 15,
    frecuencia: 'cuando lo sientas necesario',
    materiales: ['1 vela', 'papel y lápiz'],
    pasos: [
      'Enciende la vela en un lugar seguro, lejos de cortinas o papeles.',
      'Escribe en el papel qué necesitas de ti mismo/a hoy — no para nadie más.',
      'Léelo en voz baja una vez y guárdalo donde quieras.',
      'Apaga la vela cuando termines; nunca la dejes sin supervisión.',
    ],
    notaSeguridad: 'Nunca dejes una vela encendida sin vigilancia.',
  },
  {
    id: 'vaso-de-enfoque',
    categoriaId: 'dinero',
    titulo: 'Vaso de enfoque',
    intencion: 'Un recordatorio visual de tu meta de ahorro',
    duracionMinutos: 5,
    frecuencia: 'cambia el agua cada semana',
    materiales: ['1 vaso de vidrio transparente', 'agua limpia', 'una hoja de laurel (opcional, solo decorativo)'],
    pasos: [
      'Llena el vaso con agua limpia y, si quieres, agrega la hoja de laurel.',
      'Colócalo en tu escritorio o cocina, donde lo veas seguido.',
      'Cada vez que lo veas, recuerda tu meta económica del mes.',
      'Cambia el agua cada semana — es tu momento de revisar cómo vas.',
    ],
  },
  {
    id: 'nota-de-meta',
    categoriaId: 'dinero',
    titulo: 'Nota de meta en tu billetera',
    intencion: 'Mantener tu meta económica presente en el día a día',
    duracionMinutos: 5,
    frecuencia: 'renuévala cada mes',
    materiales: ['un papel pequeño', 'un lápiz'],
    pasos: [
      'Escribe en el papel una meta económica concreta del mes.',
      'Dóblalo y guárdalo en tu billetera.',
      'Cada vez que la abras, ese recordatorio está ahí.',
      'Renuévalo cada mes con una meta nueva.',
    ],
  },
  {
    id: 'agua-fresca-junto-a-tu-cama',
    categoriaId: 'descanso',
    titulo: 'Agua fresca junto a tu cama',
    intencion: 'Un pequeño gesto de cuidado antes de dormir',
    duracionMinutos: 2,
    frecuencia: 'todas las noches',
    materiales: ['1 vaso de agua'],
    pasos: [
      'Sirve un vaso de agua y déjalo en tu mesa de noche antes de dormir.',
      'Es para ti si te despiertas con sed — y un recordatorio de que te estás cuidando.',
      'Por la mañana, lava el vaso y repite si quieres.',
    ],
  },
  {
    id: 'ambientador-natural',
    categoriaId: 'descanso',
    titulo: 'Ambientador natural para despejar el cuarto',
    intencion: 'Sentir la habitación más liviana antes de dormir',
    duracionMinutos: 2,
    frecuencia: '1-2 veces por semana',
    materiales: ['1 vaso con agua', '1 pastilla de alcanfor'],
    pasos: [
      'Coloca la pastilla de alcanfor dentro del vaso con agua.',
      'Deja el vaso en una esquina de la habitación durante la noche.',
      'Retíralo por la mañana y ventila el cuarto.',
    ],
    notaSeguridad:
      'Uso solo ambiental/externo: el alcanfor nunca debe ingerirse ni aplicarse sobre la piel. Mantén fuera del alcance de niños y mascotas, y ventila la habitación.',
  },
  {
    id: 'aroma-para-relajarte',
    categoriaId: 'descanso',
    titulo: 'Aroma para relajarte antes de dormir',
    intencion: 'Relajar cuerpo y mente antes de dormir',
    duracionMinutos: 10,
    frecuencia: 'antes de dormir',
    materiales: ['incienso o sahumerio de lavanda'],
    pasos: [
      'Enciende el incienso unos minutos antes de acostarte.',
      'Ventila bien la habitación mientras se consume.',
      'Aprovecha el momento para respirar profundo y soltar el día.',
    ],
  },
  {
    id: 'bano-de-romero',
    categoriaId: 'espacio',
    titulo: 'Baño de romero relajante',
    intencion: 'Aliviar la sensación de cansancio sin causa clara',
    duracionMinutos: 15,
    frecuencia: '1 vez por semana',
    materiales: ['un puñado de romero fresco', 'agua'],
    pasos: [
      'Hierve el romero en agua durante unos minutos.',
      'Deja entibiar la mezcla.',
      'Al final de tu ducha, viértela de los hombros hacia los pies.',
      'Deja secar al aire si puedes.',
    ],
    notaSeguridad: 'Evita si tienes la piel muy sensible o alergia conocida a la planta.',
  },
  {
    id: 'diez-minutos-de-orden',
    categoriaId: 'espacio',
    titulo: '10 minutos de orden',
    intencion: 'Sentir tu espacio más liviano sin gastar la tarde entera',
    duracionMinutos: 10,
    frecuencia: '1 vez a la semana',
    materiales: ['ninguno — solo tú y tu espacio'],
    pasos: [
      'Pon un temporizador de 10 minutos.',
      'Ordena solo una superficie o un rincón — no toda la casa.',
      'Abre una ventana mientras lo haces.',
      'Cuando suene el temporizador, para — ya hiciste algo real por tu espacio.',
    ],
  },
  {
    id: 'aromatizar-tu-espacio',
    categoriaId: 'espacio',
    titulo: 'Aromatizar tu espacio',
    intencion: 'Que tu espacio se sienta más liviano',
    duracionMinutos: 10,
    frecuencia: 'cuando lo sientas necesario',
    materiales: ['sahumerio o incienso natural (romero seco, por ejemplo)'],
    pasos: [
      'Abre las ventanas del espacio.',
      'Enciende el sahumerio y déjalo aromatizar el ambiente.',
      'Deja que el humo se disperse con las ventanas abiertas.',
    ],
  },
];

export function practicasDeCategoria(categoriaId: string): PracticaBienestar[] {
  return PRACTICAS_BIENESTAR.filter((p) => p.categoriaId === categoriaId);
}
