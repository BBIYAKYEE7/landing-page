import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'U-TEED',
  description: '플랫폼의 새로운 기준, U-TEED',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

