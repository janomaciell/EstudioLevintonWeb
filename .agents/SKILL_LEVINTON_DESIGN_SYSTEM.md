# 🏛️ ESTUDIO LEVINTON — DESIGN SYSTEM & ANIMATION GUIDE

> **Este documento es la biblia de la plataforma EstudioLevinton.**
> Antes de tocar cualquier cosa del sitio, leé esto entero.
> Aplica a **cualquier página nueva, componente, o sección** que se agregue.

---

## 1. STACK TECNOLÓGICO

```
React + Vite + React Router DOM
GSAP 3 + ScrollTrigger (animaciones)
CSS Variables (sin Tailwind, sin styled-components)
DualTheme: dark/light via data-theme="light" en body
BiLingual: ES/EN via LanguageContext + translations.js
SSR-ready: entry-server.jsx
```

---

## 2. PALETA DE COLORES

### Tema DARK (predeterminado en CSS — fondo casi negro)

```css
--bg-main:     #0c0b0a    /* fondo principal oscuro */
--bg-alt:      #111111    /* fondo alternativo (secciones separadas) */
--text-main:   #f4f1ec    /* texto principal — blanco cálido */
--text-alt:    #ffffff    /* texto sobre fondos oscuros */
--off-white:   #ece9e3    /* casi blanco, fondos suaves */
--beige:       #d9d4cc    /* beige medio */
--title-beige: #d9d4cc    /* color de títulos grandes */
--warm-gray:   #9a9490    /* gris cálido — labels, metadata */
--mid-gray:    #5a5652    /* gris medio */
--accent:      #c4a882    /* dorado/bronce — color de acento ÚNICO */
```

### Tema LIGHT (fondos blancos — estado actual del sitio, default en localStorage)

```css
--bg-main:     #f4f1ec    /* fondo principal — crema/beige claro */
--bg-alt:      #e0e0e0    /* fondo alternativo */
--text-main:   #0c0b0a    /* texto: casi negro */
--text-alt:    #0c0b0a
--off-white:   #181614
--beige:       #5a5652
--title-beige: #181614
--warm-gray:   #5e5955
--mid-gray:    #3b3834
--accent:      #967548    /* dorado más oscuro en light */
```

### Opacidades — el sistema

El sistema de opacidades se basa en la conversión del color del texto al contexto del tema.
- **Dark**: `rgba(244, 241, 236, 0.XX)` — texto claro sobre fondo oscuro
- **Light**: `rgba(12, 11, 10, 0.XX)` — texto oscuro sobre fondo claro

```css
--opacity-02  --opacity-03  --opacity-04  --opacity-05
--opacity-06  --opacity-07  --opacity-08  --opacity-10
--opacity-12  --opacity-15  --opacity-18  --opacity-20
--opacity-22  --opacity-25  --opacity-30  --opacity-35
--opacity-40  --opacity-45  --opacity-50  --opacity-52
--opacity-55  --opacity-72  --opacity-75  --opacity-90
--overlay-dark
--nav-scrolled-bg
```

**Regla de oro**: Nunca pongas un `rgba()` hardcodeado donde deberías usar una variable de opacidad.
Los bordes sutiles son siempre `var(--opacity-06)` o `var(--opacity-08)`.
Los textos secundarios son `var(--opacity-30)` a `var(--opacity-45)`.

---

## 3. TIPOGRAFÍA

### Las dos fuentes del sistema

```css
--font-display: 'Bebas Neue', 'Arial Black', sans-serif;
--font-body:    'DM Sans', system-ui, sans-serif;
```

Google Fonts import:
```
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
```

### REGLA CRÍTICA de uso
- **Bebas Neue** → SOLO para títulos grandes, hero text, displays, labels en mayúscula decorativa, marquee
- **DM Sans** → SIEMPRE para body, párrafos, labels informativos, navegación, UI

### Pesos de DM Sans utilizados

```css
font-weight: 300  /* light — subtítulos, body secundario */
font-weight: 400  /* regular — body principal */
font-weight: 500  /* medium — labels, navegación */
font-weight: 600  /* semibold — emphasis */
```

### Tamaños de texto — Escala de la plataforma

| Elemento | CSS | Resultado visual |
|---|---|---|
| Hero título principal | `clamp(5rem, 14vw, 15rem)` | 80–240px |
| Hero título ghost (3ra línea) | `clamp(4rem, 11vw, 12rem)` | 64–192px |
| Hero fase 2 texto | `clamp(5rem, 14vw, 15rem)` | mismo que hero 1 |
| Títulos de sección grandes | `clamp(5rem, 10vw, 10rem)` | 80–160px |
| Subtítulos / phrases | `clamp(2rem, 4.5vw, 5rem)` | 32–80px |
| Título barrios / secciones | `clamp(2.5rem, 6vw, 7rem)` | 40–112px |
| Loader counter | `clamp(7rem, 20vw, 18rem)` | ENORME |
| Marquee palabras | `1rem` | 16px fijo |
| Label (metadata / tags) | `0.62rem` | 10px — uppercase + tracking |
| Body texto normal | implícito en font-body | 16px / line-height 1.6 |
| Barrio tag | `0.7rem` + `letter-spacing: 0.1em` | etiquetas |

### La clase `.label` — uso en toda la plataforma

```css
.label {
  font-family: var(--font-body);  /* DM Sans */
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.32em;         /* tracking muy abierto */
  text-transform: uppercase;
  color: var(--warm-gray);
}
```
**Usala para**: fechas, categorías, "desde 1974", "scroll", nombres de sección, captions.

### Line-height de los displays
Los títulos Bebas Neue siempre tienen `line-height: 0.88` — muy comprimido.
Body text: `line-height: 1.6`.

---

## 4. ESPACIADO Y AIRE — FILOSOFÍA "BREATHING ROOM"

### El contenedor y el gutter

```css
--container: 1440px;
--gutter: clamp(24px, 5vw, 80px);

.container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--gutter);
}
```

El gutter es fluido: en mobile 24px, en desktop hasta 80px.
**NUNCA uses padding fijo en secciones sin usar el gutter.**

### Padding vertical de secciones

```css
/* Sección generosa */
padding: clamp(100px, 14vw, 180px) 0;

/* Sección media */
padding: clamp(60px, 8vw, 100px) 0;
```

### Filosofía del diseño aireado

El sitio respira. Las secciones tienen mucho espacio vertical.
- Nunca apilar elementos sin margen entre sí.
- Los grids tienen `gap: 0` cuando el borde visual lo da el propio elemento.
- El espacio en blanco ES parte del diseño — no llenés todo.
- Las imágenes usan `aspect-ratio` en lugar de alturas fijas.
- Uso extensivo de `border: 1px solid var(--opacity-06/08)` como separadores sutiles.

---

## 5. SISTEMA DE TEMAS — DARK / LIGHT

El tema se maneja via `data-theme="light"` en `document.body`.

```jsx
// ThemeContext.jsx
// Default: 'light' — el sitio arranca en blanco/crema
const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'light')

// Al cambiar, se aplica o remueve el atributo:
document.body.setAttribute('data-theme', 'light')
// o
document.body.removeAttribute('data-theme')
```

### Transición circular (View Transitions API)

```jsx
// Toggle con expansión circular desde el punto de click
const transition = document.startViewTransition(() => setTheme(nextTheme))

transition.ready.then(() => {
  document.documentElement.animate(
    [
      { clipPath: `circle(0px at ${x}px ${y}px)` },
      { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
    ],
    { duration: 800, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
  )
})
```

```css
/* View transitions — sin animación por defecto para usar la custom */
::view-transition-old(root), ::view-transition-new(root) { animation: none; }
::view-transition-old(root) { z-index: 1; }
::view-transition-new(root) { z-index: 9999; }
```

**Regla**: Todos los colores deben usar variables. Los únicos hex hardcodeados permitidos son en `.ht-inner` (`#d9d4cc`) y `.ht2-inner` (`#0d0c0a`) porque el hero tiene lógica propia de color durante la transición de scroll.

---

## 6. SISTEMA DE IDIOMAS — ES / EN

### LanguageContext

```jsx
// Default: 'es' — español
const [lang, setLang] = useState(() => localStorage.getItem('app-lang') || 'es')

const toggleLang = () => {
  const next = lang === 'es' ? 'en' : 'es'
  localStorage.setItem('app-lang', next)
  setLang(next)
}
```

### Estructura de traducciones

```js
// data/translations.js
export const translations = {
  es: {
    nav: { proyectos, servicios, nosotros, contacto, toggleTheme, toggleLang, menu },
    footer: { tagline, copyright },
    home: { seoTitle, seoDesc, line1, line2, line3, creamos, espacios, marqueeWords, s2Words, stats, services, ... },
    proyectos: { ... },
    servicios: { ... },
    nosotros: { ... },
    contacto: { ... },
  },
  en: { /* misma estructura exacta */ }
}
```

### Uso en cualquier componente

```jsx
const { lang } = useLanguage()
const t = translations[lang].home  // o .nav, .footer, etc.

return <h2>{t.proyectosTitle}</h2>
```

**Regla**: NUNCA texto hardcodeado en JSX. Todo por `translations.js`. Excepciones: nombres propios como "Estudio Levinton", marcas, y el `<h1 className="sr-only">` de accesibilidad.

---

## 7. EASING CURVES — LAS CURVAS DE ANIMACIÓN

```css
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1)     /* ease out dramático — para entradas */
--ease-expo:   cubic-bezier(0.19, 1, 0.22, 1)     /* exponencial — para hero */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)     /* in-out — para transiciones */
```

En GSAP usamos strings equivalentes:
- `'power4.out'` — entradas rápidas y dramáticas (hero text, overlays)
- `'power3.out'` — entradas suaves (cards, navbar)
- `'power2.out'` — contadores, elementos secundarios
- `'power4.inOut'` — overlays, curtains (menú, loader salida)
- `'none'` — en ScrollTrigger con scrub (movimiento lineal)

---

## 8. GSAP — SISTEMA DE ANIMACIONES COMPLETO

### Setup global en App.jsx

```jsx
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// En ScrollReset: refresh después de navegar
setTimeout(() => ScrollTrigger.refresh(), 150)
```

### Patrón de contexto GSAP en componentes

```jsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // Todas las animaciones GSAP adentro del contexto
  })
  return () => ctx.revert()  // SIEMPRE cleanup al desmontar
}, [lang])  // Re-ejecutar cuando cambia el idioma
```

---

## 9. LOADER — ANIMACIÓN DE ENTRADA

**Duración total: ~2.9 segundos antes de que aparezca el hero.**

```jsx
// Loader.jsx — estructura HTML
<div className="page-loader" ref={loaderRef}>
  <span className="page-loader__counter" ref={counterRef}>0</span>
  <div className="page-loader__row">
    <img src={LOGO} className="page-loader__logo" ref={nameRef} />
    <div className="page-loader__bar-wrap">
      <div className="page-loader__bar" ref={barRef} />
    </div>
  </div>
</div>
```

```jsx
// Loader.jsx — animación GSAP
const tl = gsap.timeline({
  delay: 0.1,
  onComplete: () => {
    gsap.to(loaderRef.current, {
      clipPath: 'inset(100% 0% 0% 0%)',  // slide hacia arriba al terminar
      duration: 0.9,
      ease: 'power4.inOut',
    })
  }
})

tl.to(counterRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0)
tl.to(nameRef.current,    { opacity: 1,       duration: 0.4, ease: 'power2.out' }, 0.3)
tl.to(obj, {
  val: 100, duration: 2.0, ease: 'power1.inOut', snap: { val: 1 },
  onUpdate() {
    counterRef.current.textContent = Math.round(obj.val)
    barRef.current.style.transform = `scaleX(${obj.val / 100})`
  }
}, 0.2)
```

```css
.page-loader {
  position: fixed; inset: 0;
  background: var(--bg-main);
  z-index: 8000;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;  /* alineado abajo */
  padding: 7vh var(--gutter);
}
.page-loader__counter {
  font-family: var(--font-display);
  font-size: clamp(7rem, 20vw, 18rem);  /* ENORME */
  line-height: 0.82;
  color: var(--text-main);
  opacity: 0;
  transform: translateY(30px);
}
.page-loader__bar {
  height: 100%;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
}
```

---

## 10. HERO — EL EFECTO PRINCIPAL (YURDAER EFFECT)

Este es el corazón del sitio. Es la animación más compleja.

### Estructura HTML del Hero

```jsx
<div className="hero-wrap" ref={wrapRef}>        {/* 400vh — da el espacio de scroll */}
  <div className="hero-sticky" ref={stickyRef}>  {/* sticky 100vh — QUEDA FIJO */}

    <div className="hero-img-wrap" ref={imgWrapRef}>
      <img ref={imgRef} />
      <div className="hero-img-overlay" />        {/* overlay negro rgba(0,0,0,0.45) */}
    </div>

    {/* TEXTO 1: beige sobre foto — cae al scrollear */}
    <div className="hero-txt1">
      <div className="ht-line">                   {/* overflow:hidden = máscara */}
        <span className="ht-scroll-wrap" ref={l1Wrap}>
          <span className="ht-inner" ref={line1Ref}>CONSTRUIMOS</span>
        </span>
      </div>
      <div className="ht-line">
        <span className="ht-scroll-wrap" ref={l2Wrap}>
          <span className="ht-inner" ref={line2Ref}>CREAMOS</span>
        </span>
      </div>
      <div className="ht-line">
        <span className="ht-scroll-wrap" ref={l3Wrap}>
          <span className="ht-inner ht-inner--ghost" ref={line3Ref}>ZONA NORTE</span>
        </span>
      </div>
    </div>

    {/* TEXTO 2: negro sobre fondo blanco — aparece en fase C */}
    <div className="hero-txt2" ref={txt2Ref}>
      <div className="ht2-line">
        <span className="ht2-inner" ref={t2L1Ref}>PROYECTOS</span>
      </div>
      <div className="ht2-line">
        <span className="ht2-inner" ref={t2L2Ref}>PERSONALIZADOS</span>
      </div>
    </div>

    {/* BOTTOM STRIP — desaparece rápido al scrollear */}
    <div className="hero-bot" ref={botWrap}>
      <div ref={botRef}>
        <span className="label">Estudio Levinton · Desde 1974</span>
        <div className="hero-bot__scroll">
          <span className="label">Scroll</span>
          <div className="hero-bot__line"><div className="hero-bot__fill" /></div>
        </div>
      </div>
    </div>

  </div>
</div>
```

### CSS del Hero

```css
.hero-wrap {
  position: relative;
  height: 400vh;        /* ← espacio total de scroll */
  background: transparent;
}
.hero-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: var(--bg-main);   /* empieza oscuro → GSAP lo cambia a #ffffff */
  will-change: background-color;
  backface-visibility: hidden;
}
.hero-img-wrap {
  position: absolute; inset: 0;
  will-change: transform, border-radius;
  overflow: hidden; z-index: 1;
  backface-visibility: hidden;
}
.hero-img-wrap img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  will-change: transform;
  transform: translateZ(0);  /* Force GPU */
}
.hero-img-overlay {
  position: absolute; inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 2; will-change: opacity;
}

/* TEXTO 1 — abajo, encima de la imagen */
.hero-txt1 {
  position: absolute;
  bottom: 96px; left: 0; right: 0;
  padding: 0 var(--gutter);
  z-index: 3;
}
.ht-line {
  overflow: hidden;           /* ← LA MÁSCARA */
  line-height: 0.88;
  padding-top: 0.15em;       /* espacio para tildes */
  margin-top: -0.15em;
}
.ht-inner {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(5rem, 14vw, 15rem);
  color: #d9d4cc;             /* hardcoded — beige sobre foto oscura */
  letter-spacing: 0.01em;
  line-height: 0.88;
  will-change: transform;
}
.ht-inner--ghost {
  color: #d9d4cc;
  font-size: clamp(4rem, 11vw, 12rem);  /* ZONA NORTE un poco más pequeño */
}

/* TEXTO 2 — en negro, aparece cuando el fondo es blanco */
.hero-txt2 {
  position: absolute;
  bottom: 80px; left: 0; right: 0;
  padding: 0 var(--gutter);
  z-index: 4; pointer-events: none;
}
.ht2-line { overflow: hidden; line-height: 0.88; padding-top: 0.15em; margin-top: -0.15em; }
.ht2-inner {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(5rem, 14vw, 15rem);
  color: #0d0c0a;             /* hardcoded negro — sobre fondo blanco */
  letter-spacing: 0.01em;
  line-height: 0.88;
  will-change: transform;
}
```

### Las 3 FASES de la animación GSAP del Hero

#### Estado inicial (antes del entrance)

```js
// Los textos están debajo del .ht-line (overflow:hidden), por eso no se ven
gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], { yPercent: 110 })
gsap.set(imgWrapRef.current, { autoAlpha: 0 })
gsap.set(botRef.current, { autoAlpha: 0 })
gsap.set(txt2Ref.current, { autoAlpha: 0 })
gsap.set([t2L1Ref.current, t2L2Ref.current], { yPercent: 110 })
```

#### ENTRANCE (delay: 2.9s — sincronizado con el loader)

```js
const entrance = gsap.timeline({ delay: 2.9 })
entrance
  .to(imgWrapRef.current, { autoAlpha: 1, duration: 1, ease: 'power2.out' })
  .to(
    [line1Ref.current, line2Ref.current, line3Ref.current],
    { yPercent: 0, stagger: 0.12, duration: 1.1, ease: 'power4.out' },
    '-=0.4'  // overlap con la imagen
  )
  .to(botRef.current, { autoAlpha: 1, duration: 0.6 }, '-=0.5')
```

#### FASE A — Las líneas "caen" al hacer scroll (efecto ola)

```js
[
  { ref: l1Wrap, scrub: 0.3, end: '28% top' },  // cae primero
  { ref: l2Wrap, scrub: 0.5, end: '32% top' },  // cae segundo
  { ref: l3Wrap, scrub: 0.7, end: '36% top' },  // cae último — efecto ola
].forEach(({ ref, scrub, end }) => {
  gsap.to(ref.current, {
    yPercent: 160,  // cae hacia abajo, fuera del overflow:hidden
    ease: 'none',
    scrollTrigger: {
      trigger: wrapRef.current,  // el div de 400vh
      start: 'top top',
      end,
      scrub,
      invalidateOnRefresh: true,
      onUpdate: self => {
        if (self.progress > 0.01) entrance.progress(1)  // skip entrance si ya scrolleó
      }
    },
  })
})

// Bottom strip desaparece rápido
gsap.to(botWrap.current, {
  autoAlpha: 0, ease: 'none',
  scrollTrigger: { trigger: wrapRef.current, start: 'top top', end: '8% top', scrub: 0.3 },
})

// Overlay negro desaparece
gsap.to('.hero-img-overlay', {
  opacity: 0, ease: 'none',
  scrollTrigger: { trigger: wrapRef.current, start: '5% top', end: '30% top', scrub: 0.6 },
})

// Fondo del sticky pasa a BLANCO puro
gsap.to(stickyRef.current, {
  backgroundColor: '#ffffff', ease: 'none',
  scrollTrigger: { trigger: wrapRef.current, start: '12% top', end: '38% top', scrub: 0.8 },
})
```

#### FASE B — Imagen se achica (scale down + border-radius)

```js
// El wrapper se achica
gsap.fromTo(
  imgWrapRef.current,
  { scaleX: 1,    scaleY: 1,    borderRadius: 0 },
  { scaleX: 0.74, scaleY: 0.86, borderRadius: 14,
    ease: 'none', force3D: true,
    scrollTrigger: { trigger: wrapRef.current, start: '20% top', end: '65% top', scrub: 0.6 }
  }
)

// La imagen interna hace counter-scale (zoom compensatorio)
gsap.fromTo(
  imgRef.current,
  { scaleX: 1.15, scaleY: 1.15 },
  { scaleX: 1.69, scaleY: 1.45,
    ease: 'none', force3D: true,
    scrollTrigger: { trigger: wrapRef.current, start: '20% top', end: '65% top', scrub: 0.6 }
  }
)
```

**Resultado**: La imagen se "encoge" como si se metiera en un frame, mientras el background se vuelve blanco puro.

#### FASE C — Texto 2 aparece (en negro sobre blanco)

```js
gsap.to(txt2Ref.current, {
  autoAlpha: 1, ease: 'none',
  scrollTrigger: { trigger: wrapRef.current, start: '50% top', end: '58% top', scrub: 0.5 },
})
gsap.to(t2L1Ref.current, {
  yPercent: 0, ease: 'none',
  scrollTrigger: { trigger: wrapRef.current, start: '52% top', end: '70% top', scrub: 0.6 },
})
gsap.to(t2L2Ref.current, {
  yPercent: 0, ease: 'none',
  scrollTrigger: { trigger: wrapRef.current, start: '58% top', end: '75% top', scrub: 0.8 },
})
```

### Resumen del efecto hero en palabras

```
0vh   → Loader termina. Hero: foto full, texto beige encima, strip abajo.
↓ scroll
50vh  → Textos caen en ola (cada uno a distinta velocidad). Overlay desaparece.
        Fondo comienza a ponerse blanco.
150vh → Imagen se achica con border-radius. Queda como portrait en fondo blanco.
200vh → Texto 2 negro sube: "PROYECTOS / PERSONALIZADOS"
300vh → El hero sticky se libera. Scroll continúa normal.
400vh → Fin del hero-wrap. El resto del contenido empieza.
```

---

## 11. MARQUEE — TEXTO INFINITO

```jsx
<div className="s-marquee">
  <div className="s-marquee__track" ref={marRef}>
    {Array.from({ length: 6 }).flatMap(() => t.marqueeWords).map((w, i) => (
      <span key={i} className={w === '·' ? 's-marquee__dot' : 's-marquee__word'}>{w}</span>
    ))}
  </div>
</div>
```

```js
// Las palabras en translations.js:
// marqueeWords: ['LEVINTON','·','NAPOLEONE','·','ARQUITECTOS','·','DESDE 1974','·','BUENOS AIRES','·']

document.fonts.ready.then(() => {
  const repetitions = 6
  const totalW = track.scrollWidth / repetitions
  gsap.to(track, {
    x: -totalW,
    ease: 'none',
    duration: 25,     // 25 segundos por ciclo — lento y elegante
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => {
        const val = parseFloat(x) % totalW
        return val > 0 ? val - totalW : val
      })
    },
  })
})
```

```css
.s-marquee {
  overflow: hidden;
  background: var(--opacity-04);
  border-top: 1px solid var(--opacity-06);
  border-bottom: 1px solid var(--opacity-06);
  padding: 14px 0;
}
.s-marquee__word {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--opacity-30);
  letter-spacing: 0.14em;
  padding: 0 32px;
}
.s-marquee__dot {
  color: var(--accent);   /* puntos separadores en dorado */
  font-size: 0.7rem;
}
```

---

## 12. WORD-BY-WORD REVEAL — PATRÓN REUTILIZABLE

```jsx
{/* Siempre: padre con overflow:hidden, hijo con will-change */}
<div className="word-line">
  <span className="word-reveal mi-clase-especifica">TEXTO</span>
</div>
```

```css
.word-line { overflow: hidden; display: block; }
.word-reveal { display: block; will-change: transform, opacity; }
```

```js
gsap.utils.toArray('.word-reveal').forEach(word => {
  gsap.fromTo(word,
    { yPercent: 105, opacity: 0 },
    {
      yPercent: 0, opacity: 1,
      duration: 0.9, ease: 'power4.out',
      scrollTrigger: { trigger: word.closest('.word-line') || word, start: 'top 88%' },
    }
  )
})
```

---

## 13. IMAGE REVEAL — CLIP PATH DESDE ABAJO

```jsx
<div className="img-reveal">
  <img src={...} />
</div>
```

```js
gsap.utils.toArray('.img-reveal').forEach(wrap => {
  gsap.fromTo(wrap,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut',
      scrollTrigger: { trigger: wrap, start: 'top 85%' },
    }
  )
  const img = wrap.querySelector('img')
  if (img) gsap.from(img, {
    scale: 1.12, duration: 1.6, ease: 'power4.out',
    scrollTrigger: { trigger: wrap, start: 'top 85%' },
  })
})
```

---

## 14. STATS COUNTER — NÚMEROS ANIMADOS

```jsx
<div className="s-stat">
  <div className="s-stat__value">
    <span className="s-stat__num" data-target={300}>0</span>
    <span className="s-stat__suffix">+</span>
  </div>
  <p className="s-stat__label">Obras construidas</p>
</div>
```

```js
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
```

---

## 15. SCRUB-X — TEXTO HORIZONTAL CON PARALLAX

```jsx
{/* data-dir="left": empieza desplazado a la derecha, va hacia la izquierda */}
{/* data-dir="right": empieza desplazado a la izquierda, va hacia la derecha */}
<div className="scrub-x" data-dir="left">LEVINTON ARQUITECTOS</div>
<h2 className="scrub-x" data-dir="right">PROYECTOS SELECCIONADOS</h2>
```

```js
document.querySelectorAll('.scrub-x').forEach(el => {
  const isMobile = window.innerWidth < 768
  const distance = isMobile ? 15 : 80
  const dir = el.dataset.dir === 'right' ? distance : -distance
  gsap.fromTo(el, { x: -dir }, {
    x: dir, ease: 'none',
    scrollTrigger: {
      trigger: el.closest('section') || el,
      start: 'top bottom', end: 'bottom top',
      scrub: true,
    },
  })
})
```

---

## 16. PROJECT CARDS — FADE UP

```js
gsap.utils.toArray('.proj-item').forEach(item => {
  gsap.fromTo(item,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 88%' },
    }
  )
})
```

---

## 17. CTA — PARALLAX EN IMAGEN DE FONDO

```jsx
<section className="s8-cta">
  <div className="cta-bg">
    <img src={IMGS.cta} />
    <div className="s8-cta__overlay" />
  </div>
  <div className="s8-cta__content container">
    {/* texto encima */}
  </div>
</section>
```

```js
const ctaBg = document.querySelector('.cta-bg')
if (ctaBg) {
  gsap.to(ctaBg, {
    yPercent: 20, ease: 'none',
    scrollTrigger: { trigger: ctaBg.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true },
  })
}
```

---

## 18. NAVBAR — ANIMACIÓN Y COMPORTAMIENTO

```js
// Entrance sincronizado con el loader
gsap.fromTo(navRef.current,
  { y: -10, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 2.9 }
)

// Scroll state: a 30px agrega clase 'is-scrolled'
window.scrollY > 30 → setScrolled(true)
// La clase cambia el background a --nav-scrolled-bg (semitransparente)
```

### Menú overlay — clipPath wipe

```js
// ABRIR: barre de abajo hacia arriba
gsap.fromTo(overlay,
  { clipPath: 'inset(0% 0% 100% 0%)' },
  { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power4.inOut' }
)
// Links entran con stagger
gsap.fromTo(links,
  { y: 60, opacity: 0 },
  { y: 0, opacity: 1, stagger: 0.07, duration: 0.7, ease: 'power3.out', delay: 0.3 }
)

// CERRAR: barre hacia abajo
gsap.to(overlay, {
  clipPath: 'inset(0% 0% 100% 0%)',
  duration: 0.6, ease: 'power4.inOut',
  onComplete: () => gsap.set(overlay, { display: 'none' })
})
```

---

## 19. CURSOR PERSONALIZADO

```css
body { cursor: none; }
button { cursor: none; }

.cursor-dot {
  position: fixed;
  width: 5px; height: 5px;
  background: var(--text-main);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  top: 0; left: 0;
  transform: translate(-50%, -50%);
  will-change: transform;
}
.cursor-ring {
  position: fixed;
  width: 30px; height: 30px;
  border: 1px solid var(--opacity-75);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  top: 0; left: 0;
  transform: translate(-50%, -50%);
  will-change: transform;
}
@media (hover: none) {
  .cursor-dot, .cursor-ring { display: none; }
  body, button { cursor: auto; }
}
```

---

## 20. TRANSICIONES DE PÁGINA

```css
.transition-curtain {
  position: fixed; inset: 0;
  background: var(--bg-main);
  z-index: 7000;
  will-change: transform;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
}
```

Z-index stack:
- `9999+` — cursor dot
- `9998` — cursor ring
- `8000` — page loader
- `7000` — transition curtain
- `contenido` — navbar, páginas, footer

---

## 21. PERFORMANCE — BUENAS PRÁCTICAS

```css
/* En elementos que GSAP anima */
will-change: transform;
backface-visibility: hidden;
-webkit-backface-visibility: hidden;

/* GPU-force en imágenes dentro del hero */
transform: translateZ(0);
```

```jsx
// Preload de imagen hero en el componente
useEffect(() => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = IMGS.hero
  document.head.appendChild(link)
  return () => document.head.removeChild(link)
}, [])
```

---

## 22. SEO — ESTRUCTURA OBLIGATORIA

```jsx
// En cada página:
<SEO
  title={t.seoTitle}
  description={t.seoDesc}
  url="/ruta-de-la-pagina"
  schemaType="Organization"
/>

// El h1 visual está oculto pero es real para SEO:
<h1 className="sr-only">Estudio de arquitectura en Zona Norte — 40 años, más de 300 obras</h1>
```

---

## 23. ACCESIBILIDAD — REQUISITOS MÍNIMOS

```jsx
// Skip link en App.jsx
<a href="#main-content" className="skip-link">Saltar al contenido principal</a>
<div id="main-content">
  <AppRoutes />
</div>
```

```css
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## 24. REGLAS DE ORO — NUNCA ROMPAS ESTAS

1. **Colores**: Siempre variables CSS. Los únicos hex hardcodeados permitidos son `.ht-inner` (`#d9d4cc`) y `.ht2-inner` (`#0d0c0a`) por el efecto especial del hero.

2. **Fuentes**: Bebas Neue SOLO para display. DM Sans para absolutamente todo lo demás.

3. **GSAP**: Siempre dentro de `gsap.context()` con `ctx.revert()` en el cleanup del `useEffect`.

4. **Traducciones**: Ningún texto español o inglés hardcodeado en JSX. Todo por `translations.js`.

5. **ScrollTrigger**: `invalidateOnRefresh: true` en triggers complejos. `ScrollTrigger.refresh()` a los 150ms tras navegación.

6. **Imágenes**: Siempre `width` y `height` explícitos. Usar el componente `<Img>` del proyecto (no `<img>` directo).

7. **El hero mide siempre 400vh**. Si cambiás los tiempos del loader, actualizá el `delay: 2.9` del entrance sincronizadamente.

8. **El loader dura ~2.9s**. El entrance del hero y la navbar tienen ese mismo delay.

9. **Mobile**: El cursor desaparece en `(hover: none)`. Los `scrub-x` usan `distance: 15` en mobile vs `80` en desktop.

10. **Tema default**: `'light'`. El sitio arranca con fondo crema/beige. El dark mode es secundario.

---

## 25. CHECKLIST PARA NUEVA SECCIÓN O PÁGINA

- [ ] ¿Usé `--font-display` (Bebas Neue) para títulos grandes?
- [ ] ¿Usé `--font-body` (DM Sans) para todo lo demás?
- [ ] ¿Los tamaños usan `clamp()`?
- [ ] ¿Los colores usan variables CSS?
- [ ] ¿Los bordes usan `var(--opacity-06/08)`?
- [ ] ¿Las animaciones están dentro de `gsap.context()` con `ctx.revert()`?
- [ ] ¿Las imágenes tienen `className="img-reveal"`?
- [ ] ¿Los textos importantes tienen `.word-line > .word-reveal`?
- [ ] ¿El texto está en `translations.js` para ES y EN?
- [ ] ¿Hay `will-change: transform` en elementos animados?
- [ ] ¿Hay `<SEO>` con title y description?
- [ ] ¿Hay un `<h1>` aunque sea `.sr-only`?
- [ ] ¿Los elementos interactivos tienen `aria-label`?
- [ ] ¿Las secciones con texto horizontal usan `.scrub-x` con `data-dir`?
- [ ] ¿El componente hace `ScrollTrigger.refresh()` si hay cambios de layout?
