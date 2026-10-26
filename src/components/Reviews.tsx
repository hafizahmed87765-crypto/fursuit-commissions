import { reviews, site, videoReview } from "@/content/site";
import VideoFacade from "./VideoFacade";

/**
 * Shows the client review video from the studio's YouTube channel, plus any
 * written testimonials the owner has confirmed in src/content/site.ts.
 * No star ratings, counts or "verified" badges are invented.
 */
export default function Reviews() {
  const confirmed = reviews.filter((r) => r.confirmed);
  return (
    <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div data-reveal>
        <VideoFacade id={videoReview.id} title={videoReview.title} />
        <p className="mt-3 text-sm text-ink-muted">{videoReview.title}, from our YouTube channel.</p>
      </div>
      <div data-reveal className="space-y-4">
        {confirmed.length ? (
          confirmed.slice(0, 3).map((r) => (
            <figure key={r.name} className="card p-6">
              <blockquote className="text-ink">“{r.quote}”</blockquote>
              <figcaption className="mt-3 font-display font-semibold text-forest">
                {r.name}
                {r.service ? <span className="ml-2 chip">{r.service}</span> : null}
              </figcaption>
            </figure>
          ))
        ) : (
          <div className="card p-6">
            <p className="font-display text-xl font-semibold text-forest">See finished suits on their new owners</p>
            <p className="mt-2 text-ink-muted">Clients share their suits and WIP updates with us on social media. Follow along to see recent builds and what owners say about them.</p>
          </div>
        )}
        <ul className="flex flex-wrap gap-2">
          {site.socials.map((s) => (
            <li key={s.name}>
              <a href={s.href} target="_blank" rel="noopener" className="btn-soft btn-sm">
                {s.name} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
