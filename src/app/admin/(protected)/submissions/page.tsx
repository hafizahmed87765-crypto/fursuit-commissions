import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateSubmission } from "@/app/admin/actions";

export default async function AdminSubmissions({ searchParams }: { searchParams: Promise<{ status?: string; form?: string; from?: string; to?: string }> }) {
  const filters = await searchParams;
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("form_submissions").select("id,form_id,form_name_snapshot,page_path,status,submitter_email,created_at,answers_snapshot", { count: "exact" }).order("created_at", { ascending: false }).limit(100);
  if (filters.status && ["new", "in_progress", "quoted", "approved", "completed", "archived"].includes(filters.status)) query = query.eq("status", filters.status);
  if (filters.form) query = query.eq("form_id", filters.form);
  if (filters.from) query = query.gte("created_at", new Date(`${filters.from}T00:00:00Z`).toISOString());
  if (filters.to) query = query.lte("created_at", new Date(`${filters.to}T23:59:59Z`).toISOString());
  const [{ data: submissions, count }, { data: forms }] = await Promise.all([query, supabase.from("cms_forms").select("id,name").order("name")]);
  return (
    <>
      <p className="eyebrow">Inbox</p><h1 className="mt-2 text-4xl font-bold">Inquiries</h1><p className="mt-3 text-ink-muted">{count ?? 0} matching records · showing up to 100 most recent</p>
      <form className="card mt-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="field-label">Status<select className="field mt-1" name="status" defaultValue={filters.status ?? ""}><option value="">All statuses</option>{["new", "in_progress", "quoted", "approved", "completed", "archived"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}</select></label>
        <label className="field-label">Form<select className="field mt-1" name="form" defaultValue={filters.form ?? ""}><option value="">All forms</option>{(forms ?? []).map((form) => <option key={form.id} value={form.id}>{form.name}</option>)}</select></label>
        <label className="field-label">From<input className="field mt-1" type="date" name="from" defaultValue={filters.from} /></label>
        <label className="field-label">To<input className="field mt-1" type="date" name="to" defaultValue={filters.to} /></label>
        <div className="flex items-end gap-2"><button className="btn-primary flex-1">Filter</button><a className="btn-secondary" href="/admin/submissions/">Clear</a></div>
      </form>
      <p className="mt-4"><a className="link" href={`/api/admin/submissions/export/?${new URLSearchParams(Object.entries(filters).filter(([, v]) => v) as [string, string][]).toString()}`}>Export matching rows as CSV</a></p>
      <ul className="mt-5 space-y-4">{(submissions ?? []).map((submission) => <li key={submission.id} className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-semibold">{submission.form_name_snapshot}</h2><p className="mt-1 text-sm text-ink-muted">{new Date(submission.created_at).toLocaleString()} · {submission.submitter_email || "No email field"} · {submission.page_path}</p></div><Link className="link" href={`/admin/submissions/${submission.id}/`}>Open details</Link></div>
        <p className="mt-3 line-clamp-2 text-sm text-ink-muted">{(submission.answers_snapshot ?? []).map((answer: { question: string; answer: unknown }) => `${answer.question}: ${Array.isArray(answer.answer) ? answer.answer.join(", ") : answer.answer}`).join(" · ")}</p>
        <form action={updateSubmission} className="mt-4 flex flex-wrap items-center gap-3"><input type="hidden" name="id" value={submission.id} /><label className="field-label">Status<select className="field mt-1 min-w-48" name="status" defaultValue={submission.status}>{["new", "in_progress", "quoted", "approved", "completed", "archived"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}</select></label><button className="btn-secondary self-end">Save status</button></form>
      </li>)}</ul>
      {!submissions?.length ? <p className="mt-8 text-ink-muted">No inquiries match these filters.</p> : null}
    </>
  );
}
