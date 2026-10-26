"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCmsAdmin } from "@/lib/supabase/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import sharp from "sharp";

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const text = (form: FormData, name: string, max = 5000) => String(form.get(name) ?? "").trim().slice(0, max);
const failure = (path: string, reason: string): never => redirect(`${path}?error=${encodeURIComponent(reason)}`);

export async function createPage(form: FormData) {
  const admin = await requireCmsAdmin();
  const title = text(form, "title", 180);
  const slug = slugify(text(form, "slug", 160) || title);
  if (!title || !slug) failure("/admin/pages/", "Add a title and a valid URL slug.");
  const db = createSupabaseAdminClient();
  const { error } = await db.from("cms_pages").insert({
    title, slug, description: text(form, "description"), seo_title: text(form, "seo_title", 180),
    meta_description: text(form, "meta_description", 320), created_by: admin.user.id, updated_by: admin.user.id,
  });
  if (error) failure("/admin/pages/", error.code === "23505" ? "That slug is already in use." : "The page could not be created.");
  revalidatePath("/admin/pages/");
  redirect("/admin/pages/");
}

export async function duplicatePage(form: FormData) {
  const admin = await requireCmsAdmin();
  const id = text(form, "id", 80);
  const db = createSupabaseAdminClient();
  const { data: source } = await db.from("cms_pages").select("*").eq("id", id).single();
  if (!source) failure("/admin/pages/", "The page to duplicate could not be found.");
  let suffix = "copy";
  let slug = `${source.slug}-${suffix}`;
  let created: { id: string } | null = null;
  for (let attempt = 2; attempt < 20; attempt++) {
    const { data, error } = await db.from("cms_pages").insert({
      title: `${source.title} (copy)`, slug, description: source.description, seo_title: source.seo_title,
      meta_description: source.meta_description, canonical_url: null, is_indexable: false, status: "draft",
      created_by: admin.user.id, updated_by: admin.user.id,
    }).select("id").single();
    if (data) { created = data; break; }
    if (error?.code !== "23505") failure("/admin/pages/", "The page could not be duplicated.");
    suffix = `copy-${attempt}`; slug = `${source.slug}-${suffix}`;
  }
  if (!created) failure("/admin/pages/", "Could not find an unused slug for the copy.");
  const { data: sections } = await db.from("page_sections").select("section_type,heading,body,position").eq("page_id", id).order("position");
  if (sections?.length) await db.from("page_sections").insert(sections.map((section) => ({ ...section, page_id: created!.id, updated_by: admin.user.id })));
  revalidatePath("/admin/pages/");
  redirect("/admin/pages/");
}

export async function deletePage(form: FormData) {
  const admin = await requireCmsAdmin();
  if (admin.role !== "owner") failure("/admin/pages/", "Only an owner can delete pages.");
  const { error } = await createSupabaseAdminClient().from("cms_pages").delete().eq("id", text(form, "id", 80));
  if (error) failure("/admin/pages/", "The page could not be deleted.");
  revalidatePath("/admin/pages/");
  redirect("/admin/pages/");
}

export async function updatePage(form: FormData) {
  const admin = await requireCmsAdmin();
  const id = text(form, "id", 80);
  const title = text(form, "title", 180);
  const slug = slugify(text(form, "slug", 160));
  const status = text(form, "status", 20);
  if (!id || !title || !slug || !["draft", "published", "archived"].includes(status)) failure("/admin/pages/", "Check the page title, slug and status.");
  const db = createSupabaseAdminClient();
  const { error } = await db.from("cms_pages").update({
    title, slug, description: text(form, "description"), seo_title: text(form, "seo_title", 180),
    meta_description: text(form, "meta_description", 320), canonical_url: text(form, "canonical_url", 500) || null,
    social_image_id: text(form, "social_image_id", 80) || null, is_indexable: form.get("is_indexable") === "on",
    status, published_at: status === "published" ? new Date().toISOString() : null, updated_by: admin.user.id, updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) failure("/admin/pages/", error.code === "23505" ? "That slug is already in use." : "The page could not be saved.");
  revalidatePath("/content/[slug]", "page");
  revalidatePath("/admin/pages/");
  redirect("/admin/pages/");
}

export async function addPageSection(form: FormData) {
  const admin = await requireCmsAdmin();
  const pageId = text(form, "page_id", 80);
  const heading = text(form, "heading", 180);
  const sectionType = text(form, "section_type", 40);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text(form, "body", 12000) || "{}");
    if (!body || Array.isArray(body) || typeof body !== "object") throw new Error();
  } catch { failure("/admin/pages/", "Section content must be a JSON object."); }
  const mediaId = text(form, "media_id", 80);
  if (sectionType === "image" && mediaId) {
    const db = createSupabaseAdminClient();
    const { data: media } = await db.from("media_assets").select("storage_path,alt_text").eq("id", mediaId).eq("storage_bucket", "cms-public").maybeSingle();
    if (!media) failure("/admin/pages/", "Choose an image from the public media library.");
    body.image_url = db.storage.from("cms-public").getPublicUrl(media.storage_path).data.publicUrl;
    body.alt = media.alt_text;
  }
  const position = Math.max(0, Number(text(form, "position", 8)) || 0);
  const db = createSupabaseAdminClient();
  const { error } = await db.from("page_sections").insert({ page_id: pageId, section_type: sectionType, heading, body, position, updated_by: admin.user.id });
  if (error) failure("/admin/pages/", "The section could not be added. Check its type and position.");
  revalidatePath("/content/[slug]", "page");
  redirect("/admin/pages/");
}

export async function deletePageSection(form: FormData) {
  const admin = await requireCmsAdmin();
  if (admin.role !== "owner") failure("/admin/pages/", "Only an owner can delete sections.");
  const id = text(form, "id", 80);
  const db = createSupabaseAdminClient();
  const { error } = await db.from("page_sections").delete().eq("id", id);
  if (error) failure("/admin/pages/", "The section could not be deleted.");
  revalidatePath("/content/[slug]", "page");
  redirect("/admin/pages/");
}

export async function updatePageSection(form: FormData) {
  const admin = await requireCmsAdmin();
  const id = text(form, "id", 80);
  const heading = text(form, "heading", 180);
  const sectionType = text(form, "section_type", 40);
  let body: Record<string, unknown>;
  try { body = JSON.parse(text(form, "body", 12000)); if (!body || Array.isArray(body) || typeof body !== "object") throw new Error(); }
  catch { failure("/admin/pages/", "Section content must be a JSON object."); }
  const db = createSupabaseAdminClient();
  const mediaId = text(form, "media_id", 80);
  if (sectionType === "image" && mediaId) {
    const { data: media } = await db.from("media_assets").select("storage_path,alt_text").eq("id", mediaId).eq("storage_bucket", "cms-public").maybeSingle();
    if (!media) failure("/admin/pages/", "Choose an image from the public media library.");
    body.image_url = db.storage.from("cms-public").getPublicUrl(media.storage_path).data.publicUrl;
    body.alt = media.alt_text;
  }
  const position = Math.max(0, Number(text(form, "position", 8)) || 0);
  const { error } = await db.from("page_sections").update({ heading, section_type: sectionType, body, position, updated_by: admin.user.id }).eq("id", id);
  if (error) failure("/admin/pages/", "The section could not be saved. Check the display order is unique.");
  revalidatePath("/content/[slug]", "page");
  redirect("/admin/pages/");
}

export async function createBlogPost(form: FormData) {
  const admin = await requireCmsAdmin();
  const title = text(form, "title", 180);
  const slug = slugify(text(form, "slug", 160) || title);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text(form, "body", 40000) || "[]");
    if (!body || typeof body !== "object" || body.type !== "doc") throw new Error();
  } catch { failure("/admin/blog/", "Post body must be valid editor content."); }
  if (!title || !slug) failure("/admin/blog/", "Add a title and valid slug.");
  const db = createSupabaseAdminClient();
  const status = text(form, "status", 20);
  const { data: post, error } = await db.from("blog_posts").insert({
    title, slug, excerpt: text(form, "excerpt", 600), body,
    status: ["draft", "published"].includes(status) ? status : "draft",
    published_at: status === "published" ? new Date().toISOString() : null,
    seo_title: text(form, "seo_title", 180), meta_description: text(form, "meta_description", 320),
    featured_image_id: text(form, "featured_image_id", 80) || null, created_by: admin.user.id, updated_by: admin.user.id,
  }).select("id").single();
  if (error || !post) failure("/admin/blog/", error?.code === "23505" ? "That slug is already in use." : "The post could not be created.");
  const categoryIds = form.getAll("category_ids").map(String).filter(Boolean);
  const tagIds = form.getAll("tag_ids").map(String).filter(Boolean);
  if (categoryIds.length) await db.from("blog_post_categories").insert(categoryIds.map((category_id) => ({ post_id: post.id, category_id })));
  if (tagIds.length) await db.from("blog_post_tags").insert(tagIds.map((tag_id) => ({ post_id: post.id, tag_id })));
  revalidatePath("/journal/");
  redirect("/admin/blog/");
}

export async function updateBlogPost(form: FormData) {
  const admin = await requireCmsAdmin();
  const id = text(form, "id", 80);
  const title = text(form, "title", 180);
  const slug = slugify(text(form, "slug", 160) || title);
  const status = text(form, "status", 20);
  let body: Record<string, unknown>;
  try { body = JSON.parse(text(form, "body", 40000)); if (!body || body.type !== "doc") throw new Error(); }
  catch { failure("/admin/blog/", "Post body must be valid editor content."); }
  if (!id || !title || !slug || !["draft", "published", "archived"].includes(status)) failure("/admin/blog/", "Check the article title, slug and status.");
  const db = createSupabaseAdminClient();
  const { error } = await db.from("blog_posts").update({
    title, slug, excerpt: text(form, "excerpt", 600), body, status,
    published_at: status === "published" ? new Date().toISOString() : null,
    seo_title: text(form, "seo_title", 180), meta_description: text(form, "meta_description", 320),
    canonical_url: text(form, "canonical_url", 500) || null, featured_image_id: text(form, "featured_image_id", 80) || null,
    updated_by: admin.user.id, updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) failure("/admin/blog/", error.code === "23505" ? "That slug is already in use." : "The article could not be saved.");
  await db.from("blog_post_categories").delete().eq("post_id", id);
  await db.from("blog_post_tags").delete().eq("post_id", id);
  const categoryIds = form.getAll("category_ids").map(String).filter(Boolean);
  const tagIds = form.getAll("tag_ids").map(String).filter(Boolean);
  if (categoryIds.length) await db.from("blog_post_categories").insert(categoryIds.map((category_id) => ({ post_id: id, category_id })));
  if (tagIds.length) await db.from("blog_post_tags").insert(tagIds.map((tag_id) => ({ post_id: id, tag_id })));
  revalidatePath("/journal/");
  revalidatePath(`/journal/${slug}/`);
  redirect("/admin/blog/");
}

export async function createBlogCategory(form: FormData) {
  await requireCmsAdmin();
  const name = text(form, "name", 100);
  const slug = slugify(text(form, "slug", 100) || name);
  if (!name || !slug) failure("/admin/blog/", "Add a category name and slug.");
  const { error } = await createSupabaseAdminClient().from("blog_categories").insert({ name, slug, description: text(form, "description", 500) });
  if (error) failure("/admin/blog/", error.code === "23505" ? "That category already exists." : "The category could not be saved.");
  redirect("/admin/blog/");
}

export async function createBlogTag(form: FormData) {
  await requireCmsAdmin();
  const name = text(form, "name", 100);
  const slug = slugify(text(form, "slug", 100) || name);
  if (!name || !slug) failure("/admin/blog/", "Add a tag name and slug.");
  const { error } = await createSupabaseAdminClient().from("blog_tags").insert({ name, slug });
  if (error) failure("/admin/blog/", error.code === "23505" ? "That tag already exists." : "The tag could not be saved.");
  redirect("/admin/blog/");
}

export async function createCmsForm(form: FormData) {
  const admin = await requireCmsAdmin();
  const name = text(form, "name", 180);
  const slug = slugify(text(form, "slug", 160) || name);
  let fields: { key: string; label: string; type: string; required?: boolean; options?: string[]; help?: string; placeholder?: string; condition?: unknown }[];
  try {
    fields = JSON.parse(text(form, "fields", 30000) || "[]");
    if (!Array.isArray(fields) || fields.some((f) => !f.key || !f.label || !f.type)) throw new Error();
  } catch { failure("/admin/forms/", "Fields must be a JSON array with key, label and type values."); }
  if (!name || !slug) failure("/admin/forms/", "Add a form name and valid slug.");
  const db = createSupabaseAdminClient();
  const { data: created, error } = await db.from("cms_forms").insert({
    name, slug, submit_label: text(form, "submit_label", 80) || "Send inquiry",
    success_message: text(form, "success_message", 500) || "Thanks. Your inquiry has been sent.", created_by: admin.user.id,
  }).select("id").single();
  if (error || !created) failure("/admin/forms/", error?.code === "23505" ? "That form slug is already in use." : "The form could not be created.");
  const { error: notificationError } = await db.from("form_notification_settings").insert({ form_id: created.id, recipient_email: text(form, "notification_email", 254) });
  if (notificationError) failure("/admin/forms/", "The form was created, but its notification settings could not be saved.");
  const { error: fieldError } = await db.from("form_fields").insert(fields.map((field, position) => ({
    form_id: created.id, field_key: field.key, label: field.label, field_type: field.type, is_required: Boolean(field.required),
    options: field.options ?? [], help_text: field.help ?? "", placeholder: field.placeholder ?? "", condition: field.condition ?? null, position,
  })));
  if (fieldError) failure("/admin/forms/", "The form was created, but its field definitions need correction.");
  const assignedPaths = form.getAll("page_paths").flatMap((value) => String(value).split(/[\n,]+/)).map((path) => path.trim()).filter((path) => /^\/[a-z0-9/_-]*\/?$/.test(path) && !path.startsWith("/admin"));
  if (assignedPaths.length) await db.from("form_pages").insert(assignedPaths.map((page_path) => ({ form_id: created.id, page_path })));
  const definition = { name, slug, fields };
  await db.from("form_versions").insert({ form_id: created.id, version: 1, definition, created_by: admin.user.id });
  revalidatePath("/admin/forms/");
  redirect("/admin/forms/");
}

export async function updateCmsForm(form: FormData) {
  const admin = await requireCmsAdmin();
  const id = text(form, "id", 80);
  const name = text(form, "name", 180);
  let fields: { key: string; label: string; type: string; required?: boolean; options?: string[]; help?: string; placeholder?: string; condition?: unknown }[];
  try {
    fields = JSON.parse(text(form, "fields", 30000) || "[]");
    if (!Array.isArray(fields) || fields.some((f) => !f.key || !f.label || !f.type)) throw new Error();
  } catch { failure("/admin/forms/", "Fields must be a JSON array with key, label and type values."); }
  if (!id || !name) failure("/admin/forms/", "Add a form name.");
  const db = createSupabaseAdminClient();
  const { error: formError } = await db.from("cms_forms").update({
    name, submit_label: text(form, "submit_label", 80), success_message: text(form, "success_message", 500),
    is_published: false, updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (formError) failure("/admin/forms/", "The form settings could not be saved.");
  const { error: notificationError } = await db.from("form_notification_settings").upsert({ form_id: id, recipient_email: text(form, "notification_email", 254) });
  if (notificationError) failure("/admin/forms/", "The notification recipient could not be saved.");
  const { error: deleteError } = await db.from("form_fields").delete().eq("form_id", id);
  if (deleteError) failure("/admin/forms/", "The previous fields could not be replaced.");
  const { error } = await db.from("form_fields").insert(fields.map((field, position) => ({
    form_id: id, field_key: field.key, label: field.label, field_type: field.type, is_required: Boolean(field.required),
    options: field.options ?? [], help_text: field.help ?? "", placeholder: field.placeholder ?? "", condition: field.condition ?? null, position,
  })));
  if (error) failure("/admin/forms/", "The field definition could not be saved.");
  await db.from("form_pages").delete().eq("form_id", id);
  const assignedPaths = form.getAll("page_paths").flatMap((value) => String(value).split(/[\n,]+/)).map((path) => path.trim()).filter((path) => /^\/[a-z0-9/_-]*\/?$/.test(path) && !path.startsWith("/admin"));
  if (assignedPaths.length) await db.from("form_pages").insert(assignedPaths.map((page_path) => ({ form_id: id, page_path })));
  revalidatePath("/admin/forms/");
  redirect("/admin/forms/");
}

export async function publishCmsForm(form: FormData) {
  const admin = await requireCmsAdmin();
  const id = text(form, "id", 80);
  const db = createSupabaseAdminClient();
  const [{ data: cmsForm }, { data: fields }] = await Promise.all([
    db.from("cms_forms").select("id,name,slug,submit_label,success_message,current_version").eq("id", id).single(),
    db.from("form_fields").select("field_key,label,field_type,is_required,placeholder,help_text,options,validation,condition,position").eq("form_id", id).order("position"),
  ]);
  if (!cmsForm || !fields?.length) failure("/admin/forms/", "Add at least one valid field before publishing this form.");
  const version = cmsForm.current_version + 1;
  const definition = { ...cmsForm, fields };
  const { error: versionError } = await db.from("form_versions").insert({ form_id: id, version, definition, created_by: admin.user.id });
  if (versionError) failure("/admin/forms/", "A form version could not be saved.");
  const { error } = await db.from("cms_forms").update({ is_published: true, current_version: version, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) failure("/admin/forms/", "The form could not be published.");
  revalidatePath(`/forms/${cmsForm.slug}/`);
  revalidatePath("/admin/forms/");
  redirect("/admin/forms/");
}

export async function createGallery(form: FormData) {
  const admin = await requireCmsAdmin();
  const title = text(form, "title", 180);
  const slug = slugify(text(form, "slug", 160) || title);
  if (!title || !slug) failure("/admin/galleries/", "Add a gallery title and valid slug.");
  const db = createSupabaseAdminClient();
  const { error } = await db.from("galleries").insert({ title, slug, description: text(form, "description"), is_public: form.get("is_public") === "on", created_by: admin.user.id });
  if (error) failure("/admin/galleries/", error.code === "23505" ? "That gallery slug is already in use." : "The gallery could not be created.");
  revalidatePath("/admin/galleries/");
  redirect("/admin/galleries/");
}

export async function addGalleryItem(form: FormData) {
  await requireCmsAdmin();
  const galleryId = text(form, "gallery_id", 80);
  const mediaId = text(form, "media_id", 80);
  const position = Math.max(0, Number(text(form, "position", 8)) || 0);
  const db = createSupabaseAdminClient();
  const { error } = await db.from("gallery_items").insert({ gallery_id: galleryId, media_id: mediaId, position, alt_override: text(form, "alt", 300), caption_override: text(form, "caption", 500) });
  if (error) failure("/admin/galleries/", "Could not add that item. Check the media and display order.");
  revalidatePath("/admin/galleries/");
  redirect("/admin/galleries/");
}

export async function createCommissionType(form: FormData) {
  const admin = await requireCmsAdmin();
  const name = text(form, "name", 160);
  const slug = slugify(text(form, "slug", 120) || name);
  if (!name || !slug) failure("/admin/commissions/", "Add a commission name and valid slug.");
  const db = createSupabaseAdminClient();
  const { error } = await db.from("commission_types").insert({ name, slug, description: text(form, "description"), position: Math.max(0, Number(text(form, "position", 8)) || 0), created_by: admin.user.id });
  if (error) failure("/admin/commissions/", error.code === "23505" ? "That commission slug is already in use." : "The commission type could not be created.");
  revalidatePath("/admin/commissions/");
  redirect("/admin/commissions/");
}

export async function uploadPublicMedia(form: FormData) {
  const admin = await requireCmsAdmin();
  const file = form.get("file");
  if (!(file instanceof File) || file.size < 1 || file.size > 10 * 1024 * 1024) failure("/admin/media/", "Choose an image under 10 MB.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) failure("/admin/media/", "Upload a JPEG, PNG or WebP image.");
  const input = Buffer.from(await file.arrayBuffer());
  const meta = await sharp(input).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toBuffer({ resolveWithObject: true });
  const fileName = `${crypto.randomUUID()}.webp`;
  const path = `library/${new Date().toISOString().slice(0, 7)}/${fileName}`;
  const db = createSupabaseAdminClient();
  const { error: storageError } = await db.storage.from("cms-public").upload(path, meta.data, { contentType: "image/webp", upsert: false });
  if (storageError) failure("/admin/media/", "The image could not be stored. Check the CMS storage migration.");
  const { error } = await db.from("media_assets").insert({
    storage_bucket: "cms-public", storage_path: path, original_name: file.name.slice(0, 255), mime_type: "image/webp",
    size_bytes: meta.data.byteLength, width: meta.info.width, height: meta.info.height,
    alt_text: text(form, "alt_text", 500), caption: text(form, "caption", 500), is_public: true,
  });
  if (error) failure("/admin/media/", "The image uploaded, but its library record could not be saved.");
  revalidatePath("/admin/media/");
  redirect("/admin/media/");
}

export async function updateMediaMetadata(form: FormData) {
  await requireCmsAdmin();
  const id = text(form, "id", 80);
  const db = createSupabaseAdminClient();
  const { error } = await db.from("media_assets").update({ alt_text: text(form, "alt_text", 500), caption: text(form, "caption", 500) }).eq("id", id).eq("is_public", true);
  if (error) failure("/admin/media/", "The media details could not be updated.");
  revalidatePath("/admin/media/");
  redirect("/admin/media/");
}

export async function updateGallery(form: FormData) {
  await requireCmsAdmin();
  const id = text(form, "id", 80);
  const { data: galleryItems } = await createSupabaseAdminClient().from("galleries").select("slug").eq("id", id).maybeSingle();
  if (!galleryItems) failure("/admin/galleries/", "Gallery not found.");
  const db = createSupabaseAdminClient();
  const { error } = await db.from("galleries").update({ title: text(form, "title", 180), description: text(form, "description"), is_public: form.get("is_public") === "on" }).eq("id", id);
  if (error) failure("/admin/galleries/", "The gallery could not be saved.");
  revalidatePath(`/galleries/${galleryItems.slug}/`);
  redirect("/admin/galleries/");
}

export async function updateGalleryItem(form: FormData) {
  await requireCmsAdmin();
  const galleryId = text(form, "gallery_id", 80);
  const mediaId = text(form, "media_id", 80);
  const position = Math.max(0, Number(text(form, "position", 8)) || 0);
  const db = createSupabaseAdminClient();
  const { error } = await db.from("gallery_items").update({ position, alt_override: text(form, "alt", 300), caption_override: text(form, "caption", 500) }).eq("gallery_id", galleryId).eq("media_id", mediaId);
  if (error) failure("/admin/galleries/", "The gallery image could not be updated.");
  redirect("/admin/galleries/");
}

export async function removeGalleryItem(form: FormData) {
  const admin = await requireCmsAdmin();
  if (admin.role !== "owner") failure("/admin/galleries/", "Only an owner can remove gallery images.");
  const db = createSupabaseAdminClient();
  const { error } = await db.from("gallery_items").delete().eq("gallery_id", text(form, "gallery_id", 80)).eq("media_id", text(form, "media_id", 80));
  if (error) failure("/admin/galleries/", "The gallery image could not be removed.");
  redirect("/admin/galleries/");
}

export async function updateCommissionType(form: FormData) {
  await requireCmsAdmin();
  const id = text(form, "id", 80);
  const name = text(form, "name", 160);
  const slug = slugify(text(form, "slug", 120) || name);
  const db = createSupabaseAdminClient();
  const { error } = await db.from("commission_types").update({ name, slug, description: text(form, "description"), is_active: form.get("is_active") === "on", position: Math.max(0, Number(text(form, "position", 8)) || 0) }).eq("id", id);
  if (error) failure("/admin/commissions/", error.code === "23505" ? "That commission slug is already in use." : "The commission type could not be saved.");
  redirect("/admin/commissions/");
}

export async function updateSubmission(form: FormData) {
  await requireCmsAdmin();
  const id = text(form, "id", 80);
  const status = text(form, "status", 30);
  if (!id || !["new", "in_progress", "quoted", "approved", "completed", "archived"].includes(status)) failure("/admin/submissions/", "Choose a valid status.");
  const db = createSupabaseAdminClient();
  const { error } = await db.from("form_submissions").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) failure("/admin/submissions/", "The submission status could not be updated.");
  revalidatePath("/admin/submissions/");
  redirect("/admin/submissions/");
}

export async function addSubmissionNote(form: FormData) {
  const admin = await requireCmsAdmin();
  const id = text(form, "id", 80);
  const note = text(form, "note", 10000);
  if (!id || !note) failure("/admin/submissions/", "Write a note before saving.");
  const db = createSupabaseAdminClient();
  const { error } = await db.from("submission_notes").insert({ submission_id: id, author_id: admin.user.id, note });
  if (error) failure("/admin/submissions/", "The internal note could not be saved.");
  revalidatePath("/admin/submissions/");
  redirect("/admin/submissions/");
}
