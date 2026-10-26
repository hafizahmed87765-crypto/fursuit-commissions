import { differentiators } from "@/content/site";

export default function WhyUs() {
  return (
    <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      {differentiators.map((d, i) => (
        <li key={d.title} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 70}ms` }} className="border-l-4 border-mint pl-5">
          <h3 className="text-xl font-semibold">{d.title}</h3>
          <p className="mt-1 text-ink-muted">{d.body}</p>
        </li>
      ))}
    </ul>
  );
}
