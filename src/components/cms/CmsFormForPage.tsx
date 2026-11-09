import DynamicInquiryForm from "./DynamicInquiryForm";
import { getPageForm } from "@/lib/cms-forms";

export default async function CmsFormForPage({ pagePath }: { pagePath: string }) {
  const data = await getPageForm(pagePath);
  if (!data) return null;
  const { form, fields } = data;
  return <section className="container-x max-w-3xl py-12" aria-label={form.name}><h2 className="text-3xl font-semibold">{form.name}</h2><DynamicInquiryForm slug={form.slug} fields={fields} submitLabel={form.submit_label} successMessage={form.success_message} pagePath={pagePath} /></section>;
}
