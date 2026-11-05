import Link from 'next/link';
import { nav, primaryCta } from '@/content/site';
import HashLink from './HashLink';
import Logo from './Logo';
import MobileNav from './MobileNav';
import styles from './SiteHeader.module.css';

type Props = {
  /** 의뢰 페이지에서는 같은 곳을 가리키는 CTA를 숨긴다 */
  showCta?: boolean;
};

export default function SiteHeader({ showCta = true }: Props) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <Logo className={styles.logoImg} />
        </Link>

        <nav aria-label="주요 메뉴" className={styles.nav}>
          <ul className={styles.navList}>
            {nav.map((item) => (
              <li key={item.href}>
                <HashLink href={item.href} className={styles.navLink}>
                  {item.label}
                </HashLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA가 없으면 데스크톱에서는 빈 묶음이 간격을 차지하지 않게 숨긴다(모바일 메뉴 버튼은 그대로) */}
        <div className={`${styles.actions} ${showCta ? '' : styles.actionsNoCta}`}>
          <MobileNav items={nav} />
          {showCta && (
            <Link href={primaryCta.href} className="btn">
              {primaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
