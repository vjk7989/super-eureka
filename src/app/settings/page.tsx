import { AppShell } from "@/components/app-shell";
import { PrototypeForm } from "@/components/forms";
import { getRole } from "@/lib/page-helpers";

export default function Settings({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><PrototypeForm title="ESN LABS System Settings" fields={["Default model version", "Map style URL", "Inspection SLA days", "Export retention days"]} /></AppShell>;
}
