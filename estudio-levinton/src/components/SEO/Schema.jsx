import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../../config/site';

/**
 * Component to inject structured data (JSON-LD) into the document head
 */
export default function Schema({ type, data }) {
  if (!type && !data) return null;

  let schemaData = null;

  if (data) {
    schemaData = data;
  } else if (type === 'Organization') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      'additionalType': 'https://www.wikidata.org/wiki/Q4110240',
      '@id': `${SITE_URL}/#organization`,
      name: 'Estudio Levinton',
      legalName: 'Estudio Levinton — Arquitectos',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo-estudio-levinton.png`,
      image: `${SITE_URL}/logo-estudio-levinton.png`,
      description: 'Estudio de Arquitectura especializado en viviendas unifamiliares en barrios cerrados de Zona Norte (Nordelta, Puertos, EIDICO, Tortugas). Más de 40 años de trayectoria y 300 obras construidas.',
      founders: [
        {
          '@type': 'Person',
          name: 'Arq. Sergio Levinton',
          jobTitle: 'Socio Fundador / Arquitecto',
          telephone: '+5491158098681',
          email: 'levintonnapoleone@gmail.com'
        },
        {
          '@type': 'Person',
          name: 'Arq. Adriana Napoleone',
          jobTitle: 'Socio Fundadora / Arquitecta',
          telephone: '+5491144227758',
          email: 'adrianapoleone@gmail.com'
        }
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Buenos Aires',
        addressRegion: 'Buenos Aires',
        addressCountry: 'AR',
        streetAddress: 'Zona Norte, Buenos Aires'
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+5491158098681',
          contactType: 'customer service',
          email: 'levintonnapoleone@gmail.com',
          availableLanguage: ['Spanish', 'English']
        }
      ],
      sameAs: [
        'https://instagram.com/estudio_levinton'
      ],
      priceRange: '$$$$'
    };
  } else if (type === 'LocalBusiness') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      name: 'Estudio Levinton — Arquitectos',
      image: `${SITE_URL}/logo-estudio-levinton.png`,
      url: `${SITE_URL}/`,
      telephone: '+5491158098681',
      priceRange: '$$$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Buenos Aires',
        addressRegion: 'Buenos Aires',
        addressCountry: 'AR',
        streetAddress: 'Zona Norte, Buenos Aires'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -34.425,
        longitude: -58.579
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }
    };
  }

  if (!schemaData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}

/**
 * Helper to build BreadcrumbList schema
 */
export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Helper to build CreativeWork / SingleFamilyResidence schema for project details
 */
export function buildProjectSchema(project) {
  if (!project) return null;
  const fullUrl = `${SITE_URL}/proyectos/${project.slug}`;
  const imageUrl = project.img?.startsWith('http')
    ? project.img
    : `${SITE_URL}${project.img?.startsWith('/') ? '' : '/'}${project.img || ''}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'SingleFamilyResidence',
    name: project.title,
    description: project.description,
    url: fullUrl,
    image: imageUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: project.loc || 'Buenos Aires',
      addressCountry: 'AR'
    },
    floorSize: project.m2 ? {
      '@type': 'QuantitativeValue',
      value: project.m2,
      unitCode: 'MTK'
    } : undefined,
    numberOfRooms: project.specs?.habitaciones ? Number(project.specs.habitaciones) : undefined,
    numberOfBathroomsTotal: project.specs?.banos ? Number(project.specs.banos) : undefined,
    creator: {
      '@type': 'ProfessionalService',
      'additionalType': 'https://www.wikidata.org/wiki/Q4110240',
      name: 'Estudio Levinton',
      url: `${SITE_URL}/`
    }
  };
}

/**
 * Helper to build ArchitecturalService schema for Servicios page
 */
export function buildServicesSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Architectural Design and Construction',
    provider: {
      '@type': 'ProfessionalService',
      'additionalType': 'https://www.wikidata.org/wiki/Q4110240',
      name: 'Estudio Levinton',
      url: `${SITE_URL}/`
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Zona Norte, Gran Buenos Aires'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de Arquitectura',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Proyecto y Dirección de Obra',
            description: 'Diseño arquitectónico integral y supervisión técnica en obras de alta gama.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Construcción Llave en Mano',
            description: 'Ejecución total de la obra con máximo control de calidad, tiempos y presupuesto.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Diseño Sustentable y Eficiencia Energética',
            description: 'Integración de tecnologías sostenibles, aislamiento térmico y bombas de calor.'
          }
        }
      ]
    }
  };
}
