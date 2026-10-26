import { requireCmsAdmin } from "@/lib/supabase/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const csv = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export async function GET(request: Request) {
  await requireCmsAdmin();
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const formId = url.searchParams.get("form");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const db = createSupabaseAdminClient();
  let query = db.from("form_submissions").select("id,form_name_snapshot,page_path,status,submitter_email,created_at,answers_snapshot").order("created_at", { ascending: false }).limit(5000);
  if (status && ["new", "in_progress", "quoted", "approved", "completed", "archived"].includes(status)) query = query.eq("status", status);
  if (formId) query = query.eq("form_id", formId);
  if (from) query = query.gte("created_at", new Date(`${from}T00:00:00Z`).toISOString());
  if (to) query = query.lte("created_at", new Date(`${to}T23:59:59Z`).toISOString());
  const { data } = await query;
  const rows = [["ID", "Form", "Page", "Status", "Email", "Received", "Answers"], ...(data ?? []).map((item) => [item.id, item.form_name_snapshot, item.page_path, item.status, item.submitter_email, item.created_at, JSON.stringify(item.answers_snapshot)])];
  return new Response(rows.map((row) => row.map(csv).join(",")).join("\r\n"), { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=inquiries.csv", "cache-control": "no-store" } });
}
