"use client";

import { useRef, useState } from "react";

type Field = { field_key: string; label: string; field_type: string; is_required: boolean; placeholder: string; help_text: string; options: unknown; condition?: { field?: string; equals?: string } | null };
export default function DynamicInquiryForm({ slug, fields, submitLabel, successMessage, pagePath }: { slug: string; fields: Field[]; submitLabel: string; successMessage: string; pagePath: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    const response = await fetch(`/api/cms-forms/${encodeURIComponent(slug)}/`, { method: "POST", body: new FormData(event.currentTarget) });
    const result = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) { setMessage(result.error || "Your inquiry could not be sent. Please try again."); return; }
    ref.current?.reset();
    setMessage(result.message || successMessage);
  }
  return (
    <form ref={ref} onSubmit={submit} className="card mt-8 space-y-5 p-6" encType="multipart/form-data">
      <input type="hidden" name="page_path" value={pagePath} />
      {fields.map((field) => {
        const options = Array.isArray(field.options) ? field.options.filter((x): x is string => typeof x === "string") : [];
        const conditionParent = field.condition?.field ? values[field.condition.field] : undefined;
        const visible = !field.condition || (Array.isArray(conditionParent) ? conditionParent.includes(field.condition.equals ?? "") : conditionParent === field.condition.equals);
        if (!visible) return null;
        const common = { id: field.field_key, name: field.field_key, required: field.is_required, placeholder: field.placeholder || undefined, className: "field", onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { const value = field.field_type === "checkbox" && !options.length ? ((event.currentTarget as HTMLInputElement).checked ? "yes" : "") : event.currentTarget.value; setValues((prev) => ({ ...prev, [field.field_key]: value })); } };
        return <div key={field.field_key}>
          <label className="field-label" htmlFor={field.field_key}>{field.label}{field.is_required ? " *" : ""}</label>
          {field.field_type === "textarea" ? <textarea {...common} rows={4} />
            : field.field_type === "select" || field.field_type === "budget" ? <select {...common} defaultValue=""><option value="">Choose one</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>
            : field.field_type === "radio" || (field.field_type === "checkbox" && options.length > 0) ? <fieldset className="mt-2 grid gap-2 sm:grid-cols-2"><legend className="sr-only">{field.label}</legend>{options.map((option) => <label key={option} className="choice flex items-center gap-2"><input type={field.field_type} name={field.field_key} value={option} required={field.is_required && field.field_type === "radio"} onChange={(event) => { const checked = event.currentTarget.checked; setValues((prev) => { const previous = Array.isArray(prev[field.field_key]) ? prev[field.field_key] as string[] : []; return { ...prev, [field.field_key]: field.field_type === "radio" ? option : checked ? [...previous, option] : previous.filter((item) => item !== option) }; }); }} />{option}</label>)}</fieldset>
            : <input {...common} type={field.field_type === "file" ? "file" : field.field_type} accept={field.field_type === "file" ? ".jpg,.jpeg,.png,.webp,.gif,.heic,.heif,.pdf" : undefined} />}
          {field.help_text ? <p className="mt-1 text-sm text-ink-muted">{field.help_text}</p> : null}
        </div>;
      })}
      <label className="choice flex items-start gap-3"><input type="checkbox" name="privacy" value="yes" required className="mt-1" /><span>I agree to the <a className="link" href="/privacy-policy/">privacy policy</a>.</span></label>
      <button className="btn-primary" type="submit" disabled={busy}>{busy ? "Sending…" : submitLabel}</button>
      {message ? <p role="status" aria-live="polite" className="rounded-xl bg-mint-wash p-3 text-forest">{message}</p> : null}
    </form>
  );
}
