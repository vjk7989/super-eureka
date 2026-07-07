import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badges";
import { getRole, withRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function DroneScans({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold">Drone Scans</h2><Link className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground" href={withRole("/admin/drone-scans/upload", role)}>Upload scan</Link></div><div className="grid gap-4 md:grid-cols-2">{repositories.scans.list().map((scan) => <Link key={scan.id} href={withRole(`/admin/drone-scans/${scan.id}`, role)} className="rounded-lg border border-border bg-card p-4"><h3 className="font-semibold">{scan.scanCode}</h3><p className="text-sm text-muted-foreground">{scan.scanDate} · {scan.totalTreesProcessed.toLocaleString()} trees · {scan.modelVersion}</p><Badge className="mt-3 bg-emerald-100 text-emerald-800">{scan.status}</Badge></Link>)}</div></AppShell>;
}
