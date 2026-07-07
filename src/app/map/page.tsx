import { AppShell } from "@/components/app-shell";
import { MapCanvas } from "@/components/map-canvas";
import { getRole } from "@/lib/page-helpers";
import { repositories, scopeTreesForRole } from "@/lib/repositories";

export default function MapPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><h2 className="mb-4 text-2xl font-semibold">Interactive Map Dashboard</h2><MapCanvas farms={repositories.farms.list()} fields={repositories.fields.list()} trees={scopeTreesForRole(role)} /></AppShell>;
}
