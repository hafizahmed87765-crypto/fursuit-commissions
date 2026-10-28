import Link from "next/link";
import { breadcrumbLd, type Crumb } from "@/lib/seo";
import JsonLd from "./JsonLd";

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-ink-muted">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1.5">
              {i > 0 ? <span aria-hidden>/</span> : null}
              {i === all.length - 1 ? (
                <span aria-current="page" className="font-semibold text-forest">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="transition-colors hover:text-forest">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(all)} />
    </>
  );
}
