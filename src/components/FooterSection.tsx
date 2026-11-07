'use client';

import { RefObject } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useThemeLang } from './ThemeLanguageProvider';

interface FooterSectionProps {
  visible: boolean;
  footerRef: RefObject<HTMLElement>;
}

export default function FooterSection({ visible, footerRef }: FooterSectionProps) {
  const { theme, lang } = useThemeLang();
  return (
    <footer
      ref={footerRef}
      className={`footer-section ${visible ? 'footer-visible' : ''}`}
    >
      <div
        className="footer-content company-footer"
        style={{
          fontFamily: "'Pretendard', 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontWeight: 400,
          fontSize: '1.05rem',
          lineHeight: 1.7,
          textAlign: 'left',
          maxWidth: 900,
          margin: '0 auto',
          padding: '2.5rem 1.5rem',
        }}
      >
        <div
          style={{
            marginBottom: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            height: '12px'
          }}
        >
          <Image
            src={theme === 'dark' ? '/images/U-TEED(d).svg' : '/images/U-TEED.svg'}
            alt="U-TEED"
            width={59}
            height={12}
            priority
            style={{ width: 'auto', height: '100%' }}
          />
        </div>
        <div>{lang === 'ko' ? '사업자 등록번호 : 772-88-04055 | 대표 : 임태호' : 'Business Reg. No.: 772-88-04055 | CEO: Taeho Lim'}</div>
        <div>{lang === 'ko' ? '통신판매업 신고: 제 2026-서울영등포-2173 호 | 호스팅 제공자: Vercel Inc.' : 'Mail-Order Business Registration: No. 2026-서울영등포-2173 | Hosting Provider: Vercel Inc.'}</div>
        <div>{lang === 'ko' ? '07250 서울특별시 영등포구 영중로24길 10, 2층 232호 (영등포동5가, 영포복합건물)' : '07250 Seoul, South Korea, 10, Yeongchung-ro 24-gil, 2F 232, Yeongdeungpo-dong 5-ga, Yeongpo Complex Building'}</div>
        <div>{lang === 'ko' ? '이메일: u-teed@u-teed.co.kr' : 'Email: u-teed@u-teed.co.kr'}</div>
        <div>Copyright © 2026 U-TEED. All Rights Reserved.</div>
        <Link href="/privacy" className="footer-privacy-link">
          {lang === 'ko' ? '개인정보 처리방침' : 'Privacy Policy'}
        </Link>
        {/* 버튼 영역 */}
        <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1.7rem' }}>
          <a
            href="https://instagram.com/site_uteed"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-btn"
            aria-label="Instagram"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
            </svg>
          </a>
          <a href="mailto:u-teed@u-teed.co.kr" target="_blank" rel="noopener noreferrer" className="footer-btn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4h20v16H2V4zm2 2v12h16V6H4zm8 5l8-5H4l8 5zm0 2l-8-5v10h16V8l-8 5z"
                fill="#fff"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
