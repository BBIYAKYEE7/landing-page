import type { Metadata } from 'next';
import './globals.css';
import ThemeLanguageProvider from '@/components/ThemeLanguageProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://u-teed.co.kr'),
  title: 'U-TEED',
  description: '플랫폼의 새로운 기준, U-TEED',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'U-TEED',
    description: '플랫폼의 새로운 기준, U-TEED',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'U-TEED',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'U-TEED',
    description: '플랫폼의 새로운 기준, U-TEED',
    images: ['/images/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const licenseUrl = 'https://creativecommons.org/licenses/by-nc-nd/4.0/';

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="license" href={licenseUrl} />
        {/* 페이지 로드 시 깜빡임 없이 테마 적용 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeLanguageProvider>{children}</ThemeLanguageProvider>
      </body>
    </html>
  );
}

