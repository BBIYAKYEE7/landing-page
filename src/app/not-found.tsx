import type { Metadata } from 'next';
import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import styles from './not-found.module.css';

// 홈의 canonical·공유 미리보기를 물려받지 않게 덮어쓴다(검색 제외)
const description = '주소를 다시 확인해 주세요.';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  description,
  robots: { index: false, follow: true },
  alternates: {},
  openGraph: { title: '페이지를 찾을 수 없습니다 | U-TEED', description },
  twitter: { card: 'summary', title: '페이지를 찾을 수 없습니다 | U-TEED', description },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <div className="container">
          <div className={styles.wrap}>
            <h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
            <p className={styles.text}>주소를 다시 확인해 주세요.</p>
            <div>
              <Link href="/" className="btn">
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
