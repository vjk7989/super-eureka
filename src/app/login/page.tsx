import Link from "next/link";
import { BrandLockup } from "@/components/brand-lockup";
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
    <main className="grid min-h-screen place-items-center bg-background p-4 sm:p-6">
      <section className="w-full max-w-3xl rounded-lg border border-border bg-card p-5 shadow-md sm:p-6">
        <BrandLockup size="lg" subtitle="AI Disease Command Center" />
        <p className="mt-5 text-xs font-semibold uppercase text-muted-foreground">ESN LABS prototype login</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight">ESN LABS AI Disease Command Center</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Choose a persona to enter the ESN LABS clickable operational prototype. Supabase Auth replaces this switcher in the integration milestone.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Link key={role} href={`${redirects[role]}?role=${role}`} className="rounded-md border border-border bg-background p-4 shadow-xs hover:border-primary hover:bg-secondary">
              <span className="font-medium">{roleLabels[role]}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{redirects[role]}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
