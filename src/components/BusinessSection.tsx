import Image from 'next/image';
import { businessIntro, products, sectionTitles } from '@/content/site';
import { richText, tidy } from '@/lib/typography';
import Section from './Section';
import styles from './BusinessSection.module.css';

export default function BusinessSection() {
  return (
    <Section id="business" titleId="business-title">
      <div className={styles.head}>
        <h2 id="business-title" className="section-title">
          {sectionTitles.business}
        </h2>
        {businessIntro ? <p className={styles.intro}>{richText(businessIntro)}</p> : null}
      </div>

      <ul role="list" className={styles.list}>
        {products.map((product) => (
          <li key={product.id}>
            <article className={styles.panel} aria-labelledby={`product-${product.id}`}>
              <div className={styles.text}>
                <h3 id={`product-${product.id}`} className={styles.name} lang="en">
                  {product.name}
                </h3>
                <p className={styles.definition}>{richText(product.definition)}</p>
                {product.features.length > 0 ? (
                  <ul role="list" className={`row-list ${styles.features}`}>
                    {product.features.map((feature) => (
                      <li key={feature}>{tidy(feature)}</li>
                    ))}
                  </ul>
                ) : null}
                {/* [ ] 링크가 비어 있는 제품은 링크를 그리지 않는다 */}
                {product.link ? (
                  <a href={product.link.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                    {/* 밑줄은 글자에만, 화살표는 장식 */}
                    <span className={styles.linkText}>{richText(product.link.label)}</span>
                    <span aria-hidden="true">↗</span>
                    <span className="sr-only">(새 창)</span>
                  </a>
                ) : null}
              </div>

              {/* [ ] 실제 스크린샷이 없으면 --bg 단색 면에 제품명만 둔다(가짜 화면 금지) */}
              {product.media ? (
                <Image
                  className={styles.media}
                  src={product.media.src}
                  alt={product.media.alt}
                  width={product.media.width}
                  height={product.media.height}
                  sizes="(max-width: 768px) 100vw, 640px"
                />
              ) : (
                <div className={styles.media} aria-hidden="true">
                  <span className={styles.mediaName} lang="en">
                    {product.name}
                  </span>
                </div>
              )}
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
