'use client';

import { RefObject } from 'react';
import Image from 'next/image';

interface FooterSectionProps {
  visible: boolean;
  footerRef: RefObject<HTMLElement>;
}

export default function FooterSection({ visible, footerRef }: FooterSectionProps) {
  return (
    <section
      ref={footerRef}
      className={`parallax-section footer-section ${visible ? 'footer-visible' : ''}`}
    >
      <div
        className="footer-content company-footer"
        style={{
          fontFamily: "'Pretendard', 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          color: '#6B7684',
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
            fontWeight: 700,
            fontSize: '1.25rem',
            color: '#222',
            fontFamily: "'Pretendard', 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            marginBottom: '0.7rem',
          }}
        >
          U-TEED
        </div>
        <div>사업자 등록번호 : 000-00-00000 | 대표 : 임태호</div>
        <div>이메일: site@u-teed.co.kr</div>
        <div>Copyright © 2025 ~ 2026 U-TEED. All Rights Reserved.</div>
        <div></div>
        {/* 버튼 영역 */}
        <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1.7rem' }}>
          <a
            href="https://instagram.com/site_uteed"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-btn"
          >
            <Image
              src="/images/instagram.png"
              alt="Instagram"
              width={16}
              height={16}
            />
          </a>
          <a href="mailto:admin@u-teed.co.kr" className="footer-btn">
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
    </section>
  );
}

