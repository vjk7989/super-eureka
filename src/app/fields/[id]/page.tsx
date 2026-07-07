import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Dashboard } from "@/components/dashboard";
import { getRole, withRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function FieldDetail({ params, searchParams }: { params: { id: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const field = repositories.fields.byId(params.id);
  return <AppShell role={role}><div className="mb-4 flex gap-2"><Link className="rounded-md border border-border px-3 py-2 text-sm" href={withRole(`/fields/${params.id}/map`, role)}>Map</Link><Link className="rounded-md border border-border px-3 py-2 text-sm" href={withRole(`/fields/${params.id}/tree-grid`, role)}>Tree grid</Link></div><Dashboard title={field?.name ?? "Field"} description="Field map, disease breakdown, inspections, and risk trend." trees={repositories.trees.byField(params.id)} /></AppShell>;
}
