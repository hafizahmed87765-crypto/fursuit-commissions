import { NextResponse } from "next/server";
import { requireCmsAdmin } from "@/lib/supabase/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireCmsAdmin();
  const { id } = await params;
  const db = createSupabaseAdminClient();
  const { data: attachment } = await db.from("submission_attachments").select("original_name,media_assets(storage_bucket,storage_path)").eq("id", id).maybeSingle();
  const media = Array.isArray(attachment?.media_assets) ? attachment.media_assets[0] : attachment?.media_assets;
  if (!attachment || !media || media.storage_bucket !== "cms-private") return new NextResponse("Not found", { status: 404 });
  const { data, error } = await db.storage.from("cms-private").createSignedUrl(media.storage_path, 60, { download: attachment.original_name });
  if (error || !data?.signedUrl) return new NextResponse("Attachment unavailable", { status: 404 });
  return NextResponse.redirect(data.signedUrl, { headers: { "cache-control": "no-store" } });
}
