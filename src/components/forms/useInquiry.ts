"use client";

import { useRef, useState } from "react";
import type { Errors, InquiryKind } from "@/lib/inquiry";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Posts a form to /api/inquiry. Success is only reported when the server
 * confirms the email was handed to the mail server (HTTP 200 + ok:true).
 */
export function useInquiry(kind: InquiryKind) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<Errors>({});
  const inFlight = useRef(false);

  async function submit(fields: Record<string, string | string[] | undefined>, files: File[] = []) {
    if (inFlight.current) return { ok: false, errors: {} as Errors }; // guard against double submits
    inFlight.current = true;
    setStatus("submitting");
    setError(null);
    setServerErrors({});
    const fd = new FormData();
    fd.set("kind", kind);
    for (const [k, v] of Object.entries(fields)) {
      if (v === undefined) continue;
      if (Array.isArray(v)) v.forEach((x) => fd.append(k, x));
      else fd.set(k, v);
    }
    files.forEach((f) => fd.append("files", f, f.name));
    try {
      const res = await fetch("/api/inquiry/", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: Errors };
      if (res.ok && data.ok) {
        setStatus("success");
        return { ok: true, errors: {} as Errors };
      }
      setServerErrors(data.errors ?? {});
      setError(data.error ?? (data.errors ? "Please fix the highlighted fields." : "Something went wrong and your request was not sent."));
      setStatus("error");
      return { ok: false, errors: data.errors ?? {} };
    } catch {
      setError("We couldn't reach our server. Check your connection; your answers are still here.");
      setStatus("error");
      return { ok: false, errors: {} as Errors };
    } finally {
      inFlight.current = false;
    }
  }

  return { status, error, serverErrors, submit };
}
