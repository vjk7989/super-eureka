"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Role } from "@/lib/types";
import { roleLabels } from "@/lib/utils";

const roles: Role[] = ["super_admin", "admin", "farm_manager", "field_inspector", "ai_dev", "viewer"];

export function PersonaSwitcher({ role }: { role: Role }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <select
      aria-label="Switch prototype persona"
      className="max-w-[52vw] rounded-md border border-input bg-card px-3 py-2 text-sm font-medium shadow-xs"
      value={role}
      onChange={(event) => {
        const next = new URLSearchParams(params.toString());
        next.set("role", event.target.value);
        router.push(`${pathname}?${next.toString()}`);
      }}
    >
      {roles.map((item) => <option key={item} value={item}>{roleLabels[item]}</option>)}
    </select>
  );
}
