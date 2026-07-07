import { AppShell } from "@/components/app-shell";
import { DiseaseStageBadge, HealthStatusBadge } from "@/components/badges";
import { PrototypeForm } from "@/components/forms";
import { getRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function InspectorTaskDetail({ params, searchParams }: { params: { id: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const inspection = repositories.inspections.byId(params.id);
  const tree = inspection ? repositories.trees.byId(inspection.treeId) : undefined;
  return <AppShell role={role}>{tree ? <div className="space-y-4"><section className="rounded-lg border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Inspection task</p><h2 className="text-2xl font-semibold">{tree.treeCode}</h2><div className="my-3 flex gap-2"><HealthStatusBadge value={tree.currentHealthStatus} /><DiseaseStageBadge value={tree.currentDiseaseStage} /></div><a className="inline-flex rounded-md bg-primary px-4 py-3 text-primary-foreground" href={`https://maps.google.com/?q=${tree.latitude},${tree.longitude}`}>Navigate to tree</a></section><PrototypeForm title="Submit ground inspection" fields={["Ground photo", "Result", "Corrected stage", "Reason tag", "Inspector notes"]} /></div> : <p>Task not found.</p>}</AppShell>;
}
