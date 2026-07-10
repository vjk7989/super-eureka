import { AppShell } from "@/components/app-shell";
import { Dashboard } from "@/components/dashboard";
import { getRole } from "@/lib/page-helpers";
import { repositories, scopeTreesForRole } from "@/lib/repositories";

export default function AdminOverview({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const trees = scopeTreesForRole(role);
  const farmIds = new Set(trees.map((tree) => tree.farmId));
  const fieldIds = new Set(trees.map((tree) => tree.fieldId));
  const farms = repositories.farms.list().filter((farm) => farmIds.has(farm.id));
  const fields = repositories.fields.list().filter((field) => fieldIds.has(field.id));
  return <AppShell role={role}><Dashboard title="Command Overview" description="Map-first executive view of farms, disease pressure, inspections, and AI feedback." trees={trees} farms={farms} fields={fields} showOverviewMap /></AppShell>;
}
