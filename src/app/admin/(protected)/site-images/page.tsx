import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteImageOverrides, getSiteImages, siteImageSlots, type SlotId } from "@/lib/site-images";
import { replaceSiteImage, resetSiteImage, updateSiteImageAlt } from "@/app/admin/actions";

export default async function AdminSiteImages({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, supabase, images, overrides] = await Promise.all([searchParams, createSupabaseServerClient(), getSiteImages(), getSiteImageOverrides()]);
  const { error: tableError } = await supabase.from("site_images").select("slot").limit(1);
  const ids = Object.keys(siteImageSlots) as SlotId[];
  const pages = [...new Set(ids.map((id) => siteImageSlots[id].page))];

  return (
    <>
      <p className="eyebrow">Library</p>
      <h1 className="mt-2 text-4xl font-bold">Site images</h1>
      <p className="mt-3 max-w-3xl text-ink-muted">
        Replace the fixed photos on the website: the homepage hero, style badges, coverage cards, page banners, workshop photos and process steps. Slot IDs match
        <code className="mx-1">docs/IMAGE-REPLACEMENT-SHEET.csv</code>. Until a slot is replaced it shows the original photo, and you can reset it at any time.
        Photo galleries (Kemono, Toony, gallery page…) are managed under <a className="link" href="/admin/galleries/">Galleries</a>.
      </p>
      {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-800">{error}</p> : null}
      {tableError ? (
        <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-rose-950">
          Before replacing photos, run <code>supabase/migrations/202610270002_site_images.sql</code> in the Supabase SQL Editor.
        </p>
      ) : null}

      <nav aria-label="Jump to page" className="mt-6 flex flex-wrap gap-2">
        {pages.map((page) => (
          <a key={page} href={`#page-${page.replace(/\W+/g, "-")}`} className="chip">{page}</a>
        ))}
      </nav>

      {pages.map((page) => (
        <section key={page} id={`page-${page.replace(/\W+/g, "-")}`} className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-bold">{page}</h2>
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {ids.filter((id) => siteImageSlots[id].page === page).map((id) => {
              const slot = siteImageSlots[id];
              const current = images[id];
              const replaced = Boolean(overrides[id]);
              return (
                <li key={id} id={`slot-${id}`} className="flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border-2 border-forest/10 bg-white">
                  <div className="relative bg-forest/5">
                    {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of local or Supabase image */}
                    <img src={current.src} alt={current.alt} className="aspect-[4/3] w-full object-cover" />
                    <span className="absolute left-2 top-2 rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-forest shadow">{id}</span>
                    <span className={`absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-bold shadow ${replaced ? "bg-mint text-forest" : "bg-white text-ink-muted"}`}>
                      {replaced ? "Replaced" : "Original"}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div>
                      <p className="font-display font-semibold text-forest">{slot.label}</p>
                      <p className="text-sm text-ink-muted">Best shape: {slot.shape} · at least 1,600 px on the long edge</p>
                    </div>
                    <form action={replaceSiteImage} className="grid gap-2">
                      <input type="hidden" name="slot" value={id} />
                      <label className="field-label">New photo
                        <input className="field mt-1 text-sm" type="file" name="file" accept="image/jpeg,image/png,image/webp" required />
                      </label>
                      <label className="field-label">Alt text (describe the photo)
                        <input className="field mt-1" name="alt" defaultValue={replaced ? current.alt : ""} placeholder={slot.alt || "e.g. Pink Kemono bunny fursuit head"} />
                      </label>
                      <button className="btn-primary btn-sm justify-self-start">{replaced ? "Replace again" : "Replace photo"}</button>
                    </form>
                    {replaced ? (
                      <div className="mt-auto flex flex-wrap items-end gap-3 border-t border-forest/10 pt-3">
                        <form action={updateSiteImageAlt} className="flex min-w-0 flex-1 gap-2">
                          <input type="hidden" name="slot" value={id} />
                          <label className="sr-only" htmlFor={`alt-${id}`}>Alt text</label>
                          <input id={`alt-${id}`} className="field min-w-0 flex-1 py-2 text-sm" name="alt" defaultValue={current.alt} />
                          <button className="btn-soft btn-sm">Save alt</button>
                        </form>
                        <form action={resetSiteImage}>
                          <input type="hidden" name="slot" value={id} />
                          <button className="text-sm text-red-700 underline">Reset to original</button>
                        </form>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
