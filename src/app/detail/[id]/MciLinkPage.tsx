'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import TeamSection from '@/components/TeamSection';
import { useFullPageScroll } from './useFullPageScroll';
import styles from './site.module.css';

const EMAIL = 'beepbeep@u-teed.co.kr';

const serviceSections = [
  {
    id: 'service',
    eyebrow: '문제 정의',
    title: '부모님을 매일 챙기고 싶지만, 현실은 어렵습니다.',
    description:
      '경도인지장애(MCI) 또는 초기 인지저하 단계에서는 매일의 복약, 식사, 컨디션, 일정 인지가 중요합니다. 하지만 보호자가 매일 직접 전화해 상태를 확인하기에는 시간적 부담이 큽니다.',
    image: '/images/MCI_Link_logo.png',
    ctaLabel: '문제 정의 더 보기',
  },
  {
    id: 'service-call',
    eyebrow: '제품 개요',
    title: 'AI가 보호자 목소리로 매일 전화해 일상을 확인합니다.',
    description:
      '보호자 앱에서 시간과 항목을 설정하면 AI가 정해진 시간에 부모님께 전화를 겁니다. 대화 응답은 복약, 식사, 컨디션, 병원 일정 인지 항목으로 구조화되어 보호자가 핵심만 빠르게 확인할 수 있습니다.',
    image: '/images/MCI_Link_logo.png',
    ctaLabel: '제품 흐름 보기',
  },
  {
    id: 'service-feature',
    eyebrow: '주요 기능',
    title: '이상 신호를 감지하고 의료 기관 연계까지 이어집니다.',
    description:
      '3일 연속 미복약, 일정 혼동 반복, 컨디션 저하 같은 패턴을 기반으로 조기 알림을 제공합니다. MCI Link는 비의료 대체 서비스가 아니라 보호자와 병원·의료 시스템을 연결하는 의료 연계형 돌봄 보조 서비스입니다.',
    image: '/images/MCI_Link_logo.png',
    ctaLabel: '기능 더 보기',
  },
];

const awardSections = [
  {
    id: 'award-1',
    title: '2026년 업종특화(돌봄·사회서비스) 사회적기업 창업지원사업',
    description:
      'MCI Link의 노력과 혁신이 인정받아 사회적기업 창업지원사업에 선정되었습니다. AI 기반 의료 연계형 돌봄 서비스로서 사회적 가치 창출에 기여하고 있습니다.',
    image: '/images/MCI_Link_logo.png',
    sponsorLogos: [
      { src: '/images/logo/MOEL.svg', alt: 'MOEL' },
      { src: '/images/logo/KSEPA.svg', alt: 'KSEPA' },
    ],
    operatorLogo: { src: '/images/logo/seempower.png', alt: 'Seempower' },
    date: '2026년 05월',
    sponsor: '주관: 고용노동부, 한국사회적기업진흥원',
    operator: '운영: SE Empower',
    badge: '선정',
  },
];

const sections = [
  { id: 'top', label: 'Intro' },
  { id: 'service', label: '서비스' },
  { id: 'beta', label: '현황' },
  { id: 'awards', label: '수상' },
  { id: 'partner', label: '협력' },
  { id: 'team', label: '팀' },
];

const snapSectionIds = [
  'top',
  ...serviceSections.map(s => s.id),
  'beta',
  'awards',
  ...awardSections.map(s => s.id),
  'partner',
  'team',
];

export default function MciLinkPage() {
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

  useEffect(() => {
    if (!mounted) return;

    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  const [ctaVisible, setCtaVisible] = useState(false);
  const [ctaClosing, setCtaClosing] = useState(false);
  const [ctaService, setCtaService] = useState(activeService);
  const ctaTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const prevServiceIdRef = useRef<string | null>(null);
  const pendingServiceRef = useRef(activeService);

  useEffect(() => {
    const prevId = prevServiceIdRef.current;
    const newId = activeService?.id ?? null;
    prevServiceIdRef.current = newId;
    pendingServiceRef.current = activeService;

    ctaTimersRef.current.forEach(clearTimeout);
    ctaTimersRef.current = [];

    const timer = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      ctaTimersRef.current.push(t);
      return t;
    };

    if (newId && prevId && newId !== prevId) {
      setCtaClosing(true);
      timer(() => {
        setCtaVisible(false);
        setCtaClosing(false);
        timer(() => {
          setCtaService(pendingServiceRef.current);
          setCtaVisible(true);
        }, 50);
      }, 600);
    } else if (newId && !prevId) {
      setCtaService(activeService);
      setCtaClosing(false);
      setCtaVisible(true);
    } else if (!newId && prevId) {
      setCtaClosing(true);
      timer(() => {
        setCtaVisible(false);
        setCtaClosing(false);
        setCtaService(null);
      }, 600);
    }

    return () => {
      ctaTimersRef.current.forEach(clearTimeout);
      ctaTimersRef.current = [];
    };
  }, [activeService]);

  return (
    <div className={styles.scrollContainer} ref={scrollContainerRef}>
      <Header onNavClick={handleNavClick} />
      <div className={styles.siteWrapper}>
        <main id="top" className={styles.hero} ref={heroRef}>
          <div className={`${styles.container} ${styles.heroGrid}`}>
            <div className={`${styles.heroContent} ${styles.reveal}`}>
              <h1 className={styles.heroTitle}>
                부모님의 일상을 확인하는 AI 케어,
                <br />
                MCI Link.
              </h1>

              <p className={styles.sub}>
                AI가 매일 복약·식사·컨디션·일정을 확인하고,
                <br />
                이상 신호를 빠르게 정리해 의료 연계를 돕습니다.
              </p>

              <div className={styles.ctaRow}>
                <a
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent('[MCI Link] 서비스 문의')}`}
                  aria-label="서비스 문의하기"
                >
                  서비스 문의
                  <span className={styles.hint}>↗</span>
                </a>
                <a
                  className={styles.btn}
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent('[MCI Link] 미팅/데모 문의')}`}
                  aria-label="미팅/데모 문의하기"
                >
                  미팅/데모 문의
                  <span className={styles.hint}>↗</span>
                </a>
              </div>

              <div className={styles.tiny}>
                현재 초기 파일럿 파트너를 모집하고 있습니다.
              </div>
            </div>
            <div className={`${styles.heroLogoPanel} ${styles.reveal}`} ref={heroLogoRef}>
              <Image
                src="/images/MCI_Link_logo.png"
                alt="MCI Link 앱 로고"
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

        {ctaVisible && ctaService && (
          <div
            className={`${styles.serviceCta} ${
              ctaClosing ? styles.serviceCtaClosing : styles.serviceCtaVisible
            }`}
            role="status"
            aria-live="polite"
          >
            <div className={styles.serviceCtaText}>
              <span className={styles.serviceCtaTitle}>{ctaService.ctaLabel}</span>
            </div>
            <div className={styles.serviceCtaButtonWrap}>
              <button
                className={styles.serviceCtaButton}
                aria-label={`${ctaService.ctaLabel} 열기`}
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

        <section id="awards" className={`${styles.section} ${styles.sectionSoft}`}>
          <div className={`${styles.container} ${styles.sectionContent}`}>
            <div className={styles.reveal}>
              <p className={styles.eyebrow}>수상 실적</p>
              <h2 className={styles.h2}>인정받은 혁신과 가치</h2>
              <p className={styles.lead}>
                MCI Link의 노력과 성과가 다양한 분야에서 인정받고 있습니다.
                <br />
                의료 혁신과 케어 기술 분야의 주요 상을 수상했습니다.
              </p>
            </div>
          </div>
        </section>

        {awardSections.map((award, index) => (
          <section
            key={award.id}
            id={award.id}
            className={`${styles.section} ${styles.sectionSoft}`}
          >
            <div className={`${styles.container} ${styles.sectionContent}`}>
              <div
                className={`${styles.serviceShowcase} ${
                  index % 2 === 1 ? styles.serviceShowcaseReverse : ''
                } ${styles.reveal}`}
              >
                <div className={styles.serviceText}>
                  <p className={styles.eyebrow}>{award.badge}</p>
                  <h2 className={styles.h2}>{award.title}</h2>
                  <p className={styles.lead}>{award.description}</p>
                  <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#333', fontWeight: 700 }}>
                    <p style={{ margin: '0.5rem 0' }}>
                      <strong>선정일:</strong> {award.date}
                    </p>
                  </div>
                  
                  {award.sponsorLogos && award.sponsorLogos.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#333' }}>주관/주관협력</p>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {award.sponsorLogos.map((logo, idx) => (
                          <Image
                            key={idx}
                            src={logo.src}
                            alt={logo.alt}
                            width={120}
                            height={60}
                            style={{ objectFit: 'contain' }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {award.operatorLogo && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#333' }}>운영</p>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Image
                          src={award.operatorLogo.src}
                          alt={award.operatorLogo.alt}
                          width={120}
                          height={60}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.serviceImageWrap}>
                  <Image
                    src={award.image}
                    alt={award.title}
                    width={520}
                    height={360}
                    className={styles.serviceImage}
                  />
                </div>
              </div>
            </div>
          </section>
        ))}

        <section id="partner" className={styles.section}>
          <div className={`${styles.container} ${styles.sectionContent}`}>
            <div className={styles.reveal}>
              <p className={styles.eyebrow}>협력/파일럿</p>
              <h2 className={styles.h2}>파일럿 운영 및 파트너십</h2>
              <p className={styles.lead}>
                병원, 요양원, 치매안심센터와의 협업을 통해 실제 운영 흐름을 검증합니다.
                <br />
                초기 파트너와 함께 인지기능 분석 정확도와 연계 정책을 구체화할 예정입니다.
              </p>

              <div className={styles.ctaRow}>
                <a
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent('[MCI Link] 파트너/파일럿 협력 문의')}`}
                  aria-label="파트너/파일럿 협력 문의하기"
                >
                  파트너/파일럿 협력 문의
                  <span className={styles.hint}>↗</span>
                </a>
                <a
                  className={styles.btn}
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent('[MCI Link] 간단 문의')}`}
                  aria-label="간단 문의 보내기"
                >
                  가볍게 문의하기
                  <span className={styles.hint}>↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <TeamSection id="team" project="beepbeep" />
      </div>

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

      <div className={styles.footerSnap}>
        <FooterSection visible={true} footerRef={footerRef} />
      </div>
    </div>
  );
}
