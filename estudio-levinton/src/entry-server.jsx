import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoutes } from './App';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';
import Cursor from './components/Cursor/Cursor';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import { TransitionProvider } from './context/TransitionContext';

export function render(url) {
  const helmetContext = {};

  const html = renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <ThemeProvider>
          <LanguageProvider>
            <MemoryRouter initialEntries={[url]}>
              <TransitionProvider>
                <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
                <WhatsAppButton />
                <Loader />
                <Cursor />
                <Navbar />
                <div id="main-content">
                  <AppRoutes />
                </div>
                <Footer />
              </TransitionProvider>
            </MemoryRouter>
          </LanguageProvider>
        </ThemeProvider>
      </HelmetProvider>
    </React.StrictMode>
  );

  return {
    html,
    helmet: helmetContext.helmet
  };
}
