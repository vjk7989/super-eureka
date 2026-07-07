import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { InspectionStatusBadge } from "@/components/badges";
import { getRole, withRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function ManagerInspections({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold">Inspection Workflow</h2><Link className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground" href={withRole("/manager/inspections/assign", role)}>Assign inspection</Link></div><div className="space-y-3">{repositories.inspections.list().map((inspection) => { const tree = repositories.trees.byId(inspection.treeId); return <Link key={inspection.id} href={withRole(`/inspector/tasks/${inspection.id}`, role)} className="flex items-center justify-between rounded-lg border border-border bg-card p-4"><div><p className="font-medium">{tree?.treeCode}</p><p className="text-sm text-muted-foreground">Due {inspection.dueDate} · priority {inspection.priority}</p></div><InspectionStatusBadge value={inspection.status} /></Link>; })}</div></AppShell>;
}
