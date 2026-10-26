import { notFound } from "next/navigation";
import DynamicInquiryForm from "@/components/cms/DynamicInquiryForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { robots: { index: false, follow: false } };

export default async function DynamicFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) notFound();
  const supabase = await createSupabaseServerClient();
  const { data: form } = await supabase.from("cms_forms").select("id,slug,name,submit_label,success_message,is_published").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (!form) notFound();
  const { data: fields } = await supabase.from("form_fields").select("field_key,label,field_type,is_required,placeholder,help_text,options").eq("form_id", form.id).order("position");
  if (!fields?.length) notFound();
  return <main className="container-x max-w-3xl py-12"><p className="eyebrow">Inquiry form</p><h1 className="mt-2 text-4xl font-bold">{form.name}</h1><DynamicInquiryForm slug={slug} fields={fields} submitLabel={form.submit_label} successMessage={form.success_message} pagePath={`/forms/${slug}/`} /></main>;
}
