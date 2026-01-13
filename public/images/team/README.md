# 팀원 프로필 이미지 가이드

이 폴더에 팀원들의 프로필 이미지를 추가할 수 있습니다.

## 사용 방법

### 1. 이미지 추가
프로필 이미지를 이 폴더(`public/images/team/`)에 추가하세요.

예시:
- `public/images/team/임태호.jpg`
- `public/images/team/홍예찬.jpg`
- `public/images/team/김재윤.jpg`

### 2. 코드 수정
`src/app/detail/[id]/page.tsx` 파일에서 해당 팀원의 `profileImage` 값을 수정하세요.

```typescript
// 수정 전
{ name: '김재윤', role: 'Frontend', desc: '...', profileImage: null }

// 수정 후
{ name: '김재윤', role: 'Frontend', desc: '...', profileImage: '/images/team/김재윤.jpg' }
```

### 3. 이미지 권장 사양
- **크기**: 200x200px 이상 (정사각형 권장)
- **형식**: JPG, PNG, WebP
- **용량**: 500KB 이하 권장
- **비율**: 1:1 (정사각형)

## 예시

```typescript
const teamGroups = [
  {
    category: '기획 / 마케팅',
    members: [
      { 
        name: '임태호', 
        role: '대표 / 기획', 
        desc: '프로젝트 총괄 및 서비스 기획', 
        school: '연세대학교', 
        major: '신학과',
        profileImage: '/images/team/임태호.jpg'  // 이미지 경로 추가
      },
    ],
  },
];
```

## 참고사항
- `profileImage`가 `null`이면 이름의 첫 글자가 표시됩니다.
- 이미지가 있으면 원형으로 표시됩니다.
- 이미지는 자동으로 원형으로 잘립니다.
