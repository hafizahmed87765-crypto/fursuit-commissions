// Browser-side helpers for form uploads. Vercel rejects request bodies over
// ~4.5 MB, so photos are shrunk before sending and the total is checked here.

/** Leaves room under Vercel's 4.5 MB request limit for the text fields. */
export const MAX_REQUEST_BYTES = 4 * 1024 * 1024;

const SHRINKABLE = /^image\/(jpeg|png|webp|heic|heif)$/;

/** Resizes a photo to at most `max` px on the long edge as JPEG; returns the original if that fails or isn't smaller. */
async function shrink(file: File, max = 1800, quality = 0.82): Promise<File> {
  if (!SHRINKABLE.test(file.type) || typeof createImageBitmap !== "function") return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export async function shrinkFiles(files: File[]) {
  return Promise.all(files.map((f) => shrink(f)));
}

export const tooLargeMessage = "Your attachments are too large to send in one go, even after resizing. Remove a file or two, or share a link to your references instead.";

/** Message for responses that never reached the form code (firewall challenge, size limit, outage). */
export function blockedMessage(status: number) {
  if (status === 413) return tooLargeMessage;
  if (status === 403 || status === 429) return "Our security check stopped this request. Please refresh the page and try again in a minute.";
  return "Something went wrong and your request was not sent.";
}
