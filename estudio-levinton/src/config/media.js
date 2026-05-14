/**
 * Media URL helper — sirve imágenes desde R2 o fallback local.
 *
 * - Si VITE_R2_URL está seteado → usa R2 (producción)
 * - Si no → usa path local (desarrollo)
 */

const R2_BASE = import.meta.env.VITE_R2_URL || '';

/**
 * Genera la URL de un asset.
 * @param {string} path — ruta relativa, ej: "img/portadas/Azurra.png"
 *                         NO incluir "/" al inicio
 * @returns {string} URL completa (R2) o path local
 */
export function media(path) {
  // Normalizamos: si viene con "/" al inicio la sacamos
  const clean = path.startsWith('/') ? path.slice(1) : path;

  if (R2_BASE) {
    // R2: base URL + path
    return `${R2_BASE}/${clean}`;
  }

  // Local: devolvemos con "/" para que Vite lo sirva desde /public
  return `/${clean}`;
}

/**
 * URL base de R2 (para debug o uso directo)
 */
export const R2_URL = R2_BASE;
