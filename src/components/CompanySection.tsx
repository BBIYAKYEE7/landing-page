import { company, companyBody, sectionTitles } from '@/content/site';
import { richText } from '@/lib/typography';
import Section from './Section';
import styles from './CompanySection.module.css';

export default function CompanySection() {
  return (
    <Section id="company" titleId="company-title">
      <div className="split">
        <h2 id="company-title" className="section-title">
          {sectionTitles.company}
        </h2>
        <div className={styles.body}>
          {/* [ ] 미션 문장이 정해지면 content/site.ts의 company.mission에 넣는다 */}
          {company.mission ? <p className={styles.mission}>{richText(company.mission)}</p> : null}
          {companyBody.map((paragraph) => (
            <p key={paragraph[0]} className={styles.paragraph}>
              {richText(paragraph.join(' '))}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
