'use client';

import { useRef, useEffect, useState, MutableRefObject, useCallback } from 'react';
import Header from '@/components/Header';
import IntroSection from '@/components/IntroSection';
import ParallaxSection from '@/components/ParallaxSection';
import FooterSection from '@/components/FooterSection';
import { useThemeLang } from '@/components/ThemeLanguageProvider';
import { Section } from '@/types';

const sectionsKo: Section[] = [];

const sectionsEn: Section[] = [];

function MainContent({ sectionRefs, introRef }: { sectionRefs: MutableRefObject<HTMLElement | null>[], introRef: MutableRefObject<HTMLElement | null> }) {
  const { lang } = useThemeLang();
  const sections = lang === 'ko' ? sectionsKo : sectionsEn;
  const [scrollY, setScrollY] = useState(0);
  const [footerInView, setFooterInView] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const footerRef = useRef<HTMLElement>(null!);

  const getAllSections = useCallback(() => {
    return Array.from(document.querySelectorAll('.intro-slide, .parallax-section, .footer-section'));
  }, []);

  const getCurrentSectionIndex = useCallback(() => {
    const allSections = getAllSections();
    const windowHeight = window.innerHeight;
    
    for (let i = 0; i < allSections.length; i++) {
      const rect = allSections[i].getBoundingClientRect();
      if (rect.top >= -windowHeight / 2 && rect.top < windowHeight / 2) {
        return i;
      }
    }
    return 0;
  }, [getAllSections]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (document.querySelector('.school-team-dialog[open]')) return;

      const allSections = getAllSections();
      const currentIndex = getCurrentSectionIndex();
      const currentSection = allSections[currentIndex];

      if (!isScrolling && (currentSection?.classList.contains('intro-history-slide') || currentSection?.classList.contains('intro-request-slide'))) {
        const scrollable = currentSection.querySelector<HTMLElement>('.history-timeline, .request-content');
        if (scrollable) {
          if (e.target instanceof HTMLTextAreaElement) {
            const textarea = e.target;
            if ((e.deltaY > 0 && textarea.scrollTop + textarea.clientHeight < textarea.scrollHeight - 1) || (e.deltaY < 0 && textarea.scrollTop > 0)) return;
          }
          const canScrollDown = e.deltaY > 0 && scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight - 1;
          const canScrollUp = e.deltaY < 0 && scrollable.scrollTop > 0;
          if (canScrollDown || canScrollUp) {
            e.preventDefault();
            const delta = e.deltaY * (e.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? scrollable.clientHeight : 1);
            scrollable.scrollTop += delta;
            return;
          }
        }
      }

      if (isScrolling) {
        e.preventDefault();
        return;
      }
      
      let nextIndex = currentIndex;
      if (e.deltaY > 0 && currentIndex < allSections.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (e.deltaY < 0 && currentIndex > 0) {
        nextIndex = currentIndex - 1;
      }

      if (nextIndex !== currentIndex) {
        e.preventDefault();
        setIsScrolling(true);
        allSections[nextIndex].scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
          setIsScrolling(false);
        }, 800);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isScrolling, getAllSections, getCurrentSectionIndex]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      setCurrentSectionIndex(getCurrentSectionIndex());
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [getCurrentSectionIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const sectionNames: string[] = [];

  const handleIndicatorClick = (index: number) => {
    const allSections = getAllSections();
    if (allSections[index]) {
      setIsScrolling(true);
      allSections[index].scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  };

  return (
    <div className="App snap-container">
      <div className="side-indicator">
        {sectionNames.map((name, i) => (
          <div 
            key={i} 
            className={`indicator-dot ${currentSectionIndex === i ? 'active' : ''}`}
            onClick={() => handleIndicatorClick(i)}
          >
            <span className="indicator-tooltip">{name}</span>
          </div>
        ))}
      </div>
      <IntroSection sectionRef={introRef} />
      {sections.map((sec, i) => (
        <ParallaxSection
          key={i}
          {...sec}
          index={i}
          scrollY={scrollY}
          sectionRef={sectionRefs[i]}
          id={i === 0 ? 'service' : `section-${i + 1}`}
        />
      ))}
      <FooterSection visible={footerInView} footerRef={footerRef} />
    </div>
  );
}

export default function Home() {
  const introRef = useRef<HTMLElement | null>(null);
  const sectionRefs = [
    useRef<HTMLElement | null>(null),
    useRef<HTMLElement | null>(null),
  ];

  const handleNavClick = (id: string) => {
    if (id === 'contact' || id === 'section-2') {
      document.querySelector('#project-request')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (id === 'intro') {
      introRef?.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (id === 'service') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header onNavClick={handleNavClick} />
      <MainContent sectionRefs={sectionRefs} introRef={introRef} />
    </>
  );
}
