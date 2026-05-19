import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { useTheme } from '../../context/ThemeContext'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navRef      = useRef(null)
  const overlayRef  = useRef(null)
  const linksRef    = useRef([])
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => { setOpen(false) }, [pathname])

  // entrance after loader
  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 2.9 }
    )
  }, [])

  // open / close overlay animation
  useEffect(() => {
    const overlay = overlayRef.current
    const links   = linksRef.current.filter(Boolean)
    if (open) {
      gsap.set(overlay, { display: 'flex' })
      gsap.fromTo(overlay,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power4.inOut' }
      )
      gsap.fromTo(links,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.7, ease: 'power3.out', delay: 0.3 }
      )
    } else {
      gsap.to(overlay, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.6,
        ease: 'power4.inOut',
        onComplete: () => gsap.set(overlay, { display: 'none' })
      })
    }
  }, [open])

  const links = [
    { label: 'Proyectos', to: '/proyectos' },
    { label: 'Servicios', to: '/servicios' },
    { label: 'Nosotros',  to: '/nosotros'  },
    { label: 'Contacto',  to: '/contacto'  },
  ]

  return (
    <>
      <nav ref={navRef} className="nav" style={{ opacity: 0 }}>
        <div className="nav__inner container">
          <Link to="/" className="nav__logo">
            <span className="nav__logo-name">Levinton Napoleone</span>
            <span className="nav__logo-sub">Arquitectos</span>
          </Link>
          <div className="nav__actions">
            <button className="nav__theme-toggle" onClick={toggleTheme} aria-label="Alternar tema">
              {theme === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <button
              className={`nav__burger${open ? ' is-open' : ''}`}
              onClick={() => setOpen(v => !v)}
              aria-label="Menú"
            >
              <span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen overlay */}
      <div className="nav-overlay" ref={overlayRef} style={{ display: 'none' }}>

        <div className="nav-overlay__links">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-overlay__link${pathname === l.to ? ' is-active' : ''}`}
              ref={el => linksRef.current[i] = el}
              onClick={() => setOpen(false)}
            >
              <span className="nav-overlay__link-num">0{i + 1}</span>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="nav-overlay__footer">
          <div className="nav-overlay__phones">
            <a href="tel:+5491158098681" className="nav-overlay__social">+54 011 5809-8681</a>
            <a href="tel:+5491144227758" className="nav-overlay__social">+54 011 4422-7758</a>
          </div>
          <a href="https://instagram.com/estudio_levinton" target="_blank" rel="noreferrer" className="nav-overlay__social">Instagram</a>
        </div>
      </div>
    </>
  )
}