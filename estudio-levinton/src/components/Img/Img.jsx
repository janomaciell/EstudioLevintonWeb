import React from 'react';
import { R2_URL, media } from '../../config/media';

const ANCHOS = [400, 800, 1200, 1920];
const USE_CDN_TRANSFORMS = import.meta.env.VITE_USE_CDN_TRANSFORMS === 'true';

export function Img({ src, width, height, alt, sizes, priority = false, ...rest }) {
  if (!src) return null;

  let cleanPath = src;
  let isCdnEligible = false;

  if (cleanPath.startsWith('http')) {
    if (cleanPath.includes('estudiolevinton.com') || cleanPath.includes('r2.dev')) {
      const urlObj = new URL(cleanPath);
      cleanPath = urlObj.pathname.replace(/^\//, '');
      isCdnEligible = true;
    } else {
      // Imagen externa de otro dominio
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
  } else {
    cleanPath = cleanPath.replace(/^\//, '');
    isCdnEligible = true;
  }

  // Si las transformaciones de Cloudflare en el borde están explícitamente activadas
  if (isCdnEligible && USE_CDN_TRANSFORMS && R2_URL) {
    const cdnPrefix = `${R2_URL.replace(/\/$/, '')}/cdn-cgi/image`;
    const buildUrl = (w) => `${cdnPrefix}/width=${w},format=auto,quality=80/${cleanPath}`;
    return (
      <img
        src={buildUrl(1200)}
        srcSet={ANCHOS.map((w) => `${buildUrl(w)} ${w}w`).join(', ')}
        sizes={sizes}
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

  // Modo directo desde R2 o local
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

