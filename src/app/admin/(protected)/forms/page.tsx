import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCmsForm, publishCmsForm, updateCmsForm } from "@/app/admin/actions";

const starter = '[\n  { "key": "name", "label": "Your name", "type": "text", "required": true },\n  { "key": "email", "label": "Email address", "type": "email", "required": true },\n  { "key": "message", "label": "Tell us about your commission", "type": "textarea", "required": true }\n]';

export default async function AdminForms({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, supabase] = await Promise.all([searchParams, createSupabaseServerClient()]);
  const { data: forms, error: queryError } = await supabase.from("cms_forms").select("*").order("updated_at", { ascending: false });
  const formsWithData = await Promise.all((forms ?? []).map(async (form) => {
    const [{ data: fields }, { data: assignments }, { data: notification }] = await Promise.all([
      supabase.from("form_fields").select("field_key,label,field_type,is_required,options,help_text,placeholder,condition,position").eq("form_id", form.id).order("position"),
      supabase.from("form_pages").select("page_path").eq("form_id", form.id),
      supabase.from("form_notification_settings").select("recipient_email").eq("form_id", form.id).maybeSingle(),
    ]);
    return { ...form, fields: fields ?? [], assignments: assignments ?? [], notificationEmail: notification?.recipient_email ?? "" };
  }));
  return (
    <>
      <p className="eyebrow">CMS</p><h1 className="mt-2 text-4xl font-bold">Commission forms</h1>
      <p className="mt-3 text-ink-muted">Create custom inquiry forms and assign them to pages using their paths, for example <code>/kemono-fursuits/</code>. Forms can also be used at <code>/forms/your-slug/</code>.</p>
      {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-800">{error}</p> : null}
      {queryError ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-rose-950">Could not load forms. Apply the Supabase migration and configure the project.</p> : null}
      <section className="card mt-6 p-6">
        <h2 className="text-2xl font-semibold">Create a form</h2>
        <form action={createCmsForm} className="mt-4 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="field-label">Name<input className="field mt-1" name="name" required /></label>
            <label className="field-label">Slug<input className="field mt-1" name="slug" placeholder="leave blank to use name" /></label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="field-label">Submit button text<input className="field mt-1" name="submit_label" defaultValue="Send inquiry" /></label>
            <label className="field-label">Notification email<input className="field mt-1" name="notification_email" type="email" placeholder="defaults to studio inbox" /></label>
          </div>
          <label className="field-label">Success message<input className="field mt-1" name="success_message" defaultValue="Thanks. Your inquiry has been sent." /></label>
          <label className="field-label">Page paths (one per line)<textarea className="field mt-1 font-mono text-sm" name="page_paths" rows={3} placeholder="/fursuit-commission/&#10;/kemono-fursuits/" /></label>
          <label className="field-label">Fields (JSON)<textarea className="field mt-1 font-mono text-sm" name="fields" rows={10} defaultValue={starter} required /></label>
          <p className="text-sm text-ink-muted">Field types: text, textarea, email, tel, number, select, radio, checkbox, date, file, budget. Choice fields accept an <code>options</code> array. Use <code>condition</code> such as <code>{'{"field":"service","equals":"custom"}'}</code> to show a field conditionally.</p>
          <button className="btn-primary justify-self-start">Save draft form</button>
        </form>
      </section>
      <div className="mt-8 space-y-5">
        {formsWithData.map((form) => (
          <article key={form.id} className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-semibold">{form.name}</h2><p className="text-sm text-ink-muted">/forms/{form.slug}/ · v{form.current_version}</p></div><span className="chip">{form.is_published ? "Published" : "Draft"}</span></div>
            {form.is_published ? <a className="link mt-2 inline-block" href={`/forms/${form.slug}/`}>Preview public form</a> : null}
            <form action={updateCmsForm} className="mt-4 grid gap-4">
              <input type="hidden" name="id" value={form.id} />
              <div className="grid gap-4 md:grid-cols-2"><label className="field-label">Name<input className="field mt-1" name="name" defaultValue={form.name} required /></label><label className="field-label">Submit button text<input className="field mt-1" name="submit_label" defaultValue={form.submit_label} /></label></div>
              <div className="grid gap-4 md:grid-cols-2"><label className="field-label">Notification email<input className="field mt-1" name="notification_email" type="email" defaultValue={form.notificationEmail} /></label><label className="field-label">Success message<input className="field mt-1" name="success_message" defaultValue={form.success_message} /></label></div>
              <label className="field-label">Assigned page paths<textarea className="field mt-1 font-mono text-sm" name="page_paths" rows={2} defaultValue={form.assignments.map((a: { page_path: string }) => a.page_path).join("\n")} /></label>
              <label className="field-label">Fields — edit, add or reorder in this JSON list<textarea className="field mt-1 font-mono text-sm" name="fields" rows={12} defaultValue={JSON.stringify(form.fields, null, 2)} /></label>
              <button className="btn-secondary justify-self-start">Save changes (unpublishes form)</button>
            </form>
            {!form.is_published ? <form action={publishCmsForm} className="mt-3"><input type="hidden" name="id" value={form.id} /><button className="btn-primary">Publish current form</button></form> : null}
          </article>
        ))}
      </div>
    </>
  );
}
