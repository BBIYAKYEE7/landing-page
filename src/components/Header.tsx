'use client';

import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  onNavClick: (id: string) => void;
}

export default function Header({ onNavClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogoClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <span 
          className="header-logo" 
          style={{ cursor: 'pointer' }} 
          onClick={handleLogoClick}
        >
          U-TEED
        </span>
        <nav className="header-nav">
          <button onClick={() => onNavClick('section-1')}>SPOT</button>
          <button onClick={() => onNavClick('section-2')}>프로젝트 의뢰하기</button>
        </nav>
      </div>
    </header>
  );
}

