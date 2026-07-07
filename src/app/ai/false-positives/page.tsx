import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge, DiseaseStageBadge } from "@/components/badges";
import { getRole, withRole } from "@/lib/page-helpers";
import { repositories } from "@/lib/repositories";

export default function FalsePositivePage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><h2 className="mb-4 text-2xl font-semibold">False Positive Feedback</h2><div className="space-y-3">{repositories.falsePositives.list().map((report) => { const tree = repositories.trees.byId(report.treeId); return <Link key={report.id} href={withRole(`/ai/false-positives/${report.id}`, role)} className="flex items-center justify-between rounded-lg border border-border bg-card p-4"><div><p className="font-medium">{tree?.treeCode}</p><p className="text-sm text-muted-foreground">{report.reasonTag} · {report.modelVersion} · {Math.round(report.aiConfidence * 100)}%</p></div><div className="flex gap-2"><DiseaseStageBadge value={report.aiStage} /><Badge className="bg-purple-100 text-purple-800">{report.status}</Badge></div></Link>; })}</div></AppShell>;
}
