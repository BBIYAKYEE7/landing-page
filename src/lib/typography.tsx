import { Fragment, type ReactNode } from 'react';

/**
 * 화면 표시용 글자 다듬기. 저장·전송 값에는 쓰지 않는다.
 *
 * Chrome의 word-break: keep-all은 가운뎃점(·) 앞 줄바꿈을 막지 못해 줄 머리에 '·'가 올 수 있다.
 * '·' 앞에 단어 결합자(U+2060, 보이지 않음)를 넣어 '·' 뒤에서만 줄이 바뀌게 한다.
 * 한 덩어리로 읽혀야 하는 말(예: 사업 문서·컨설팅)은 '·' 앞뒤를 모두 붙인다.
 *
 * keep-all은 닫는 괄호(), 」, 』) 바로 뒤 한글 앞에서도 줄을 바꿔 '(HTTPS)' / '으로'처럼 조사가 줄 머리에 온다.
 * 닫는 괄호 뒤에 단어 결합자를 넣어 괄호와 조사를 붙인다('(' 앞 줄바꿈은 그대로).
 */
const WORD_JOINER = '⁠';
const KEEP_WHOLE = ['사업 문서·컨설팅'];

export function tidy(text: string): string {
  let out = text.split('·').join(`${WORD_JOINER}·`);
  for (const phrase of KEEP_WHOLE) {
    const loose = phrase.split('·').join(`${WORD_JOINER}·`);
    const whole = phrase.split('·').join(`${WORD_JOINER}·${WORD_JOINER}`);
    out = out.split(loose).join(whole);
  }
  return out.replace(/([)」』])(?=[가-힣])/g, `$1${WORD_JOINER}`);
}

/** 문장 속 영문 제품명은 화면 낭독기가 영어로 읽도록 lang="en"으로 감싼다 */
const ENGLISH_NAMES = ['B Essential', 'MCI Link', 'SITE', 'NoteOn'];
const ENGLISH_NAME_RE = new RegExp(`(${ENGLISH_NAMES.join('|')})`);

export function withLang(text: string): ReactNode {
  return text.split(ENGLISH_NAME_RE).map((part, index) =>
    ENGLISH_NAMES.includes(part) ? (
      <span key={index} lang="en">
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

/** tidy + withLang */
export function richText(text: string): ReactNode {
  return withLang(tidy(text));
}
