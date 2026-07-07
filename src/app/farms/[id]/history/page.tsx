import { AppShell } from "@/components/app-shell";
import { TrendChart } from "@/components/charts";
import { getRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function FarmHistory({ params, searchParams }: { params: { id: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const events = repositories.history.farmEvents(params.id);
  return <AppShell role={role}><h2 className="mb-4 text-2xl font-semibold">Farm History</h2><div className="grid gap-4 xl:grid-cols-2"><TrendChart /><div className="rounded-lg border border-border bg-card p-4">{events.map((event) => <div key={event.id} className="border-b border-border py-3 last:border-0"><p className="font-medium">{event.eventTitle}</p><p className="text-sm text-muted-foreground">{event.createdAt} · {event.eventDescription}</p></div>)}</div></div></AppShell>;
}
