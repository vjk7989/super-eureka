import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { InspectionStatusBadge } from "@/components/badges";
import { getRole, withRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function InspectorTasks({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><div className="mb-4"><h2 className="text-2xl font-semibold leading-tight">Mobile Inspection Tasks</h2><p className="mt-1 text-sm text-muted-foreground">Tap into assigned tree checks with location and inspection status visible at a glance.</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{repositories.inspections.list().map((inspection) => { const tree = repositories.trees.byId(inspection.treeId); return <Link key={inspection.id} href={withRole(`/inspector/tasks/${inspection.id}`, role)} className="rounded-lg border border-border bg-card p-4 shadow-sm hover:border-primary hover:bg-secondary/50"><div className="mb-3 flex flex-wrap items-start justify-between gap-2"><h3 className="font-semibold leading-tight">{tree?.treeCode}</h3><InspectionStatusBadge value={inspection.status} /></div><p className="break-words text-sm text-muted-foreground">GPS {tree?.latitude}, {tree?.longitude}</p><p className="mt-2 text-sm font-medium">Large-button task card for field use.</p></Link>; })}</div></AppShell>;
}
