/**
 * /privacy 개인정보 처리방침 본문 (초안 — 게시 전에 회사가 확인할 것은 PR 설명에 있다).
 *
 * 실제 처리 흐름(의뢰 폼 → Vercel /api/request → Google Apps Script → 비공개 스프레드시트·운영자 메일,
 * 회사 메일함은 메일플러그)과 「개인정보 보호법」, 개인정보보호위원회 「개인정보 처리방침 작성지침」(2026.4.)을 바탕으로 썼다.
 * 보유 기간·파기 문구는 integrations/google-apps-script/README.md '운영할 때' 절차와 같아야 한다. 한쪽을 바꾸면 다른 쪽도 고친다.
 * 회사 연락처는 site.ts, 보유 기간 문구는 의뢰 폼 안내(request.ts RETENTION)에서 가져온다.
 */
import { RETENTION } from '@/content/request';
import { company } from '@/content/site';

export type PolicyRow = { term: string; detail: string; href?: string };
export type PolicyBlock =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: readonly string[] }
  | { kind: 'rows'; title?: string; rows: readonly PolicyRow[] };
export type PolicySection = { id: string; heading: string; blocks: readonly PolicyBlock[] };

export const privacyPage: {
  h1: string;
  effective: { label: string; text: string; dateTime: string };
  tocTitle: string;
  intro: readonly string[];
  sections: readonly PolicySection[];
} = {
  h1: '개인정보 처리방침',
  /** [확인] 실제 공개일로 바꾼다. '개인정보 처리방침 변경' 섹션 첫 문장도 같은 날짜다 */
  effective: { label: '시행일', text: '2026년 11월 5일', dateTime: '2026-11-05' },
  tocTitle: '목차',
  intro: [
    '주식회사 유티드(이하 "회사")는 「개인정보 보호법」 제30조에 따라 이 개인정보 처리방침을 공개합니다.',
    `이 처리방침은 회사 웹사이트(www.u-teed.co.kr)와, 회사 이메일(${company.email})로 받는 문의와 외주 의뢰에서 처리하는 개인정보에 적용됩니다.`,
  ],
  sections: [
    {
      id: 'purpose',
      heading: '개인정보 처리 목적',
      blocks: [
        { kind: 'p', text: '회사는 아래 목적에만 개인정보를 처리합니다. 목적이 바뀌면 「개인정보 보호법」 제18조에 따라 따로 동의를 받습니다. 법이 동의 없이 허용하는 경우는 예외입니다.' },
        {
          kind: 'rows',
          rows: [
            { term: '외주 의뢰 상담과 견적 회신', detail: '의뢰 내용을 확인하고 상담합니다. 견적은 이메일로 회신합니다. 전화번호를 적은 경우 전화로도 연락합니다.' },
            { term: '이메일 문의와 의뢰 응대', detail: '회사 이메일로 받은 문의, 외주 의뢰, 개인정보 열람 등 요구를 확인하고 답합니다.' },
            { term: '재문의 응대와 분쟁 대응', detail: '상담이 끝난 뒤 같은 의뢰로 다시 연락하시면 이전 기록을 보고 답합니다. 상담 내용에 다툼이 생기면 기록으로 사실을 확인합니다.' },
            { term: '의뢰 경로 확인', detail: "의뢰 폼의 '알게 된 경로' 답을 모아 의뢰가 어떤 경로로 들어오는지 확인합니다." },
            { term: '웹사이트 제공과 보안', detail: '웹사이트를 제공합니다. 오류나 비정상 접속이 생기면 접속 기록으로 원인을 확인합니다.' },
          ],
        },
      ],
    },
    {
      id: 'items',
      heading: '처리하는 개인정보 항목',
      blocks: [
        { kind: 'p', text: '회사는 처리 목적에 필요한 최소한의 개인정보만 처리합니다. 아래 개인정보는 정보주체의 동의 없이 법률이 정한 근거에 따라 처리합니다. 동의를 받아 처리하는 개인정보는 없습니다.' },
        {
          kind: 'rows',
          title: '외주 의뢰(의뢰 폼)',
          rows: [
            { term: '필수 항목', detail: "이름, 이메일, 의뢰 분야, 세부 항목('개발'이나 '사업 문서·컨설팅'을 고른 경우), 한 줄 소개, 자세한 내용, 지금 준비된 것, 희망 완료 시점, 예산 범위" },
            { term: '선택 항목', detail: '회사·소속, 전화번호, 알게 된 경로, 참고 링크' },
            { term: '개발 추가 질문', detail: '사용 환경(필수), 필요한 기능(선택), 맡길 범위(필수)' },
            { term: '사업 문서·컨설팅 추가 질문', detail: '사용 목적(필수), 지원사업·대회 이름(선택), 제출 마감일(선택), 기존 자료(선택)' },
            { term: '공유 자료', detail: '참고 링크로 공유하신 자료에 담긴 정보' },
            { term: '접수 뒤 생기는 정보', detail: '접수 번호, 접수 일시, 회사가 적는 마지막 연락일과 진행 상태' },
            { term: '처리 근거', detail: '「개인정보 보호법」 제15조제1항제4호(계약을 맺는 과정에서 정보주체가 요청한 조치를 하기 위해 필요한 경우)' },
            { term: '알게 된 경로 처리 근거', detail: '「개인정보 보호법」 제15조제1항제6호(회사의 정당한 이익: 의뢰 경로 확인)' },
            { term: '상담 종료 후 보관 근거', detail: '「개인정보 보호법」 제15조제1항제6호(회사의 정당한 이익: 재문의 응대와 분쟁 대응)' },
          ],
        },
        {
          kind: 'rows',
          title: '이메일 문의와 의뢰',
          rows: [
            { term: '항목', detail: '이름, 이메일, 메일 본문과 첨부 파일에 담긴 정보' },
            { term: '외주 의뢰 처리 근거', detail: '「개인정보 보호법」 제15조제1항제4호(계약을 맺는 과정에서 정보주체가 요청한 조치를 하기 위해 필요한 경우)' },
            { term: '그 밖의 문의 처리 근거', detail: '「개인정보 보호법」 제15조제1항제6호(회사의 정당한 이익: 받은 문의에 답하기)' },
            { term: '열람 등 요구 처리 근거', detail: '「개인정보 보호법」 제15조제1항제2호(같은 법 제35조부터 제38조까지의 의무를 지키기 위해 불가피한 경우)' },
            { term: '상담 종료 후 보관 근거', detail: '「개인정보 보호법」 제15조제1항제6호(회사의 정당한 이익: 재문의 응대와 분쟁 대응)' },
          ],
        },
        {
          kind: 'rows',
          title: '웹사이트 접속 기록',
          rows: [
            { term: '항목', detail: '접속 IP 주소, 브라우저·기기 정보, 접속 일시, 요청한 페이지 주소, 직전에 본 페이지 주소' },
            { term: '수집 방법', detail: '웹사이트에 접속하면 웹사이트 서버를 운영하는 Vercel이 자동으로 기록합니다.' },
            { term: '처리 근거', detail: '「개인정보 보호법」 제15조제1항제4호(웹사이트 이용 과정에서 이용자가 요청한 웹페이지를 보여 주는 데 필요한 경우), 제6호(회사의 정당한 이익: 오류와 비정상 접속 확인)' },
          ],
        },
        { kind: 'p', text: '한 줄 소개, 자세한 내용, 참고 링크에는 의뢰에 필요한 내용만 넣어 주시기 바랍니다. 주민등록번호 같은 고유식별정보, 건강 정보 같은 민감정보, 다른 사람의 개인정보는 적지 않으시기 바랍니다. 참고 링크로 공유하신 자료는 상담에 필요한 범위에서만 열어 봅니다.' },
      ],
    },
    {
      id: 'retention',
      heading: '개인정보 보유 기간',
      blocks: [
        {
          kind: 'rows',
          rows: [
            { term: '외주 의뢰(의뢰 폼)', detail: RETENTION },
            { term: '이메일 문의와 의뢰', detail: RETENTION },
            { term: '열람 등 요구를 처리한 기록', detail: '처리를 마친 날부터 1년 보관 후 파기' },
            { term: '웹사이트 접속 기록', detail: '회사가 볼 수 있는 기록은 Vercel 로그 보관 기간(최대 1일)이 지나면 자동으로 지워집니다. Vercel이 따로 보관하는 정보는 Vercel 개인정보처리방침을 따릅니다.' },
          ],
        },
        { kind: 'p', text: '상담 종료일은 회사나 정보주체가 상담을 마치겠다고 알린 날입니다. 그런 연락이 없으면 마지막 연락 뒤 30일이 지난 날을 상담 종료일로 봅니다.' },
        { kind: 'p', text: '의뢰 폼으로 받은 의뢰는 상담하는 동안 Google 스프레드시트와 Gmail에도 둡니다. 상담이 끝나면 Google에 있는 사본은 지웁니다.' },
        { kind: 'p', text: '상담이 끝난 뒤 1년 동안은 회사 메일함(메일플러그)에 있는 메일로만 보관합니다. 이 기간에는 재문의 응대와 분쟁 대응에만 씁니다.' },
        { kind: 'p', text: '관계 법령 위반으로 수사나 조사가 진행 중이면, 의뢰와 문의 기록은 수사나 조사가 끝날 때까지 보관합니다.' },
      ],
    },
    {
      id: 'destruction',
      heading: '개인정보 파기 절차와 방법',
      blocks: [
        { kind: 'p', text: '보유 기간이 끝나거나 처리 목적을 이루면 5일 안에 파기합니다. 개인정보 보호책임자가 파기할 개인정보를 확인하고 직접 파기합니다.' },
        {
          kind: 'rows',
          rows: [
            { term: '상담이 끝났을 때', detail: 'Google 스프레드시트에서 해당 행을 삭제합니다. 회사 Google 계정의 Gmail에서 접수 알림 메일의 보낸편지함 사본과 반송 메일을 삭제하고 휴지통을 비웁니다.' },
            { term: '상담 종료 후 1년이 되는 달', detail: '그달 5일까지 회사 메일함(메일플러그)에서 접수 알림 메일과, 그 의뢰나 문의로 주고받은 메일(회사가 보낸 회신 포함)을 삭제하고 휴지통을 비웁니다.' },
            { term: '열람 등 요구 처리 후 1년이 되는 달', detail: '그달 5일까지 회사 메일함(메일플러그)에서 요구 메일과 회사의 회신을 삭제하고 휴지통을 비웁니다.' },
            { term: '웹사이트 접속 기록', detail: '회사가 볼 수 있는 기록은 보관 기간(최대 1일)이 지나면 Vercel이 자동으로 지웁니다.' },
            { term: '종이 출력물', detail: '분쇄하거나 소각합니다.' },
          ],
        },
        { kind: 'p', text: 'Google 스프레드시트는 삭제한 행을 버전 기록에 남깁니다. 그래서 회사는 매월 5일까지 스프레드시트 사본을 만들어 접수를 사본으로 옮깁니다. 그다음 원래 파일을 영구 삭제해 버전 기록까지 지웁니다.' },
      ],
    },
    {
      id: 'third-party',
      heading: '개인정보 제3자 제공',
      blocks: [
        { kind: 'p', text: '회사는 개인정보를 제3자에게 제공하지 않습니다. 다만 법률에 특별한 규정이 있는 경우처럼 「개인정보 보호법」 제17조와 제18조가 허용하는 경우는 예외입니다.' },
      ],
    },
    {
      id: 'outsourcing',
      heading: '개인정보 처리 위탁',
      blocks: [
        { kind: 'p', text: '회사는 아래 업체(수탁자)에 개인정보 처리 업무를 맡깁니다. 수탁자가 다시 맡긴 업체(재수탁자)는 각 업체가 공개한 목록에서 확인할 수 있습니다.' },
        {
          kind: 'rows',
          title: 'Google LLC',
          rows: [
            { term: '맡기는 업무', detail: '의뢰 내용과 상담 진행 기록 저장(Google 스프레드시트), 접수 처리(Google Apps Script), 접수 알림 메일 발송과 사본 보관(Gmail)' },
            { term: '재수탁자', detail: "Google '한국 거주자를 위한 개인정보 관련 추가 정보'", href: 'https://policies.google.com/privacy/additional?gl=kr&hl=ko' },
          ],
        },
        {
          kind: 'rows',
          title: 'Vercel Inc.',
          rows: [
            { term: '맡기는 업무', detail: '웹사이트 서버 운영(호스팅), 의뢰 내용 검사와 전달, 접속 기록 보관' },
            { term: '재수탁자', detail: 'Vercel 하위 처리자(Subprocessors) 목록', href: 'https://security.vercel.com' },
          ],
        },
        {
          kind: 'rows',
          title: '(주)메일플러그',
          rows: [
            { term: '맡기는 업무', detail: `회사 이메일(${company.email}) 수신·발송과 보관: 접수 알림 메일, 이메일 문의와 의뢰, 회사가 보내는 회신(견적 포함)` },
            { term: '재수탁자', detail: '메일플러그 개인정보처리방침의 위탁 현황', href: 'https://mypage.mailplug.com/terms/private' },
          ],
        },
        { kind: 'p', text: "Google LLC와 Vercel Inc.는 국외에서 개인정보를 처리합니다. 자세한 내용은 아래 '개인정보 국외 이전'에서 안내합니다." },
        { kind: 'p', text: '수탁자나 맡기는 업무가 바뀌면 이 처리방침에 지체 없이 반영합니다.' },
      ],
    },
    {
      id: 'overseas',
      heading: '개인정보 국외 이전',
      blocks: [
        { kind: 'p', text: "회사는 개인정보를 아래 두 업체로 국외 이전합니다. 이전 유형은 처리위탁·보관입니다. 두 업체가 다시 맡긴 업체(재수탁자)와 그 국가는 '개인정보 처리 위탁'의 재수탁자 링크에서 확인할 수 있습니다." },
        { kind: 'p', text: '의뢰 폼에 적은 정보의 이전 근거는 「개인정보 보호법」 제28조의8제1항제3호가목입니다. 의뢰를 받아 상담하고 계약을 맺는 데 필요한 처리위탁·보관이어서, 법이 정한 사항을 이 처리방침에 공개합니다.' },
        { kind: 'p', text: '웹사이트 접속 기록의 이전 근거도 같은 조항입니다. 이용자가 요청한 웹페이지를 보여 주려면 웹사이트 서버를 운영하는 Vercel이 접속 기록을 처리해야 하기 때문입니다.' },
        {
          kind: 'rows',
          title: 'Google LLC',
          rows: [
            { term: '이전 항목', detail: '의뢰 폼에 적은 모든 항목(이름, 이메일, 의뢰 내용과 분야별 추가 질문, 적은 경우 회사·소속, 전화번호, 알게 된 경로, 참고 링크), 접수 번호, 접수 일시, 회사가 적는 마지막 연락일과 진행 상태' },
            { term: '이전 국가', detail: 'Google 데이터센터가 있는 국가(미국, 칠레, 우루과이, 아일랜드, 네덜란드, 덴마크, 핀란드, 독일, 벨기에, 영국, 대만, 일본, 싱가포르). 회사는 이 가운데 저장 위치를 고를 수 없습니다.' },
            { term: '이전 시기와 방법', detail: '의뢰를 보내는 즉시 암호화된 인터넷 통신(HTTPS)으로 보냅니다.' },
            { term: '이전받는 자', detail: 'Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA)' },
            { term: '연락처', detail: 'googlekrsupport@google.com', href: 'mailto:googlekrsupport@google.com' },
            { term: '이용 목적', detail: '의뢰 내용과 상담 진행 기록 저장, 접수 처리, 접수 알림 메일 발송과 사본 보관' },
            { term: '보유·이용 기간', detail: '상담하는 동안 보관합니다. 늦어도 상담 종료일부터 5일 안에 지웁니다. 지운 행은 다음 달 5일까지 스프레드시트 버전 기록에 남습니다. 회사가 영구 삭제한 정보는 Google 저장 시스템에서 지워지기까지 보통 2개월쯤 걸립니다. Google 백업에는 최대 6개월 남을 수 있습니다.' },
            { term: '거부 방법과 절차', detail: `의뢰 폼 대신 ${company.email}로 이메일을 보내 의뢰합니다. 따로 신청할 필요는 없습니다.` },
            { term: '이미 보낸 의뢰', detail: `${company.email}로 국외 이전을 원하지 않는다고 알려 주시기 바랍니다. 회사는 받은 날부터 10일 안에 Google에 있는 의뢰 기록(스프레드시트 행과 버전 기록, 알림 메일 사본)을 지우고 결과를 알립니다. 상담은 이메일로 이어 갑니다.` },
            { term: '거부의 효과', detail: '의뢰 폼은 쓸 수 없습니다. 이메일로 의뢰하셔도 똑같이 상담하고 견적을 회신합니다. 회사는 이메일로 받은 의뢰를 Google로 이전하지 않습니다.' },
          ],
        },
        {
          kind: 'rows',
          title: 'Vercel Inc.',
          rows: [
            { term: '이전 항목', detail: '웹사이트 접속 기록(접속 IP 주소, 브라우저·기기 정보, 접속 일시, 요청한 페이지 주소, 직전에 본 페이지 주소), 의뢰 폼에 적은 모든 항목' },
            { term: '이전 국가', detail: '미국. Vercel과 재수탁자가 운영하는 다른 국가에서도 처리될 수 있습니다.' },
            { term: '이전 시기와 방법', detail: '웹사이트에 접속하거나 의뢰를 보낼 때마다 암호화된 인터넷 통신(HTTPS)으로 보냅니다.' },
            { term: '이전받는 자', detail: 'Vercel Inc. (440 N Barranca Avenue #4133, Covina, CA 91723, USA)' },
            { term: '연락처', detail: 'privacy@vercel.com', href: 'mailto:privacy@vercel.com' },
            { term: '이용 목적', detail: '웹사이트 서버 운영, 의뢰 내용 검사와 Google 전달, 접속 기록 보관' },
            { term: '보유·이용 기간', detail: '의뢰 내용은 저장하지 않고 Google로 전달만 합니다. 회사가 Vercel 화면에서 볼 수 있는 접속 기록은 보관 기간(최대 1일)이 지나면 자동으로 지워집니다. Vercel이 자체 개인정보처리방침에 따라 따로 보관하는 접속 정보는 그 처리방침의 기간을 따릅니다.' },
            { term: 'Vercel 개인정보처리방침', detail: 'vercel.com/legal/privacy-notice', href: 'https://vercel.com/legal/privacy-notice' },
            { term: '거부 방법과 절차', detail: `웹사이트에 접속하지 않고 ${company.email}로 바로 이메일을 보내 문의하거나 의뢰합니다. 이미 남은 접속 기록은 위 보유·이용 기간에 따라 지워집니다.` },
            { term: '거부의 효과', detail: '웹사이트와 의뢰 폼을 이용할 수 없습니다. 이메일로 의뢰하셔도 똑같이 상담하고 견적을 회신합니다.' },
          ],
        },
      ],
    },
    {
      id: 'security',
      heading: '개인정보 안전성 확보 조치',
      blocks: [
        {
          kind: 'rows',
          title: '관리적 조치',
          rows: [
            { term: '보호책임자 지정', detail: '대표가 개인정보 보호책임자를 맡습니다.' },
            { term: '다루는 사람', detail: '개인정보는 대표 1명만 다룹니다.' },
          ],
        },
        {
          kind: 'rows',
          title: '기술적 조치',
          rows: [
            { term: '전송 암호화', detail: '웹사이트 접속과 의뢰 전송에 암호화된 통신(HTTPS)을 씁니다.' },
            { term: '스프레드시트 비공개', detail: '의뢰를 저장하는 스프레드시트는 누구와도 공유하지 않습니다.' },
            { term: '접수 인증', detail: '접수 프로그램(Google Apps Script)은 사이트 서버와 미리 나눈 비밀값이 맞는 요청만 저장합니다.' },
            { term: '입력값 검사', detail: '서버에서 입력값을 다시 검사합니다.' },
            { term: '자동 등록 차단', detail: '자동으로 의뢰를 보내는 프로그램을 걸러내는 장치를 둡니다.' },
            { term: '로그 관리', detail: '서버와 접수 프로그램의 기록(로그)에는 의뢰 내용을 남기지 않습니다.' },
            { term: '화면 도용 방지', detail: '다른 사이트가 이 웹사이트를 자기 화면 안에 넣어 보여 주지 못하게 막습니다.' },
          ],
        },
        {
          kind: 'rows',
          title: '물리적 조치',
          rows: [
            { term: '전산실', detail: '회사는 자체 서버나 전산실을 두지 않습니다.' },
          ],
        },
      ],
    },
    {
      id: 'auto-collection',
      heading: '쿠키 등 자동 수집 장치',
      blocks: [
        { kind: 'p', text: '회사 웹사이트는 쿠키를 쓰지 않습니다. 방문 분석 도구와 광고 추적 도구도 쓰지 않습니다.' },
        {
          kind: 'rows',
          title: '의뢰 폼 임시 저장',
          rows: [
            { term: '저장 위치', detail: '이용자 브라우저의 같은 탭 저장소(sessionStorage)' },
            { term: '저장 내용', detail: '의뢰 폼에 입력한 내용' },
            { term: '목적', detail: '새로고침하거나 뒤로 가도 입력이 사라지지 않게 합니다.' },
            { term: '회사로 전송', detail: "임시 저장한 내용은 회사로 보내지 않습니다. '의뢰 보내기'를 누르기 전에는 회사가 입력 내용을 저장하거나 받아 보지 않습니다." },
            { term: '삭제', detail: "제출에 성공하면 지웁니다. 마지막으로 입력하거나 의뢰 폼을 연 때부터 60분이 지난 뒤 같은 탭에서 의뢰 폼을 다시 열면 지웁니다. 탭을 닫으면 브라우저가 지웁니다. 다만 브라우저의 '닫은 탭 다시 열기'나 탭 복원 기능으로 되살아날 수 있습니다." },
            { term: '거부 방법', detail: '브라우저에서 사이트 데이터 저장을 막아도 의뢰 폼을 쓸 수 있습니다. 이때는 새로고침하면 입력이 사라집니다.' },
          ],
        },
      ],
    },
    {
      id: 'rights',
      heading: '정보주체의 권리와 행사 방법',
      blocks: [
        { kind: 'p', text: `정보주체는 언제든지 회사에 개인정보 열람, 정정·삭제, 처리정지를 요구할 수 있습니다. 요구는 개인정보 보호책임자에게 이메일(${company.email})이나 서면으로 하시면 됩니다.` },
        {
          kind: 'list',
          items: [
            '회사는 요구를 받은 날부터 10일 안에 조치하고 결과를 알립니다.',
            '요구한 사람이 본인이나 정당한 대리인인지 확인합니다.',
            '법정대리인이나 위임받은 사람도 요구할 수 있습니다.',
            '위임받은 사람은 「개인정보 처리 방법에 관한 고시」 별지 제11호 서식의 위임장을 내야 합니다.',
            '「개인정보 보호법」 제35조제4항과 제37조제2항에 따라 열람과 처리정지 요구가 제한될 수 있습니다.',
            '요구를 거절하거나 일부만 받아들이면 그 이유를 알립니다.',
            `결정에 이의가 있으면 ${company.email}로 이의를 제기할 수 있습니다.`,
            '의뢰 폼으로 보낸 내용을 고치거나 지우려면 의뢰에 적은 이메일 주소로 요청해 주시기 바랍니다.',
            '접수 번호가 있으면 함께 알려 주시기 바랍니다.',
            '회사는 접수 번호만으로 본인을 확인하지 않습니다.',
          ],
        },
      ],
    },
    {
      id: 'officer',
      heading: '개인정보 보호책임자',
      blocks: [
        {
          kind: 'rows',
          rows: [
            { term: '성명', detail: company.ceo },
            { term: '직위', detail: '대표' },
            { term: '이메일', detail: `${company.email}`, href: `mailto:${company.email}` },
            { term: '주소', detail: company.address },
          ],
        },
        { kind: 'p', text: '개인정보 문의, 불만 처리, 피해 구제, 열람 청구 접수는 개인정보 보호책임자가 직접 맡습니다.' },
      ],
    },
    {
      id: 'remedy',
      heading: '권익침해 구제 방법',
      blocks: [
        { kind: 'p', text: '개인정보 침해로 피해 구제나 분쟁 조정이 필요하면 아래 기관에 신고하거나 상담할 수 있습니다.' },
        {
          kind: 'rows',
          title: '개인정보분쟁조정위원회',
          rows: [
            { term: '전화', detail: '(국번없이) 1833-6972' },
            { term: '웹사이트', detail: 'www.kopico.go.kr', href: 'https://www.kopico.go.kr' },
          ],
        },
        {
          kind: 'rows',
          title: '개인정보침해 신고센터(한국인터넷진흥원)',
          rows: [
            { term: '전화', detail: '(국번없이) 118' },
            { term: '웹사이트', detail: 'privacy.kisa.or.kr', href: 'https://privacy.kisa.or.kr' },
          ],
        },
        {
          kind: 'rows',
          title: '경찰청',
          rows: [
            { term: '전화', detail: '(국번없이) 182' },
            { term: '웹사이트', detail: 'ecrm.police.go.kr', href: 'https://ecrm.police.go.kr' },
          ],
        },
      ],
    },
    {
      id: 'changes',
      heading: '개인정보 처리방침 변경',
      blocks: [
        { kind: 'p', text: '이 개인정보 처리방침은 2026년 11월 5일부터 적용됩니다. 회사가 처음 공개하는 처리방침이어서 이전 버전은 없습니다.' },
        { kind: 'p', text: '처리방침을 바꾸면 시행일과 바뀐 내용을 이 페이지에 공개합니다. 바뀌기 전과 후를 비교한 내용도 함께 올립니다. 이전 버전도 이 페이지에서 볼 수 있게 둡니다.' },
      ],
    },
  ],
};
