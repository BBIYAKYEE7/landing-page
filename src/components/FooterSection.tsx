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
            marginBottom: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            height: '12px'
          }}
        >
          <Image
            src="/images/U-TEED.svg"
            alt="U-TEED"
            width={59}
            height={12}
            priority
            style={{ width: 'auto', height: '100%' }}
          />
        </div>
        <div>사업자 등록번호 : 772-88-04055 | 대표 : 임태호</div>
        <div>03777 서울특별시 서대문구 연세로2나길 61, 1층(창천동, 캠퍼스타운 에스큐브)</div>
        <div>이메일: u-teed@u-teed.co.kr</div>
        <div>Copyright © 2026 U-TEED. All Rights Reserved.</div>
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
    </section>
  );
}

