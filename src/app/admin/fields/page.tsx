import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { getRole, withRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function FieldsPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold">Fields / Blocks</h2><Link className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground" href={withRole("/admin/fields/add", role)}>Add field</Link></div><div className="grid gap-4 md:grid-cols-3">{repositories.fields.list().map((field) => <Link key={field.id} href={withRole(`/fields/${field.id}`, role)}><MetricCard label={field.code} value={field.name} detail={`${field.areaAcres} acres · risk ${field.riskScore}`} /></Link>)}</div></AppShell>;
}
