"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { REPAIR_TYPES, req, validateEmail, validateFiles, type Errors } from "@/lib/inquiry";
import { FileField, Honeypot, PrivacyConsent, SubmitFallback, TextField } from "./Fields";
import { useInquiry } from "./useInquiry";

const empty = { name: "", email: "", maker: "", repairType: "", problem: "", history: "", timing: "", notes: "", privacy: false, website: "" };

export default function RepairForm() {
  const [d, setD] = useState(empty);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const { status, error, serverErrors, submit } = useInquiry("repair");
  const doneRef = useRef<HTMLHeadingElement>(null);
  const set = <K extends keyof typeof empty>(k: K, v: (typeof empty)[K]) => setD((p) => ({ ...p, [k]: v }));
  const err = (k: string) => errors[k] || serverErrors[k];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v: Errors = {};
    req(d.name, "Name", v, "name", 120);
    validateEmail(d.email, v);
    req(d.repairType, "Repair type", v, "repairType");
    req(d.problem, "Problem description", v, "problem", 5000);
    if (!files.length) v.files = "Add at least one photo of the suit and the damage.";
    else validateFiles(files, v);
    if (!d.privacy) v.privacy = "Please agree to the privacy policy.";
    setErrors(v);
    if (Object.keys(v).length) {
      e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    const { ok } = await submit({ ...d, privacy: d.privacy ? "yes" : "" }, files);
    if (ok) {
      track("repair_form_submit_success", { repair_type: d.repairType });
      setTimeout(() => doneRef.current?.focus(), 0);
    }
  };

  if (status === "success") {
    return (
      <div className="card animate-rise p-8" role="status">
        <h3 ref={doneRef} tabIndex={-1} className="text-2xl font-semibold outline-none">
          Assessment request sent
        </h3>
        <p className="mt-3 text-ink-muted">
          Thanks, {d.name.split(" ")[0]}. We'll look at your photos and reply to {d.email} to let you know whether we can take the repair on, and with a quote if we can.
          Please don't ship the suit until we've confirmed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card relative space-y-5 p-5 sm:p-8" aria-label="Repair assessment request">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Your name" name="name" required autoComplete="name" value={d.name} onChange={(v) => set("name", v)} error={err("name")} maxLength={120} />
        <TextField label="Email" name="email" type="email" required autoComplete="email" value={d.email} onChange={(v) => set("email", v)} error={err("email")} maxLength={200} />
        <TextField label="Original maker" name="maker" value={d.maker} onChange={(v) => set("maker", v)} hint="If you know who made it." maxLength={200} />
        <div>
          <label htmlFor="repairType" className="field-label">
            Type of repair <span className="text-red-700" aria-hidden>*</span>
          </label>
          <select
            id="repairType"
            name="repairType"
            className="field"
            value={d.repairType}
            onChange={(e) => set("repairType", e.target.value)}
            aria-invalid={err("repairType") ? true : undefined}
            aria-required
            aria-describedby={err("repairType") ? "repairType-err" : undefined}
          >
            <option value="">Choose one…</option>
            {REPAIR_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {err("repairType") ? (
            <p id="repairType-err" className="field-error" role="alert">
              {err("repairType")}
            </p>
          ) : null}
        </div>
      </div>
      <TextField label="Describe the problem" name="problem" required textarea rows={5} value={d.problem} onChange={(v) => set("problem", v)} error={err("problem")} hint="What's damaged, where, and what you'd like done." maxLength={5000} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Suit age or history" name="history" value={d.history} onChange={(v) => set("history", v)} hint="Age, previous repairs, how it's been washed or stored." maxLength={1000} />
        <TextField label="Desired timing" name="timing" value={d.timing} onChange={(v) => set("timing", v)} hint="e.g. before a convention date" maxLength={200} />
      </div>
      <FileField label="Photos of the suit and damage" required files={files} onChange={setFiles} error={err("files")} hint="One full photo of each piece plus close-ups of every problem area." />
      <TextField label="Additional notes" name="notes" textarea rows={3} value={d.notes} onChange={(v) => set("notes", v)} maxLength={3000} />
      <PrivacyConsent checked={d.privacy} onChange={(v) => set("privacy", v)} error={err("privacy")} />
      <Honeypot value={d.website} onChange={(v) => set("website", v)} />
      <p className="rounded-2xl bg-mint-wash p-4 text-sm text-forest">
        Submitting this form requests an assessment only. It doesn't confirm that we can take the repair or set a final price.
      </p>
      {status === "error" && error ? <SubmitFallback message={error} /> : null}
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "submitting"} aria-busy={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Request a Repair Assessment"}
      </button>
    </form>
  );
}
