import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from './client';
import type { ImagenDoc } from './types';

const builder = createImageUrlBuilder(sanityClient);

/** La imagen sirve si tiene el asset subido (con solo la descripción cargada, viene sin asset). */
export const tieneImagen = (img?: ImagenDoc | null): img is ImagenDoc & { asset: { _id: string } } =>
  !!img?.asset?._id;

/**
 * URL de una imagen de Sanity recortada a `ancho` × `ancho / proporcion`, respetando el recorte
 * (crop) y el punto de interés (hotspot) que se marcaron en el Studio, en formato automático
 * (webp/avif donde el navegador lo acepte). Hay que pasarle el objeto de la imagen entero, no
 * solo el asset: de ahí salen crop y hotspot.
 */
export function urlImagen(img: ImagenDoc & { asset: { _id: string } }, ancho: number, proporcion: number): string {
  return builder
    .image(img)
    .width(ancho)
    .height(Math.round(ancho / proporcion))
    .fit('crop')
    .auto('format')
    .url();
}

/** `srcSet` con un ancho por cada valor de `anchos` (en px reales de la imagen). */
export const srcSetImagen = (img: ImagenDoc & { asset: { _id: string } }, anchos: number[], proporcion: number) =>
  anchos.map((w) => `${urlImagen(img, w, proporcion)} ${w}w`).join(', ');
