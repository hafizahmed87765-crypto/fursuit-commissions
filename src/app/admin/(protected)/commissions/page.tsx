import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCommissionType, updateCommissionType } from "@/app/admin/actions";

export default async function AdminCommissions({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, supabase] = await Promise.all([searchParams, createSupabaseServerClient()]);
  const { data: types, error: queryError } = await supabase.from("commission_types").select("*").order("position");
  return <>
    <p className="eyebrow">Services</p><h1 className="mt-2 text-4xl font-bold">Commission types</h1>
    {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-800">{error}</p> : null}
    {queryError ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-rose-950">Could not load commission types. Apply the CMS migration.</p> : null}
    <form action={createCommissionType} className="card mt-6 grid gap-4 p-6 md:grid-cols-2"><h2 className="text-2xl font-semibold md:col-span-2">Add commission type</h2><label className="field-label">Name<input className="field mt-1" name="name" required /></label><label className="field-label">Slug<input className="field mt-1" name="slug" /></label><label className="field-label md:col-span-2">Description<textarea className="field mt-1" name="description" rows={2} /></label><button className="btn-primary justify-self-start">Add type</button></form>
    <ul className="mt-6 space-y-4">{(types ?? []).map((type) => <li key={type.id} className="card p-5"><form action={updateCommissionType} className="grid gap-3 md:grid-cols-2"><input type="hidden" name="id" value={type.id} /><label className="field-label">Name<input className="field mt-1" name="name" defaultValue={type.name} /></label><label className="field-label">Slug<input className="field mt-1" name="slug" defaultValue={type.slug} /></label><label className="field-label md:col-span-2">Description<textarea className="field mt-1" name="description" defaultValue={type.description} rows={2} /></label><label className="field-label">Order<input className="field mt-1" type="number" name="position" min="0" defaultValue={type.position} /></label><label className="choice flex items-center gap-2 self-end"><input type="checkbox" name="is_active" defaultChecked={type.is_active} />Active</label><button className="btn-secondary justify-self-start md:col-span-2">Save commission type</button></form></li>)}</ul>
  </>;
}
