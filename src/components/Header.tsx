'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useThemeLang } from './ThemeLanguageProvider';

interface HeaderProps {
  onNavClick: (id: string) => void;
}

export default function Header({ onNavClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isDetailPage = pathname?.startsWith('/detail');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, lang, toggleTheme, toggleLang } = useThemeLang();

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
            <button
              className="header-toggle-btn"
              onClick={toggleLang}
              aria-label="언어 전환"
              title={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
            >
              {lang === 'ko' ? 'EN' : '한'}
            </button>
            <button
              className="header-toggle-btn"
              onClick={toggleTheme}
              aria-label="다크모드 전환"
              title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
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
            <button className="mobile-toggle-btn" onClick={toggleLang}>
              {lang === 'ko' ? '🌐 English로 전환' : '🌐 한국어로 전환'}
            </button>
            <button className="mobile-toggle-btn" onClick={toggleTheme}>
              {theme === 'light' ? (lang === 'ko' ? '🌙 다크 모드' : '🌙 Dark Mode') : (lang === 'ko' ? '☀️ 라이트 모드' : '☀️ Light Mode')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

