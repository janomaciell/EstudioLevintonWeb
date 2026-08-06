import React from 'react';
import { R2_URL } from '../../config/media';

const CDN_BASE = 'https://img.estudiolevinton.com';
const CDN_PREFIX = `${CDN_BASE}/cdn-cgi/image`;
const ANCHOS = [400, 800, 1200, 1920];

export function Img({ src, width, height, alt, sizes, priority = false, ...rest }) {
  if (!src) return null;

  // Si no hay R2_URL configurado (desarrollo local sin R2), servimos la imagen local sin transformaciones de Cloudflare
  const useLocal = !R2_URL;

  let cleanPath = src;
  let isCdnEligible = false;

  if (cleanPath.startsWith('http')) {
    if (cleanPath.includes('estudiolevinton.com') || cleanPath.includes('r2.dev')) {
      const urlObj = new URL(cleanPath);
      cleanPath = urlObj.pathname.replace(/^\//, '');
      isCdnEligible = true;
    }
  } else {
    cleanPath = cleanPath.replace(/^\//, '');
    isCdnEligible = true;
  }

  if (isCdnEligible && !useLocal) {
    const buildUrl = (w) => `${CDN_PREFIX}/width=${w},format=auto,quality=80/${cleanPath}`;
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

  // Fallback para local o externas
  const finalSrc = src.startsWith('http') ? src : `/${cleanPath}`;
  return (
    <img
      src={finalSrc}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...rest}
    />
  );
}

export default Img;
