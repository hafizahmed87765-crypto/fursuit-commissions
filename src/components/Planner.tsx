"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { track } from "@/lib/analytics";

type Service = "custom" | "kemono" | "toony" | "repair";
type Coverage = "head" | "partial" | "fullsuit" | "parts";
type State = { service?: Service; coverage?: Coverage; parts: string[]; legs?: string; hasRef?: "yes" | "no" };

const SERVICE_OPTS: { value: Service; label: string; hint: string }[] = [
  { value: "custom", label: "Custom fursuit", hint: "Any species or style" },
  { value: "kemono", label: "Kemono", hint: "Anime-inspired, big eyes" },
  { value: "toony", label: "Toony", hint: "Bold cartoon features" },
  { value: "repair", label: "Repair an existing suit", hint: "Assessment from photos" },
];
const COVERAGE_OPTS: { value: Coverage; label: string; hint: string }[] = [
  { value: "head", label: "Just a head", hint: "The centrepiece" },
  { value: "partial", label: "Partial", hint: "Head, hand paws, tail" },
  { value: "fullsuit", label: "Fullsuit", hint: "Head to feet paws" },
  { value: "parts", label: "Individual parts", hint: "Paws, tail…" },
];
const PART_OPTS = ["Hand paws", "Feet paws", "Tail", "Ears / headband"];

const coverageName: Record<Coverage, string> = { head: "fursuit head", partial: "partial", fullsuit: "fullsuit", parts: "set of parts" };
const serviceName: Record<Exclude<Service, "repair">, string> = { custom: "custom", kemono: "Kemono", toony: "Toony" };
const servicePage: Record<Service, string> = { custom: "/fursuit-commission/", kemono: "/kemono-fursuits/", toony: "/toony-fursuits/", repair: "/fursuit-repairs/" };

function Choice({ name, value, checked, onChange, label, hint, type = "radio" }: { name: string; value: string; checked: boolean; onChange: () => void; label: string; hint?: string; type?: "radio" | "checkbox" }) {
  return (
    <label className="choice">
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} className="mt-1 h-5 w-5 border-forest/30 text-forest focus:ring-mint-deep" />
      <span>
        <span className="block font-display font-semibold text-forest">{label}</span>
        {hint ? <span className="block text-sm text-ink-muted">{hint}</span> : null}
      </span>
    </label>
  );
}

/**
 * Guided "what do I need?" helper. It never shows a price; it routes the
 * visitor to the right page or to the quote form with their answers prefilled.
 */
export default function Planner() {
  const [s, setS] = useState<State>({ parts: [] });
  const [started, setStarted] = useState(false);

  const update = (patch: Partial<State>) => {
    if (!started) {
      setStarted(true);
      track("commission_planner_start");
    }
    setS((prev) => ({ ...prev, ...patch }));
  };

  // Questions appear progressively based on earlier answers.
  const steps = useMemo(() => {
    const list: string[] = ["service"];
    if (!s.service || s.service === "repair") return list;
    list.push("coverage");
    if (s.coverage === "parts") list.push("parts");
    if (s.coverage === "head") list.push("addons");
    if (s.coverage === "fullsuit") list.push("legs");
    if (s.coverage) list.push("ref");
    return list;
  }, [s.service, s.coverage]);

  const done = s.service === "repair" || (s.coverage && s.hasRef && (s.coverage !== "parts" || s.parts.length > 0));

  const quoteHref = useMemo(() => {
    if (!s.service || s.service === "repair") return "/fursuit-repairs/#repair-form";
    const q = new URLSearchParams({ service: s.service, source: "planner" });
    if (s.coverage) q.set("coverage", s.coverage);
    if (s.parts.length) q.set("parts", s.parts.join(","));
    if (s.legs) q.set("legs", s.legs);
    if (s.hasRef) q.set("hasRef", s.hasRef);
    return `/get-a-quote/?${q}`;
  }, [s]);

  const togglePart = (p: string) => update({ parts: s.parts.includes(p) ? s.parts.filter((x) => x !== p) : [...s.parts, p] });

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()} aria-label="Commission planner">
        <fieldset data-reveal>
          <legend className="font-display text-lg font-semibold text-forest">1. What are you looking for?</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {SERVICE_OPTS.map((o) => (
              <Choice key={o.value} name="p-service" value={o.value} label={o.label} hint={o.hint} checked={s.service === o.value} onChange={() => update({ service: o.value })} />
            ))}
          </div>
        </fieldset>

        {steps.includes("coverage") ? (
          <fieldset className="animate-rise">
            <legend className="font-display text-lg font-semibold text-forest">2. How much coverage?</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {COVERAGE_OPTS.map((o) => (
                <Choice key={o.value} name="p-coverage" value={o.value} label={o.label} hint={o.hint} checked={s.coverage === o.value} onChange={() => update({ coverage: o.value, parts: [], legs: undefined })} />
              ))}
            </div>
          </fieldset>
        ) : null}

        {steps.includes("parts") || steps.includes("addons") ? (
          <fieldset className="animate-rise">
            <legend className="font-display text-lg font-semibold text-forest">3. {s.coverage === "head" ? "Add matching parts? (optional)" : "Which parts?"}</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {PART_OPTS.map((p) => (
                <Choice key={p} type="checkbox" name="p-parts" value={p} label={p} checked={s.parts.includes(p)} onChange={() => togglePart(p)} />
              ))}
            </div>
          </fieldset>
        ) : null}

        {steps.includes("legs") ? (
          <fieldset className="animate-rise">
            <legend className="font-display text-lg font-semibold text-forest">3. Leg style preference</legend>
            <p className="text-sm text-ink-muted">We'll confirm what suits your design in your quote.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {["Plantigrade (human-like)", "Digitigrade (padded animal legs)", "Not sure"].map((l) => (
                <Choice key={l} name="p-legs" value={l} label={l} checked={s.legs === l} onChange={() => update({ legs: l })} />
              ))}
            </div>
          </fieldset>
        ) : null}

        {steps.includes("ref") ? (
          <fieldset className="animate-rise">
            <legend className="font-display text-lg font-semibold text-forest">{steps.length}. Do you have a reference sheet?</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Choice name="p-ref" value="yes" label="Yes, I have one" checked={s.hasRef === "yes"} onChange={() => update({ hasRef: "yes" })} />
              <Choice name="p-ref" value="no" label="Not yet" hint="Our artists can draw one" checked={s.hasRef === "no"} onChange={() => update({ hasRef: "no" })} />
            </div>
          </fieldset>
        ) : null}
      </form>

      <aside aria-live="polite" className="lg:sticky lg:top-28 lg:self-start">
        <div className="card overflow-hidden">
          <div className="bg-mint p-6">
            <p className="eyebrow !text-forest">Your recommendation</p>
            <p className="mt-2 font-display text-2xl font-semibold text-forest">
              {!s.service
                ? "Answer a couple of questions"
                : s.service === "repair"
                  ? "A repair assessment"
                  : s.coverage
                    ? `A ${serviceName[s.service]} ${coverageName[s.coverage]}`
                    : `A ${serviceName[s.service]} commission`}
            </p>
          </div>
          <div className="space-y-4 p-6 text-ink-muted">
            {!s.service ? <p>Pick a service to see where to start. It takes under a minute and you can skip it at any time.</p> : null}
            {s.service === "repair" ? <p>Send clear photos of the suit and the damage. We'll tell you whether we can take it on and quote before anything is shipped.</p> : null}
            {s.service && s.service !== "repair" && s.parts.length ? <p>Including: {s.parts.join(", ")}.</p> : null}
            {s.legs ? <p>Leg style: {s.legs}.</p> : null}
            {s.hasRef === "no" ? (
              <p>
                You'll need a reference sheet before production starts.{" "}
                <Link href="/furry-ref-sheet-commissions/" className="link">
                  We can draw one for you
                </Link>
                . You can still request a quote now.
              </p>
            ) : null}
            {s.hasRef === "yes" ? <p>Great. Upload it in the quote form so we can price your design accurately.</p> : null}
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href={quoteHref}
                aria-disabled={!done}
                onClick={() => done && track("commission_planner_complete", { service: s.service, coverage: s.coverage })}
                className={`btn-primary ${done ? "" : "pointer-events-none opacity-50"}`}
                tabIndex={done ? undefined : -1}
              >
                {s.service === "repair" ? "Request a Repair Assessment" : "Continue to your quote"}
              </Link>
              {s.service ? (
                <Link href={servicePage[s.service]} className="btn-secondary">
                  Learn more first
                </Link>
              ) : (
                <Link href="/get-a-quote/" className="link text-center">
                  Skip and go straight to the quote form
                </Link>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
