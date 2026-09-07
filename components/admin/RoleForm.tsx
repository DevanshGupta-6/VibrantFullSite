"use client";

import { useState } from "react";
import { Save } from "lucide-react";

const MODULES = [
  { name: "dashboard", actions: ["view"] },
  { name: "users", actions: ["view", "create", "edit", "delete", "manage_roles"] },
  { name: "roles", actions: ["view", "create", "edit", "delete"] },
  { name: "events", actions: ["view", "create", "edit", "delete", "publish"] },
  { name: "schedule", actions: ["view", "create", "edit", "delete"] },
  { name: "gallery", actions: ["view", "create", "edit", "delete"] },
  { name: "sponsors", actions: ["view", "create", "edit", "delete"] },
  { name: "faqs", actions: ["view", "create", "edit", "delete"] },
  { name: "settings", actions: ["view", "manage"] },
  { name: "audit", actions: ["view"] },
  { name: "campus_ambassador", actions: ["view", "reset"] },
];

export default function RoleForm({ initialData, action }: { initialData?: any, action: any }) {
  const [permissions, setPermissions] = useState<string[]>(initialData?.permissions || []);

  const togglePermission = (perm: string) => {
    setPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const selectAll = () => {
    const allPerms: string[] = [];
    MODULES.forEach(mod => {
      mod.actions.forEach(act => allPerms.push(`${mod.name}.${act}`));
    });
    setPermissions(allPerms);
  };

  const clearAll = () => {
    setPermissions([]);
  };

  return (
    <form action={action} className="space-y-8 bg-[#0B0A10] border border-ink-800 rounded-xl p-6 md:p-8 shadow-2xl shadow-black/50">
      
      {/* Hidden inputs to pass permissions to FormData */}
      {permissions.map(p => (
        <input key={p} type="hidden" name={`perm_${p}`} value="on" />
      ))}

      {/* Basic Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-ink-100 border-b border-ink-800 pb-3">Role Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Role Name</label>
            <input 
              name="name"
              required
              type="text" 
              defaultValue={initialData?.name}
              placeholder="e.g. Event Coordinator"
              className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none focus:border-vibeesta-500 focus:ring-1 focus:ring-vibeesta-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Description</label>
            <input 
              name="description"
              required
              type="text" 
              defaultValue={initialData?.description}
              placeholder="What is this role responsible for?"
              className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none focus:border-vibeesta-500 focus:ring-1 focus:ring-vibeesta-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-ink-800 pb-3">
           <h3 className="font-semibold text-lg text-ink-100">Permissions Matrix</h3>
           <div className="flex gap-3 text-xs font-medium">
              <button type="button" onClick={selectAll} className="text-vibeesta-400 hover:text-vibeesta-300 transition-colors">Select All</button>
              <span className="text-ink-700">|</span>
              <button type="button" onClick={clearAll} className="text-ink-400 hover:text-ink-300 transition-colors">Clear All</button>
           </div>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-ink-800 mt-4">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-ink-900/50 border-b border-ink-800 text-ink-300">
              <tr>
                <th className="px-6 py-4 font-medium w-1/4">Module</th>
                <th className="px-6 py-4 font-medium text-center">View</th>
                <th className="px-6 py-4 font-medium text-center">Create</th>
                <th className="px-6 py-4 font-medium text-center">Edit</th>
                <th className="px-6 py-4 font-medium text-center">Delete</th>
                <th className="px-6 py-4 font-medium">Other Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800 bg-[#07070B]">
              {MODULES.map((mod) => (
                <tr key={mod.name} className="hover:bg-ink-900/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-ink-200 capitalize flex items-center gap-2">
                     {mod.name}
                  </td>
                  
                  {['view', 'create', 'edit', 'delete'].map(actionType => {
                    const hasAction = mod.actions.includes(actionType);
                    const permKey = `${mod.name}.${actionType}`;
                    const isChecked = permissions.includes(permKey);
                    
                    return (
                      <td key={actionType} className="px-6 py-4 text-center">
                        {hasAction ? (
                          <label className="inline-flex relative items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => togglePermission(permKey)}
                              className="peer sr-only"
                            />
                            <div className="w-5 h-5 rounded border border-ink-700 bg-ink-900 peer-checked:bg-vibeesta-500 peer-checked:border-vibeesta-500 transition-colors flex items-center justify-center">
                              <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </label>
                        ) : <span className="text-ink-700">-</span>}
                      </td>
                    )
                  })}
                  
                  {/* Other actions */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {mod.actions.filter(a => !['view', 'create', 'edit', 'delete'].includes(a)).map(actionType => {
                         const permKey = `${mod.name}.${actionType}`;
                         const isChecked = permissions.includes(permKey);
                         return (
                         <label key={actionType} className="inline-flex items-center gap-2 cursor-pointer bg-ink-900/50 px-2.5 py-1.5 rounded-md text-xs border border-ink-800 hover:border-ink-600 transition-colors">
                           <input 
                             type="checkbox" 
                             checked={isChecked}
                             onChange={() => togglePermission(permKey)}
                             className="accent-vibeesta-500"
                           />
                           <span className="text-ink-300 capitalize">{actionType.replace('_', ' ')}</span>
                         </label>
                      )})}
                      {mod.actions.filter(a => !['view', 'create', 'edit', 'delete'].includes(a)).length === 0 && <span className="text-ink-700">-</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end border-t border-ink-800 pt-6">
        <button 
          type="submit"
          className="flex items-center gap-2 bg-vibeesta-600 hover:bg-vibeesta-500 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-vibeesta-900/20"
        >
          <Save className="w-4 h-4" />
          Save Role
        </button>
      </div>
    </form>
  )
}