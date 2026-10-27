"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireCmsAdmin } from "@/lib/supabase/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import sharp from "sharp";
import { portfolio } from "@/content/portfolio";
import { GALLERY_CACHE_TAG, galleryTags, isPlacement, placements } from "@/lib/gallery-placements";
import { SITE_IMAGES_TAG, isSlotId } from "@/lib/site-images";

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const text = (form: FormData, name: string, max = 5000) => String(form.get(name) ?? "").trim().slice(0, max);
function failure(path: string, reason: string): never {
  redirect(`${path}?error=${encodeURIComponent(reason)}`);
}

const GALLERIES = "/admin/galleries/";
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
type AdminDb = ReturnType<typeof createSupabaseAdminClient>;

const isImage = (value: FormDataEntryValue | null): value is File => value instanceof File && value.size > 0;
const imageProblem = (file: File) => (file.size > MAX_IMAGE_BYTES ? "is over 10 MB" : !IMAGE_TYPES.includes(file.type) ? "is not a JPEG, PNG or WebP image" : null);
const pickTags = (form: FormData) => form.getAll("tags").map(String).filter((t) => (galleryTags as string[]).includes(t));

/** Resize to max 2000px, convert to WebP, store publicly and record it in the media library. Returns the media id. */
async function storePublicImage(db: AdminDb, input: Buffer, originalName: string, userId: string, altText = "", caption = "") {
  const meta = await sharp(input).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toBuffer({ resolveWithObject: true });
  const storagePath = `library/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.webp`;
  const { error: storageError } = await db.storage.from("cms-public").upload(storagePath, meta.data, { contentType: "image/webp", upsert: false });
  if (storageError) return null;
  const { data, error } = await db.from("media_assets").insert({
    storage_bucket: "cms-public", storage_path: storagePath, original_name: originalName.slice(0, 255), mime_type: "image/webp",
    size_bytes: meta.data.byteLength, width: meta.info.width, height: meta.info.height,
    alt_text: altText.slice(0, 500), caption: caption.slice(0, 500), is_public: true, uploaded_by: userId,
  }).select("id").single();
  if (error || !data) {
    await db.storage.from("cms-public").remove([storagePath]);
    return null;
  }
  return data.id as string;
}

/** Next free display position at the end of a gallery. */
async function nextPosition(db: AdminDb, galleryId: string) {
  const { data } = await db.from("gallery_items").select("position").eq("gallery_id", galleryId).order("position", { ascending: false }).limit(1).maybeSingle();
  return data ? data.position + 1 : 0;
}

/** Gallery changes can affect any page a gallery is placed on. */
function refreshGalleries() {
  updateTag(GALLERY_CACHE_TAG);
  for (const p of Object.values(placements)) revalidatePath(p.path);
  revalidatePath(GALLERIES);
}

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
  let body: Record<string, unknown> = {};
  try {
    body = JSON.parse(text(form, "body", 12000) || "{}");
    if (!body || Array.isArray(body) || typeof body !== "object") throw new Error();
  } catch { failure("/admin/pages/", "Section content must be a JSON object."); }
  const mediaId = text(form, "media_id", 80);
  if (sectionType === "image" && mediaId) {
    const db = createSupabaseAdminClient();
    const { data: media } = await db.from("media_assets").select("storage_path,alt_text").eq("id", mediaId).eq("storage_bucket", "cms-public").maybeSingle();
    if (!media) return failure("/admin/pages/", "Choose an image from the public media library.");
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
  let body: Record<string, unknown> = {};
  try { body = JSON.parse(text(form, "body", 12000)); if (!body || Array.isArray(body) || typeof body !== "object") throw new Error(); }
  catch { failure("/admin/pages/", "Section content must be a JSON object."); }
  const db = createSupabaseAdminClient();
  const mediaId = text(form, "media_id", 80);
  if (sectionType === "image" && mediaId) {
    const { data: media } = await db.from("media_assets").select("storage_path,alt_text").eq("id", mediaId).eq("storage_bucket", "cms-public").maybeSingle();
    if (!media) return failure("/admin/pages/", "Choose an image from the public media library.");
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
  let body: Record<string, unknown> = {};
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
  if (error || !post) return failure("/admin/blog/", error?.code === "23505" ? "That slug is already in use." : "The post could not be created.");
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
  let body: Record<string, unknown> = {};
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
  let fields: { key: string; label: string; type: string; required?: boolean; options?: string[]; help?: string; placeholder?: string; condition?: unknown }[] = [];
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
  if (error || !created) return failure("/admin/forms/", error?.code === "23505" ? "That form slug is already in use." : "The form could not be created.");
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
  let fields: { key: string; label: string; type: string; required?: boolean; options?: string[]; help?: string; placeholder?: string; condition?: unknown }[] = [];
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
  if (!cmsForm || !fields?.length) return failure("/admin/forms/", "Add at least one valid field before publishing this form.");
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
  const placement = text(form, "placement", 20);
  if (placement && isPlacement(placement)) await db.from("galleries").update({ placement: null }).eq("placement", placement);
  const { error } = await db.from("galleries").insert({
    title, slug, description: text(form, "description"), is_public: form.get("is_public") === "on", created_by: admin.user.id,
    ...(placement && isPlacement(placement) ? { placement } : {}),
  });
  if (error) failure(GALLERIES, error.code === "23505" ? "That gallery slug is already in use." : error.code === "42703" ? "Run the gallery placements migration (supabase/migrations/202610270001_gallery_placements.sql) first." : "The gallery could not be created.");
  refreshGalleries();
  redirect(GALLERIES);
}

export async function addGalleryItem(form: FormData) {
  await requireCmsAdmin();
  const galleryId = text(form, "gallery_id", 80);
  const mediaId = text(form, "media_id", 80);
  const db = createSupabaseAdminClient();
  const position = await nextPosition(db, galleryId);
  const { error } = await db.from("gallery_items").insert({ gallery_id: galleryId, media_id: mediaId, position, alt_override: text(form, "alt", 300), caption_override: text(form, "caption", 500), tags: pickTags(form) });
  if (error) failure(GALLERIES, error.code === "23505" ? "That photo is already in this gallery." : "Could not add that photo.");
  refreshGalleries();
  redirect(GALLERIES);
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
  if (!(file instanceof File) || file.size < 1 || file.size > 10 * 1024 * 1024) return failure("/admin/media/", "Choose an image under 10 MB.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return failure("/admin/media/", "Upload a JPEG, PNG or WebP image.");
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
  if (!galleryItems) return failure("/admin/galleries/", "Gallery not found.");
  const db = createSupabaseAdminClient();
  const placement = text(form, "placement", 20);
  // A spot on the site shows one gallery: assigning it here takes it from any other gallery.
  if (placement && isPlacement(placement)) await db.from("galleries").update({ placement: null }).eq("placement", placement).neq("id", id);
  const { error } = await db.from("galleries").update({
    title: text(form, "title", 180), description: text(form, "description"), is_public: form.get("is_public") === "on",
    placement: placement && isPlacement(placement) ? placement : null,
  }).eq("id", id);
  if (error) failure(GALLERIES, error.code === "42703" ? "Run the gallery placements migration (supabase/migrations/202610270001_gallery_placements.sql) first." : "The gallery could not be saved.");
  revalidatePath(`/galleries/${galleryItems.slug}/`);
  refreshGalleries();
  redirect(GALLERIES);
}

export async function updateGalleryItem(form: FormData) {
  await requireCmsAdmin();
  const galleryId = text(form, "gallery_id", 80);
  const mediaId = text(form, "media_id", 80);
  const position = Math.max(0, Number(text(form, "position", 8)) || 0);
  const db = createSupabaseAdminClient();
  const { error } = await db.from("gallery_items").update({ position, alt_override: text(form, "alt", 300), caption_override: text(form, "caption", 500), tags: pickTags(form) }).eq("gallery_id", galleryId).eq("media_id", mediaId);
  if (error) failure(GALLERIES, error.code === "23505" ? "Another photo already uses that position. Use the move buttons instead." : "The photo details could not be saved.");
  refreshGalleries();
  redirect(GALLERIES);
}

export async function removeGalleryItem(form: FormData) {
  const admin = await requireCmsAdmin();
  if (admin.role !== "owner") failure("/admin/galleries/", "Only an owner can remove gallery images.");
  const db = createSupabaseAdminClient();
  const { error } = await db.from("gallery_items").delete().eq("gallery_id", text(form, "gallery_id", 80)).eq("media_id", text(form, "media_id", 80));
  if (error) failure(GALLERIES, "The photo could not be removed.");
  refreshGalleries();
  redirect(GALLERIES);
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

export async function uploadToGallery(form: FormData) {
  const admin = await requireCmsAdmin();
  const galleryId = text(form, "gallery_id", 80);
  const files = form.getAll("files").filter(isImage);
  if (!galleryId || !files.length) failure(GALLERIES, "Choose at least one photo to upload.");
  if (files.length > 12) failure(GALLERIES, "Upload up to 12 photos at a time.");
  const tags = pickTags(form);
  const caption = text(form, "caption", 500);
  const alt = text(form, "alt", 300);
  const db = createSupabaseAdminClient();
  let position = await nextPosition(db, galleryId);
  const skipped: string[] = [];
  for (const file of files) {
    const problem = imageProblem(file);
    if (problem) {
      skipped.push(`${file.name} ${problem}`);
      continue;
    }
    const mediaId = await storePublicImage(db, Buffer.from(await file.arrayBuffer()), file.name, admin.user.id, alt, caption);
    if (!mediaId) {
      skipped.push(`${file.name} could not be stored`);
      continue;
    }
    const { error } = await db.from("gallery_items").insert({ gallery_id: galleryId, media_id: mediaId, position, alt_override: alt, caption_override: caption, tags });
    if (error) skipped.push(`${file.name} could not be added`);
    else position += 1;
  }
  refreshGalleries();
  if (skipped.length) failure(GALLERIES, `Uploaded ${files.length - skipped.length} of ${files.length}. Skipped: ${skipped.join("; ")}.`);
  redirect(GALLERIES);
}

/** Swap the photo in a gallery slot for a new upload, keeping its position, text and tags. */
export async function replaceGalleryPhoto(form: FormData) {
  const admin = await requireCmsAdmin();
  const galleryId = text(form, "gallery_id", 80);
  const mediaId = text(form, "media_id", 80);
  const file = form.get("file");
  if (!isImage(file)) failure(GALLERIES, "Choose a replacement photo.");
  const problem = imageProblem(file as File);
  if (problem) failure(GALLERIES, `That photo ${problem}.`);
  const db = createSupabaseAdminClient();
  const newId = await storePublicImage(db, Buffer.from(await (file as File).arrayBuffer()), (file as File).name, admin.user.id);
  if (!newId) failure(GALLERIES, "The replacement photo could not be stored.");
  const { error } = await db.from("gallery_items").update({ media_id: newId }).eq("gallery_id", galleryId).eq("media_id", mediaId);
  if (error) failure(GALLERIES, "The photo could not be replaced.");
  refreshGalleries();
  redirect(GALLERIES);
}

/** Move a photo one place earlier or later. Positions are unique per gallery, so swap via a temporary slot. */
export async function moveGalleryItem(form: FormData) {
  await requireCmsAdmin();
  const galleryId = text(form, "gallery_id", 80);
  const mediaId = text(form, "media_id", 80);
  const step = text(form, "direction", 4) === "up" ? -1 : 1;
  const db = createSupabaseAdminClient();
  const { data: items } = await db.from("gallery_items").select("media_id,position").eq("gallery_id", galleryId).order("position");
  const list = items ?? [];
  const index = list.findIndex((i) => i.media_id === mediaId);
  const other = list[index + step];
  if (index < 0 || !other) redirect(GALLERIES);
  const current = list[index];
  const temp = -1 - Date.now() % 1_000_000;
  const steps = [
    db.from("gallery_items").update({ position: temp }).eq("gallery_id", galleryId).eq("media_id", current.media_id),
    db.from("gallery_items").update({ position: current.position }).eq("gallery_id", galleryId).eq("media_id", other.media_id),
    db.from("gallery_items").update({ position: other.position }).eq("gallery_id", galleryId).eq("media_id", current.media_id),
  ];
  for (const q of steps) {
    const { error } = await q;
    if (error) failure(GALLERIES, "The photo could not be moved.");
  }
  refreshGalleries();
  redirect(GALLERIES);
}

/** Copy the photos currently built into the website into a gallery, with their titles, alt text and tags. */
export async function importSitePhotos(form: FormData) {
  const admin = await requireCmsAdmin();
  const galleryId = text(form, "gallery_id", 80);
  const only = text(form, "only", 20);
  const items = only ? portfolio.filter((i) => (i.tags as string[]).includes(only)) : portfolio;
  const db = createSupabaseAdminClient();
  // Skip photos this gallery already has (matched by original file name), so importing twice is harmless.
  const { data: existing } = await db.from("gallery_items").select("media_assets(original_name)").eq("gallery_id", galleryId);
  const have = new Set((existing ?? []).map((r) => {
    const m = r.media_assets as { original_name: string } | { original_name: string }[] | null;
    return (Array.isArray(m) ? m[0] : m)?.original_name;
  }));
  let position = await nextPosition(db, galleryId);
  let added = 0;
  for (const item of items) {
    const name = path.basename(item.src);
    if (have.has(name)) continue;
    const file = await readFile(path.join(process.cwd(), "public", item.src)).catch(() => null);
    if (!file) continue;
    const mediaId = await storePublicImage(db, file, name, admin.user.id, item.alt, item.title);
    if (!mediaId) continue;
    const { error } = await db.from("gallery_items").insert({ gallery_id: galleryId, media_id: mediaId, position, alt_override: item.alt.slice(0, 300), caption_override: item.title, tags: item.tags });
    if (!error) {
      position += 1;
      added += 1;
    }
  }
  refreshGalleries();
  if (!added) failure(GALLERIES, "No new photos were imported: they are already in this gallery.");
  redirect(GALLERIES);
}

const SITE_IMAGES = "/admin/site-images/";
const MISSING_SITE_IMAGES_TABLE = "Run the site images migration (supabase/migrations/202610270002_site_images.sql) first.";

/** Site images can appear on any page, so refresh the whole site. */
function refreshSiteImages() {
  updateTag(SITE_IMAGES_TAG);
  revalidatePath("/", "layout");
}

export async function replaceSiteImage(form: FormData) {
  const admin = await requireCmsAdmin();
  const slot = text(form, "slot", 4);
  if (!isSlotId(slot)) failure(SITE_IMAGES, "Unknown image slot.");
  const file = form.get("file");
  if (!isImage(file)) failure(SITE_IMAGES, "Choose a photo to upload.");
  const problem = imageProblem(file as File);
  if (problem) failure(SITE_IMAGES, `That photo ${problem}.`);
  const alt = text(form, "alt", 300);
  const db = createSupabaseAdminClient();
  const mediaId = await storePublicImage(db, Buffer.from(await (file as File).arrayBuffer()), (file as File).name, admin.user.id, alt);
  if (!mediaId) failure(SITE_IMAGES, "The photo could not be stored.");
  const { error } = await db.from("site_images").upsert({ slot, media_id: mediaId, alt_text: alt, updated_by: admin.user.id, updated_at: new Date().toISOString() });
  if (error) failure(SITE_IMAGES, error.code === "42P01" ? MISSING_SITE_IMAGES_TABLE : "The photo could not be saved to that slot.");
  refreshSiteImages();
  redirect(`${SITE_IMAGES}#slot-${slot}`);
}

export async function updateSiteImageAlt(form: FormData) {
  await requireCmsAdmin();
  const slot = text(form, "slot", 4);
  if (!isSlotId(slot)) failure(SITE_IMAGES, "Unknown image slot.");
  const db = createSupabaseAdminClient();
  const { error } = await db.from("site_images").update({ alt_text: text(form, "alt", 300), updated_at: new Date().toISOString() }).eq("slot", slot);
  if (error) failure(SITE_IMAGES, "The alt text could not be saved.");
  refreshSiteImages();
  redirect(`${SITE_IMAGES}#slot-${slot}`);
}

/** Go back to the built-in photo. The uploaded file stays in the media library. */
export async function resetSiteImage(form: FormData) {
  await requireCmsAdmin();
  const slot = text(form, "slot", 4);
  if (!isSlotId(slot)) failure(SITE_IMAGES, "Unknown image slot.");
  const db = createSupabaseAdminClient();
  const { error } = await db.from("site_images").delete().eq("slot", slot);
  if (error) failure(SITE_IMAGES, "The slot could not be reset.");
  refreshSiteImages();
  redirect(`${SITE_IMAGES}#slot-${slot}`);
}
