'use client';

import { useEffect, useId, useRef, useState, type FocusEvent } from 'react';
import HashLink from './HashLink';
import styles from './MobileNav.module.css';

type Item = { href: string; label: string };

/** 768px 이하에서만 보이는 접이식 메뉴 (WAI-ARIA disclosure 패턴) */
export default function MobileNav({ items }: { items: readonly Item[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // 포커스가 메뉴 안에 있을 때만 버튼으로 돌려보낸다. 밖에 있으면 닫기만 한다
      const focusInside = rootRef.current?.contains(document.activeElement) ?? false;
      setOpen(false);
      if (focusInside) buttonRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 769px)');
    const onViewport = () => {
      if (desktop.matches) setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    desktop.addEventListener('change', onViewport);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      desktop.removeEventListener('change', onViewport);
    };
  }, [open]);

  // Tab으로 메뉴 밖으로 나가면 닫는다(열린 패널이 본문 포커스를 가리지 않게)
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && !rootRef.current?.contains(next)) setOpen(false);
  };

  return (
    <div ref={rootRef} className={styles.root} onBlur={onBlur}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        메뉴
      </button>
      <div id={panelId} className={styles.panel} hidden={!open}>
        <nav aria-label="주요 메뉴">
          <ul className={`container ${styles.list}`}>
            {items.map((item) => (
              <li key={item.href}>
                <HashLink href={item.href} className={styles.link} onNavigate={() => setOpen(false)}>
                  {item.label}
                </HashLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
