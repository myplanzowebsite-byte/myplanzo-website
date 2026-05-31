import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/requireSession";
import { uploadImage } from "@/lib/storage/supabase";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB — keeps requests within serverless body limits.

export async function POST(req: Request) {
  const { session, error } = await requireSession(["CUSTOMER", "VENDOR", "ADMIN", "SUBADMIN"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 4 MB" }, { status: 413 });
  }

  try {
    const url = await uploadImage(file, session.role.toLowerCase());
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[uploads] failed:", e);
    const raw = e instanceof Error ? e.message : "";
    // Map the most common backend failures to actionable messages so the
    // uploader UI shows *why* it failed instead of a blank "Upload failed".
    let error = "Upload failed. Please try again.";
    let status = 500;
    if (raw.includes("not configured")) {
      error = "Image uploads aren't set up yet — storage is not configured.";
      status = 503;
    } else if (/bucket|not found|404/i.test(raw)) {
      error =
        "Upload storage bucket is missing. Create a public bucket named \"uploads\" in Supabase.";
      status = 502;
    } else if (/row-level security|unauthorized|403|401|policy/i.test(raw)) {
      error =
        "Storage rejected the upload (permissions). Check the bucket is public and the service-role key is set.";
      status = 502;
    }
    return NextResponse.json({ error }, { status });
  }
}
