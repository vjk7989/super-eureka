import { AppShell } from "@/components/app-shell";
import { ConfidenceChart, TrendChart } from "@/components/charts";
import { MetricCard } from "@/components/metric-card";
import { getRole } from "@/lib/page-helpers";

export default function ModelPerformance({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><h2 className="mb-4 text-2xl font-semibold">Model Performance</h2><div className="mb-4 grid gap-4 sm:grid-cols-3"><MetricCard label="Model" value="v1.2.0" detail="Current prototype model" /><MetricCard label="Accuracy estimate" value="91%" detail="Human-corrected sample" /><MetricCard label="False-positive rate" value="7.4%" detail="Last 30 days" /></div><div className="grid gap-4 xl:grid-cols-2"><ConfidenceChart /><TrendChart /></div></AppShell>;
}
