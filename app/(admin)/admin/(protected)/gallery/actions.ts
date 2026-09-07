"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/auth/authorize";
import { auditAction } from "@/lib/audit";
import { gallerySchema } from "@/lib/validation/gallery";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function value(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function extensionForType(type: string): string {
  switch (type) {
    case "image/jpeg": return "jpg";
    case "image/png": return "png";
    case "image/webp": return "webp";
    case "image/gif": return "gif";
    default: throw new Error("Unsupported image type.");
  }
}

export async function getGallery() {
  await requirePermission("gallery.view");

  const db = await createClient();

  const { data, error } = await db
    .from("gallery_photos")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function uploadGalleryPhoto(formData: FormData) {
  const actor = await requirePermission("gallery.create");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please select an image to upload.");
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be 10 MB or smaller.");
  }

  const category = value(formData, "category");
  const alt = value(formData, "alt");
  const caption = value(formData, "caption") || null;
  const aspectRatio = value(formData, "aspectRatio") || "square";
  const sortOrder = value(formData, "sortOrder") || "0";
  const published = formData.get("published") === "on";

  const parsed = gallerySchema.parse({
    src: "pending",
    alt,
    category,
    caption,
    aspectRatio,
    sortOrder,
    published,
  });

  const extension = extensionForType(file.type);
  const safeBase = parsed.alt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "gallery-photo";
  const objectPath = `${parsed.category}/${Date.now()}-${crypto.randomUUID()}-${safeBase}.${extension}`;

  const storageAdmin = createAdminClient();
  const db = await createClient();

  const upload = await storageAdmin.storage
    .from("gallery")
    .upload(objectPath, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (upload.error) {
    throw new Error(`Image upload failed: ${upload.error.message}`);
  }

  const { data: publicUrlData } = storageAdmin.storage
    .from("gallery")
    .getPublicUrl(objectPath);

  const { data, error } = await db
    .from("gallery_photos")
    .insert({
      src: publicUrlData.publicUrl,
      alt: parsed.alt,
      category: parsed.category,
      caption: parsed.caption ?? null,
      aspect_ratio: parsed.aspectRatio,
      sort_order: parsed.sortOrder,
      published: parsed.published,
    })
    .select("*")
    .single();

  if (error) {
    await storageAdmin.storage.from("gallery").remove([objectPath]);
    throw new Error(`Gallery record creation failed: ${error.message}`);
  }

  await auditAction({
    actorId: actor.id,
    action: "GALLERY_CREATED",
    entityType: "GalleryPhoto",
    entityId: data.id,
    metadata: {
      category: parsed.category,
      filePath: objectPath,
      fileSize: file.size,
      contentType: file.type,
    },
  });

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");

  redirect(`/admin/gallery?filter=${encodeURIComponent(parsed.category)}&success=true`);
}

export async function deleteImage(id: string) {
  const actor = await requirePermission("gallery.delete");
  const supabase = createAdminClient();

  const { data: row, error: fetchError } = await supabase
    .from("gallery_photos")
    .select("id,category,src")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);
  if (!row) return;

  const { error } = await supabase
    .from("gallery_photos")
    .update({
      deleted_at: new Date().toISOString(),
      published: false,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  const bucketMarker = "/storage/v1/object/public/gallery/";
  const index = row.src.indexOf(bucketMarker);

  if (index !== -1) {
    const objectPath = decodeURIComponent(
      row.src.slice(index + bucketMarker.length)
    );

    await supabase.storage
      .from("gallery")
      .remove([objectPath]);
  }

  await auditAction({
    actorId: actor.id,
    action: "GALLERY_DELETED",
    entityType: "GalleryPhoto",
    entityId: id,
    metadata: { category: row.category },
  });

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}
