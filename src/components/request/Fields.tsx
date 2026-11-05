'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { requestCopy } from '@/content/request';
import { tidy } from '@/lib/typography';
import styles from './Fields.module.css';

/* ── 공통 ───────────────────────────────────────────────── */

function ids(...values: (string | null | false | undefined)[]): string | undefined {
  const joined = values.filter(Boolean).join(' ');
  return joined || undefined;
}

function LabelText({ label, required }: { label: string; required?: boolean }) {
  return (
    <>
      {label}
      {required ? <span className={styles.required}> {requestCopy.requiredMark}</span> : null}
    </>
  );
}

function Help({ id, text }: { id: string | null; text?: string }) {
  return text && id ? (
    <p id={id} className={styles.help}>
      {tidy(text)}
    </p>
  ) : null;
}

function ErrorText({ id, text }: { id: string | null; text?: string | null }) {
  return text && id ? (
    <p id={id} className={styles.error}>
      {tidy(text)}
    </p>
  ) : null;
}

type Base = {
  name: string;
  label: string;
  required?: boolean;
  help?: string;
  error?: string | null;
};

/* ── 한 줄 입력 ─────────────────────────────────────────── */

type TextFieldProps = Base & {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'date' | 'url';
  inputMode?: 'text' | 'email' | 'tel' | 'url';
  autoComplete?: string;
  placeholder?: string;
  counter?: string;
};

export function TextField(props: TextFieldProps) {
  const { name, label, required, help, error, value, onChange, type = 'text', counter } = props;
  const inputId = `field-${name}`;
  const helpId = help ? `${name}-help` : null;
  const errorId = error ? `${name}-error` : null;
  const counterId = counter ? `${name}-counter` : null;

  return (
    <div className={styles.field} data-field={name}>
      <label htmlFor={inputId} className={styles.label}>
        <LabelText label={label} required={required} />
      </label>
      <Help id={helpId} text={help} />
      <ErrorText id={errorId} text={error} />
      <input
        id={inputId}
        name={name}
        type={type}
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode={props.inputMode}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={ids(helpId, errorId, counterId)}
      />
      {counter ? (
        <p id={counterId ?? undefined} className={styles.counter}>
          {counter}
        </p>
      ) : null}
    </div>
  );
}

/* ── 여러 줄 입력 ───────────────────────────────────────── */

type TextAreaProps = Base & {
  value: string;
  onChange: (value: string) => void;
  counter?: string;
};

export function TextArea({ name, label, required, help, error, value, onChange, counter }: TextAreaProps) {
  const inputId = `field-${name}`;
  const helpId = help ? `${name}-help` : null;
  const errorId = error ? `${name}-error` : null;
  const counterId = counter ? `${name}-counter` : null;

  return (
    <div className={styles.field} data-field={name}>
      <label htmlFor={inputId} className={styles.label}>
        <LabelText label={label} required={required} />
      </label>
      <Help id={helpId} text={help} />
      <ErrorText id={errorId} text={error} />
      <textarea
        id={inputId}
        name={name}
        className={`${styles.input} ${styles.textarea}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={ids(helpId, errorId, counterId)}
      />
      {counter ? (
        <p id={counterId ?? undefined} className={styles.counter}>
          {counter}
        </p>
      ) : null}
    </div>
  );
}

/* ── 선택 상자 ──────────────────────────────────────────── */

type SelectFieldProps = Base & {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  placeholder: string;
};

export function SelectField({ name, label, required, help, error, value, options, onChange, placeholder }: SelectFieldProps) {
  const inputId = `field-${name}`;
  const helpId = help ? `${name}-help` : null;
  const errorId = error ? `${name}-error` : null;

  return (
    <div className={styles.field} data-field={name}>
      <label htmlFor={inputId} className={styles.label}>
        <LabelText label={label} required={required} />
      </label>
      <Help id={helpId} text={help} />
      <ErrorText id={errorId} text={error} />
      <div className={styles.selectWrap}>
        <select
          id={inputId}
          name={name}
          className={`${styles.input} ${styles.select}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={ids(helpId, errorId)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ── 묶음(라디오·칩·선택 카드) ─────────────────────────── */

type GroupShellProps = Base & { children: ReactNode; className?: string };

function GroupShell({ name, label, required, help, error, children, className }: GroupShellProps) {
  const helpId = help ? `${name}-help` : null;
  const errorId = error ? `${name}-error` : null;
  return (
    <fieldset
      className={`${styles.field} ${error ? styles.invalid : ''} ${className ?? ''}`}
      data-field={name}
      aria-describedby={ids(helpId, errorId)}
    >
      <legend className={styles.label}>
        <LabelText label={label} required={required} />
      </legend>
      <Help id={helpId} text={help} />
      <ErrorText id={errorId} text={error} />
      {children}
    </fieldset>
  );
}

type SingleChoiceProps = Base & {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
};

/** 라디오 (1개 선택) */
export function RadioGroup({ value, options, onChange, ...base }: SingleChoiceProps) {
  return (
    <GroupShell {...base}>
      <div className={styles.radios}>
        {options.map((option) => (
          <label key={option} className={styles.radio}>
            <input
              type="radio"
              name={base.name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className={styles.radioInput}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </GroupShell>
  );
}

/** 선택 카드 (1개 선택). 선택 시 2px --text 테두리, 크기는 그대로 */
export function SelectCards({ value, options, onChange, ...base }: SingleChoiceProps) {
  return (
    <GroupShell {...base}>
      <div className={styles.cards}>
        {options.map((option) => (
          <label key={option} className={styles.cardOption}>
            <input
              type="radio"
              name={base.name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className={styles.hiddenInput}
            />
            <span className={styles.card}>{option}</span>
          </label>
        ))}
      </div>
    </GroupShell>
  );
}

type ChipGroupProps = Base & {
  values: readonly string[];
  options: readonly string[];
  onToggle: (option: string) => void;
};

/** 칩 (여러 개 선택). 선택 시 색 반전 */
export function ChipGroup({ values, options, onToggle, ...base }: ChipGroupProps) {
  return (
    <GroupShell {...base}>
      <div className={styles.chips}>
        {options.map((option) => (
          <label key={option} className={styles.chipOption}>
            <input
              type="checkbox"
              name={base.name}
              value={option}
              checked={values.includes(option)}
              onChange={() => onToggle(option)}
              className={styles.hiddenInput}
            />
            <span className={styles.chip}>{option}</span>
          </label>
        ))}
      </div>
    </GroupShell>
  );
}

/* ── 참고 링크 (최대 3개) ───────────────────────────────── */

type ReferencesProps = Base & {
  values: string[];
  /** 칸별로 형식이 맞는지 (빈 칸은 true) */
  validity: boolean[];
  max: number;
  onChange: (values: string[]) => void;
};

export function ReferencesField({ values, validity, max, onChange, ...base }: ReferencesProps) {
  const { name, error } = base;
  const helpId = base.help ? `${name}-help` : null;
  const errorId = error ? `${name}-error` : null;
  const [focusIndex, setFocusIndex] = useState<number | 'add' | null>(null);
  const addRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focusIndex === null) return;
    if (focusIndex === 'add') addRef.current?.focus();
    else document.getElementById(`field-${name}-${focusIndex}`)?.focus();
    setFocusIndex(null);
  }, [focusIndex, name]);

  const update = (index: number, value: string) => onChange(values.map((v, i) => (i === index ? value : v)));
  const add = () => {
    onChange([...values, '']);
    setFocusIndex(values.length);
  };
  const remove = (index: number) => {
    const next = values.filter((_, i) => i !== index);
    onChange(next.length ? next : ['']);
    setFocusIndex(next.length ? Math.max(0, index - 1) : 0);
  };

  return (
    <GroupShell {...base}>
      <div className={styles.refs}>
        {values.map((value, index) => {
          const invalid = Boolean(error) && !validity[index];
          return (
            <div key={index} className={styles.refRow}>
              <label htmlFor={`field-${name}-${index}`} className="sr-only">
                {requestCopy.referenceLabel(index + 1)}
              </label>
              <input
                id={`field-${name}-${index}`}
                type="url"
                inputMode="url"
                className={styles.input}
                value={value}
                onChange={(event) => update(index, event.target.value)}
                aria-invalid={invalid ? true : undefined}
                aria-describedby={ids(helpId, invalid && errorId)}
              />
              {values.length > 1 ? (
                <button type="button" className={`text-link ${styles.refRemove}`} onClick={() => remove(index)}>
                  {requestCopy.buttons.removeReference}
                  <span className="sr-only"> ({requestCopy.referenceLabel(index + 1)})</span>
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
      {values.length < max ? (
        <button ref={addRef} type="button" className={`text-link ${styles.refAdd}`} onClick={add}>
          {requestCopy.buttons.addReference}
        </button>
      ) : null}
    </GroupShell>
  );
}
