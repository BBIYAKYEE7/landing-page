import Link from 'next/link';
import { hero, primaryCta } from '@/content/site';
import { tidy } from '@/lib/typography';
import HashLink from './HashLink';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      {/* 페이지에서 유일한 장식: 무채색 점 패턴 1종 */}
      <div className={styles.pattern} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <h1 id="hero-title" className={styles.title}>
          {tidy(hero.headline)}
        </h1>
        <p className={styles.lead}>
          {hero.lead.map((sentence) => (
            <span key={sentence} className={styles.leadLine}>
              {tidy(sentence)}{' '}
            </span>
          ))}
        </p>
        <div className={styles.actions}>
          <Link href={primaryCta.href} className="btn">
            {primaryCta.label}
          </Link>
          <HashLink href={hero.secondaryLink.href} className="text-link">
            {hero.secondaryLink.label}
          </HashLink>
        </div>
      </div>
    </section>
  );
}
