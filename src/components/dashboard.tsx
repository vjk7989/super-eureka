import { dashboardStats } from "@/lib/repositories";
import type { Tree } from "@/lib/types";
import { DiseaseStageChart, TrendChart, ConfidenceChart } from "./charts";
import { MetricCard } from "./metric-card";

export function Dashboard({ title, description, trees }: { title: string; description: string; trees: Tree[] }) {
  const stats = dashboardStats(trees);
  const stageData = [
    { name: "Healthy", value: stats.healthy },
    { name: "Early", value: stats.earlyStage },
    { name: "Stage 1", value: stats.stage1 },
    { name: "Stage 2", value: stats.stage2 },
    { name: "Stage 3", value: stats.stage3 }
  ];
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total acres" value={stats.totalAcres.toLocaleString()} detail="Across prototype farms" />
        <MetricCard label="Mapped trees" value={stats.totalMappedTrees.toLocaleString()} detail={`${stats.visibleTrees} loaded in prototype grid`} />
        <MetricCard label="Affected trees" value={stats.affected} detail={`${stats.suspected} suspected`} />
        <MetricCard label="Pending inspections" value={stats.pendingInspections} detail={`${stats.falsePositives} false positives`} />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <DiseaseStageChart data={stageData} />
        <TrendChart />
        <ConfidenceChart />
      </div>
    </section>
  );
}
