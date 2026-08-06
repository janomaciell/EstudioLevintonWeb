import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SEO from '../../components/SEO/SEO'
import { buildBreadcrumbSchema } from '../../components/SEO/Schema'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../data/translations'
import { media } from '../../config/media'
import { SITE_URL } from '../../config/site'
import './Contacto.css'

gsap.registerPlugin(ScrollTrigger)

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '', email: '', telefono: '', barrio: '', m2: '', mensaje: '', tipo: 'comitente',
  })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const formRef = useRef(null)

  const { lang } = useLanguage()
  const t = translations[lang].contacto

  // Init EmailJS once
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)
  }, [])

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current
      )
      setSent(true)
    } catch (err) {
      console.error('EmailJS error:', err)
      setError(lang === 'en'
        ? 'Something went wrong. Please try again or contact us directly.'
        : 'Hubo un error al enviar. Por favor intentá de nuevo o contactanos directamente.')
    } finally {
      setSending(false)
    }
  }

  // Reset tipo default key when language switches (value is language-agnostic)
  useEffect(() => {
    setFormData(p => ({ ...p, tipo: 'comitente' }))
  }, [lang])

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

      gsap.fromTo('.ct-info',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.ct-body', start: 'top 80%' } }
      )
      gsap.fromTo('.ct-form-wrap',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.15,
          scrollTrigger: { trigger: '.ct-body', start: 'top 80%' } }
      )

      gsap.fromTo('.ct-barrio',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: '.ct-barrios__list', start: 'top 88%' } }
      )
    })
    return () => ctx.revert()
  }, [lang])

  const breadcrumbsSchema = buildBreadcrumbSchema([
    { name: lang === 'en' ? 'Home' : 'Inicio', url: `${SITE_URL}/` },
    { name: lang === 'en' ? 'Contact' : 'Contacto', url: `${SITE_URL}/contacto` }
  ]);

  return (
    <main className="ct-page">
      <SEO
        title={t.seoTitle}
        description={t.seoDesc}
        url="/contacto"
        schemaType="LocalBusiness"
        schemaData={breadcrumbsSchema}
        lang={lang}
      />

      <div className="page-hero">
        <div className="page-hero__bg">
          <img src={media('img/portadas/Marinas.png')} alt="Contacto Estudio Levinton - Arquitectura de Casas" fetchPriority="high" decoding="async" width={1920} height={1080} />
          <div className="page-hero__overlay" />
        </div>
        <div className="page-hero__content">
          <span className="label" style={{ marginBottom: '20px', display: 'block' }}>{t.heroLabel}</span>
          <h1 className="ct-hero-title">
            <span className="ph-line"><span className="ph-line-inner">{t.heroLine1}</span></span>
            <span className="ph-line"><span className="ph-line-inner">{t.heroLine2}</span></span>
          </h1>
          <p className="ph-sub">{t.heroSub}</p>
        </div>
      </div>

      {/* INTRO WORDS */}
      <section className="ct-intro">
        <div className="container">
          <div className="ct-intro__words">
            {t.introWords.map((w, i) => (
              <div key={i} className="word-line">
                <span className="word-reveal ct-intro__word">{w}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BODY: info + form */}
      <section className="ct-body container">
        <div className="ct-info">
          <span className="label" style={{ marginBottom: '24px', display: 'block' }}>{t.directContact}</span>

          <div className="ct-person">
            <h3 className="ct-person__name">{t.sergioName}</h3>
            <span className="ct-person__role">{t.sergioRole}</span>
            <div className="ct-person__links">
              <a href="tel:+5491158098681" className="ct-link">+54 9 11 5809 8681</a>
              <a href="mailto:levintonnapoleone@gmail.com" className="ct-link">levintonnapoleone@gmail.com</a>
            </div>
          </div>

          <div className="ct-person">
            <h3 className="ct-person__name">{t.adrianaName}</h3>
            <span className="ct-person__role">{t.adrianaRole}</span>
            <div className="ct-person__links">
              <a href="tel:+5491144227758" className="ct-link">+54 9 11 4422 7758</a>
              <a href="mailto:adrianapoleone@gmail.com" className="ct-link">adrianapoleone@gmail.com</a>
            </div>
          </div>

          <div className="ct-extras">
            <a href="https://instagram.com/estudio_levinton" target="_blank" rel="noreferrer" className="ct-link">
              Instagram · @estudio_levinton
            </a>
            <a
              href={lang === 'en'
                ? "https://wa.me/5491158098681?text=Hello,%20I'm%20interested%20in%20learning%20more%20about%20your%20projects."
                : "https://wa.me/5491158098681?text=Hola,%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20proyectos."
              }
              target="_blank" rel="noreferrer"
              className="ct-wa-btn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t.whatsapp}
            </a>
          </div>
        </div>

        <div className="ct-form-wrap">
          {sent ? (
            <div className="ct-success">
              <span className="ct-success__icon">→</span>
              <h3 className="ct-success__title">{t.successTitle}</h3>
              <p>{t.successMsg}</p>
            </div>
          ) : (
            <form ref={formRef} className="ct-form" onSubmit={handleSubmit}>
              <div className="ct-form__tipo">
                {t.tipo.map(tp => (
                  <label key={tp.val} className={`ct-tipo-btn${formData.tipo === tp.val ? ' is-active' : ''}`}>
                    <input type="radio" name="tipo" value={tp.val} checked={formData.tipo === tp.val} onChange={handleChange} />
                    {tp.label}
                  </label>
                ))}
              </div>

              <div className="ct-form__grid">
                <div className="ct-field">
                  <label htmlFor="ct-nombre" className="ct-field__label">{t.fieldNombre}</label>
                  <input id="ct-nombre" className="ct-field__input" type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder={t.placeholderNombre} required />
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-email" className="ct-field__label">{t.fieldEmail}</label>
                  <input id="ct-email" className="ct-field__input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder={lang === 'en' ? 'your@email.com' : 'tu@email.com'} required />
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-telefono" className="ct-field__label">{t.fieldTel}</label>
                  <input id="ct-telefono" className="ct-field__input" type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+54 9 11..." />
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-barrio" className="ct-field__label">{t.fieldBarrio}</label>
                  <input id="ct-barrio" className="ct-field__input" type="text" name="barrio" value={formData.barrio} onChange={handleChange} placeholder={t.placeholderBarrio} />
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-m2" className="ct-field__label">{t.fieldM2}</label>
                  <input id="ct-m2" className="ct-field__input" type="text" name="m2" value={formData.m2} onChange={handleChange} placeholder={t.placeholderM2} />
                </div>
              </div>

              <div className="ct-field ct-field--full">
                <label htmlFor="ct-mensaje" className="ct-field__label">{t.fieldMensaje}</label>
                <textarea id="ct-mensaje" className="ct-field__input ct-field__textarea" name="mensaje" value={formData.mensaje} onChange={handleChange} placeholder={t.placeholderMensaje} rows={5} />
              </div>

              {error && (
                <p className="ct-form__error">{error}</p>
              )}

              <button type="submit" className="ct-submit" disabled={sending}>
                {sending
                  ? <span className="ct-submit__spinner" />
                  : <>{t.submitBtn} <span>→</span></>
                }
              </button>
            </form>
          )}
        </div>
      </section>

      {/* BARRIOS */}
      <section className="ct-barrios">
        <div className="container">
          <div className="word-line" style={{ marginBottom: '40px', overflow: 'hidden' }}>
            <span className="word-reveal ct-barrios__title">{t.barriosTitle}</span>
          </div>
          <div className="ct-barrios__list">
            {[
              'San Isidro Labrador', 'Santa Catalina', 'Nordelta Carpinchos', 'Nordelta Glorietas',
              'Vistas Puertos', 'El Lauquen', 'La Martona', 'Highland Park', 'Pilar del Este',
              'San Diego', 'Marinas Puertos', 'Santa Clara', 'Nordelta Los Sauces', 'Puertos Muelles',
              'Campos de Roca', 'San Andrés', 'San Matías', 'Santa Bárbara', 'Santa Maria de Tigre',
              'Talar de Pacheco', 'El Naudir', 'Talar del Lago', 'Azzurra', 'Maschwitz Privado',
            ].map(b => (
              <span key={b} className="ct-barrio">{b}</span>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}