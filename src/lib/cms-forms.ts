import "server-only";
import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export const CMS_FORMS_TAG = "cms-forms";

export type PageForm = {
  form: { slug: string; name: string; submit_label: string; success_message: string };
  fields: { field_key: string; label: string; field_type: string; is_required: boolean; placeholder: string; help_text: string; options: unknown }[];
};

// Published forms are public (RLS allows anon reads), so they are read without
// cookies and cached. Pages using them stay static; admin form saves refresh the tag.
async function load(pagePath: string): Promise<PageForm | null> {
  const db = createSupabasePublicClient();
  if (!db) return null;
  const { data: assigned } = await db.from("form_pages").select("form_id").eq("page_path", pagePath);
  const formId = assigned?.[0]?.form_id;
  if (!formId) return null;
  const { data: form } = await db.from("cms_forms").select("slug,name,submit_label,success_message").eq("id", formId).eq("is_published", true).maybeSingle();
  if (!form) return null;
  const { data: fields } = await db.from("form_fields").select("field_key,label,field_type,is_required,placeholder,help_text,options").eq("form_id", formId).order("position");
  return fields?.length ? { form, fields } : null;
}

export const getPageForm = (pagePath: string) =>
  unstable_cache(() => load(pagePath).catch(() => null), ["cms-form", pagePath], { tags: [CMS_FORMS_TAG], revalidate: 3600 })();
