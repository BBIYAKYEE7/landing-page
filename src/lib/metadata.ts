import type { Metadata } from 'next';

const SITE_NAME = 'U-TEED';

/** 하위 페이지 메타데이터. 공유 미리보기(og·twitter)도 그 페이지 문구로 맞춘다 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', locale: 'ko_KR', siteName: SITE_NAME, url: path, title: fullTitle, description },
    twitter: { card: 'summary', title: fullTitle, description },
  };
}
