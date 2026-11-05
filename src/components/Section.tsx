import type { ReactNode } from 'react';

type Props = {
  id: string;
  titleId: string;
  children: ReactNode;
};

/**
 * 컨테이너 폭 안에서 위쪽 0.5px 선으로 구획하는 섹션 틀.
 * tabIndex={-1}: 메뉴(HashLink)로 이동하면 포커스를 이 섹션으로 옮겨 다음 Tab이 여기서 이어진다.
 */
export default function Section({ id, titleId, children }: Props) {
  return (
    <section id={id} aria-labelledby={titleId} tabIndex={-1}>
      <div className="container">
        <div className="section-body">{children}</div>
      </div>
    </section>
  );
}
