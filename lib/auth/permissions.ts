export const PERMISSIONS = [
  "dashboard.view",
  "users.view", "users.create", "users.edit", "users.delete", "users.manage_roles",
  "roles.view", "roles.create", "roles.edit", "roles.delete",
  "events.view", "events.create", "events.edit", "events.delete", "events.publish",
  "schedule.view", "schedule.create", "schedule.edit", "schedule.delete",
  "gallery.view", "gallery.create", "gallery.edit", "gallery.delete",
  "sponsors.view", "sponsors.create", "sponsors.edit", "sponsors.delete",
  "faqs.view", "faqs.create", "faqs.edit", "faqs.delete",
  "settings.view", "settings.manage",
  "audit.view",
] as const;

export type PermissionCode = (typeof PERMISSIONS)[number];

export const PERMISSION_DESCRIPTIONS: Record<PermissionCode, string> = Object.fromEntries(
  PERMISSIONS.map((code) => [code, code.replace(/\./g, " ").replace(/_/g, " ")])
) as Record<PermissionCode, string>;
