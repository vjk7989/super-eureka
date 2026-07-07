import { AppShell } from "@/components/app-shell";
import { DiseaseStageBadge, HealthStatusBadge, InspectionStatusBadge } from "@/components/badges";
import { getRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";
import { formatPercent } from "@/lib/utils";

export default function TreeProfile({ params, searchParams }: { params: { id: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const tree = repositories.trees.byId(params.id);
  const events = tree ? repositories.history.byTree(tree.id) : [];
  return <AppShell role={role}>{tree ? <div className="grid gap-4 xl:grid-cols-[360px_1fr]"><section className="rounded-lg border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Tree profile</p><h2 className="text-2xl font-semibold">{tree.treeCode}</h2><div className="my-4 flex flex-wrap gap-2"><HealthStatusBadge value={tree.currentHealthStatus} /><DiseaseStageBadge value={tree.currentDiseaseStage} /><InspectionStatusBadge value={tree.inspectionStatus} /></div><dl className="grid grid-cols-2 gap-3 text-sm"><dt>Latitude</dt><dd>{tree.latitude}</dd><dt>Longitude</dt><dd>{tree.longitude}</dd><dt>Confidence</dt><dd>{formatPercent(tree.currentConfidence)}</dd><dt>Model</dt><dd>{tree.modelVersion}</dd></dl></section><section className="rounded-lg border border-border bg-card p-4"><h3 className="mb-3 text-lg font-semibold">Tree history</h3>{events.map((event) => <div key={event.id} className="border-b border-border py-3 last:border-0"><p className="font-medium">{event.eventTitle}</p><p className="text-sm text-muted-foreground">{event.createdAt} · {event.eventDescription}</p></div>)}</section></div> : <p>Tree not found.</p>}</AppShell>;
}
