'use client';

import { MutableRefObject, useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import styles from './TeamSection.module.css';
import { useThemeLang } from './ThemeLanguageProvider';

const schoolTranslations: Record<string, string> = {
  '연세대학교': 'Yonsei University',
  '고려대학교': 'Korea University',
  '경희대학교': 'Kyung Hee University',
  '홍익대학교': 'Hongik University',
};

const majorTranslations: Record<string, string> = {
  '신학과': 'Theology',
  '물리학과': 'Physics',
  '인공지능사이버보안학과': 'AI & Cybersecurity',
  '소프트웨어융합학과': 'Software Convergence',
  '불어불문학과': 'French Language & Literature',
  '시각디자인학과': 'Visual Design',
  '의예과': 'Pre-Medicine',
};

const descTranslations: Record<string, string> = {
  '서비스 총괄 및 기획': 'Service Planning & Management',
  '마케팅 전략 및 커뮤니티 운영': 'Marketing Strategy & Community',
  '프론트엔드 개발, 앱 개발': 'Frontend Dev, App Dev',
  '프론트엔드 개발, 앱 개발, AI 개발': 'Frontend Dev, App Dev, AI Development',
  '백엔드 개발, 서버 관리 및 운영': 'Backend Dev, Server Management',
  '백엔드 개발, 서버 관리 및 운영, AI·서버 개발': 'Backend Dev, Server Management / AI & Server Development',
  '백엔드 개발': 'Backend Development',
  'UI/UX 디자인': 'UI/UX Design',
  'SNS 마케팅 자료 제작': 'SNS Marketing Content',
  '서비스 총괄': 'Service Management',
  'MCI Link AI 개발': 'MCI Link AI Development',
  'AI/알고리즘 개발': 'AI/Algorithm Development',
  'AI·서버 개발': 'AI & Server Development',
  '경도인지장애 연구 및 분석': 'MCI Research & Analysis',
};

const inactiveReasonTranslations: Record<string, string> = {
  '군복무로 휴직': 'On Leave (Military Service)',
};

const careerTranslations: Record<string, string> = {
  'U-TEED 대표': 'U-TEED CEO',
  'SITE 서비스 기획 총괄': 'SITE Service Planning Lead',
  'MCI Link 서비스 기획 총괄': 'MCI Link Service Planning Lead',
  'MCI Link 공동대표': 'MCI Link Co-CEO',
  '서비스 총괄': 'Service Management',
  '마케팅 전략 수립': 'Marketing Strategy',
  '커뮤니티 운영 관리': 'Community Operations',
  '프론트엔드 개발': 'Frontend Development',
  '유저 앱 UI/UX 구현': 'User App UI/UX Implementation',
  '관리자용 앱 개발': 'Admin App Development',
  '백엔드 개발': 'Backend Development',
  '서버 인프라 관리 및 운영': 'Server Infrastructure Management',
  'MCI Link AI 및 서버 개발': 'MCI Link AI & Server Development',
  'MCI Link AI 알고리즘 개발': 'MCI Link AI Algorithm Development',
  'AI/알고리즘 개발': 'AI/Algorithm Development',
  'UI/UX 디자인': 'UI/UX Design',
  'SNS 마케팅 자료 제작': 'SNS Marketing Content Creation',
  '경도인지장애 연구 및 분석': 'MCI Research & Analysis',
  '세종과고 전교 1등 졸업': 'Graduated Top of Class, Sejong Science High School',
  '대학전쟁 시즌 3 출연': 'Appeared on "College War" Season 3',
  '제 5회 한국코드페어 대상 (국무총리상 수상)': '5th Korea Code Fair Grand Prize (Prime Minister Award)',
  '제 1회 경기창고 수상 (크리에이티브상, 공감상)': '1st Gyeonggi Changgo Award (Creative Award, Empathy Award)',
  '2024년 국제과학기술경진대회 대한민국 대표 발탁': 'Selected as Korean Representative, 2024 Regeneron ISEF',
  '2024년 국제과학기술경진대회 임베디드 부문 본상 2등상 수상': '2nd Place, Embedded Division, 2024 Regeneron ISEF',
  '2024년 대한민국 인재상 수상': '2024 Korea Talent Award',
  'KITRI Best of the Best 12기 취약점분석 수료': 'KITRI Best of the Best 12th Cohort — Vulnerability Analysis',
  '2023 대구 AI·Big Data·Blockchain 해커톤 최우수상': '2023 Daegu AI·Big Data·Blockchain Hackathon Best Award',
  '2024 충청북도 생성형 인공지능 전국 경진대회 우수상': '2024 Chungbuk Generative AI National Competition Excellence Award',
  '2024 제1회 스마트 AI 콘텐츠 대회 입상': '2024 1st Smart AI Content Competition Prize',
  '2024 제30회 전국 창의성 IT코딩 경시대회: 빅데이터 영역 경기도지회장상': '2024 30th National Creative IT Coding Competition: Big Data — Gyeonggi Chapter Award',
  '2024 제30회 전국 창의성 IT코딩 경시대회: 정보처리 전문가 영역 국회의원상': '2024 30th National Creative IT Coding Competition: IT Expert — National Assembly Award',
  '2025.7.21 ~ 9.5 이노그리드 하이브리드 플랫폼팀 인턴': 'Jul–Sep 2025 Innogrid Hybrid Platform Team Intern',
  '2025 구미시 정책제안 공모전 은상': '2025 Gumi City Policy Proposal Competition Silver Award',
  '2024 경희대학교 창업경진대회 최우수상 수상': '2024 Kyung Hee University Startup Competition Grand Prize',
  '2024 경희대학교 지식재산권 활용 특허캠프 우수상 수상': '2024 Kyung Hee University IP Patent Camp Excellence Award',
  '2025 KORES LBS 스타트업 챌린지 아이디어 부문 최종 단계 진출': '2025 KORES LBS Startup Challenge Idea Track Finalist',
  '농구 중심 스포츠 커뮤니티 플랫폼 기획, 운영': 'Basketball Sports Community Platform — Planning & Operations',
  '(mvp 기능 정의 및 서비스 구조 설게, 픽업 게임 매칭 구조 설계, 외부 협업 및 제휴)': '(MVP feature definition, service architecture, pickup game matching, external partnerships)',
  'UN Hult Prize 국제창업대회 세미파이널 진출': 'UN Hult Prize International Startup Competition Semi-Finalist',
  '한국경제연구원 경제 연합 단체 YLC 운영진 활동 및 우수상 수상': 'KERI-affiliated YLC Operations Member & Excellence Award',
  '하나금융그룹 대학생 멘토 우수상 수상': 'Hana Financial Group Student Mentor Excellence Award',
  '한영회계법인 Assurance(ADC) 인턴 근무': 'Hanyang Accounting Firm Assurance (ADC) Intern',
  'IXL Korea Consulting Action Project 2025 인턴십 수료': 'IXL Korea Consulting Action Project 2025 Internship',
  '제 6회 한국코드페어 금상 (과기부장관상 수상)': '6th Korea Code Fair Gold Prize (Minister of Science & ICT Award)',
  '2024학년도 동국대 과학영재교육원 사사과정 논문 발표': '2024 Dongguk University Science Gifted Institute Research Presentation',
  '대학부설 과학영재교육원 사사연구과정 성과발표대회 논문 발표': 'University Science Gifted Institute Research Achievement Presentation',
  '2024, 2025 동국대 과학영재원 재학': 'Dongguk University Science Gifted Institute, 2024–2025',
  '2022~2024 정보보호 영재원 이수': '2022–2024 Information Security Gifted Program',
  '2022 현대오토에버·함께일하는재단 화이트해커 경진대회 우수상': '2022 Hyundai AutoEver White Hacker Competition Excellence Award',
  'U-TEED 메인 페이지 개발': 'U-TEED Main Page Development',
  'SITE 프로젝트 프론트엔드 구현': 'SITE Project Frontend Implementation',
  '2026.06 ~ 2028.03 대한민국 공군 지능정보체계단 SW개발병 병장 만기전역(예정)': 'Jun 2026 – Mar 2028 ROKAF Intelligent Information Systems Management Group, SW Development Soldier (Expected Discharge)',
  '2026.05 ~ 2027.11 대한민국 육군 5사단 병장 만기전역(예정)': 'May 2026 – Nov 2027 ROK Army 5th Division, Sergeant (Expected Discharge)',
  '2026.01 ~ 2027.07 대한민국 육군 5사단 병장 만기전역(예정)': 'Jan 2026 – Jul 2027 ROK Army 5th Division, Sergeant (Expected Discharge)',
};

const roleTranslations: Record<string, string> = {
  'SNS 마케팅': 'SNS Marketing',
  '마케팅': 'Marketing',
  '대표 / 기획': 'CEO / Planning',
  '공동대표 / 기획': 'Co-CEO / Planning',
  '공동대표 / AI': 'Co-CEO / AI',
};

const categoryTranslations: Record<string, string> = {
  '기획 / 마케팅': 'Planning / Marketing',
  '기획': 'Planning',
  '개발': 'Development',
  '디자인': 'Design',
  'R&D': 'R&D',
};

const teamDescription = {
  ko: 'SITE와 MCI Link 팀원들이 각자의 전문성을 바탕으로 더 나은 서비스를 함께 만들어갑니다.',
  en: 'The SITE and MCI Link teams bring their expertise together to create better services.',
};

const teamGroups: TeamGroup[] = [
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
        career: ['U-TEED 대표', 'SITE 서비스 기획 총괄', 'MCI Link 서비스 기획 총괄',
          '2024 경희대학교 창업경진대회 최우수상 수상',
          '2024 경희대학교 지식재산권 활용 특허캠프 우수상 수상',
          '2025 KORES LBS 스타트업 챌린지 아이디어 부문 최종 단계 진출',
          '농구 중심 스포츠 커뮤니티 플랫폼 기획, 운영',
          '(mvp 기능 정의 및 서비스 구조 설게, 픽업 게임 매칭 구조 설계, 외부 협업 및 제휴)'],
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
      {
        name: '송지호',
        nameEn: 'Jiho Song',
        role: '마케팅',
        desc: '마케팅 전략 및 커뮤니티 운영',
        school: '연세대학교',
        major: 'ISED',
        profileImage: '/images/team/유동준.png',
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
        desc: '프론트엔드 개발, 앱 개발',
        school: '고려대학교',
        major: '인공지능사이버보안학과',
        profileImage: '/images/team/김재윤.png',
        inactive: true,
        inactiveReason: '군복무로 휴직',
        email: 'bbiyakyee7@gmail.com',
        career: ['U-TEED 메인 페이지 개발', 'SITE 프로젝트 프론트엔드 구현',
          '제 5회 한국코드페어 대상 (국무총리상 수상)',
          '제 1회 경기창고 수상 (크리에이티브상, 공감상)',
          '2024년 국제과학기술경진대회 대한민국 대표 발탁',
          '2024년 국제과학기술경진대회 임베디드 부문 본상 2등상 수상',
          '2024년 대한민국 인재상 수상',
          '2026.06 ~ 2028.03 대한민국 공군 지능정보체계단 SW개발병 병장 만기전역(예정)'
        ],
      },
      {
        name: '정민규',
        nameEn: 'Mingyu Jeong',
        role: 'Frontend/AI',
        desc: '프론트엔드 개발, 앱 개발, AI 개발',
        school: '홍익대학교',
        major: '소프트웨어융합학과',
        profileImage: '/images/team/정민규.png',
        email: 'pauljjang410@gmail.com',
        career: ['프론트엔드 개발', '관리자용 앱 개발', 'MCI Link AI 알고리즘 개발',
          '2022 현대오토에버·함께일하는재단 화이트해커 경진대회 우수상',
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
        role: 'Backend / AI / Server',
        desc: '백엔드 개발, 서버 관리 및 운영 / AI·서버 개발',
        school: '고려대학교',
        major: '인공지능사이버보안학과',
        profileImage: '/images/team/김진영.png',
        email: '',
        career: ['백엔드 개발', '서버 인프라 관리 및 운영', 'MCI Link AI 및 서버 개발', '2022~2024 정보보호 영재원 이수'],
      },
      {
        name: '김명준',
        nameEn: 'Myungjun Kim',
        role: 'Backend',
        desc: '백엔드 개발',
        school: '고려대학교',
        major: '인공지능사이버보안학과',
        profileImage: '/images/team/김명준.png',
        inactive: true,
        inactiveReason: '군복무로 휴직',
        email: '',
        career: ['백엔드 개발',
          '2026.05 ~ 2027.11 대한민국 육군 5사단 병장 만기전역(예정)'
        ],
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
        career: ['백엔드 개발',
          '2026.01 ~ 2027.07 대한민국 육군 5사단 병장 만기전역(예정)'
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
        career: ['경도인지장애 연구 및 분석', '세종과고 전교 1등 졸업', '대학전쟁 시즌 3 출연'],
      },
    ],
  },
];

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

export function getSchoolTeamMembers() {
  return teamGroups.flatMap(group => group.members).filter(member => !member.inactive);
}

interface TeamSectionProps {
  sectionRef?: MutableRefObject<HTMLElement | null>;
  id: string;
}

function useMemberDisplay(member: TeamMember) {
  const { lang } = useThemeLang();
  return {
    lang,
    displayName: lang === 'ko' ? member.name : (member.nameEn || member.name),
    displayDesc: lang === 'ko' ? member.desc : (descTranslations[member.desc] || member.desc),
    displaySchool: lang === 'ko' ? member.school : (schoolTranslations[member.school] || member.school),
    displayMajor: lang === 'ko' ? member.major : (majorTranslations[member.major] || member.major),
    displayRole: lang === 'ko' ? member.role : (roleTranslations[member.role] || member.role),
  };
}

function MemberAvatar({ member, size, className, fallbackClassName }: {
  member: TeamMember;
  size: number;
  className: string;
  fallbackClassName?: string;
}) {
  if (member.profileImage) {
    return (
      <Image
        src={member.profileImage}
        alt={`${member.name} 프로필`}
        width={size}
        height={size}
        unoptimized
        className={className}
      />
    );
  }
  return fallbackClassName
    ? <div className={fallbackClassName}>{member.name.charAt(0)}</div>
    : <>{member.name.charAt(0)}</>;
}

function TeamCardContent({ member }: { member: TeamMember }) {
  const { displayName, displayDesc, displaySchool, displayMajor, displayRole } = useMemberDisplay(member);
  return (
    <>
      <div
        className={`${styles.teamAvatar} ${
          member.profileImage ? styles.teamAvatarWithImage : ''
        }`}
      >
        <MemberAvatar member={member} size={200} className={styles.teamAvatarImg} />
      </div>
      <div className={styles.teamInfo}>
        <b className={styles.teamName}>{displayName}</b>
        <span className={styles.teamRole}>{displayRole}</span>
      </div>
      <p className={styles.teamDesc}>{displayDesc}</p>
      <div className={styles.teamSchool}>
        <span className={styles.schoolName}>{displaySchool}</span>
        <span className={styles.majorName}>{displayMajor}</span>
      </div>
    </>
  );
}

function FlipCardFront({ member }: { member: TeamMember }) {
  const { lang, displayName, displayDesc, displaySchool, displayMajor, displayRole } = useMemberDisplay(member);
  return (
    <div className={`${styles.flipCardFace} ${styles.flipCardFront}`}>
      <div className={styles.flipAvatar}>
        <MemberAvatar member={member} size={220} className={styles.flipAvatarImg} fallbackClassName={styles.flipAvatarFallback} />
      </div>
      <span className={styles.flipName}>{displayName}</span>
      <span className={styles.flipRole}>{displayRole}</span>
      <p className={styles.flipDesc}>{displayDesc}</p>
      <div className={styles.flipSchoolInfo}>
        <span className={styles.flipSchoolName}>{displaySchool}</span>
        <span className={styles.flipMajorName}>{displayMajor}</span>
      </div>
      <span className={styles.flipHint}>{lang === 'ko' ? '탭하여 뒤집기' : 'Tap to flip'}</span>
    </div>
  );
}

function FlipCardBack({ member }: { member: TeamMember }) {
  const { lang, displayName, displaySchool, displayMajor, displayRole } = useMemberDisplay(member);
  return (
    <div className={`${styles.flipCardFace} ${styles.flipCardBack}`}>
      <div className={styles.backHeader}>
        <div className={styles.backAvatar}>
          <MemberAvatar member={member} size={120} className={styles.flipAvatarImg} fallbackClassName={styles.flipAvatarFallback} />
        </div>
        <div className={styles.backHeaderInfo}>
          <span className={styles.backName}>{displayName}</span>
          {(lang === 'ko' ? member.nameEn : member.name) && (
            <span className={styles.backNameEn}>{lang === 'ko' ? member.nameEn : member.name}</span>
          )}
          <span className={styles.backRole}>{displayRole}</span>
          {member.cTitle && (
            <span className={styles.backCTitle}>{member.cTitle}</span>
          )}
        </div>
      </div>

      <div className={styles.backDivider} />

      <div className={styles.backBody}>
        {member.career && member.career.length > 0 && (
          <div className={styles.backCareerSection}>
            <span className={styles.backSectionLabel}>{lang === 'ko' ? '경력 / 이력' : 'Career / History'}</span>
            <ul className={styles.backCareerList}>
              {member.career.map((item, i) => (
                <li key={i} className={styles.backCareerItem}>
                  {lang === 'ko' ? item : (careerTranslations[item] || item)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.backEducation}>
          <span className={styles.backSectionLabel}>{lang === 'ko' ? '학력' : 'Education'}</span>
          <span className={styles.backEducationText}>
            {displaySchool} {displayMajor}
          </span>
        </div>

        {member.email && (
          <div className={styles.backEmailSection}>
            <span className={styles.backSectionLabel}>{lang === 'ko' ? '이메일' : 'Email'}</span>
            <a href={`mailto:${member.email}`} className={styles.backEmail}>
              {member.email}
            </a>
          </div>
        )}
      </div>

      <span className={styles.flipHint}>{lang === 'ko' ? '아무 곳이나 눌러 닫기' : 'Tap anywhere to close'}</span>
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
  const { lang } = useThemeLang();

  const handleClick = () => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) onSelect(member, rect);
  };

  const inactiveLabel = member.inactive
    ? (lang === 'ko' ? member.inactiveReason : (inactiveReasonTranslations[member.inactiveReason || ''] || member.inactiveReason))
    : undefined;

  return (
    <div
      ref={cardRef}
      className={`${styles.teamCard} ${styles.reveal} ${
        member.inactive ? styles.teamCardInactive : ''
      }`}
      data-inactive-reason={inactiveLabel}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
    >
      <TeamCardContent member={member} />
      {inactiveLabel && <span className={styles.inactiveLabel}>{inactiveLabel}</span>}
    </div>
  );
}

function useTeamCardSelection(onDetailChange?: (open: boolean) => void) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [modalOrigin, setModalOrigin] = useState<ModalOrigin>({ x: 0, y: 0, scale: 0.4 });

  const handleCardSelect = useCallback((member: TeamMember, rect: DOMRect) => {
    setModalOrigin({
      x: rect.left + rect.width / 2 - window.innerWidth / 2,
      y: rect.top + rect.height / 2 - window.innerHeight / 2,
      scale: Math.min(rect.width / 320, rect.height / 420, 0.65),
    });
    setSelectedMember(member);
    onDetailChange?.(true);
  }, [onDetailChange]);

  const handleClose = useCallback(() => {
    setSelectedMember(null);
    onDetailChange?.(false);
  }, [onDetailChange]);

  return { selectedMember, modalOrigin, handleCardSelect, handleClose };
}

function TeamGroupCards({ group, twoColumns, onSelect }: {
  group: TeamGroup;
  twoColumns?: boolean;
  onSelect: (member: TeamMember, rect: DOMRect) => void;
}) {
  const { lang } = useThemeLang();
  return (
    <div className={styles.teamGroup}>
      <h3 className={styles.teamCategoryTitle}>{lang === 'ko' ? group.category : (categoryTranslations[group.category] || group.category)}</h3>
      <div className={twoColumns ? `${styles.teamGrid} ${styles.teamGridTwo}` : styles.teamGrid}>
        {group.members.map((member, index) => (
          <TeamCard key={index} member={member} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

export function SchoolTeamCards({
  members,
  onDetailChange,
}: {
  members: TeamMember[];
  onDetailChange: (open: boolean) => void;
}) {
  const { selectedMember, modalOrigin, handleCardSelect, handleClose } = useTeamCardSelection(onDetailChange);

  return (
    <div className={`${styles.teamSection} ${styles.schoolTeamCards}`}>
      {members.map(member => (
        <TeamCard key={member.name} member={member} onSelect={handleCardSelect} />
      ))}
      {selectedMember && (
        <FlipCardModal
          member={selectedMember}
          origin={modalOrigin}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default function TeamSection({ sectionRef, id }: TeamSectionProps) {
  const [planningMarketing, development, design, research] = teamGroups;
  const { selectedMember, modalOrigin, handleCardSelect, handleClose } = useTeamCardSelection();
  const { lang } = useThemeLang();

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
          <h2 className={styles.h2}>{lang === 'ko' ? '함께 만들어가는 사람들' : 'The People Behind It'}</h2>
          <p className={styles.lead}>
            {teamDescription[lang]}
          </p>

          <div className={styles.teamSplitRow}>
            <TeamGroupCards group={planningMarketing} twoColumns onSelect={handleCardSelect} />
            <TeamGroupCards group={design.members.length > 0 ? design : development} twoColumns onSelect={handleCardSelect} />
          </div>

          {design.members.length > 0 && (
            <TeamGroupCards group={development} onSelect={handleCardSelect} />
          )}
          <TeamGroupCards group={research} onSelect={handleCardSelect} />
        </div>
      </div>

      {selectedMember && (
        <FlipCardModal
          member={selectedMember}
          origin={modalOrigin}
          onClose={handleClose}
        />
      )}
    </section>
  );
}
