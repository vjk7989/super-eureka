"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, Polygon, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import type { DiseaseStage, Farm, Field, Tree } from "@/lib/types";
import { formatPercent, stageLabels } from "@/lib/utils";

const stageColor: Record<DiseaseStage, string> = {
  none: "#16a34a",
  early_stage: "#facc15",
  stage_1: "#fb923c",
  stage_2: "#ea580c",
  stage_3: "#dc2626"
};

export function OverviewMapPanel({ farms, fields, trees }: { farms: Farm[]; fields: Field[]; trees: Tree[] }) {
  const scopedFarmIds = new Set(trees.map((tree) => tree.farmId));
  const scopedFieldIds = new Set(trees.map((tree) => tree.fieldId));
  const visibleFarms = farms.filter((farm) => scopedFarmIds.has(farm.id));
  const visibleFields = fields.filter((field) => scopedFieldIds.has(field.id));
  const validTrees = trees.filter((tree) => tree.geoQuality === "valid");
  const bounds = buildBounds(validTrees, visibleFields, visibleFarms);
  const severe = validTrees.filter((tree) => tree.currentDiseaseStage === "stage_2" || tree.currentDiseaseStage === "stage_3").length;

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm" data-testid="overview-map-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">Operational map</p>
          <h3 className="text-lg font-semibold leading-tight">Active disease geography</h3>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-md border border-border bg-muted px-2 py-1 font-semibold">{validTrees.length} trees</span>
          <span className="rounded-md border border-red-200 bg-red-50 px-2 py-1 font-semibold text-red-800">{severe} severe</span>
        </div>
      </div>
      <div className="h-[360px] min-h-[320px]">
        <MapContainer center={[20.4, 82.1]} zoom={5} scrollWheelZoom={false} className="z-0">
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FitToBounds bounds={bounds} />
          {visibleFarms.map((farm) => (
            <Polygon key={farm.id} positions={toLatLngs(farm.boundary)} pathOptions={{ color: "#047857", weight: 2, fillOpacity: 0.07 }}>
              <Tooltip sticky>{farm.name} - risk {farm.riskScore}</Tooltip>
            </Polygon>
          ))}
          {visibleFields.map((field) => (
            <Polygon key={field.id} positions={toLatLngs(field.boundary)} pathOptions={{ color: "#0891b2", weight: 1.5, fillOpacity: 0.13 }}>
              <Tooltip sticky>{field.name} - risk {field.riskScore}</Tooltip>
            </Polygon>
          ))}
          {validTrees.map((tree) => (
            <CircleMarker
              key={tree.id}
              center={[tree.latitude, tree.longitude]}
              radius={tree.currentDiseaseStage === "none" ? 6 : 8}
              pathOptions={{ color: "#ffffff", fillColor: stageColor[tree.currentDiseaseStage], fillOpacity: 0.95, opacity: 1, weight: 2 }}
            >
              <Tooltip sticky>{tree.treeCode} - {stageLabels[tree.currentDiseaseStage]} - {formatPercent(tree.currentConfidence)}</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

function FitToBounds({ bounds }: { bounds: LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [24, 24], maxZoom: 12 });
  }, [bounds, map]);
  return null;
}

function toLatLngs(points: [number, number][]): LatLngExpression[] {
  return points.map(([lng, lat]) => [lat, lng]);
}

function buildBounds(trees: Tree[], fields: Field[], farms: Farm[]): LatLngBoundsExpression | null {
  const treePoints = trees.map((tree) => [tree.latitude, tree.longitude] as [number, number]);
  const fieldPoints = fields.flatMap((field) => field.boundary.map(([lng, lat]) => [lat, lng] as [number, number]));
  const farmPoints = farms.flatMap((farm) => farm.boundary.map(([lng, lat]) => [lat, lng] as [number, number]));
  const points = treePoints.length ? treePoints : fieldPoints.length ? fieldPoints : farmPoints;
  return points.length ? points : null;
}
