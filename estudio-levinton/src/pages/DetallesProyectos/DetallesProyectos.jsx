import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProjectBySlug } from '../../data/projects';
import SEO from '../../components/SEO/SEO';
import { buildProjectSchema, buildBreadcrumbSchema } from '../../components/SEO/Schema';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../data/translations';
import './DetallesProyectos.css';

gsap.registerPlugin(ScrollTrigger);

const translateLocation = (loc, lang) => {
  if (!loc) return '';
  if (lang === 'en') {
    return loc
      .replace(/Cabecera laguna/g, 'Lagoon front')
      .replace(/Río/g, 'River')
      .replace(/Laguna/g, 'Lagoon')
      .replace(/Lote interno/g, 'Internal lot');
  }
  return loc;
};

const translatePiscina = (val, lang) => {
  if (!val) return '';
  if (lang === 'en') {
    if (val === 'Sí') return 'Yes';
    if (val === 'Sí, borde infinito') return 'Yes, infinity edge';
    if (val === 'No') return 'No';
  }
  return val;
};

export default function DetallesProyectos() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = getProjectBySlug(slug);

  const { lang } = useLanguage();
  const t = translations[lang].detalles;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [slug]);

  useEffect(() => {
    if (!project) return;

    const ctx = gsap.context(() => {
      const lines = document.querySelectorAll('.dp-line-inner');
      gsap.fromTo(lines,
        { y: '110%' },
        { y: '0%', stagger: 0.1, duration: 1.0, ease: 'power4.out', delay: 0.4 }
      );

      const sub = document.querySelector('.dp-sub');
      if (sub) gsap.fromTo(sub,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 }
      );

      const bg = document.querySelector('.dp-hero__bg');
      if (bg) gsap.to(bg, {
        yPercent: 22, ease: 'none',
        scrollTrigger: { trigger: '.dp-hero', start: 'top top', end: 'bottom top', scrub: true }
      });

      gsap.utils.toArray('.dp-stat').forEach((stat, i) => {
        gsap.fromTo(stat, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          delay: 0.5 + (i * 0.1)
        });
      });

      gsap.utils.toArray('.dp-gallery__item').forEach(item => {
        gsap.fromTo(item,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 85%' }
          }
        );
      });
    });

    return () => ctx.revert();
  }, [project]);

  if (!project) {
    return (
      <main className="dp-page dp-not-found">
        <SEO title="404 - Obra no encontrada | Estudio Levinton" noindex={true} />
        <div className="container">
          <h2>{t.notFound}</h2>
          <Link to="/proyectos" className="dp-btn-back">{t.backBtn}</Link>
        </div>
      </main>
    );
  }

  const projectSchema = buildProjectSchema(project);
  const breadcrumbsSchema = buildBreadcrumbSchema([
    { name: lang === 'en' ? 'Home' : 'Inicio', url: 'https://estudiolevinton.com/' },
    { name: lang === 'en' ? 'Projects' : 'Obras', url: 'https://estudiolevinton.com/proyectos' },
    { name: project.title, url: `https://estudiolevinton.com/proyectos/${slug}` }
  ]);
  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [projectSchema, breadcrumbsSchema]
  };

  return (
    <main className="dp-page">
      <SEO
        title={`${project.title} | Estudio Levinton — ${lang === 'en' ? 'Architects' : 'Arquitectos'}`}
        description={(lang === 'en' && project.descriptionEn) ? project.descriptionEn : (project.description || (lang === 'en' ? `Project ${project.title} in ${translateLocation(project.loc, 'en')}. Over 300 built projects in gated communities.` : `Proyecto ${project.title} en ${project.loc}. Más de 300 obras construidas en barrios cerrados.`))}
        url={`https://estudiolevinton.com/proyectos/${slug}`}
        image={project.img}
        type="article"
        schemaData={combinedSchema}
        lang={lang}
      />
      <button
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate('/proyectos');
          }
        }}
        className="dp-nav-back"
        aria-label={t.backAria}
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* HERO */}
      <div className="dp-hero">
        <div className="dp-hero__bg">
          <img src={project.img} alt={`Obra de arquitectura ${project.title} en ${project.loc} - Estudio Levinton`} fetchPriority="high" decoding="async" />
          <div className="dp-hero__overlay" />
        </div>
        <div className="dp-hero__content container">
          <span className="label" style={{ marginBottom: '20px', display: 'block' }}>
            {project.label === 'Obra Terminada' ? translations[lang].proyectos.filterDone : project.label === 'En Desarrollo' ? translations[lang].proyectos.filterDev : project.label}
          </span>
          <h1 className="dp-hero-title">
            <span className="dp-line"><span className="dp-line-inner">{project.title.toUpperCase()}</span></span>
          </h1>
          <p className="dp-sub" style={{ fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {translateLocation(project.loc, lang)} · {project.year}
          </p>
        </div>
      </div>

      {/* SPECS */}
      <section className="dp-info container">
        <div className="dp-info__left">
          <div className="word-line"><span className="word-reveal dp-info__title">{t.elProyecto1}</span></div>
          <div className="word-line"><span className="word-reveal dp-info__title dp-info__title--accent">{t.elProyecto2}</span></div>
          <p className="dp-info__desc">{lang === 'en' && project.descriptionEn ? project.descriptionEn : project.description}</p>
        </div>

        <div className="dp-info__right">
          <div className="dp-stats-grid">
            <div className="dp-stat">
              <span className="dp-stat__label">{t.labelSuperficie}</span>
              <span className="dp-stat__val">{project.specs.lote}</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">{t.labelM2}</span>
              <span className="dp-stat__val">{project.m2} m²</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">{t.labelHab}</span>
              <span className="dp-stat__val">{project.specs.habitaciones}</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">{t.labelBanos}</span>
              <span className="dp-stat__val">{project.specs.banos}</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">{t.labelCocheras}</span>
              <span className="dp-stat__val">{project.specs.cocheras}</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">{t.labelPlantas}</span>
              <span className="dp-stat__val">{project.specs.plantas}</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">{t.labelPiscina}</span>
              <span className="dp-stat__val">{translatePiscina(project.specs.piscina, lang)}</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">{t.labelAnio}</span>
              <span className="dp-stat__val">{project.year}</span>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="dp-gallery">
        <div className="container">
          <h2 className="dp-section-title">{t.galeria}</h2>
        </div>
        <div className="dp-gallery__grid">
          {project.gallery.map((imgSrc, i) => (
            <div key={i} className="dp-gallery__item">
              <img src={imgSrc} alt={t.imgAlt(project.title, i)} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
