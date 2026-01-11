import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'U-TEED',
  description: '지금 당신 주변의 모든 운동 - U-TEED',
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

