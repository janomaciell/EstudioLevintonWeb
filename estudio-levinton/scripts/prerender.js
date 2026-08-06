import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const distDir = path.resolve(rootDir, 'dist');
const serverDir = path.resolve(rootDir, 'dist-server');
const templateHtmlPath = path.resolve(distDir, 'index.html');

const PROJECT_SLUGS = [
  'azzurra-tortugas',
  'carpinchos-nordelta',
  'marinas-puertos-escobar',
  'sil-cabecera-laguna',
  'sil-rio',
  'sil-laguna-1',
  'sil-laguna-2',
  'sil-interno',
  'santa-catalina-laguna',
  'santa-catalina-rio',
  'vistas-puertos-escobar',
  'talar-de-pacheco',
  'reforma-san-isidro-labrador',
  'casa-sustentable-sil',
  'santa-catalina-techo-verde'
];

const STATIC_ROUTES = [
  '/',
  '/proyectos',
  '/servicios',
  '/nosotros',
  '/contacto',
  '/404'
];

const ALL_ROUTES = [
  ...STATIC_ROUTES,
  ...PROJECT_SLUGS.map(s => `/proyectos/${s}`)
];

async function prerender() {
  console.log('🚀 Starting SSG Prerendering for Estudio Levinton...');

  if (!fs.existsSync(templateHtmlPath)) {
    throw new Error('dist/index.html build artifact not found!');
  }

  const templateHtml = fs.readFileSync(templateHtmlPath, 'utf-8');

  const serverEntryPath = path.resolve(serverDir, 'entry-server.js');
  if (!fs.existsSync(serverEntryPath)) {
    throw new Error(`dist-server/entry-server.js not found at ${serverEntryPath}`);
  }

  const { render } = await import(pathToFileURL(serverEntryPath).href);

  for (const route of ALL_ROUTES) {
    console.log(`  └─ Prerendering ${route}...`);

    const { html: appHtml, helmet } = render(route);

    let routeHead = '';
    let htmlAttrs = '';

    if (helmet) {
      const titleStr = helmet.title ? helmet.title.toString() : '';
      const metaStr = helmet.meta ? helmet.meta.toString() : '';
      const linkStr = helmet.link ? helmet.link.toString() : '';
      const scriptStr = helmet.script ? helmet.script.toString() : '';
      htmlAttrs = helmet.htmlAttributes ? helmet.htmlAttributes.toString() : '';

      routeHead = `${titleStr}\n${metaStr}\n${linkStr}\n${scriptStr}`;
    }

    let finalHtml = templateHtml;

    // Inject HTML attributes (e.g. lang="es")
    if (htmlAttrs) {
      finalHtml = finalHtml.replace('<html lang="es">', `<html ${htmlAttrs}>`);
    }

    // Replace primary meta tags & title in template head with route-specific head tags
    if (routeHead) {
      if (finalHtml.includes('<!--app-head-->')) {
        finalHtml = finalHtml.replace('<!--app-head-->', routeHead);
      } else {
        finalHtml = finalHtml.replace('</head>', `${routeHead}\n</head>`);
      }
    }

    // Inject rendered app HTML into #root
    finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    // Determine target output file path
    let filePath;
    if (route === '/') {
      filePath = path.resolve(distDir, 'index.html');
    } else if (route === '/404') {
      filePath = path.resolve(distDir, '404.html');
    } else {
      const subDir = path.resolve(distDir, route.substring(1));
      fs.mkdirSync(subDir, { recursive: true });
      filePath = path.resolve(subDir, 'index.html');
    }

    fs.writeFileSync(filePath, finalHtml, 'utf-8');
  }

  // Generate dynamic sitemap.xml
  generateSitemap();

  // Generate robots.txt
  generateRobots();

  // Clean up server directory
  if (fs.existsSync(serverDir)) {
    fs.rmSync(serverDir, { recursive: true, force: true });
  }

  console.log('✅ SSG Prerendering successfully completed!');
}

function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  const baseUrl = 'https://www.estudiolevinton.com';

  const staticEntries = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/proyectos', priority: '0.9', changefreq: 'weekly' },
    { url: '/servicios', priority: '0.8', changefreq: 'monthly' },
    { url: '/nosotros', priority: '0.8', changefreq: 'monthly' },
    { url: '/contacto', priority: '0.8', changefreq: 'monthly' },
  ];

  const projectEntries = PROJECT_SLUGS.map(slug => ({
    url: `/proyectos/${slug}`,
    priority: '0.7',
    changefreq: 'monthly'
  }));

  const allEntries = [...staticEntries, ...projectEntries];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.map(e => `  <url>
    <loc>${baseUrl}${e.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), xml, 'utf-8');
  // Copy to public as well for reference
  fs.writeFileSync(path.resolve(rootDir, 'public', 'sitemap.xml'), xml, 'utf-8');
  console.log('  └─ Generated updated sitemap.xml with 20 routes');
}

function generateRobots() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://www.estudiolevinton.com/sitemap.xml
`;

  fs.writeFileSync(path.resolve(distDir, 'robots.txt'), robots, 'utf-8');
  fs.writeFileSync(path.resolve(rootDir, 'public', 'robots.txt'), robots, 'utf-8');
  console.log('  └─ Generated updated robots.txt');
}

prerender().catch(err => {
  console.error('❌ Error during prerendering:', err);
  process.exit(1);
});
