import Link from "next/link";
import { site } from "@/content/site";

export default function AnnouncementBar() {
  const a = site.announcement;
  if (!a.enabled) return null;
  return (
    <div className="bg-forest text-white">
      <p className="container-x flex min-h-10 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center text-sm">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className={`h-2 w-2 rounded-full ${a.status === "open" ? "bg-mint-light" : "bg-blush"}`} />
          {a.text}
        </span>
        <Link href={a.link.href} className="font-semibold text-mint-light underline underline-offset-4 hover:text-white">
          {a.link.label}
        </Link>
      </p>
    </div>
  );
}
