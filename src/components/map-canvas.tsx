"use client";

import dynamic from "next/dynamic";
import type { Farm, Field, Tree } from "@/lib/types";

const DiseaseMap = dynamic(() => import("./disease-map-client").then((module) => module.DiseaseMapClient), {
  ssr: false,
  loading: () => <div className="grid min-h-[620px] place-items-center rounded-lg border border-border bg-muted text-sm font-medium text-muted-foreground shadow-sm">Loading operational map...</div>
});

export function MapCanvas({ farms, fields, trees }: { farms: Farm[]; fields: Field[]; trees: Tree[] }) {
  return <DiseaseMap farms={farms} fields={fields} trees={trees} />;
}
