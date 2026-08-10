/**
 * Media URL helper — sirve imágenes desde R2 (vía VITE_R2_URL) o fallback local.
 */

export const R2_URL = import.meta.env.VITE_R2_URL || '';

/**
 * Genera la URL de un asset.
 * @param {string} path — ruta relativa, ej: "img/portadas/Azurra.png"
 *                         NO incluir "/" al inicio
 * @returns {string} URL completa (R2) o path local
 */
export function media(path) {
  // Normalizamos: si viene con "/" al inicio la sacamos
  const clean = path.startsWith('/') ? path.slice(1) : path;

  if (R2_URL) {
    return `${R2_URL.replace(/\/$/, '')}/${clean}`;
  }

  // Local: devolvemos con "/" para que Vite lo sirva desde /public
  return `/${clean}`;
}


/** Logo del estudio (public/) */
export const LOGO = '/logo-estudio-levinton-96.png';


