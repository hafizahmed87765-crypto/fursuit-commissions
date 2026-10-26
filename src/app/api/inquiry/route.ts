import { NextResponse } from "next/server";
import { COVERAGE, SERVICES, validateInquiry, type InquiryKind } from "@/lib/inquiry";
import { mailConfigured, sendToStudio, type Attachment } from "@/lib/mailer";

export const runtime = "nodejs";

// Best-effort in-memory throttle (per server instance): 5 submissions / 10 min / IP.
const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const label = <T extends readonly { value: string; label: string }[]>(list: T, v?: string) => list.find((x) => x.value === v)?.label ?? v;

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "The form could not be read. Please try again." }, { status: 400 });
  }

  const kind = String(form.get("kind")) as InquiryKind;
  if (!["quote", "repair", "contact"].includes(kind)) return NextResponse.json({ ok: false, error: "Unknown form." }, { status: 400 });

  // Honeypot: real visitors never see or fill this field. Respond as an error
  // rather than a fake success so the client never shows a false confirmation.
  if (String(form.get("website") ?? "")) return NextResponse.json({ ok: false, error: "Submission rejected." }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (throttled(ip)) return NextResponse.json({ ok: false, error: "Too many submissions. Please wait a few minutes and try again." }, { status: 429 });

  const fields: Record<string, string> = {};
  const files: File[] = [];
  for (const [k, v] of form.entries()) {
    if (typeof v === "string") fields[k] = fields[k] ? `${fields[k]}, ${v}` : v.slice(0, 6000);
    else if (v.size > 0) files.push(v);
  }

  const errors = validateInquiry(kind, fields, files);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  if (!mailConfigured()) {
    console.error("[inquiry] SMTP is not configured; refusing to accept a submission that cannot be delivered.");
    return NextResponse.json({ ok: false, error: "Our inquiry inbox is temporarily unavailable, so your request was not sent." }, { status: 503 });
  }

  const attachments: Attachment[] = await Promise.all(
    files.map(async (f) => ({ filename: f.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120), content: Buffer.from(await f.arrayBuffer()), contentType: f.type })),
  );

  const f = fields;
  const subjects: Record<InquiryKind, string> = {
    quote: `Quote request: ${label(SERVICES, f.service)} – ${label(COVERAGE, f.coverage) ?? ""} – ${f.name}`,
    repair: `Repair assessment: ${f.repairType} – ${f.name}`,
    contact: `Website message from ${f.name}`,
  };
  const rows: Record<InquiryKind, [string, string | undefined][]> = {
    quote: [
      ["Name", f.name],
      ["Email", f.email],
      ["Other contact", f.contact],
      ["Service", label(SERVICES, f.service)],
      ["Coverage", label(COVERAGE, f.coverage)],
      ["Parts", f.parts],
      ["Character name", f.characterName],
      ["Species", f.species],
      ["Design / customisation", f.design],
      ["Leg style", f.legs],
      ["Has reference sheet", f.hasRef],
      ["Reference links", f.links],
      ["Budget", f.budget],
      ["Desired timing", f.timing],
      ["Interested in payment plan", f.paymentPlan],
      ["Notes", f.notes],
      ["Came from", f.source],
    ],
    repair: [
      ["Name", f.name],
      ["Email", f.email],
      ["Original maker", f.maker],
      ["Repair type", f.repairType],
      ["Problem", f.problem],
      ["Suit age / history", f.history],
      ["Desired timing", f.timing],
      ["Notes", f.notes],
    ],
    contact: [
      ["Name", f.name],
      ["Email", f.email],
      ["Topic", f.topic],
      ["Message", f.message],
    ],
  };

  try {
    await sendToStudio({ subject: subjects[kind].slice(0, 200), replyTo: f.email, rows: rows[kind], attachments });
  } catch (err) {
    console.error("[inquiry] send failed", err);
    return NextResponse.json({ ok: false, error: "We couldn't deliver your request just now. Nothing was sent." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
