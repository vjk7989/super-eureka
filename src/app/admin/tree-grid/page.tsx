import { AppShell } from "@/components/app-shell";
import { TreeGridTable } from "@/components/tree-grid-table";
import { getRole } from "@/lib/page-helpers";
import { repositories, scopeTreesForRole } from "@/lib/repositories";

export default function AdminTreeGrid({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><h2 className="mb-4 text-2xl font-semibold">Tree Grid</h2><TreeGridTable trees={role === "super_admin" ? repositories.trees.list() : scopeTreesForRole(role)} /></AppShell>;
}
