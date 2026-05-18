import { randomBytes } from "crypto";

/**
 * Upload an image to Supabase Storage via its REST API (no SDK — consistent
 * with the rest of the codebase). The bucket must be public-read so the
 * returned URL renders directly. Throws if storage isn't configured.
 */
export async function uploadImage(file: File, prefix: string): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "uploads";

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "Image storage is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)",
    );
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const objectPath = `${prefix}/${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;

  const res = await fetch(
    `${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: Buffer.from(await file.arrayBuffer()),
    },
  );
  if (!res.ok) {
    throw new Error(`Storage upload failed: ${await res.text()}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
}
