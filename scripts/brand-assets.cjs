/**
 * Builds the site's brand images from the source artwork.
 * Usage: node scripts/brand-assets.cjs <logo-transparent> <logo-white-bg> <mascot-transparent>
 *
 * Writes (all optimised; next/image then serves smaller sizes per device):
 *   public/brand/logo.webp      full logo (head + wordmark), transparent
 *   public/brand/logo.png       logo on white, for Google's Organization logo
 *   public/brand/icon-src.png   head only, transparent (header/footer icon)
 *   public/brand/mascot.webp    full-body mascot, transparent, 900px tall
 *   src/app/icon.png            512px favicon (head on mint)
 *   src/app/apple-icon.png      180px home-screen icon (head on mint)
 */
const path = require("path");
const sharp = require("sharp");

const [logoT, logoW, mascot] = process.argv.slice(2);
if (!mascot) throw new Error("Pass: <logo-transparent> <logo-white-bg> <mascot-transparent>");
const root = path.join(__dirname, "..");
const out = (p) => path.join(root, p);
const MINT = { r: 165, g: 212, b: 196, alpha: 1 };

(async () => {
  // Full logo, upscaled 2x so it stays crisp on retina screens.
  const meta = await sharp(logoT).metadata();
  await sharp(logoT).resize(meta.width * 2).webp({ quality: 90, alphaQuality: 100 }).toFile(out("public/brand/logo.webp"));
  await sharp(logoW).resize(600, 600, { fit: "contain", background: "#ffffff" }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out("public/brand/logo.png"));

  // Head only: mask out the wordmark. The outline below was measured on the
  // 300x207 source (wordmark starts x≈150 at y≈120, x≈137 from y≈136 and the
  // COMMISSIONS line at x≈117 from y≈160) and scales with the input size.
  const sx = meta.width / 300, sy = meta.height / 207;
  const pts = [[0, 0], [182, 0], [182, 120], [149, 120], [149, 136], [136, 136], [136, 160], [114, 160], [114, 207], [0, 207]]
    .map(([x, y]) => `${Math.round(x * sx)},${Math.round(y * sy)}`).join(" ");
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}"><polygon points="${pts}" fill="#fff"/></svg>`);
  const head = await sharp(logoT).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  const trimmed = await sharp(head).trim().toBuffer();
  await sharp(trimmed).resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out("public/brand/icon-src.png"));

  const onMint = async (size, pad) => {
    const inner = await sharp(trimmed).resize(size - pad * 2, size - pad * 2, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: MINT } }).composite([{ input: inner, left: pad, top: pad }]).png({ compressionLevel: 9, palette: true, quality: 90 });
  };
  await (await onMint(512, 40)).toFile(out("src/app/icon.png"));
  await (await onMint(180, 16)).toFile(out("src/app/apple-icon.png"));

  // Mascot: 900px tall is plenty for the largest display size (~460px @2x).
  await sharp(mascot).trim().resize({ height: 900 }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(out("public/brand/mascot.webp"));

  const fs = require("fs");
  for (const f of ["public/brand/logo.webp", "public/brand/logo.png", "public/brand/icon-src.png", "public/brand/mascot.webp", "src/app/icon.png", "src/app/apple-icon.png"]) {
    const m = await sharp(out(f)).metadata();
    console.log(f.padEnd(28), `${m.width}x${m.height}`, `${(fs.statSync(out(f)).size / 1024).toFixed(1)} KB`);
  }
})();
