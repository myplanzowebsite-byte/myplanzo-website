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
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
