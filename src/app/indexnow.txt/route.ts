// IndexNow key file. Search engines (Bing, Yandex, Seznam…) fetch this to
// verify that pings sent with INDEXNOW_KEY really come from this site.
// Pings pass keyLocation=https://<site>/indexnow.txt (see scripts/indexnow.mjs).
export function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
