"use client";

import dynamic from "next/dynamic";
import type { Farm, Field, Tree } from "@/lib/types";

const OverviewMap = dynamic(() => import("./overview-map-panel").then((module) => module.OverviewMapPanel), {
  ssr: false,
  loading: () => <div className="grid h-[360px] min-h-[320px] place-items-center rounded-lg border border-border bg-muted text-sm font-medium text-muted-foreground shadow-sm">Loading overview map...</div>
});

export function OverviewMapCanvas({ farms, fields, trees }: { farms: Farm[]; fields: Field[]; trees: Tree[] }) {
  return <OverviewMap farms={farms} fields={fields} trees={trees} />;
}
