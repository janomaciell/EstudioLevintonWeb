import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ALL_PROJECTS } from '../../data/projects'
import SEO from '../../components/SEO/SEO'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../data/translations'
import './Proyectos.css'

gsap.registerPlugin(ScrollTrigger)

export default function Proyectos() {
  const [country, setCountry] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortM2, setSortM2] = useState(false)

  const { lang } = useLanguage()
  const t = translations[lang].proyectos

  // Compute filtered + sorted list
  const filtered = ALL_PROJECTS
    .filter(p => {
      const cm = country === 'all' || p.country === country
      const sm = statusFilter === 'all' || p.label === statusFilter
      return cm && sm
    })
    .sort((a, b) => {
      if (!sortM2) return 0
      return parseInt(b.m2) - parseInt(a.m2)
    })

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = document.querySelectorAll('.ph-line-inner')
      gsap.to(lines, { y: '0%', stagger: 0.1, duration: 1.0, ease: 'power4.out', delay: 0.2 })
      const sub = document.querySelector('.ph-sub')
      if (sub) gsap.to(sub, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 })
      const bg = document.querySelector('.page-hero .page-hero__bg')
      if (bg) gsap.to(bg, {
        yPercent: 22, ease: 'none',
        scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true }
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <main className="pj-page">
      <SEO
        title={t.seoTitle}
        description={t.seoDesc}
        url="https://estudiolevinton.com/proyectos"
      />
      <div className="page-hero">
        <div className="page-hero__bg">
          <img src="/img/portadas/Carpinchos.png" alt="Obra Estudio Levinton" />
          <div className="page-hero__overlay" />
        </div>
        <div className="page-hero__content">
          <span className="label" style={{ marginBottom: '20px', display: 'block' }}>{t.heroLabel}</span>
          <h1 className="pj-hero-title">
            <span className="ph-line"><span className="ph-line-inner">{t.heroLine1}</span></span>
            <span className="ph-line"><span className="ph-line-inner">{t.heroLine2}</span></span>
          </h1>
          <p className="ph-sub" style={{ fontSize: '1.3rem', lineHeight: '1.5' }}>
            {t.heroSub}
          </p>
        </div>
      </div>

      <section className="pj-body">
        {/* FILTER BAR */}
        <div className="pj-filterbar container">
          <div className="pj-filterbar__left">
            <span className="pj-filterbar__label">{t.filterLabel}</span>
            {[
              { key: 'all',       label: t.filterAll },
              { key: 'Argentina', label: 'Argentina' },
              { key: 'Uruguay',   label: 'Uruguay' },
            ].map(c => (
              <button
                key={c.key}
                className={`pj-filter${country === c.key ? ' is-active' : ''}`}
                onClick={() => setCountry(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="pj-filterbar__right">
            {[
              { key: 'all',           label: t.filterAll  },
              { key: 'En Desarrollo', label: t.filterDev  },
              { key: 'Obra Terminada',label: t.filterDone },
            ].map(s => (
              <button
                key={s.key}
                className={`pj-filter${statusFilter === s.key ? ' is-active' : ''}`}
                onClick={() => setStatusFilter(s.key)}
              >
                {s.label}
              </button>
            ))}
            <button
              className={`pj-filter pj-filter--m2${sortM2 ? ' is-active' : ''}`}
              onClick={() => setSortM2(v => !v)}
              title={t.filterM2Title}
            >
              {t.filterM2}
            </button>
          </div>
        </div>

        {/* GRID */}
        {country === 'Uruguay' && filtered.length === 0 ? (
          <div className="pj-coming-soon">
            <div className="pj-coming-soon__inner">
              <span className="pj-coming-soon__flag">🇺🇾</span>
              <h2 className="pj-coming-soon__title">{t.comingSoonTitle}</h2>
              <p className="pj-coming-soon__text">
                {t.comingSoonText.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </p>
            </div>
          </div>
        ) : (
          <div className="pj-grid">
            {filtered.map((p, i) => (
              <Link to={`/proyectos/${p.slug}`} key={`${p.title}-${i}`} className="pj-grid__item">
                <img src={p.img} alt={p.title} loading="lazy" />
                <div className="pj-grid__hover">
                  <span className="pj-grid__label">{p.label}</span>
                  <h3 className="pj-grid__title">{p.title}</h3>
                  <div className="pj-grid__meta">
                    <span>{p.loc}</span>
                    <span>{p.m2} m²</span>
                    <span>{p.year}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}