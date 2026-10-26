// Validation shared by the quote, repair and contact forms (client) and the
// /api/inquiry route (server), so both sides enforce the same rules.

export type InquiryKind = "quote" | "repair" | "contact";

export const UPLOAD = {
  maxFiles: 5,
  maxFileBytes: 8 * 1024 * 1024,
  maxTotalBytes: 20 * 1024 * 1024,
  types: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif", "application/pdf"],
  accept: ".jpg,.jpeg,.png,.webp,.gif,.heic,.heif,.pdf",
};

export const SERVICES = [
  { value: "custom", label: "Custom fursuit" },
  { value: "kemono", label: "Kemono suit" },
  { value: "toony", label: "Toony suit" },
  { value: "cosplay", label: "Cosplay suit" },
  { value: "plush", label: "Custom plush" },
  { value: "refsheet", label: "Reference sheet only" },
] as const;

export const COVERAGE = [
  { value: "fullsuit", label: "Fullsuit" },
  { value: "partial", label: "Partial (head, hand paws, tail)" },
  { value: "head", label: "Head only" },
  { value: "parts", label: "Individual parts (paws, tail…)" },
  { value: "other", label: "Something else" },
] as const;

export const PARTS = ["Hand paws", "Feet paws", "Tail", "Ears / headband", "Neon sign"] as const;

export const REPAIR_TYPES = ["Seam / stitching repair", "Fur replacement or patching", "Head refurbishment", "Alteration or refit", "Not sure — need advice"] as const;

export type Errors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function req(v: string | undefined | null, label: string, errors: Errors, key: string, max = 4000) {
  const s = (v ?? "").trim();
  if (!s) errors[key] = `${label} is required.`;
  else if (s.length > max) errors[key] = `${label} is too long (max ${max} characters).`;
}

export function validateEmail(v: string | undefined | null, errors: Errors, key = "email") {
  const s = (v ?? "").trim();
  if (!s) errors[key] = "Email is required.";
  else if (!EMAIL.test(s) || s.length > 200) errors[key] = "Enter a valid email address.";
}

export function validateFiles(files: { name: string; size: number; type: string }[], errors: Errors, key = "files") {
  if (files.length > UPLOAD.maxFiles) {
    errors[key] = `Attach up to ${UPLOAD.maxFiles} files.`;
    return;
  }
  let total = 0;
  for (const f of files) {
    total += f.size;
    if (!UPLOAD.types.includes(f.type)) {
      errors[key] = `"${f.name}" is not a supported file type. Use JPG, PNG, WEBP, GIF, HEIC or PDF.`;
      return;
    }
    if (f.size > UPLOAD.maxFileBytes) {
      errors[key] = `"${f.name}" is larger than 8 MB.`;
      return;
    }
  }
  if (total > UPLOAD.maxTotalBytes) errors[key] = "Attachments add up to more than 20 MB. Remove some or share a link instead.";
}

export function validateLinks(v: string | undefined | null, errors: Errors, key = "links") {
  const s = (v ?? "").trim();
  if (!s) return;
  const bad = s.split(/\s+/).filter((u) => u && !/^https?:\/\/\S+\.\S+/.test(u));
  if (bad.length) errors[key] = "Reference links must start with http:// or https:// (one per line).";
}

/** Server-side validation of a full submission. */
export function validateInquiry(kind: InquiryKind, f: Record<string, string>, files: { name: string; size: number; type: string }[]) {
  const errors: Errors = {};
  req(f.name, "Name", errors, "name", 120);
  validateEmail(f.email, errors);
  if (kind === "quote") {
    if (!SERVICES.some((s) => s.value === f.service)) errors.service = "Choose a service.";
    if (f.service !== "refsheet" && f.service !== "plush" && !COVERAGE.some((c) => c.value === f.coverage)) errors.coverage = "Choose what you'd like made.";
    req(f.species, "Species", errors, "species", 120);
    req(f.design, "Design description", errors, "design", 5000);
    validateLinks(f.links, errors);
    if (f.agree !== "yes") errors.agree = "Please confirm you understand how quotes work.";
  }
  if (kind === "repair") {
    req(f.repairType, "Repair type", errors, "repairType", 200);
    req(f.problem, "Problem description", errors, "problem", 5000);
    if (!files.length) errors.files = "Add at least one photo of the suit and the damage.";
  }
  if (kind === "contact") req(f.message, "Message", errors, "message", 5000);
  if (f.privacy !== "yes") errors.privacy = "Please agree to the privacy policy.";
  validateFiles(files, errors);
  return errors;
}
