import { AppShell } from "@/components/app-shell";
import { MapCanvas } from "@/components/map-canvas";
import { getRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function FarmMap({ params, searchParams }: { params: { id: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><h2 className="mb-4 text-2xl font-semibold">Farm Map</h2><MapCanvas farms={repositories.farms.list().filter((farm) => farm.id === params.id)} fields={repositories.fields.byFarm(params.id)} trees={repositories.trees.byFarm(params.id)} /></AppShell>;
}
