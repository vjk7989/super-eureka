import { AppShell } from "@/components/app-shell";
import { MapCanvas } from "@/components/map-canvas";
import { getRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function DroneScanDetail({ params, searchParams }: { params: { id: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const scan = repositories.scans.byId(params.id);
  const trees = scan ? repositories.trees.byField(scan.fieldId) : [];
  return <AppShell role={role}><h2 className="mb-2 text-2xl font-semibold">{scan?.scanCode ?? "Drone Scan"}</h2><p className="mb-4 text-muted-foreground">Prediction summary, related trees, inspections, and false positives from this scan.</p><MapCanvas farms={repositories.farms.list()} fields={repositories.fields.list()} trees={trees} /></AppShell>;
}
