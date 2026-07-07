import type { DiseaseStage, HealthStatus, InspectionStatus } from "@/lib/types";
import { cn, healthLabels, stageLabels } from "@/lib/utils";

const tone = {
  healthy: "border-emerald-200 bg-emerald-50 text-emerald-800 before:bg-emerald-500",
  suspected: "border-amber-200 bg-amber-50 text-amber-800 before:bg-amber-500",
  affected: "border-red-200 bg-red-50 text-red-800 before:bg-red-500",
  removed: "border-zinc-300 bg-zinc-100 text-zinc-700 before:bg-zinc-500",
  dead: "border-zinc-400 bg-zinc-200 text-zinc-800 before:bg-zinc-700",
  none: "border-emerald-200 bg-emerald-50 text-emerald-800 before:bg-emerald-500",
  early_stage: "border-yellow-200 bg-yellow-50 text-yellow-800 before:bg-yellow-500",
  stage_1: "border-orange-200 bg-orange-50 text-orange-800 before:bg-orange-500",
  stage_2: "border-orange-300 bg-orange-100 text-orange-900 before:bg-orange-600",
  stage_3: "border-red-200 bg-red-50 text-red-800 before:bg-red-500",
  pending: "border-blue-200 bg-blue-50 text-blue-800 before:bg-blue-500",
  in_progress: "border-cyan-200 bg-cyan-50 text-cyan-800 before:bg-cyan-500",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800 before:bg-emerald-500",
  false_positive: "border-purple-200 bg-purple-50 text-purple-800 before:bg-purple-500",
  confirmed_positive: "border-red-200 bg-red-50 text-red-800 before:bg-red-500",
  needs_reinspection: "border-amber-200 bg-amber-50 text-amber-800 before:bg-amber-500"
};

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold capitalize before:h-1.5 before:w-1.5 before:rounded-full", className)}>{children}</span>;
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
