import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { media } from '../../config/media'
import { ALL_PROJECTS } from '../../data/projects'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

const IMGS = {
  hero:    media('img/hero.jpeg'),
  proj1:   media('img/portadas/Azurra.png'),
  proj2:   media('img/portadas/Carpinchos.png'),
  proj3:   media('img/portadas/Marinas.png'),
  proj4:   media('img/portadas/SIL 71.png'),
  proj5:   media('img/portadas/SIL 645.png'),
  detail2: media('img/Obras-estudio-Levinton/jardin-botanico.png'),
  detail3: media('img/portadas/SIL 645.png'),
  team1:   media('img/Obras-estudio-Levinton/sergio.JPG'),
  team2:   media('img/Obras-estudio-Levinton/adriana.JPG'),
  cta:     media('img/portadas/Talar de Pacheco.png'),
}

const FEATURED_PROJECTS = ALL_PROJECTS.slice(0, 6);


export default function Home() {
  const wrapRef    = useRef(null)   // div 400vh — scroll space
  const stickyRef  = useRef(null)   // panel sticky 100vh

  // Imagen full-screen
  const imgWrapRef = useRef(null)
  const imgRef     = useRef(null)

  const line1Ref   = useRef(null)
  const line2Ref   = useRef(null)
  const line3Ref   = useRef(null)
  const l1Wrap     = useRef(null)
  const l2Wrap     = useRef(null)
  const l3Wrap     = useRef(null)

  // Texto secundario (aparece con scroll, sobre fondo blanco)
  const txt2Ref    = useRef(null)
  const t2L1Ref    = useRef(null)
  const t2L2Ref    = useRef(null)

  const botRef     = useRef(null)
  const botWrap    = useRef(null)
  const marRef     = useRef(null)
  const statsRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ══════════════════════════════════════
         ESTADO INICIAL antes del entrance
      ══════════════════════════════════════ */
      gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], { yPercent: 110 })
      gsap.set(imgWrapRef.current, { autoAlpha: 0 })
      gsap.set(botRef.current, { autoAlpha: 0 })
      gsap.set(txt2Ref.current, { autoAlpha: 0 })
      gsap.set([t2L1Ref.current, t2L2Ref.current], { yPercent: 110 })

      /* ══════════════════════════════════════
         ENTRANCE (después del loader ~2.9s)
      ══════════════════════════════════════ */
      const entrance = gsap.timeline({ 
        delay: 2.9
      })
      entrance
        .to(imgWrapRef.current, { autoAlpha: 1, duration: 1, ease: 'power2.out' })
        .to(
          [line1Ref.current, line2Ref.current, line3Ref.current],
          { yPercent: 0, stagger: 0.12, duration: 1.1, ease: 'power4.out' },
          '-=0.4'
        )
        .to(botRef.current, { autoAlpha: 1, duration: 0.6 }, '-=0.5')

      /* ══════════════════════════════════════
         SCROLL EFFECT — Yurdaer
         ...
      ══════════════════════════════════════ */

      const TRIGGER = wrapRef.current

      // ── FASE A: líneas caen en ola ──────────────
      ;[
        { ref: l1Wrap, scrub: 0.3,  end: '28% top' },
        { ref: l2Wrap, scrub: 0.5,  end: '32% top' },
        { ref: l3Wrap, scrub: 0.7,  end: '36% top' },
      ].forEach(({ ref, scrub, end }) => {
        gsap.to(ref.current, {
          yPercent: 160,
          ease: 'none',
          scrollTrigger: {
            trigger: TRIGGER,
            start: 'top top',
            end,
            scrub,
            invalidateOnRefresh: true,
            onUpdate: self => {
              // Si el usuario scrollea aunque sea un poquito, terminamos la animación de entrada
              // Esto evita que el sitio se sienta "tildado" durante el delay inicial
              if (self.progress > 0.01) {
                entrance.progress(1);
              }
            }
          },
        })
      })

      // bottom strip desaparece rápido
      gsap.to(botWrap.current, {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: TRIGGER, start: 'top top', end: '8% top', scrub: 0.3 },
      })

      // ── FASE A: overlay negro desaparece ─────────
      gsap.to('.hero-img-overlay', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: TRIGGER, start: '5% top', end: '30% top', scrub: 0.6 },
      })

      // fondo del sticky → blanco
      gsap.to(stickyRef.current, {
        backgroundColor: '#ffffff',
        ease: 'none',
        scrollTrigger: { trigger: TRIGGER, start: '12% top', end: '38% top', scrub: 0.8 },
      })

      // ── FASE B: imagen se achica con Scale ─────
      // Reemplazamos clipPath (pesado) por Scale (GPU-friendly)
      // 100% - (13% * 2) = 0.74
      // 100% - (7% * 2) = 0.86
      gsap.fromTo(
        imgWrapRef.current,
        { 
          scaleX: 1, 
          scaleY: 1, 
          borderRadius: 0 
        },
        {
          scaleX: 0.74,
          scaleY: 0.86,
          borderRadius: 14,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: TRIGGER,
            start: '20% top',
            end: '65% top',
            scrub: 0.6,
          },
        }
      )

      // La imagen interior: escala inversa para mantener el tamaño visual del contenido (CROP effect)
      // Queremos una escala visual uniforme de aprox 1.25 al final
      // Sx_img = 1.25 / 0.74 ≈ 1.69
      // Sy_img = 1.25 / 0.86 ≈ 1.45
      gsap.fromTo(
        imgRef.current,
        { scaleX: 1.15, scaleY: 1.15 },
        {
          scaleX: 1.69, 
          scaleY: 1.45,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: TRIGGER,
            start: '20% top',
            end: '65% top',
            scrub: 0.6,
          },
        }
      )

      // ── FASE C: txt2 aparece (palabras grandes negro/blanco) ──
      gsap.to(txt2Ref.current, {
        autoAlpha: 1,
        ease: 'none',
        scrollTrigger: { trigger: TRIGGER, start: '50% top', end: '58% top', scrub: 0.5 },
      })
      gsap.to(t2L1Ref.current, {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: { trigger: TRIGGER, start: '52% top', end: '70% top', scrub: 0.6 },
      })
      gsap.to(t2L2Ref.current, {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: { trigger: TRIGGER, start: '58% top', end: '75% top', scrub: 0.8 },
      })

      /* ══════════════════════════════════════
         MARQUEE
      ══════════════════════════════════════ */
      const track = marRef.current
      if (track) {
        // Aseguramos que las fuentes estén cargadas para medir correctamente
        document.fonts.ready.then(() => {
          const repetitions = 6
          const totalW = track.scrollWidth / repetitions
          gsap.to(track, {
            x: -totalW, 
            ease: 'none', 
            duration: 25, 
            repeat: -1,
            modifiers: {
              x: gsap.utils.unitize(x => {
                const val = parseFloat(x) % totalW
                return val > 0 ? val - totalW : val
              })
            },
          })
        })
      }

      /* ══════════════════════════════════════
         WORD-BY-WORD (secciones inferiores)
      ══════════════════════════════════════ */
      gsap.utils.toArray('.word-reveal').forEach(word => {
        gsap.fromTo(word,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 0.9, ease: 'power4.out',
            scrollTrigger: { trigger: word.closest('.word-line') || word, start: 'top 88%' },
          }
        )
      })

      /* ══════════════════════════════════════
         STATS counter
      ══════════════════════════════════════ */
      statsRef.current?.querySelectorAll('.s-stat').forEach(stat => {
        const numEl  = stat.querySelector('.s-stat__num')
        const target = parseInt(numEl.dataset.target, 10)
        const obj    = { val: 0 }
        gsap.fromTo(stat, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: stat, start: 'top 86%' },
        })
        gsap.to(obj, {
          val: target, duration: 2.2, ease: 'power2.out', snap: { val: 1 },
          onUpdate() { numEl.textContent = Math.round(obj.val).toLocaleString('es-AR') },
          scrollTrigger: { trigger: stat, start: 'top 82%', once: true },
        })
      })

      /* ══════════════════════════════════════
         IMAGE REVEALS
      ══════════════════════════════════════ */
      gsap.utils.toArray('.img-reveal').forEach(wrap => {
        gsap.fromTo(wrap,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut',
            scrollTrigger: { trigger: wrap, start: 'top 85%' },
          }
        )
        const img = wrap.querySelector('img')
        if (img) gsap.from(img, {
          scale: 1.12, duration: 1.6, ease: 'power4.out',
          scrollTrigger: { trigger: wrap, start: 'top 85%' },
        })
      })

      /* ══════════════════════════════════════
         PROJECT CARDS
      ══════════════════════════════════════ */
      gsap.utils.toArray('.proj-item').forEach(item => {
        gsap.fromTo(item,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 88%' },
          }
        )
      })

      /* ══════════════════════════════════════
         HORIZONTAL scrub text
      ══════════════════════════════════════ */
      document.querySelectorAll('.scrub-x').forEach(el => {
        const isMobile = window.innerWidth < 768
        const distance = isMobile ? 15 : 80
        const dir = el.dataset.dir === 'right' ? distance : -distance
        gsap.fromTo(el, { x: -dir }, {
          x: dir, ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })

      /* ══════════════════════════════════════
         CTA parallax
      ══════════════════════════════════════ */
      const ctaBg = document.querySelector('.cta-bg')
      if (ctaBg) {
        gsap.to(ctaBg, {
          yPercent: 20, ease: 'none',
          scrollTrigger: { trigger: ctaBg.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }

    })
    return () => ctx.revert()
  }, [])

  return (
    <main className="home">

      {/* ═══════════════════════════════════════════════════
          HERO — 400vh wrapper + sticky panel
      ═══════════════════════════════════════════════════ */}
      <div className="hero-wrap" ref={wrapRef}>
        <div className="hero-sticky" ref={stickyRef}>

          {/* IMAGEN full-screen — protagonista del efecto */}
          {/* position: fixed dentro del sticky para que cubra todo */}
          <div className="hero-img-wrap" ref={imgWrapRef}>
            <img src={IMGS.hero} alt="Arquitectura Levinton" ref={imgRef} />
            <div className="hero-img-overlay" />
          </div>

          {/* TEXTO 1 — cae al hacer scroll */}
          <div className="hero-txt1">
            <div className="ht-line">
              <span className="ht-scroll-wrap" ref={l1Wrap} style={{ display: 'block' }}>
                <span className="ht-inner" ref={line1Ref}>PROYECTAMOS</span>
              </span>
            </div>
            <div className="ht-line">
              <span className="ht-scroll-wrap" ref={l2Wrap} style={{ display: 'block' }}>
                <span className="ht-inner" ref={line2Ref}>CONSTRUIMOS</span>
              </span>
            </div>
            <div className="ht-line">
              <span className="ht-scroll-wrap" ref={l3Wrap} style={{ display: 'block' }}>
                <span className="ht-inner ht-inner--ghost" ref={line3Ref}>Arquitectura</span>
              </span>
            </div>
          </div>

          {/* TEXTO 2 — aparece en negro sobre blanco cuando imagen se achicó */}
          <div className="hero-txt2" ref={txt2Ref}>
            <div className="ht2-line">
              <span className="ht2-inner" ref={t2L1Ref}>CREAMOS</span>
            </div>
            <div className="ht2-line">
              <span className="ht2-inner" ref={t2L2Ref}>ESPACIOS</span>
            </div>
          </div>

          {/* BOTTOM STRIP */}
          <div className="hero-bot" ref={botWrap}>
            <div ref={botRef} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span className="label">Estudio Levinton · Desde 1974</span>
              <div className="hero-bot__scroll">
                <span className="label">Scroll</span>
                <div className="hero-bot__line"><div className="hero-bot__fill" /></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          MARQUEE
      ═══════════════════════════════════════════════════ */}
      <div className="s-marquee">
        <div className="s-marquee__track" ref={marRef}>
          {Array.from({ length: 6 }).flatMap(() =>
            ['LEVINTON','·','NAPOLEONE','·','ARQUITECTOS','·','DESDE 1974','·','BUENOS AIRES','·']
          ).map((w, i) => (
            <span key={i} className={w === '·' ? 's-marquee__dot' : 's-marquee__word'}>{w}</span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          WORD BY WORD
      ═══════════════════════════════════════════════════ */}
      <section className="s2-words">
        <div className="s2-words__grid">
          <div className="s2-words__left">
            {['UNIMOS','TODO','EL','PROCESO','EN','UNO'].map((w, i) => (
              <div key={i} className="word-line">
                <span className="word-reveal s2-words__word">{w}</span>
              </div>
            ))}
          </div>
          <div className="s2-words__right">
            <div className="s2-words__sub">
              <div className="word-line"><span className="word-reveal s2-words__phrase">CREANDO</span></div>
              <div className="word-line"><span className="word-reveal s2-words__phrase s2-words__phrase--accent">EFICIENCIA</span></div>
              <div className="word-line"><span className="word-reveal s2-words__phrase">&amp;</span></div>
              <div className="word-line"><span className="word-reveal s2-words__phrase">PRECISIÓN</span></div>
            </div>
            <div className="s2-words__meta">
              <div className="img-reveal s2-words__img">
                <img src={IMGS.detail2} alt="Detalle constructivo" />
              </div>
              <div className="s2-words__since">
                <span className="s2-words__since-num">1974</span>
                <span className="label">Fundado en</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════════════ */}
      <section className="s3-stats" ref={statsRef}>
        <div className="s3-stats__bg-text scrub-x" data-dir="left">LEVINTON ARQUITECTOS</div>
        <div className="s3-stats__grid container">
          {[
            { num: 300,   suffix: '+',  label: 'Obras construidas' },
            { num: 50,    suffix: '',   label: 'Años de trayectoria ininterrumpida' },
            { num: 30000, suffix: 'm²', label: 'Desarrollados en prop. horizontal' },
            { num: 12,    suffix: '',   label: 'Barrios cerrados activos' },
          ].map((s, i) => (
            <div key={i} className="s-stat">
              <div className="s-stat__value">
                <span className="s-stat__num" data-target={s.num}>0</span>
                <span className="s-stat__suffix">{s.suffix}</span>
              </div>
              <p className="s-stat__label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PROJECTS
      ═══════════════════════════════════════════════════ */}
      <section className="s4-projects">
        <div className="s4-projects__header container">
          <h2 className="s4-projects__title scrub-x" data-dir="right">PROYECTOS SELECCIONADOS</h2>
        </div>
        <div className="s4-grid">
          {FEATURED_PROJECTS.map((p, i) => (
            <Link to={`/proyectos/${p.slug}`} key={i} className="s4-grid__item">
              <img src={p.img} alt={p.title} loading="lazy" />
              <div className="s4-grid__hover">
                <span className="s4-grid__label">{p.label}</span>
                <h3 className="s4-grid__title">{p.title}</h3>
                <span className="s4-grid__year">{p.year}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="s4-projects__cta">
          <Link to="/proyectos" className="s4-projects__all-btn">Ver todos los proyectos →</Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          APPROACH
      ═══════════════════════════════════════════════════ */}
      <section className="s5-approach">
        <div className="s5-approach__row">
          <div className="s5-approach__text-col">
            <div className="word-line"><span className="word-reveal s5-approach__big">AMAMOS</span></div>
            <div className="word-line"><span className="word-reveal s5-approach__big">LO QUE</span></div>
            <div className="word-line"><span className="word-reveal s5-approach__big s5-approach__big--italic">HACEMOS</span></div>
          </div>
          <div className="s5-approach__img-col">
            <div className="img-reveal s5-approach__img">
              <img src={IMGS.detail3} alt="Construcción" />
            </div>
          </div>
        </div>
        <div className="s5-approach__row s5-approach__row--b container">
          <div className="s5-approach__body">
            <span className="label" style={{ marginBottom: '1.5rem', display: 'block' }}>Nuestra Filosofía</span>
            <p className="s5-approach__p word-reveal">
              Fundado en 1974 por el Arquitecto Sergio Levinton ,
              el estudio une la solidez técnica con una sensibilidad artística única.
              Más de 300 obras entregadas en los barrios más exclusivos de Argentina.
            </p>
            <p className="s5-approach__p word-reveal" style={{ marginTop: '1.5rem' }}>
              Cada proyecto es único. Cada hogar refleja la forma en que su dueño vive.
              Presupuesto cerrado, supervisión diaria, acompañamiento permanente.
            </p>
            <Link to="/nosotros" className="s5-approach__link word-reveal">Conocer el estudio →</Link>
          </div>
          <div className="s5-approach__team">
            <div className="img-reveal s5-approach__img-b">
              <img src={IMGS.team1} alt="Arq. Sergio Levinton" />
              <div className="s5-approach__img-cap">
                <strong>Arq. Sergio Levinton</strong>
                <span>Director · Co-fundador</span>
              </div>
            </div>
            <div className="img-reveal s5-approach__img-b">
              <img src={IMGS.team2} alt="Arq. Adriana Napoleone" />
              <div className="s5-approach__img-cap">
                <strong>Arq. Adriana Napoleone</strong>
                <span>Directora de Proyectos · Diseño e Identidad</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SCRUBBING TEXT
      ═══════════════════════════════════════════════════ */}
      <section className="s6-marquee-scroll">
        <div className="s6-marquee-scroll__line scrub-x" data-dir="left">PROYECTAMOS · CONSTRUIMOS · SUPERVISAMOS</div>
        <div className="s6-marquee-scroll__line scrub-x" data-dir="right">EN TODO LO QUE HACEMOS · CALIDAD SIN CONCESIONES</div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════════════════ */}
      <section className="s7-services container">
        <div className="s7-services__header">
          <div className="word-line"><span className="word-reveal s7-services__title">NUESTROS</span></div>
          <div className="word-line"><span className="word-reveal s7-services__title s7-services__title--accent">SERVICIOS</span></div>
        </div>
        <div className="s7-services__list">
          {[
            { num: '01', title: 'Construcción Llave en Mano',       desc: 'Proyecto, trámites, materiales y obra. Presupuesto cerrado, sin sorpresas.' },
            { num: '02', title: 'Diseño y Selección de Materiales', desc: 'Terminaciones que perduran. Sensibilidad artística única de la Arq. Napoleone.' },
            { num: '03', title: 'Eficiencia Energética',            desc: 'Pioneros en termotanques solares y etiquetado energético residencial.' },
            { num: '04', title: 'Grupos de Inversión',              desc: 'Casas terminadas como Showrooms. Alta rentabilidad, respaldo real.' },
            { num: '05', title: 'Flipping / Reciclado',             desc: 'Reciclamos propiedades con potencial y las reintroducimos al mercado con valor agregado.' },
          ].map((s, i) => (
            <div key={i} className="s7-serv-row proj-item">
              <span className="s7-serv-row__num">{s.num}</span>
              <h3 className="s7-serv-row__title">{s.title}</h3>
              <p className="s7-serv-row__desc">{s.desc}</p>
              <Link to="/servicios" className="s7-serv-row__arrow">→</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════ */}
      <section className="s8-cta">
        <div className="cta-bg">
          <img src={IMGS.cta} alt="" />
          <div className="s8-cta__overlay" />
        </div>
        <div className="s8-cta__content container">
          <div className="word-line"><span className="word-reveal s8-cta__line">¿TENÉS UN</span></div>
          <div className="word-line"><span className="word-reveal s8-cta__line s8-cta__line--italic">LOTE EN</span></div>
          <div className="word-line"><span className="word-reveal s8-cta__line">BARRIOS CERRADOS?</span></div>
          <div className="s8-cta__actions word-reveal">
            <Link to="/contacto" className="s8-cta__btn">Proyectá tu hogar</Link>
            <Link to="/proyectos" className="s8-cta__link">Ver inversiones →</Link>
          </div>
        </div>
      </section>

    </main>
  )
}