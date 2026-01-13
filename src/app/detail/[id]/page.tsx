'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import styles from './site.module.css';

const EMAIL = 'uteed.co@gmail.com';

// 섹션 정의
const sections = [
  { id: 'top', label: 'Intro' },
  { id: 'what', label: 'What' },
  { id: 'features', label: 'Features' },
  { id: 'partner', label: 'Partner' },
  { id: 'ideas', label: 'Ideas' },
  { id: 'how', label: 'How' },
  { id: 'team', label: 'Team' },
];

// 팀원 정보 (역할별 그룹화)
const teamGroups = [
  {
    category: '기획 / 마케팅',
    members: [
      { name: '임태호', role: '대표 / 기획', desc: '프로젝트 총괄 및 서비스 기획', school: '연세대학교', major: '신학과', profileImage: '/images/team/임태호.png' },
      { name: '홍예찬', role: '마케팅', desc: '마케팅 전략 및 커뮤니티 운영', school: '연세대학교', major: '물리학과', profileImage: '/images/team/홍예찬.png' },
    ],
  },
  {
    category: '개발',
    members: [
      { name: '김재윤', role: 'Frontend', desc: '프론트엔드 개발, 유저 앱 개발', school: '고려대학교', major: '인공지능사이버보안학과', profileImage: '/images/team/김재윤.png' },
      { name: '김진영', role: 'Backend', desc: '백엔드 개발, 서버 관리 및 운영', school: '고려대학교', major: '인공지능사이버보안학과', profileImage: '/images/team/김진영.png' },
      { name: '정민규', role: 'Frontend', desc: '프론트엔드 개발, 관리자용 앱 개발', school: '홍익대학교', major: '소프트웨어융합학과', profileImage: '/images/team/정민규.png' },
      { name: '김명준', role: 'Backend', desc: '백엔드 개발', school: '고려대학교', major: '인공지능사이버보안학과', profileImage: '/images/team/김명준.png' },
      { name: '윤효빈', role: 'Backend', desc: '백엔드 개발', school: '고려대학교', major: '인공지능사이버보안학과', profileImage: '/images/team/윤효빈.png' }
    ],
  },
  {
    category: '디자인',
    members: [
      { name: '최수진', role: 'UI/UX', desc: 'UI/UX 디자인', school: '홍익대학교', major: '시각디자인학과', profileImage: '/images/team/최수진.png' },
    ],
  },
];

export default function SiteLandingPage() {
  const router = useRouter();
  const footerRef = useRef<HTMLElement>(null!);
  const [activeSection, setActiveSection] = useState<string>('top');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavClick = () => {
    router.push('/');
  };

  // Section observer for indicator
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reveal animation - CSS 클래스 기반으로 변경
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

  return (
    <div className={styles.scrollContainer}>
      <Header onNavClick={handleNavClick} />
      <div className={styles.siteWrapper}>
        {/* Hero Section */}
      <main id="top" className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={`${styles.reveal}`} >
            <div className={styles.kicker}>
              <span className={styles.kDot} aria-hidden="true"></span>
              <span>인스타 DM/메일 첨부용 — 한 장으로 끝나는 제품 소개</span>
            </div>

            <h1 className={styles.heroTitle}>
              네이버 카페 &quot;게스트(용병) 모집 픽업게임&quot;을
              <br />
              앱으로 옮기고, 주변 시설 예약까지 한 번에.
            </h1>

            <p className={styles.sub}>
              SITE는 <b>픽업게임(게스트 모집 경기)</b>과 <b>주변 농구 시설 탐색/예약</b>을 하나의
              흐름으로 연결한 위치 기반 스포츠 플랫폼입니다. 복잡한 링크/댓글/채팅을
              &apos;참여 버튼&apos;과 &apos;예약 슬롯&apos;으로 정리합니다.
            </p>

            <div className={styles.ctaRow}>
              <a
                className={`${styles.btn} ${styles.btnPrimary}`}
                href={`mailto:${EMAIL}?subject=${encodeURIComponent('[SITE] 콜라보/제휴 제안 회신합니다')}`}
                aria-label="콜라보/제휴 제안 회신하기"
              >
                콜라보/제휴 제안 회신하기
                <span className={styles.hint}>↗</span>
              </a>
              <a
                className={styles.btn}
                href={`mailto:${EMAIL}?subject=${encodeURIComponent('[SITE] 광고/프로모션 논의합니다')}`}
                aria-label="광고/프로모션 논의하기"
              >
                광고/프로모션 논의하기
                <span className={styles.hint}>↗</span>
              </a>
            </div>

            <div className={styles.tiny}>
              협업: <b>네이버 카페 NSB 농심(약 26만)</b> 농구 카페와 협업 진행 중
            </div>
          </div>
        </div>
      </main>

      {/* What It Is Section */}
      <section id="what" className={`${styles.section} ${styles.sectionSoft}`}>
        <div className={`${styles.container} ${styles.sectionContent}`}>
          <div className={styles.reveal} >
            <p className={styles.eyebrow}>What it is</p>
            <h2 className={styles.h2}>기능 나열이 아니라, &quot;경험&quot;을 줄입니다.</h2>
            <p className={styles.lead}>
              SITE는 &apos;픽업게임(네이버 카페 게스트 모집 경기)&apos;과 &apos;시설 예약&apos;을
              <b> 검색 → 확인 → 참여/예약</b> 흐름으로 통합해, 외부 링크·댓글·채팅의 번거로움을 줄이는 것을 목표로 설계했습니다.
              초기 종목은 <b>농구 중심</b>으로 시작합니다.
            </p>

            <div className={styles.threeLines}>
              <div className={styles.lineItem}>
                <span className={styles.bullet} aria-hidden="true"></span>
                <div className={styles.lineText}>
                  <b>경기 찾기</b> — &quot;게스트(용병) 모집&quot; 글을 앱에서 바로 찾아봅니다.
                </div>
              </div>
              <div className={styles.lineItem}>
                <span className={styles.bullet} aria-hidden="true"></span>
                <div className={styles.lineText}>
                  <b>참여하기</b> — 상세 화면에서 조건을 확인하고, 참여 흐름을 한 번에 정리합니다.
                </div>
              </div>
              <div className={styles.lineItem}>
                <span className={styles.bullet} aria-hidden="true"></span>
                <div className={styles.lineText}>
                  <b>시설 예약</b> — 주변 농구 코트/체육관을 탐색하고, (가능한 경우) 타임슬롯 기준으로 예약을 진행합니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Key Features Section */}
      <section id="features" className={`${styles.section} ${styles.sectionSoft}`}>
        <div className={`${styles.container} ${styles.sectionContent}`}>
          <div className={styles.reveal} >
            <p className={styles.eyebrow}>Key features</p>
            <h2 className={styles.h2}>핵심 기능은 &quot;짧고 공격적으로&quot;.</h2>
            <p className={styles.lead}>
              SITE가 말하는 픽업게임은 <b>네이버 카페에서 흔한 &apos;게스트(용병) 모집 경기&apos;</b>입니다.
              이 문맥을 앱 UX로 그대로 옮겼습니다.
            </p>

            <div className={styles.features}>
              <div className={`${styles.f} ${styles.reveal}`} >
                <h3 className={styles.fTitle}>지도 기반 탐색</h3>
                <p className={styles.fDesc}>사용자 가치: 지금 주변에서 가능한 선택지를 빠르게 좁힙니다.</p>
                <div className={styles.fOne}>픽업게임과 시설 핀을 한 화면에서 보고, 다음 행동(참여/예약)으로 이어집니다.</div>
              </div>

              <div className={`${styles.f} ${styles.reveal}`} >
                <h3 className={styles.fTitle}>픽업게임(게스트 모집) 흐름</h3>
                <p className={styles.fDesc}>커뮤니티 가치: 게시글 기반 모집을 앱 참여 UI로 정리합니다.</p>
                <div className={styles.fOne}>날짜·시간·장소·남은 자리 같은 정보를 &quot;결정&quot;에 맞게 배치합니다.</div>
              </div>

              <div className={`${styles.f} ${styles.reveal}`} >
                <h3 className={styles.fTitle}>시설 상세 → 예약 연결</h3>
                <p className={styles.fDesc}>시설 가치: 정보 확인에서 예약 전환까지의 흐름을 단순화합니다.</p>
                <div className={styles.fOne}>운영 정보/위치 확인 후 (가능한 경우) 타임슬롯 선택으로 자연스럽게 이어집니다.</div>
              </div>

              <div className={`${styles.f} ${styles.reveal}`} >
                <h3 className={styles.fTitle}>주최자 관점 설계</h3>
                <p className={styles.fDesc}>운영 가치: 모집/운영의 반복 작업을 줄이는 방향으로 설계했습니다.</p>
                <div className={styles.fOne}>주최자(동호회 운영자/경기 개설자)의 &quot;모집&quot;을 앱 행동으로 바꿉니다.</div>
              </div>

              <div className={`${styles.f} ${styles.reveal}`} >
                <h3 className={styles.fTitle}>시설 관리자 앱</h3>
                <p className={styles.fDesc}>운영 가치: 업장 등록, 예약/상품/정산/홍보를 관리하는 도구입니다.</p>
                <div className={styles.fOne}>시설이 자기 업장을 등록하고 운영 데이터를 한 곳에서 관리하도록 돕습니다.</div>
              </div>

              <div className={`${styles.f} ${styles.reveal}`} >
                <h3 className={styles.fTitle}>농구 중심 론칭</h3>
                <p className={styles.fDesc}>집중 가치: 초기 종목은 농구에 집중해 경험을 먼저 완성합니다.</p>
                <div className={styles.fOne}>확장보다 &quot;지금 당장 쓰이는&quot; 흐름을 우선합니다.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section id="partner" className={styles.section}>
        <div className={`${styles.container} ${styles.sectionContent}`}>
          <div className={styles.reveal} >
            <p className={styles.eyebrow}>Why partner with us</p>
            <h2 className={styles.h2}>상대 입장에서, 얻는 게 분명해야 합니다.</h2>
            <p className={styles.lead}>
              SITE는 &quot;더 많은 약속&quot;보다, 협업이 가능한 지점을 <b>구조</b>로 제시합니다.
              아래는 확정된 수치 약속이 아니라, 이런 방향으로 설계했다는 설명입니다.
            </p>

            <div className={styles.partnerGrid}>
              <div className={`${styles.pbox} ${styles.reveal}`} >
                <div className={styles.pboxTitle}>
                  <b className={styles.pboxTitleB}>시설(코트/체육관)</b>
                  <span className={styles.pill}>운영·예약</span>
                </div>
                <p className={styles.pboxDesc}>
                  예약 가능 시간 노출, 상세 정보 정리, 그리고 운영자 관점의 관리 도구(관리자 앱)까지.
                  &quot;전화/DM로만 받던 예약&quot;을 더 정돈된 흐름으로 바꾸는 것을 목표로 합니다.
                </p>
              </div>

              <div className={`${styles.pbox} ${styles.reveal}`} >
                <div className={styles.pboxTitle}>
                  <b className={styles.pboxTitleB}>커뮤니티/동호회</b>
                  <span className={styles.pill}>모집·참여</span>
                </div>
                <p className={styles.pboxDesc}>
                  네이버 카페에서 이루어지는 게스트(용병) 모집 문맥을 유지하면서,
                  참여 결정을 빠르게 만드는 UI/흐름으로 옮깁니다.
                </p>
              </div>

              <div className={`${styles.pbox} ${styles.reveal}`} >
                <div className={styles.pboxTitle}>
                  <b className={styles.pboxTitleB}>브랜드/광고주</b>
                  <span className={styles.pill}>프로모션</span>
                </div>
                <p className={styles.pboxDesc}>
                  사용자가 &apos;운동을 하러 가는 순간&apos;에 노출되는 접점에서,
                  브랜드 메시지가 자연스럽게 연결되도록 기획할 수 있습니다.
                </p>
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.reveal}  style={{ marginTop: '18px' }}>
              <p className={styles.lead}>
                <b>신뢰/유통 채널:</b> 네이버 카페 <b>NSB 농심(약 26만)</b> 농구 카페와 협업 진행 중.
                커뮤니티 기반의 실제 유통 경로를 함께 고민하고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Ideas Section */}
      <section id="ideas" className={`${styles.section} ${styles.sectionSoft}`}>
        <div className={`${styles.container} ${styles.sectionContent}`}>
          <div className={styles.reveal} >
            <p className={styles.eyebrow}>Collaboration ideas</p>
            <h2 className={styles.h2}>바로 떠올릴 수 있는 협업/광고 형태.</h2>
            <p className={styles.lead}>
              비용/성과/수치를 약속하지 않습니다.
              대신, 실행 가능한 <b>형태(옵션)</b>를 먼저 제시합니다. (세부 조건은 협의)
            </p>

            <div className={styles.ideas}>
              <div className={`${styles.list} ${styles.reveal}`} >
                <ul className={styles.listUl}>
                  <li className={styles.listLi}><b>시설 제휴</b> <span className={styles.listLiSpan}>— 시설 상세/예약 흐름 내 &apos;추천 시설&apos; 또는 &apos;제휴 시설&apos; 노출</span></li>
                  <li className={styles.listLi}><b>지역/시간대 캠페인</b> <span className={styles.listLiSpan}>— 특정 지역/타임슬롯 중심 프로모션(운동 순간에 맞춘 메시지)</span></li>
                  <li className={styles.listLi}><b>커뮤니티 콜라보</b> <span className={styles.listLiSpan}>— 카페 운영 방식에 맞춘 픽업게임 모집 템플릿/운영 지원</span></li>
                  <li className={styles.listLi}><b>온/오프라인 연계</b> <span className={styles.listLiSpan}>— 시설 내 QR, 현장 안내물 기반으로 앱 유입 연결</span></li>
                  <li className={styles.listLi}><b>브랜드 스폰서십</b> <span className={styles.listLiSpan}>— 픽업게임/시설 탐색 경험 속 자연스러운 브랜딩 접점 설계</span></li>
                  <li className={styles.listLi}><b>콘텐츠 협업</b> <span className={styles.listLiSpan}>— 픽업 참여 가이드/시설 소개 등 &apos;실사용자 맥락&apos; 콘텐츠 공동 제작</span></li>
                </ul>
              </div>

              <div className={`${styles.tile} ${styles.tilePad} ${styles.reveal}`} >
                <p style={{ margin: '0 0 10px', fontWeight: 760, letterSpacing: '-0.02em' }}>
                  수익 구조(수치 없이)
                </p>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13.5px' }}>
                  SITE는 <b>예약 수수료</b>, <b>광고/프로모션</b>, 그리고 <b>확장(프리미엄)</b> 같은 구조를 통해
                  수익화가 가능하도록 설계합니다. 구체 조건과 범위는 파트너와의 협의로 확정합니다.
                </p>

                <hr className={styles.divider} />

                <p style={{ margin: '14px 0 8px', fontWeight: 760, letterSpacing: '-0.02em' }}>
                  기술 스택(확정된 사실만)
                </p>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13.5px' }}>
                  MVP 개발은 <b>React</b> 및 <b>SQL</b> 기반이며, <b>네이버 지도 API</b>, <b>GPS 기반 위치 수집</b> 방식으로 구현합니다.
                  (현재: 디자인/기획 상당 부분 완료, MVP 개발 시작)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How To Work Together Section */}
      <section id="how" className={styles.section}>
        <div className={`${styles.container} ${styles.sectionContent}`}>
          <div className={styles.reveal} >
            <p className={styles.eyebrow}>How to work together</p>
            <h2 className={styles.h2}>가볍게 시작하고, 빠르게 합의합니다.</h2>
            <p className={styles.lead}>
              길게 계약부터 시작하지 않습니다.
              먼저 짧게 대화하고, 맞으면 빠르게 범위를 정합니다. (세부 조건은 협의)
            </p>

            <div className={styles.steps}>
              <div className={`${styles.step} ${styles.reveal}`} >
                <div className={styles.num}>1</div>
                <b className={styles.stepB}>첫 연락(회신/DM)</b>
                <p className={styles.stepP}>&quot;제휴/광고 중 무엇을 논의할지&quot;만 간단히 알려주세요.</p>
              </div>
              <div className={`${styles.step} ${styles.reveal}`} >
                <div className={styles.num}>2</div>
                <b className={styles.stepB}>간단 브리프</b>
                <p className={styles.stepP}>목표/대상/기간 같은 기본 조건을 짧게 정리합니다.</p>
              </div>
              <div className={`${styles.step} ${styles.reveal}`} >
                <div className={styles.num}>3</div>
                <b className={styles.stepB}>일정/범위 합의</b>
                <p className={styles.stepP}>가능한 옵션을 제시하고, 실행 가능한 형태로 좁힙니다.</p>
              </div>
              <div className={`${styles.step} ${styles.reveal}`} >
                <div className={styles.num}>4</div>
                <b className={styles.stepB}>진행 → 리뷰</b>
                <p className={styles.stepP}>운영 후 피드백을 반영해 다음 액션을 설계합니다.</p>
              </div>
            </div>

            <hr className={styles.divider} />

            {/* Glossary */}
            <div className={styles.reveal}  style={{ marginTop: '18px' }}>
              <p className={styles.eyebrow}>Glossary</p>
              <h3 style={{ margin: '0 0 10px', fontSize: '18px', letterSpacing: '-0.02em' }}>핵심 용어</h3>

              <div className={styles.meta}>
                <div className={`${styles.metaRow} ${styles.metaRowFirst}`}>
                  <div className={styles.metaK}>픽업게임</div>
                  <div className={styles.metaV}>특정 시간·장소에 열리는 번개 경기. SITE에서는 특히 &quot;게스트(용병) 모집 경기&quot;를 의미</div>
                </div>
                <div className={styles.metaRow}>
                  <div className={styles.metaK}>게스트(용병)</div>
                  <div className={styles.metaV}>동호회 고정멤버가 아닌 외부 참여자</div>
                </div>
                <div className={styles.metaRow}>
                  <div className={styles.metaK}>주최자</div>
                  <div className={styles.metaV}>동호회 운영자 또는 경기 개설자</div>
                </div>
                <div className={styles.metaRow}>
                  <div className={styles.metaK}>시설</div>
                  <div className={styles.metaV}>농구 코트/체육관 등 대관 가능한 업장</div>
                </div>
                <div className={styles.metaRow}>
                  <div className={styles.metaK}>관리자 앱</div>
                  <div className={styles.metaV}>시설이 자기 업장을 등록하고 예약/상품/정산/홍보를 관리하는 도구</div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

      {/* Team Section */}
      <section id="team" className={`${styles.section} ${styles.sectionSoft}`}>
        <div className={`${styles.container} ${styles.sectionContent}`}>
          <div className={styles.reveal}>
            <p className={styles.eyebrow}>Our Team</p>
            <h2 className={styles.h2}>함께 만들어가는 사람들</h2>
            <p className={styles.lead}>
              SITE는 스포츠를 사랑하는 팀원들이 모여 만들고 있습니다.
              각자의 전문성을 바탕으로 더 나은 스포츠 경험을 설계합니다.
            </p>

            {/* 기획/마케팅과 디자인을 한 행에 배치 */}
            <div className={styles.teamSplitRow}>
              {/* 왼쪽: 기획/마케팅 */}
              <div className={styles.teamGroup}>
                <h3 className={styles.teamCategoryTitle}>기획 / 마케팅</h3>
                <div className={`${styles.teamGrid} ${styles.teamGridTwo}`}>
                  {teamGroups[0].members.map((member, index) => (
                    <div key={index} className={`${styles.teamCard} ${styles.reveal}`}>
                      <div className={styles.teamAvatar}>
                        {member.profileImage ? (
                          <Image
                            src={member.profileImage}
                            alt={`${member.name} 프로필`}
                            width={64}
                            height={64}
                            className={styles.teamAvatarImg}
                          />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                      <div className={styles.teamInfo}>
                        <b className={styles.teamName}>{member.name}</b>
                        <span className={styles.teamRole}>{member.role}</span>
                      </div>
                      <p className={styles.teamDesc}>{member.desc}</p>
                      <div className={styles.teamSchool}>
                        <span className={styles.schoolName}>{member.school}</span>
                        <span className={styles.majorName}>{member.major}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 오른쪽: 디자인 */}
              <div className={styles.teamGroup}>
                <h3 className={styles.teamCategoryTitle}>디자인</h3>
                <div className={`${styles.teamGrid} ${styles.teamGridTwo}`}>
                  {teamGroups[2].members.map((member, index) => (
                    <div key={index} className={`${styles.teamCard} ${styles.reveal}`}>
                      <div className={styles.teamAvatar}>
                        {member.profileImage ? (
                          <Image
                            src={member.profileImage}
                            alt={`${member.name} 프로필`}
                            width={64}
                            height={64}
                            className={styles.teamAvatarImg}
                          />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                      <div className={styles.teamInfo}>
                        <b className={styles.teamName}>{member.name}</b>
                        <span className={styles.teamRole}>{member.role}</span>
                      </div>
                      <p className={styles.teamDesc}>{member.desc}</p>
                      <div className={styles.teamSchool}>
                        <span className={styles.schoolName}>{member.school}</span>
                        <span className={styles.majorName}>{member.major}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 개발 그룹 */}
            <div className={styles.teamGroup}>
              <h3 className={styles.teamCategoryTitle}>{teamGroups[1].category}</h3>
              <div className={styles.teamGrid}>
                {teamGroups[1].members.map((member, index) => (
                  <div key={index} className={`${styles.teamCard} ${styles.reveal}`}>
                    <div className={styles.teamAvatar}>
                      {member.profileImage ? (
                        <Image
                          src={member.profileImage}
                          alt={`${member.name} 프로필`}
                          width={64}
                          height={64}
                          className={styles.teamAvatarImg}
                        />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                    <div className={styles.teamInfo}>
                      <b className={styles.teamName}>{member.name}</b>
                      <span className={styles.teamRole}>{member.role}</span>
                    </div>
                    <p className={styles.teamDesc}>{member.desc}</p>
                    <div className={styles.teamSchool}>
                      <span className={styles.schoolName}>{member.school}</span>
                      <span className={styles.majorName}>{member.major}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
