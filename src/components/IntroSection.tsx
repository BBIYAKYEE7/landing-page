'use client';

import { useEffect, useState, useRef, RefObject } from 'react';
import Image from 'next/image';

interface IntroSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
}

const phrases = [
  { text: 'Fast to Act.', sub: '빠르게 행동하고' },
  { text: 'Smart in Action.', sub: '똑똑하게 실행합니다' },
];

const stats = [
  { target: 2, suffix: '+', label: '서비스 운영 중' },
  { target: 6, suffix: '+', label: '팀원' },
  { target: 2025, suffix: '', label: '설립년도' },
];

const schoolImages = [
  { src: '/images/school/korea.png', name: '고려대학교' },
  { src: '/images/school/yonsei.jpg', name: '연세대학교' },
  { src: '/images/school/kyunghee.png', name: '경희대학교' },
  { src: '/images/school/hongik.png', name: '홍익대학교' },
];

function CountUp({ target, suffix, start }: { target: number; suffix: string; start: boolean }) {
  const [count, setCount] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) {
      setCount(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4);
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentCount = Math.floor(easedProgress * target);

      setCount(currentCount);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [start, target]);

  return <>{count}{suffix}</>;
}

export default function IntroSection({ sectionRef }: IntroSectionProps) {
  const [visibleSlides, setVisibleSlides] = useState<boolean[]>(new Array(phrases.length + 2).fill(false));
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    slideRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setVisibleSlides(prev => {
              const newState = [...prev];
              newState[index] = entry.isIntersecting;
              return newState;
            });
          },
          { threshold: 0.5 }
        );
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  const aboutIndex = phrases.length;
  const schoolIndex = phrases.length + 1;

  return (
    <div ref={sectionRef as RefObject<HTMLDivElement>} className="intro-wrapper" id="intro">
      {phrases.map((phrase, i) => (
        <div
          key={i}
          ref={el => { slideRefs.current[i] = el; }}
          className="intro-slide"
        >
          <div className={`intro-phrase ${visibleSlides[i] ? 'visible' : ''}`}>
            <h1 className="phrase-text">{phrase.text}</h1>
            <p className="phrase-sub">{phrase.sub}</p>
          </div>
          {i === 0 && (
            <div className="intro-scroll-indicator">
              <span>스크롤 하여 자세히 알아보기</span>
              <div className="scroll-arrow">↓</div>
            </div>
          )}
        </div>
      ))}
      
      <div
        ref={el => { slideRefs.current[aboutIndex] = el; }}
        className="intro-slide intro-about"
      >
        <div className={`intro-content ${visibleSlides[aboutIndex] ? 'visible' : ''}`}>
          <span className="intro-eyebrow">About U-TEED</span>
          <h1 className="intro-title">
            기술로 일상의 문제를<br />
            해결합니다
          </h1>
          <p className="intro-description">
            U-TEED는 사람들의 일상 속 불편함을 기술로 해결하는 팀입니다.<br />
            스포츠, 헬스케어 등 다양한 영역에서 실질적인 가치를 만들어갑니다.
          </p>
          <div className="intro-stats">
            {stats.map((stat, i) => (
              <div key={i} className="intro-stat">
                <span className="stat-number">
                  <CountUp 
                    target={stat.target} 
                    suffix={stat.suffix} 
                    start={visibleSlides[aboutIndex]} 
                  />
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={el => { slideRefs.current[schoolIndex] = el; }}
        className="intro-slide intro-school"
      >
        <div className={`intro-content ${visibleSlides[schoolIndex] ? 'visible' : ''}`}>
          <span className="intro-eyebrow">Our Team</span>
          <h1 className="intro-title">
            학교는 모두 달라도<br />
            같은 사명으로 모였습니다
          </h1>
          <p className="intro-description">
            더 나은 사회를 위한 서비스를 만든다는 사명 아래,<br />
            다양한 배경의 팀원들이 함께합니다.
          </p>
        </div>
        <div className="marquee-container">
          <div className="marquee-track">
            {[...schoolImages, ...schoolImages, ...schoolImages, ...schoolImages, ...schoolImages, ...schoolImages, ...schoolImages, ...schoolImages].map((img, i) => (
              <div key={i} className="marquee-item">
                <Image
                  src={img.src}
                  alt={img.name}
                  width={240}
                  height={120}
                  quality={100}
                  unoptimized
                  className={`marquee-image school-logo ${img.name === '연세대학교' ? 'yonsei' : img.name === '경희대학교' ? 'kyunghee' : ''}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
