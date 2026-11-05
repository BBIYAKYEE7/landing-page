/**
 * 의뢰 폼 공유 스키마 — 브라우저 폼과 /api/request가 같은 규칙을 쓴다.
 *
 * 필드 키와 선택지 문자열은 추가 지시 3절 표와 글자 하나까지 같다.
 * 키는 저장 데이터의 필드명(스프레드시트 열 이름)으로 그대로 쓴다.
 */

/* ── 선택지 ─────────────────────────────────────────────── */

export const CATEGORY_DEV = '개발';
export const CATEGORY_DOCS = '사업 문서·컨설팅';
export const CATEGORY_UNSURE = '아직 모르겠어요';
export const CATEGORY_OPTIONS = [CATEGORY_DEV, CATEGORY_DOCS, CATEGORY_UNSURE] as const;
export type Category = (typeof CATEGORY_OPTIONS)[number];
export type ServiceCategory = typeof CATEGORY_DEV | typeof CATEGORY_DOCS;

export const SERVICE_OPTIONS: Record<ServiceCategory, readonly string[]> = {
  [CATEGORY_DEV]: ['랜딩페이지·회사 홈페이지', '웹 서비스·MVP', '모바일 앱', '기존 서비스 개선·유지보수'],
  [CATEGORY_DOCS]: [
    '사업계획서·IR 피칭',
    '정부지원사업·기업인증 서류',
    '시장조사·리서치',
    '브랜드 기획·네이밍',
    '창업 컨설팅·자문',
  ],
};

export const STAGE_OPTIONS = ['아이디어만 있음', '기획 문서 있음', '디자인 있음', '운영 중인 서비스 있음'] as const;
export const PLATFORM_OPTIONS = ['웹(PC·모바일 브라우저)', 'iOS 앱', 'Android 앱'] as const;
export const FEATURE_UNSURE = '잘 모르겠어요';
export const FEATURE_OPTIONS = [
  '회원가입·로그인',
  '결제',
  '관리자 페이지',
  '예약·신청',
  '게시판',
  '외부 서비스 연동',
  FEATURE_UNSURE,
] as const;
export const SCOPE_OPTIONS = ['기획', '디자인', '개발', '배포·운영'] as const;
export const PURPOSE_OPTIONS = ['정부지원사업 신청', '투자 유치', '대회·공모전', '내부 검토', '기타'] as const;
export const DRAFT_OPTIONS = ['없음', '초안 있음', '이전 제출본 있음'] as const;
export const TIMELINE_OPTIONS = ['2주 이내', '1개월 이내', '1~3개월', '3개월 이상', '협의'] as const;
/** [실제 단가에 맞춰 구간 수정] — 스펙에 적힌 구간 그대로 둔다. 값 검사는 이 파일에서만 하므로 여기만 고치면 된다. */
export const BUDGET_OPTIONS = [
  '100만 원 미만',
  '100~300만 원',
  '300~500만 원',
  '500~1,000만 원',
  '1,000만 원 이상',
  '아직 못 정함',
] as const;
export const SOURCE_OPTIONS = ['검색', '지인 소개', 'SNS', '기타'] as const;

export const LIMITS = {
  titleMax: 60,
  descriptionMin: 30,
  descriptionMax: 5000,
  referencesMax: 3,
  urlMax: 2000,
  nameMax: 50,
  companyMax: 100,
  programNameMax: 100,
  emailMax: 254,
  phoneMax: 30,
  phoneDigitsMin: 8,
  phoneDigitsMax: 15,
} as const;

/* ── 필드 ───────────────────────────────────────────────── */

export const FIELD_KEYS = [
  'category',
  'services',
  'title',
  'description',
  'stage',
  'references',
  'platforms',
  'features',
  'scope',
  'purpose',
  'program_name',
  'deadline',
  'draft',
  'timeline',
  'budget',
  'name',
  'company',
  'email',
  'phone',
  'source',
] as const;
export type FieldKey = (typeof FIELD_KEYS)[number];

/** 화면에 나오는 순서. 첫 오류 항목을 찾을 때 쓴다 */
export const FIELD_ORDER: readonly FieldKey[] = FIELD_KEYS;

export const FIELD_STEP: Record<FieldKey, 1 | 2 | 3> = {
  category: 1,
  services: 1,
  title: 1,
  description: 1,
  stage: 1,
  references: 1,
  platforms: 1,
  features: 1,
  scope: 1,
  purpose: 1,
  program_name: 1,
  deadline: 1,
  draft: 1,
  timeline: 2,
  budget: 2,
  name: 3,
  company: 3,
  email: 3,
  phone: 3,
  source: 3,
};

/** 스펙 표의 '항목' 열. 메일·완료 화면 요약에도 같은 이름을 쓴다 */
export const FIELD_LABELS: Record<FieldKey, string> = {
  category: '의뢰 분야',
  services: '세부 항목',
  title: '한 줄 소개',
  description: '자세한 내용',
  stage: '지금 준비된 것',
  references: '참고 링크',
  platforms: '사용 환경',
  features: '필요한 기능',
  scope: '맡길 범위',
  purpose: '사용 목적',
  program_name: '지원사업·대회 이름',
  deadline: '제출 마감일',
  draft: '기존 자료',
  timeline: '희망 완료 시점',
  budget: '예산 범위',
  name: '이름',
  company: '회사·소속',
  email: '이메일',
  phone: '전화번호',
  source: '알게 된 경로',
};

/** 스펙 표의 '선택지·안내 문구'에 있는 안내와 예시 */
export const FIELD_HELP: Partial<Record<FieldKey, string>> = {
  description: '만들고 싶은 것, 해결하려는 문제, 꼭 필요한 기능을 적어 주세요',
  references: '참고 사이트, 기존 서비스, 구글 드라이브·노션 등 자료 공유 링크',
  phone: '빠른 연락이 필요할 때만 적어 주세요',
};

export const FIELD_PLACEHOLDER: Partial<Record<FieldKey, string>> = {
  title: '예: 동네 반찬가게 주문 웹앱 MVP',
  program_name: '예: ○○ 지원사업 2027년 상반기',
};

/* ── 데이터 형태 ────────────────────────────────────────── */

/** 브라우저 폼 상태. 분야별 값을 따로 보관해 분야를 바꿔도 입력이 사라지지 않는다 */
export interface RequestDraft {
  category: Category | '';
  services: Record<ServiceCategory, string[]>;
  title: string;
  description: string;
  stage: string;
  references: string[];
  platforms: string[];
  features: string[];
  scope: string[];
  purpose: string;
  program_name: string;
  deadline: string;
  draft: string;
  timeline: string;
  budget: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
}

export const EMPTY_DRAFT: RequestDraft = {
  category: '',
  services: { [CATEGORY_DEV]: [], [CATEGORY_DOCS]: [] },
  title: '',
  description: '',
  stage: '',
  references: [''],
  platforms: [],
  features: [],
  scope: [],
  purpose: '',
  program_name: '',
  deadline: '',
  draft: '',
  timeline: '',
  budget: '',
  name: '',
  company: '',
  email: '',
  phone: '',
  source: '',
};

/** 저장·전송 형태 (선택한 분야 것만 남긴 상태) */
export interface RequestPayload {
  category: string;
  services: string[];
  title: string;
  description: string;
  stage: string;
  references: string[];
  platforms: string[];
  features: string[];
  scope: string[];
  purpose: string | null;
  program_name: string | null;
  deadline: string | null;
  draft: string | null;
  timeline: string;
  budget: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  source: string | null;
}

export type ErrorCode =
  | 'category_required'
  | 'services_required'
  | 'title_required'
  | 'title_too_long'
  | 'description_required'
  | 'description_too_short'
  | 'description_too_long'
  | 'stage_required'
  | 'references_invalid'
  | 'platforms_required'
  | 'scope_required'
  | 'purpose_required'
  | 'program_name_too_long'
  | 'deadline_invalid'
  | 'timeline_required'
  | 'budget_required'
  | 'name_required'
  | 'name_too_long'
  | 'company_too_long'
  | 'email_required'
  | 'email_invalid'
  | 'phone_invalid'
  | 'invalid_option';

export type FieldErrors = Partial<Record<FieldKey, ErrorCode>>;

/* ── 도우미 ─────────────────────────────────────────────── */

/** 글자 수(코드포인트 기준). 한글 음절 1자 = 1 */
export function charCount(value: string): number {
  return Array.from(value).length;
}

export function isServiceCategory(value: string): value is ServiceCategory {
  return value === CATEGORY_DEV || value === CATEGORY_DOCS;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^[0-9+\-\s()]+$/;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;

/** 스킴이 없으면 https://를 붙인다. 빈 값은 빈 값 그대로 */
export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return SCHEME_RE.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function isValidUrl(value: string): boolean {
  if (!value || value.length > LIMITS.urlMax) return false;
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.');
  } catch {
    return false;
  }
}

export function isValidEmail(value: string): boolean {
  return value.length <= LIMITS.emailMax && EMAIL_RE.test(value);
}

export function isValidPhone(value: string): boolean {
  if (value.length > LIMITS.phoneMax || !PHONE_CHARS_RE.test(value)) return false;
  const digits = value.replace(/\D/g, '').length;
  return digits >= LIMITS.phoneDigitsMin && digits <= LIMITS.phoneDigitsMax;
}

export function isValidDate(value: string): boolean {
  const match = DATE_RE.exec(value);
  if (!match) return false;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function oneOf(options: readonly string[], value: string): boolean {
  return options.includes(value);
}

function allOf(options: readonly string[], values: readonly string[]): boolean {
  return values.every((v) => options.includes(v));
}

/* ── 정규화 ─────────────────────────────────────────────── */

/** 분야별 추가 질문은 선택한 분야 것만 남긴다 (스펙: 선택한 분야일 때만 표시·저장) */
function keepSelectedCategoryOnly(p: RequestPayload): RequestPayload {
  const isDev = p.category === CATEGORY_DEV;
  const isDocs = p.category === CATEGORY_DOCS;
  return {
    ...p,
    services: isServiceCategory(p.category) ? p.services : [],
    platforms: isDev ? p.platforms : [],
    features: isDev ? p.features : [],
    scope: isDev ? p.scope : [],
    purpose: isDocs ? p.purpose : null,
    program_name: isDocs ? p.program_name : null,
    deadline: isDocs ? p.deadline : null,
    draft: isDocs ? p.draft : null,
  };
}

const orNull = (value: string): string | null => (value ? value : null);

/** 제어 문자·줄/문단 구분자·양방향 서식 문자. 한 줄 입력칸에서는 공백으로 바꾼다 */
const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F\u2028\u2029\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;
/** 여러 줄 입력칸(자세한 내용)에서는 줄바꿈(\n)과 탭만 남긴다 */
const CONTROL_CHARS_EXCEPT_NEWLINE = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u2028\u2029\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;

/** 보이지 않는 서식 문자(폭 없는 공백 U+200B, 단어 결합자 U+2060, BOM U+FEFF). 화면 글자를 복사해 붙여 넣으면 섞일 수 있다 */
const INVISIBLE_CHARS = /[\u200B\u2060\uFEFF]/g;

/** 한 줄 입력값 정리: 보이지 않는 서식 문자는 지우고, 제어 문자는 공백으로 바꾸고, 앞뒤 공백을 지운다 */
export function cleanLine(value: string): string {
  return value.replace(INVISIBLE_CHARS, '').replace(CONTROL_CHARS, ' ').trim();
}

/** 여러 줄 입력값 정리: 보이지 않는 서식 문자는 지우고, CRLF를 LF로, 줄바꿈·탭 외 제어 문자는 지우고, 앞뒤 공백을 지운다 */
export function cleanText(value: string): string {
  return value.replace(INVISIBLE_CHARS, '').replace(/\r\n?/g, '\n').replace(CONTROL_CHARS_EXCEPT_NEWLINE, '').trim();
}

const unique = (values: readonly string[]): string[] => Array.from(new Set(values));

/** 브라우저 폼 상태 → 전송 형태 */
export function draftToPayload(d: RequestDraft): RequestPayload {
  const category = d.category;
  return keepSelectedCategoryOnly({
    category,
    services: isServiceCategory(category) ? unique(d.services[category]) : [],
    title: cleanLine(d.title),
    description: cleanText(d.description),
    stage: d.stage,
    references: unique(d.references.map((value) => normalizeUrl(cleanLine(value))).filter(Boolean)),
    platforms: unique(d.platforms),
    features: unique(d.features),
    scope: unique(d.scope),
    purpose: orNull(d.purpose),
    program_name: orNull(cleanLine(d.program_name)),
    deadline: orNull(cleanLine(d.deadline)),
    draft: orNull(d.draft),
    timeline: d.timeline,
    budget: d.budget,
    name: cleanLine(d.name),
    company: orNull(cleanLine(d.company)),
    email: cleanLine(d.email),
    phone: orNull(cleanLine(d.phone)),
    source: orNull(d.source),
  });
}

const MAX_ARRAY_ITEMS = 20;
const MAX_STRING = 10000;

/** 한 줄 값 */
function str(value: unknown): string {
  return typeof value === 'string' ? cleanLine(value.slice(0, MAX_STRING)) : '';
}

/** 여러 줄 값(자세한 내용) */
function text(value: unknown): string {
  return typeof value === 'string' ? cleanText(value.slice(0, MAX_STRING)) : '';
}

/** 목록: 문자열만, 정리 후 빈 값과 중복을 뺀다 */
function strArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return unique(
    value
      .slice(0, MAX_ARRAY_ITEMS)
      .filter((v): v is string => typeof v === 'string')
      .map((v) => cleanLine(v.slice(0, MAX_STRING)))
      .filter(Boolean),
  );
}

/** 서버: 신뢰할 수 없는 JSON → 전송 형태(값 검사 전) */
export function parseIncoming(raw: unknown): RequestPayload {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return keepSelectedCategoryOnly({
    category: str(o.category),
    services: strArray(o.services),
    title: str(o.title),
    description: text(o.description),
    stage: str(o.stage),
    references: unique(strArray(o.references).map(normalizeUrl).filter(Boolean)),
    platforms: strArray(o.platforms),
    features: strArray(o.features),
    scope: strArray(o.scope),
    purpose: orNull(str(o.purpose)),
    program_name: orNull(str(o.program_name)),
    deadline: orNull(str(o.deadline)),
    draft: orNull(str(o.draft)),
    timeline: str(o.timeline),
    budget: str(o.budget),
    name: str(o.name),
    company: orNull(str(o.company)),
    email: str(o.email),
    phone: orNull(str(o.phone)),
    source: orNull(str(o.source)),
  });
}

/* ── 검사 ───────────────────────────────────────────────── */

/** 전송 형태를 검사한다. 비어 있으면 통과. 브라우저와 서버가 같은 함수를 쓴다 */
export function validatePayload(p: RequestPayload): FieldErrors {
  const e: FieldErrors = {};

  // 1단계
  if (!p.category) e.category = 'category_required';
  else if (!oneOf(CATEGORY_OPTIONS, p.category)) e.category = 'invalid_option';

  if (isServiceCategory(p.category)) {
    if (p.services.length === 0) e.services = 'services_required';
    else if (!allOf(SERVICE_OPTIONS[p.category], p.services)) e.services = 'invalid_option';
  }

  if (!p.title) e.title = 'title_required';
  else if (charCount(p.title) > LIMITS.titleMax) e.title = 'title_too_long';

  if (!p.description) e.description = 'description_required';
  else if (charCount(p.description) < LIMITS.descriptionMin) e.description = 'description_too_short';
  else if (charCount(p.description) > LIMITS.descriptionMax) e.description = 'description_too_long';

  if (!p.stage) e.stage = 'stage_required';
  else if (!oneOf(STAGE_OPTIONS, p.stage)) e.stage = 'invalid_option';

  if (p.references.length > LIMITS.referencesMax || !p.references.every(isValidUrl)) {
    e.references = 'references_invalid';
  }

  if (p.category === CATEGORY_DEV) {
    if (p.platforms.length === 0) e.platforms = 'platforms_required';
    else if (!allOf(PLATFORM_OPTIONS, p.platforms)) e.platforms = 'invalid_option';

    // '잘 모르겠어요'는 다른 기능과 함께 고를 수 없다(화면도 그렇게 동작한다)
    const unsureMixed = p.features.includes(FEATURE_UNSURE) && p.features.length > 1;
    if (!allOf(FEATURE_OPTIONS, p.features) || unsureMixed) e.features = 'invalid_option';

    if (p.scope.length === 0) e.scope = 'scope_required';
    else if (!allOf(SCOPE_OPTIONS, p.scope)) e.scope = 'invalid_option';
  }

  if (p.category === CATEGORY_DOCS) {
    if (!p.purpose) e.purpose = 'purpose_required';
    else if (!oneOf(PURPOSE_OPTIONS, p.purpose)) e.purpose = 'invalid_option';

    if (p.program_name && charCount(p.program_name) > LIMITS.programNameMax) {
      e.program_name = 'program_name_too_long';
    }
    if (p.deadline && !isValidDate(p.deadline)) e.deadline = 'deadline_invalid';
    if (p.draft && !oneOf(DRAFT_OPTIONS, p.draft)) e.draft = 'invalid_option';
  }

  // 2단계
  if (!p.timeline) e.timeline = 'timeline_required';
  else if (!oneOf(TIMELINE_OPTIONS, p.timeline)) e.timeline = 'invalid_option';

  if (!p.budget) e.budget = 'budget_required';
  else if (!oneOf(BUDGET_OPTIONS, p.budget)) e.budget = 'invalid_option';

  // 3단계
  if (!p.name) e.name = 'name_required';
  else if (charCount(p.name) > LIMITS.nameMax) e.name = 'name_too_long';

  if (p.company && charCount(p.company) > LIMITS.companyMax) e.company = 'company_too_long';

  if (!p.email) e.email = 'email_required';
  else if (!isValidEmail(p.email)) e.email = 'email_invalid';

  if (p.phone && !isValidPhone(p.phone)) e.phone = 'phone_invalid';

  if (p.source && !oneOf(SOURCE_OPTIONS, p.source)) e.source = 'invalid_option';

  return e;
}

/** 한 단계에 속한 오류만 남긴다 */
export function errorsForStep(errors: FieldErrors, step: 1 | 2 | 3): FieldErrors {
  const out: FieldErrors = {};
  for (const key of FIELD_ORDER) {
    const code = errors[key];
    if (code && FIELD_STEP[key] === step) out[key] = code;
  }
  return out;
}

export function firstErrorField(errors: FieldErrors): FieldKey | null {
  return FIELD_ORDER.find((key) => errors[key]) ?? null;
}

/** 요약·메일에 쓰는 값 표기. 빈 값은 null */
export function formatValue(p: RequestPayload, key: FieldKey): string | null {
  const value = p[key];
  if (Array.isArray(value)) return value.length ? value.join(', ') : null;
  return value ? String(value) : null;
}
