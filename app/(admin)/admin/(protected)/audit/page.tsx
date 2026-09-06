import { Search, Filter, Shield, Activity, User, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getAuditLogs } from "./actions"

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-300 hover:text-ink-0 hover:bg-ink-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-display font-bold">Audit Logs</h2>
            <p className="text-ink-400 text-sm mt-1">Track all administrative actions across the dashboard in real-time.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-ink-900 border border-ink-800 hover:bg-ink-800 rounded-lg text-sm text-ink-300 transition-colors w-fit">
          <Filter className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-[#0B0A10] border border-ink-800 rounded-xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-ink-800 flex flex-col sm:flex-row gap-4 justify-between bg-ink-900/20">
           <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
              <input 
                type="text" 
                placeholder="Search logs by action or user..."
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg pl-10 pr-4 py-2 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none focus:border-vibeesta-500 transition-all"
              />
           </div>
        </div>

        <div className="divide-y divide-ink-800 max-h-[800px] overflow-y-auto">
           {logs.map((log: any) => (
             <div key={log.id} className="p-4 sm:p-6 flex items-start gap-4 hover:bg-ink-900/30 transition-colors group">
               <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-ink-800 text-ink-400`}>
                 <Activity className="w-4 h-4" />
               </div>
               
               <div className="flex-1 min-w-0">
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                   <h4 className="text-sm font-semibold text-ink-100">{log.action} <span className="text-ink-500 font-normal">in {log.module}</span></h4>
                   <span className="text-xs text-ink-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/>{new Date(log.timestamp).toLocaleString()}</span>
                 </div>
                 <p className="text-sm text-ink-300 mb-2">{log.details}</p>
                 <div className="text-xs text-ink-500 flex items-center gap-1.5">
                   <User className="w-3.5 h-3.5" />
                   {log.user}
                 </div>
               </div>
             </div>
           ))}
           
           {logs.length === 0 && (
             <div className="p-8 text-center text-ink-500">
                No audit logs recorded yet. Start performing actions to see them here!
             </div>
           )}
        </div>
      </div>
    </div>
  )
}