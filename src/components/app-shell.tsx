import Link from "next/link";
import { Activity, BarChart3, ClipboardList, Database, FileText, Map, Settings, Sprout, Upload, Users } from "lucide-react";
import type { Role } from "@/lib/types";
import { roleLabels } from "@/lib/utils";
import { BrandLockup } from "./brand-lockup";
import { PersonaSwitcher } from "./persona-switcher";

const navigation: Array<{ href: string; label: string; icon: React.ComponentType<{ className?: string }>; roles: Role[] }> = [
  { href: "/admin/overview", label: "Overview", icon: Activity, roles: ["super_admin", "admin", "viewer"] },
  { href: "/admin/people", label: "People", icon: Users, roles: ["super_admin", "admin"] },
  { href: "/admin/farms", label: "Farms", icon: Sprout, roles: ["super_admin", "admin", "farm_manager", "viewer"] },
  { href: "/admin/fields", label: "Fields", icon: Database, roles: ["super_admin", "admin", "farm_manager", "viewer"] },
  { href: "/admin/tree-grid", label: "Tree Grid", icon: BarChart3, roles: ["super_admin", "admin", "farm_manager", "ai_dev", "viewer"] },
  { href: "/map", label: "Map", icon: Map, roles: ["super_admin", "admin", "farm_manager", "ai_dev", "viewer"] },
  { href: "/admin/uploads", label: "Uploads", icon: Upload, roles: ["super_admin", "admin", "ai_dev"] },
  { href: "/manager/inspections", label: "Inspections", icon: ClipboardList, roles: ["super_admin", "admin", "farm_manager"] },
  { href: "/inspector/tasks", label: "My Tasks", icon: ClipboardList, roles: ["field_inspector"] },
  { href: "/ai/false-positives", label: "AI Feedback", icon: Activity, roles: ["super_admin", "ai_dev"] },
  { href: "/reports", label: "Reports", icon: FileText, roles: ["super_admin", "admin", "farm_manager", "ai_dev", "viewer"] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["super_admin"] }
];

export function AppShell({ children, role }: { children: React.ReactNode; role: Role }) {
  const items = navigation.filter((item) => item.roles.includes(role));
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-border bg-sidebar px-4 py-5 shadow-sm lg:block">
        <Link href={`/admin/overview?role=${role}`} className="block rounded-md px-2 py-1 text-sidebar-foreground hover:bg-sidebar-accent">
          <BrandLockup subtitle="AI Disease Command Center" />
        </Link>
        <p className="mt-2 px-2 text-sm text-muted-foreground">ESN LABS operational GIS prototype</p>
        <nav className="mt-7 space-y-1">
          {items.map((item) => (
            <Link key={item.href} href={`${item.href}?role=${role}`} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <item.icon className="h-4 w-4 text-primary" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <BrandLockup size="sm" subtitle="ESN LABS workspace" className="max-w-[190px] sm:max-w-none" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-muted-foreground">ESN LABS role</p>
              <h1 className="truncate text-lg font-semibold">{roleLabels[role]}</h1>
            </div>
          </div>
          <PersonaSwitcher role={role} />
        </header>
        <div className="mx-auto max-w-[1800px] px-4 py-5 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
