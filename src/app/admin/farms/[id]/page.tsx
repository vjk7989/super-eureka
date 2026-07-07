import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Dashboard } from "@/components/dashboard";
import { getRole, withRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function FarmDetail({ params, searchParams }: { params: { id: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const farm = repositories.farms.byId(params.id);
  const trees = repositories.trees.byFarm(params.id);
  return (
    <AppShell role={role}>
      <div className="mb-4 flex flex-wrap gap-2">
        <Link className="rounded-md border border-border px-3 py-2 text-sm" href={withRole(`/farms/${params.id}/map`, role)}>Map</Link>
        <Link className="rounded-md border border-border px-3 py-2 text-sm" href={withRole(`/farms/${params.id}/tree-grid`, role)}>Tree grid</Link>
        <Link className="rounded-md border border-border px-3 py-2 text-sm" href={withRole(`/farms/${params.id}/history`, role)}>History</Link>
      </div>
      <Dashboard title={farm?.name ?? "Farm"} description="Farm detail, risk, inspections, members, scans, and trend summary." trees={trees} />
    </AppShell>
  );
}
