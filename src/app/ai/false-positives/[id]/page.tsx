import { AppShell } from "@/components/app-shell";
import { PrototypeForm } from "@/components/forms";
import { getRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function FalsePositiveDetail({ params, searchParams }: { params: { id: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  const report = repositories.falsePositives.byId(params.id);
  const tree = report ? repositories.trees.byId(report.treeId) : undefined;
  return <AppShell role={role}><h2 className="mb-2 text-2xl font-semibold">{tree?.treeCode ?? "False Positive"}</h2><p className="mb-4 text-muted-foreground">{report?.reasonTag} · {report?.devNotes}</p><PrototypeForm title="AI/dev review" fields={["Status", "Dev notes", "Training dataset action"]} /></AppShell>;
}
