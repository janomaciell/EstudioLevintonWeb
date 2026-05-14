import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ALL_PROJECTS } from '../../data/projects'
import './Proyectos.css'

gsap.registerPlugin(ScrollTrigger)

export default function Proyectos() {
  const [country, setCountry] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [sortM2, setSortM2] = useState(false)

  // Compute filtered + sorted list
  const filtered = ALL_PROJECTS
    .filter(p => {
      const cm = country === 'Todos' || p.country === country
      const sm = statusFilter === 'Todos' || p.label === statusFilter
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
      <div className="page-hero">
        <div className="page-hero__bg">
          <img src="/img/portadas/Carpinchos.png" alt="Obra Estudio Levinton" />
          <div className="page-hero__overlay" />
        </div>
        <div className="page-hero__content">
          <span className="label" style={{ marginBottom: '20px', display: 'block' }}>Portfolio</span>
          <h1 className="pj-hero-title">
            <span className="ph-line"><span className="ph-line-inner">PROYECTOS</span></span>
            <span className="ph-line"><span className="ph-line-inner">SELECCIONADOS</span></span>
          </h1>
          <p className="ph-sub" style={{ fontSize: '1.3rem', lineHeight: '1.5' }}>
            300+ obras construidas en los barrios cerrados más exclusivos de Argentina.
          </p>
        </div>
      </div>

      <section className="pj-body">
        {/* ── FILTER BAR ── */}
        <div className="pj-filterbar container">
          {/* Izquierda: filtro por país */}
          <div className="pj-filterbar__left">
            <span className="pj-filterbar__label">Proyectos:</span>
            {['Todos', 'Argentina', 'Uruguay'].map(c => (
              <button
                key={c}
                className={`pj-filter${country === c ? ' is-active' : ''}`}
                onClick={() => setCountry(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Derecha: filtro por estado + ordenar m² */}
          <div className="pj-filterbar__right">
            {['Todos', 'En Desarrollo', 'Obra Terminada'].map(s => (
              <button
                key={s}
                className={`pj-filter${statusFilter === s ? ' is-active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
            <button
              className={`pj-filter pj-filter--m2${sortM2 ? ' is-active' : ''}`}
              onClick={() => setSortM2(v => !v)}
              title="Ordenar por superficie"
            >
              m²↓
            </button>
          </div>
        </div>

        {/* ── GRILLA ── */}
        {country === 'Uruguay' && filtered.length === 0 ? (
          <div className="pj-coming-soon">
            <div className="pj-coming-soon__inner">
              <span className="pj-coming-soon__flag">🇺🇾</span>
              <h2 className="pj-coming-soon__title">Uruguay</h2>
              <p className="pj-coming-soon__text">
                Próximamente.<br />Estamos expandiendo nuestra presencia al otro lado del río.
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