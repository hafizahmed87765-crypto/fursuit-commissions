/**
 * Tells IndexNow search engines (Bing, Yandex, Seznam, Naver…) about every URL
 * in the live sitemap so they recrawl it quickly.
 * Usage: INDEXNOW_KEY=<key> node scripts/indexnow.mjs [https://www.fursuitcommissions.com]
 * The same key must be set in Vercel so /indexnow.txt serves it.
 */
const key = process.env.INDEXNOW_KEY;
const site = (process.argv[2] || "https://www.fursuitcommissions.com").replace(/\/$/, "");
if (!key) throw new Error("Set INDEXNOW_KEY");

const live = await (await fetch(`${site}/indexnow.txt`)).text();
if (live.trim() !== key) throw new Error(`${site}/indexnow.txt does not serve this key yet. Add INDEXNOW_KEY in Vercel and redeploy first.`);

const xml = await (await fetch(`${site}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const host = new URL(urlList[0] ?? site).host;

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/indexnow.txt`, urlList }),
});
console.log(`Submitted ${urlList.length} URLs for ${host}: HTTP ${res.status} ${res.statusText}`);
if (res.status >= 400) console.log(await res.text());
