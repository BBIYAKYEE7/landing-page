# U-TEED Landing Page

주식회사 유티드(U-TEED) 회사 소개 사이트입니다. Next.js(App Router)와 TypeScript로 구성되어 있습니다.

## 링크

- 사이트: https://www.u-teed.co.kr/

## 개발/빌드

```bash
npm run dev
npm run build
npm run start
```

## 페이지

- `/` 원페이지 회사 소개 (회사 / 사업 / 외주 / 연혁 / 문의)
- `/request` 외주 의뢰 3단계 폼
- `/privacy` 개인정보 처리방침 (초안. 본문은 `src/content/privacy.ts`. 보유 기간·파기 문구는 Apps Script 안내의 '운영할 때' 절차와 함께 고칩니다)
- `POST /api/request` 의뢰 접수 API

## 구조

- `src/app/globals.css`: 디자인 토큰(:root 한 곳)과 전역 스타일. 컴포넌트 CSS는 토큰 변수만 참조합니다.
- `src/content/`: 화면에 나오는 사실과 문구. 회사 정보·제품·연혁은 `site.ts`, 의뢰 폼 문구는 `request.ts`.
- `src/lib/request/schema.ts`: 의뢰 폼 필드·선택지·검사 규칙. 브라우저와 서버가 같은 파일을 씁니다.
- `src/components/`: 섹션·폼 컴포넌트
- `integrations/google-apps-script/`: 의뢰 저장·알림용 Google Apps Script와 설정 안내
- `public/fonts/pretendard-1.3.9/`: Pretendard 글꼴 파일. 방문자 브라우저가 외부 CDN에 요청하지 않도록 사이트에서 직접 제공합니다.

## 비어 있는 칸 채우기

`src/content/site.ts`에서 `null`로 둔 값을 채우면 화면에 나옵니다.

- `company.mission`: 미션·한 줄 소개
- `products[].link`: MCI Link, SITE, NoteOn 링크
- `products[].media`: 제품 실제 스크린샷 (없으면 제품명만 있는 단색 면)

## 의뢰 폼 설정

의뢰는 `/api/request`가 서버에서 다시 검사한 뒤 Google Apps Script 웹 앱으로 넘기고, Apps Script가 비공개 스프레드시트에 저장하고 메일로 알립니다. 설정 방법은 `integrations/google-apps-script/README.md`에 있습니다.

| 환경변수 | 설명 |
|---|---|
| `REQUEST_ENDPOINT_URL` | Apps Script 웹 앱 URL (`https://script.google.com/macros/s/.../exec`) |
| `REQUEST_ENDPOINT_SECRET` | Apps Script 스크립트 속성 `SECRET`과 같은 값 |
| `REQUEST_DRY_RUN` | 로컬 개발(`npm run dev`)에서만 `1`이면 저장 없이 흐름만 시험합니다. 운영 빌드에서는 무시됩니다. |

환경변수가 없으면 폼은 실패 안내와 대안 이메일을 보여 줍니다.

## 라이선스
본 프로젝트의 문서/콘텐츠는 `Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)`에 따라 이용할 수 있습니다.
라이선스 전문: https://creativecommons.org/licenses/by-nc-nd/4.0/

글꼴 Pretendard는 SIL Open Font License 1.1을 따릅니다(`public/fonts/pretendard-1.3.9/LICENSE.txt`).
