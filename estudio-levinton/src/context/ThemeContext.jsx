import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Inicializar leyendo localStorage o por defecto 'dark' (que es el default del plan)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'dark';
  });

  useEffect(() => {
    // Almacenar preferencia
    localStorage.setItem('app-theme', theme);
    // Aplicar clase al body para el ruteo CSS global
    if (theme === 'light') {
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleTheme = (e) => {
    const isDark = theme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    // Si el navegador no soporta View Transitions, simplemente cambiar
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // Obtener coordenadas del click para que la expansión salga del botón
    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;
    
    // Calcular la distancia máxima para que el círculo cubra toda la pantalla
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      // Este código se ejecuta sincrónicamente para cambiar el DOM de inmediato
      setTheme(nextTheme);
      // Actualizamos inmediatamente el body para que la captura nueva tenga el color correcto
      if (nextTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
      } else {
        document.body.removeAttribute('data-theme');
      }
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        [
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
        ],
        {
          duration: 800,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
