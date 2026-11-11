'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './TeamOrgChart.module.css';
import { useThemeLang } from './ThemeLanguageProvider';

type Lang = 'ko' | 'en';
type Text = Record<Lang, string>;

interface School {
  name: Text;
  /** 가로형 시그니처 로고(/images/school/*.png)에서 글자를 빼고 엠블럼만 잘라 낸 이미지 */
  emblem: { src: string; width: number; height: number };
}

const yonseiEmblem = { src: '/images/school/emblem/yonsei.png', width: 192, height: 191 };

const schools = {
  snu: {
    name: { ko: '서울대학교', en: 'Seoul National University' },
    emblem: { src: '/images/school/emblem/snu.png', width: 186, height: 192 },
  },
  korea: {
    name: { ko: '고려대학교', en: 'Korea University' },
    emblem: { src: '/images/school/emblem/korea.png', width: 143, height: 192 },
  },
  yonsei: {
    name: { ko: '연세대학교', en: 'Yonsei University' },
    emblem: yonseiEmblem,
  },
  yonseiMirae: {
    name: { ko: '연세대학교 미래캠퍼스', en: 'Yonsei University Mirae Campus' },
    emblem: yonseiEmblem,
  },
  kyunghee: {
    name: { ko: '경희대학교', en: 'Kyung Hee University' },
    emblem: { src: '/images/school/emblem/kyunghee.png', width: 192, height: 127 },
  },
  hongik: {
    name: { ko: '홍익대학교', en: 'Hongik University' },
    emblem: { src: '/images/school/emblem/hongik.png', width: 192, height: 97 },
  },
} satisfies Record<string, School>;

interface Member {
  name: Text;
  role: Text;
  school: keyof typeof schools;
  /** 아래 둘은 이름을 눌렀을 때만 보인다 */
  awards?: Text[];
  history?: Text[];
}

interface Team {
  name: Text;
  members: Member[];
}

/** 조직도 맨 위. 수상·이력은 본인 포트폴리오 기준 */
const lead: Member = {
  name: { ko: '임태호', en: 'Taeho Lim' },
  role: { ko: '대표 / 기획', en: 'CEO / Planning' },
  school: 'yonsei',
  awards: [
    { ko: '2024 경희대학교 창업경진대회 최우수상', en: '2024 Kyung Hee University Startup Competition — Grand Prize' },
    {
      ko: '2024 경희대학교 지식재산권 활용 특허캠프 우수상',
      en: '2024 Kyung Hee University IP Patent Camp — Excellence Award',
    },
    {
      ko: '2025 KOREA LBS 스타트업 챌린지 TOP 10 (KISA · 아이디어 부문)',
      en: '2025 KOREA LBS Startup Challenge — Top 10 (KISA, Idea Track)',
    },
    {
      ko: '2026 사회적기업 창업지원사업 업종특화(돌봄·사회서비스) 선정 (고용노동부 · 한국사회적기업진흥원)',
      en: '2026 Social Enterprise Startup Support Program, Care & Social Services Track — Selected (Ministry of Employment and Labor · Korea Social Enterprise Promotion Agency)',
    },
    {
      ko: '2026 연세대학교 고등교육혁신원 워크스테이션 사회혁신타운 입주팀',
      en: '2026 Resident Team, Workstation Social Innovation Town, Yonsei University Institute for Higher Education Innovation',
    },
  ],
  history: [
    { ko: '주식회사 유티드 대표 (2026년 5월 설립)', en: 'CEO of U-TEED Inc. (founded May 2026)' },
    { ko: 'NoteOn 기획·디자인·개발·마케팅 총괄', en: 'NoteOn — led planning, design, development and marketing' },
    {
      ko: 'MCI Link 기획·디자인·프론트엔드 개발 (보호자 141명·의료진 6명 직접 조사)',
      en: 'MCI Link — planning, design and frontend development (interviewed 141 caregivers and 6 clinicians)',
    },
    {
      ko: 'SITE MVP·매칭 구조 설계, 인플루언서 제휴·네이버 카페 협업',
      en: 'SITE — designed the MVP and matching structure; influencer and Naver Cafe partnerships',
    },
    { ko: '멘토랑 광고 카드뉴스·랜딩페이지·홈페이지 제작', en: 'Mentorang — ad card news, landing page and website' },
    {
      ko: 'Vibe Canvas 문제 정의부터 화면 설계·개발·배포 (AI 비즈니스 수업 팀 프로젝트)',
      en: 'Vibe Canvas — from problem definition to UI design, development and deployment (AI Business course team project)',
    },
  ],
};

const marketingHistory: Text[] = [
  { ko: '마케팅 전략 수립', en: 'Marketing Strategy' },
  { ko: '커뮤니티 운영 관리', en: 'Community Operations' },
];

/** 활동 중인 팀원만 적는다. 휴직한 팀원은 복귀하면 다시 넣는다 */
const teams: Team[] = [
  {
    name: { ko: '기획·마케팅', en: 'Planning & Marketing' },
    members: [
      {
        name: { ko: '홍예찬', en: 'Yechan Hong' },
        role: { ko: '마케팅', en: 'Marketing' },
        school: 'yonsei',
        history: marketingHistory,
      },
      {
        name: { ko: '송지호', en: 'Jiho Song' },
        role: { ko: '마케팅', en: 'Marketing' },
        school: 'yonsei',
        history: marketingHistory,
      },
      {
        name: { ko: '정승빈', en: 'Seungbin Jeong' },
        role: { ko: '기획·마케팅', en: 'Planning & Marketing' },
        school: 'snu',
      },
    ],
  },
  {
    name: { ko: '개발', en: 'Development' },
    members: [
      {
        name: { ko: '김진영', en: 'Jinyoung Kim' },
        role: { ko: 'Backend / AI / Server', en: 'Backend / AI / Server' },
        school: 'korea',
        history: [
          { ko: '백엔드 개발', en: 'Backend Development' },
          { ko: '서버 인프라 관리 및 운영', en: 'Server Infrastructure Management' },
          { ko: 'MCI Link AI 및 서버 개발', en: 'MCI Link AI & Server Development' },
          { ko: '2022~2024 정보보호 영재원 이수', en: '2022–2024 Information Security Gifted Program' },
        ],
      },
      {
        name: { ko: '정민규', en: 'Mingyu Jeong' },
        role: { ko: 'Frontend / AI', en: 'Frontend / AI' },
        school: 'hongik',
        awards: [
          {
            ko: '2022 현대오토에버·함께일하는재단 화이트해커 경진대회 우수상',
            en: '2022 Hyundai AutoEver White Hacker Competition Excellence Award',
          },
          {
            ko: '2023 대구 AI·Big Data·Blockchain 해커톤 최우수상',
            en: '2023 Daegu AI·Big Data·Blockchain Hackathon Best Award',
          },
          {
            ko: '2024 충청북도 생성형 인공지능 전국 경진대회 우수상',
            en: '2024 Chungbuk Generative AI National Competition Excellence Award',
          },
          { ko: '2024 제1회 스마트 AI 콘텐츠 대회 입상', en: '2024 1st Smart AI Content Competition Prize' },
          {
            ko: '2024 제30회 전국 창의성 IT코딩 경시대회: 빅데이터 영역 경기도지회장상',
            en: '2024 30th National Creative IT Coding Competition: Big Data — Gyeonggi Chapter Award',
          },
          {
            ko: '2024 제30회 전국 창의성 IT코딩 경시대회: 정보처리 전문가 영역 국회의원상',
            en: '2024 30th National Creative IT Coding Competition: IT Expert — National Assembly Award',
          },
          { ko: '2025 구미시 정책제안 공모전 은상', en: '2025 Gumi City Policy Proposal Competition Silver Award' },
        ],
        history: [
          { ko: '프론트엔드 개발', en: 'Frontend Development' },
          { ko: '관리자용 앱 개발', en: 'Admin App Development' },
          { ko: 'MCI Link AI 알고리즘 개발', en: 'MCI Link AI Algorithm Development' },
          {
            ko: 'KITRI Best of the Best 12기 취약점분석 수료',
            en: 'KITRI Best of the Best 12th Cohort — Vulnerability Analysis',
          },
          {
            ko: '2025.7.21 ~ 9.5 이노그리드 하이브리드 플랫폼팀 인턴',
            en: 'Jul–Sep 2025 Innogrid Hybrid Platform Team Intern',
          },
        ],
      },
    ],
  },
  {
    name: { ko: '영상', en: 'Video' },
    members: [{ name: { ko: '김채현', en: 'Chaehyun Kim' }, role: { ko: '영상', en: 'Video' }, school: 'kyunghee' }],
  },
  {
    name: { ko: '디자인', en: 'Design' },
    members: [{ name: { ko: '이준오', en: 'Juno Lee' }, role: { ko: '디자인', en: 'Design' }, school: 'yonseiMirae' }],
  },
];

function Emblem({ school, lang, large }: { school: School; lang: Lang; large?: boolean }) {
  return (
    // 조직도에서는 마우스를 올리면 학교 이름이 보이게. 정보 창에는 옆에 학교 이름이 글자로 있다
    <span
      className={large ? `${styles.emblem} ${styles.emblemLarge}` : styles.emblem}
      title={large ? undefined : school.name[lang]}
    >
      <Image
        src={school.emblem.src}
        // 정보 창에서는 옆에 학교 이름이 글자로 있으니 그림은 읽지 않는다
        alt={large ? '' : school.name[lang]}
        width={school.emblem.width}
        height={school.emblem.height}
        unoptimized
      />
    </span>
  );
}

/** 대표 아래 팀별로 팀원을 늘어놓고, 이름을 누르면 학교와 수상·이력을 작은 창으로 보여준다 */
export default function TeamOrgChart() {
  const { lang } = useThemeLang();
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const pressedOnBackdrop = useRef(false);
  const [selected, setSelected] = useState<Member | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selected && dialog && !dialog.open) dialog.showModal();
  }, [selected]);

  const renderNode = (member: Member, className: string) => (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={event => {
        openerRef.current = event.currentTarget;
        setSelected(member);
      }}
    >
      {/* 화면낭독기가 이름부터 읽도록 이름을 앞에 두고, 엠블럼은 CSS(order)로 이름 왼쪽에 보인다 */}
      <span className={styles.nodeName}>
        {member.name[lang]}
        <Emblem school={schools[member.school]} lang={lang} />
      </span>
      <span className={styles.nodeRole}>{member.role[lang]}</span>
    </button>
  );

  const sections = selected
    ? [
        { key: 'awards', title: lang === 'ko' ? '수상·선정' : 'Awards & Selections', items: selected.awards ?? [] },
        { key: 'history', title: lang === 'ko' ? '이력' : 'Experience', items: selected.history ?? [] },
      ].filter(section => section.items.length > 0)
    : [];

  return (
    <div className={styles.chart}>
      <div className={styles.lead}>{renderNode(lead, `${styles.node} ${styles.leadNode}`)}</div>

      <ul className={styles.teams}>
        {teams.map(team => (
          <li key={team.name.ko} className={styles.team}>
            <h3 className={styles.teamName}>{team.name[lang]}</h3>
            <ul className={styles.members}>
              {team.members.map(member => (
                <li key={member.name.ko}>{renderNode(member, styles.node)}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className={styles.detail}
        aria-labelledby={titleId}
        onClose={event => {
          if (event.target !== event.currentTarget) return;
          setSelected(null);
          openerRef.current?.focus();
        }}
        onPointerDown={event => {
          pressedOnBackdrop.current = event.target === event.currentTarget;
        }}
        onClick={event => {
          // 바깥 어두운 곳을 눌렀다 뗐을 때만 닫는다. 창 안에서 끌다 놓은 경우는 그대로 둔다.
          // 이름을 더블클릭하면 두 번째 클릭이 막 열린 창의 바깥에 떨어지므로 연속 클릭은 무시한다
          if (event.detail > 1) return;
          if (pressedOnBackdrop.current && event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        {selected && (
          <div className={styles.detailCard}>
            <button
              type="button"
              className={styles.detailClose}
              aria-label={lang === 'ko' ? '닫기' : 'Close'}
              onClick={() => dialogRef.current?.close()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h2 id={titleId} className={styles.detailName}>
              {selected.name[lang]}
            </h2>
            <p className={styles.detailSchool}>
              <Emblem school={schools[selected.school]} lang={lang} large />
              {schools[selected.school].name[lang]}
            </p>
            {sections.length > 0 && (
              // 수상·이력이 길면 이 부분만 스크롤된다. 키보드로도 스크롤할 수 있게 포커스를 받는다
              <div
                className={styles.detailBody}
                tabIndex={0}
                role="region"
                aria-label={lang === 'ko' ? '수상 및 이력' : 'Awards and experience'}
              >
                {sections.map(section => (
                  <section key={section.key}>
                    <h3 className={styles.detailHeading}>{section.title}</h3>
                    <ul className={styles.detailList}>
                      {section.items.map(item => (
                        <li key={item.ko}>{item[lang]}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
