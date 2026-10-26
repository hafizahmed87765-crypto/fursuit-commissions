import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mailConfigured, sendToStudio } from "@/lib/mailer";

export const runtime = "nodejs";
const fileTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif", "application/pdf"]);
const requests = new Map<string, number[]>();

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let formData: FormData;
  try { formData = await request.formData(); }
  catch { return NextResponse.json({ error: "The form could not be read." }, { status: 400 }); }
  if (String(formData.get("website") ?? "")) return NextResponse.json({ error: "Submission rejected." }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const recent = (requests.get(ip) ?? []).filter((time) => Date.now() - time < 10 * 60_000);
  if (recent.length >= 5) return NextResponse.json({ error: "Too many inquiries. Please wait a few minutes and try again." }, { status: 429 });
  recent.push(Date.now()); requests.set(ip, recent);

  const db = createSupabaseAdminClient();
  const { data: cmsForm } = await db.from("cms_forms").select("id,name,slug,submit_label,success_message,current_version,is_published").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (!cmsForm) return NextResponse.json({ error: "This inquiry form is unavailable." }, { status: 404 });
  const pagePath = String(formData.get("page_path") ?? `/forms/${slug}/`).slice(0, 250);
  if (pagePath !== `/forms/${slug}/`) {
    const { data: assignment } = await db.from("form_pages").select("id").eq("form_id", cmsForm.id).eq("page_path", pagePath).maybeSingle();
    if (!assignment) return NextResponse.json({ error: "This form is not assigned to that page." }, { status: 400 });
  }
  const { data: fields } = await db.from("form_fields").select("field_key,label,field_type,is_required,options,condition,position").eq("form_id", cmsForm.id).order("position");
  const { data: notification } = await db.from("form_notification_settings").select("recipient_email").eq("form_id", cmsForm.id).maybeSingle();
  if (!fields?.length) return NextResponse.json({ error: "This form has no fields configured." }, { status: 503 });

  const values: Record<string, string | string[]> = {};
  const uploads: { fieldKey: string; file: File }[] = [];
  for (const field of fields) {
    const entries = formData.getAll(field.field_key);
    const strings = entries.filter((entry): entry is string => typeof entry === "string").map((entry) => entry.slice(0, 6000));
    const files = entries.filter((entry): entry is File => entry instanceof File && entry.size > 0);
    if (files.length) uploads.push(...files.map((file) => ({ fieldKey: field.field_key, file })));
    if (strings.length) values[field.field_key] = field.field_type === "checkbox" ? strings : strings[0];
  }

  const errors: string[] = [];
  for (const field of fields) {
    const condition = field.condition as { field?: string; equals?: string } | null;
    const parentValue = condition?.field ? values[condition.field] : undefined;
    const visible = !condition || (Array.isArray(parentValue) ? parentValue.includes(condition.equals ?? "") : parentValue === condition.equals);
    if (!visible) continue;
    const value = values[field.field_key];
    const fileValue = uploads.some((upload) => upload.fieldKey === field.field_key);
    if (field.is_required && !(fileValue || (Array.isArray(value) ? value.length : Boolean(value?.trim())))) errors.push(`${field.label} is required.`);
    if (field.field_type === "email" && typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) errors.push(`Enter a valid ${field.label.toLowerCase()}.`);
  }
  const privacy = formData.get("privacy") === "yes";
  if (!privacy) errors.push("Agree to the privacy policy to continue.");
  if (uploads.length > 5 || uploads.some(({ file }) => file.size > 8 * 1024 * 1024 || !fileTypes.has(file.type)) || uploads.reduce((total, item) => total + item.file.size, 0) > 20 * 1024 * 1024) {
    errors.push("Attachments must be supported image/PDF files, up to 8 MB each and 20 MB total (maximum 5 files).");
  }
  if (errors.length) return NextResponse.json({ error: errors.join(" ") }, { status: 422 });

  const { data: version } = await db.from("form_versions").select("id,definition").eq("form_id", cmsForm.id).eq("version", cmsForm.current_version).maybeSingle();
  const definitionSnapshot = version?.definition ?? { name: cmsForm.name, slug: cmsForm.slug, fields };
  const answersSnapshot = fields.map((field) => ({ key: field.field_key, question: field.label, answer: values[field.field_key] ?? uploads.filter((u) => u.fieldKey === field.field_key).map((u) => u.file.name) }));
  const emailField = fields.find((field) => field.field_type === "email");
  const submitterEmail = emailField && typeof values[emailField.field_key] === "string" ? values[emailField.field_key] as string : null;
  const { data: submission, error: submissionError } = await db.from("form_submissions").insert({
    form_id: cmsForm.id, form_version_id: version?.id ?? null, form_name_snapshot: cmsForm.name,
    form_definition_snapshot: definitionSnapshot, page_path: pagePath, answers_snapshot: answersSnapshot,
    submitter_email: submitterEmail,
  }).select("id").single();
  if (submissionError || !submission) return NextResponse.json({ error: "We couldn't save your inquiry. Please try again later." }, { status: 503 });

  const answers = fields.map((field) => ({ submission_id: submission.id, field_key: field.field_key, question_snapshot: field.label, answer: values[field.field_key] ?? uploads.filter((u) => u.fieldKey === field.field_key).map((u) => u.file.name), position: field.position }));
  const { error: answerError } = await db.from("submission_answers").insert(answers);
  if (answerError) console.error("[cms-form] answers were saved in the submission snapshot but not normalized", answerError.message);

  const storedFiles: string[] = [];
  for (const { fieldKey, file } of uploads) {
    const safeName = file.name.replace(/[^\w.-]+/g, "_").slice(-100) || "attachment";
    const path = `submissions/${submission.id}/${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await db.storage.from("cms-private").upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
    if (uploadError) { console.error("[cms-form] private upload failed", uploadError.message); continue; }
    const { data: media } = await db.from("media_assets").insert({ storage_bucket: "cms-private", storage_path: path, original_name: file.name.slice(0, 255), mime_type: file.type, size_bytes: file.size, alt_text: "", caption: `Submission field: ${fieldKey}`, is_public: false }).select("id").single();
    if (media) {
      await db.from("submission_attachments").insert({ submission_id: submission.id, media_id: media.id, original_name: file.name.slice(0, 255) });
      storedFiles.push(file.name);
    }
  }

  if (mailConfigured()) {
    try {
      const rows = fields.map((field) => [field.label, Array.isArray(values[field.field_key]) ? (values[field.field_key] as string[]).join(", ") : values[field.field_key] as string | undefined] as [string, string | undefined]);
      if (storedFiles.length) rows.push(["Private attachments", storedFiles.join(", ")]);
      await sendToStudio({ subject: `Website inquiry: ${cmsForm.name}`, replyTo: submitterEmail || process.env.OWNER_EMAIL!, rows, to: notification?.recipient_email || undefined });
    } catch (error) { console.error("[cms-form] email notification failed; inquiry remains in the admin inbox", error); }
  }

  return NextResponse.json({ ok: true, message: cmsForm.success_message });
}
