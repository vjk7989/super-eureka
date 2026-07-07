import { AppShell } from "@/components/app-shell";
import { MapCanvas } from "@/components/map-canvas";
import { getRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function FieldMap({ params, searchParams }: { params: { id: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const field = repositories.fields.byId(params.id);
  return <AppShell role={role}><h2 className="mb-4 text-2xl font-semibold">Field Map</h2><MapCanvas farms={field ? repositories.farms.list().filter((farm) => farm.id === field.farmId) : []} fields={field ? [field] : []} trees={repositories.trees.byField(params.id)} /></AppShell>;
}
