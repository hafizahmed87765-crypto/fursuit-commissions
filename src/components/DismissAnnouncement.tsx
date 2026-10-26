"use client";

import { ANNOUNCEMENT_KEY } from "@/lib/announcement";

export default function DismissAnnouncement({ text }: { text: string }) {
  return (
    <button
      type="button"
      aria-label="Dismiss announcement"
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-mint-light transition hover:bg-white/10 hover:text-white"
      onClick={() => {
        try {
          localStorage.setItem(ANNOUNCEMENT_KEY, text);
        } catch {}
        const bar = document.getElementById("announcement");
        bar?.classList.add("is-dismissing");
        // Let the collapse animation play, then hide for good.
        window.setTimeout(() => document.documentElement.setAttribute("data-ann-dismissed", ""), 250);
      }}
    >
      <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4">
        <path fill="currentColor" d="M5.3 4 10 8.6 14.7 4 16 5.3 11.4 10l4.6 4.7-1.3 1.3L10 11.4 5.3 16 4 14.7 8.6 10 4 5.3z" />
      </svg>
    </button>
  );
}
