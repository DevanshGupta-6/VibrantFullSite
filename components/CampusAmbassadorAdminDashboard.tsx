"use client";

import { useState, useEffect } from "react";
import { Download, Search, Users, Copy, Check } from "lucide-react";

interface Ambassador {
  name: string;
  contact: string;
  branch: string;
  code: string;
  enrolledAt: string;
}

interface Props {
  data: Ambassador[];
}

export default function CampusAmbassadorAdminDashboard({ data }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredData = data.filter((ambassador) =>
    ambassador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ambassador.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ambassador.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadCSV = () => {
    // Generate CSV string
    const headers = ["Name", "Contact", "Branch", "Referral Code", "Enrolled At"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          `"${row.name}"`,
          `"${row.contact}"`,
          `"${row.branch}"`,
          `"${row.code}"`,
          `"${new Date(row.enrolledAt).toLocaleString()}"`,
        ].join(",")
      ),
    ].join("\n");

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ambassadors_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-base-900 border border-base-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Actions */}
      <div className="p-6 border-b border-base-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-vibeesta-500/20 text-vibeesta-400 p-2 rounded-lg">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Total Enrollments</h2>
            <p className="text-ink-400 text-sm">{data.length} registered ambassadors</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" size={16} />
            <input
              type="text"
              placeholder="Search name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-base-950 border border-base-800 focus:border-vibeesta-500 focus:ring-1 focus:ring-vibeesta-500 rounded-lg pl-9 pr-4 py-2 text-white text-sm outline-none transition-all"
            />
          </div>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-white text-base-950 hover:bg-ink-300 transition-colors px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-base-950/50 border-b border-base-800">
              <th className="p-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Name</th>
              <th className="p-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Contact</th>
              <th className="p-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Branch</th>
              <th className="p-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Code</th>
              <th className="p-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-800">
            {filteredData.length > 0 ? (
              filteredData.map((ambassador, idx) => (
                <tr key={idx} className="hover:bg-base-800/30 transition-colors">
                  <td className="p-4 text-sm font-medium text-white">{ambassador.name}</td>
                  <td className="p-4 text-sm text-ink-300 font-mono">{ambassador.contact}</td>
                  <td className="p-4 text-sm text-ink-300">
                    <span className="bg-base-800 text-ink-300 px-2.5 py-1 rounded-md text-xs font-medium">
                      {ambassador.branch}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-vibeesta-400 font-mono font-bold">{ambassador.code}</span>
                      <button 
                        onClick={() => copyToClipboard(ambassador.code)}
                        className="text-ink-500 hover:text-white transition-colors"
                        title="Copy Code"
                      >
                        {copiedCode === ambassador.code ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-ink-400">
                    {mounted ? new Date(ambassador.enrolledAt).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : ""}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-500 text-sm">
                  No enrollments found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}