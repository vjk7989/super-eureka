import { AppShell } from "@/components/app-shell";
import { MapCanvas } from "@/components/map-canvas";
import { getRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function TreeMap({ params, searchParams }: { params: { id: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const tree = repositories.trees.byId(params.id);
  return <AppShell role={role}><h2 className="mb-4 text-2xl font-semibold">Tree Location</h2><MapCanvas farms={repositories.farms.list()} fields={repositories.fields.list()} trees={tree ? [tree] : []} /></AppShell>;
}
