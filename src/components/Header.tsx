'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useThemeLang } from './ThemeLanguageProvider';

interface HeaderProps {
  onNavClick: (id: string) => void;
}

function HeaderPreferences({ active = true }: { active?: boolean }) {
  const { theme, lang, toggleTheme, toggleLang } = useThemeLang();
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!active) setLanguageOpen(false);
  }, [active]);

  useEffect(() => {
    if (!languageOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !languageRef.current?.contains(event.target)) {
        setLanguageOpen(false);
      }
    };
    const handleFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Node && !languageRef.current?.contains(event.target)) {
        setLanguageOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setLanguageOpen(false);
        languageButtonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [languageOpen]);

  return (
    <>
      <div className="header-language" ref={languageRef}>
        <span className="preference-label">{lang === 'ko' ? '언어' : 'Language'}</span>
        <button
          ref={languageButtonRef}
          type="button"
          className="language-trigger"
          aria-label={lang === 'ko' ? '언어 선택' : 'Select language'}
          aria-expanded={languageOpen}
          aria-controls={menuId}
          onClick={() => setLanguageOpen(open => !open)}
        >
          <span>{lang === 'ko' ? '한국어' : 'English'}</span>
          <span className="language-chevron" aria-hidden="true" />
        </button>
        <div
          id={menuId}
          className="language-menu"
          role="group"
          aria-label={lang === 'ko' ? '언어 선택' : 'Select language'}
          hidden={!languageOpen}
        >
          {(['ko', 'en'] as const).map(option => (
            <label key={option} className="language-option">
              <input
                type="radio"
                name={`language-${menuId}`}
                value={option}
                checked={lang === option}
                onChange={() => {
                  if (lang !== option) toggleLang();
                  setLanguageOpen(false);
                  languageButtonRef.current?.focus();
                }}
                onClick={() => {
                  if (lang === option) {
                    setLanguageOpen(false);
                    languageButtonRef.current?.focus();
                  }
                }}
              />
              <span>{option === 'ko' ? '한국어' : 'English'}</span>
              {lang === option && <span className="language-check" aria-hidden="true">✓</span>}
            </label>
          ))}
        </div>
      </div>
      <div className="header-theme">
        <span className="preference-label">{lang === 'ko' ? '다크 모드' : 'Dark mode'}</span>
        <button
          type="button"
          className="theme-switch"
          role="switch"
          aria-checked={theme === 'dark'}
          aria-label={lang === 'ko' ? '다크 모드' : 'Dark mode'}
          onClick={toggleTheme}
        >
          <span className="theme-switch-thumb" aria-hidden="true">{theme === 'dark' ? '☾' : '☀'}</span>
        </button>
      </div>
    </>
  );
}

export default function Header({ onNavClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isDetailPage = pathname?.startsWith('/detail');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, lang } = useThemeLang();

  const handleLogoClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleMobileNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavClick(id);
  };

  return (
    <>
      <header className="main-header">
        <div className="header-content">
          <div
            className="header-logo"
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              height: '17px'
            }}
            onClick={handleLogoClick}
          >
            <Image
              src={theme === 'dark' ? '/images/U-TEED(d).svg' : '/images/U-TEED.svg'}
              alt="U-TEED"
              width={84}
              height={17}
              priority
              style={{ width: 'auto', height: '100%' }}
            />
          </div>
          <nav className="header-nav">
            {isDetailPage ? (
              <>
                <button onClick={() => onNavClick('beta')}>{lang === 'ko' ? '베타' : 'Beta'}</button>
                <button onClick={() => onNavClick('partner')}>{lang === 'ko' ? '파트너' : 'Partners'}</button>
              </>
            ) : (
              <button onClick={() => onNavClick('section-2')}>{lang === 'ko' ? '프로젝트 의뢰하기' : 'Contact Us'}</button>
            )}
          </nav>
          <div className="header-cta">
            <HeaderPreferences />
            <a
              className="header-cta-btn"
              href="mailto:u-teed@u-teed.co.kr"
            >
              {lang === 'ko' ? '이메일 보내기' : 'Send Email'}
            </a>
          </div>
          
          <button 
            className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="메뉴 열기"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-section">
            {isDetailPage ? (
              <>
                <button onClick={() => handleMobileNavClick('beta')}>{lang === 'ko' ? '베타' : 'Beta'}</button>
                <button onClick={() => handleMobileNavClick('partner')}>{lang === 'ko' ? '파트너' : 'Partners'}</button>
              </>
            ) : (
              <button onClick={() => handleMobileNavClick('section-2')}>{lang === 'ko' ? '프로젝트 의뢰하기' : 'Contact Us'}</button>
            )}
          </div>
          <div className="mobile-menu-section">
            <a
              className="mobile-cta-btn"
              href="mailto:u-teed@u-teed.co.kr"
              onClick={() => setMobileMenuOpen(false)}
            >
              {lang === 'ko' ? '이메일 보내기' : 'Send Email'}
            </a>
          </div>
          <div className="mobile-menu-section mobile-menu-toggles">
            <HeaderPreferences active={mobileMenuOpen} />
          </div>
        </div>
      </div>
    </>
  );
}
