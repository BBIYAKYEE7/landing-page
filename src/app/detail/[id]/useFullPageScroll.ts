'use client';

import { useEffect, useRef, useCallback, RefObject } from 'react';

export function useFullPageScroll(
  containerRef: RefObject<HTMLDivElement | null>,
  sectionIds: string[]
) {
  const isScrollingRef = useRef(false);

  const getSnapSections = useCallback((): HTMLElement[] => {
    return sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
  }, [sectionIds]);

  const getCurrentIndex = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;
    const sections = getSnapSections();
    const containerHeight = container.clientHeight;

    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top >= -containerHeight / 2 && rect.top < containerHeight / 2) {
        return i;
      }
    }

    if (sections.length > 0) {
      const lastRect = sections[sections.length - 1].getBoundingClientRect();
      if (lastRect.top < -containerHeight / 2) {
        return sections.length;
      }
    }

    return 0;
  }, [containerRef, getSnapSections]);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      isScrollingRef.current = true;
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }

      const sections = getSnapSections();
      const currentIndex = getCurrentIndex();

      if (currentIndex >= sections.length) return;

      let nextIndex = currentIndex;
      if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (e.deltaY < 0 && currentIndex > 0) {
        if (currentIndex === sections.length - 1) {
          const rect = sections[currentIndex].getBoundingClientRect();
          if (rect.top < -50) return;
        }
        nextIndex = currentIndex - 1;
      }

      if (nextIndex !== currentIndex) {
        e.preventDefault();
        isScrollingRef.current = true;
        sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 800);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [containerRef, getSnapSections, getCurrentIndex]);

  return { scrollToSection };
}
