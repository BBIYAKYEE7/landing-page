/** 접수 시각·번호 도우미 (한국 시간 기준) */

const KST = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

function kstParts(date: Date): Record<string, string> {
  return Object.fromEntries(KST.formatToParts(date).map((part) => [part.type, part.value]));
}

/** 예: 2026-11-05T14:03:00+09:00 */
export function kstIso(date = new Date()): string {
  const p = kstParts(date);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}+09:00`;
}

/**
 * 저장하지 않는 응답(함정 필드에 걸린 봇)에 주는 번호.
 * 실제 번호처럼 그날의 작은 일련번호 범위(0001~0030)에서 고른다. 실제 번호는 Apps Script가 발급한다.
 */
export function unsavedReceiptNo(date = new Date()): string {
  const p = kstParts(date);
  const serial = String(Math.floor(Math.random() * 30) + 1).padStart(4, '0');
  return `UT-${p.year}${p.month}${p.day}-${serial}`;
}
