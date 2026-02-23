import { createClient } from "@/lib/supabase/client";

const BUCKET = "announcement-images";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function isImageFile(file: File): boolean {
  return IMAGE_MIME_TYPES.includes(file.type);
}

export function isWithinSizeLimit(file: File): boolean {
  return file.size <= MAX_SIZE_BYTES;
}

/**
 * Upload an image file to Supabase Storage (bucket: announcement-images).
 * Returns the public URL of the uploaded file.
 * Requires the bucket to exist and RLS policies to allow authenticated upload and public read.
 */
export async function uploadAnnouncementImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  if (!isImageFile(file)) {
    return { error: "不支援的圖片格式，請使用 JPEG、PNG、GIF 或 WebP" };
  }
  if (!isWithinSizeLimit(file)) {
    return { error: "圖片大小不可超過 5MB" };
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Upload error:", error);
    return { error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { url: publicUrl };
}

const COMPETITION_PREFIX = "competitions/";
const RESULT_PREFIX = "results/";
const ORGANIZATION_PREFIX = "organization/";

/**
 * Upload an image for competition card to Supabase Storage (same bucket, path: competitions/).
 * Returns the public URL of the uploaded file.
 */
export async function uploadCompetitionImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  if (!isImageFile(file)) {
    return { error: "不支援的圖片格式，請使用 JPEG、PNG、GIF 或 WebP" };
  }
  if (!isWithinSizeLimit(file)) {
    return { error: "圖片大小不可超過 5MB" };
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${COMPETITION_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Upload error:", error);
    return { error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { url: publicUrl };
}

/**
 * Upload a header image for result card to Supabase Storage (same bucket, path: results/).
 * Returns the public URL of the uploaded file.
 */
export async function uploadResultImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  if (!isImageFile(file)) {
    return { error: "不支援的圖片格式，請使用 JPEG、PNG、GIF 或 WebP" };
  }
  if (!isWithinSizeLimit(file)) {
    return { error: "圖片大小不可超過 5MB" };
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${RESULT_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Upload error:", error);
    return { error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { url: publicUrl };
}

/**
 * Upload an image for organization member to Supabase Storage (same bucket, path: organization/).
 */
export async function uploadOrganizationImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  if (!isImageFile(file)) {
    return { error: "不支援的圖片格式，請使用 JPEG、PNG、GIF 或 WebP" };
  }
  if (!isWithinSizeLimit(file)) {
    return { error: "圖片大小不可超過 5MB" };
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${ORGANIZATION_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Upload error:", error);
    return { error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { url: publicUrl };
}
