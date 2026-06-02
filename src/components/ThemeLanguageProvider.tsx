'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type Lang = 'ko' | 'en';

interface ThemeLanguageContextValue {
  theme: Theme;
  lang: Lang;
  toggleTheme: () => void;
  toggleLang: () => void;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextValue>({
  theme: 'light',
  lang: 'ko',
  toggleTheme: () => {},
  toggleLang: () => {},
});

export function useThemeLang() {
  return useContext(ThemeLanguageContext);
}

export default function ThemeLanguageProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [lang, setLang] = useState<Lang>('ko');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 저장된 설정 읽기, 없으면 시스템 설정 사용
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedLang = localStorage.getItem('lang') as Lang | null;

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ?? (systemDark ? 'dark' : 'light');
    const initialLang = savedLang ?? 'ko';

    setTheme(initialTheme);
    setLang(initialLang);
    document.documentElement.setAttribute('data-theme', initialTheme);
    document.documentElement.setAttribute('lang', initialLang === 'ko' ? 'ko' : 'en');
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  };

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'ko' ? 'en' : 'ko';
      localStorage.setItem('lang', next);
      document.documentElement.setAttribute('lang', next === 'ko' ? 'ko' : 'en');
      return next;
    });
  };

  if (!mounted) return null;

  return (
    <ThemeLanguageContext.Provider value={{ theme, lang, toggleTheme, toggleLang }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
}
