'use client';

import { useRef, useEffect, useState, MutableRefObject } from 'react';
import Header from '@/components/Header';
import ParallaxSection from '@/components/ParallaxSection';
import FooterSection from '@/components/FooterSection';
import SurveyPopup from '@/components/SurveyPopup';
import { Section } from '@/types';

const sections: Section[] = [
  {
    title: '농구의 인사이트, SITE.',
    highlight: 'SITE',
    hashtag: '#축구뿐만 아니라 농구, 배드민턴, 야구, 배구 등 모든 스포츠를 위한',
    image: null,
    detailLink: '/detail/1',
  },
  {
    title: '프로젝트 준비중...',
    highlight: '다른 프로젝트도 의뢰해보세요!',
    hashtag: '#내가_기획하는',
    detailLink: 'mailto:uteed.co@gmail.com',
  },
];

function MainContent({ sectionRefs }: { sectionRefs: MutableRefObject<HTMLElement | null>[] }) {
  const [scrollY, setScrollY] = useState(0);
  const [footerInView, setFooterInView] = useState(false);
  const [showSurveyPopup, setShowSurveyPopup] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // 하루 동안 보지 않기 체크 여부 확인
    try {
      const hideUntilStr = window.localStorage.getItem('surveyPopupHideUntil') || '0';
      const hideUntil = parseInt(hideUntilStr, 10);
      if (hideUntil > Date.now()) {
        return;
      }
    } catch {
      // ignore storage errors
    }
    // 페이지 로딩 후 1초 뒤에 팝업 표시
    const timer = setTimeout(() => {
      setShowSurveyPopup(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const closeSurveyPopup = () => {
    setShowSurveyPopup(false);
  };

  return (
    <div className="App snap-container">
      <SurveyPopup isOpen={showSurveyPopup} onClose={closeSurveyPopup} />
      {sections.map((sec, i) => (
        <ParallaxSection
          key={i}
          {...sec}
          index={i}
          scrollY={scrollY}
          sectionRef={sectionRefs[i]}
          id={`section-${i + 1}`}
        />
      ))}
      <FooterSection visible={footerInView} footerRef={footerRef} />
    </div>
  );
}

export default function Home() {
  const sectionRefs = [
    useRef<HTMLElement | null>(null),
    useRef<HTMLElement | null>(null),
    useRef<HTMLElement | null>(null),
  ];

  const handleNavClick = (id: string) => {
    const idx: Record<string, number> = {
      'section-1': 0,
      'section-2': 1,
      'section-3': 2,
    };
    sectionRefs[idx[id]]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header onNavClick={handleNavClick} />
      <MainContent sectionRefs={sectionRefs} />
    </>
  );
}

