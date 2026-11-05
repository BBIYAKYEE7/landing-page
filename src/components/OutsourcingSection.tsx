import Link from 'next/link';
import { outsourcing, primaryCta, sectionTitles } from '@/content/site';
import { tidy } from '@/lib/typography';
import Section from './Section';
import styles from './OutsourcingSection.module.css';

export default function OutsourcingSection() {
  return (
    <Section id="outsourcing" titleId="outsourcing-title">
      <div className="split">
        <div className={styles.head}>
          <h2 id="outsourcing-title" className="section-title">
            {sectionTitles.outsourcing}
          </h2>
          {outsourcing.intro ? <p className={styles.intro}>{tidy(outsourcing.intro)}</p> : null}
        </div>

        <div className={styles.body}>
          {/* 제공 분야: 카드 대신 0.5px 구분선 행 */}
          <div className={styles.block}>
            {outsourcing.areasHeading ? (
              <h3 className={styles.blockTitle}>{outsourcing.areasHeading}</h3>
            ) : null}
            <ul role="list" className="row-list">
              {outsourcing.areas.map((area) => (
                <li key={area.name} className={styles.area}>
                  <h4 className={styles.areaName}>{tidy(area.name)}</h4>
                  <ul role="list" className={styles.items}>
                    {area.items.map((item) => (
                      <li key={item}>{tidy(item)}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          {/* 진행 방식: 실제 순서라 번호를 쓴다 */}
          <div className={styles.block}>
            <h3 className={styles.blockTitle}>{outsourcing.processHeading}</h3>
            <ol role="list" className={styles.process}>
              {outsourcing.process.map((step, index) => (
                <li key={step} className={styles.step}>
                  <span className={styles.stepNo}>{index + 1}</span>
                  <span className={styles.stepName}>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <Link href={primaryCta.href} className="btn">
              {primaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
