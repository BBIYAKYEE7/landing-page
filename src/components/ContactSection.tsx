import { company, contact, sectionTitles } from '@/content/site';
import Section from './Section';
import styles from './ContactSection.module.css';

export default function ContactSection() {
  return (
    <Section id="contact" titleId="contact-title">
      <div className="split">
        <h2 id="contact-title" className="section-title">
          {sectionTitles.contact}
        </h2>
        <div className={styles.body}>
          {contact.body.map((sentence) => (
            <p key={sentence} className={styles.text}>
              {sentence}
            </p>
          ))}
          {/* 문의는 이메일 링크만 둔다 */}
          <a href={`mailto:${company.email}`} className={styles.email}>
            {company.email}
          </a>
        </div>
      </div>
    </Section>
  );
}
