import { AppShell } from "@/components/app-shell";
import { PrototypeForm } from "@/components/forms";
import { getRole } from "@/lib/page-helpers";

export default function EditFarm({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><PrototypeForm title="Edit Farm" fields={["Farm name", "Farm code", "Status", "Assigned manager", "Boundary polygon"]} /></AppShell>;
}
