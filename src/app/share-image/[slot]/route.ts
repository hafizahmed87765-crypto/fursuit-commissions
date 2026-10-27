import { getSiteImages, isSlotId } from "@/lib/site-images";

/**
 * Stable social-preview URL for a site image slot (e.g. /share-image/P8/). Redirects to
 * the slot's current photo, so replacing it in Admin > Site images also updates the
 * Facebook / Discord / X preview without changing page metadata.
 */
export async function GET(request: Request, { params }: { params: Promise<{ slot: string }> }) {
  const { slot } = await params;
  if (!isSlotId(slot)) return new Response("Not found", { status: 404 });
  const { src } = (await getSiteImages())[slot];
  return Response.redirect(new URL(src, request.url), 307);
}
