import { AppShell } from "@/components/app-shell";
import { MapCanvas } from "@/components/map-canvas";
import { getRole } from "@/lib/page-helpers";
import { repositories, scopeTreesForRole } from "@/lib/repositories";

export default function MapPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><div className="mb-4"><h2 className="text-2xl font-semibold leading-tight">ESN LABS Interactive Map Dashboard</h2><p className="mt-1 text-sm text-muted-foreground">ESN LABS operators can filter farms, blocks, tree health, confidence, and inspection ownership from one GIS surface.</p></div><MapCanvas farms={repositories.farms.list()} fields={repositories.fields.list()} trees={scopeTreesForRole(role)} /></AppShell>;
}
