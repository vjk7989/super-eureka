import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { InspectionStatusBadge } from "@/components/badges";
import { getRole, withRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function InspectorTasks({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><h2 className="mb-4 text-2xl font-semibold">Mobile Inspection Tasks</h2><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{repositories.inspections.list().map((inspection) => { const tree = repositories.trees.byId(inspection.treeId); return <Link key={inspection.id} href={withRole(`/inspector/tasks/${inspection.id}`, role)} className="rounded-lg border border-border bg-card p-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">{tree?.treeCode}</h3><InspectionStatusBadge value={inspection.status} /></div><p className="text-sm text-muted-foreground">GPS {tree?.latitude}, {tree?.longitude}</p><p className="mt-2 text-sm">Large-button task card for field use.</p></Link>; })}</div></AppShell>;
}
