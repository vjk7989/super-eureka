import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getRole, withRole } from "@/lib/page-helpers";

export default function UploadCenter({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const cards = [
    ["/admin/uploads/tree-data", "Tree CSV / JSON", "Validate tree IDs, farm/field codes, coordinates, health status, stage, and confidence."],
    ["/admin/uploads/drone-images", "Drone Images", "Mock image upload and preview path convention before Supabase Storage."],
    ["/admin/uploads/predictions", "AI Predictions", "Preview model outputs and simulate tree sync across dashboards."]
  ];
  return <AppShell role={role}><h2 className="mb-4 text-2xl font-semibold">ESN LABS Upload Center</h2><div className="grid gap-4 md:grid-cols-3">{cards.map(([href, title, text]) => <Link key={href} href={withRole(href, role)} className="rounded-lg border border-border bg-card p-4 hover:bg-accent"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">ESN LABS {text}</p></Link>)}</div></AppShell>;
}
