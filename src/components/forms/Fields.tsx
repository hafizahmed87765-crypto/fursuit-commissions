"use client";

import Link from "next/link";
import { useId, useRef } from "react";
import { site } from "@/content/site";
import { UPLOAD } from "@/lib/inquiry";

export function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error" role="alert">
      <svg aria-hidden viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0"><path fill="currentColor" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-1 4h2v5H9V6Zm0 6h2v2H9v-2Z" /></svg>
      {message}
    </p>
  );
}

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
};

export function TextField(p: InputProps) {
  const id = useId();
  const describedBy = [p.hint ? `${id}-hint` : null, p.error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name: p.name,
    value: p.value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => p.onChange(e.target.value),
    className: "field",
    "aria-invalid": p.error ? true : undefined,
    "aria-describedby": describedBy,
    "aria-required": p.required || undefined,
    placeholder: p.placeholder,
    maxLength: p.maxLength,
    autoComplete: p.autoComplete,
  };
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {p.label} {p.required ? <span className="text-red-700" aria-hidden>*</span> : <span className="font-normal text-ink-muted">(optional)</span>}
      </label>
      {p.textarea ? <textarea rows={p.rows ?? 5} {...common} /> : <input type={p.type ?? "text"} {...common} />}
      {p.hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {p.hint}
        </p>
      ) : null}
      <ErrorText id={`${id}-err`} message={p.error} />
    </div>
  );
}

export function FileField({ label, files, onChange, error, hint, required }: { label: string; files: File[]; onChange: (f: File[]) => void; error?: string; hint?: string; required?: boolean }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const fmt = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`);
  return (
    <div>
      <p id={`${id}-label`} className="field-label">
        {label} {required ? <span className="text-red-700" aria-hidden>*</span> : <span className="font-normal text-ink-muted">(optional)</span>}
      </p>
      <div className={`rounded-2xl border-2 border-dashed p-5 text-center ${error ? "border-red-600" : "border-forest/20"} bg-mint-wash`}>
        <input
          ref={input}
          id={id}
          type="file"
          multiple
          accept={UPLOAD.accept}
          className="sr-only"
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-hint${error ? ` ${id}-err` : ""}`}
          onChange={(e) => {
            const picked = Array.from(e.target.files ?? []);
            const merged = [...files, ...picked.filter((p) => !files.some((f) => f.name === p.name && f.size === p.size))];
            onChange(merged);
            e.target.value = "";
          }}
        />
        <button type="button" className="btn-soft btn-sm" onClick={() => input.current?.click()}>
          Choose files
        </button>
        <p id={`${id}-hint`} className="field-hint">
          {hint ?? "JPG, PNG, WEBP, GIF, HEIC or PDF."} Up to {UPLOAD.maxFiles} files, 8 MB each. Photos are resized automatically before sending.
        </p>
      </div>
      {files.length ? (
        <ul className="mt-3 space-y-2" aria-label="Attached files">
          {files.map((f, i) => (
            <li key={f.name + f.size} className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-2 text-sm ring-1 ring-forest/10">
              <span className="min-w-0 truncate">
                {f.name} <span className="text-ink-muted">· {fmt(f.size)}</span>
              </span>
              <button type="button" className="shrink-0 font-semibold text-red-700 hover:underline" onClick={() => onChange(files.filter((_, j) => j !== i))}>
                Remove<span className="sr-only"> {f.name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <ErrorText id={`${id}-err`} message={error} />
    </div>
  );
}

export function Checkbox({ name, checked, onChange, children, error }: { name: string; checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode; error?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input id={id} name={name} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} className="mt-1 h-5 w-5 rounded border-forest/30 text-forest focus:ring-mint-deep" />
        <span className="text-sm text-ink">{children}</span>
      </label>
      <ErrorText id={`${id}-err`} message={error} />
    </div>
  );
}

/** Invisible to people; bots that fill every field get rejected server-side. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input tabIndex={-1} autoComplete="off" name="website" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function PrivacyConsent({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  return (
    <Checkbox name="privacy" checked={checked} onChange={onChange} error={error}>
      I agree to the{" "}
      <Link href="/privacy-policy/" className="link" target="_blank">
        privacy policy
      </Link>
      . My details are only used to reply to this request.
    </Checkbox>
  );
}

/** Shown when a submission fails, so the visitor still has a way through. */
export function SubmitFallback({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-2xl border-2 border-red-200 bg-red-50 p-5 text-sm text-red-900">
      <p className="font-semibold">{message}</p>
      <p className="mt-2">
        Your answers are still filled in, so you can try again in a moment. If it keeps failing, contact us directly
        {site.email ? (
          <>
            {" "}
            at{" "}
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            ,
          </>
        ) : null}{" "}
        {site.email ? "or " : ""}via{" "}
        {site.socials.slice(0, 2).map((s, i) => (
          <span key={s.name}>
            {i ? " or " : ""}
            <a className="link" href={s.href} target="_blank" rel="noopener">
              {s.name}
            </a>
          </span>
        ))}
        .
      </p>
    </div>
  );
}
