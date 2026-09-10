// Símbolos zodiacales ilustrados (Canva, estilo 3D aprobado por el usuario
// 2026-09-10) — reemplazan los chips de solo texto en el selector de
// Compatibilidad. Un archivo por signo en public/zodiaco/, mismo estilo y
// tamaño (400×400) para que se vean como un set, no 12 estilos distintos.

export const SIGNOS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis',
] as const;

export type Signo = (typeof SIGNOS)[number];

const IMAGEN_SIGNO: Record<Signo, string> = {
  Aries: '/zodiaco/aries.png',
  Tauro: '/zodiaco/tauro.png',
  Géminis: '/zodiaco/geminis.png',
  Cáncer: '/zodiaco/cancer.png',
  Leo: '/zodiaco/leo.png',
  Virgo: '/zodiaco/virgo.png',
  Libra: '/zodiaco/libra.png',
  Escorpio: '/zodiaco/escorpio.png',
  Sagitario: '/zodiaco/sagitario.png',
  Capricornio: '/zodiaco/capricornio.png',
  Acuario: '/zodiaco/acuario.png',
  Piscis: '/zodiaco/piscis.png',
};

export function imagenSigno(signo: string): string | undefined {
  return IMAGEN_SIGNO[signo as Signo];
}
