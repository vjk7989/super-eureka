import { AppShell } from "@/components/app-shell";
import { PrototypeForm } from "@/components/forms";
import { getRole } from "@/lib/page-helpers";

export default function AssignInspection({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><PrototypeForm title="Assign Inspection" fields={["Tree ID", "Inspector", "Priority", "Due date", "Assignment notes"]} /></AppShell>;
}
