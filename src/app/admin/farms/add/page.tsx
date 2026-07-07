import { AppShell } from "@/components/app-shell";
import { PrototypeForm } from "@/components/forms";
import { getRole } from "@/lib/page-helpers";

export default function AddFarmPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><PrototypeForm title="Add Farm" fields={["Farm name", "Farm code", "Location", "District", "State", "Total acres", "Boundary polygon"]} /></AppShell>;
}
