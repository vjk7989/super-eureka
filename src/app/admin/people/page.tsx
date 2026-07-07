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
      <div className="mb-4 flex items-center justify-between">
        <div><h2 className="text-2xl font-semibold">People Management</h2><p className="text-muted-foreground">Invite, assign, disable, and reallocate people.</p></div>
        <Link className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground" href={withRole("/admin/people/add", role)}>Add person</Link>
      </div>
      <div className="overflow-auto rounded-lg border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-left"><tr><th className="px-3 py-3">Name</th><th>Email</th><th>Role</th><th>Assigned farms</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{people.map((person) => <tr key={person.id} className="border-t border-border"><td className="px-3 py-3 font-medium">{person.fullName}</td><td>{person.email}</td><td>{roleLabels[person.role]}</td><td>{person.assignedFarmIds.length}</td><td><Badge className="bg-emerald-100 text-emerald-800">{person.status}</Badge></td><td><Link className="underline" href={withRole(`/admin/people/${person.id}`, role)}>View / Edit</Link></td></tr>)}</tbody>
        </table>
      </div>
    </AppShell>
  );
}
