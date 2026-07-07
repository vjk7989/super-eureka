import { AppShell } from "@/components/app-shell";
import { TreeGridTable } from "@/components/tree-grid-table";
import { getRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function FieldTreeGrid({ params, searchParams }: { params: { id: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><h2 className="mb-4 text-2xl font-semibold">Field Tree Grid</h2><TreeGridTable trees={repositories.trees.byField(params.id)} /></AppShell>;
}
