import type { DiseaseStage, HealthStatus, InspectionStatus } from "@/lib/types";
import { cn, healthLabels, stageLabels } from "@/lib/utils";

const tone = {
  healthy: "bg-emerald-100 text-emerald-800",
  suspected: "bg-amber-100 text-amber-800",
  affected: "bg-red-100 text-red-800",
  removed: "bg-zinc-200 text-zinc-700",
  dead: "bg-zinc-300 text-zinc-800",
  none: "bg-emerald-100 text-emerald-800",
  early_stage: "bg-yellow-100 text-yellow-800",
  stage_1: "bg-orange-100 text-orange-800",
  stage_2: "bg-orange-200 text-orange-900",
  stage_3: "bg-red-100 text-red-800",
  pending: "bg-blue-100 text-blue-800",
  in_progress: "bg-cyan-100 text-cyan-800",
  completed: "bg-emerald-100 text-emerald-800",
  false_positive: "bg-purple-100 text-purple-800",
  confirmed_positive: "bg-red-100 text-red-800",
  needs_reinspection: "bg-amber-100 text-amber-800"
};

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", className)}>{children}</span>;
}

export function HealthStatusBadge({ value }: { value: HealthStatus }) {
  return <Badge className={tone[value]}>{healthLabels[value]}</Badge>;
}

export function DiseaseStageBadge({ value }: { value: DiseaseStage }) {
  return <Badge className={tone[value]}>{stageLabels[value]}</Badge>;
}

export function InspectionStatusBadge({ value }: { value: InspectionStatus }) {
  return <Badge className={tone[value]}>{value.replaceAll("_", " ")}</Badge>;
}
