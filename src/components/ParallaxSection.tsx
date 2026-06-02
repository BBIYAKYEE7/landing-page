'use client';

import { useRef, useEffect, useState, MutableRefObject } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useThemeLang } from './ThemeLanguageProvider';

interface ParallaxSectionProps {
  title: string;
  highlight: string;
  hashtag: string;
  image?: string | null;
  index: number;
  scrollY: number;
  detailLink: string;
  sectionRef?: MutableRefObject<HTMLElement | null>;
  id: string;
}

export default function ParallaxSection({
  title,
  highlight,
  hashtag,
  image,
  index,
  scrollY,
  detailLink,
  sectionRef,
  id,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const router = useRouter();
  const { lang } = useThemeLang();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Parallax offset (이미지에만 적용)
  const parallaxOffset = scrollY * 0.2 * (index + 1);

  // 버튼 클릭 핸들러
  const handleDetailClick = () => {
    router.push(detailLink);
  };

  // 프로젝트별 로고 경로 (MCI Link -> SITE 순서)
  const logoImages: { [key: number]: string } = {
    0: '/images/MCI_Link_logo.png',
    1: '/images/SITE_logo.png',
  };

  return (
    <section
      className="parallax-section"
      ref={(el) => {
        ref.current = el;
        if (sectionRef) sectionRef.current = el;
      }}
      id={id}
    >
      {/* 각 섹션별 로고 */}
      {logoImages[index] && (
        <Image
          src={logoImages[index]}
          alt={`${highlight} 로고`}
          width={320}
          height={320}
          className="parallax-logo-img"
          priority
        />
      )}
      <div className={`text-block ${inView ? 'show' : ''}`}>
        <h2>{title}</h2>
        <h1>{highlight}</h1>
        <p className="hashtag">{hashtag}</p>
        <button className="detail-btn" onClick={handleDetailClick}>
          {lang === 'ko' ? '자세히 보기' : 'Learn More'}
        </button>
      </div>
      {/* 두 번째, 세 번째 섹션: 아래 큰 이미지만 */}
      {index !== 0 && image && (
        <Image
          src={image}
          alt={highlight}
          width={320}
          height={400}
          className="parallax-img"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        />
      )}
    </section>
  );
}

