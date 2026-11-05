import Link from 'next/link';
import { company, footer } from '@/content/site';
import styles from './SiteFooter.module.css';

type Props = {
  /** 지금 보고 있는 페이지가 개인정보 처리방침이면 그 링크에 aria-current를 단다 */
  current?: 'privacy';
};

export default function SiteFooter({ current }: Props) {
  const rows = [
    { label: footer.labels.company, value: `${company.name} (${company.nameEn})` },
    { label: footer.labels.ceo, value: company.ceo },
    { label: footer.labels.bizNo, value: company.bizRegNo },
    { label: footer.labels.address, value: company.address },
  ];

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <dl className={styles.info}>
            {rows.map((row) => (
              <div key={row.label} className={styles.item}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
            <div className={styles.item}>
              <dt>{footer.labels.email}</dt>
              <dd>
                <a href={`mailto:${company.email}`} className={styles.email}>
                  {company.email}
                </a>
              </dd>
            </div>
          </dl>
          <div className={styles.bottom}>
            {/* 표준 개인정보 보호지침 제20조: '개인정보 처리방침' 명칭을 쓰고 다른 고지와 구분되게(굵게·주 텍스트 색) 표시 */}
            <Link
              href={footer.privacyLink.href}
              className={styles.privacy}
              aria-current={current === 'privacy' ? 'page' : undefined}
            >
              {footer.privacyLink.label}
            </Link>
            <p>{footer.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
