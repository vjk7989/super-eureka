import { clsx, type ClassValue } from "clsx";
import type { DiseaseStage, HealthStatus, Role } from "./types";

export function cn(...values: ClassValue[]) {
  return clsx(values);
}

export const roleLabels: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  farm_manager: "Farm Manager",
  field_inspector: "Field Inspector",
  ai_dev: "AI / Dev Team",
  viewer: "Viewer"
};

export const stageLabels: Record<DiseaseStage, string> = {
  none: "None",
  early_stage: "Early Stage",
  stage_1: "Stage 1",
  stage_2: "Stage 2",
  stage_3: "Stage 3"
};

export const healthLabels: Record<HealthStatus, string> = {
  healthy: "Healthy",
  suspected: "Suspected",
  affected: "Affected",
  removed: "Removed",
  dead: "Dead"
};

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function downloadCsv<T extends object>(filename: string, rows: T[]) {
  const headers = Object.keys(rows[0] ?? { empty: "" });
  const escape = (value: unknown) => {
    const raw = String(value ?? "");
    const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const csv = [headers.join(","), ...rows.map((row) => {
    const record = row as Record<string, unknown>;
    return headers.map((header) => escape(record[header])).join(",");
  })].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
