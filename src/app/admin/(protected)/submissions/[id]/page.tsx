import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { addSubmissionNote, updateSubmission } from "@/app/admin/actions";

export default async function SubmissionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await createSupabaseServerClient();
  const [{ data: submission }, { data: answers }, { data: notes }, { data: attachments }] = await Promise.all([
    db.from("form_submissions").select("*").eq("id", id).maybeSingle(),
    db.from("submission_answers").select("*").eq("submission_id", id).order("position"),
    db.from("submission_notes").select("id,note,created_at,author_id").eq("submission_id", id).order("created_at", { ascending: false }),
    db.from("submission_attachments").select("id,original_name,created_at").eq("submission_id", id),
  ]);
  if (!submission) notFound();
  return (
    <>
      <Link className="link" href="/admin/submissions/">← All inquiries</Link>
      <p className="eyebrow mt-6">{submission.form_name_snapshot}</p><h1 className="mt-2 text-4xl font-bold">Inquiry details</h1>
      <p className="mt-3 text-ink-muted">Received {new Date(submission.created_at).toLocaleString()} from {submission.submitter_email || "an anonymous visitor"} on {submission.page_path}</p>
      <form action={updateSubmission} className="card mt-6 flex flex-wrap items-end gap-3 p-4"><input type="hidden" name="id" value={id} /><label className="field-label">Status<select className="field mt-1 min-w-48" name="status" defaultValue={submission.status}>{["new", "in_progress", "quoted", "approved", "completed", "archived"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}</select></label><button className="btn-primary">Save status</button></form>
      <section className="card mt-6 p-6"><h2 className="text-2xl font-semibold">Answers (original form snapshot)</h2><dl className="mt-4 divide-y divide-forest/10">{(answers ?? []).map((answer) => <div key={answer.id} className="grid gap-1 py-4 sm:grid-cols-[220px_1fr]"><dt className="font-semibold">{answer.question_snapshot}</dt><dd className="whitespace-pre-line text-ink-muted">{Array.isArray(answer.answer) ? answer.answer.join(", ") : String(answer.answer ?? "—")}</dd></div>)}</dl></section>
      <section className="card mt-6 p-6"><h2 className="text-2xl font-semibold">Private attachments</h2><ul className="mt-3 space-y-2">{(attachments ?? []).map((attachment) => <li key={attachment.id}><a className="link" href={`/api/admin/submissions/attachments/${attachment.id}/`}>{attachment.original_name}</a></li>)}</ul>{!attachments?.length ? <p className="mt-2 text-ink-muted">No files attached.</p> : null}</section>
      <section className="card mt-6 p-6"><h2 className="text-2xl font-semibold">Internal notes</h2><form action={addSubmissionNote} className="mt-4"><input type="hidden" name="id" value={id} /><label className="field-label">Private note<textarea className="field mt-1" name="note" rows={4} maxLength={10000} required /></label><button className="btn-primary mt-3">Add note</button></form><ul className="mt-5 space-y-3">{(notes ?? []).map((note) => <li key={note.id} className="rounded-xl bg-mint-wash p-4"><p className="whitespace-pre-line">{note.note}</p><p className="mt-2 text-xs text-ink-muted">{new Date(note.created_at).toLocaleString()}</p></li>)}</ul></section>
    </>
  );
}
