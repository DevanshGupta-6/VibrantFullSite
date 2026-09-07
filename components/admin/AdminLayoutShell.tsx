"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import UserNav from "@/components/admin/UserNav";
import { Menu } from "lucide-react";
import type { PermissionCode } from "@/lib/auth/permissions";

type AdminUser = {
  name: string;
  email: string;
  role: string;
  permissions: PermissionCode[];
};

export default function AdminLayoutShell({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin: AdminUser;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#07070B] text-ink-0 font-sans relative">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          permissions= {admin.permissions}
          onNavigate={() => setIsSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-ink-800 flex items-center justify-between px-4 sm:px-6 bg-[#0B0A10] shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="p-2 -ml-2 text-ink-300 hover:text-ink-0 md:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="font-display font-semibold text-base sm:text-lg text-ink-100 truncate">
              VIBRANT Dashboard
            </h1>
          </div>

          <UserNav admin={admin} />
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-[#07070B]">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}