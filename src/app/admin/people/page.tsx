import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badges";
import { getRole, withRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";
import { roleLabels } from "@/lib/utils";

export default function PeoplePage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const people = repositories.profiles.list();
  return (
    <AppShell role={role}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-2xl font-semibold leading-tight">People Management</h2><p className="mt-1 text-sm text-muted-foreground">Invite, assign, disable, and reallocate people.</p></div>
        <Link className="inline-flex rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90" href={withRole("/admin/people/add", role)}>Add person</Link>
      </div>
      <div className="overflow-auto rounded-lg border border-border bg-card shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="text-left"><tr><th className="px-3 py-3">Name</th><th className="px-3 py-3">Email</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Assigned farms</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Actions</th></tr></thead>
          <tbody>{people.map((person) => <tr key={person.id} className="border-t border-border"><td className="whitespace-nowrap px-3 py-3 font-medium">{person.fullName}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{person.email}</td><td className="whitespace-nowrap px-3 py-3">{roleLabels[person.role]}</td><td className="px-3 py-3">{person.assignedFarmIds.length}</td><td className="px-3 py-3"><Badge className="border-emerald-200 bg-emerald-50 text-emerald-800 before:bg-emerald-500">{person.status}</Badge></td><td className="whitespace-nowrap px-3 py-3"><Link className="font-medium text-primary underline" href={withRole(`/admin/people/${person.id}`, role)}>View / Edit</Link></td></tr>)}</tbody>
        </table>
      </div>
    </AppShell>
  );
}
