'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

interface HeaderProps {
  onNavClick: (id: string) => void;
}

export default function Header({ onNavClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isDetailPage = pathname?.startsWith('/detail');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleMobileRouteClick = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
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
              src="/images/U-TEED.svg"
              alt="U-TEED"
              width={84}
              height={17}
              priority
              style={{ width: 'auto', height: '100%' }}
            />
          </div>
          <nav className="header-nav">
            <div 
              className="header-dropdown"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="header-dropdown-btn">서비스</button>
              {showDropdown && (
                <div className="header-dropdown-menu">
                  <div className="header-dropdown-menu-inner">
                    <button onClick={() => { router.push('/detail/1'); setShowDropdown(false); }}>
                      SITE
                      <span className="dropdown-desc">픽업게임 운영 플랫폼</span>
                    </button>
                    <button onClick={() => { router.push('/detail/2'); setShowDropdown(false); }}>
                      MCI Link
                      <span className="dropdown-desc">경도인지장애 조기 발견</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            {isDetailPage ? (
              <>
                <button onClick={() => onNavClick('beta')}>베타</button>
                <button onClick={() => onNavClick('partner')}>파트너</button>
              </>
            ) : (
              <button onClick={() => onNavClick('section-2')}>프로젝트 의뢰하기</button>
            )}
          </nav>
          <div className="header-cta">
            <a
              className="header-cta-btn"
              href="mailto:u-teed@u-teed.co.kr"
            >
              이메일 보내기
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
            <h3 className="mobile-menu-title">서비스</h3>
            <button onClick={() => handleMobileRouteClick('/detail/1')}>
              SITE
              <span className="mobile-menu-desc">픽업게임 운영 플랫폼</span>
            </button>
            <button onClick={() => handleMobileRouteClick('/detail/2')}>
              MCI Link
              <span className="mobile-menu-desc">경도인지장애 조기 발견</span>
            </button>
          </div>
          <div className="mobile-menu-section">
            {isDetailPage ? (
              <>
                <button onClick={() => handleMobileNavClick('beta')}>베타</button>
                <button onClick={() => handleMobileNavClick('partner')}>파트너</button>
              </>
            ) : (
              <button onClick={() => handleMobileNavClick('section-2')}>프로젝트 의뢰하기</button>
            )}
          </div>
          <div className="mobile-menu-section">
            <a
              className="mobile-cta-btn"
              href="mailto:u-teed@u-teed.co.kr"
              onClick={() => setMobileMenuOpen(false)}
            >
              이메일 보내기
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

