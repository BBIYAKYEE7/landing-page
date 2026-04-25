import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
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
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

