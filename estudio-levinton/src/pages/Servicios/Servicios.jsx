import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { media } from '../../config/media'
import './Servicios.css'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    num: '01', title: 'Construcción\nLlave en Mano',
    desc: 'Asumimos responsabilidad total: proyecto arquitectónico, tramitaciones municipales, compra de materiales y dirección de obra. Presupuesto predefinido y cerrado — sin sorpresas en el contexto argentino.',
    detail: '3 meses de diseño + trámites · 10–12 meses de construcción · Plazo total: 15 meses.',
    img: media('img/portadas/Azurra.png'),
  },
  {
    num: '02', title: 'Diseño y\nmateriales',
    desc: 'Nos enfocamos en dar respuesta a las necesidades de cada comitente, diseñamos teniendo en cuenta parámetros bioclimáticos y materiales que ahorren consumo de energía.',
    img: media('img/portadas/SIL 645.png'),
  },
  {
    num: '03', title: 'Eficiencia\nEnergética',
    desc: 'Termotanques solares como estándar desde 2012 — una década antes que el mercado premium. Paneles fotovoltaicos opcionales y domótica para control automatizado de climatización, cortinas y consumo.',
    detail: 'Disertantes en Reporte Inmobiliario 2020 sobre "Casas Eficientes y Etiquetado Energético" junto a Mercado Libre Inmuebles.',
    img: media('img/portadas/Sustentabilidad 02.png'),
  },
  {
    num: '04', title: 'Grupos de\nInversión',
    desc: 'Organizamos grupos de inversión cerrados para adquirir lotes estratégicos y construir residencias premium. Las casas se comercializan como Showrooms habitables, completamente ambientadas por nuestra red de diseñadores e interioristas.',
    detail: 'Ideal para inversores de capital o compradores que necesitan ocupación inmediata con garantía de diseño.',
    img: media('img/portadas/Marinas.png'),
  },
  {
    num: '05', title: 'Flipping / \nReciclado',
    desc: 'El Flipping es uno de los nichos que más está funcionando: compramos propiedades con potencial, las reciclamos integralmente con nuestro estándar de diseño y las reintroducimos al mercado con un valor significativamente mayor.',
    detail: 'Detección de oportunidades + Proyecto de transformación + Ejecución de obra express.',
    img: media('img/portadas/SIL 71.png'),
  },
]

const PROCESO = [
  { step: '01', dur: '1 mes',      title: 'Encuentro y Brief',         desc: 'Reunión para entender tu proyecto de vida, lote, presupuesto y expectativas.' },
  { step: '02', dur: '2 meses',    title: 'Diseño y Visualización 3D', desc: 'Anteproyecto y renderizados 3D para recorrer tu hogar virtualmente.' },
  { step: '03', dur: '1 mes',      title: 'Trámites Municipales',      desc: 'Gestionamos todos los permisos. Sin burocracia de tu parte.' },
  { step: '04', dur: '10–12 meses',title: 'Construcción y Entrega',    desc: 'Dirección de obra con presupuesto cerrado y supervisión diaria.' },
]

export default function Servicios() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // hero
      const lines = document.querySelectorAll('.ph-line-inner')
      gsap.to(lines, { y: '0%', stagger: 0.1, duration: 1.0, ease: 'power4.out', delay: 0.2 })
      const sub = document.querySelector('.ph-sub')
      if (sub) gsap.to(sub, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 })
      const bg = document.querySelector('.page-hero .page-hero__bg')
      if (bg) gsap.to(bg, {
        yPercent: 22, ease: 'none',
        scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true }
      })

      // service rows: image clipPath + text fade
      gsap.utils.toArray('.sv-row').forEach((row) => {
        const img = row.querySelector('.sv-row__img')
        if (img) {
          gsap.fromTo(img,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut',
              scrollTrigger: { trigger: row, start: 'top 80%' } }
          )
          gsap.from(img.querySelector('img'), {
            scale: 1.1, duration: 1.6, ease: 'power4.out',
            scrollTrigger: { trigger: row, start: 'top 80%' }
          })
        }
        gsap.fromTo(row.querySelectorAll('.sv-row__fade'),
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.85, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 82%' } }
        )
      })

      // word reveals
      gsap.utils.toArray('.word-reveal').forEach(el => {
        gsap.fromTo(el, { y: '105%', opacity: 0 }, {
          y: '0%', opacity: 1, duration: 0.9, ease: 'power4.out',
          scrollTrigger: { trigger: el.closest('.word-line') || el, start: 'top 88%' }
        })
      })

      // proceso steps
      gsap.fromTo('.sv-step',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.sv-proceso__grid', start: 'top 82%' } }
      )

      // scrub x
      gsap.utils.toArray('.scrub-x').forEach(el => {
        const dir = el.dataset.dir === 'right' ? 60 : -60
        gsap.fromTo(el, { x: -dir }, {
          x: dir, ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true }
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <main className="sv-page">

      <div className="page-hero">
        <div className="page-hero__bg">
          <img src={media('img/portadas/Sustentabilidad 01.png')} alt="Residencias de Alta Gama" />
          <div className="page-hero__overlay" />
        </div>
        <div className="page-hero__content">
          <span className="label" style={{ marginBottom: '20px', display: 'block' }}>Estudio Levinton</span>
          <h1 className="sv-hero-title">
            <span className="ph-line"><span className="ph-line-inner">NUESTROS</span></span>
            <span className="ph-line"><span className="ph-line-inner">SERVICIOS</span></span>
          </h1>
          <p className="ph-sub">Residencias unifamiliares de alta gama con servicio integral y acompañamiento en cada etapa.</p>
        </div>
      </div>

      {/* INTRO WORDS */}
      <section className="sv-intro">
        <div className="container sv-intro__inner">
          <div className="sv-intro__words">
            {['TODO', 'BAJO', 'UN MISMO', 'TECHO'].map((w, i) => (
              <div key={i} className="word-line">
                <span className="word-reveal sv-intro__word">{w}</span>
              </div>
            ))}
          </div>
          <p className="sv-intro__body">
            El modelo dual de Estudio Levinton atiende simultáneamente al comitente particular que sueña con proyectar su hogar, y al inversor de capital inmobiliario que busca oportunidades curadas de alto valor. En ambos casos, la solidez constructiva y la excelencia estética son innegociables.
          </p>
        </div>
      </section>

      {/* SERVICE ROWS — Yurdaer style: full-width alternating */}
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
              <Link to="/contacto" className="sv-row__link sv-row__fade">Consultar →</Link>
            </div>
          </div>
        ))}
      </section>

      {/* PROCESO */}
      <section className="sv-proceso">
        <div className="container">
          <div className="sv-proceso__header">
            <div className="scrub-x sv-proceso__bg" data-dir="left">PROCESO</div>
            <div className="word-line" style={{ position: 'relative', zIndex: 2 }}>
              <span className="word-reveal sv-proceso__title">CÓMO TRABAJAMOS</span>
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