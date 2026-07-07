"use client";

import { useState } from "react";
import type { Farm, Field, Tree } from "@/lib/types";
import { stageLabels } from "@/lib/utils";
import { DiseaseStageBadge, HealthStatusBadge } from "./badges";

const colors = {
  none: "#16a34a",
  early_stage: "#facc15",
  stage_1: "#fb923c",
  stage_2: "#ea580c",
  stage_3: "#dc2626"
};

export function MapCanvas({ farms, fields, trees }: { farms: Farm[]; fields: Field[]; trees: Tree[] }) {
  const [selected, setSelected] = useState<Tree | null>(trees[0] ?? null);
  const validTrees = trees.filter((tree) => Number.isFinite(tree.latitude) && Number.isFinite(tree.longitude));
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-border bg-[linear-gradient(135deg,#dff3ea,#f5faf7)]">
        <div className="absolute left-4 top-4 rounded-md bg-background/90 px-3 py-2 text-sm shadow">MapLibre-compatible fallback canvas</div>
        {farms.map((farm, index) => (
          <div key={farm.id} className="absolute rounded-lg border-2 border-emerald-700/50 bg-emerald-300/10" style={{ left: `${8 + index * 40}%`, top: `${12 + index * 18}%`, width: "34%", height: "34%" }}>
            <span className="m-2 inline-block rounded bg-background/90 px-2 py-1 text-xs">{farm.name}</span>
          </div>
        ))}
        {fields.map((field, index) => (
          <div key={field.id} className="absolute rounded border border-teal-700/70 bg-teal-200/20" style={{ left: `${16 + index * 20}%`, top: `${24 + index * 12}%`, width: "18%", height: "18%" }} />
        ))}
        {validTrees.map((tree, index) => (
          <button
            key={tree.id}
            className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
            style={{ left: `${20 + (index * 13) % 60}%`, top: `${34 + (index * 17) % 42}%`, background: colors[tree.currentDiseaseStage] }}
            title={`${tree.treeCode} ${stageLabels[tree.currentDiseaseStage]}`}
            onClick={() => setSelected(tree)}
          />
        ))}
        {validTrees.length === 0 ? <div className="absolute inset-0 grid place-items-center text-muted-foreground">No valid coordinates available.</div> : null}
      </div>
      <aside className="rounded-lg border border-border bg-card p-4">
        {selected ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Selected tree</p>
              <h3 className="text-xl font-semibold">{selected.treeCode}</h3>
            </div>
            <div className="flex gap-2"><HealthStatusBadge value={selected.currentHealthStatus} /><DiseaseStageBadge value={selected.currentDiseaseStage} /></div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <dt className="text-muted-foreground">Latitude</dt><dd>{selected.latitude.toFixed(6)}</dd>
              <dt className="text-muted-foreground">Longitude</dt><dd>{selected.longitude.toFixed(6)}</dd>
              <dt className="text-muted-foreground">Confidence</dt><dd>{Math.round(selected.currentConfidence * 100)}%</dd>
              <dt className="text-muted-foreground">Scan date</dt><dd>{selected.latestScanDate}</dd>
            </dl>
            <a className="inline-flex rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground" href={`/trees/${selected.id}`}>Open tree profile</a>
          </div>
        ) : <p className="text-sm text-muted-foreground">Select a tree marker to inspect details.</p>}
      </aside>
    </div>
  );
}
