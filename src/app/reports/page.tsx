import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getRole, withRole } from "@/lib/page-helpers";

export default function Reports({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const reports = [["/reports/farm", "Farm health report"], ["/reports/field", "Field health report"], ["/reports/tree", "Tree-level disease report"], ["/reports/model", "AI model performance report"]];
  return <AppShell role={role}><h2 className="mb-4 text-2xl font-semibold">ESN LABS Reports And Exports</h2><div className="grid gap-4 md:grid-cols-2">{reports.map(([href, label]) => <Link key={href} href={withRole(href, role)} className="rounded-lg border border-border bg-card p-4 hover:bg-accent">ESN LABS {label}<span className="mt-2 block text-sm text-muted-foreground">ESN LABS CSV export prototype. PDF/Excel comes after backend wiring.</span></Link>)}</div></AppShell>;
}
