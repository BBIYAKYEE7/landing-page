import type { Metadata } from 'next';
import Link from 'next/link';
import { privacyPage } from '@/content/privacy';
import styles from './privacy.module.css';

export const metadata: Metadata = {
  title: '개인정보 처리방침 | U-TEED',
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/" className={styles.back}>← U-TEED</Link>
        <header className={styles.header}>
          <h1>{privacyPage.h1}</h1>
          <p>{privacyPage.effective.label}: <time dateTime={privacyPage.effective.dateTime}>{privacyPage.effective.text}</time></p>
        </header>
        <div className={styles.intro}>
          {privacyPage.intro.map(text => <p key={text}>{text}</p>)}
        </div>
        <nav className={styles.toc} aria-label={privacyPage.tocTitle}>
          <h2>{privacyPage.tocTitle}</h2>
          <ol>
            {privacyPage.sections.map(section => (
              <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>
            ))}
          </ol>
        </nav>
        {privacyPage.sections.map(section => (
          <section className={styles.section} id={section.id} key={section.id}>
            <h2>{section.heading}</h2>
            {section.blocks.map((block, index) => {
              if (block.kind === 'p') return <p key={index}>{block.text}</p>;
              if (block.kind === 'list') {
                return <ul key={index}>{block.items.map(item => <li key={item}>{item}</li>)}</ul>;
              }
              return (
                <div className={styles.rows} key={index}>
                  {block.title && <h3>{block.title}</h3>}
                  <dl>
                    {block.rows.map(row => (
                      <div className={styles.row} key={row.term}>
                        <dt>{row.term}</dt>
                        <dd>{row.href ? <a href={row.href}>{row.detail}</a> : row.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })}
          </section>
        ))}
      </div>
    </main>
  );
}
