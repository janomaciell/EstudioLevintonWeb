import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProjectBySlug } from '../../data/projects';
import './DetallesProyectos.css';

gsap.registerPlugin(ScrollTrigger);

export default function DetallesProyectos() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const proj = getProjectBySlug(slug);
    setProject(proj);
    
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!project) return;

    const ctx = gsap.context(() => {
      // Hero reveal with delay for loader
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

      // Stats reveal
      gsap.utils.toArray('.dp-stat').forEach((stat, i) => {
        gsap.fromTo(stat, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          delay: 0.5 + (i * 0.1)
        });
      });

      // Gallery reveal
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
        <div className="container">
          <h2>Proyecto no encontrado</h2>
          <Link to="/proyectos" className="dp-btn-back">Volver a Proyectos</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="dp-page">
      <button 
        onClick={() => {
          console.log('Back button clicked');
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate('/proyectos');
          }
        }} 
        className="dp-nav-back" 
        aria-label="Volver atrás"
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {/* ─── HERO SECTION ─── */}
      <div className="dp-hero">
        <div className="dp-hero__bg">
          <img src={project.img} alt={project.title} />
          <div className="dp-hero__overlay" />
        </div>
        <div className="dp-hero__content container">
          <span className="label" style={{ marginBottom: '20px', display: 'block' }}>{project.label}</span>
          <h1 className="dp-hero-title">
            <span className="dp-line"><span className="dp-line-inner">{project.title.toUpperCase()}</span></span>
          </h1>
          <p className="dp-sub" style={{ fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {project.loc} · {project.year}
          </p>
        </div>
      </div>

      {/* ─── SPECS & DESCRIPTION SECTION ─── */}
      <section className="dp-info container">
        <div className="dp-info__left">
          <div className="word-line"><span className="word-reveal dp-info__title">EL</span></div>
          <div className="word-line"><span className="word-reveal dp-info__title dp-info__title--accent">PROYECTO</span></div>
          <p className="dp-info__desc">{project.description}</p>
        </div>
        
        <div className="dp-info__right">
          <div className="dp-stats-grid">
            <div className="dp-stat">
              <span className="dp-stat__label">Superficie</span>
              <span className="dp-stat__val">{project.specs.lote}</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">Metros Construidos</span>
              <span className="dp-stat__val">{project.m2} m²</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">Habitaciones</span>
              <span className="dp-stat__val">{project.specs.habitaciones}</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">Baños</span>
              <span className="dp-stat__val">{project.specs.banos}</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">Cocheras</span>
              <span className="dp-stat__val">{project.specs.cocheras}</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">Plantas</span>
              <span className="dp-stat__val">{project.specs.plantas}</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">Piscina</span>
              <span className="dp-stat__val">{project.specs.piscina}</span>
            </div>
            <div className="dp-stat">
              <span className="dp-stat__label">Año</span>
              <span className="dp-stat__val">{project.year}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GALLERY SECTION ─── */}
      <section className="dp-gallery">
        <div className="container">
          <h2 className="dp-section-title">Galería</h2>
        </div>
        <div className="dp-gallery__grid">
          {project.gallery.map((imgSrc, i) => (
            <div key={i} className="dp-gallery__item">
              <img src={imgSrc} alt={`${project.title} - imagen ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </section>


    </main>
  );
}
