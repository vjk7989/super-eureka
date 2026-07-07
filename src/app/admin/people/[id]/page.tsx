import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badges";
import { PrototypeForm } from "@/components/forms";
import { getRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";
import { roleLabels } from "@/lib/utils";

export default function PersonDetail({ params, searchParams }: { params: { id: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const person = repositories.profiles.byId(params.id);
  return (
    <AppShell role={role}>
      <h2 className="text-2xl font-semibold">{person?.fullName ?? "Person"}</h2>
      <p className="text-muted-foreground">{person ? `${roleLabels[person.role]} · ${person.email}` : "Prototype person not found"}</p>
      <div className="my-4 flex gap-2"><Badge className="bg-emerald-100 text-emerald-800">Active</Badge><Badge className="bg-blue-100 text-blue-800">Reallocation history ready</Badge></div>
      <PrototypeForm title="Edit and reallocate person" fields={["Phone", "Assigned farm", "Assigned field", "Reallocation reason"]} />
    </AppShell>
  );
}
