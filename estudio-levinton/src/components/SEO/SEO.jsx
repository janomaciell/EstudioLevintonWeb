import { Helmet } from 'react-helmet-async';
import Schema from './Schema';

export default function SEO({
  title = 'Estudio Levinton — Arquitectos',
  description = 'Estudio Levinton — Arquitectos. 40 años de trayectoria. Más de 300 obras construidas en Nordelta, Puertos, EIDICO. Especialistas en casas en barrios cerrados de zona norte.',
  keywords = 'Arquitectos, Estudio de Arquitectura, Casas en barrios cerrados, Nordelta, Puertos, EIDICO, Diseño de casas, Zona Norte, Buenos Aires, Estudio Levinton',
  url = 'https://estudiolevinton.com/',
  image = 'https://estudiolevinton.com/logo-estudio-levinton.png',
  type = 'website',
  noindex = false,
  schemaData = null,
  schemaType = null,
  lang = 'es'
}) {
  const fullUrl = url.startsWith('http') ? url : `https://estudiolevinton.com${url.startsWith('/') ? '' : '/'}${url}`;
  const fullImage = image.startsWith('http') ? image : `https://estudiolevinton.com${image.startsWith('/') ? '' : '/'}${image}`;
  const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  return (
    <>
      <Helmet htmlAttributes={{ lang }}>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="author" content="Estudio Levinton" />
        <meta name="robots" content={robotsContent} />

        {/* Canonical */}
        <link rel="canonical" href={fullUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullImage} />
        <meta property="og:site_name" content="Estudio Levinton" />
        <meta property="og:locale" content={lang === 'en' ? 'en_US' : 'es_AR'} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={fullUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullImage} />
      </Helmet>

      {/* Structured Data (Schema.org) */}
      {(schemaType || schemaData) && (
        <Schema type={schemaType} data={schemaData} />
      )}
    </>
  );
}
