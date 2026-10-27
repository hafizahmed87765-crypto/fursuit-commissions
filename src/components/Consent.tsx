"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "fc-consent";
const GTM = process.env.NEXT_PUBLIC_GTM_ID;
const CLARITY = process.env.NEXT_PUBLIC_CLARITY_ID;

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function loadGtm(id: string) {
  if (document.getElementById("gtm")) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.id = "gtm";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

/** Microsoft Clarity (heatmaps and session recordings), loaded only after consent. */
function loadClarity(id: string) {
  if (document.getElementById("clarity")) return;
  const w = window as unknown as { clarity?: ClarityFn };
  w.clarity = w.clarity || Object.assign((...args: unknown[]) => { (w.clarity!.q = w.clarity!.q || []).push(args); }, {});
  const s = document.createElement("script");
  s.id = "clarity";
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

function loadAnalytics() {
  if (GTM) loadGtm(GTM);
  if (CLARITY) loadClarity(CLARITY);
}

/** Small, non-blocking cookie notice. Analytics only load after "Accept". */
export default function Consent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!GTM && !CLARITY) return;
    const choice = read();
    if (choice === "granted") loadAnalytics();
    else if (!choice) {
      const t = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  if ((!GTM && !CLARITY) || !show) return null;

  const decide = (v: "granted" | "denied") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    if (v === "granted") loadAnalytics();
    setShow(false);
  };

  return (
    <div role="region" aria-label="Cookie preferences" className="fixed inset-x-3 bottom-3 z-50 animate-rise sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="card p-5">
        <p className="text-sm text-ink">
          We'd like to use analytics cookies to understand which pages help visitors.{" "}
          <Link href="/privacy-policy/" className="link">
            Privacy policy
          </Link>
        </p>
        <div className="mt-4 flex gap-2">
          <button type="button" className="btn-primary btn-sm flex-1" onClick={() => decide("granted")}>
            Accept
          </button>
          <button type="button" className="btn-secondary btn-sm flex-1" onClick={() => decide("denied")}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
