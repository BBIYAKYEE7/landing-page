/**
 * U-TEED 외주 의뢰 접수: Google Apps Script 웹 앱 (V8 런타임)
 *
 * 하는 일
 *   Next.js 서버(/api/request)가 검증해서 보낸 의뢰를 받아
 *   1. 스크립트 속성 SHEET_ID가 가리키는 비공개 스프레드시트에 한 행으로 저장하고
 *   2. 운영자 메일, (선택) Slack, (선택) 의뢰자 자동 회신을 보낸다.
 *
 * 스크립트는 스프레드시트에 묶지 않은 독립 프로젝트다. 파기할 때 저장 파일을 사본으로 바꿔도
 * SHEET_ID만 고치면 되고 웹 앱 주소와 Vercel 설정은 그대로다(README '운영할 때').
 *
 * 열 이름·순서, 접수 번호 형식, 응답 형식, 항목 이름은 사이트(src/lib/request/schema.ts,
 * src/app/api/request/route.ts)와 맞춘 약속이다. 한쪽을 바꾸면 다른 쪽도 함께 고친다.
 * 설정 방법: 같은 폴더의 README.md
 *
 * 스크립트 속성 (프로젝트 설정 > 스크립트 속성)
 *   SECRET             필수. Vercel의 REQUEST_ENDPOINT_SECRET과 같은 값. 없으면 모든 요청을 거절한다.
 *   SHEET_ID           필수. 저장할 스프레드시트 ID(주소의 /d/와 /edit 사이). 주소 전체를 넣어도 된다.
 *   NOTIFY_EMAIL       운영자 알림을 받을 주소. 기본 taeho@u-teed.co.kr
 *   SLACK_WEBHOOK_URL  선택. Slack Incoming Webhook URL (https://...)
 *   AUTO_REPLY         "true"일 때만 의뢰자에게 자동 회신 메일을 보낸다. 기본 꺼짐.
 *                      켜도 하루 20통, 같은 주소에는 6시간에 1통, 남은 메일 한도가 20 이하이면 보내지 않는다.
 *   SHEET_NAME         저장할 시트(탭) 이름. 기본 "의뢰"
 *   RECEIPT_COUNTER_yyyyMMdd  스크립트가 스스로 만드는 날짜별 접수 번호 카운터. 고치거나 지우지 않는다.
 *   AUTO_REPLY_COUNTER        AUTO_REPLY를 켜면 스크립트가 스스로 만드는 그날 자동 회신 수(값 yyyyMMdd:수).
 *
 * 로그에는 접수 번호와 오류 종류만 남긴다. 제출 내용·개인정보는 시트와 알림에만 들어간다.
 * 이름이 _로 끝나는 함수는 내부용이라 편집기의 실행 목록에 나오지 않는다.
 */

var TIME_ZONE = 'Asia/Seoul';
var KST_OFFSET = '+09:00'; // Asia/Seoul은 서머타임이 없어 항상 +09:00
var DEFAULT_NOTIFY_EMAIL = 'taeho@u-teed.co.kr';
var DEFAULT_SHEET_NAME = '의뢰';
var AUTO_REPLY_SENDER_NAME = 'U-TEED';
var LOCK_WAIT_MS = 20000;
var IDEMPOTENCY_TTL_SECONDS = 600; // 10분
var IDEMPOTENCY_CACHE_PREFIX = 'idem:';
var COUNTER_PREFIX = 'RECEIPT_COUNTER_';
var MAX_BODY_CHARS = 200000; // 정상 요청(브라우저 본문 32KB 이하)보다 훨씬 크게 잡은 안전 상한

// 의뢰자 자동 회신 제한. 폼에는 누구나 남의 주소를 적을 수 있고 회신에는 제출자가 쓴 제목·설명·링크가
// 그대로 들어가므로, 우리 계정이 남의 문구를 아무에게나 대신 보내는 통로가 되지 않게 횟수를 묶는다.
var AUTO_REPLY_DAILY_MAX = 20; // 하루(KST)에 보내는 자동 회신 수 상한
var AUTO_REPLY_QUOTA_RESERVE = 20; // 메일 한도(받는 사람 수) 중 이만큼은 운영자 알림 몫으로 남긴다
var AUTO_REPLY_ADDRESS_TTL_SECONDS = 21600; // 같은 주소에는 6시간에 1통 (CacheService 최대 보관 시간)
var AUTO_REPLY_ADDRESS_PREFIX = 'autoreply:'; // 뒤에 주소의 SHA-256 값만 붙인다(주소 자체는 저장하지 않음)
var AUTO_REPLY_COUNTER_KEY = 'AUTO_REPLY_COUNTER'; // 값: 'yyyyMMdd:보낸 수'

var CATEGORY_DEV = '개발';
var CATEGORY_BIZ = '사업 문서·컨설팅';
var CATEGORY_UNSURE = '아직 모르겠어요';
var CATEGORIES = [CATEGORY_DEV, CATEGORY_BIZ, CATEGORY_UNSURE];

// 시트 열 이름·순서. 1행 헤더에 그대로 쓴다. 사이트의 항목 키(src/lib/request/schema.ts)와 같다.
var COLUMNS = [
  'receipt_no', 'received_at', 'category', 'services', 'title', 'description', 'stage', 'references',
  'platforms', 'features', 'scope', 'purpose', 'program_name', 'deadline', 'draft',
  'timeline', 'budget', 'name', 'company', 'email', 'phone', 'source'
];

// 한국어 항목명 (사이트 폼 라벨과 같다)
var LABELS = {
  category: '의뢰 분야',
  services: '세부 항목',
  title: '한 줄 소개',
  description: '자세한 내용',
  stage: '지금 준비된 것',
  references: '참고 링크',
  platforms: '사용 환경',
  features: '필요한 기능',
  scope: '맡길 범위',
  purpose: '사용 목적',
  program_name: '지원사업·대회 이름',
  deadline: '제출 마감일',
  draft: '기존 자료',
  timeline: '희망 완료 시점',
  budget: '예산 범위',
  name: '이름',
  company: '회사·소속',
  email: '이메일',
  phone: '전화번호',
  source: '알게 된 경로'
};

// 길이 상한(문자 수 = 코드포인트). 따로 정한 상한이 없는 짧은 선택값과 목록 항목은 아래 값으로 막는다.
// 목록 개수 20은 Next.js 서버(parseIncoming)가 받는 상한과 같다. 서버가 통과시킨 값을 여기서 거절하지 않는다.
var SHORT_TEXT_MAX = 100;
var LIST_ITEMS_MAX = 20;

var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9-]{8,64}$/;
var FORMULA_PREFIX_PATTERN = /^[=+\-@\t\r]/;
// 메일 제목에서 공백 하나로 바꾸는 글자: 줄바꿈(\n \r U+0085 U+2028 U+2029 등)과 다른 제어 문자.
// 일반 공백·NBSP·전각 공백 같은 띄어쓰기 글자는 넣지 않는다(제목은 {title}에 적힌 그대로).
var SUBJECT_BREAK_PATTERN = /[\x00-\x1F\x7F-\x9F\u2028\u2029]+/g;
// 메일 주소 칸(받는 사람·답장 주소)에 넣으면 주소 목록으로 잘못 읽힐 수 있는 글자
var MAIL_ADDRESS_UNSAFE_PATTERN = /[,;:<>"()\[\]\\\x00-\x1F\x7F]/;

var REPLY_PROMISE = '2영업일 안에 입력하신 이메일로 연락드립니다';

// 오류 응답 message: 내부 정보·비밀값·제출값을 담지 않는다.
var MESSAGE = {
  invalidBody: 'invalid request body',
  unauthorized: 'unauthorized',
  invalidFields: 'invalid fields: ',
  busy: 'busy, please retry',
  server: 'server error'
};

/* ------------------------------------------------------------------ */
/* 웹 앱 진입점                                                         */
/* ------------------------------------------------------------------ */

/** POST: 의뢰 접수. 항상 JSON으로 답한다(HTTP 상태는 Apps Script가 늘 200). */
function doPost(e) {
  var result;
  try {
    result = handleRequest_(e);
  } catch (err) {
    logError_('unexpected', null, err);
    result = failure_('SERVER', MESSAGE.server);
  }
  return jsonOutput_(result);
}

/** GET: 어떤 데이터도 돌려주지 않는다. 배포 확인용으로 'ok'만 보인다. */
function doGet() {
  return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
}

/**
 * 처음 한 번 편집기에서 실행한다.
 * - 실행하면 Google이 권한 승인을 요청한다(시트, 메일 보내기, 외부 요청).
 * - SECRET·SHEET_ID 속성을 확인하고, SHEET_ID 파일에 시트와 헤더 행을 만든다.
 * - 파기하며 저장 파일을 사본으로 바꾼 뒤에도 한 번 실행해 실행 로그의 '저장할 파일'로 위치를 확인한다.
 */
function setup() {
  var secret = getSetting_('SECRET');
  if (!secret) {
    throw new Error('스크립트 속성 SECRET이 없습니다. 프로젝트 설정 > 스크립트 속성에서 SECRET을 추가한 뒤 setup을 다시 실행하세요. (README 5단계)');
  }
  if (secret.length < 32) {
    console.warn('SECRET이 짧습니다(32자 미만). 터미널에서 openssl rand -hex 32 로 만든 64자 값을 쓰세요.');
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(LOCK_WAIT_MS);
  var sheet;
  try {
    sheet = getRequestSheet_();
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  var notifyEmail = getSetting_('NOTIFY_EMAIL') || DEFAULT_NOTIFY_EMAIL;
  var slackUrl = getSetting_('SLACK_WEBHOOK_URL');
  var quota = '확인하지 못함';
  try {
    quota = String(MailApp.getRemainingDailyQuota());
  } catch (err) {
    // 권한을 아직 승인하지 않았으면 여기서 실패할 수 있다. 설정 자체는 끝났다.
  }

  if (!notifyEmail.split(/[,;]/).every(function (address) { return EMAIL_PATTERN.test(address.trim()); })) {
    console.warn('NOTIFY_EMAIL 형식을 확인하세요. 여러 주소는 쉼표(,)로 구분합니다.');
  }
  if (slackUrl && !/^https:\/\//i.test(slackUrl)) {
    console.warn('SLACK_WEBHOOK_URL은 https:// 로 시작해야 합니다. 지금 값으로는 Slack 알림을 보내지 않습니다.');
  }

  console.log('준비 완료');
  console.log('- 저장할 파일: ' + sheet.getParent().getName() + ' (' + sheet.getParent().getUrl() + ')');
  console.log('- 저장할 시트: ' + sheet.getName() + ' (1행 = 열 이름)');
  console.log('- 운영자 알림 메일: ' + notifyEmail);
  console.log('- Slack 알림: ' + (slackUrl ? '켜짐' : '꺼짐'));
  console.log('- 의뢰자 자동 회신: ' + (isAutoReplyOn_() ? '켜짐' : '꺼짐'));
  console.log('- 오늘 남은 메일 발송 한도(받는 사람 수): ' + quota);
}

/* ------------------------------------------------------------------ */
/* 처리 순서                                                            */
/* ------------------------------------------------------------------ */

function handleRequest_(e) {
  // 1. JSON 파싱
  var body = parseBody_(e);
  if (!body) {
    console.warn('rejected', 'invalid_body');
    return failure_('VALIDATION', MESSAGE.invalidBody);
  }

  // 2. secret 확인 (상수 시간 비교). SECRET 속성이 없으면 모두 거절.
  if (!secretMatches_(body.secret, getSetting_('SECRET'))) {
    console.warn('rejected', 'unauthorized');
    return failure_('UNAUTHORIZED', MESSAGE.unauthorized);
  }

  // 3. 함정 필드(website)에 값이 있으면 저장하지 않고 성공처럼 답한다.
  if (isPlainObject_(body.data) && hasValue_(body.data.website)) {
    console.log('honeypot_dropped');
    return fakeSuccess_();
  }

  // 4. 최소 재검사 + 정규화(다른 분야 값은 버린다)
  var checked = validate_(body);
  if (checked.errors.length > 0) {
    console.warn('rejected', 'validation', checked.errors.join(','));
    return failure_('VALIDATION', MESSAGE.invalidFields + checked.errors.join(', '));
  }

  // 5~7. 잠금 안에서 중복 확인 → 접수 번호 발급 → 행 추가 (→ 자동 회신 몫 예약)
  var saved = saveRecord_(checked.record, checked.idempotencyKey, fingerprint_(checked.record));
  if (saved.error) return saved.error;
  if (saved.duplicate) {
    console.log('duplicate', saved.receiptNo);
    // 처음 번호를 그대로 돌려주지만, 내용이 바뀐 재전송(고쳐서 다시 보냄)은 시트에 남지 않으므로 운영자가 알 수 있게 남긴다.
    if (saved.payloadChanged) console.warn('duplicate_payload_mismatch', saved.receiptNo);
    return success_(saved.receiptNo, saved.receivedAt);
  }
  console.log('saved', saved.receiptNo);

  // 8. 잠금을 푼 뒤 알림. 알림이 실패해도 저장 성공은 그대로 둔다.
  notify_(checked.record, saved.receiptNo, saved.receivedAt, saved.autoReply);

  // 9. 결과
  return success_(saved.receiptNo, saved.receivedAt);
}

function parseBody_(e) {
  var contents = e && e.postData ? e.postData.contents : null;
  if (typeof contents !== 'string' || contents === '' || contents.length > MAX_BODY_CHARS) return null;
  try {
    var parsed = JSON.parse(contents);
    return isPlainObject_(parsed) ? parsed : null;
  } catch (err) {
    return null; // 오류 메시지에 본문 일부가 들어갈 수 있어 기록하지 않는다
  }
}

/** 비밀값 비교: 두 값을 SHA-256으로 같은 길이로 만든 뒤 모든 바이트를 끝까지 비교한다. */
function secretMatches_(provided, expected) {
  if (typeof provided !== 'string' || typeof expected !== 'string') return false;
  var expectedValue = expected.trim();
  if (expectedValue === '') return false;
  var a = sha256_(provided.trim());
  var b = sha256_(expectedValue);
  var diff = a.length ^ b.length;
  for (var i = 0; i < b.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

function sha256_(text) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8);
}

/** SHA-256 값을 16진 문자열 64자로. 개인정보 대신 이 값만 캐시에 둔다. */
function hexDigest_(text) {
  return sha256_(text).map(function (byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}

/** 정규화한 의뢰 내용의 지문. 같은 전송 키로 내용이 바뀌어 다시 왔는지 알아보는 데만 쓴다. 실패하면 ''(비교 안 함). */
function fingerprint_(record) {
  try {
    return hexDigest_(JSON.stringify(record));
  } catch (err) {
    logError_('fingerprint_failed', null, err);
    return '';
  }
}

/* ------------------------------------------------------------------ */
/* 4. 최소 재검사                                                       */
/* ------------------------------------------------------------------ */

/**
 * 필수 항목, category 값, 이메일 형식, 조건부 필수(개발: platforms·scope / 사업 문서·컨설팅: purpose),
 * 길이 상한을 확인한다. 선택지 문자열 자체는 Next.js 서버가 공유 스키마로 이미 검사했다.
 * 반환하는 record는 시트·알림에 쓸 정규화된 값이다(문자열 trim, 빈 문자열 → null, 다른 분야 값 → []/null).
 */
function validate_(body) {
  var errors = [];

  var idempotencyKey = body.idempotency_key;
  if (typeof idempotencyKey !== 'string' || !IDEMPOTENCY_KEY_PATTERN.test(idempotencyKey)) {
    addError_(errors, 'idempotency_key');
  }

  var data = body.data;
  if (!isPlainObject_(data)) {
    addError_(errors, 'data');
    return { errors: errors };
  }

  var SHORT = { max: SHORT_TEXT_MAX };
  var REQUIRED_SHORT = { required: true, max: SHORT_TEXT_MAX };
  var CHOICES = { maxItems: LIST_ITEMS_MAX, itemMax: SHORT_TEXT_MAX };
  var REQUIRED_CHOICES = { required: true, maxItems: LIST_ITEMS_MAX, itemMax: SHORT_TEXT_MAX };

  var record = {};
  record.category = readText_(data, 'category', errors, REQUIRED_SHORT);
  if (record.category !== null && CATEGORIES.indexOf(record.category) === -1) addError_(errors, 'category');
  var isDev = record.category === CATEGORY_DEV;
  var isBiz = record.category === CATEGORY_BIZ;

  // 세부 항목은 분야를 고른 경우에만 받는다. '아직 모르겠어요'면 [].
  record.services = isDev || isBiz ? readList_(data, 'services', errors, REQUIRED_CHOICES) : [];
  record.title = readText_(data, 'title', errors, { required: true, max: 60 });
  record.description = readText_(data, 'description', errors, { required: true, max: 5000 });
  record.stage = readText_(data, 'stage', errors, REQUIRED_SHORT);
  record.references = readList_(data, 'references', errors, { maxItems: 3, itemMax: 2000 });

  // 분야별 추가 질문: 선택한 분야 것만 받고, 다른 분야 값은 버린다.
  record.platforms = isDev ? readList_(data, 'platforms', errors, REQUIRED_CHOICES) : [];
  record.features = isDev ? readList_(data, 'features', errors, CHOICES) : [];
  record.scope = isDev ? readList_(data, 'scope', errors, REQUIRED_CHOICES) : [];
  record.purpose = isBiz ? readText_(data, 'purpose', errors, REQUIRED_SHORT) : null;
  record.program_name = isBiz ? readText_(data, 'program_name', errors, { max: 100 }) : null;
  record.deadline = isBiz ? readText_(data, 'deadline', errors, SHORT) : null;
  record.draft = isBiz ? readText_(data, 'draft', errors, SHORT) : null;

  record.timeline = readText_(data, 'timeline', errors, REQUIRED_SHORT);
  record.budget = readText_(data, 'budget', errors, REQUIRED_SHORT);
  record.name = readText_(data, 'name', errors, { required: true, max: 50 });
  record.company = readText_(data, 'company', errors, { max: 100 });
  record.email = readText_(data, 'email', errors, { required: true, max: 254 });
  if (record.email !== null && !EMAIL_PATTERN.test(record.email)) addError_(errors, 'email');
  record.phone = readText_(data, 'phone', errors, SHORT);
  record.source = readText_(data, 'source', errors, SHORT);

  return { errors: errors, record: record, idempotencyKey: idempotencyKey };
}

/** 문자열 항목: trim, 빈 문자열은 null. 문자열이 아니면 오류. */
function readText_(source, key, errors, rule) {
  var value = source[key];
  if (value === undefined || value === null) value = '';
  if (typeof value !== 'string') {
    addError_(errors, key);
    return null;
  }
  value = value.trim();
  if (value === '') {
    if (rule.required) addError_(errors, key);
    return null;
  }
  if (charLength_(value) > rule.max) addError_(errors, key);
  return value;
}

/** 목록 항목: 문자열 배열만. 항목은 trim, 빈 항목은 뺀다. */
function readList_(source, key, errors, rule) {
  var value = source[key];
  if (value === undefined || value === null) value = [];
  if (!Array.isArray(value)) {
    addError_(errors, key);
    return [];
  }
  var items = [];
  for (var i = 0; i < value.length; i++) {
    if (typeof value[i] !== 'string') {
      addError_(errors, key);
      return [];
    }
    var item = value[i].trim();
    if (item === '') continue;
    if (charLength_(item) > rule.itemMax) addError_(errors, key);
    items.push(item);
  }
  if (items.length > rule.maxItems) addError_(errors, key);
  if (rule.required && items.length === 0) addError_(errors, key);
  return items;
}

function addError_(errors, key) {
  if (errors.indexOf(key) === -1) errors.push(key);
}

/** 문자 수 = 코드포인트 수 (사이트의 [...s].length와 같다) */
function charLength_(text) {
  return Array.from(text).length;
}

/* ------------------------------------------------------------------ */
/* 5~7. 잠금, 중복 확인, 접수 번호, 시트 저장                            */
/* ------------------------------------------------------------------ */

function saveRecord_(record, idempotencyKey, fingerprint) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(LOCK_WAIT_MS);
  } catch (err) {
    logError_('lock_timeout', null, err);
    return { error: failure_('SERVER', MESSAGE.busy) };
  }

  var receiptNo = null;
  try {
    // 같은 idempotency_key가 10분 안에 다시 오면 처음 번호를 그대로 돌려준다(잠금 안에서 확인).
    var cache = scriptCache_();
    var previous = recallReceipt_(cache, idempotencyKey);
    if (previous) {
      return { duplicate: true, receiptNo: previous.receipt_no, receivedAt: previous.received_at,
        payloadChanged: Boolean(fingerprint && previous.fingerprint && previous.fingerprint !== fingerprint) };
    }

    var sheet = getRequestSheet_();
    var stamp = kstStamp_(new Date());
    receiptNo = issueReceiptNo_(stamp.day);
    appendRow_(sheet, buildRow_(receiptNo, stamp.iso, record));
    SpreadsheetApp.flush(); // 잠금을 풀기 전에 시트 변경을 확정한다
    rememberReceipt_(cache, idempotencyKey, receiptNo, stamp.iso, fingerprint);
    // 자동 회신 횟수는 동시에 들어온 요청이 함께 상한을 넘지 않게 잠금 안에서 센다. 보내는 일은 잠금을 푼 뒤에 한다.
    var autoReply = reserveAutoReply_(cache, record.email, stamp.day, receiptNo);
    return { duplicate: false, receiptNo: receiptNo, receivedAt: stamp.iso, autoReply: autoReply };
  } catch (err) {
    logError_('save_failed', receiptNo, err);
    return { error: failure_('SERVER', MESSAGE.server) };
  } finally {
    lock.releaseLock();
  }
}

function scriptCache_() {
  try {
    return CacheService.getScriptCache();
  } catch (err) {
    logError_('idempotency_cache_unavailable', null, err);
    return null;
  }
}

function recallReceipt_(cache, idempotencyKey) {
  if (!cache) return null;
  try {
    var raw = cache.get(IDEMPOTENCY_CACHE_PREFIX + idempotencyKey);
    if (!raw) return null;
    var saved = JSON.parse(raw);
    if (saved && typeof saved.receipt_no === 'string' && typeof saved.received_at === 'string') return saved;
  } catch (err) {
    logError_('idempotency_read_failed', null, err);
  }
  return null;
}

function rememberReceipt_(cache, idempotencyKey, receiptNo, receivedAt, fingerprint) {
  if (!cache) return;
  try {
    cache.put(
      IDEMPOTENCY_CACHE_PREFIX + idempotencyKey,
      JSON.stringify({ receipt_no: receiptNo, received_at: receivedAt, fingerprint: fingerprint }),
      IDEMPOTENCY_TTL_SECONDS
    );
  } catch (err) {
    logError_('idempotency_write_failed', receiptNo, err);
  }
}

/**
 * 자동 회신을 보내도 되는지 정하고 그 몫을 센다. saveRecord_가 잠금 안에서, 저장을 마친 뒤 부른다.
 * 반환: AUTO_REPLY가 꺼져 있으면 null, 아니면 { send: true } 또는 { send: false, reason: 건너뛴 이유 }.
 *   unsupported_address  주소 목록으로 잘못 읽힐 글자가 있음
 *   recently_sent        같은 주소(대소문자 무시)로 6시간 안에 이미 보냄
 *   daily_limit          오늘(KST) AUTO_REPLY_DAILY_MAX통을 다 보냄
 *   limit_unavailable    캐시·속성을 쓰지 못해 제한을 확인할 수 없음(이때는 보내지 않는다)
 * 남은 메일 한도는 운영자 메일이 나간 뒤에 sendAutoReply_가 확인한다.
 * 여기서 난 오류는 밖으로 내보내지 않는다(이미 저장한 의뢰를 실패로 돌리지 않게).
 */
function reserveAutoReply_(cache, email, day, receiptNo) {
  try {
    if (!isAutoReplyOn_()) return null;
    if (!isMailSafeAddress_(email)) return { send: false, reason: 'unsupported_address' };
    if (!cache) return { send: false, reason: 'limit_unavailable' };
    var addressKey = AUTO_REPLY_ADDRESS_PREFIX + hexDigest_(email.toLowerCase());
    if (cache.get(addressKey)) return { send: false, reason: 'recently_sent' };
    var properties = PropertiesService.getScriptProperties();
    var sent = autoRepliesSentOn_(properties.getProperty(AUTO_REPLY_COUNTER_KEY), day);
    if (sent >= AUTO_REPLY_DAILY_MAX) return { send: false, reason: 'daily_limit' };
    properties.setProperty(AUTO_REPLY_COUNTER_KEY, day + ':' + (sent + 1));
    cache.put(addressKey, '1', AUTO_REPLY_ADDRESS_TTL_SECONDS);
    return { send: true };
  } catch (err) {
    logError_('auto_reply_limit_failed', receiptNo, err);
    return { send: false, reason: 'limit_unavailable' };
  }
}

/** AUTO_REPLY_COUNTER 값('yyyyMMdd:수')에서 그날 보낸 수. 다른 날짜이거나 형식이 다르면 0. */
function autoRepliesSentOn_(stored, day) {
  var match = /^(\d{8}):(\d{1,9})$/.exec(stored === null || stored === undefined ? '' : String(stored));
  return match && match[1] === day ? parseInt(match[2], 10) : 0;
}

/** 한국 시간 기준 날짜(yyyyMMdd)와 ISO 8601 시각(+09:00) */
function kstStamp_(date) {
  return {
    day: Utilities.formatDate(date, TIME_ZONE, 'yyyyMMdd'),
    iso: Utilities.formatDate(date, TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ss") + KST_OFFSET
  };
}

/**
 * UT-yyyyMMdd-NNNN. 그날 첫 건이 0001, 9999를 넘으면 자릿수가 늘어난다.
 * 카운터는 날짜별 스크립트 속성에 둔다. 반드시 잠금 안에서 부른다.
 * 실패한 저장이 번호를 써 버리면 번호가 비지만, 같은 번호가 두 번 나가지는 않는다.
 */
function issueReceiptNo_(day) {
  var properties = PropertiesService.getScriptProperties();
  var key = COUNTER_PREFIX + day;
  var stored = properties.getProperty(key);
  if (stored === null) removeOldCounters_(properties, day); // 그날 첫 건일 때 지난 날짜 카운터를 지운다
  var last = parseInt(stored, 10);
  var next = (last > 0 ? last : 0) + 1;
  properties.setProperty(key, String(next));
  return 'UT-' + day + '-' + padSequence_(next);
}

function removeOldCounters_(properties, today) {
  try {
    properties.getKeys().forEach(function (key) {
      if (key.indexOf(COUNTER_PREFIX) !== 0) return;
      var day = key.slice(COUNTER_PREFIX.length);
      if (/^\d{8}$/.test(day) && day < today) properties.deleteProperty(key);
    });
  } catch (err) {
    logError_('counter_cleanup_failed', null, err);
  }
}

function padSequence_(sequence) {
  var text = String(sequence);
  while (text.length < 4) text = '0' + text;
  return text;
}

function getRequestSheet_() {
  var spreadsheet = openSpreadsheet_();
  var name = getSetting_('SHEET_NAME') || DEFAULT_SHEET_NAME;
  var sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  ensureHeader_(sheet);
  return sheet;
}

/**
 * 저장할 스프레드시트: 스크립트 속성 SHEET_ID. ID 대신 주소(https://docs.google.com/spreadsheets/d/…/edit)를 넣어도 연다.
 * 파기할 때 파일을 사본으로 바꾸면(README '운영할 때') 이 값만 고친다. 웹 앱 주소와 Vercel 설정은 그대로다.
 * 열지 못하면 실행 기록에 sheet_open_failed를 남긴다(README '문제가 생겼을 때').
 */
function openSpreadsheet_() {
  var value = getSetting_('SHEET_ID');
  if (!value) {
    console.error('sheet_open_failed', '-', 'missing_sheet_id');
    throw new Error('스크립트 속성 SHEET_ID가 없습니다. 의뢰를 저장할 스프레드시트 주소에서 /d/와 /edit 사이 값을 SHEET_ID로 넣으세요. (README 5단계)');
  }
  // 주소면 /d/ 뒤의 ID만 쓴다(여러 계정에 로그인하면 /spreadsheets/u/1/d/… 꼴도 나온다)
  var fromUrl = value.match(/\/d\/([A-Za-z0-9_-]+)/);
  try {
    return SpreadsheetApp.openById(fromUrl ? fromUrl[1] : value);
  } catch (err) {
    logError_('sheet_open_failed', null, err);
    throw new Error('SHEET_ID로 스프레드시트를 열지 못했습니다. 값이 맞는지, 이 Google 계정이 그 파일을 편집할 수 있는지 확인하세요. (README 5단계)');
  }
}

/** 1행이 비어 있으면 헤더를 쓴다. 이미 무언가 있으면(이름을 바꿨더라도) 건드리지 않는다. */
function ensureHeader_(sheet) {
  ensureColumns_(sheet, COLUMNS.length);
  if (sheet.getLastRow() > 0) {
    var firstRow = sheet.getRange(1, 1, 1, COLUMNS.length).getValues()[0];
    for (var i = 0; i < firstRow.length; i++) {
      if (firstRow[i] !== '' && firstRow[i] !== null) return;
    }
  }
  var header = sheet.getRange(1, 1, 1, COLUMNS.length);
  header.setNumberFormat('@');
  header.setValues([COLUMNS.slice()]);
  header.setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function ensureColumns_(sheet, count) {
  var maxColumns = sheet.getMaxColumns();
  if (maxColumns < count) sheet.insertColumnsAfter(maxColumns, count - maxColumns);
}

function appendRow_(sheet, cells) {
  var row = nextRow_(sheet);
  var maxRows = sheet.getMaxRows();
  if (row > maxRows) sheet.insertRowsAfter(maxRows, row - maxRows);
  var range = sheet.getRange(row, 1, 1, cells.length);
  // 일반 텍스트 서식: 010으로 시작하는 전화번호의 0, 날짜처럼 보이는 값이 바뀌지 않고 쓴 그대로 남는다.
  range.setNumberFormat('@');
  range.setValues([cells]);
}

/**
 * 새 의뢰를 쓸 행: A열(receipt_no)에 값이 있는 마지막 행 바로 아래.
 * 시트 전체의 마지막 행(getLastRow)을 쓰지 않는 까닭: 운영자가 W열부터 더한 체크박스는 빈 칸도 FALSE 값이 있고
 * 아래로 채워 둔 수식도 내용으로 세어진다. 그런 열이 1000행까지 있으면 새 의뢰가 1001행으로 내려간다.
 * 그 행의 A~V열에 이미 무언가 있으면(손으로 적은 메모 등) 덮어쓰지 않도록 시트 전체의 마지막 행 아래에 쓴다.
 */
function nextRow_(sheet) {
  var lastRow = sheet.getLastRow();
  var next = 2; // 1행은 헤더
  if (lastRow >= 2) {
    var receipts = sheet.getRange(1, 1, lastRow, 1).getValues(); // receipts[i]는 i + 1행
    for (var i = receipts.length - 1; i >= 1; i--) {
      if (hasCellValue_(receipts[i][0])) {
        next = i + 2;
        break;
      }
    }
  }
  if (next > lastRow) return next; // 그 아래로는 어느 열에도 내용이 없다
  var cells = sheet.getRange(next, 1, 1, COLUMNS.length).getValues()[0];
  return cells.some(hasCellValue_) ? lastRow + 1 : next;
}

/** 셀에 내용이 있는지. 체크박스의 FALSE도 내용이다(Sheets의 getLastRow와 같은 기준). */
function hasCellValue_(value) {
  return value !== '' && value !== null && value !== undefined;
}

function buildRow_(receiptNo, receivedAt, record) {
  return COLUMNS.map(function (column) {
    if (column === 'receipt_no') return toCell_(receiptNo);
    if (column === 'received_at') return toCell_(receivedAt);
    return toCell_(record[column]);
  });
}

/** 셀 값: null은 빈 칸, 배열은 ', '로 잇고, = + - @ 탭 CR로 시작하면 앞에 '를 붙여 수식 실행을 막는다. */
function toCell_(value) {
  if (value === null || value === undefined) return '';
  var text = Array.isArray(value) ? value.join(', ') : String(value);
  return FORMULA_PREFIX_PATTERN.test(text) ? "'" + text : text;
}

/* ------------------------------------------------------------------ */
/* 8. 알림                                                              */
/* ------------------------------------------------------------------ */

/** autoReply: saveRecord_가 잠금 안에서 정한 자동 회신 몫(reserveAutoReply_의 반환값). null이면 AUTO_REPLY 꺼짐. */
function notify_(record, receiptNo, receivedAt, autoReply) {
  var notifyEmail, slackUrl, subject, body;
  try {
    notifyEmail = getSetting_('NOTIFY_EMAIL') || DEFAULT_NOTIFY_EMAIL;
    slackUrl = getSetting_('SLACK_WEBHOOK_URL');
    subject = operatorSubject_(record);
    body = operatorBody_(record, receiptNo, receivedAt);
  } catch (err) {
    logError_('notify_prepare_failed', receiptNo, err);
    return;
  }

  attemptNotification_('operator_email', receiptNo, function () {
    sendOperatorEmail_(notifyEmail, record.email, subject, body, receiptNo);
  });
  if (slackUrl) {
    attemptNotification_('slack', receiptNo, function () {
      postToSlack_(slackUrl, subject + '\n\n' + body, receiptNo);
    });
  }
  if (autoReply && !autoReply.send) {
    console.warn('notify_skipped', 'auto_reply', receiptNo, autoReply.reason);
  } else if (autoReply) {
    attemptNotification_('auto_reply', receiptNo, function () {
      sendAutoReply_(notifyEmail, record, receiptNo);
    });
  }
}

function attemptNotification_(channel, receiptNo, send) {
  try {
    send();
  } catch (err) {
    console.error('notify_failed', channel, receiptNo, failureKind_(channel, err));
  }
}

/** 운영자 메일: 받는 사람 NOTIFY_EMAIL, 답장 주소 = 의뢰자 이메일, 일반 텍스트. */
function sendOperatorEmail_(to, requesterEmail, subject, body, receiptNo) {
  var message = { to: to, subject: subject, body: body };
  if (isMailSafeAddress_(requesterEmail)) message.replyTo = requesterEmail;
  try {
    MailApp.sendEmail(message);
  } catch (err) {
    var kind = failureKind_('operator_email', err);
    if (!message.replyTo || kind === 'mail_quota_exhausted') throw err;
    // 답장 주소 때문에 거절됐을 수 있으니 한 번만 답장 주소 없이 다시 보낸다(본문에 이메일이 있다).
    console.error('notify_failed', 'operator_email', receiptNo, kind, 'retry_without_reply_to');
    delete message.replyTo;
    MailApp.sendEmail(message);
  }
}

/** Slack: 같은 요약을 text로 보낸다. & < > 는 Slack 규칙대로 이스케이프(멘션·링크 주입 방지). */
function postToSlack_(url, text, receiptNo) {
  if (!/^https:\/\//i.test(url)) {
    console.error('notify_failed', 'slack', receiptNo, 'invalid_webhook_url');
    return;
  }
  var response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ text: escapeSlack_(text), unfurl_links: false, unfurl_media: false }),
    muteHttpExceptions: true
  });
  var code = response.getResponseCode();
  if (code < 200 || code >= 300) console.error('notify_failed', 'slack', receiptNo, 'http_' + code);
}

/**
 * 의뢰자 자동 회신(AUTO_REPLY가 true이고 reserveAutoReply_가 몫을 준 때만): 보내는 이름 U-TEED, 답장 주소 NOTIFY_EMAIL.
 * 운영자 메일이 먼저 나간 뒤에 부른다. 보내고 나서 남을 한도가 AUTO_REPLY_QUOTA_RESERVE보다 적어지면 보내지 않는다.
 */
function sendAutoReply_(notifyEmail, record, receiptNo) {
  if (!isMailSafeAddress_(record.email)) {
    console.warn('notify_skipped', 'auto_reply', receiptNo, 'unsupported_address');
    return;
  }
  if (MailApp.getRemainingDailyQuota() <= AUTO_REPLY_QUOTA_RESERVE) {
    console.warn('notify_skipped', 'auto_reply', receiptNo, 'quota_reserved');
    return;
  }
  var message = {
    to: record.email,
    subject: autoReplySubject_(receiptNo),
    body: autoReplyBody_(record, receiptNo),
    name: AUTO_REPLY_SENDER_NAME
  };
  var replyTo = firstAddress_(notifyEmail);
  if (replyTo) message.replyTo = replyTo;
  MailApp.sendEmail(message);
}

function operatorSubject_(record) {
  return singleLine_('[의뢰 접수] ' + singleLine_(record.title) + ' / ' + singleLine_(record.category) + ' / ' + singleLine_(record.budget));
}

/** 접수 번호, 접수 시각, 이름·회사·이메일·전화, 이어서 1~3단계 전체 응답. */
function operatorBody_(record, receiptNo, receivedAt) {
  var lines = [
    '접수 번호: ' + receiptNo,
    '접수 시각: ' + displayTime_(receivedAt),
    answerLine_(record, 'name'),
    answerLine_(record, 'company'),
    answerLine_(record, 'email'),
    answerLine_(record, 'phone'),
    ''
  ];
  return lines.concat(answerLines_(record)).join('\n');
}

function autoReplySubject_(receiptNo) {
  return '[U-TEED] 의뢰가 접수됐습니다 (' + receiptNo + ')';
}

function autoReplyBody_(record, receiptNo) {
  var lines = [
    '의뢰가 접수됐습니다',
    '',
    '접수 번호: ' + receiptNo,
    '',
    REPLY_PROMISE,
    '',
    '제출 내용 사본',
    ''
  ];
  return lines.concat(answerLines_(record)).join('\n');
}

/** 1~3단계 응답을 '항목명: 값' 줄로. 선택한 분야의 질문만 넣는다. */
function answerLines_(record) {
  var lines = [];
  stepsFor_(record.category).forEach(function (step, index) {
    if (index > 0) lines.push('');
    lines.push(step.heading);
    step.keys.forEach(function (key) {
      lines.push(answerLine_(record, key));
    });
  });
  return lines;
}

function stepsFor_(category) {
  var first = ['category'];
  if (category !== CATEGORY_UNSURE) first.push('services');
  first.push('title', 'description', 'stage', 'references');
  if (category === CATEGORY_DEV) first.push('platforms', 'features', 'scope');
  if (category === CATEGORY_BIZ) first.push('purpose', 'program_name', 'deadline', 'draft');
  return [
    { heading: '[1단계] 어떤 일인가요', keys: first },
    { heading: '[2단계] 일정과 예산', keys: ['timeline', 'budget'] },
    { heading: '[3단계] 연락처', keys: ['name', 'company', 'email', 'phone', 'source'] }
  ];
}

function answerLine_(record, key) {
  return LABELS[key] + ': ' + displayValue_(record[key]);
}

/** 값 없는 선택 항목은 '-' */
function displayValue_(value) {
  if (value === null || value === undefined) return '-';
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '-';
  var text = String(value);
  return text === '' ? '-' : text;
}

/** '2026-11-05T14:03:00+09:00' → '2026-11-05 14:03 (KST)' */
function displayTime_(iso) {
  return iso.slice(0, 10) + ' ' + iso.slice(11, 16) + ' (KST)';
}

/**
 * 메일 제목용(제목의 줄바꿈 제거): 줄바꿈과 다른 제어 문자가 이어진 곳마다 공백 하나로 바꿔 한 줄로 만든다.
 * 그 밖의 글자는 바꾸지 않는다. 제목 안의 연속 공백·NBSP·전각 공백도 {title}에 적힌 그대로 둔다.
 */
function singleLine_(value) {
  var text = value === null || value === undefined ? '' : String(value);
  return text.replace(SUBJECT_BREAK_PATTERN, ' ').trim();
}

function escapeSlack_(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isMailSafeAddress_(address) {
  return typeof address === 'string' && EMAIL_PATTERN.test(address) && !MAIL_ADDRESS_UNSAFE_PATTERN.test(address);
}

function firstAddress_(list) {
  var first = String(list || '').split(/[,;]/)[0];
  return first ? first.trim() : '';
}

function isAutoReplyOn_() {
  return getSetting_('AUTO_REPLY').toLowerCase() === 'true';
}

/* ------------------------------------------------------------------ */
/* 공통                                                                 */
/* ------------------------------------------------------------------ */

function getSetting_(key) {
  var value = PropertiesService.getScriptProperties().getProperty(key);
  return value === null || value === undefined ? '' : String(value).trim();
}

function isPlainObject_(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasValue_(value) {
  if (value === undefined || value === null || value === false) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/** 함정 필드용 가짜 성공: 형식만 맞는 번호. 카운터·시트·캐시는 건드리지 않는다. */
function fakeSuccess_() {
  var stamp = kstStamp_(new Date());
  var sequence = 1 + Math.floor(Math.random() * 9999);
  return success_('UT-' + stamp.day + '-' + padSequence_(sequence), stamp.iso);
}

function success_(receiptNo, receivedAt) {
  return { ok: true, receipt_no: receiptNo, received_at: receivedAt };
}

function failure_(code, message) {
  return { ok: false, error: code, message: message };
}

function jsonOutput_(result) {
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

/** 메일 한도 소진 여부는 메시지(언어·주소가 섞일 수 있음) 대신 남은 한도로 판단한다. */
function failureKind_(channel, err) {
  if (channel !== 'slack' && mailQuotaExhausted_()) return 'mail_quota_exhausted';
  return errorName_(err);
}

function mailQuotaExhausted_() {
  try {
    return MailApp.getRemainingDailyQuota() <= 0;
  } catch (err) {
    return false;
  }
}

/** 오류 이름만 남긴다. 메시지에는 주소·본문 같은 제출값이 섞일 수 있다. */
function errorName_(err) {
  var name = err && err.name;
  return typeof name === 'string' && /^[A-Za-z]{1,40}$/.test(name) ? name : 'Error';
}

function logError_(stage, receiptNo, err) {
  console.error(stage, receiptNo || '-', errorName_(err));
}
