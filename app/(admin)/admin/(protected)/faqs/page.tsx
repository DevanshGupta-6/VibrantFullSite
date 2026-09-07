import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getFaqs, deleteFaq } from "./actions"
import { requirePermission } from "@/lib/auth/authorize";

export default async function AdminFaqsPage() {
  const faqs = await getFaqs();
  const admin = await requirePermission("faqs.view");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-300 hover:text-ink-0 hover:bg-ink-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-display font-bold">FAQs</h2>
            <p className="text-ink-400 text-sm mt-1">Manage frequently asked questions.</p>
          </div>
        </div>
        <Link href="/admin/faqs/new" className="flex items-center gap-2 bg-vibeesta-500 hover:bg-vibeesta-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add FAQ
        </Link>
      </div>

      <div className="space-y-4">
        {faqs.map((faq: any, i: number) => (
          <div key={faq.id || i} className="bg-[#0B0A10] border border-ink-800 rounded-xl p-6 group">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-semibold text-lg text-ink-100 mb-2">{faq.question}</h3>
                <p className="text-ink-400 text-sm">{faq.answer || "No answer provided"}</p>
                {faq.category && (
                  <span className="inline-block mt-3 text-xs bg-ink-900 border border-ink-800 px-2 py-1 rounded text-ink-400">
                    {faq.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {admin.permissions.includes("faqs.edit") && (
                <Link href={`/admin/faqs/${faq.id}/edit`} className="p-2 text-ink-500 hover:text-vibeesta-400 hover:bg-vibeesta-400/10 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </Link>
                )}
                {admin.permissions.includes("faqs.delete") &&(
                <form action={deleteFaq.bind(null, faq.id)}>
                  <button type="submit" className="p-2 text-ink-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
                )}
              </div>
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <div className="text-center py-12 text-ink-500 bg-[#0B0A10] border border-ink-800 rounded-xl">
             No FAQs found. Add some!
          </div>
        )}
      </div>
    </div>
  )
}