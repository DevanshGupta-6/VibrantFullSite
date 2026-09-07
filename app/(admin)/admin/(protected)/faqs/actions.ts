"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import { requirePermission } from "@/lib/auth/authorize";
import { auditAction } from "@/lib/audit";
import { faqSchema } from "@/lib/validation/faq";

function v(x: FormDataEntryValue | null) {
  return typeof x === "string" ? x.trim() : "";
}

export async function getFaqs() {
  await requirePermission("faqs.view");

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order")
    .order("created_at");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function addFaq(fd: FormData) {
  const actor = await requirePermission("faqs.create");

  const input = faqSchema.parse({
    question: v(fd.get("question")),
    answer: v(fd.get("answer")) || null,
    category: v(fd.get("category")) || "general",
    sortOrder: fd.get("sortOrder") || 0,
    published: fd.get("published") ?? true,
  });

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faqs")
    .insert({
      question: input.question,
      answer: input.answer,
      category: input.category,
      sort_order: input.sortOrder,
      published: input.published,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await auditAction({
    actorId: actor.id,
    action: "FAQ_CREATED",
    entityType: "FAQ",
    entityId: data.id,
    metadata: {
      question: input.question,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/faqs");

  redirect("/admin/faqs?success=true");
}

export async function updateFaq(id: string, fd: FormData) {
  const actor = await requirePermission("faqs.edit");

  const input = faqSchema.parse({
    question: v(fd.get("question")),
    answer: v(fd.get("answer")) || null,
    category: v(fd.get("category")) || "general",
    sortOrder: fd.get("sortOrder") || 0,
    published: fd.get("published") ?? true,
  });

  const supabase = await createClient();

  const { error } = await supabase
    .from("faqs")
    .update({
      question: input.question,
      answer: input.answer,
      category: input.category,
      sort_order: input.sortOrder,
      published: input.published,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await auditAction({
    actorId: actor.id,
    action: "FAQ_UPDATED",
    entityType: "FAQ",
    entityId: id,
    metadata: {
      question: input.question,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/faqs");

  redirect("/admin/faqs?success=true");
}

export async function deleteFaq(id: string) {
  const actor = await requirePermission("faqs.delete");

  /*
   * Read using the authenticated client.
   * This ensures the caller can only access rows permitted
   * by the normal RLS rules.
   */
  const db = await createClient();

  const { data: row, error: readError } = await db
    .from("faqs")
    .select("id,question")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (!row) {
    return;
  }

  /*
   * IMPORTANT:
   *
   * This is a soft delete implemented as UPDATE.
   * The Server Action has already verified:
   *
   *   requirePermission("faqs.delete")
   *
   * The RLS update policy is based on faqs.edit,
   * so using the authenticated client here causes the
   * "new row violates row-level security policy" error.
   *
   * Use the service-role client only for this privileged
   * administrative mutation.
   */
  const admin = createAdminClient();

  const { error } = await admin
    .from("faqs")
    .update({
      deleted_at: new Date().toISOString(),
      published: false,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await auditAction({
    actorId: actor.id,
    action: "FAQ_DELETED",
    entityType: "FAQ",
    entityId: id,
  });

  revalidatePath("/");
  revalidatePath("/admin/faqs");
}