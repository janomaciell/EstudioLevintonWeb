import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { media } from '../../config/media'
import './Nosotros.css'

gsap.registerPlugin(ScrollTrigger)

const TIMELINE = [
  { year: '1977', event: 'Raíces en PRENOVA',
    desc: 'Ricardo Levinton inicia la investigación biomimetéica inspirada en la estructura del fémur humano. El sistema PRENOVA de losas aligeradas llegaría a construir más de 1.000.000 m² globales.' },
  { year: '1974', event: 'Fundación del Estudio',
    desc: 'Sergio Levinton inicia su trayectoria en CABA con propiedad horizontal de alta densidad: torres de 14–15 pisos en Av. Santa Fe, Av. Córdoba y Malabia — más de 30.000 m² construidos.' },
  { year: '1992', event: 'Incorporación de Adriana Napoleone',
    desc: 'Arquitecta (UBA) y Licenciada en Artes Plásticas — Grabado (UNLP). Su manifiesto "La Multiplicación de los Planos" define la identidad visual del estudio. Premio Adquisición Bancor 2022.' },
  { year: '2001', event: 'Expansión a Zona Norte',
    desc: 'Nordelta, EIDICO El Encuentro, Puertos del Lago, El Lauquen, Villanueva, Hyland Park, Campos de Roca, La Martona. El estudio se convierte en referente indiscutido del segmento premium.' },
  { year: '2012', event: 'Pioneros en Sustentabilidad',
    desc: 'Termotanques solares como estándar absoluto — una década antes que el mercado. Etiquetado energético, paneles fotovoltaicos y domótica integrada desde el diseño.' },
  { year: '2020', event: 'Líderes de Opinión',
    desc: 'Disertación en Reporte Inmobiliario junto a Mercado Libre Inmuebles sobre "Casas Eficientes y Etiquetado Energético". Referentes del impacto de la sustentabilidad en la tasación.' },
  { year: 'Hoy',  event: '+300 Obras Entregadas',
    desc: 'Cinco décadas sin pausa. 300+ viviendas en los barrios más exclusivos, 30.000 m² en CABA, 645 hectáreas en Bariloche. Una obra que trasciende generaciones.' },
]

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
  useEffect(() => {
    const ctx = runPageAnimations()
    return () => ctx.revert()
  }, [])

  return (
    <main className="nos-page">

      <div className="page-hero">
        <div className="page-hero__bg">
          <img src="/img/portadas/Azurra.png" alt="Obra Estudio Levinton" />
          <div className="page-hero__overlay" />
        </div>
        <div className="page-hero__content">
          <span className="label" style={{ marginBottom: '20px', display: 'block' }}>Estudio Levinton</span>
          <h1 className="nos-hero-title">
            <span className="ph-line"><span className="ph-line-inner">QUIÉNES</span></span>
            <span className="ph-line"><span className="ph-line-inner">SOMOS</span></span>
          </h1>
          <p className="ph-sub">Cuatro décadas proyectando hogares que trascienden generaciones, con solidez constructiva y visión sustentable.</p>
        </div>
      </div>

      {/* INTRO BIG WORDS */}
      <section className="nos-intro">
        <div className="nos-intro__inner">
          <div className="nos-intro__words">
            {['UNA', 'VISIÓN', 'COMPARTIDA'].map((w, i) => (
              <div key={i} className="word-line">
                <span className="word-reveal nos-intro__word">{w}</span>
              </div>
            ))}
          </div>
          <div className="nos-intro__body">
            <p>Estudio Levinton Napoleone: boutique de arquitectura y construcción en Buenos Aires desde 1974. Cinco décadas, más de 300 viviendas en los barrios más exclusivos del país — Nordelta, Puertos del Lago, EIDICO, Villanueva, El Lauquen, Hyland Park, Campos de Roca — y una huella urbana de 30.000 m² en CABA y 645 ha en Bariloche.</p>
            <p>No somos solo un estudio de diseño. No somos solo una empresa constructora. Somos ambas cosas en una sola entidad cohesiva: la solidez técnica del Arq. Levinton fusionada con la sensibilidad artística premiada de la Arq. Napoleone.</p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="nos-team">
        <div className="nos-team__label container">
          <span className="label">Fundadores</span>
          <div className="scrub-x nos-team__bg-text" data-dir="left">ARQUITECTOS</div>
        </div>

        <div className="nos-team__grid container">
          <div className="nos-team__member">
            <div className="img-reveal nos-team__img">
              <img src={media('img/Obras-estudio-Levinton/sergio.JPG')} alt="Arq. Sergio Levinton" />
            </div>
            <div className="nos-team__info">
              <span className="label" style={{ marginBottom: '12px', display: 'block' }}>Director Técnico · Co-fundador</span>
              <h2 className="nos-team__name word-reveal">ARQ. SERGIO<br/>LEVINTON</h2>
              <p className="nos-team__bio">Arquitecto egresado de la UBA. Más de 40 años de trayectoria: desde torres de 14 pisos en CABA (Av. Santa Fe, Av. Córdoba, Malabia) hasta el masterplan de 645 ha en Cerro Carbón, Bariloche, y más de 300 viviendas premium en Nordelta, Puertos, EIDICO y Hyland Park.</p>
              <p className="nos-team__bio">Pionero en eficiencia energética residencial. Disertante en Reporte Inmobiliario 2020 junto a Mercado Libre Inmuebles sobre etiquetado energético y valorización de propiedades.</p>
              <a href="tel:+5491158098681" className="nos-team__contact">011 5809-8681</a>
            </div>
          </div>

          <div className="nos-team__member">
            <div className="img-reveal nos-team__img">
              <img src={media('img/Obras-estudio-Levinton/adriana.JPG')} alt="Arq. Adriana Napoleone" />
            </div>
            <div className="nos-team__info">
              <span className="label" style={{ marginBottom: '12px', display: 'block' }}>Directora Artística · Co-fundadora</span>
              <h2 className="nos-team__name word-reveal">ARQ. ADRIANA<br/>NAPOLEONE</h2>
              <p className="nos-team__bio">Arquitecta (UBA) y artista visual. Directora de la Galeria Pueblo Garzon, en Garzon, Uruguay.</p>
              <p className="nos-team__bio">Seleccionada Premio Bancor 2022 (Museo Tamburini, Córdoba). Programa de Artistas Torcuato Di Tella 2011. Exposiciones en Nordelta, Museo Villa Carmen, Casa de las Culturas, Municipio de Tigre y Bahía Grande — el mismo territorio donde construye.</p>
              <a href="tel:+5491144227758" className="nos-team__contact">011 4422-7758</a>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="nos-timeline">
        <div className="container">
          <div className="word-line" style={{ overflow: 'hidden', marginBottom: '60px' }}>
            <span className="word-reveal nos-tl-title">TRAYECTORIA</span>
          </div>
          {TIMELINE.map((t, i) => (
            <div key={i} className="nos-t-item">
              <span className="nos-t-year">{t.year}</span>
              <div className="nos-t-line" />
              <div>
                <span className="nos-t-event">{t.event}</span>
                {t.desc && <p className="nos-t-desc">{t.desc}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>



    </main>
  )
}