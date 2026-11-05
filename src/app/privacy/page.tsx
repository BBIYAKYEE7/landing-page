import HashLink from '@/components/HashLink';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { privacyPage, type PolicyBlock } from '@/content/privacy';
import { meta } from '@/content/site';
import { pageMetadata } from '@/lib/metadata';
import { tidy } from '@/lib/typography';
import styles from './privacy.module.css';

export const metadata = pageMetadata({ title: meta.privacyTitle, description: meta.privacyDescription, path: '/privacy' });

function Block({ block, id }: { block: PolicyBlock; id: string }) {
  if (block.kind === 'p') {
    return <p>{tidy(block.text)}</p>;
  }

  if (block.kind === 'list') {
    return (
      <ul className="row-list">
        {block.items.map((item) => (
          <li key={item}>{tidy(item)}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.group}>
      {block.title && (
        <h3 id={id} className={styles.groupTitle}>
          {tidy(block.title)}
        </h3>
      )}
      <dl className="row-list">
        {block.rows.map((row) => (
          <div key={row.term} className={styles.row}>
            <dt>{tidy(row.term)}</dt>
            <dd>
              {row.href ? (
                <a href={row.href} className="text-link">
                  {tidy(row.detail)}
                </a>
              ) : (
                tidy(row.detail)
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function PrivacyPage() {
  const { h1, effective, tocTitle, intro, sections } = privacyPage;

  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <div className="container">
          <article className={styles.article} aria-labelledby="privacy-title">
            <header className={styles.head}>
              <h1 id="privacy-title" className={styles.title}>
                {h1}
              </h1>
              <p className={styles.meta}>
                {effective.label} <time dateTime={effective.dateTime}>{effective.text}</time>
              </p>
            </header>

            {intro.map((text) => (
              <p key={text}>{tidy(text)}</p>
            ))}

            <nav aria-labelledby="privacy-toc-title" className={styles.block}>
              <h2 id="privacy-toc-title" className={styles.blockTitle}>
                {tocTitle}
              </h2>
              <ol className="row-list">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    {/* 같은 페이지 이동은 HashLink로(뒤로 가기·포커스 처리) */}
                    <HashLink href={`#${section.id}`} className="text-link">
                      {`${index + 1}. ${section.heading}`}
                    </HashLink>
                  </li>
                ))}
              </ol>
            </nav>

            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                tabIndex={-1}
                className={styles.block}
              >
                <h2 id={`${section.id}-title`} className={styles.blockTitle}>
                  {`${index + 1}. ${section.heading}`}
                </h2>
                {section.blocks.map((block, blockIndex) => (
                  <Block key={`${section.id}-${blockIndex}`} block={block} id={`${section.id}-${blockIndex}`} />
                ))}
              </section>
            ))}
          </article>
        </div>
      </main>
      <SiteFooter current="privacy" />
    </>
  );
}
