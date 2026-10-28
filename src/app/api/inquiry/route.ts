import { NextResponse } from "next/server";
import { COVERAGE, SERVICES, validateInquiry, type InquiryKind } from "@/lib/inquiry";
import { mailConfigured, sendToStudio, type Attachment } from "@/lib/mailer";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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
const fieldLabels: Record<string, string> = {
  name: "Name", email: "Email", contact: "Other contact", service: "Service", coverage: "Coverage", parts: "Parts",
  characterName: "Character name", species: "Species", design: "Design details", legs: "Leg style", hasRef: "Has a reference sheet",
  links: "Reference links", budget: "Budget", timing: "Desired timing", paymentPlan: "Interested in a payment plan",
  planSchedule: "Preferred plan schedule", maker: "Original maker", repairType: "Repair type", problem: "Problem description",
  history: "Suit age and history", topic: "Topic", message: "Message", notes: "Additional notes", source: "Page source",
};

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

  const databaseRequested = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!databaseRequested && !mailConfigured()) return NextResponse.json({ ok: false, error: "Our inquiry inbox is temporarily unavailable, so your request was not sent." }, { status: 503 });

  const attachments: Attachment[] = await Promise.all(
    files.map(async (f) => ({ filename: f.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120), content: Buffer.from(await f.arrayBuffer()), contentType: f.type })),
  );

  const f = fields;
  const subjects: Record<InquiryKind, string> = {
    quote: `Quote request: ${label(SERVICES, f.service)}, ${label(COVERAGE, f.coverage) ?? ""} (${f.name})`,
    repair: `Repair assessment: ${f.repairType} (${f.name})`,
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
      ["Preferred plan schedule", f.planSchedule],
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

  let savedSubmissionId: string | null = null;
  if (databaseRequested) {
    try {
      const db = createSupabaseAdminClient();
      const snapshot = Object.entries(fields).map(([key, answer]) => ({ key, question: fieldLabels[key] || key, answer }));
      const { data: saved, error: saveError } = await db.from("form_submissions").insert({
        form_name_snapshot: `${kind[0].toUpperCase()}${kind.slice(1)} inquiry`,
        form_definition_snapshot: { kind, fields: Object.keys(fields).map((key) => ({ key, label: fieldLabels[key] || key, field_type: "text" })) },
        page_path: fields.source || `/${kind}/`, answers_snapshot: snapshot, submitter_email: fields.email || null,
      }).select("id").single();
      if (saveError || !saved) throw saveError || new Error("Submission was not saved.");
      savedSubmissionId = saved.id;

      for (const file of files) {
        const safeName = file.name.replace(/[^\w.-]+/g, "_").slice(-100) || "attachment";
        const storagePath = `submissions/${saved.id}/${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await db.storage.from("cms-private").upload(storagePath, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
        if (uploadError) throw uploadError;
        const { data: media, error: mediaError } = await db.from("media_assets").insert({
          storage_bucket: "cms-private", storage_path: storagePath, original_name: file.name.slice(0, 255),
          mime_type: file.type, size_bytes: file.size, is_public: false,
        }).select("id").single();
        if (mediaError || !media) throw mediaError || new Error("Attachment metadata was not saved.");
        const { error: attachmentError } = await db.from("submission_attachments").insert({ submission_id: saved.id, media_id: media.id, original_name: file.name.slice(0, 255) });
        if (attachmentError) throw attachmentError;
      }
      const answerRows = Object.entries(fields).map(([key, answer], position) => ({ submission_id: saved.id, field_key: key, question_snapshot: fieldLabels[key] || key, answer, position }));
      const { error: answersError } = await db.from("submission_answers").insert(answerRows);
      if (answersError) console.error("[inquiry] normalized answers were not saved; full snapshot is retained", answersError.message);
    } catch (err) {
      console.error("[inquiry] database save failed", err);
      if (!savedSubmissionId) return NextResponse.json({ ok: false, error: "We couldn't safely save your request. Please try again later." }, { status: 503 });
      // The main inquiry row is durable now. Avoid asking the customer to
      // resubmit and potentially duplicate it if only an attachment failed.
      console.error("[inquiry] inquiry was saved, but an attachment may be missing");
    }
  }

  if (mailConfigured()) {
    try {
      await sendToStudio({ subject: subjects[kind].slice(0, 200), replyTo: f.email, rows: rows[kind], attachments });
    } catch (err) {
      console.error("[inquiry] email notification failed", err);
      if (!savedSubmissionId) return NextResponse.json({ ok: false, error: "We couldn't deliver your request just now. Nothing was sent." }, { status: 502 });
    }
  }
  return NextResponse.json({ ok: true });
}
