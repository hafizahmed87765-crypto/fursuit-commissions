import DynamicInquiryForm from "./DynamicInquiryForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CmsFormForPage({ pagePath }: { pagePath: string }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = await createSupabaseServerClient();
  const { data: assigned } = await supabase.from("form_pages").select("form_id").eq("page_path", pagePath);
  const formId = assigned?.[0]?.form_id;
  if (!formId) return null;
  const { data: form } = await supabase.from("cms_forms").select("slug,name,submit_label,success_message,is_published").eq("id", formId).eq("is_published", true).maybeSingle();
  if (!form) return null;
  const { data: fields } = await supabase.from("form_fields").select("field_key,label,field_type,is_required,placeholder,help_text,options").eq("form_id", formId).order("position");
  if (!fields?.length) return null;
  return <section className="container-x max-w-3xl py-12" aria-label={form.name}><h2 className="text-3xl font-semibold">{form.name}</h2><DynamicInquiryForm slug={form.slug} fields={fields} submitLabel={form.submit_label} successMessage={form.success_message} pagePath={pagePath} /></section>;
}
