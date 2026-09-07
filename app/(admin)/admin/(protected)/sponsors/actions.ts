"use server";
import { revalidatePath } from 'next/cache'; 
import {createAdminClient} from "@/lib/supabase/admin"; import { redirect } from 'next/navigation'; import { createClient } from '@/lib/supabase/server'; import { requirePermission } from '@/lib/auth/authorize'; import { auditAction } from '@/lib/audit'; import { sponsorSchema } from '@/lib/validation/sponsors';
const v=(x:FormDataEntryValue|null)=>typeof x==='string'?x.trim():'';
export async function getSponsors(){await requirePermission('sponsors.view');const {data,error}=await (await createClient()).from('sponsors').select('*').is('deleted_at',null).order('sort_order').order('created_at');if(error)throw new Error(error.message);return data??[]}
function input(fd: FormData) {
  return sponsorSchema.parse({
    name: v(fd.get("name")),
    tier: v(fd.get("tier")),
    logo: v(fd.get("logo")) || null,
    url: v(fd.get("url")) || null,
    sortOrder: Number(fd.get("sortOrder") || 0),
    published: fd.has("published")
      ? fd.get("published") === "on"
      : true,
  });
}
export async function addSponsor(fd:FormData){const a=await requirePermission('sponsors.create');const i=input(fd);const {data,error}=await (await createClient()).from('sponsors').insert({name:i.name,tier:i.tier,logo:i.logo,url:i.url,sort_order:i.sortOrder,published:i.published}).select('*').single();if(error)throw new Error(error.message);await auditAction({actorId:a.id,action:'SPONSOR_CREATED',entityType:'Sponsor',entityId:data.id,metadata:{name:data.name}});revalidatePath('/');revalidatePath('/admin/sponsors');redirect('/admin/sponsors?success=true')}
export async function updateSponsor(id: string, fd: FormData) {
  const actor = await requirePermission("sponsors.edit");

  // Get the existing publication state first.
  const { data: existing, error: fetchError } = await createAdminClient()
    .from("sponsors")
    .select("published")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!existing) {
    throw new Error("Sponsor not found.");
  }

  // If the form contains a published field, use it.
  // Otherwise preserve the existing value.
  const published = fd.has("published")
    ? fd.get("published") === "on"
    : existing.published;

  const i = sponsorSchema.parse({
    name: v(fd.get("name")),
    tier: v(fd.get("tier")),
    logo: v(fd.get("logo")) || null,
    url: v(fd.get("url")) || null,
    sortOrder: Number(fd.get("sortOrder") || 0),
    published,
  });

  const { error } = await createAdminClient()
    .from("sponsors")
    .update({
      name: i.name,
      tier: i.tier,
      logo: i.logo,
      url: i.url,
      sort_order: i.sortOrder,
      published: i.published,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await auditAction({
    actorId: actor.id,
    action: "SPONSOR_UPDATED",
    entityType: "Sponsor",
    entityId: id,
    metadata: {
      name: i.name,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/sponsors");

  redirect("/admin/sponsors?success=true");
}
export async function deleteSponsor(id: string) {
  const actor = await requirePermission("sponsors.delete");

  const s = createAdminClient();

  const { data: row, error: fetchError } = await s
    .from("sponsors")
    .select("name")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!row) {
    return;
  }

  const { error } = await s
    .from("sponsors")
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
    action: "SPONSOR_DELETED",
    entityType: "Sponsor",
    entityId: id,
    metadata: {
      name: row.name,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/sponsors");
}
export const addDummySponsor=addSponsor;
