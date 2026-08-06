import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { media } from '../../config/media'
import { SITE_URL } from '../../config/site'
import SEO from '../../components/SEO/SEO'
import { buildBreadcrumbSchema } from '../../components/SEO/Schema'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../data/translations'
import Img from '../../components/Img/Img'
import './Nosotros.css'

gsap.registerPlugin(ScrollTrigger)

function runPageAnimations() {
  const ctx = gsap.context(() => {
    // hero reveal
    const lines = document.querySelectorAll('.ph-line-inner')
    if (lines.length) gsap.to(lines, { y: '0%', stagger: 0.1, duration: 1.0, ease: 'power4.out', delay: 0.2 })
    const sub = document.querySelector('.ph-sub')
    if (sub) gsap.to(sub, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 })
    const bg = document.querySelector('.page-hero .page-hero__bg')
    if (bg) gsap.to(bg, {
      yPercent: 22, ease: 'none',
      scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true }
    })

    // img reveals
    gsap.utils.toArray('.img-reveal').forEach(wrap => {
      gsap.fromTo(wrap,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut',
          scrollTrigger: { trigger: wrap, start: 'top 85%' } }
      )
      const img = wrap.querySelector('img')
      if (img) gsap.from(img, { scale: 1.1, duration: 1.6, ease: 'power4.out',
        scrollTrigger: { trigger: wrap, start: 'top 85%' } })
    })

    // word reveals
    gsap.utils.toArray('.word-reveal').forEach(el => {
      gsap.fromTo(el, { y: '105%', opacity: 0 }, {
        y: '0%', opacity: 1, duration: 0.9, ease: 'power4.out',
        scrollTrigger: { trigger: el.closest('.word-line') || el, start: 'top 88%' }
      })
    })

    // timeline
    gsap.utils.toArray('.nos-t-item').forEach(item => {
      gsap.fromTo(item, { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%' }
      })
    })

    // scrub horizontal
    gsap.utils.toArray('.scrub-x').forEach(el => {
      const dir = el.dataset.dir === 'right' ? 60 : -60
      gsap.fromTo(el, { x: -dir }, {
        x: dir, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true }
      })
    })
  })
  return ctx
}

export default function Nosotros() {
  const { lang } = useLanguage()
  const t = translations[lang].nosotros

  useEffect(() => {
    const ctx = runPageAnimations()
    return () => ctx.revert()
  }, [lang])

  const breadcrumbsSchema = buildBreadcrumbSchema([
    { name: lang === 'en' ? 'Home' : 'Inicio', url: `${SITE_URL}/` },
    { name: lang === 'en' ? 'About Us' : 'Nosotros', url: `${SITE_URL}/nosotros` }
  ]);

  return (
    <main className="nos-page">
      <SEO
        title={t.seoTitle}
        description={t.seoDesc}
        url="/nosotros"
        schemaType="Organization"
        schemaData={breadcrumbsSchema}
        lang={lang}
      />

      <div className="page-hero">
        <div className="page-hero__bg">
          <Img src={media('img/portadas/Azurra.png')} alt="Estudio de Arquitectura en Zona Norte con 40 años de Trayectoria — Estudio Levinton" priority={true} sizes="100vw" width={1448} height={1086} />
          <div className="page-hero__overlay" />
        </div>
        <div className="page-hero__content">
          <span className="label" style={{ marginBottom: '20px', display: 'block' }}>{t.heroLabel}</span>
          <h1 className="nos-hero-title">
            <span className="ph-line"><span className="ph-line-inner">{t.heroLine1}</span></span>
            <span className="ph-line"><span className="ph-line-inner">{t.heroLine2}</span></span>
          </h1>
          <p className="ph-sub">{t.heroSub}</p>
        </div>
      </div>

      {/* INTRO BIG WORDS */}
      <section className="nos-intro">
        <div className="nos-intro__inner">
          <div className="nos-intro__words">
            {t.introWords.map((w, i) => (
              <div key={i} className="word-line">
                <span className="word-reveal nos-intro__word">{w}</span>
              </div>
            ))}
          </div>
          <div className="nos-intro__body">
            <p>{t.introP1}</p>
            <p>{t.introP2}</p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="nos-team">
        <div className="nos-team__label container">
          <span className="label">{t.teamLabel}</span>
          <div className="scrub-x nos-team__bg-text" data-dir="left">{t.bgText}</div>
        </div>

        <div className="nos-team__grid container">
          <div className="nos-team__member">
            <div className="img-reveal nos-team__img">
              <Img src={media('img/Obras-estudio-Levinton/sergio.JPG')} alt="Arq. Sergio Levinton - Fundador de Estudio de de Arquitectura en Zona Norte" sizes="(max-width: 640px) 50vw, 300px" width={3872} height={2592} />
            </div>
            <div className="nos-team__info">
              <span className="label" style={{ marginBottom: '12px', display: 'block' }}>{t.sergioRole}</span>
              <h2 className="nos-team__name word-reveal">
                {t.sergioName.split('\n').map((line, i) => (
                  <span key={i} style={{ display: 'block' }}>{line}</span>
                ))}
              </h2>
              <p className="nos-team__bio">{t.sergioBio1}</p>
              <p className="nos-team__bio">{t.sergioBio2}</p>
              <a href="tel:+5491158098681" className="nos-team__contact">+54 9 11 5809 8681</a>
            </div>
          </div>

          <div className="nos-team__member">
            <div className="img-reveal nos-team__img">
              <Img src={media('img/Obras-estudio-Levinton/adriana.JPG')} alt="Arq. Adriana Napoleone - Directora de Proyectos de Diseño en Zona Norte" sizes="(max-width: 640px) 50vw, 300px" width={943} height={953} />
            </div>
            <div className="nos-team__info">
              <span className="label" style={{ marginBottom: '12px', display: 'block' }}>{t.adrianaRole}</span>
              <h2 className="nos-team__name word-reveal">
                {t.adrianaName.split('\n').map((line, i) => (
                  <span key={i} style={{ display: 'block' }}>{line}</span>
                ))}
              </h2>
              <p className="nos-team__bio">{t.adrianaBio1}</p>
              <p className="nos-team__bio">{t.adrianaBio2}</p>
              <a href="tel:+5491144227758" className="nos-team__contact">+54 9 11 4422 7758</a>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="nos-timeline">
        <div className="container">
          <div className="word-line" style={{ overflow: 'hidden', marginBottom: '60px' }}>
            <span className="word-reveal nos-tl-title">{t.timelineTitle}</span>
          </div>
          {t.timeline.map((item, i) => (
            <div key={i} className="nos-t-item">
              <span className="nos-t-year">{item.year}</span>
              <div className="nos-t-line" />
              <div>
                <span className="nos-t-event">{item.event}</span>
                {item.desc && <p className="nos-t-desc">{item.desc}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}