import { AppShell } from "@/components/app-shell";
import { Dashboard } from "@/components/dashboard";
import { getRole } from "@/lib/page-helpers";
import { scopeTreesForRole } from "@/lib/repositories";

export default function AdminOverview({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><Dashboard title="Command Overview" description="Map-first executive view of farms, disease pressure, inspections, and AI feedback." trees={scopeTreesForRole(role)} /></AppShell>;
}
