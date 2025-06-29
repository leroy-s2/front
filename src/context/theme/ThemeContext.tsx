import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';


type Theme = 'Sistema' | 'Claro' | 'Oscuro';

interface ThemeContextType {
  tema: Theme;
  setTema: (tema: Theme) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [tema, setTema] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'Sistema';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (tema === 'Sistema') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return tema === 'Oscuro';
  });

  useEffect(() => {
    const updateTheme = () => {
      let newIsDarkMode: boolean;
      
      if (tema === 'Sistema') {
        newIsDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        newIsDarkMode = tema === 'Oscuro';
      }
      
      setIsDarkMode(newIsDarkMode);
      
      // Aplicar tema al document
      if (newIsDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    // Escuchar cambios en el tema del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (tema === 'Sistema') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Guardar tema en localStorage
    localStorage.setItem('theme', tema);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [tema]);

  return (
    <ThemeContext.Provider value={{ tema, setTema, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
}