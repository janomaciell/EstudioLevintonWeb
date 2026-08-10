import React from 'react';
import { media } from '../../config/media';

/**
 * Componente de imagen optimizado.
 * Sirve imágenes desde R2 (usando VITE_R2_URL) o desde /public en local.
 * NO usa cdn-cgi ni transformaciones de Cloudflare Edge.
 */
export function Img({ src, width, height, alt, sizes, priority = false, ...rest }) {
  if (!src) return null;

  // Si es una URL externa (no es R2 ni r2.dev), la devolvemos tal cual
  if (src.startsWith('http') && !src.includes('r2.dev')) {
    return (
      <img
        src={src}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        {...rest}
      />
    );
  }

  // Si ya es una URL de R2, extraemos solo el path
  let cleanPath = src;
  if (src.startsWith('http')) {
    const urlObj = new URL(src);
    cleanPath = urlObj.pathname.replace(/^\//, '');
  } else {
    cleanPath = src.replace(/^\//, '');
  }

  const finalSrc = media(cleanPath);

  return (
    <img
      src={finalSrc}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      {...rest}
    />
  );
}

export default Img;
