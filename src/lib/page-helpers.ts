import type { Role } from "./types";

const roles: Role[] = ["super_admin", "admin", "farm_manager", "field_inspector", "ai_dev", "viewer"];

export function getRole(searchParams?: Record<string, string | string[] | undefined>): Role {
  const raw = searchParams?.role;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return roles.includes(value as Role) ? value as Role : "super_admin";
}

export function withRole(path: string, role: Role) {
  return `${path}?role=${role}`;
}
