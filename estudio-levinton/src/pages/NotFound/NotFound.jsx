import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { useLanguage } from '../../context/LanguageContext';
import './NotFound.css';

export default function NotFound() {
  const { lang } = useLanguage();

  const title = lang === 'en' ? '404 - Page Not Found' : '404 - Página no encontrada';
  const heading = lang === 'en' ? '404' : '404';
  const subheading = lang === 'en' ? 'Page Not Found' : 'Página no encontrada';
  const text = lang === 'en'
    ? 'The page you are looking for does not exist or has been moved.'
    : 'La página que estás buscando no existe o fue trasladada.';
  const backBtn = lang === 'en' ? 'Back to Home' : 'Volver al Inicio';

  return (
    <main className="nf-page">
      <SEO
        title={`${title} | Estudio Levinton`}
        description={text}
        url="https://estudiolevinton.com/404"
        noindex={true}
      />
      <div className="nf-container container">
        <h1 className="nf-code">{heading}</h1>
        <h2 className="nf-title">{subheading}</h2>
        <p className="nf-text">{text}</p>
        <Link to="/" className="nf-btn">
          <span>←</span> {backBtn}
        </Link>
      </div>
    </main>
  );
}
