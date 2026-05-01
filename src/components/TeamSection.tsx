'use client';

import { MutableRefObject, useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import styles from './TeamSection.module.css';

const siteTeamGroups = [
  {
    category: '기획 / 마케팅',
    members: [
      {
        name: '임태호',
        nameEn: 'Taeho Lim',
        role: '대표 / 기획',
        cTitle: 'CEO / CFO',
        desc: '서비스 총괄 및 기획',
        school: '연세대학교',
        major: '신학과',
        profileImage: '/images/team/임태호.png',
        email: 'alex0613lim@gmail.com',
        career: ['U-TEED 대표', 'SITE 서비스 기획 총괄'],
      },
      {
        name: '홍예찬',
        nameEn: 'Yechan Hong',
        role: '마케팅',
        desc: '마케팅 전략 및 커뮤니티 운영',
        school: '연세대학교',
        major: '물리학과',
        profileImage: '/images/team/홍예찬.png',
        email: '',
        career: ['마케팅 전략 수립', '커뮤니티 운영 관리'],
      },
    ],
  },
  {
    category: '개발',
    members: [
      {
        name: '김재윤',
        nameEn: 'Jaeyoon Kim',
        role: 'Frontend',
        desc: '프론트엔드 개발, 유저 앱 개발',
        school: '고려대학교',
        major: '인공지능사이버보안학과',
        profileImage: '/images/team/김재윤.png',
        email: 'bbiyakyee7@gmail.com',
        career: ['프론트엔드 개발', '유저 앱 UI/UX 구현',
          '제 5회 한국코드페어 대상 (국무총리상 수상)',
          '제 1회 경기창고 수상 (크리에이티브상, 공감상)',
          '2024년 국제과학기술경진대회 대한민국 대표 발탁',
          '2024년 국제과학기술경진대회 임베디드 부문 본상 2등상 수상',
          '2024년 대한민국 인재상 수상'
        ],
      },
      {
        name: '정민규',
        nameEn: 'Mingyu Jeong',
        role: 'Frontend',
        desc: '프론트엔드 개발, 관리자용 앱 개발',
        school: '홍익대학교',
        major: '소프트웨어융합학과',
        profileImage: '/images/team/정민규.png',
        email: 'pauljjang410@gmail.com',
        career: ['프론트엔드 개발', '관리자용 앱 개발',
          'KITRI Best of the Best 12기 취약점분석 수료',
          '2023 대구 AI·Big Data·Blockchain 해커톤 최우수상',
          '2024 충청북도 생성형 인공지능 전국 경진대회 우수상',
          '2024 제1회 스마트 AI 콘텐츠 대회 입상',
          '2024 제30회 전국 창의성 IT코딩 경시대회: 빅데이터 영역 경기도지회장상',
          '2024 제30회 전국 창의성 IT코딩 경시대회: 정보처리 전문가 영역 국회의원상',
          '2025.7.21 ~ 9.5 이노그리드 하이브리드 플랫폼팀 인턴',
          '2025 구미시 정책제안 공모전 은상',
        ],
      },
      {
        name: '김진영',
        nameEn: 'Jinyoung Kim',
        role: 'Backend',
        desc: '백엔드 개발, 서버 관리 및 운영',
        school: '고려대학교',
        major: '인공지능사이버보안학과',
        profileImage: '/images/team/김진영.png',
        email: '',
        career: ['백엔드 개발', '서버 인프라 관리 및 운영'],
      },
      {
        name: '김명준',
        nameEn: 'Myungjun Kim',
        role: 'Backend',
        desc: '백엔드 개발',
        school: '고려대학교',
        major: '인공지능사이버보안학과',
        profileImage: '/images/team/김명준.png',
        email: '',
        career: ['백엔드 개발'],
      },
      {
        name: '윤효빈',
        nameEn: 'Hyobin Yoon',
        role: 'Backend',
        desc: '백엔드 개발',
        school: '고려대학교',
        major: '인공지능사이버보안학과',
        profileImage: '/images/team/윤효빈.png',
        inactive: true,
        inactiveReason: '군복무로 휴직',
        email: '',
        career: ['백엔드 개발'],
      },
    ],
  },
  {
    category: '디자인',
    members: [
      {
        name: '최수진',
        nameEn: 'Sujin Choi',
        role: 'UI/UX',
        desc: 'UI/UX 디자인',
        school: '홍익대학교',
        major: '시각디자인학과',
        profileImage: '/images/team/최수진.png',
        email: '',
        career: ['UI/UX 디자인'],
      },
      {
        name: '박혜원',
        nameEn: 'Hyewon Park',
        role: 'SNS 마케팅',
        desc: 'SNS 마케팅 자료 제작',
        school: '경희대학교',
        major: '시각디자인학과',
        profileImage: '/images/team/박혜원.png',
        email: '',
        career: ['SNS 마케팅 자료 제작'],
      },
    ],
  },
];

const beepbeepTeamGroups = [
  {
    category: '기획',
    members: [
      {
        name: '임태호',
        nameEn: 'Taeho Lim',
        role: '공동대표 / 기획',
        cTitle: 'CEO / CFO',
        desc: '서비스 총괄 및 기획',
        school: '연세대학교',
        major: '신학과',
        profileImage: '/images/team/임태호.png',
        email: 'alex0613lim@gmail.com',
        career: ['U-TEED 대표', 
          'MCI Link 서비스 기획 총괄', 
          '2024 경희대학교 창업경진대회 최우수상 수상',
          '2024 경희대학교 지식재산권 활용 특허캠프 우수상 수상',
          '2025 KORES LBS 스타트업 챌린지 아이디어 부문 최종 단계 진출',
          '농구 중심 스포츠 커뮤니티 플랫폼 기획, 운영',
          '(mvp 기능 정의 및 서비스 구조 설게, 픽업 게임 매칭 구조 설계, 외부 협업 및 제휴)'],
      },
      {
        name: '박규원',
        nameEn: 'Gyuwon Park',
        role: '공동대표',
        cTitle: 'COO / CMO',
        desc: '서비스 총괄',
        school: '연세대학교',
        major: '불어불문학과',
        profileImage: '/images/team/박규원.png',
        email: 'pkw0110@gmail.com',
        career: ['MCI Link 공동대표', '서비스 총괄', 
          'UN Hult Prize 국제창업대회 세미파이널 진출', 
          '한국경제연구원 경제 연합 단체 YLC 운영진 활동 및 우수상 수상',
          '하나금융그룹 대학생 멘토 우수상 수상',
          '한영회계법인 Assurance(ADC) 인턴 근무',
          'IXL Korea Consulting Action Project 2025 인턴십 수료',],
      },
    ],
  },
  {
    category: '개발',
    members: [
      {
        name: '김재윤',
        nameEn: 'Jaeyoon Kim',
        role: 'Frontend',
        desc: '프론트엔드 개발, 유저 앱 개발',
        school: '고려대학교',
        major: '인공지능사이버보안학과',
        profileImage: '/images/team/김재윤.png',
        email: 'bbiyakyee7@gmail.com',
        career: ['프론트엔드 개발', '유저 앱 UI/UX 구현', 
          '제 5회 한국코드페어 대상 (국무총리상 수상)',
          '제 1회 경기창고 수상 (크리에이티브상, 공감상)',
          '2024년 국제과학기술경진대회 대한민국 대표 발탁',
          '2024년 국제과학기술경진대회 임베디드 부문 본상 2등상 수상',
          '2024년 대한민국 인재상 수상',
        ],
      },
      {
        name: '정민규',
        nameEn: 'Mingyu Jeong',
        role: 'Frontend/AI',
        desc: 'MCI Link AI 개발',
        school: '홍익대학교',
        major: '소프트웨어융합학과',
        profileImage: '/images/team/정민규.png',
        email: 'pauljjang410@gmail.com',
        career: ['MCI Link AI 알고리즘 개발', '2022 현대오토에버·함께일하는재단 화이트해커 경진대회 우수상', 
          'KITRI Best of the Best 12기 취약점분석 수료',
          '2023 대구 AI·Big Data·Blockchain 해커톤 최우수상',
          '2024 충청북도 생성형 인공지능 전국 경진대회 우수상',
          '2024 제1회 스마트 AI 콘텐츠 대회 입상',
          '2024 제30회 전국 창의성 IT코딩 경시대회: 빅데이터 영역 경기도지회장상',
          '2024 제30회 전국 창의성 IT코딩 경시대회: 정보처리 전문가 영역 국회의원상',
          '2025.7.21 ~ 9.5 이노그리드 하이브리드 플랫폼팀 인턴',
          '2025 구미시 정책제안 공모전 은상',
        ],
      },
      {
        name: '유동준',
        nameEn: 'Dong Jun Yu',
        role: 'AI / Algorithm',
        desc: 'AI/알고리즘 개발',
        school: '',
        major: '',
        profileImage: '/images/team/유동준.png',
        email: '1qpalzmaa@gmail.com',
        career: [
          'AI/알고리즘 개발',
          '제 6회 한국코드페어 금상 (과기부장관상 수상)',
          '2024학년도 동국대 과학영재교육원 사사과정 논문 발표',
          '대학부설 과학영재교육원 사사연구과정 성과발표대회 논문 발표',
          '2024, 2025 동국대 과학영재원 재학',
        ],
      },
      {
        name: '김진영',
        nameEn: 'Jinyoung Kim',
        role: 'AI / Server',
        desc: 'AI·서버 개발',
        school: '고려대학교',
        major: '인공지능사이버보안학과',
        profileImage: '/images/team/김진영.png',
        email: '',
        career: ['MCI Link AI 및 서버 개발'],
      },
    ],
  },
  {
    category: 'R&D',
    members: [
      {
        name: '최아인',
        nameEn: 'Ain Choi',
        role: 'Researcher',
        desc: '경도인지장애 연구 및 분석',
        school: '연세대학교',
        major: '의예과',
        profileImage: '/images/team/최아인.png',
        email: 'ain0721.choi@gmail.com',
        career: ['경도인지장애 연구 및 분석', 
          '세종과고 전교 1등 졸업', '대학전쟁 시즌 3 출연'],
      },
    ],
  },
];

const teamGroupsByProject = {
  site: siteTeamGroups,
  beepbeep: beepbeepTeamGroups,
};

interface TeamMember {
  name: string;
  nameEn?: string;
  role: string;
  cTitle?: string;
  desc: string;
  school: string;
  major: string;
  profileImage?: string;
  inactive?: boolean;
  inactiveReason?: string;
  email?: string;
  career?: string[];
}

interface TeamGroup {
  category: string;
  members: TeamMember[];
}

interface TeamSectionProps {
  sectionRef?: MutableRefObject<HTMLElement | null>;
  id: string;
  project?: 'site' | 'beepbeep';
}

const projectDescriptions = {
  site: 'SITE는 스포츠를 사랑하는 팀원들이 모여 만들고 있습니다. 각자의 전문성을 바탕으로 더 나은 스포츠 경험을 설계합니다.',
  beepbeep: 'MCI Link는 가족의 건강을 소중히 여기는 팀원들이 모여 만들고 있습니다. 각자의 전문성을 바탕으로 의료 연계형 돌봄 보조 솔루션을 설계합니다.',
};

function TeamCardContent({ member }: { member: TeamMember }) {
  return (
    <>
      <div
        className={`${styles.teamAvatar} ${
          member.profileImage ? styles.teamAvatarWithImage : ''
        }`}
      >
        {member.profileImage ? (
          <Image
            src={member.profileImage}
            alt={`${member.name} 프로필`}
            width={200}
            height={200}
            quality={100}
            unoptimized
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
    </>
  );
}

function FlipCardFront({ member }: { member: TeamMember }) {
  return (
    <div className={`${styles.flipCardFace} ${styles.flipCardFront}`}>
      <div className={styles.flipAvatar}>
        {member.profileImage ? (
          <Image
            src={member.profileImage}
            alt={`${member.name} 프로필`}
            width={220}
            height={220}
            quality={100}
            unoptimized
            className={styles.flipAvatarImg}
          />
        ) : (
          <div className={styles.flipAvatarFallback}>{member.name.charAt(0)}</div>
        )}
      </div>
      <span className={styles.flipName}>{member.name}</span>
      <span className={styles.flipRole}>{member.role}</span>
      <p className={styles.flipDesc}>{member.desc}</p>
      <div className={styles.flipSchoolInfo}>
        <span className={styles.flipSchoolName}>{member.school}</span>
        <span className={styles.flipMajorName}>{member.major}</span>
      </div>
      <span className={styles.flipHint}>탭하여 뒤집기</span>
    </div>
  );
}

function FlipCardBack({ member }: { member: TeamMember }) {
  return (
    <div className={`${styles.flipCardFace} ${styles.flipCardBack}`}>
      <div className={styles.backHeader}>
        <div className={styles.backAvatar}>
          {member.profileImage ? (
            <Image
              src={member.profileImage}
              alt={`${member.name} 프로필`}
              width={120}
              height={120}
              quality={100}
              unoptimized
              className={styles.flipAvatarImg}
            />
          ) : (
            <div className={styles.flipAvatarFallback}>{member.name.charAt(0)}</div>
          )}
        </div>
        <div className={styles.backHeaderInfo}>
          <span className={styles.backName}>{member.name}</span>
          {member.nameEn && (
            <span className={styles.backNameEn}>{member.nameEn}</span>
          )}
          <span className={styles.backRole}>{member.role}</span>
          {member.cTitle && (
            <span className={styles.backCTitle}>{member.cTitle}</span>
          )}
        </div>
      </div>

      <div className={styles.backDivider} />

      <div className={styles.backBody}>
        {member.career && member.career.length > 0 && (
          <div className={styles.backCareerSection}>
            <span className={styles.backSectionLabel}>경력 / 이력</span>
            <ul className={styles.backCareerList}>
              {member.career.map((item, i) => (
                <li key={i} className={styles.backCareerItem}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.backEducation}>
          <span className={styles.backSectionLabel}>학력</span>
          <span className={styles.backEducationText}>
            {member.school} {member.major}
          </span>
        </div>

        {member.email && (
          <div className={styles.backEmailSection}>
            <span className={styles.backSectionLabel}>이메일</span>
            <a href={`mailto:${member.email}`} className={styles.backEmail}>
              {member.email}
            </a>
          </div>
        )}
      </div>

      <span className={styles.flipHint}>아무 곳이나 눌러 닫기</span>
    </div>
  );
}

interface ModalOrigin {
  x: number;
  y: number;
  scale: number;
}

function FlipCardModal({
  member,
  origin,
  onClose,
}: {
  member: TeamMember;
  origin: ModalOrigin;
  onClose: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlipped(true));
    });
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setFlipped(false);
    setTimeout(() => onClose(), 500);
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleClose]);

  const wrapperCls = [
    styles.flipCardWrapper,
    flipped && !closing ? styles.flipCardFlipped : '',
    closing ? styles.flipCardClosing : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`${styles.modalOverlay} ${closing ? styles.modalOverlayClosing : ''}`}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className={wrapperCls}
        style={{
          '--origin-x': `${origin.x}px`,
          '--origin-y': `${origin.y}px`,
          '--origin-scale': origin.scale,
        } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.flipCardInner}>
          <FlipCardFront member={member} />
          <FlipCardBack member={member} />
        </div>
      </div>
    </div>
  );
}

function TeamCard({
  member,
  onSelect,
}: {
  member: TeamMember;
  onSelect: (m: TeamMember, rect: DOMRect) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (member.inactive) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) onSelect(member, rect);
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.teamCard} ${styles.reveal} ${
        member.inactive ? styles.teamCardInactive : ''
      }`}
      data-inactive-reason={member.inactive ? member.inactiveReason : undefined}
      onClick={handleClick}
    >
      <TeamCardContent member={member} />
    </div>
  );
}

export default function TeamSection({ sectionRef, id, project = 'site' }: TeamSectionProps) {
  const teamGroups = teamGroupsByProject[project];
  const [planningMarketing, development, design] = teamGroups as TeamGroup[];
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [modalOrigin, setModalOrigin] = useState<ModalOrigin>({ x: 0, y: 0, scale: 0.4 });

  const MODAL_W = 320;
  const MODAL_H = 420;

  const handleCardSelect = useCallback((m: TeamMember, rect: DOMRect) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cardCX = rect.left + rect.width / 2;
    const cardCY = rect.top + rect.height / 2;
    const offsetX = cardCX - vw / 2;
    const offsetY = cardCY - vh / 2;
    const scale = Math.min(rect.width / MODAL_W, rect.height / MODAL_H, 0.65);
    setModalOrigin({ x: offsetX, y: offsetY, scale });
    setSelectedMember(m);
  }, []);

  return (
    <section
      className={`${styles.section} ${styles.sectionSoft} team-section ${styles.teamSection}`}
      ref={(el) => {
        if (sectionRef) sectionRef.current = el;
      }}
      id={id}
    >
      <div className={`${styles.container} ${styles.sectionContent}`}>
        <div className={styles.reveal}>
          <p className={styles.eyebrow}>Our Team</p>
          <h2 className={styles.h2}>함께 만들어가는 사람들</h2>
          <p className={styles.lead}>
            {projectDescriptions[project]}
          </p>

          <div className={styles.teamSplitRow}>
            <div className={styles.teamGroup}>
              <h3 className={styles.teamCategoryTitle}>{planningMarketing.category}</h3>
              <div className={`${styles.teamGrid} ${styles.teamGridTwo}`}>
                {planningMarketing.members.map((member, index) => (
                  <TeamCard key={index} member={member} onSelect={handleCardSelect} />
                ))}
              </div>
            </div>

            {design.members.length > 0 ? (
              <div className={styles.teamGroup}>
                <h3 className={styles.teamCategoryTitle}>{design.category}</h3>
                <div className={`${styles.teamGrid} ${styles.teamGridTwo}`}>
                  {design.members.map((member, index) => (
                    <TeamCard key={index} member={member} onSelect={handleCardSelect} />
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.teamGroup}>
                <h3 className={styles.teamCategoryTitle}>{development.category}</h3>
                <div className={`${styles.teamGrid} ${styles.teamGridTwo}`}>
                  {development.members.map((member, index) => (
                    <TeamCard key={index} member={member} onSelect={handleCardSelect} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {design.members.length > 0 && (
            <div className={styles.teamGroup}>
              <h3 className={styles.teamCategoryTitle}>{development.category}</h3>
              <div className={styles.teamGrid}>
                {development.members.map((member, index) => (
                  <TeamCard key={index} member={member} onSelect={handleCardSelect} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedMember && (
        <FlipCardModal
          member={selectedMember}
          origin={modalOrigin}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </section>
  );
}
