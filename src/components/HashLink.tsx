'use client';

import type { MouseEvent, ReactNode } from 'react';

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
};

/**
 * 같은 페이지 안 앵커 링크.
 * - 브라우저 기본 해시 이동은 Next 라우터가 모르는 히스토리 항목을 만들어, 다른 페이지로 갔다가 뒤로 오면 화면이 멈춘다.
 *   그래서 같은 페이지에서는 직접 스크롤하고 현재 항목의 상태를 그대로 둔 채 주소의 해시만 바꾼다.
 * - 이동한 섹션에 포커스를 옮겨(스크롤 없이) 다음 Tab이 그 섹션에서 이어지게 한다.
 * - 다른 페이지에서 누르면 브라우저가 그 주소로 이동한다.
 */
export default function HashLink({ href, className, children, onNavigate }: Props) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const url = new URL(href, window.location.href);
    if (url.pathname !== window.location.pathname || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${url.hash}`);
    target.focus({ preventScroll: true });
  };

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
