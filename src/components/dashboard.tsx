import { dashboardStats, repositories } from "@/lib/repositories";
import type { Farm, Field, Tree } from "@/lib/types";
import { DiseaseStageChart, TrendChart, ConfidenceChart } from "./charts";
import { MetricCard } from "./metric-card";
import { OverviewMapCanvas } from "./overview-map-canvas";
import { DiseaseStageBadge, HealthStatusBadge, InspectionStatusBadge } from "./badges";
import { formatPercent } from "@/lib/utils";

export function Dashboard({ title, description, trees, farms = [], fields = [], showOverviewMap = false }: { title: string; description: string; trees: Tree[]; farms?: Farm[]; fields?: Field[]; showOverviewMap?: boolean }) {
  const stats = dashboardStats(trees);
  const stageData = [
    { name: "Healthy", value: stats.healthy },
    { name: "Early", value: stats.earlyStage },
    { name: "Stage 1", value: stats.stage1 },
    { name: "Stage 2", value: stats.stage2 },
    { name: "Stage 3", value: stats.stage3 }
  ];
  const rankedFarms = rankFarms(farms, trees);
  const rankedFields = rankFields(fields, trees);
  const severeQueue = trees
    .filter((tree) => tree.currentDiseaseStage === "stage_2" || tree.currentDiseaseStage === "stage_3")
    .sort((a, b) => b.riskScore - a.riskScore || b.currentConfidence - a.currentConfidence)
    .slice(0, 5);
  const recentScans = repositories.scans.list().slice(0, 4);
  const falsePositiveCount = repositories.falsePositives.list().length;
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold leading-tight">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
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
      {showOverviewMap ? (
        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <OverviewMapCanvas farms={farms} fields={fields} trees={trees} />
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-1">
            <InsightList testId="highest-risk-farms" title="Highest-risk farms" items={rankedFarms.slice(0, 4).map((item) => ({ title: item.farm.name, meta: `${item.affected} affected - ${item.severe} severe - risk ${item.farm.riskScore}` }))} />
            <InsightList testId="highest-risk-blocks" title="Highest-risk blocks" items={rankedFields.slice(0, 4).map((item) => ({ title: item.field.name, meta: `${item.affected} affected - ${item.severe} severe - risk ${item.field.riskScore}` }))} />
          </div>
        </div>
      ) : null}
      {showOverviewMap ? (
        <div className="grid gap-4 xl:grid-cols-3">
          <section data-testid="severe-stage-queue" className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Severe-stage queue</p>
              <h3 className="text-lg font-semibold leading-tight">Trees needing fast review</h3>
            </div>
            <div className="space-y-2">
              {severeQueue.map((tree) => (
                <div key={tree.id} className="rounded-md border border-border bg-muted/60 p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{tree.treeCode}</p>
                    <span className="font-semibold tabular-nums">{formatPercent(tree.currentConfidence)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2"><HealthStatusBadge value={tree.currentHealthStatus} /><DiseaseStageBadge value={tree.currentDiseaseStage} /><InspectionStatusBadge value={tree.inspectionStatus} /></div>
                </div>
              ))}
            </div>
          </section>
          <InsightList testId="recent-scan-activity" title="Recent scan activity" items={recentScans.map((scan) => ({ title: scan.scanCode, meta: `${scan.scanDate} - ${scan.totalTreesProcessed.toLocaleString()} trees - ${scan.status}` }))} />
          <section data-testid="ai-feedback-summary" className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase text-muted-foreground">AI feedback</p>
            <h3 className="mt-1 text-lg font-semibold leading-tight">Model learning signals</h3>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <dt className="text-muted-foreground">False positives</dt><dd className="font-semibold">{falsePositiveCount}</dd>
              <dt className="text-muted-foreground">Model</dt><dd className="font-semibold">v1.2.0</dd>
              <dt className="text-muted-foreground">Stage 3 queue</dt><dd className="font-semibold">{stats.stage3}</dd>
              <dt className="text-muted-foreground">Pending checks</dt><dd className="font-semibold">{stats.pendingInspections}</dd>
            </dl>
          </section>
        </div>
      ) : null}
    </section>
  );
}

function InsightList({ title, items, testId }: { title: string; items: Array<{ title: string; meta: string }>; testId?: string }) {
  return (
    <section data-testid={testId} className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
      <div className="mt-3 space-y-2">
        {items.length ? items.map((item) => (
          <div key={`${item.title}-${item.meta}`} className="rounded-md border border-border bg-muted/60 px-3 py-2 text-sm">
            <p className="font-semibold">{item.title}</p>
            <p className="mt-1 text-muted-foreground">{item.meta}</p>
          </div>
        )) : <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">No records in the current scope.</p>}
      </div>
    </section>
  );
}

function rankFarms(farms: Farm[], trees: Tree[]) {
  return farms.map((farm) => {
    const farmTrees = trees.filter((tree) => tree.farmId === farm.id);
    return { farm, affected: farmTrees.filter((tree) => tree.currentHealthStatus === "affected").length, severe: farmTrees.filter((tree) => tree.currentDiseaseStage === "stage_2" || tree.currentDiseaseStage === "stage_3").length };
  }).filter((item) => item.affected || item.severe).sort((a, b) => b.severe - a.severe || b.affected - a.affected || b.farm.riskScore - a.farm.riskScore);
}

function rankFields(fields: Field[], trees: Tree[]) {
  return fields.map((field) => {
    const fieldTrees = trees.filter((tree) => tree.fieldId === field.id);
    return { field, affected: fieldTrees.filter((tree) => tree.currentHealthStatus === "affected").length, severe: fieldTrees.filter((tree) => tree.currentDiseaseStage === "stage_2" || tree.currentDiseaseStage === "stage_3").length };
  }).filter((item) => item.affected || item.severe).sort((a, b) => b.severe - a.severe || b.affected - a.affected || b.field.riskScore - a.field.riskScore);
}
