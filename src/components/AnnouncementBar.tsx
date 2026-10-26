import Link from "next/link";
import { site } from "@/content/site";
import { ANNOUNCEMENT_KEY } from "@/lib/announcement";
import DismissAnnouncement from "./DismissAnnouncement";

/**
 * Inline script for <head>: hides the bar before first paint if the visitor
 * already dismissed this exact message. A new message text shows again.
 */
export function announcementScript() {
  const a = site.announcement;
  if (!a.enabled) return "";
  return `try{if(localStorage.getItem(${JSON.stringify(ANNOUNCEMENT_KEY)})===${JSON.stringify(a.text)})document.documentElement.setAttribute("data-ann-dismissed","")}catch(e){}`;
}

export default function AnnouncementBar() {
  const a = site.announcement;
  if (!a.enabled) return null;
  return (
    <div id="announcement" className="announcement bg-forest text-white">
      <div className="container-x flex min-h-10 items-center gap-2 py-2">
        <p className="flex flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className={`h-2 w-2 rounded-full ${a.status === "open" ? "bg-mint-light motion-safe:animate-pulse" : "bg-blush"}`} />
            {a.text}
          </span>
          <Link href={a.link.href} className="font-semibold text-mint-light underline underline-offset-4 hover:text-white">
            {a.link.label}
          </Link>
        </p>
        <DismissAnnouncement text={a.text} />
      </div>
    </div>
  );
}
