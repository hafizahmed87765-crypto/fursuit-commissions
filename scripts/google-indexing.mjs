/**
 * Notifies Google's Indexing API about pages in the live sitemap.
 *
 * Usage (PowerShell):
 *   $env:GOOGLE_INDEXING_KEY="C:\path\outside\the\project\key.json"
 *   node scripts/google-indexing.mjs                 # dry run: lists what would be sent
 *   node scripts/google-indexing.mjs --send          # send all sitemap URLs
 *   node scripts/google-indexing.mjs --send --limit 1
 *   node scripts/google-indexing.mjs --send https://www.fursuitcommissions.com/gallery/
 *
 * Notes
 * - Google documents this API for JobPosting and BroadcastEvent pages only; for
 *   other pages it may be ignored. The sitemap + Search Console remain the
 *   main way Google finds pages, and IndexNow (scripts/indexnow.mjs) covers Bing.
 * - The service account must be an Owner of the Search Console property and the
 *   "Web Search Indexing API" must be enabled in its Google Cloud project.
 * - Default quota is 200 publish requests per day.
 * - Keep the key file OUTSIDE this repository. It is never logged or copied.
 */
import { readFileSync } from "node:fs";
import { createSign } from "node:crypto";

const args = process.argv.slice(2);
const send = args.includes("--send");
const limitArg = args.indexOf("--limit");
const limit = limitArg >= 0 ? Number(args[limitArg + 1]) : Infinity;
const explicit = args.filter((a) => /^https?:\/\//.test(a));
const site = "https://www.fursuitcommissions.com";

const keyPath = process.env.GOOGLE_INDEXING_KEY;
if (!keyPath) throw new Error("Set GOOGLE_INDEXING_KEY to the path of the service-account JSON file (kept outside this repo).");
const key = JSON.parse(readFileSync(keyPath, "utf8"));
if (!key.client_email || !key.private_key) throw new Error("The key file is missing client_email or private_key. Download a fresh key from Google Cloud (IAM > Service Accounts > Keys).");

const b64 = (v) => Buffer.from(typeof v === "string" ? v : JSON.stringify(v)).toString("base64url");

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: key.client_email, scope: "https://www.googleapis.com/auth/indexing", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const sig = createSign("RSA-SHA256").update(unsigned).sign(key.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Google sign-in failed: ${data.error_description || data.error || res.status}`);
  return data.access_token;
}

async function sitemapUrls() {
  const xml = await (await fetch(`${site}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    const u = new URL(m[1]);
    u.host = new URL(site).host; // always the canonical www host
    return u.href;
  });
}

const urls = (explicit.length ? explicit : await sitemapUrls()).slice(0, limit);
console.log(`${urls.length} URL(s) as ${key.client_email}${send ? "" : "  (dry run, add --send to submit)"}`);
if (!send) urls.forEach((u) => console.log("  " + u));
else await submit();

async function submit() {
  const token = await accessToken();
  let ok = 0;
  for (const url of urls) {
    const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ url, type: "URL_UPDATED" }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) ok++;
    console.log(`${res.status} ${url}${res.ok ? "" : "  -> " + (body.error?.message ?? "")}`);
    if (res.status === 429) break; // daily quota reached
  }
  console.log(`Done: ${ok}/${urls.length} accepted.`);
}
