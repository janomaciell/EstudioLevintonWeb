import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { media } from '../../config/media'
import { SITE_URL } from '../../config/site'
import SEO from '../../components/SEO/SEO'
import { buildServicesSchema, buildBreadcrumbSchema } from '../../components/SEO/Schema'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../data/translations'
import Img from '../../components/Img/Img'
import './Servicios.css'

gsap.registerPlugin(ScrollTrigger)

const IMGS = [
  { src: media('img/portadas/Azurra.png'), width: 1448, height: 1086 },
  { src: media('img/portadas/casa-san-isidro-labrador-laguna.png'), width: 1536, height: 1024 },
  { src: media('img/portadas/sustentabilidad-02.png'), width: 1448, height: 1086 },
  { src: media('img/portadas/Marinas.png'), width: 1448, height: 1086 },
  { src: media('img/portadas/sil-71.png'), width: 1451, height: 1084 },
]

export default function Servicios() {
  const { lang } = useLanguage()
  const t = translations[lang].servicios

  const SERVICES = t.services.map((s, i) => ({ ...s, ...IMGS[i] }))
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
    { name: lang === 'en' ? 'Home' : 'Inicio', url: `${SITE_URL}/` },
    { name: lang === 'en' ? 'Services' : 'Servicios', url: `${SITE_URL}/servicios` }
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
        url="/servicios"
        schemaData={combinedSchema}
        lang={lang}
      />

      <div className="page-hero">
        <div className="page-hero__bg">
          <Img src={media('img/portadas/sustentabilidad-01.png')} alt="Servicios de Arquitectura y Construcción de Residencias en Zona Norte por Estudio Levinton" priority={true} sizes="100vw" width={1184} height={864} />
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
              <Img src={s.src} alt={`Servicio de ${s.title} en Zona Norte - Estudio Levinton`} sizes="(max-width: 768px) 100vw, 50vw" width={s.width} height={s.height} />
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