"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { req, validateEmail, type Errors } from "@/lib/inquiry";
import { Honeypot, PrivacyConsent, SubmitFallback, TextField } from "./Fields";
import { useInquiry } from "./useInquiry";

export default function ContactForm() {
  const params = useSearchParams();
  const product = params.get("product");
  const [d, setD] = useState({
    name: "",
    email: "",
    topic: product ? `Product: ${product}` : "",
    message: product ? `Hi! I'd like to ask about "${product}".\n\n` : "",
    privacy: false,
    website: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const { status, error, serverErrors, submit } = useInquiry("contact");
  const set = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) => setD((p) => ({ ...p, [k]: v }));
  const err = (k: string) => errors[k] || serverErrors[k];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v: Errors = {};
    req(d.name, "Name", v, "name", 120);
    validateEmail(d.email, v);
    req(d.message, "Message", v, "message", 5000);
    if (!d.privacy) v.privacy = "Please agree to the privacy policy.";
    setErrors(v);
    if (Object.keys(v).length) {
      e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    if ((await submit({ ...d, privacy: d.privacy ? "yes" : "" })).ok) track("contact_form_submit_success");
  };

  if (status === "success") {
    return (
      <div className="card animate-rise p-8" role="status">
        <h2 className="text-2xl font-semibold">Message sent</h2>
        <p className="mt-2 text-ink-muted">Thanks, {d.name.split(" ")[0]}. We'll reply to {d.email} as soon as we can.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card relative space-y-5 p-5 sm:p-8" aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Your name" name="name" required autoComplete="name" value={d.name} onChange={(v) => set("name", v)} error={err("name")} maxLength={120} />
        <TextField label="Email" name="email" type="email" required autoComplete="email" value={d.email} onChange={(v) => set("email", v)} error={err("email")} maxLength={200} />
      </div>
      <TextField label="Topic" name="topic" value={d.topic} onChange={(v) => set("topic", v)} maxLength={200} />
      <TextField label="Message" name="message" required textarea rows={6} value={d.message} onChange={(v) => set("message", v)} error={err("message")} maxLength={5000} />
      <PrivacyConsent checked={d.privacy} onChange={(v) => set("privacy", v)} error={err("privacy")} />
      <Honeypot value={d.website} onChange={(v) => set("website", v)} />
      {status === "error" && error ? <SubmitFallback message={error} /> : null}
      <button type="submit" className="btn-primary" disabled={status === "submitting"} aria-busy={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
