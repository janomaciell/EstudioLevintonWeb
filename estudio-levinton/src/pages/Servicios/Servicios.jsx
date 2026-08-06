import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { media } from '../../config/media'
import SEO from '../../components/SEO/SEO'
import { buildServicesSchema, buildBreadcrumbSchema } from '../../components/SEO/Schema'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../data/translations'
import './Servicios.css'

gsap.registerPlugin(ScrollTrigger)

const IMGS = [
  media('img/portadas/Azurra.png'),
  media('img/portadas/SIL 645.png'),
  media('img/portadas/Sustentabilidad 02.png'),
  media('img/portadas/Marinas.png'),
  media('img/portadas/SIL 71.png'),
]

export default function Servicios() {
  const { lang } = useLanguage()
  const t = translations[lang].servicios

  const SERVICES = t.services.map((s, i) => ({ ...s, img: IMGS[i] }))
  const PROCESO  = t.proceso

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

      gsap.utils.toArray('.word-reveal').forEach(el => {
        gsap.fromTo(el, { y: '105%', opacity: 0 }, {
          y: '0%', opacity: 1, duration: 0.9, ease: 'power4.out',
          scrollTrigger: { trigger: el.closest('.word-line') || el, start: 'top 88%' }
        })
      })

      gsap.utils.toArray('.sv-row').forEach(row => {
        const fades = row.querySelectorAll('.sv-row__fade')
        gsap.fromTo(fades,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 78%' } }
        )
      })

      gsap.utils.toArray('.scrub-x').forEach(el => {
        const dir = el.dataset.dir === 'right' ? -60 : 60
        gsap.fromTo(el, { x: -dir }, {
          x: dir, ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true }
        })
      })
    })
    return () => ctx.revert()
  }, [lang])

  const servicesSchema = buildServicesSchema();
  const breadcrumbsSchema = buildBreadcrumbSchema([
    { name: lang === 'en' ? 'Home' : 'Inicio', url: 'https://estudiolevinton.com/' },
    { name: lang === 'en' ? 'Services' : 'Servicios', url: 'https://estudiolevinton.com/servicios' }
  ]);
  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [servicesSchema, breadcrumbsSchema]
  };

  return (
    <main className="sv-page">
      <SEO
        title={t.seoTitle}
        description={t.seoDesc}
        url="https://estudiolevinton.com/servicios"
        schemaData={combinedSchema}
        lang={lang}
      />

      <div className="page-hero">
        <div className="page-hero__bg">
          <img src={media('img/portadas/Sustentabilidad 01.png')} alt="Servicios de Arquitectura y Construcción de Residencias por Estudio Levinton" fetchPriority="high" decoding="async" />
          <div className="page-hero__overlay" />
        </div>
        <div className="page-hero__content">
          <span className="label" style={{ marginBottom: '20px', display: 'block' }}>{t.heroLabel}</span>
          <h1 className="sv-hero-title">
            <span className="ph-line"><span className="ph-line-inner">{t.heroLine1}</span></span>
            <span className="ph-line"><span className="ph-line-inner">{t.heroLine2}</span></span>
          </h1>
          <p className="ph-sub">{t.heroSub}</p>
        </div>
      </div>

      {/* INTRO WORDS */}
      <section className="sv-intro">
        <div className="container sv-intro__inner">
          <div className="sv-intro__words">
            {t.introWords.map((w, i) => (
              <div key={i} className="word-line">
                <span className="word-reveal sv-intro__word">{w}</span>
              </div>
            ))}
          </div>
          <p className="sv-intro__body">{t.introBody}</p>
        </div>
      </section>

      {/* SERVICE ROWS */}
      <section className="sv-list">
        {SERVICES.map((s, i) => (
          <div key={i} className={`sv-row${i % 2 !== 0 ? ' sv-row--reverse' : ''}`}>
            <div className="sv-row__img">
              <img src={s.img} alt={s.title} loading="lazy" />
            </div>
            <div className="sv-row__text">
              <span className="sv-row__num sv-row__fade">{s.num}</span>
              <h2 className="sv-row__title sv-row__fade">{s.title.split('\n').map((line, j) => (
                <span key={j} style={{ display: 'block' }}>{line}</span>
              ))}</h2>
              <p className="sv-row__desc sv-row__fade">{s.desc}</p>
              {s.detail && <p className="sv-row__detail sv-row__fade">{s.detail}</p>}
              <Link to="/contacto" className="sv-row__link sv-row__fade">{t.consultarLink}</Link>
            </div>
          </div>
        ))}
      </section>

      {/* PROCESO */}
      <section className="sv-proceso">
        <div className="container">
          <div className="sv-proceso__header">
            <div className="scrub-x sv-proceso__bg" data-dir="left">{t.bgText}</div>
            <div className="word-line" style={{ position: 'relative', zIndex: 2 }}>
              <span className="word-reveal sv-proceso__title">{t.procesoTitle}</span>
            </div>
          </div>
          <div className="sv-proceso__grid">
            {PROCESO.map((s, i) => (
              <div key={i} className="sv-step">
                <span className="sv-step__num">{s.step}</span>
                <span className="sv-step__dur">{s.dur}</span>
                <h3 className="sv-step__title">{s.title}</h3>
                <p className="sv-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}