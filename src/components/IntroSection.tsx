'use client';

import { Dispatch, SetStateAction, useEffect, useState, useRef, RefObject } from 'react';
import Image from 'next/image';
import TeamOrgChart from './TeamOrgChart';
import { useThemeLang } from './ThemeLanguageProvider';
import ProjectRequest from './ProjectRequest';

interface IntroSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
  currentProject: number;
  setCurrentProject: Dispatch<SetStateAction<number>>;
}

const phrasesKo = [
  { text: 'Fast to Act.', sub: '빠르게 행동하고' },
  { text: 'Smart in Action.', sub: '똑똑하게 실행합니다' },
];
const phrasesEn = [
  { text: 'Fast to Act.', sub: 'We act first.' },
  { text: 'Smart in Action.', sub: 'We execute with precision.' },
];

const statsKo = [
  { target: 2, suffix: '+', label: '서비스 운영 중' },
  { target: 6, suffix: '+', label: '팀원' },
  { target: 2026, suffix: '', label: '법인 설립년도' },
];
const statsEn = [
  { target: 2, suffix: '+', label: 'Services Running' },
  { target: 6, suffix: '+', label: 'Team Members' },
  { target: 2026, suffix: '', label: 'Incorporated' },
];

const projects = [
  {
    name: 'NoteON',
    className: 'project-noteon',
    href: 'https://www.noteon.xyz/',
    ko: '시험기간 때 교수님의 강의 내용을 정리하고, 중요한 내용을 기록할 수 있는 노트 필기 프로젝트입니다.',
    en: 'A note-taking project that allows students to organize lecture content and record important information during exam periods.',
  },
  {
    name: 'B:Essential',
    className: 'project-bessential',
    href: 'https://bessential.ai.kr/',
    ko: '창업과 관련하여 아이디어 진단과 기존 서비스와의 유사성을 분석하여 창업 아이디어의 성공 가능성을 높이는 서비스입니다.',
    en: 'A service that analyzes the similarity of existing services and provides idea diagnosis to increase the success rate of startup ideas.',
  },
  {
    name: 'SITE',
    className: 'project-noteon',
    ko: '농구 동호회인들을 위한 통합관리 플랫폼으로, 경기 일정, 팀원 관리, 경기 기록 등을 효율적으로 관리할 수 있는 서비스입니다.',
    en: 'An integrated management platform for basketball club members, allowing efficient management of game schedules, team members, and game records.',
  },
  {
    name: 'MCI Link',
    className: 'project-bessential',
    ko: '경도인지장애를 가진 분들을 돌보는 분들을 위한 케어 솔루션으로, 의료 서비스와 연계된 케어 어시스트 솔루션을 개발하는 프로젝트입니다.',
    en: 'A care solution for caregivers of individuals with mild cognitive impairment, developing a care assist solution linked with medical services.',
  },
];

export const projectCount = projects.length;

const historyYears = [
  {
    year: '2024',
    entries: [
      { ko: '창업경진대회 최우수상', en: 'Startup Competition Grand Prize', institution: { ko: '경희대학교', en: 'Kyung Hee University' } },
      { ko: '지식재산권 활용 특허캠프 우수상', en: 'Intellectual Property Patent Camp Excellence Award', institution: { ko: '경희대학교', en: 'Kyung Hee University' } },
    ],
  },
  {
    year: '2025',
    entries: [
      { ko: 'KOREA LBS 스타트업 챌린지 TOP 10', en: 'KOREA LBS Startup Challenge Top 10', institution: { ko: 'KISA', en: 'KISA' }, project: 'SITE' },
    ],
  },
  {
    year: '2026',
    entries: [
      { ko: '주식회사 유티드 법인 설립', en: 'U-TEED incorporated', date: '2026.05' },
      {
        ko: '2026년 업종특화(돌봄·사회서비스) 사회적기업 창업지원사업 선정',
        en: 'Selected for the 2026 sector-specific social enterprise startup support program (care and social services)',
        organizer: { ko: '고용노동부 · 한국사회적기업진흥원', en: 'Ministry of Employment and Labor · Korea Social Enterprise Promotion Agency' },
        operator: { ko: 'SE Empower', en: 'SE Empower' },
        project: 'MCI Link',
      },
    ],
  },
];

const schoolImages = [
  { src: '/images/school/snu.png', name: '서울대학교', nameEn: 'Seoul National University' },
  { src: '/images/school/korea.png', name: '고려대학교', nameEn: 'Korea University' },
  { src: '/images/school/yonsei.png', name: '연세대학교', nameEn: 'Yonsei University' },
  { src: '/images/school/kyunghee.png', name: '경희대학교', nameEn: 'Kyung Hee University' },
  { src: '/images/school/hongik.png', srcDark: '/images/school/hongik(d).png', name: '홍익대학교', nameEn: 'Hongik University' },
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

export default function IntroSection({ sectionRef, currentProject, setCurrentProject }: IntroSectionProps) {
  const { lang, theme } = useThemeLang();
  const phrases = lang === 'ko' ? phrasesKo : phrasesEn;
  const stats = lang === 'ko' ? statsKo : statsEn;
  const [visibleSlides, setVisibleSlides] = useState<boolean[]>(new Array(phrases.length + 4).fill(false));
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const schoolTeamDialogRef = useRef<HTMLDialogElement>(null);
  const [schoolTeamOpen, setSchoolTeamOpen] = useState(false);
  const [schoolTeamClosing, setSchoolTeamClosing] = useState(false);

  useEffect(() => {
    if (!schoolTeamOpen) return;

    const root = document.documentElement;
    const body = document.body;
    const rootOverflow = root.style.overflowY;
    const bodyOverflow = body.style.overflowY;
    root.style.overflowY = 'hidden';
    body.style.overflowY = 'hidden';

    return () => {
      root.style.overflowY = rootOverflow;
      body.style.overflowY = bodyOverflow;
    };
  }, [schoolTeamOpen]);

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
  const projectsIndex = phrases.length + 2;
  const historyIndex = phrases.length + 3;

  const closeSchoolTeamDialog = () => setSchoolTeamClosing(true);

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
              <span>{lang === 'ko' ? '스크롤 하여 자세히 알아보기' : 'Scroll to explore'}</span>
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
            {lang === 'ko' ? (
              <>서비스 기획부터 런칭까지 <br/> 경험있는 팀이 대신 만들어드립니다</>
            ) : (
              <>Experienced team will handle everything from service planning to launch.</>
            )}
          </h1>
          <p className="intro-description">
            {lang === 'ko' ? (
              <>U-TEED는 다양한 분야의 팀원들이 모여 서비스가 완전히 구성되어 세상에 공개될 때까지 끊임없이 고민하는 팀입니다.</>
            ) : (
              <>U-TEED is a team made up of members from various fields who continuously brainstorm until the service is fully developed and launched to the public.</>
            )}
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
            {lang === 'ko' ? (
              <>학교는 모두 달라도<br />같은 사명으로 모였습니다</>
            ) : (
              <>Different schools,<br />one shared mission.</>
            )}
          </h1>
          <p className="intro-description">
            {lang === 'ko' ? (
              <>더 나은 사회를 위한 서비스를 만든다는 사명 아래,<br />다양한 배경의 팀원들이 함께합니다.</>
            ) : (
              <>Under the mission to build services for a better society,<br />team members of diverse backgrounds come together.</>
            )}
          </p>
        </div>
        <div className="marquee-container">
          <div className="marquee-track">
            {[...schoolImages, ...schoolImages, ...schoolImages, ...schoolImages, ...schoolImages, ...schoolImages, ...schoolImages, ...schoolImages].map((img, i) => (
              <div key={i} className="marquee-item">
                <Image
                  src={theme === 'dark' && img.srcDark ? img.srcDark : img.src}
                  alt={img.name}
                  width={img.name === '연세대학교' ? 260 : 200}
                  height={img.name === '연세대학교' ? 90 : 70}
                  unoptimized
                  className={`marquee-image school-logo ${img.name === '연세대학교' ? 'yonsei' : img.name === '경희대학교' ? 'kyunghee' : ''}`}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="school-team-button"
          onClick={() => {
            setSchoolTeamClosing(false);
            schoolTeamDialogRef.current?.showModal();
            setSchoolTeamOpen(true);
          }}
        >
          {lang === 'ko' ? '자세히 알아보기' : 'Learn More'}
        </button>
        <dialog
          ref={schoolTeamDialogRef}
          className={`school-team-dialog${schoolTeamClosing ? ' school-team-dialog-closing' : ''}`}
          aria-labelledby="school-team-title"
          aria-describedby="school-team-hint"
          // 안쪽 팀원 정보 창의 close·cancel도 React에서는 여기까지 올라오므로 이 창의 것만 처리한다
          onClose={(event) => {
            if (event.target === event.currentTarget) setSchoolTeamOpen(false);
          }}
          onCancel={(event) => {
            if (event.target !== event.currentTarget) return;
            event.preventDefault();
            closeSchoolTeamDialog();
          }}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && event.animationName === 'school-dialog-out' && schoolTeamClosing) {
              // 안쪽 팀원 정보 창이 열린 채 이 창만 닫히면, 보이지 않는 모달이 남아 페이지 전체가 막힌다
              schoolTeamDialogRef.current?.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(dialog => dialog.close());
              schoolTeamDialogRef.current?.close();
              setSchoolTeamClosing(false);
            }
          }}
        >
          {/* 사라지는 0.2초 동안 눌리지 않게 막는다 */}
          <header className="school-team-dialog-header" inert={schoolTeamClosing}>
            <div>
              <span className="school-team-dialog-eyebrow">Our Team</span>
              <h2 id="school-team-title">{lang === 'ko' ? '조직도' : 'Organization Chart'}</h2>
              <p id="school-team-hint" className="school-team-dialog-hint">
                {lang === 'ko' ? (
                  <>
                    이름을 누르면 학교와 <span>수상·이력을</span> 볼 수 있어요.
                  </>
                ) : (
                  'Select a name to see their school, awards and experience.'
                )}
              </p>
            </div>
            <button
              type="button"
              className="school-team-dialog-close"
              aria-label={lang === 'ko' ? '닫기' : 'Close'}
              onClick={closeSchoolTeamDialog}
            >
              &times;
            </button>
          </header>
          <div className="school-team-list" inert={schoolTeamClosing}>
            <TeamOrgChart />
          </div>
        </dialog>
      </div>

      <div
        ref={el => { slideRefs.current[projectsIndex] = el; }}
        className="intro-slide intro-project-slide"
      >
        <div className={`intro-content ${visibleSlides[projectsIndex] ? 'visible' : ''}`}>
          <span className="intro-eyebrow">Our Projects</span>
          <h1 className="intro-title">
            {lang === 'ko' ? '프로젝트' : 'Our Projects'}
          </h1>
          <div className="project-carousel" role="region" aria-label={lang === 'ko' ? '프로젝트 소개' : 'Project introductions'}>
            <div
              className="project-carousel-track"
              style={{ transform: `translateX(${-100 * currentProject}%)` }}
            >
              {projects.map((project, index) => {
                const cardContent = (
                  <>
                    <span className="project-number">PROJECT {String(index + 1).padStart(2, '0')}</span>
                    <h2 className="project-name">{project.name}</h2>
                    <p className="project-description">{project[lang]}</p>
                  </>
                );
                const cardClassName = `project-panel-card ${project.className}`;
                return (
                  <div className="project-panel" key={project.name} inert={index !== currentProject} aria-hidden={index !== currentProject}>
                    {'href' in project ? (
                      <a
                        className={cardClassName}
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cardContent}
                      </a>
                    ) : (
                      <article className={cardClassName}>
                        {cardContent}
                      </article>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="project-carousel-controls">
              <button
                type="button"
                className="project-carousel-button"
                aria-label={lang === 'ko' ? '이전 프로젝트' : 'Previous project'}
                disabled={currentProject === 0}
                onClick={() => setCurrentProject(index => index - 1)}
              >
                <span aria-hidden="true">←</span>
              </button>
              <span className="project-carousel-count" aria-live="polite">
                {currentProject + 1} / {projects.length}
              </span>
              <button
                type="button"
                className="project-carousel-button"
                aria-label={lang === 'ko' ? '다음 프로젝트' : 'Next project'}
                disabled={currentProject === projects.length - 1}
                onClick={() => setCurrentProject(index => index + 1)}
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={el => { slideRefs.current[historyIndex] = el; }}
        className="intro-slide intro-history-slide"
      >
        <div className={`intro-content ${visibleSlides[historyIndex] ? 'visible' : ''}`}>
          <span className="intro-eyebrow">Our Journey</span>
          <h1 className="intro-title">{lang === 'ko' ? '연혁' : 'Milestones'}</h1>
          <div className="history-timeline" tabIndex={0} role="region" aria-label={lang === 'ko' ? '연혁 목록' : 'History list'}>
            <ol className="history-years">
              {historyYears.map(group => (
                <li className="history-year-group" key={group.year}>
                  <h2 className="history-year">{group.year}</h2>
                  <ul className="history-entries">
                    {group.entries.map(entry => (
                      <li className="history-entry" key={entry.ko}>
                        {('date' in entry || 'project' in entry) && (
                          <div className="history-entry-meta">
                            {'date' in entry && <time dateTime="2026-05">{entry.date}</time>}
                            {'project' in entry && <span className="history-project">{entry.project}</span>}
                          </div>
                        )}
                        <p className="history-entry-title">{entry[lang]}</p>
                        {'institution' in entry && (
                          <p className="history-entry-institution">
                            <span>{lang === 'ko' ? '관련 기관' : 'Related institution'}</span> {entry.institution[lang]}
                          </p>
                        )}
                        {'organizer' in entry && entry.organizer && (
                          <p className="history-entry-institution">
                            <span>{lang === 'ko' ? '주관' : 'Organized by'}</span> {entry.organizer[lang]}
                          </p>
                        )}
                        {'operator' in entry && entry.operator && (
                          <p className="history-entry-institution">
                            <span>{lang === 'ko' ? '운영' : 'Operated by'}</span> {entry.operator[lang]}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <ProjectRequest />
    </div>
  );
}
