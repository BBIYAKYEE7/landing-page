import { NextResponse } from 'next/server';
import { errorMessage } from '@/content/request';
import { kstIso, unsavedReceiptNo } from '@/lib/request/receipt';
import { FIELD_ORDER, charCount, parseIncoming, validatePayload } from '@/lib/request/schema';

/**
 * POST /api/request — 의뢰 접수
 *
 * 1. JSON 요청만, 같은 사이트에서 온 요청만 받는다(다른 사이트가 방문자 브라우저로 보내는 요청 차단).
 * 2. 함정 필드(website)에 값이 있으면 저장·전달하지 않고 성공처럼 응답한다.
 * 3. 브라우저와 같은 스키마로 서버에서 다시 검사한다.
 * 4. Google Apps Script 웹 앱으로 넘겨 스프레드시트 저장·접수 번호 발급·알림을 맡긴다.
 *    비밀값(REQUEST_ENDPOINT_SECRET)은 서버에만 있고 브라우저로 나가지 않는다.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const MAX_BODY_BYTES = 32 * 1024;
/** Apps Script 잠금 대기(20초)보다 길게: 저장은 됐는데 이쪽만 시간 초과로 실패를 알리는 일을 줄인다 */
const UPSTREAM_TIMEOUT_MS = 25_000;
const IDEMPOTENCY_KEY = /^[A-Za-z0-9-]{8,64}$/;
/** 함정 필드 응답 지연(바로 답하면 실제 접수와 구별된다) */
const TRAP_DELAY_MIN_MS = 600;
const TRAP_DELAY_SPAN_MS = 1200;

function reply(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

/** 함정 필드 판정. 문자열이 아닌 값이 오면 봇으로 본다 */
function isFilled(value: unknown): boolean {
  if (typeof value === 'string') return value.trim() !== '';
  return value !== undefined && value !== null;
}

/** 운영 상류 주소는 https://script.google.com 만. 로컬 시험용으로 localhost·127.0.0.1의 http만 예외 */
function isAllowedEndpoint(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && url.hostname === 'script.google.com') return true;
    return url.protocol === 'http:' && (url.hostname === '127.0.0.1' || url.hostname === 'localhost');
  } catch {
    return false;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    // 1. 요청 형식과 출처
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().startsWith('application/json')) {
      return reply(415, { ok: false, error: 'VALIDATION', fieldErrors: {} });
    }
    if (request.headers.get('sec-fetch-site') === 'cross-site') {
      return reply(403, { ok: false, error: 'FORBIDDEN' });
    }

    const declaredLength = Number(request.headers.get('content-length') ?? 0);
    if (declaredLength > MAX_BODY_BYTES) return reply(413, { ok: false, error: 'VALIDATION', fieldErrors: {} });

    let body: Record<string, unknown>;
    try {
      const buffer = await request.arrayBuffer();
      if (buffer.byteLength > MAX_BODY_BYTES) return reply(413, { ok: false, error: 'VALIDATION', fieldErrors: {} });
      const parsed: unknown = JSON.parse(new TextDecoder().decode(buffer));
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
      body = parsed as Record<string, unknown>;
    } catch {
      return reply(400, { ok: false, error: 'VALIDATION', fieldErrors: {} });
    }

    // 2. 함정 필드
    if (isFilled(body.website)) {
      await sleep(TRAP_DELAY_MIN_MS + Math.random() * TRAP_DELAY_SPAN_MS);
      return reply(200, { ok: true, receiptNo: unsavedReceiptNo(), receivedAt: kstIso() });
    }

    // 3. 서버 재검사
    const payload = parseIncoming(body);
    const errors = validatePayload(payload);
    const invalidKeys = FIELD_ORDER.filter((key) => errors[key]);
    if (invalidKeys.length) {
      const fieldErrors = Object.fromEntries(
        invalidKeys.map((key) => [
          key,
          errorMessage(errors[key]!, key === 'description' ? charCount(payload.description) : undefined),
        ]),
      );
      return reply(400, { ok: false, error: 'VALIDATION', fieldErrors });
    }

    const idempotencyKey =
      typeof body.idempotency_key === 'string' && IDEMPOTENCY_KEY.test(body.idempotency_key)
        ? body.idempotency_key
        : crypto.randomUUID();

    // 로컬 개발에서만: 저장 없이 흐름만 시험 (운영 빌드에서는 무시)
    if (process.env.REQUEST_DRY_RUN === '1' && process.env.NODE_ENV !== 'production') {
      console.info('[request] dry run — validated, not stored');
      return reply(200, { ok: true, receiptNo: unsavedReceiptNo(), receivedAt: kstIso() });
    }

    const endpoint = process.env.REQUEST_ENDPOINT_URL;
    const secret = process.env.REQUEST_ENDPOINT_SECRET;
    if (!endpoint || !secret) {
      console.error('[request] REQUEST_ENDPOINT_URL / REQUEST_ENDPOINT_SECRET not set');
      return reply(503, { ok: false, error: 'UNAVAILABLE' });
    }
    if (!isAllowedEndpoint(endpoint)) {
      console.error('[request] invalid endpoint');
      return reply(503, { ok: false, error: 'UNAVAILABLE' });
    }

    // 4. Apps Script로 전달 (302 뒤에 결과가 오므로 리다이렉트를 따라간다)
    try {
      const upstream = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, idempotency_key: idempotencyKey, data: payload }),
        redirect: 'follow',
        cache: 'no-store',
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });
      const data = (await upstream.json().catch(() => null)) as
        | { ok?: boolean; receipt_no?: unknown; received_at?: unknown; error?: unknown }
        | null;

      if (data?.ok === true && typeof data.receipt_no === 'string') {
        return reply(200, {
          ok: true,
          receiptNo: data.receipt_no,
          receivedAt: typeof data.received_at === 'string' ? data.received_at : kstIso(),
        });
      }

      // 개인정보는 남기지 않는다
      console.error('[request] upstream rejected', upstream.status, typeof data?.error === 'string' ? data.error : '');
      return reply(502, { ok: false, error: 'UPSTREAM' });
    } catch (error) {
      console.error('[request] upstream failed', error instanceof Error ? error.name : 'unknown');
      return reply(502, { ok: false, error: 'UPSTREAM' });
    }
  } catch (error) {
    console.error('[request] unexpected', error instanceof Error ? error.name : 'unknown');
    return reply(500, { ok: false, error: 'SERVER' });
  }
}

/** POST 말고는 받지 않는다(405 + Allow: POST) */
function methodNotAllowed() {
  return reply(405, { ok: false, error: 'METHOD_NOT_ALLOWED' }, { Allow: 'POST' });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;

/** 사전 확인 요청에는 실제로 받는 메서드만 알린다(다른 출처 허용 헤더는 주지 않는다) */
export function OPTIONS() {
  return new Response(null, { status: 204, headers: { Allow: 'POST', 'Cache-Control': 'no-store' } });
}
