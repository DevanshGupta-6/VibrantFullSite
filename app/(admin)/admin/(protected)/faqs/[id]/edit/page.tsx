import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { getFaqs, updateFaq } from "../../actions"
import { notFound } from "next/navigation"
import RoleForm from "@/components/admin/RoleForm";
import { requirePermission } from "@/lib/auth/authorize";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requirePermission("faqs.edit");

  const faqs = await getFaqs();
  const faq = faqs.find((f: any) => f.id === id);

  const updateFaqWithId = updateFaq.bind(null, id);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/faqs" className="p-2 rounded-lg bg-ink-900 hover:bg-ink-800 transition-colors text-ink-300 hover:text-ink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-display font-bold">Edit FAQ</h2>
          <p className="text-ink-400 text-sm mt-1">Update this frequently asked question.</p>
        </div>
      </div>

      <form action={updateFaqWithId} className="space-y-8 bg-[#0B0A10] border border-ink-800 rounded-xl p-6 md:p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Question</label>
            <input name="question" required type="text" defaultValue={faq.question} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Category</label>
            <select name="category" defaultValue={faq.category} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500">
               <option value="general">General</option>
               <option value="tech">Tech</option>
               <option value="cultural">Cultural</option>
               <option value="registration">Registration</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Answer</label>
            <textarea name="answer" required rows={4} defaultValue={faq.answer} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500 resize-y" />
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-ink-800">
           <button type="submit" className="flex items-center gap-2 bg-vibeesta-600 hover:bg-vibeesta-500 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-colors">
              <Save className="w-4 h-4" /> Save Changes
           </button>
        </div>
      </form>
      <RoleForm action={updateFaq} />
    </div>
  )
}