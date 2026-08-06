import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('app-lang') || 'es';
    }
    return 'es';
  });

  const toggleLang = () => {
    const next = lang === 'es' ? 'en' : 'es';
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('app-lang', next);
    }
    setLang(next);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
