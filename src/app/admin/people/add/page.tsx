import { AppShell } from "@/components/app-shell";
import { PersonForm } from "@/components/forms";
import { getRole } from "@/lib/page-helpers";

export default function AddPersonPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><h2 className="mb-4 text-2xl font-semibold">Add Person</h2><PersonForm /></AppShell>;
}
