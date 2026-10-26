"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { budgetRanges } from "@/content/site";
import { track } from "@/lib/analytics";
import { COVERAGE, PARTS, SERVICES, req, validateEmail, validateFiles, validateLinks, type Errors } from "@/lib/inquiry";
import { Checkbox, FileField, Honeypot, PrivacyConsent, SubmitFallback, TextField } from "./Fields";
import { useInquiry } from "./useInquiry";

type Data = {
  service: string;
  coverage: string;
  parts: string[];
  legs: string;
  characterName: string;
  species: string;
  design: string;
  hasRef: string;
  links: string;
  budget: string;
  timing: string;
  paymentPlan: string;
  planSchedule: string;
  name: string;
  email: string;
  contact: string;
  notes: string;
  agree: boolean;
  privacy: boolean;
  website: string;
  source: string;
};

const STEPS = ["Service", "Coverage", "Character", "References", "Budget & timing", "Contact", "Review"] as const;

// Which step owns each field, so server-side errors can send the visitor back.
const FIELD_STEP: Record<string, number> = { service: 0, coverage: 1, parts: 1, species: 2, design: 2, files: 3, links: 3, name: 5, email: 5, agree: 6, privacy: 6 };

const needsCoverage = (service: string) => service !== "refsheet";

function validateStep(step: number, d: Data, files: File[]): Errors {
  const e: Errors = {};
  if (step === 0 && !d.service) e.service = "Choose a service to continue.";
  if (step === 1 && needsCoverage(d.service)) {
    if (!d.coverage) e.coverage = "Choose what you'd like made.";
    if (d.coverage === "parts" && !d.parts.length) e.parts = "Select at least one part.";
  }
  if (step === 2) {
    req(d.species, "Species", e, "species", 120);
    req(d.design, "Design description", e, "design", 5000);
  }
  if (step === 3) {
    validateFiles(files, e);
    validateLinks(d.links, e);
  }
  if (step === 5) {
    req(d.name, "Name", e, "name", 120);
    validateEmail(d.email, e);
  }
  if (step === 6) {
    if (!d.agree) e.agree = "Please confirm you understand how quotes work.";
    if (!d.privacy) e.privacy = "Please agree to the privacy policy.";
  }
  return e;
}

function Radio({ name, value, current, onSelect, label, hint }: { name: string; value: string; current: string; onSelect: (v: string) => void; label: string; hint?: string }) {
  return (
    <label className="choice">
      <input type="radio" name={name} value={value} checked={current === value} onChange={() => onSelect(value)} className="mt-1 h-5 w-5 border-forest/30 text-forest focus:ring-mint-deep" />
      <span>
        <span className="block font-display font-semibold text-forest">{label}</span>
        {hint ? <span className="block text-sm text-ink-muted">{hint}</span> : null}
      </span>
    </label>
  );
}

export default function QuoteForm() {
  const params = useSearchParams();
  const [d, setD] = useState<Data>(() => {
    const service = params.get("service") ?? "";
    const coverage = params.get("coverage") ?? "";
    return {
      service: SERVICES.some((s) => s.value === service) ? service : "",
      coverage: COVERAGE.some((c) => c.value === coverage) ? coverage : "",
      parts: (params.get("parts") ?? "").split(",").filter((p) => (PARTS as readonly string[]).includes(p)),
      legs: params.get("legs") ?? "",
      characterName: "",
      species: "",
      design: "",
      hasRef: params.get("hasRef") === "no" ? "no" : params.get("hasRef") === "yes" ? "yes" : "",
      links: "",
      budget: "",
      timing: "",
      paymentPlan: params.get("paymentPlan") === "yes" ? "Yes" : "",
      planSchedule: params.get("schedule") === "weekly" ? "Weekly" : params.get("schedule") === "biweekly" ? "Biweekly" : "",
      name: "",
      email: "",
      contact: "",
      notes: "",
      agree: false,
      privacy: false,
      website: "",
      source: params.get("source") ?? "",
    };
  });
  const [files, setFiles] = useState<File[]>([]);
  // Start after any step the planner already answered.
  const [step, setStep] = useState(() => (d.service ? (d.coverage || !needsCoverage(d.service) ? 2 : 1) : 0));
  const [errors, setErrors] = useState<Errors>({});
  const started = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const { status, error, submit } = useInquiry("quote");

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    if (!started.current) {
      started.current = true;
      track("quote_form_start", { service: d.service || undefined });
    }
    setD((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => {
      if (!prev[k as string]) return prev;
      const next = { ...prev };
      delete next[k as string];
      return next;
    });
  };

  // Move focus to the step heading on navigation (not on first load).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [step, status]);

  const next = () => {
    const e = validateStep(step, d, files);
    setErrors(e);
    if (Object.keys(e).length) return;
    // Reference-sheet requests skip the coverage step.
    setStep((s) => (s === 0 && !needsCoverage(d.service) ? 2 : s + 1));
  };
  const back = () => setStep((s) => (s === 2 && !needsCoverage(d.service) ? 0 : Math.max(0, s - 1)));

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (step < STEPS.length - 1) return next();
    const all: Errors = {};
    for (let i = 0; i < STEPS.length; i++) Object.assign(all, validateStep(i, d, files));
    setErrors(all);
    if (Object.keys(all).length) {
      setStep(Math.min(...Object.keys(all).map((k) => FIELD_STEP[k] ?? 6)));
      return;
    }
    const res = await submit(
      {
        service: d.service,
        coverage: needsCoverage(d.service) ? d.coverage : undefined,
        parts: d.parts,
        legs: d.legs || undefined,
        characterName: d.characterName,
        species: d.species,
        design: d.design,
        hasRef: d.hasRef,
        links: d.links,
        budget: d.budget,
        timing: d.timing,
        paymentPlan: d.paymentPlan,
        planSchedule: d.paymentPlan && d.paymentPlan !== "No" ? d.planSchedule : undefined,
        name: d.name,
        email: d.email,
        contact: d.contact,
        notes: d.notes,
        agree: d.agree ? "yes" : "",
        privacy: d.privacy ? "yes" : "",
        website: d.website,
        source: d.source,
      },
      files,
    );
    // Server rejected a field: show it and jump back to the step that owns it.
    const serverKeys = Object.keys(res.errors);
    if (serverKeys.length) {
      setErrors(res.errors);
      setStep(Math.min(...serverKeys.map((k) => FIELD_STEP[k] ?? 6)));
    }
    if (res.ok) track("quote_form_submit_success", { service: d.service, coverage: d.coverage || undefined, budget: d.budget || undefined });
  };

  if (status === "success") {
    return (
      <div className="card animate-rise p-8 sm:p-10" role="status">
        <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold outline-none">
          Thank you, {d.name.split(" ")[0]}! Your request has been sent.
        </h2>
        <p className="lede mt-3">We've received your quote request and a copy of your references. Here's what happens next:</p>
        <ol className="mt-6 space-y-3">
          {[
            "We review your character, references and requested coverage.",
            `We reply to ${d.email} with any questions, or a personalised quote and estimated timeline.`,
            "Nothing is booked or charged until you accept the quote and the deposit or payment is received.",
          ].map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint font-display font-bold text-forest">{i + 1}</span>
              <span className="pt-1">{t}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-ink-muted">Please check your spam folder if you don't see our reply.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/gallery/" className="btn-secondary">
            Browse the gallery
          </Link>
          <Link href="/order-process/" className="btn-soft">
            Read about our process
          </Link>
        </div>
      </div>
    );
  }

  const serviceLabel = SERVICES.find((s) => s.value === d.service)?.label;
  const coverageLabel = COVERAGE.find((c) => c.value === d.coverage)?.label;
  const visibleSteps = STEPS.map((label, i) => ({ label, i })).filter((s) => s.i !== 1 || needsCoverage(d.service));
  const position = visibleSteps.findIndex((s) => s.i === step);

  return (
    <form onSubmit={onSubmit} noValidate className="card relative overflow-hidden" aria-labelledby="quote-step-title">
      {/* Progress */}
      <div className="border-b border-forest/10 bg-mint-wash px-5 py-4 sm:px-8">
        <p className="text-sm font-semibold text-forest">
          Step {position + 1} of {visibleSteps.length}
          <span className="font-normal text-ink-muted"> · {STEPS[step]}</span>
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-label="Form progress" aria-valuemin={1} aria-valuemax={visibleSteps.length} aria-valuenow={position + 1}>
          <div className="h-full rounded-full bg-forest transition-all duration-500" style={{ width: `${((position + 1) / visibleSteps.length) * 100}%` }} />
        </div>
        <ol className="mt-3 hidden gap-1 text-xs text-ink-muted md:flex">
          {visibleSteps.map((s, idx) => (
            <li key={s.label} className={`flex-1 ${idx <= position ? "font-semibold text-forest" : ""}`}>
              {s.label}
            </li>
          ))}
        </ol>
      </div>

      <div key={step} className="animate-rise space-y-6 p-5 sm:p-8">
        <h2 id="quote-step-title" ref={headingRef} tabIndex={-1} className="text-2xl font-semibold outline-none">
          {
            [
              "What would you like us to make?",
              "How much of the suit do you need?",
              "Tell us about your character",
              "Share your references",
              "Budget and timing",
              "How can we reach you?",
              "Review and send",
            ][step]
          }
        </h2>

        {step === 0 ? (
          <fieldset>
            <legend className="sr-only">Service</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <Radio key={s.value} name="service" value={s.value} current={d.service} onSelect={(v) => set("service", v)} label={s.label} />
              ))}
            </div>
            <p className="field-hint">
              Need a repair instead?{" "}
              <Link href="/fursuit-repairs/#repair-form" className="link">
                Use the repair assessment form
              </Link>
              .
            </p>
            {errors.service ? <p className="field-error" role="alert">{errors.service}</p> : null}
          </fieldset>
        ) : null}

        {step === 1 ? (
          <>
            <fieldset>
              <legend className="sr-only">Coverage</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {COVERAGE.map((c) => (
                  <Radio key={c.value} name="coverage" value={c.value} current={d.coverage} onSelect={(v) => set("coverage", v)} label={c.label} />
                ))}
              </div>
              {errors.coverage ? <p className="field-error" role="alert">{errors.coverage}</p> : null}
            </fieldset>
            {d.coverage && d.coverage !== "fullsuit" ? (
              <fieldset>
                <legend className="field-label">{d.coverage === "parts" ? "Which parts?" : "Add matching parts (optional)"}</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {PARTS.map((p) => (
                    <Checkbox key={p} name="parts" checked={d.parts.includes(p)} onChange={(on) => set("parts", on ? [...d.parts, p] : d.parts.filter((x) => x !== p))}>
                      {p}
                    </Checkbox>
                  ))}
                </div>
                {errors.parts ? <p className="field-error" role="alert">{errors.parts}</p> : null}
              </fieldset>
            ) : null}
            {d.coverage === "fullsuit" ? (
              <fieldset>
                <legend className="field-label">Leg style preference (optional)</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {["Plantigrade (human-like)", "Digitigrade (padded animal legs)", "Not sure"].map((l) => (
                    <Radio key={l} name="legs" value={l} current={d.legs} onSelect={(v) => set("legs", v)} label={l} />
                  ))}
                </div>
              </fieldset>
            ) : null}
          </>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Character name" name="characterName" value={d.characterName} onChange={(v) => set("characterName", v)} maxLength={120} />
            <TextField label="Species" name="species" required value={d.species} onChange={(v) => set("species", v)} error={errors.species} placeholder="e.g. arctic fox, dragon, original species" maxLength={120} />
            <div className="sm:col-span-2">
              <TextField
                label="Design and customisation"
                name="design"
                required
                textarea
                rows={6}
                value={d.design}
                onChange={(v) => set("design", v)}
                error={errors.design}
                hint="Colours, markings, eye style, hair, expression, and anything you especially want included."
                maxLength={5000}
              />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <>
            <fieldset>
              <legend className="field-label">Do you have a reference sheet?</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <Radio name="hasRef" value="yes" current={d.hasRef} onSelect={(v) => set("hasRef", v)} label="Yes" />
                <Radio name="hasRef" value="no" current={d.hasRef} onSelect={(v) => set("hasRef", v)} label="Not yet" hint="Sketches or inspiration are fine" />
              </div>
              {d.hasRef === "no" ? (
                <p className="field-hint">
                  No problem. A clear ref sheet is needed before production, and{" "}
                  <Link href="/furry-ref-sheet-commissions/" className="link" target="_blank">
                    our artists can draw one
                  </Link>
                  . Add any sketches, photos or inspiration below.
                </p>
              ) : null}
            </fieldset>
            <FileField label="Reference images" files={files} onChange={(f) => { setFiles(f); setErrors((e) => ({ ...e, files: "" })); }} error={errors.files} />
            <TextField label="Reference links" name="links" textarea rows={3} value={d.links} onChange={(v) => set("links", v)} error={errors.links} hint="Toyhouse, Google Drive, art posts… one link per line." />
          </>
        ) : null}

        {step === 4 ? (
          <>
            <fieldset>
              <legend className="field-label">
                Estimated budget <span className="font-normal text-ink-muted">(optional)</span>
              </legend>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {budgetRanges.map((b) => (
                  <Radio key={b} name="budget" value={b} current={d.budget} onSelect={(v) => set("budget", v)} label={b} />
                ))}
              </div>
              <p className="field-hint">This helps us suggest options that fit. Your quote is based on the design, not on the range you pick.</p>
            </fieldset>
            <TextField label="Desired timing" name="timing" value={d.timing} onChange={(v) => set("timing", v)} hint="A convention or date you're aiming for. We'll tell you honestly if it's realistic." maxLength={200} />
            <fieldset>
              <legend className="field-label">
                Interested in a payment plan? <span className="font-normal text-ink-muted">(optional)</span>
              </legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Yes", "No", "Tell me more"].map((p) => (
                  <Radio key={p} name="paymentPlan" value={p} current={d.paymentPlan} onSelect={(v) => set("paymentPlan", v)} label={p} />
                ))}
              </div>
              {d.paymentPlan && d.paymentPlan !== "No" ? (
                <fieldset className="mt-4 animate-rise">
                  <legend className="field-label">
                    Preferred schedule <span className="font-normal text-ink-muted">(optional)</span>
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Radio name="planSchedule" value="Weekly" current={d.planSchedule} onSelect={(v) => set("planSchedule", v)} label="Weekly" hint="A payment every week" />
                    <Radio name="planSchedule" value="Biweekly" current={d.planSchedule} onSelect={(v) => set("planSchedule", v)} label="Biweekly" hint="A payment every two weeks" />
                  </div>
                </fieldset>
              ) : null}
              <p className="field-hint">
                Payment plans may be available on select orders, paid weekly or biweekly; amounts, dates and any fee are confirmed in your quote.{" "}
                <Link href="/payment-plans/" className="link font-normal" target="_blank">
                  How payment plans work
                </Link>
              </p>
            </fieldset>
          </>
        ) : null}

        {step === 5 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Your name" name="name" required autoComplete="name" value={d.name} onChange={(v) => set("name", v)} error={errors.name} maxLength={120} />
            <TextField label="Email" name="email" type="email" required autoComplete="email" value={d.email} onChange={(v) => set("email", v)} error={errors.email} maxLength={200} hint="We send your quote here." />
            <div className="sm:col-span-2">
              <TextField label="Discord, Telegram or WhatsApp" name="contact" value={d.contact} onChange={(v) => set("contact", v)} maxLength={200} hint="If you'd like to chat there as well." />
            </div>
            <div className="sm:col-span-2">
              <TextField label="Anything else?" name="notes" textarea rows={3} value={d.notes} onChange={(v) => set("notes", v)} maxLength={3000} />
            </div>
          </div>
        ) : null}

        {step === 6 ? (
          <>
            <dl className="divide-y divide-forest/10 rounded-2xl bg-mint-wash px-5 text-sm">
              {[
                ["Service", serviceLabel, 0],
                ["Coverage", needsCoverage(d.service) ? [coverageLabel, d.parts.join(", "), d.legs].filter(Boolean).join(" · ") : null, 1],
                ["Character", [d.characterName, d.species].filter(Boolean).join(" · "), 2],
                ["Design", d.design, 2],
                ["References", [d.hasRef === "yes" ? "Has ref sheet" : d.hasRef === "no" ? "No ref sheet yet" : "", files.length ? `${files.length} file(s)` : "", d.links ? "links added" : ""].filter(Boolean).join(" · ") || "None added", 3],
                ["Budget & timing", [d.budget, d.timing, d.paymentPlan && `Payment plan: ${d.paymentPlan}${d.planSchedule && d.paymentPlan !== "No" ? ` (${d.planSchedule.toLowerCase()})` : ""}`].filter(Boolean).join(" · ") || "Not specified", 4],
                ["Contact", [d.name, d.email, d.contact].filter(Boolean).join(" · "), 5],
              ]
                .filter(([, v]) => v !== null)
                .map(([k, v, s]) => (
                  <div key={k as string} className="flex gap-4 py-3">
                    <dt className="w-32 shrink-0 font-semibold text-forest">{k}</dt>
                    <dd className="min-w-0 flex-1 whitespace-pre-wrap break-words text-ink">{(v as string) || "—"}</dd>
                    <dd>
                      <button type="button" className="font-semibold text-forest underline underline-offset-2" onClick={() => setStep(s as number)}>
                        Edit<span className="sr-only"> {k as string}</span>
                      </button>
                    </dd>
                  </div>
                ))}
            </dl>
            <div className="space-y-3">
              <Checkbox name="agree" checked={d.agree} onChange={(v) => set("agree", v)} error={errors.agree}>
                I understand that final pricing depends on design complexity, and that submitting this form does not reserve a commission slot.
              </Checkbox>
              <PrivacyConsent checked={d.privacy} onChange={(v) => set("privacy", v)} error={errors.privacy} />
            </div>
            <Honeypot value={d.website} onChange={(v) => set("website", v)} />
            {status === "error" && error ? <SubmitFallback message={error} /> : null}
          </>
        ) : null}

        {Object.values(errors).filter(Boolean).length && step !== 6 ? (
          <p className="sr-only" role="alert">
            Please fix the highlighted fields before continuing.
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 border-t border-forest/10 pt-6 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <button type="button" onClick={back} className="btn-secondary">
              ← Back
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <button type="submit" className="btn-primary">
              Continue →
            </button>
          ) : (
            <button type="submit" className="btn-primary" disabled={status === "submitting"} aria-busy={status === "submitting"}>
              {status === "submitting" ? "Sending…" : "Send my quote request"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
