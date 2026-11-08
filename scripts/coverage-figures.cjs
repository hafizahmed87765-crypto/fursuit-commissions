/**
 * Builds the price-plan coverage figures from one fully filled character image.
 * Usage: node scripts/coverage-figures.cjs <filled-figure.png>
 *
 * Uncovered parts are turned white (outline kept), so every package shows the
 * same character with only its covered parts filled. Region boundaries were
 * measured on the 1122x1402 source and scale with the input size.
 */
const path = require("path");
const sharp = require("sharp");

const src = process.argv[2];
if (!src) throw new Error("Pass the filled figure PNG");
const out = (n) => path.join(__dirname, "..", "public", "brand", `coverage-${n}.webp`);

const plans = {
  head: ["head"],
  "mini-partial": ["head", "hands", "tail"],
  partial: ["head", "hands", "feet", "tail"],
  fullsuit: ["head", "hands", "feet", "tail", "body"],
};

(async () => {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const sx = W / 1122, sy = H / 1402;
  const region = (x, y) => {
    const X = x / sx, Y = y / sy;
    if (Y < 305) return "head";
    if (Y > 1255) return "feet";
    if (Y > 665 && X < 345) return "hands";
    if (Y > 665 && Y < 830 && X > 780) return "hands";
    if (Y > 820 && X > 716) return "tail";
    return "body";
  };

  // The tail is drawn as its own outlined shape: find that connected fill area
  // so it is coloured as one piece instead of being cut by a straight line.
  const isDark = (p) => data[p * 4 + 3] > 10 && (data[p * 4] + data[p * 4 + 1] + data[p * 4 + 2]) / 3 < 95;
  const tailMask = new Uint8Array(W * H);
  const seen = new Uint8Array(W * H);
  for (let s = 0; s < W * H; s++) {
    if (seen[s] || !isDark(s)) continue;
    const pts = [], stack = [s];
    seen[s] = 1;
    let minx = W, miny = H, maxx = 0, maxy = 0;
    while (stack.length) {
      const p = stack.pop(), x = p % W, y = (p / W) | 0;
      pts.push(p);
      minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y);
      for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p - W, p + W]) {
        if (q >= 0 && q < W * H && !seen[q] && isDark(q)) { seen[q] = 1; stack.push(q); }
      }
    }
    const cx = (minx + maxx) / 2 / sx, cy = (miny + maxy) / 2 / sy;
    if (pts.length > 20000 * sx * sy && cx > 780 && cy > 850 && cy < 1000) pts.forEach((p) => (tailMask[p] = 1));
  }
  const partOf = (x, y) => {
    const p = y * W + x;
    if (tailMask[p]) return "tail";
    const r = region(x, y);
    return r === "tail" && isDark(p) ? "body" : r;
  };
  for (const [name, parts] of Object.entries(plans)) {
    const buf = Buffer.from(data);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (buf[i + 3] < 10 || parts.includes(partOf(x, y))) continue;
        // Dark green fill becomes white; light outline is kept, slightly darkened for contrast on white.
        const lum = (buf[i] + buf[i + 1] + buf[i + 2]) / 3;
        if (lum < 95) { buf[i] = buf[i + 1] = buf[i + 2] = 255; }
        else { buf[i] = 150; buf[i + 1] = 166; buf[i + 2] = 161; }
      }
    }
    const info2 = await sharp(buf, { raw: { width: W, height: H, channels: 4 } })
      .trim()
      .resize({ height: 640 })
      .webp({ quality: 85, alphaQuality: 90, effort: 6 })
      .toFile(out(name));
    console.log(name, `${info2.width}x${info2.height}`, `${(info2.size / 1024).toFixed(1)} KB`);
  }
})();
