import Link from "next/link";
import { roleLabels } from "@/lib/utils";
import type { Role } from "@/lib/types";

const redirects: Record<Role, string> = {
  super_admin: "/admin/overview",
  admin: "/admin/dashboard",
  farm_manager: "/manager/dashboard",
  field_inspector: "/inspector/tasks",
  ai_dev: "/ai/dashboard",
  viewer: "/viewer/dashboard"
};

export default function LoginPage() {
  const roles = Object.keys(roleLabels) as Role[];
  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <section className="w-full max-w-3xl rounded-lg border border-border bg-card p-6 shadow">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Prototype login</p>
        <h1 className="mt-2 text-3xl font-semibold">Oil Palm Health Command Center</h1>
        <p className="mt-2 text-muted-foreground">Choose a persona to enter the clickable prototype. Supabase Auth replaces this switcher in the integration milestone.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Link key={role} href={`${redirects[role]}?role=${role}`} className="rounded-md border border-border p-4 hover:bg-accent">
              <span className="font-medium">{roleLabels[role]}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{redirects[role]}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
