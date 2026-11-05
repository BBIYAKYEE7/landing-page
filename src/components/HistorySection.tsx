import { history, sectionTitles } from '@/content/site';
import { tidy } from '@/lib/typography';
import Section from './Section';
import styles from './HistorySection.module.css';

export default function HistorySection() {
  const { columns } = history;

  return (
    <Section id="history" titleId="history-title">
      <div className="split">
        <h2 id="history-title" className="section-title">
          {sectionTitles.history}
        </h2>

        <div className={styles.groups}>
          {/* 열 이름은 화면에만. 화면 낭독기에는 칸마다 숨은 이름을 붙인다 */}
          <div className={`${styles.row} ${styles.columns}`} aria-hidden="true">
            <span>{columns.year}</span>
            <span>{columns.content}</span>
            <span>{columns.product}</span>
          </div>

          {history.groups.map((group) => (
            <section key={group.id} className={styles.group} aria-labelledby={`history-${group.id}`}>
              <h3 id={`history-${group.id}`} className={styles.groupLabel}>
                {group.label}
              </h3>
              <ol role="list" className="row-list">
                {group.rows.map((row) => (
                  <li key={`${row.year}-${row.content}`} className={styles.row}>
                    <span className={styles.year}>
                      <span className="sr-only">{columns.year} </span>
                      <time dateTime={row.dateTime}>{row.year}</time>
                    </span>
                    <span className={styles.content}>{tidy(row.content)}</span>
                    <span className={styles.product}>
                      {row.product ? (
                        <>
                          <span className="sr-only">{columns.product} </span>
                          <span className={styles.tag} lang="en">
                            {row.product}
                          </span>
                        </>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </Section>
  );
}
