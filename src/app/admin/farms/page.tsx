import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { getRole, withRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function FarmsPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return (
    <AppShell role={role}>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold">Farms</h2><Link className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground" href={withRole("/admin/farms/add", role)}>Add farm</Link></div>
      <div className="grid gap-4 md:grid-cols-2">
        {repositories.farms.list().map((farm) => <Link key={farm.id} href={withRole(`/admin/farms/${farm.id}`, role)}><MetricCard label={`${farm.code} · ${farm.location}`} value={farm.name} detail={`${farm.totalAcres.toLocaleString()} acres · risk ${farm.riskScore}`} /></Link>)}
      </div>
    </AppShell>
  );
}
