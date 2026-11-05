/**
 * 의뢰 페이지(/request) 문구.
 * 항목명·선택지·안내 문구는 src/lib/request/schema.ts(스펙 원문)에 있고, 여기에는 화면 문구만 둔다.
 */
import { company } from '@/content/site';
import { LIMITS, type ErrorCode } from '@/lib/request/schema';

export const REPLY_DAYS = '2영업일';
export const RETENTION = '상담 종료 후 1년 보관 후 파기';

const n = (value: number) => value.toLocaleString('ko-KR');

export const requestCopy = {
  h1: '외주 의뢰',
  intro: [
    '의뢰 내용, 일정과 예산, 연락처를 차례로 적어 주세요.',
    '자료는 파일 대신 공유 링크로 받습니다.',
    `의뢰를 보내시면 ${REPLY_DAYS} 안에 이메일로 연락드립니다.`,
  ],
  stepTitles: ['어떤 일인가요', '일정과 예산', '연락처'] as const,
  stepStatus: (step: number, total: number) => `${total}단계 중 ${step}단계`,
  requiredMark: '(필수)',
  categoryExtraTitle: (category: string) => `${category} 추가 질문`,
  buttons: {
    next: '다음',
    prev: '이전',
    submit: '의뢰 보내기',
    submitting: '보내는 중',
    addReference: '링크 추가',
    removeReference: '링크 삭제',
    home: '홈으로',
    retry: '다시 보내기',
  },
  referenceLabel: (index: number) => `참고 링크 ${index}`,
  counters: {
    title: (count: number) => `${count} / ${LIMITS.titleMax}자`,
    description: (count: number) => `${count}자 · 최소 ${LIMITS.descriptionMin}자`,
  },
  selectPlaceholder: '고르지 않음',
  /** '다음'·'의뢰 보내기'를 눌러 오류를 찾았을 때만 화면 낭독기에 알린다(포커스는 첫 오류로 이동) */
  errorSummary: (count: number) => `확인할 항목이 ${count}개 있습니다.`,
  featuresHelp: "'잘 모르겠어요'는 다른 기능과 함께 고를 수 없습니다.",
  newWindow: '(새 창)',
  noScript: (email: string) => `이 양식은 자바스크립트가 켜져 있어야 보낼 수 있습니다. ${email}로 의뢰 내용을 보내 주세요.`,
  mailSubject: (title: string) => (title ? `[외주 의뢰] ${title}` : '[외주 의뢰]'),
  /** 스펙: 제출 버튼 바로 위, 체크박스 없이 문구로. 마지막 줄은 개인정보 처리방침 링크 */
  privacyNotice: {
    heading: '개인정보 안내',
    rows: [
      ['수집 목적', '외주 의뢰 상담과 견적 회신'],
      ['수집 항목', '이름, 이메일 (선택: 회사·소속, 전화번호)'],
      ['보유 기간', RETENTION],
      // 처리방침 '개인정보 국외 이전'의 요약. 보내기 전에 알 수 있게 둔다(거부 방법: 이메일 의뢰)
      ['국외 이전', `Vercel·Google(미국 등)로 보내고, Google에는 상담하는 동안 보관합니다. 원하지 않으면 ${company.email}로 의뢰해 주세요.`],
    ] as const,
    linkTerm: '자세한 내용',
    linkText: '개인정보 처리방침',
  },
  complete: {
    title: '의뢰가 접수됐습니다',
    receiptLabel: '접수 번호',
    followUp: `${REPLY_DAYS} 안에 입력하신 이메일로 연락드립니다.`,
    summaryHeading: '제출 내용',
  },
  /** 제출 실패(3종 모두): 무엇이 안 됐는지 + 다시 시도하는 방법 + 입력값 유지 + 이메일 대안 */
  failure: {
    title: '의뢰를 보내지 못했습니다',
    network: ['연결이 끊겨 서버에 닿지 못했습니다.', "연결을 확인한 뒤 '다시 보내기'를 눌러 주세요."],
    server: ['서버에 문제가 생겼습니다.', "잠시 뒤 '다시 보내기'를 눌러 주세요."],
    unavailable: ['지금은 이 페이지에서 의뢰를 접수할 수 없습니다.', "잠시 뒤 '다시 보내기'를 눌러 주세요."],
    keptInputs: '입력하신 내용은 그대로 남아 있습니다.',
    email: { before: '', after: '로 의뢰 내용을 보내 주셔도 됩니다.' },
    emailHint: '주소를 누르면 입력하신 내용을 간추린 메일 창이 열립니다.',
  },
  email: company.email,
} as const;

export const errorMessages: Record<ErrorCode, string> = {
  category_required: "의뢰 분야를 아직 고르지 않았습니다. 잘 모르겠다면 '아직 모르겠어요'를 골라 주세요.",
  services_required: '세부 항목을 아직 고르지 않았습니다. 맡기실 일을 하나 이상 골라 주세요.',
  title_required: '한 줄 소개가 비어 있습니다. 맡기실 일을 한 줄로 적어 주세요.',
  title_too_long: `한 줄 소개가 ${LIMITS.titleMax}자를 넘었습니다. ${LIMITS.titleMax}자 안으로 줄여 주세요.`,
  description_required: '자세한 내용이 비어 있습니다. 만들고 싶은 것, 해결하려는 문제, 꼭 필요한 기능을 적어 주세요.',
  description_too_short: `자세한 내용이 지금 {count}자입니다. 해결하려는 문제나 꼭 필요한 기능을 더해 ${LIMITS.descriptionMin}자 이상 적어 주세요.`,
  description_too_long: `자세한 내용이 ${n(LIMITS.descriptionMax)}자를 넘었습니다. ${n(LIMITS.descriptionMax)}자 안으로 줄여 주세요.`,
  stage_required: '지금 준비된 것을 아직 고르지 않았습니다. 가장 가까운 것을 하나 골라 주세요.',
  references_invalid: '참고 링크 주소 형식이 맞지 않습니다. 브라우저 주소창의 주소를 그대로 복사해 붙여 넣어 주세요.',
  platforms_required: '사용 환경을 아직 고르지 않았습니다. 하나 이상 골라 주세요.',
  scope_required: '맡길 범위를 아직 고르지 않았습니다. 하나 이상 골라 주세요.',
  purpose_required: "사용 목적을 아직 고르지 않았습니다. 맞는 것이 없으면 '기타'를 골라 주세요.",
  program_name_too_long: `지원사업·대회 이름이 ${LIMITS.programNameMax}자를 넘었습니다. ${LIMITS.programNameMax}자 안으로 줄여 주세요.`,
  deadline_invalid: '제출 마감일이 올바른 날짜가 아닙니다. 날짜를 다시 고르거나 비워 두세요.',
  timeline_required: "희망 완료 시점을 아직 고르지 않았습니다. 정하지 않았다면 '협의'를 골라 주세요.",
  budget_required: "예산 범위를 아직 고르지 않았습니다. 정하지 않았다면 '아직 못 정함'을 골라 주세요.",
  name_required: '이름이 비어 있습니다. 연락받으실 분의 이름을 적어 주세요.',
  name_too_long: `이름이 ${LIMITS.nameMax}자를 넘었습니다. ${LIMITS.nameMax}자 안으로 줄여 주세요.`,
  company_too_long: `회사·소속이 ${LIMITS.companyMax}자를 넘었습니다. ${LIMITS.companyMax}자 안으로 줄여 주세요.`,
  email_required: '이메일이 비어 있습니다. 회신받으실 이메일을 적어 주세요.',
  email_invalid: '이메일 형식이 맞지 않습니다. name@example.com처럼 적어 주세요.',
  phone_invalid: '전화번호 형식이 맞지 않습니다. 010-1234-5678처럼 적거나 비워 두세요.',
  invalid_option: '선택한 값을 확인할 수 없습니다. 선택지에서 다시 골라 주세요.',
};

export function errorMessage(code: ErrorCode, count?: number): string {
  const message = errorMessages[code];
  return message.includes('{count}') ? message.replace('{count}', String(count ?? 0)) : message;
}
