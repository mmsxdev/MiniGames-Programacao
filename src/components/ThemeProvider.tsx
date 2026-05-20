'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme } from '@/types';

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'dark', toggle: () => {},
});

export function useTheme() { return useContext(ThemeContext); }

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('portugol-theme') as Theme | null;
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      setTimeout(() => {
        setTheme(saved);
      }, 0);
    }
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portugol-theme', next);
  };

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
