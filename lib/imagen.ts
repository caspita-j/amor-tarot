// Utilidades de imagen del lado del cliente — comprimen ANTES de guardar en
// sessionStorage (no hay Supabase Storage real todavía, ver ESTADO.md). Dos
// modos porque el recorte no sirve para todo: un avatar puede recortarse a
// cuadrado sin perder nada importante, pero una captura de conversación
// pierde texto si se recorta — ahí solo se reescala, nunca se corta.

function cargarImagen(archivo: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(lector.error);
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo leer la imagen'));
      img.onload = () => resolve(img);
      img.src = lector.result as string;
    };
    lector.readAsDataURL(archivo);
  });
}

/** Recorta al cuadrado central y reescala — para avatares circulares. */
export async function recortarCuadrado(archivo: File, lado = 320, calidad = 0.85): Promise<string> {
  const img = await cargarImagen(archivo);
  const ladoOriginal = Math.min(img.width, img.height);
  const canvas = document.createElement('canvas');
  canvas.width = lado;
  canvas.height = lado;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas no disponible');
  ctx.drawImage(
    img,
    (img.width - ladoOriginal) / 2,
    (img.height - ladoOriginal) / 2,
    ladoOriginal,
    ladoOriginal,
    0,
    0,
    lado,
    lado
  );
  return canvas.toDataURL('image/jpeg', calidad);
}

/** Reescala manteniendo proporción, SIN recortar — para fotos/capturas que
 * se adjuntan a una lectura (perder contenido, como texto de un chat,
 * sí sería un problema). */
export async function comprimirProporcional(archivo: File, ladoMax = 640, calidad = 0.75): Promise<string> {
  const img = await cargarImagen(archivo);
  const escala = Math.min(1, ladoMax / Math.max(img.width, img.height));
  const w = Math.round(img.width * escala);
  const h = Math.round(img.height * escala);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas no disponible');
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', calidad);
}
