'use client';
import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="btn btn-secondary btn-sm" aria-label="Alternar tema" title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}>
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
