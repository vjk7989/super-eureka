import { AppShell } from "@/components/app-shell";
import { PrototypeForm } from "@/components/forms";
import { getRole } from "@/lib/page-helpers";

export default function AddFieldPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><PrototypeForm title="Add Field / Block" fields={["Field name", "Field code", "Farm", "Area acres", "Boundary polygon", "Assigned inspectors"]} /></AppShell>;
}
