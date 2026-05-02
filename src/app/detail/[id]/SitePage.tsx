'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import TeamSection from '@/components/TeamSection';
import { useFullPageScroll } from './useFullPageScroll';
import styles from './site.module.css';

const EMAIL = 'site@u-teed.co.kr';
const BETA_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSePB2wt08eZymrTUKA3ZDGZV5vu5DTVhDH9kOCsEcGan6TcEQ/viewform?pli=1';

const serviceSections = [
  {
    id: 'service',
    eyebrow: '문제 정의',
    title: '픽업게임 운영은 “모집-참여-관리”가 분산되어 있습니다.',
    description:
      '모집글은 여러 채널에 흩어져 있고, 인원 현황·확정자 관리는 수동으로 반복됩니다. 이 과정이 길어질수록 게임 성사율이 떨어지고 운영 부담이 커집니다.',
    image: '/images/community.png',
    ctaLabel: '문제 정의 더 보기',
    ctaHref: BETA_FORM_URL,
  },
  {
    id: 'service-reserve',
    eyebrow: '제품 개요',
    title: '모집 → 신청 → 승인 → 알림을 하나의 흐름으로 통합합니다.',
    description:
      '주최자는 템플릿으로 게임을 등록하고, 게스트는 조건 필터로 찾아 1클릭 신청합니다. 승인/거절과 인원 현황이 즉시 반영되도록 설계해 운영 체계를 단순화했습니다.',
    image: '/images/detail.png',
    ctaLabel: '제품 흐름 보기',
    ctaHref: BETA_FORM_URL,
  },
  {
    id: 'service-operator',
    eyebrow: '범위·로드맵',
    title: '지금은 운영 효율에 집중하고, 이후 확장을 준비합니다.',
    description:
      '현재 단계에서는 모집/참여/현황/알림 중심으로 안정적인 운영을 만드는 데 집중합니다. 시설 예약/결제/채팅은 파트너십과 운영 데이터가 확보되는 단계에서 확장할 계획입니다.',
    image: '/images/home.png',
    ctaLabel: '로드맵 더 보기',
    ctaHref: BETA_FORM_URL,
  },
];

// 섹션 정의
const sections = [
  { id: 'top', label: 'Intro' },
  { id: 'service', label: '서비스' },
  { id: 'beta', label: '현황' },
  { id: 'partner', label: '협력' },
  { id: 'team', label: '팀' },
];

const snapSectionIds = [
  'top',
  ...serviceSections.map(s => s.id),
  'beta',
  'partner',
  'team',
];

export default function SiteLandingPage() {
  const footerRef = useRef<HTMLElement>(null!);
  const heroRef = useRef<HTMLElement>(null!);
  const heroLogoRef = useRef<HTMLDivElement>(null!);
  const scrollContainerRef = useRef<HTMLDivElement>(null!);
  const [activeSection, setActiveSection] = useState<string>('top');
  const [mounted, setMounted] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceModalClosing, setServiceModalClosing] = useState(false);

  const stableSectionIds = useMemo(() => snapSectionIds, []);
  const { scrollToSection } = useFullPageScroll(scrollContainerRef, stableSectionIds);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavClick = (id: string) => scrollToSection(id);

  useEffect(() => {
    if (!mounted) return;

    const sectionElements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0.1, 0.3, 0.5] }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted]);

  useEffect(() => {
    if (!serviceModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseServiceModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [serviceModalOpen]);

  useEffect(() => {
    if (!activeServiceId) {
      setServiceModalOpen(false);
      setServiceModalClosing(false);
    }
  }, [activeServiceId]);

  const handleCloseServiceModal = () => {
    setServiceModalClosing(true);
    window.setTimeout(() => {
      setServiceModalOpen(false);
      setServiceModalClosing(false);
    }, 280);
  };

  // Reveal animation
  useEffect(() => {
    if (!mounted) return;

    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // reveal 클래스를 가진 모든 요소 선택
    const revealElements = document.querySelectorAll(`.${styles.reveal}`);

    if (prefersReduced) {
      revealElements.forEach((el) => el.classList.add(styles.revealIn));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealIn);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const sectionElements = serviceSections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean) as HTMLElement[];

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (intersecting.length === 0) {
          setActiveServiceId(null);
          return;
        }

        const id = intersecting[0].target.id;
        setActiveServiceId(id);
      },
      { rootMargin: '-25% 0px -45% 0px', threshold: [0.2, 0.5, 0.8] }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const heroEl = heroRef.current;
    const logoEl = heroLogoRef.current;
    if (!heroEl || !logoEl) return;

    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let rafId = 0;
    const maxTilt = 16;
    const maxShift = 18;

    const updateLogo = (clientX: number, clientY: number) => {
      const rect = logoEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (clientX - centerX) / rect.width;
      const dy = (clientY - centerY) / rect.height;

      const tiltX = (-dy * maxTilt).toFixed(2);
      const tiltY = (dx * maxTilt).toFixed(2);
      const shiftX = (dx * maxShift).toFixed(2);
      const shiftY = (dy * maxShift).toFixed(2);

      logoEl.style.setProperty('--logo-tilt-x', `${tiltX}deg`);
      logoEl.style.setProperty('--logo-tilt-y', `${tiltY}deg`);
      logoEl.style.setProperty('--logo-shift-x', `${shiftX}px`);
      logoEl.style.setProperty('--logo-shift-y', `${shiftY}px`);
    };

    const handleMove = (event: PointerEvent) => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateLogo(event.clientX, event.clientY);
      });
    };

    const resetLogo = () => {
      logoEl.style.setProperty('--logo-tilt-x', '0deg');
      logoEl.style.setProperty('--logo-tilt-y', '0deg');
      logoEl.style.setProperty('--logo-shift-x', '0px');
      logoEl.style.setProperty('--logo-shift-y', '0px');
    };

    heroEl.addEventListener('pointermove', handleMove);
    heroEl.addEventListener('pointerleave', resetLogo);
    return () => {
      heroEl.removeEventListener('pointermove', handleMove);
      heroEl.removeEventListener('pointerleave', resetLogo);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  const activeService = activeServiceId
    ? serviceSections.find((section) => section.id === activeServiceId)
    : null;

  return (
    <div className={styles.scrollContainer} ref={scrollContainerRef}>
      <Header onNavClick={handleNavClick} />
      <div className={styles.siteWrapper}>
        {/* Hero Section */}
      <main id="top" className={styles.hero} ref={heroRef}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={`${styles.heroContent} ${styles.reveal}`} >
            <h1 className={styles.heroTitle}>
              픽업게임 운영을 더 쉽게 만드는 서비스, SITE.
            </h1>

            <p className={styles.sub}>
              분산된 모집과 수동 관리로 발생하는 운영 비용을 줄이고,
              <br />
              안정적인 게임 성사율을 만드는 데 집중합니다.
            </p>

            <div className={styles.ctaRow}>
              <a
                className={`${styles.btn} ${styles.btnPrimary}`}
                href={`mailto:${EMAIL}?subject=${encodeURIComponent('[SITE] 사업 소개서 요청')}`}
                aria-label="사업 소개서 요청하기"
              >
                사업 소개서 요청
                <span className={styles.hint}>↗</span>
              </a>
              <a
                className={styles.btn}
                href={`mailto:${EMAIL}?subject=${encodeURIComponent('[SITE] 미팅/데모 문의')}`}
                aria-label="미팅/데모 문의하기"
              >
                미팅/데모 문의
                <span className={styles.hint}>↗</span>
              </a>
            </div>

            <div className={styles.tiny}>
              현재는 사업 소개 및 파일럿 파트너 논의를 중심으로 운영하고 있습니다.
            </div>
          </div>
          <div className={`${styles.heroLogoPanel} ${styles.reveal}`} ref={heroLogoRef}>
            <Image
              src="/images/SITE_logo.png"
              alt="SITE 앱 로고"
              width={240}
              height={240}
              className={styles.heroLogo}
              priority
            />
          </div>
        </div>
      </main>

      {serviceSections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={`${styles.section} ${styles.sectionSoft}`}
        >
          <div className={`${styles.container} ${styles.sectionContent}`}>
            <div
              className={`${styles.serviceShowcase} ${
                index % 2 === 1 ? styles.serviceShowcaseReverse : ''
              } ${styles.reveal}`}
            >
              <div className={styles.serviceText}>
                <p className={styles.eyebrow}>{section.eyebrow}</p>
                <h2 className={styles.h2}>{section.title}</h2>
                <p className={styles.lead}>{section.description}</p>
              </div>
              <div className={styles.serviceImageWrap}>
                <Image
                  src={section.image}
                  alt={section.title}
                  width={520}
                  height={360}
                  className={styles.serviceImage}
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {activeService && (
        <div
          className={`${styles.serviceCta} ${styles.serviceCtaVisible}`}
          role="status"
          aria-live="polite"
        >
          <div className={styles.serviceCtaText}>
            <span className={styles.serviceCtaTitle}>{activeService.ctaLabel}</span>
          </div>
          <button
            className={styles.serviceCtaButton}
            aria-label={`${activeService.ctaLabel} 열기`}
            type="button"
            onClick={() => setServiceModalOpen(true)}
          >
            <span className={styles.serviceCtaButtonIcon} aria-hidden="true">
              <svg viewBox="0 0 36 36" aria-hidden="true" focusable="false">
                <path d="M25.5,16.5h-5.9v-5.9c0-0.9-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5v5.9h-5.9C9.7,16.5,9,17.1,9,18s0.7,1.5,1.5,1.5h5.9v5.9c0,0.9,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5v-5.9h5.9c0.9,0,1.5-0.7,1.5-1.5S26.3,16.5,25.5,16.5z" />
              </svg>
            </span>
          </button>
        </div>
      )}

      {activeService && serviceModalOpen && (
        <div
          className={`${styles.serviceModalOverlay} ${
            serviceModalClosing ? styles.serviceModalOverlayClosing : ''
          }`}
          onClick={handleCloseServiceModal}
          role="presentation"
        >
          <div
            className={`${styles.serviceModal} ${
              serviceModalClosing ? styles.serviceModalClosing : ''
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.serviceModalHeader}>
              <h3 id="service-modal-title" className={styles.serviceModalTitle}>
                {activeService.ctaLabel}
              </h3>
              <button
                type="button"
                className={styles.serviceModalClose}
                onClick={handleCloseServiceModal}
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <p className={styles.serviceModalBody}>{activeService.description}</p>
          </div>
        </div>
      )}

      {/* Beta Section */}
      <section id="beta" className={`${styles.section} ${styles.sectionSoft}`}>
        <div className={`${styles.container} ${styles.sectionContent}`}>
          <div className={styles.reveal} >
            <p className={styles.eyebrow}>사업 현황</p>
            <h2 className={styles.h2}>현재 단계와 목표</h2>
            <p className={styles.lead}>
              픽업게임 운영 효율을 증명하기 위한 베타를 준비 중이며,
              <br />
              초기 파트너와 함께 운영 데이터를 축적하는 단계입니다.
            </p>

            <div className={styles.ctaRow}>
              <a
                className={`${styles.btn} ${styles.btnPrimary}`}
                href={`mailto:${EMAIL}?subject=${encodeURIComponent('[SITE] 사업 소개 자료 요청')}`}
                aria-label="사업 소개 자료 요청하기"
              >
                사업 소개 자료 요청
                <span className={styles.hint}>↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section id="partner" className={styles.section}>
        <div className={`${styles.container} ${styles.sectionContent}`}>
          <div className={styles.reveal} >
            <p className={styles.eyebrow}>협력/파일럿</p>
            <h2 className={styles.h2}>파일럿 운영 및 파트너십</h2>
            <p className={styles.lead}>
              지역 커뮤니티, 시설 운영자와의 협업을 통해 실제 운영 흐름을 검증합니다.
              <br />
              초기 파트너와 함께 문제 정의·정산·운영 정책을 구체화할 예정입니다.
            </p>

            <div className={styles.ctaRow}>
              <a
                className={`${styles.btn} ${styles.btnPrimary}`}
                href={`mailto:${EMAIL}?subject=${encodeURIComponent('[SITE] 파트너/파일럿 협력 문의')}`}
                aria-label="파트너/파일럿 협력 문의하기"
              >
                파트너/파일럿 협력 문의
                <span className={styles.hint}>↗</span>
              </a>
              <a
                className={styles.btn}
                href={`mailto:${EMAIL}?subject=${encodeURIComponent('[SITE] 간단 문의')}`}
                aria-label="간단 문의 보내기"
              >
                가볍게 문의하기
                <span className={styles.hint}>↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection id="team" />

      </div>

      {/* Section Indicator */}
      <nav className={styles.indicator} aria-label="섹션 네비게이션">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`${styles.indicatorDot} ${activeSection === section.id ? styles.indicatorDotActive : ''}`}
            onClick={() => scrollToSection(section.id)}
            data-label={section.label}
            aria-label={`${section.label} 섹션으로 이동`}
            aria-current={activeSection === section.id ? 'true' : undefined}
          />
        ))}
      </nav>
      
      {/* Footer - 메인 페이지와 동일 */}
      <div className={styles.footerSnap}>
        <FooterSection visible={true} footerRef={footerRef} />
      </div>
    </div>
  );
}
