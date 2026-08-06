import { Link } from 'react-router-dom'
import { LOGO } from '../../config/media'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../data/translations'
import './Footer.css'

export default function Footer() {
  const { lang } = useLanguage()
  const t = translations[lang]

  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__brand">
          <Link to="/" className="footer__logo-link">
            <img src={LOGO} alt="Estudio Levinton Napoleone" className="footer__logo-img" width={64} height={64} />
          </Link>
          <p className="footer__tagline">
            {t.footer.tagline}
          </p>
        </div>

        <div className="footer__nav">
          <Link to="/proyectos" className="footer__link">{t.nav.proyectos}</Link>
          <Link to="/servicios" className="footer__link">{t.nav.servicios}</Link>
          <Link to="/nosotros"  className="footer__link">{t.nav.nosotros}</Link>
          <Link to="/contacto"  className="footer__link">{t.nav.contacto}</Link>
        </div>

        <div className="footer__contact">
          <a href="tel:+5491158098681" className="footer__link">+54 9 11 5809 8681</a>
          <a href="tel:+5491144227758" className="footer__link">+54 9 11 4422 7758</a>
          <a href="mailto:levintonnapoleone@gmail.com" className="footer__link">levintonnapoleone@gmail.com</a>
          <a href="https://instagram.com/estudio_levinton" target="_blank" rel="noreferrer" className="footer__link">@estudio_levinton</a>
          <a href="https://www.instagram.com/galeriapueblogarzon?igsh=MTZnNnI5NGl2aXdhdw==" target="_blank" rel="noreferrer" className="footer__link">@galeriapueblogarzon</a>
        </div>
      </div>

      <div className="footer__bottom container">
        <span className="footer__copy">© {new Date().getFullYear()} Estudio Levinton Napoleone</span>
        <span className="footer__copy">{t.footer.copyright}</span>
      </div>
    </footer>
  )
}