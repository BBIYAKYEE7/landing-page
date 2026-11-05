import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HashLink from '@/components/HashLink';
import { meta } from '@/content/site';
// Pretendard 하나로 한글·라틴 모두. 쓰는 굵기(400·600·700)의 @font-face와 글꼴 파일(public/fonts)을 모두 사이트에서 제공한다
import './pretendard.css';
import './globals.css';

export const metadata: Metadata = {
  // 실제 주소는 www다(u-teed.co.kr는 www로 308 리디렉트). canonical·공유 미리보기 주소가 리디렉트를 거치지 않게
  metadataBase: new URL('https://www.u-teed.co.kr'),
  title: {
    default: meta.homeTitle,
    template: '%s | U-TEED',
  },
  description: meta.homeDescription,
  alternates: { canonical: '/' },
  icons: {
    icon: '/images/U-TEED.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'U-TEED',
    url: '/',
    title: meta.homeTitle,
    description: meta.homeDescription,
  },
  twitter: {
    card: 'summary',
    title: meta.homeTitle,
    description: meta.homeDescription,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const licenseUrl = 'https://creativecommons.org/licenses/by-nc-nd/4.0/';

  return (
    <html lang="ko">
      <head>
        <link rel="license" href={licenseUrl} />
      </head>
      <body>
        {/* 기본 해시 이동은 Next 라우터가 모르는 히스토리 항목을 만들어 뒤로 가기를 멈추게 하므로 HashLink로 */}
        <HashLink href="#main" className="skip-link">
          본문 바로가기
        </HashLink>
        {children}
      </body>
    </html>
  );
}
