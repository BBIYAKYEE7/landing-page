'use client';

import Link from 'next/link';
import { forwardRef, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { company } from '@/content/site';
import { errorMessage, requestCopy } from '@/content/request';
import {
  BUDGET_OPTIONS,
  CATEGORY_DEV,
  CATEGORY_DOCS,
  CATEGORY_OPTIONS,
  DRAFT_OPTIONS,
  EMPTY_DRAFT,
  FEATURE_OPTIONS,
  FEATURE_UNSURE,
  FIELD_HELP,
  FIELD_LABELS,
  FIELD_ORDER,
  FIELD_PLACEHOLDER,
  FIELD_STEP,
  LIMITS,
  PLATFORM_OPTIONS,
  PURPOSE_OPTIONS,
  SCOPE_OPTIONS,
  SERVICE_OPTIONS,
  SOURCE_OPTIONS,
  STAGE_OPTIONS,
  TIMELINE_OPTIONS,
  charCount,
  cleanLine,
  cleanText,
  draftToPayload,
  firstErrorField,
  formatValue,
  isServiceCategory,
  isValidUrl,
  normalizeUrl,
  validatePayload,
  type Category,
  type FieldKey,
  type RequestDraft,
  type RequestPayload,
  type ServiceCategory,
} from '@/lib/request/schema';
import { tidy } from '@/lib/typography';
import { ChipGroup, RadioGroup, ReferencesField, SelectCards, SelectField, TextArea, TextField } from './Fields';
import styles from './RequestForm.module.css';

type Step = 1 | 2 | 3;
type Failure = 'network' | 'unavailable' | 'server';
type Done = { receiptNo: string; payload: RequestPayload };

const TOTAL_STEPS = 3;
const STORAGE_KEY = 'uteed-request-draft-v1';
/** 같은 탭 임시 보관 유효 시간(공용 PC에 오래 남지 않게) */
const DRAFT_TTL_MS = 60 * 60 * 1000;
/** 단계가 바뀐 직후의 연속 탭이 새 단계의 버튼으로 들어가지 않게 */
const STEP_CHANGE_GUARD_MS = 700;
const IDEMPOTENCY_KEY_RE = /^[A-Za-z0-9-]{8,64}$/;
/** 메일 앱의 mailto 주소 길이 한도(일부 앱 약 2,000자)를 넘지 않게 본문을 간추린다. 한글은 인코딩하면 글자당 9자 */
const MAILTO_MAX = 1900;
/** 길이를 넘으면 이 순서로 줄여 본다: 항목 수를 줄이고, '자세한 내용'을 더 짧게 자른다 */
const MAIL_PRIORITY: readonly FieldKey[] = ['title', 'category', 'services', 'description', 'timeline', 'budget', 'name', 'email', 'phone'];
const MAIL_ESSENTIAL: readonly FieldKey[] = ['title', 'description', 'name', 'email', 'phone'];
const MAIL_PLANS: readonly { keys: readonly FieldKey[]; description: number; value: number }[] = [
  { keys: FIELD_ORDER, description: 120, value: 80 },
  { keys: MAIL_PRIORITY, description: 80, value: 60 },
  { keys: MAIL_PRIORITY, description: 40, value: 40 },
  { keys: MAIL_ESSENTIAL, description: 30, value: 40 },
];

/* ── 도우미 ─────────────────────────────────────────────── */

function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
}

/** 옵션 순서를 지키며 켜고 끈다 */
function toggleIn(list: readonly string[], value: string, options: readonly string[]): string[] {
  const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  return options.filter((option) => next.includes(option));
}

/** '잘 모르겠어요'는 다른 기능과 함께 고를 수 없다 */
function toggleFeature(list: readonly string[], value: string): string[] {
  if (value === FEATURE_UNSURE) return list.includes(value) ? [] : [FEATURE_UNSURE];
  return toggleIn(
    list.filter((v) => v !== FEATURE_UNSURE),
    value,
    FEATURE_OPTIONS,
  );
}

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');
const asStrings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];

/** sessionStorage에서 읽은 값을 폼 상태 모양으로 맞춘다 */
function restoreDraft(raw: unknown): RequestDraft {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const services = (o.services && typeof o.services === 'object' ? o.services : {}) as Record<string, unknown>;
  const category = asString(o.category);
  const references = asStrings(o.references).slice(0, LIMITS.referencesMax);
  return {
    ...EMPTY_DRAFT,
    category: (CATEGORY_OPTIONS as readonly string[]).includes(category) ? (category as Category) : '',
    services: {
      [CATEGORY_DEV]: asStrings(services[CATEGORY_DEV]),
      [CATEGORY_DOCS]: asStrings(services[CATEGORY_DOCS]),
    },
    title: asString(o.title),
    description: asString(o.description),
    stage: asString(o.stage),
    references: references.length ? references : [''],
    platforms: asStrings(o.platforms),
    features: asStrings(o.features),
    scope: asStrings(o.scope),
    purpose: asString(o.purpose),
    program_name: asString(o.program_name),
    deadline: asString(o.deadline),
    draft: asString(o.draft),
    timeline: asString(o.timeline),
    budget: asString(o.budget),
    name: asString(o.name),
    company: asString(o.company),
    email: asString(o.email),
    phone: asString(o.phone),
    source: asString(o.source),
  };
}

const clip = (value: string, max: number) =>
  charCount(value) > max ? `${Array.from(value).slice(0, max).join('')}…` : value;

/** 실패했을 때 이메일로 보낼 수 있게 입력 내용을 간추린 mailto 주소. 길면 단계적으로 줄인다(자세한 내용은 끝까지 남긴다) */
function mailtoHref(payload: RequestPayload): string {
  const build = (plan: (typeof MAIL_PLANS)[number]) => {
    const lines: string[] = [];
    for (const key of plan.keys) {
      const value = formatValue(payload, key);
      if (!value) continue;
      lines.push(`${FIELD_LABELS[key]}: ${clip(value, key === 'description' ? plan.description : plan.value)}`);
    }
    const subject = encodeURIComponent(clip(requestCopy.mailSubject(payload.title), plan.value));
    return `mailto:${company.email}?subject=${subject}&body=${encodeURIComponent(lines.join('\n'))}`;
  };
  for (const plan of MAIL_PLANS) {
    const href = build(plan);
    if (href.length <= MAILTO_MAX) return href;
  }
  return `mailto:${company.email}`;
}

type Saved = { draft?: unknown; step?: unknown; key?: unknown; fingerprint?: unknown; savedAt?: unknown };

/* ── 폼 ─────────────────────────────────────────────────── */

export default function RequestForm() {
  const [draft, setDraft] = useState<RequestDraft>(EMPTY_DRAFT);
  const [step, setStep] = useState<Step>(1);
  const [attempted, setAttempted] = useState<Record<Step, boolean>>({ 1: false, 2: false, 3: false });
  const [serverErrors, setServerErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [focusTarget, setFocusTarget] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [restored, setRestored] = useState(false);
  const idempotencyKey = useRef('');
  /** 마지막으로 보낸 내용. 내용이 바뀌면 새 멱등 키를 쓴다(같은 내용 재시도만 중복 방지) */
  const lastFingerprint = useRef<string | null>(null);
  const inFlight = useRef(false);
  const failureRef = useRef<HTMLDivElement>(null);
  const previousStep = useRef<Step>(1);
  const stepChangedAt = useRef(0);
  const announceTimer = useRef<number | undefined>(undefined);

  // 같은 탭에서 새로고침·뒤로 가기를 해도 입력값을 잃지 않게. 제출에 성공하거나 60분이 지나면 지운다
  useEffect(() => {
    let key = '';
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null') as Saved | null;
      const fresh = saved && typeof saved.savedAt === 'number' && Date.now() - saved.savedAt < DRAFT_TTL_MS;
      if (saved && fresh) {
        setDraft(restoreDraft(saved.draft));
        if (saved.step === 1 || saved.step === 2 || saved.step === 3) setStep(saved.step);
        if (typeof saved.key === 'string' && IDEMPOTENCY_KEY_RE.test(saved.key)) key = saved.key;
        if (typeof saved.fingerprint === 'string') lastFingerprint.current = saved.fingerprint;
      } else if (saved) {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // 저장소를 쓸 수 없으면 빈 폼으로 시작한다
    }
    idempotencyKey.current = key || newIdempotencyKey();
    setRestored(true);
  }, []);

  /** 초안·단계·멱등 키·마지막으로 보낸 내용의 지문을 같은 탭 저장소에 쓴다 */
  function persist(current: { draft: RequestDraft; step: Step }) {
    try {
      const saved: Saved = {
        draft: current.draft,
        step: current.step,
        key: idempotencyKey.current,
        fingerprint: lastFingerprint.current,
        savedAt: Date.now(),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // 저장 실패는 무시한다(입력은 화면 상태에 남아 있다)
    }
  }

  useEffect(() => {
    if (!restored || done) return;
    persist({ draft, step });
    // persist는 매 렌더 새로 만들어지지만 저장할 값은 draft·step뿐이다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, step, restored, done]);

  useEffect(() => {
    document.title = done
      ? `${requestCopy.complete.title} | U-TEED`
      : `${requestCopy.h1} ${step}/${TOTAL_STEPS} | U-TEED`;
  }, [step, done]);

  // 단계가 바뀌면 이전 알림을 지운다
  useEffect(() => {
    if (previousStep.current !== step) {
      previousStep.current = step;
      setAnnouncement('');
    }
  }, [step]);

  /** 단계를 바꾸며 그 시각을 바로 적어 둔다(연속 탭 방지: 렌더를 기다리지 않는다) */
  function changeStep(next: Step) {
    stepChangedAt.current = performance.now();
    setStep(next);
  }

  useEffect(() => () => window.clearTimeout(announceTimer.current), []);

  // 렌더 뒤 포커스 이동: 단계 제목, 첫 오류 항목, 완료 제목
  useEffect(() => {
    if (!focusTarget) return;
    const frame = requestAnimationFrame(() => {
      let element: HTMLElement | null = null;
      if (focusTarget.startsWith('field:')) {
        const key = focusTarget.slice('field:'.length);
        const container = document.querySelector<HTMLElement>(`[data-field="${key}"]`);
        element =
          container?.querySelector<HTMLElement>('[aria-invalid="true"]') ??
          container?.querySelector<HTMLElement>('input:checked') ??
          container?.querySelector<HTMLElement>('input, textarea, select') ??
          null;
        // 라벨·오류 문구까지 보이게 항목 묶음을 화면 가운데로 옮긴 뒤, 포커스는 스크롤 없이 준다(고정 헤더에 가리지 않게)
        container?.scrollIntoView({ block: 'center' });
        element?.focus({ preventScroll: true });
      } else {
        element = document.getElementById(focusTarget);
        element?.focus();
      }
      setFocusTarget(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [focusTarget, step, done]);

  const payload = useMemo(() => draftToPayload(draft), [draft]);
  const localErrors = useMemo(() => validatePayload(payload), [payload]);
  const referenceValidity = draft.references.map((value) => !value.trim() || isValidUrl(normalizeUrl(value)));

  /** 화면에 보일 오류 문구. 단계에서 '다음'·'보내기'를 누른 뒤부터 보인다 */
  function messageFor(key: FieldKey): string | null {
    if (serverErrors[key]) return serverErrors[key] ?? null;
    if (!attempted[FIELD_STEP[key]]) return null;
    const code = localErrors[key];
    if (!code) return null;
    return errorMessage(code, key === 'description' ? charCount(payload.description) : undefined);
  }

  /** 오류 개수를 화면 낭독기에 알린다. 같은 문구도 다시 읽히도록 비웠다가 채운다 */
  function announceErrors(count: number) {
    window.clearTimeout(announceTimer.current);
    setAnnouncement('');
    announceTimer.current = window.setTimeout(() => setAnnouncement(requestCopy.errorSummary(count)), 80);
  }

  function update<K extends keyof RequestDraft>(key: K, value: RequestDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    clearServerError(key as FieldKey);
  }

  function clearServerError(key: FieldKey) {
    setServerErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function toggleService(category: ServiceCategory, option: string) {
    setDraft((prev) => ({
      ...prev,
      services: { ...prev.services, [category]: toggleIn(prev.services[category], option, SERVICE_OPTIONS[category]) },
    }));
    clearServerError('services');
  }

  function stepErrorKeys(target: Step): FieldKey[] {
    return FIELD_ORDER.filter((key) => FIELD_STEP[key] === target && (localErrors[key] || serverErrors[key]));
  }

  function goNext() {
    setAttempted((prev) => ({ ...prev, [step]: true }));
    const errors = stepErrorKeys(step);
    if (errors.length) {
      setFocusTarget(`field:${errors[0]}`);
      announceErrors(errors.length);
      return;
    }
    changeStep((step + 1) as Step);
    setFocusTarget('step-title');
  }

  function goPrev() {
    // 단계가 막 바뀐 직후(연속 탭)에는 무시한다
    if (performance.now() - stepChangedAt.current < STEP_CHANGE_GUARD_MS) return;
    changeStep((step - 1) as Step);
    setFocusTarget('step-title');
  }

  async function submit() {
    if (inFlight.current) return;
    setAttempted({ 1: true, 2: true, 3: true });

    const first = firstErrorField(localErrors);
    if (first) {
      const target = FIELD_STEP[first];
      if (target !== step) changeStep(target);
      setFocusTarget(`field:${first}`);
      announceErrors(FIELD_ORDER.filter((key) => FIELD_STEP[key] === target && localErrors[key]).length);
      return;
    }

    // 내용이 바뀌었으면 새 키(고친 내용이 처음 내용으로 덮이지 않게), 같으면 같은 키(중복 방지)
    const fingerprint = JSON.stringify(payload);
    if (lastFingerprint.current !== null && lastFingerprint.current !== fingerprint) {
      idempotencyKey.current = newIdempotencyKey();
    }
    lastFingerprint.current = fingerprint;
    // 보내기 전에 바로 저장: 응답 전에 새로고침해도 같은 내용은 같은 키, 고친 내용은 새 키로 이어진다
    persist({ draft, step });

    inFlight.current = true;
    setSubmitting(true);
    setFailure(null);
    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, website, idempotency_key: idempotencyKey.current }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok: true; receiptNo: string }
        | { ok: false; error: string; fieldErrors?: Record<string, string> }
        | null;

      if (response.ok && data?.ok) {
        setDone({ receiptNo: data.receiptNo, payload });
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // 무시
        }
        window.scrollTo({ top: 0 });
        setFocusTarget('done-title');
        return;
      }

      if (data && !data.ok && data.error === 'VALIDATION' && data.fieldErrors) {
        const fieldErrors = data.fieldErrors;
        const keys = FIELD_ORDER.filter((key) => typeof fieldErrors[key] === 'string');
        if (keys.length) {
          setServerErrors(Object.fromEntries(keys.map((key) => [key, fieldErrors[key]])));
          const target = FIELD_STEP[keys[0]];
          if (target !== step) changeStep(target);
          setFocusTarget(`field:${keys[0]}`);
          announceErrors(keys.filter((key) => FIELD_STEP[key] === target).length);
          return;
        }
      }

      setFailure(response.status === 503 ? 'unavailable' : 'server');
    } catch {
      setFailure('network');
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (failure) failureRef.current?.scrollIntoView({ block: 'nearest' });
  }, [failure]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // 단계가 막 바뀐 직후(연속 탭)의 제출은 무시한다. 버튼은 비활성화하지 않는다
    if (performance.now() - stepChangedAt.current < STEP_CHANGE_GUARD_MS) return;
    if (step < TOTAL_STEPS) goNext();
    else void submit();
  }

  if (done) return <Complete done={done} />;

  const category = draft.category;
  const stepTitle = requestCopy.stepTitles[step - 1];

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h1 className={styles.h1}>{requestCopy.h1}</h1>
        <p className={styles.intro}>
          {requestCopy.intro.map((sentence) => (
            <span key={sentence} className={styles.introLine}>
              {tidy(sentence)}
            </span>
          ))}
        </p>
        <noscript>
          <p className={styles.noscript}>{requestCopy.noScript(company.email)}</p>
        </noscript>
      </div>

      {/* method="post": 스크립트가 붙기 전에 눌려도 입력값이 URL 쿼리에 남지 않게 */}
      <form method="post" noValidate onSubmit={onSubmit} className={styles.form} aria-labelledby="step-title">
        <div className={styles.progress} aria-hidden="true">
          <p className={styles.count}>
            {step} / {TOTAL_STEPS}
          </p>
          <div className={styles.track}>
            <div className={styles.bar} style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
          </div>
        </div>

        {/* 포커스가 오면 '3단계 중 2단계: 일정과 예산'처럼 읽힌다 */}
        <h2 id="step-title" tabIndex={-1} className={styles.stepTitle}>
          <span className="sr-only">{requestCopy.stepStatus(step, TOTAL_STEPS)}: </span>
          {stepTitle}
        </h2>

        {/* '다음'·'보내기'로 오류를 찾았을 때만 개수를 알린다. 포커스는 첫 오류 항목으로 간다 */}
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>

        {step === 1 ? (
          <div className={styles.fields}>
            <SelectCards
              name="category"
              label={FIELD_LABELS.category}
              required
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={(value) => update('category', value as Category)}
              error={messageFor('category')}
            />
            {isServiceCategory(category) ? (
              <ChipGroup
                name="services"
                label={FIELD_LABELS.services}
                required
                options={SERVICE_OPTIONS[category]}
                values={draft.services[category]}
                onToggle={(option) => toggleService(category, option)}
                error={messageFor('services')}
              />
            ) : null}
            <TextField
              name="title"
              label={FIELD_LABELS.title}
              required
              placeholder={FIELD_PLACEHOLDER.title}
              value={draft.title}
              onChange={(value) => update('title', value)}
              error={messageFor('title')}
              counter={requestCopy.counters.title(charCount(cleanLine(draft.title)))}
            />
            <TextArea
              name="description"
              label={FIELD_LABELS.description}
              required
              help={FIELD_HELP.description}
              value={draft.description}
              onChange={(value) => update('description', value)}
              error={messageFor('description')}
              counter={requestCopy.counters.description(charCount(cleanText(draft.description)))}
            />
            <RadioGroup
              name="stage"
              label={FIELD_LABELS.stage}
              required
              options={STAGE_OPTIONS}
              value={draft.stage}
              onChange={(value) => update('stage', value)}
              error={messageFor('stage')}
            />
            <ReferencesField
              name="references"
              label={FIELD_LABELS.references}
              help={FIELD_HELP.references}
              values={draft.references}
              validity={referenceValidity}
              max={LIMITS.referencesMax}
              onChange={(values) => update('references', values)}
              error={messageFor('references')}
            />

            {/* 분야별 추가 질문: 선택한 분야일 때만 표시·저장 */}
            {category === CATEGORY_DEV ? (
              <section className={styles.extra} aria-labelledby="extra-title">
                <h3 id="extra-title" className={styles.extraTitle}>
                  {requestCopy.categoryExtraTitle(CATEGORY_DEV)}
                </h3>
                <ChipGroup
                  name="platforms"
                  label={FIELD_LABELS.platforms}
                  required
                  options={PLATFORM_OPTIONS}
                  values={draft.platforms}
                  onToggle={(option) => update('platforms', toggleIn(draft.platforms, option, PLATFORM_OPTIONS))}
                  error={messageFor('platforms')}
                />
                <ChipGroup
                  name="features"
                  label={FIELD_LABELS.features}
                  help={requestCopy.featuresHelp}
                  options={FEATURE_OPTIONS}
                  values={draft.features}
                  onToggle={(option) => update('features', toggleFeature(draft.features, option))}
                  error={messageFor('features')}
                />
                <ChipGroup
                  name="scope"
                  label={FIELD_LABELS.scope}
                  required
                  options={SCOPE_OPTIONS}
                  values={draft.scope}
                  onToggle={(option) => update('scope', toggleIn(draft.scope, option, SCOPE_OPTIONS))}
                  error={messageFor('scope')}
                />
              </section>
            ) : null}

            {category === CATEGORY_DOCS ? (
              <section className={styles.extra} aria-labelledby="extra-title">
                <h3 id="extra-title" className={styles.extraTitle}>
                  {requestCopy.categoryExtraTitle(CATEGORY_DOCS)}
                </h3>
                <RadioGroup
                  name="purpose"
                  label={FIELD_LABELS.purpose}
                  required
                  options={PURPOSE_OPTIONS}
                  value={draft.purpose}
                  onChange={(value) => update('purpose', value)}
                  error={messageFor('purpose')}
                />
                <TextField
                  name="program_name"
                  label={FIELD_LABELS.program_name}
                  placeholder={FIELD_PLACEHOLDER.program_name}
                  value={draft.program_name}
                  onChange={(value) => update('program_name', value)}
                  error={messageFor('program_name')}
                />
                <TextField
                  name="deadline"
                  label={FIELD_LABELS.deadline}
                  type="date"
                  value={draft.deadline}
                  onChange={(value) => update('deadline', value)}
                  error={messageFor('deadline')}
                />
                <RadioGroup
                  name="draft"
                  label={FIELD_LABELS.draft}
                  options={DRAFT_OPTIONS}
                  value={draft.draft}
                  onChange={(value) => update('draft', value)}
                  error={messageFor('draft')}
                />
              </section>
            ) : null}
          </div>
        ) : null}

        {step === 2 ? (
          <div className={styles.fields}>
            <RadioGroup
              name="timeline"
              label={FIELD_LABELS.timeline}
              required
              options={TIMELINE_OPTIONS}
              value={draft.timeline}
              onChange={(value) => update('timeline', value)}
              error={messageFor('timeline')}
            />
            <RadioGroup
              name="budget"
              label={FIELD_LABELS.budget}
              required
              options={BUDGET_OPTIONS}
              value={draft.budget}
              onChange={(value) => update('budget', value)}
              error={messageFor('budget')}
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div className={styles.fields}>
            <TextField
              name="name"
              label={FIELD_LABELS.name}
              required
              autoComplete="name"
              value={draft.name}
              onChange={(value) => update('name', value)}
              error={messageFor('name')}
            />
            <TextField
              name="company"
              label={FIELD_LABELS.company}
              autoComplete="organization"
              value={draft.company}
              onChange={(value) => update('company', value)}
              error={messageFor('company')}
            />
            <TextField
              name="email"
              label={FIELD_LABELS.email}
              required
              type="email"
              inputMode="email"
              autoComplete="email"
              value={draft.email}
              onChange={(value) => update('email', value)}
              error={messageFor('email')}
            />
            <TextField
              name="phone"
              label={FIELD_LABELS.phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              help={FIELD_HELP.phone}
              value={draft.phone}
              onChange={(value) => update('phone', value)}
              error={messageFor('phone')}
            />
            <SelectField
              name="source"
              label={FIELD_LABELS.source}
              options={SOURCE_OPTIONS}
              placeholder={requestCopy.selectPlaceholder}
              value={draft.source}
              onChange={(value) => update('source', value)}
              error={messageFor('source')}
            />

            {/* 스팸 방지 함정 필드: 사람에게는 보이지 않는다. 값이 있으면 서버가 저장하지 않는다 */}
            <div className={styles.trap} aria-hidden="true">
              <label htmlFor="field-website">website</label>
              <input
                id="field-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>
          </div>
        ) : null}

        {step === 3 && failure ? <FailureNotice kind={failure} payload={payload} ref={failureRef} /> : null}

        {/* 개인정보 안내: 제출 버튼 바로 위, 체크박스 없이 문구로 */}
        {step === 3 ? <PrivacyNotice /> : null}

        <div className={styles.nav}>
          {step > 1 ? (
            <button type="button" className={`text-link ${styles.prev}`} onClick={goPrev}>
              {requestCopy.buttons.prev}
            </button>
          ) : null}
          <button type="submit" className={`btn ${styles.next}`} aria-busy={submitting || undefined}>
            {step < TOTAL_STEPS
              ? requestCopy.buttons.next
              : submitting
                ? requestCopy.buttons.submitting
                : failure
                  ? requestCopy.buttons.retry
                  : requestCopy.buttons.submit}
          </button>
        </div>
      </form>
    </div>
  );
}

const FailureNotice = forwardRef<HTMLDivElement, { kind: Failure; payload: RequestPayload }>(function FailureNotice(
  { kind, payload },
  ref,
) {
  const copy = requestCopy.failure;
  return (
    <div ref={ref} role="alert" className={styles.failure}>
      <p className={styles.failureTitle}>{copy.title}</p>
      {copy[kind].map((line) => (
        <p key={line}>{line}</p>
      ))}
      <p>{copy.keptInputs}</p>
      <p>
        {copy.email.before}
        <a href={mailtoHref(payload)}>{company.email}</a>
        {copy.email.after}
      </p>
      <p className={styles.failureHint}>{copy.emailHint}</p>
    </div>
  );
});

function PrivacyNotice() {
  const notice = requestCopy.privacyNotice;
  return (
    <section className={styles.notice} aria-labelledby="privacy-notice-title">
      <h3 id="privacy-notice-title" className={styles.noticeTitle}>
        {notice.heading}
      </h3>
      <dl className={styles.noticeList}>
        {notice.rows.map(([term, detail]) => (
          <div key={term} className={styles.noticeRow}>
            <dt>{term}</dt>
            <dd>{tidy(detail)}</dd>
          </div>
        ))}
        <div className={styles.noticeRow}>
          <dt>{notice.linkTerm}</dt>
          <dd>
            {/* 새 창으로 열어 쓰던 폼을 떠나지 않게 */}
            <Link href="/privacy" className={styles.noticeLink} target="_blank" rel="noopener">
              {notice.linkText}
              <span className="sr-only"> {requestCopy.newWindow}</span>
            </Link>
          </dd>
        </div>
      </dl>
    </section>
  );
}

/**
 * 완료 화면 요약에서 tidy()로 줄바꿈을 다듬는 칸: 정해진 선택지 값만.
 * 사용자가 입력한 글(한 줄 소개·자세한 내용·참고 링크·연락처 등)은 복사해도 그대로이도록 손대지 않는다.
 */
const CHOICE_FIELDS: ReadonlySet<FieldKey> = new Set<FieldKey>([
  'category',
  'services',
  'stage',
  'platforms',
  'features',
  'scope',
  'purpose',
  'draft',
  'timeline',
  'budget',
  'source',
]);

function Complete({ done }: { done: Done }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h1 id="done-title" tabIndex={-1} className={styles.h1}>
          {requestCopy.complete.title}
        </h1>
        <dl className={styles.receipt}>
          <dt>{requestCopy.complete.receiptLabel}</dt>
          <dd className={styles.receiptNo}>{done.receiptNo}</dd>
        </dl>
        <p className={styles.followUp}>{requestCopy.complete.followUp}</p>
      </div>

      <section aria-labelledby="summary-title" className={styles.summary}>
        <h2 id="summary-title" className={styles.summaryTitle}>
          {requestCopy.complete.summaryHeading}
        </h2>
        <dl className="row-list">
          {FIELD_ORDER.map((key) => {
            const value = formatValue(done.payload, key);
            return value ? (
              <div key={key} className={styles.summaryRow}>
                <dt>{FIELD_LABELS[key]}</dt>
                <dd>{CHOICE_FIELDS.has(key) ? tidy(value) : value}</dd>
              </div>
            ) : null;
          })}
        </dl>
      </section>

      <div className={styles.doneActions}>
        <Link href="/" className="btn">
          {requestCopy.buttons.home}
        </Link>
      </div>
    </div>
  );
}
