/**
 * 사이트에 나오는 사실과 문구를 한곳에 모은 파일.
 *
 * 규칙: 회사 정보에 없는 사실은 쓰지 않는다. 비어 있는 칸은 null로 두고,
 * 값이 생기면 여기만 고치면 화면에 나온다.
 */

export const company = {
  name: '주식회사 유티드',
  nameEn: 'U-TEED',
  ceo: '임태호',
  founded: '2026년 5월',
  bizRegNo: '772-88-04055',
  address: '(07250) 서울특별시 영등포구 영중로24길 10, 2층 232호',
  email: 'taeho@u-teed.co.kr',
  /** [ ] 미션·한 줄 소개 — 비어 있음. 문장을 넣으면 회사 섹션 첫머리에 크게 나온다. */
  mission: null as string | null,
} as const;

export const nav = [
  { href: '/#company', label: '회사' },
  { href: '/#business', label: '사업' },
  { href: '/#outsourcing', label: '외주' },
  { href: '/#history', label: '연혁' },
  { href: '/#contact', label: '문의' },
] as const;

export const primaryCta = { href: '/request', label: '의뢰하기' } as const;

/**
 * 헤드라인 직접 입력값이 비어 있어 [회사 정보]의 사실만으로 3안을 만들고 1안을 적용했다.
 * 1안(적용) 유티드는 창업·돌봄·농구·학습 서비스를 만듭니다 — 제품 정의의 분야 명사(창업·돌봄·농구·학습)
 *           (변형: '…학습 분야의 서비스를 만듭니다' — 분야 이름임을 더 분명히, 대신 한 줄 길어짐)
 * 2안       B Essential, MCI Link, SITE, NoteOn을 만듭니다 — 제품명 그대로
 * 3안       유티드는 서비스를 만듭니다 — 가장 짧음, 무엇을 만드는지는 리드에 기댐
 * 제품을 더하거나 빼면 1안의 분야 목록도 함께 고친다.
 */
export const hero = {
  headline: '유티드는 창업·돌봄·농구·학습 서비스를 만듭니다',
  lead: ['개발과 사업 문서·컨설팅 외주 의뢰도 받습니다.', '의뢰를 보내시면 2영업일 안에 이메일로 연락드립니다.'],
  secondaryLink: { href: '#business', label: '사업 보기' },
} as const;

export const sectionTitles = {
  company: '회사',
  business: '사업',
  /** 사용자 제공 제목 [수정 가능] */
  outsourcing: '서비스 기획부터 런칭까지 해본 팀이 대신 만들어드립니다',
  history: '연혁·수상',
  contact: '문의',
} as const;

/** 외주 의뢰는 바로 위 히어로와 아래 외주 섹션이 말하므로 여기서는 되풀이하지 않는다 */
export const companyBody: readonly (readonly string[])[] = [
  ['주식회사 유티드(U-TEED)는 2026년 5월에 설립됐습니다.', '대표는 임태호입니다.', '본점은 서울특별시 영등포구에 있습니다.'],
  ['유티드는 B Essential, MCI Link, SITE, NoteOn을 만듭니다.'],
];

export type Product = {
  id: string;
  name: string;
  definition: string;
  features: readonly string[];
  /** [ ] 링크가 없으면 null → 링크 요소를 그리지 않는다 */
  link: { href: string; label: string } | null;
  /** [ ] 실제 스크린샷 경로. 없으면 null → --bg 단색 면에 제품명만 둔다(가짜 화면 금지) */
  media: { src: string; alt: string; width: number; height: number } | null;
};

export const businessIntro: string | null = null;

export const products: readonly Product[] = [
  {
    id: 'b-essential',
    name: 'B Essential',
    definition: 'AI가 창업 아이디어를 진단하고 사업 구성을 돕는 플랫폼입니다.',
    features: [
      '아이디어를 입력하면 종합 진단 리포트를 줍니다.',
      'BM·시장조사·핵심 지표·로드맵·리스크·지원사업 정보를 줍니다.',
      '결과를 생성형 AI 도구에서 이어 쓸 수 있게 연결합니다.',
    ],
    link: { href: 'https://bessential.ai.kr', label: 'B Essential 보기' },
    media: null,
  },
  {
    id: 'mci-link',
    name: 'MCI Link',
    definition: '경도인지장애(MCI) 돌봄을 위한 AI 음성통화 서비스입니다.',
    features: [
      '어르신과 통화로 대화하며 일상 상태를 확인합니다.',
      '개인 기준선과 비교해 이상 징후를 감지합니다.',
      '보호자에게 생활 리포트를 전합니다.',
    ],
    link: null,
    media: null,
  },
  {
    id: 'site',
    name: 'SITE',
    definition: '농구 픽업게임 매칭 플랫폼입니다.',
    features: [],
    link: null,
    media: null,
  },
  {
    id: 'noteon',
    name: 'NoteOn',
    definition: '강의자료와 수업 녹음 텍스트를 합쳐 학습자료를 만드는 서비스입니다.',
    features: [],
    link: null,
    media: null,
  },
];

export const outsourcing = {
  /** 사용자 제목에 '외주'라는 말이 없어 메뉴 '외주'와 이어 주는 한 줄 */
  intro: '다음 분야의 외주 의뢰를 받습니다.' as string | null,
  areasHeading: '제공 분야',
  areas: [
    {
      name: '개발',
      items: ['랜딩페이지·회사 홈페이지', '웹 서비스·MVP', '모바일 앱', '기존 서비스 개선·유지보수'],
    },
    {
      name: '사업 문서·컨설팅',
      items: [
        '사업계획서·IR 피칭',
        '정부지원사업·기업인증 서류',
        '시장조사·리서치',
        '브랜드 기획·네이밍',
        '창업 컨설팅·자문',
      ],
    },
  ],
  processHeading: '진행 방식',
  /** 실제 진행 순서(사용자 확인). 순서 정보라 번호를 붙인다 */
  process: ['의뢰 접수', '상담·견적', '계약', '작업', '납품'],
} as const;

export type HistoryRow = {
  /** 화면 표기 */
  year: string;
  /** <time dateTime> 값 */
  dateTime: string;
  content: string;
  /** 관련 사업. 프롬프트 괄호에 적힌 것만 */
  product: string | null;
};

export const history = {
  columns: { year: '연도', content: '내용', product: '관련 사업' },
  /** 프롬프트 순서(연도 오름차순). 2026.05 법인 설립 이전 항목은 '창업팀 이력'으로 묶는다 */
  groups: [
    {
      id: 'team',
      label: '창업팀 이력',
      rows: [
        { year: '2024', dateTime: '2024', content: '경희대학교 창업경진대회 최우수상', product: null },
        { year: '2024', dateTime: '2024', content: '지식재산권 활용 특허캠프 우수상', product: null },
        { year: '2025', dateTime: '2025', content: 'KISA KOREA LBS 스타트업 챌린지 TOP 10', product: 'SITE' },
      ],
    },
    {
      id: 'corp',
      label: '법인 이력',
      rows: [
        { year: '2026.05', dateTime: '2026-05', content: '주식회사 유티드 법인 설립', product: null },
        {
          year: '2026',
          dateTime: '2026',
          content:
            '고용노동부·한국사회적기업진흥원 사회적기업 창업지원사업 업종특화(돌봄·사회서비스) 선정',
          product: 'MCI Link',
        },
        {
          year: '2026',
          dateTime: '2026',
          content: '연세대학교 고등교육혁신원 워크스테이션 사회혁신타운 입주팀',
          product: null,
        },
      ],
    },
  ] as readonly { id: string; label: string; rows: readonly HistoryRow[] }[],
} as const;

export const contact = {
  body: ['문의는 이메일로 받습니다.'],
} as const;

export const footer = {
  labels: {
    company: '상호',
    ceo: '대표',
    bizNo: '사업자등록번호',
    address: '주소',
    email: '이메일',
  },
  privacyLink: { href: '/privacy', label: '개인정보 처리방침' },
  copyright: '© 2026 U-TEED',
} as const;

export const meta = {
  homeTitle: '주식회사 유티드 (U-TEED)',
  homeDescription:
    '주식회사 유티드(U-TEED)는 B Essential, MCI Link, SITE, NoteOn을 만듭니다. 개발과 사업 문서·컨설팅 의뢰도 받습니다.',
  requestTitle: '외주 의뢰',
  requestDescription:
    '개발과 사업 문서·컨설팅 외주 의뢰를 받습니다. 의뢰를 보내시면 2영업일 안에 이메일로 연락드립니다.',
  privacyTitle: '개인정보 처리방침',
  privacyDescription: '주식회사 유티드(U-TEED)의 개인정보 처리방침입니다.',
} as const;
