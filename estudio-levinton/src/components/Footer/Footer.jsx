import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__brand">
          <span className="footer__logo">LEVINTON NAPOLEONE</span>
          <p className="footer__tagline">
            Diseño, construcción y supervisión integral de residencias. Desde 1974.
          </p>
        </div>

        <div className="footer__nav">
          <Link to="/proyectos" className="footer__link">Proyectos</Link>
          <Link to="/servicios" className="footer__link">Servicios</Link>
          <Link to="/nosotros"  className="footer__link">Nosotros</Link>
          <Link to="/contacto"  className="footer__link">Contacto</Link>
        </div>

        <div className="footer__contact">
          <a href="tel:+5491158098681" className="footer__link">+54 011 5809-8681</a>
          <a href="tel:+5491144227758" className="footer__link">+54 011 4422-7758</a>
          <a href="mailto:levintonnapoleone@gmail.com" className="footer__link">levintonnapoleone@gmail.com</a>
          <a href="https://instagram.com/estudio_levinton" target="_blank" rel="noreferrer" className="footer__link">Instagram</a>
          <a href="https://www.instagram.com/galeriapueblogarzon?igsh=MTZnNnI5NGl2aXdhdw==" target="_blank" rel="noreferrer" className="footer__link">Galeriapueblogarzon</a>
        </div>
      </div>

      <div className="footer__bottom container">
        <span className="footer__copy">© {new Date().getFullYear()} Estudio Levinton Napoleone</span>
        <span className="footer__copy">Buenos Aires, Argentina · Desde 1974</span>
      </div>
    </footer>
  )
}