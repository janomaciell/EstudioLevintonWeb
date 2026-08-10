import React, { forwardRef } from 'react';
import { media } from '../../config/media';

/**
 * Componente de imagen optimizado.
 * Sirve imágenes desde R2 (usando VITE_R2_URL) o desde /public en local.
 * Soporta forwardRef para animaciones GSAP.
 * NO usa cdn-cgi ni transformaciones de Cloudflare Edge.
 */
export const Img = forwardRef(function Img(
  { src, width, height, alt, sizes, priority = false, ...rest },
  ref
) {
  if (!src) return null;

  // URL externa (no R2) → devolver tal cual
  if (src.startsWith('http') && !src.includes('r2.dev')) {
    return (
      <img
        ref={ref}
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

  // URL de R2 completa → extraer solo el path
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
      ref={ref}
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
});

export default Img;
