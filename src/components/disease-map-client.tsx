"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import Link from "next/link";
import { CircleMarker, MapContainer, Polygon, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { CircleMarker as LeafletCircleMarker, LatLngBoundsExpression, LatLngExpression, Polygon as LeafletPolygon } from "leaflet";
import type { DiseaseStage, Farm, Field, HealthStatus, InspectionStatus, Profile, Tree } from "@/lib/types";
import { profiles } from "@/lib/mock-data";
import { downloadCsv, formatPercent, stageLabels } from "@/lib/utils";
import { DiseaseStageBadge, HealthStatusBadge, InspectionStatusBadge } from "./badges";
import { MetricCard } from "./metric-card";
import { TreeGridTable } from "./tree-grid-table";

interface MapFilters {
  state: string;
  farmId: string;
  fieldId: string;
  inChargeId: string;
  healthStatus: HealthStatus | "all";
  diseaseStage: DiseaseStage | "all";
  inspectionStatus: InspectionStatus | "all";
  minConfidence: number;
  startDate: string;
  endDate: string;
  mostAffectedFirst: boolean;
  heatmap: boolean;
}

type SelectionMode = "farm" | "field" | "tree";

interface MapGridSelection {
  id: string;
  name: string;
  scopeType: "all" | "farm" | "field" | "tree" | "filtered";
  farmId?: string;
  fieldId?: string;
  treeIds: string[];
  filters: MapFilters;
  selectedTreeId?: string;
  createdAt: string;
}

const defaultFilters: MapFilters = {
  state: "",
  farmId: "",
  fieldId: "",
  inChargeId: "",
  healthStatus: "all",
  diseaseStage: "all",
  inspectionStatus: "all",
  minConfidence: 0,
  startDate: "",
  endDate: "",
  mostAffectedFirst: false,
  heatmap: true
};

const stageColor: Record<DiseaseStage, string> = {
  none: "#16a34a",
  early_stage: "#facc15",
  stage_1: "#fb923c",
  stage_2: "#ea580c",
  stage_3: "#dc2626"
};

const stageWeight: Record<DiseaseStage, number> = {
  none: 0,
  early_stage: 0.28,
  stage_1: 0.45,
  stage_2: 0.72,
  stage_3: 1
};

export function DiseaseMapClient({ farms, fields, trees }: { farms: Farm[]; fields: Field[]; trees: Tree[] }) {
  const [filters, setFilters] = useState<MapFilters>(defaultFilters);
  const [selectedFarmId, setSelectedFarmId] = useState(filters.farmId);
  const [selectedFieldId, setSelectedFieldId] = useState(filters.fieldId);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("tree");
  const [savedGrids, setSavedGrids] = useState<MapGridSelection[]>([]);
  const [gridName, setGridName] = useState("Current map grid");

  const states = useMemo(() => Array.from(new Set(farms.map((farm) => farm.state))).sort(), [farms]);
  const inCharges = useMemo(() => relevantInCharges(profiles, farms, fields), [farms, fields]);
  const visibleFarms = useMemo(() => filterFarms(farms, filters), [farms, filters]);
  const visibleFields = useMemo(() => filterFields(fields, visibleFarms, filters, selectedFarmId), [fields, visibleFarms, filters, selectedFarmId]);
  const visibleTrees = useMemo(() => filterTrees(trees, farms, fields, filters, selectedFarmId, selectedFieldId), [trees, farms, fields, filters, selectedFarmId, selectedFieldId]);
  const affectedHeatTrees = visibleTrees.filter((tree) => tree.geoQuality === "valid" && tree.currentDiseaseStage !== "none");
  const bounds = buildBounds(visibleTrees, visibleFields, visibleFarms);
  const selectedFarm = farms.find((farm) => farm.id === selectedFarmId) ?? null;
  const selectedField = fields.find((field) => field.id === selectedFieldId) ?? null;
  const mostAffectedFarms = rankFarms(visibleFarms, visibleTrees);
  const mostAffectedFields = rankFields(visibleFields, visibleTrees);
  const gridTrees = visibleTrees;
  const selectedScopeType = selectedFieldId ? "field" : selectedFarmId ? "farm" : hasActiveFilters(filters) ? "filtered" : "all";
  const scopeStats = summarizeTrees(gridTrees);

  useEffect(() => {
    if (selectedTree && !visibleTrees.some((tree) => tree.id === selectedTree.id)) {
      setSelectedTree(null);
    }
    if (selectedFieldId && !visibleFields.some((field) => field.id === selectedFieldId)) {
      setSelectedFieldId("");
      setSelectedTree(null);
    }
    if (selectedFarmId && !visibleFarms.some((farm) => farm.id === selectedFarmId)) {
      setSelectedFarmId("");
      setSelectedFieldId("");
      setSelectedTree(null);
    }
  }, [selectedFarmId, selectedFieldId, selectedTree, visibleFarms, visibleFields, visibleTrees]);

  function updateFilter<K extends keyof MapFilters>(key: K, value: MapFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    if (key === "farmId") {
      setSelectedFarmId(String(value));
      setSelectedFieldId("");
      setSelectedTree(null);
    }
    if (key === "fieldId") {
      setSelectedFieldId(String(value));
      setSelectedTree(null);
    }
  }

  function updateSelectionMode(mode: SelectionMode) {
    setSelectionMode(mode);
    if (mode !== "tree") setSelectedTree(null);
    if (mode === "farm") setSelectedFieldId("");
  }

  function selectFarm(farm: Farm) {
    setSelectedFarmId(farm.id);
    setSelectedFieldId("");
    setSelectedTree(null);
  }

  function selectField(field: Field) {
    setSelectedFarmId(field.farmId);
    setSelectedFieldId(field.id);
    setSelectedTree(null);
  }

  function selectTree(tree: Tree) {
    setSelectionMode("tree");
    setSelectedTree(tree);
  }

  function selectMapTree(tree: Tree) {
    if (selectionMode === "farm") {
      const farm = farms.find((item) => item.id === tree.farmId);
      if (farm) selectFarm(farm);
      return;
    }
    if (selectionMode === "field") {
      const field = fields.find((item) => item.id === tree.fieldId);
      if (field) selectField(field);
      return;
    }
    selectTree(tree);
  }

  function selectMapField(field: Field) {
    if (selectionMode === "farm") {
      const farm = farms.find((item) => item.id === field.farmId);
      if (farm) selectFarm(farm);
      return;
    }
    selectField(field);
  }

  function createMapGrid() {
    const cleanName = gridName.trim() || `${selectedScopeType} map grid`;
    const nextGrid: MapGridSelection = {
      id: `map-grid-${Date.now()}`,
      name: cleanName,
      scopeType: selectedScopeType,
      farmId: selectedFarmId || undefined,
      fieldId: selectedFieldId || undefined,
      treeIds: gridTrees.map((tree) => tree.id),
      filters: { ...filters },
      selectedTreeId: selectedTree?.id,
      createdAt: new Date().toISOString()
    };
    setSavedGrids((current) => [nextGrid, ...current]);
    setGridName(`${cleanName} copy`);
  }

  function reopenMapGrid(grid: MapGridSelection) {
    setFilters(grid.filters);
    setSelectedFarmId(grid.farmId ?? grid.filters.farmId ?? "");
    setSelectedFieldId(grid.fieldId ?? grid.filters.fieldId ?? "");
    setSelectedTree(grid.selectedTreeId ? trees.find((tree) => tree.id === grid.selectedTreeId) ?? null : null);
    setSelectionMode(grid.scopeType === "farm" || grid.scopeType === "field" ? grid.scopeType : "tree");
  }

  function exportMapGrid(grid: MapGridSelection) {
    const rows = trees.filter((tree) => grid.treeIds.includes(tree.id));
    downloadCsv(`${grid.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "map-grid"}.csv`, rows);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[312px_minmax(0,1fr)]" data-testid="map-grid-workspace">
      <FilterPanel filters={filters} states={states} farms={visibleFarms.length ? visibleFarms : farms} fields={fields.filter((field) => !filters.farmId || field.farmId === filters.farmId)} inCharges={inCharges} onChange={updateFilter} onReset={() => { setFilters(defaultFilters); setSelectedFarmId(""); setSelectedFieldId(""); setSelectedTree(null); setSelectionMode("tree"); }} />
      <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <section className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-card px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Map surface</p>
                <h2 className="text-lg font-semibold leading-tight">ESN LABS Oil Palm Disease Map</h2>
                <p className="mt-1 max-w-3xl text-sm leading-5 text-muted-foreground">ESN LABS operational demo data for oil palm disease geographies.</p>
              </div>
              <Legend />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/50 px-4 py-3">
              <SelectionModeControl value={selectionMode} onChange={updateSelectionMode} />
              <p className="text-sm text-muted-foreground">Grid scope: <span className="font-medium text-foreground">{scopeLabel(selectedScopeType, selectedFarm, selectedField, selectedTree)}</span></p>
            </div>
            <ScopeSummaryStrip mode={selectionMode} selectedTree={selectedTree} stats={scopeStats} />
            <div className="relative h-[min(720px,calc(100vh-190px))] min-h-[460px]" data-testid="operational-map">
              <MapContainer center={[20.4, 82.1]} zoom={5} scrollWheelZoom className="z-0">
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FitToBounds bounds={bounds} focusTree={selectedTree} />
                {visibleFarms.map((farm) => (
                  <FarmPolygon
                    key={farm.id}
                    farm={farm}
                    isSelected={selectedFarmId === farm.id}
                    selectionMode={selectionMode}
                    onSelect={() => selectFarm(farm)}
                  />
                ))}
                {visibleFields.map((field) => (
                  <FieldPolygon
                    key={field.id}
                    field={field}
                    isSelected={selectedFieldId === field.id}
                    selectionMode={selectionMode}
                    onSelect={() => selectMapField(field)}
                  />
                ))}
                {filters.heatmap && affectedHeatTrees.map((tree) => (
                  <CircleMarker
                    key={`${tree.id}-heat`}
                    center={[tree.latitude, tree.longitude]}
                    radius={18 + stageWeight[tree.currentDiseaseStage] * tree.currentConfidence * 34}
                    pathOptions={{ color: stageColor[tree.currentDiseaseStage], fillColor: stageColor[tree.currentDiseaseStage], fillOpacity: 0.16, opacity: 0.08, weight: 1 }}
                  />
                ))}
                {visibleTrees.filter((tree) => tree.geoQuality === "valid").map((tree) => (
                  <TreeMarker
                    key={tree.id}
                    tree={tree}
                    isSelected={selectedTree?.id === tree.id}
                    onSelect={() => selectMapTree(tree)}
                  />
                ))}
              </MapContainer>
              {affectedHeatTrees.length === 0 ? <div className="absolute bottom-4 left-4 z-[400] max-w-[calc(100%-2rem)] rounded-md bg-background/95 px-3 py-2 text-sm shadow">No affected trees match the current heatmap filters.</div> : null}
            </div>
          </section>
          <section className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm" data-testid="selection-grid">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Selection grid</p>
                <h3 className="text-lg font-semibold leading-tight">{gridTrees.length} mapped trees</h3>
                <p className="mt-1 text-sm text-muted-foreground">Rows keep the full visible scope; selecting a tree highlights it and opens details.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:w-64" value={gridName} onChange={(event) => setGridName(event.target.value)} aria-label="Map grid name" />
                <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60" onClick={createMapGrid} disabled={gridTrees.length === 0} data-testid="create-map-grid">Create grid from current map</button>
              </div>
            </div>
            <TreeGridTable trees={gridTrees} selectedTreeId={selectedTree?.id} onSelectTree={selectTree} exportFilename="current-map-grid.csv" />
          </section>
        </div>
        <MapInsightPanel farms={mostAffectedFarms} fields={mostAffectedFields} selectedFarm={selectedFarm} selectedField={selectedField} selectedTree={selectedTree} trees={gridTrees} savedGrids={savedGrids} onReopenGrid={reopenMapGrid} onExportGrid={exportMapGrid} onDeleteGrid={(id) => setSavedGrids((current) => current.filter((grid) => grid.id !== id))} />
      </div>
    </div>
  );
}

function SelectionModeControl({ value, onChange }: { value: SelectionMode; onChange: (value: SelectionMode) => void }) {
  const modes: Array<[SelectionMode, string]> = [["farm", "Farm scope"], ["field", "Block scope"], ["tree", "Tree detail"]];
  return (
    <div className="inline-flex rounded-md border border-border bg-background p-1" aria-label="Map selection mode" data-testid="selection-mode-control">
      {modes.map(([mode, label]) => (
        <button key={mode} className={`rounded px-3 py-1.5 text-sm font-medium ${value === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`} onClick={() => onChange(mode)} type="button" data-testid={`selection-mode-${mode}`}>{label}</button>
      ))}
    </div>
  );
}

function ScopeSummaryStrip({ mode, selectedTree, stats }: { mode: SelectionMode; selectedTree: Tree | null; stats: ReturnType<typeof summarizeTrees> }) {
  const modeLabel = mode === "farm" ? "Farm scope" : mode === "field" ? "Block scope" : "Tree detail";
  return (
    <div className="grid gap-2 border-b border-border bg-background px-4 py-3 text-sm sm:grid-cols-2 xl:grid-cols-5">
      <SummaryPill label="Mode" value={modeLabel} />
      <SummaryPill label="Visible trees" value={stats.total} />
      <SummaryPill label="Affected" value={stats.affected} tone="risk" />
      <SummaryPill label="Severe" value={stats.severe} tone="risk" />
      <SummaryPill label="Selected" value={selectedTree?.treeCode ?? "None"} />
    </div>
  );
}

function SummaryPill({ label, value, tone = "default" }: { label: string; value: string | number; tone?: "default" | "risk" }) {
  return (
    <div className={`rounded-md border px-3 py-2 ${tone === "risk" ? "border-red-200 bg-red-50 text-red-900" : "border-border bg-muted/50"}`}>
      <p className="text-[11px] font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-semibold">{value}</p>
    </div>
  );
}

function FarmPolygon({ farm, isSelected, selectionMode, onSelect }: { farm: Farm; isSelected: boolean; selectionMode: SelectionMode; onSelect: () => void }) {
  const ref = useRef<LeafletPolygon | null>(null);
  useLayerClass(ref, `map-farm-layer map-farm-${farm.id}`);
  return (
    <Polygon
      ref={ref}
      positions={toLatLngs(farm.boundary)}
      pathOptions={{ color: isSelected ? "#0f766e" : "#047857", weight: isSelected ? 3 : 2, fillOpacity: selectionMode === "farm" ? 0.12 : 0.08 }}
      eventHandlers={{ click: onSelect }}
    >
      <Tooltip sticky>{farm.name} - risk {farm.riskScore}</Tooltip>
    </Polygon>
  );
}

function FieldPolygon({ field, isSelected, selectionMode, onSelect }: { field: Field; isSelected: boolean; selectionMode: SelectionMode; onSelect: () => void }) {
  const ref = useRef<LeafletPolygon | null>(null);
  useLayerClass(ref, `map-field-layer map-field-${field.id}`);
  return (
    <Polygon
      ref={ref}
      positions={toLatLngs(field.boundary)}
      pathOptions={{ color: isSelected ? "#0e7490" : "#0891b2", weight: isSelected ? 3 : 2, fillOpacity: selectionMode === "field" ? 0.18 : 0.14 }}
      eventHandlers={{ click: onSelect }}
    >
      <Tooltip sticky>{field.name} - risk {field.riskScore}</Tooltip>
    </Polygon>
  );
}

function TreeMarker({ tree, isSelected, onSelect }: { tree: Tree; isSelected: boolean; onSelect: () => void }) {
  const ref = useRef<LeafletCircleMarker | null>(null);
  useLayerClass(ref, `map-tree-layer map-tree-${tree.id}`);
  return (
    <CircleMarker
      ref={ref}
      center={[tree.latitude, tree.longitude]}
      radius={isSelected ? 12 : tree.currentDiseaseStage === "none" ? 7 : 9}
      pathOptions={{ color: isSelected ? "#111827" : "#ffffff", fillColor: markerColor(tree), fillOpacity: 0.95, opacity: 1, weight: isSelected ? 3 : 2 }}
      eventHandlers={{ click: onSelect }}
    >
      <Tooltip sticky>{tree.treeCode} - {stageLabels[tree.currentDiseaseStage]} - {formatPercent(tree.currentConfidence)}</Tooltip>
    </CircleMarker>
  );
}

function useLayerClass(ref: MutableRefObject<LeafletCircleMarker | LeafletPolygon | null>, className: string) {
  useEffect(() => {
    const element = ref.current?.getElement();
    if (!element) return;
    element.classList.add(...className.split(" "));
  }, [className, ref]);
}

function FilterPanel({ filters, states, farms, fields, inCharges, onChange, onReset }: { filters: MapFilters; states: string[]; farms: Farm[]; fields: Field[]; inCharges: Profile[]; onChange: <K extends keyof MapFilters>(key: K, value: MapFilters[K]) => void; onReset: () => void }) {
  return (
    <aside className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-auto">
      <div className="border-b border-border pb-3">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Control rail</p>
        <h3 className="font-semibold">Map Filters</h3>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">Farm scope, disease state, confidence, and inspection status.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <Select label="State" value={filters.state} onChange={(value) => onChange("state", value)} options={states.map((state) => [state, state])} />
        <Select label="Farm" value={filters.farmId} onChange={(value) => onChange("farmId", value)} options={farms.map((farm) => [farm.id, farm.name])} />
        <Select label="Field / Block" value={filters.fieldId} onChange={(value) => onChange("fieldId", value)} options={fields.map((field) => [field.id, field.name])} />
        <Select label="In-charge" value={filters.inChargeId} onChange={(value) => onChange("inChargeId", value)} options={inCharges.map((profile) => [profile.id, profile.fullName])} />
        <Select label="Health status" value={filters.healthStatus} onChange={(value) => onChange("healthStatus", value as MapFilters["healthStatus"])} options={[["all", "All"], ["healthy", "Healthy"], ["suspected", "Suspected"], ["affected", "Affected"]]} />
        <Select label="Disease stage" value={filters.diseaseStage} onChange={(value) => onChange("diseaseStage", value as MapFilters["diseaseStage"])} options={[["all", "All"], ["none", "None"], ["early_stage", "Early Stage"], ["stage_1", "Stage 1"], ["stage_2", "Stage 2"], ["stage_3", "Stage 3"]]} />
        <Select label="Inspection status" value={filters.inspectionStatus} onChange={(value) => onChange("inspectionStatus", value as MapFilters["inspectionStatus"])} options={[["all", "All"], ["pending", "Pending"], ["in_progress", "In Progress"], ["completed", "Completed"], ["false_positive", "False Positive"], ["confirmed_positive", "Confirmed Positive"], ["needs_reinspection", "Needs Reinspection"]]} />
      </div>
      <label className="block text-sm font-medium">Minimum confidence <span className="text-muted-foreground">{Math.round(filters.minConfidence * 100)}%</span><input className="mt-2 w-full accent-primary" type="range" min={0} max={100} value={filters.minConfidence * 100} onChange={(event) => onChange("minConfidence", Number(event.target.value) / 100)} /></label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-sm font-medium">From<input className="mt-1 w-full rounded-md border border-input bg-background px-2 py-2 text-sm" type="date" value={filters.startDate} onChange={(event) => onChange("startDate", event.target.value)} /></label>
        <label className="block text-sm font-medium">To<input className="mt-1 w-full rounded-md border border-input bg-background px-2 py-2 text-sm" type="date" value={filters.endDate} onChange={(event) => onChange("endDate", event.target.value)} /></label>
      </div>
      <div className="space-y-2 rounded-md border border-border bg-muted/60 p-3">
        <label className="flex items-center gap-2 text-sm"><input className="accent-primary" type="checkbox" checked={filters.mostAffectedFirst} onChange={(event) => onChange("mostAffectedFirst", event.target.checked)} /> Most affected first</label>
        <label className="flex items-center gap-2 text-sm"><input className="accent-primary" type="checkbox" checked={filters.heatmap} onChange={(event) => onChange("heatmap", event.target.checked)} /> Show disease heatmap</label>
      </div>
      <button className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-secondary" onClick={onReset} data-testid="reset-map-filters">Reset filters</button>
    </aside>
  );
}

function MapInsightPanel({ farms, fields, selectedFarm, selectedField, selectedTree, trees, savedGrids, onReopenGrid, onExportGrid, onDeleteGrid }: { farms: Array<{ farm: Farm; affected: number; severe: number }>; fields: Array<{ field: Field; affected: number; severe: number }>; selectedFarm: Farm | null; selectedField: Field | null; selectedTree: Tree | null; trees: Tree[]; savedGrids: MapGridSelection[]; onReopenGrid: (grid: MapGridSelection) => void; onExportGrid: (grid: MapGridSelection) => void; onDeleteGrid: (id: string) => void }) {
  const pending = trees.filter((tree) => tree.inspectionStatus === "pending" || tree.inspectionStatus === "in_progress").length;
  return (
    <aside className="min-w-0 space-y-4 2xl:sticky 2xl:top-20 2xl:max-h-[calc(100vh-6rem)] 2xl:overflow-auto">
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-2">
        <MetricCard label="Visible trees" value={trees.length} detail="Filtered operational scope" tone="info" />
        <MetricCard label="Pending inspections" value={pending} detail="Current filter set" tone="risk" />
      </div>
      {selectedTree ? <TreeDrawer tree={selectedTree} /> : <SummaryCard selectedFarm={selectedFarm} selectedField={selectedField} farms={farms} fields={fields} />}
      <SavedMapGrids grids={savedGrids} onReopen={onReopenGrid} onExport={onExportGrid} onDelete={onDeleteGrid} />
    </aside>
  );
}

function SavedMapGrids({ grids, onReopen, onExport, onDelete }: { grids: MapGridSelection[]; onReopen: (grid: MapGridSelection) => void; onExport: (grid: MapGridSelection) => void; onDelete: (id: string) => void }) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm" data-testid="saved-map-grids">
      <div>
        <p className="text-xs font-semibold uppercase text-muted-foreground">Saved map grids</p>
        <h3 className="text-lg font-semibold leading-tight">Session grids</h3>
      </div>
      {grids.length === 0 ? <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">Create a grid from the current map to keep a temporary working set.</p> : null}
      <div className="space-y-2">
        {grids.map((grid) => (
          <div key={grid.id} className="rounded-md border border-border bg-muted/60 p-3" data-testid="saved-map-grid-card" data-scope-type={grid.scopeType}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{grid.name}</p>
                <p className="text-xs text-muted-foreground">{grid.treeIds.length} trees - {grid.scopeType} - {new Date(grid.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium hover:bg-secondary" onClick={() => onReopen(grid)} type="button" data-testid="reopen-saved-grid">Reopen</button>
              <button className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium hover:bg-secondary" onClick={() => onExport(grid)} type="button" data-testid="export-saved-grid">Export CSV</button>
              <button className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-destructive hover:bg-secondary" onClick={() => onDelete(grid.id)} type="button" data-testid="delete-saved-grid">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ selectedFarm, selectedField, farms, fields }: { selectedFarm: Farm | null; selectedField: Field | null; farms: Array<{ farm: Farm; affected: number; severe: number }>; fields: Array<{ field: Field; affected: number; severe: number }> }) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase text-muted-foreground">{selectedField ? "Selected block" : selectedFarm ? "Selected farm" : "Overall risk ranking"}</p>
        <h3 className="text-xl font-semibold leading-tight">{selectedField?.name ?? selectedFarm?.name ?? "Most affected areas"}</h3>
      </div>
      <section>
        <h4 className="mb-2 text-sm font-semibold">Most affected farms</h4>
        <div className="space-y-2">{farms.slice(0, 4).map((item) => <RankRow key={item.farm.id} label={item.farm.name} meta={`${item.affected} affected - ${item.severe} severe`} />)}</div>
      </section>
      <section>
        <h4 className="mb-2 text-sm font-semibold">Most affected blocks</h4>
        <div className="space-y-2">{fields.slice(0, 5).map((item) => <RankRow key={item.field.id} label={item.field.name} meta={`${item.affected} affected - ${item.severe} severe`} />)}</div>
      </section>
    </div>
  );
}

function TreeDrawer({ tree }: { tree: Tree }) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm" data-testid="selected-tree-panel">
      <div>
        <p className="text-xs font-semibold uppercase text-muted-foreground">Selected tree</p>
        <h3 className="text-xl font-semibold leading-tight">{tree.treeCode}</h3>
      </div>
      <div className="aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted">
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${tree.latestImageUrl})` }} role="img" aria-label={`${tree.treeCode} latest scan image`} />
      </div>
      <div className="flex flex-wrap gap-2"><HealthStatusBadge value={tree.currentHealthStatus} /><DiseaseStageBadge value={tree.currentDiseaseStage} /><InspectionStatusBadge value={tree.inspectionStatus} /></div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <dt className="text-muted-foreground">Latitude</dt><dd>{tree.latitude.toFixed(6)}</dd>
        <dt className="text-muted-foreground">Longitude</dt><dd>{tree.longitude.toFixed(6)}</dd>
        <dt className="text-muted-foreground">Probability</dt><dd>{formatPercent(tree.currentConfidence)}</dd>
        <dt className="text-muted-foreground">Risk score</dt><dd>{tree.riskScore}</dd>
        <dt className="text-muted-foreground">Scan date</dt><dd>{tree.latestScanDate}</dd>
        <dt className="text-muted-foreground">Treatment</dt><dd className="capitalize">{tree.treatmentStatus.replaceAll("_", " ")}</dd>
      </dl>
      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase text-muted-foreground">Model probability</span>
          <span className="font-semibold">{formatPercent(tree.currentConfidence)}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(tree.currentConfidence * 100)}%` }} />
        </div>
      </div>
      <section>
        <h4 className="mb-2 text-sm font-semibold">History</h4>
        <div className="space-y-2">
          {tree.history.length ? tree.history.map((event) => (
            <div key={event.id} className="rounded-md border border-border bg-muted/70 px-3 py-2 text-sm">
              <p className="font-medium">{event.eventTitle}</p>
              <p className="text-muted-foreground">{event.createdAt} - {event.eventDescription}</p>
            </div>
          )) : <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">No history events recorded.</p>}
        </div>
      </section>
      <div className="flex flex-wrap gap-2">
        <Link className="inline-flex rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90" href={`/trees/${tree.id}`}>Open full profile</Link>
        <Link className="inline-flex rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold hover:bg-secondary" href={`/manager/inspections/assign?tree=${tree.id}`}>Assign inspection</Link>
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: Array<[string, string]>; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium">
      <span className="mb-1 block">{label}</span>
      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function Legend() {
  const entries: Array<[string, string]> = [["Healthy", "#16a34a"], ["Early", "#facc15"], ["Stage 1", "#fb923c"], ["Stage 2", "#ea580c"], ["Stage 3", "#dc2626"], ["False +", "#9333ea"], ["Pending", "#2563eb"]];
  return <div className="flex max-w-full flex-wrap gap-2">{entries.map(([label, color]) => <span key={label} className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium shadow-xs"><span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />{label}</span>)}</div>;
}

function RankRow({ label, meta }: { label: string; meta: string }) {
  return <div className="rounded-md border border-border bg-muted/70 px-3 py-2 text-sm"><p className="font-medium">{label}</p><p className="text-muted-foreground">{meta}</p></div>;
}

function FitToBounds({ bounds, focusTree }: { bounds: LatLngBoundsExpression | null; focusTree?: Tree | null }) {
  const map = useMap();
  useEffect(() => {
    if (focusTree?.geoQuality === "valid") {
      map.setView([focusTree.latitude, focusTree.longitude], Math.max(map.getZoom(), 16), { animate: true });
      return;
    }
    if (bounds) {
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 13 });
    }
  }, [bounds, focusTree, map]);
  return null;
}

function hasActiveFilters(filters: MapFilters) {
  return filters.state !== ""
    || filters.farmId !== ""
    || filters.fieldId !== ""
    || filters.inChargeId !== ""
    || filters.healthStatus !== "all"
    || filters.diseaseStage !== "all"
    || filters.inspectionStatus !== "all"
    || filters.minConfidence > 0
    || filters.startDate !== ""
    || filters.endDate !== ""
    || filters.mostAffectedFirst
    || !filters.heatmap;
}

function scopeLabel(scopeType: MapGridSelection["scopeType"], selectedFarm: Farm | null, selectedField: Field | null, selectedTree: Tree | null) {
  if (selectedTree) return selectedTree.treeCode;
  if (selectedField) return selectedField.name;
  if (selectedFarm) return selectedFarm.name;
  if (scopeType === "filtered") return "Filtered map";
  return "All visible map data";
}

function filterFarms(farms: Farm[], filters: MapFilters) {
  return farms.filter((farm) => (!filters.state || farm.state === filters.state) && (!filters.farmId || farm.id === filters.farmId) && (!filters.inChargeId || farm.inChargeId === filters.inChargeId));
}

function filterFields(fields: Field[], visibleFarms: Farm[], filters: MapFilters, selectedFarmId: string) {
  const farmIds = new Set(visibleFarms.map((farm) => farm.id));
  return fields.filter((field) => farmIds.has(field.farmId) && (!selectedFarmId || field.farmId === selectedFarmId) && (!filters.fieldId || field.id === filters.fieldId) && (!filters.inChargeId || field.inChargeId === filters.inChargeId));
}

function filterTrees(trees: Tree[], farms: Farm[], fields: Field[], filters: MapFilters, selectedFarmId: string, selectedFieldId: string) {
  const filtered = trees.filter((tree) => {
    const farm = farms.find((item) => item.id === tree.farmId);
    const field = fields.find((item) => item.id === tree.fieldId);
    return tree.geoQuality === "valid"
      && (!filters.state || farm?.state === filters.state)
      && (!filters.farmId || tree.farmId === filters.farmId)
      && (!selectedFarmId || tree.farmId === selectedFarmId)
      && (!filters.fieldId || tree.fieldId === filters.fieldId)
      && (!selectedFieldId || tree.fieldId === selectedFieldId)
      && (!filters.inChargeId || farm?.inChargeId === filters.inChargeId || field?.inChargeId === filters.inChargeId)
      && (filters.healthStatus === "all" || tree.currentHealthStatus === filters.healthStatus)
      && (filters.diseaseStage === "all" || tree.currentDiseaseStage === filters.diseaseStage)
      && (filters.inspectionStatus === "all" || tree.inspectionStatus === filters.inspectionStatus)
      && tree.currentConfidence >= filters.minConfidence
      && (!filters.startDate || tree.latestScanDate >= filters.startDate)
      && (!filters.endDate || tree.latestScanDate <= filters.endDate);
  });
  return filters.mostAffectedFirst ? filtered.sort((a, b) => b.riskScore - a.riskScore || b.currentConfidence - a.currentConfidence) : filtered;
}

function rankFarms(farms: Farm[], trees: Tree[]) {
  return farms.map((farm) => {
    const farmTrees = trees.filter((tree) => tree.farmId === farm.id);
    return { farm, affected: farmTrees.filter((tree) => tree.currentHealthStatus === "affected").length, severe: farmTrees.filter((tree) => tree.currentDiseaseStage === "stage_2" || tree.currentDiseaseStage === "stage_3").length };
  }).sort((a, b) => b.severe - a.severe || b.affected - a.affected || b.farm.riskScore - a.farm.riskScore);
}

function rankFields(fields: Field[], trees: Tree[]) {
  return fields.map((field) => {
    const fieldTrees = trees.filter((tree) => tree.fieldId === field.id);
    return { field, affected: fieldTrees.filter((tree) => tree.currentHealthStatus === "affected").length, severe: fieldTrees.filter((tree) => tree.currentDiseaseStage === "stage_2" || tree.currentDiseaseStage === "stage_3").length };
  }).sort((a, b) => b.severe - a.severe || b.affected - a.affected || b.field.riskScore - a.field.riskScore);
}

function relevantInCharges(allProfiles: Profile[], farms: Farm[], fields: Field[]) {
  const ids = new Set([...farms.map((farm) => farm.inChargeId), ...fields.map((field) => field.inChargeId)]);
  return allProfiles.filter((profile) => ids.has(profile.id));
}

function markerColor(tree: Tree) {
  if (tree.inspectionStatus === "false_positive") return "#9333ea";
  if (tree.inspectionStatus === "pending") return "#2563eb";
  return stageColor[tree.currentDiseaseStage];
}

function toLatLngs(points: [number, number][]): LatLngExpression[] {
  return points.map(([lng, lat]) => [lat, lng]);
}

function buildBounds(trees: Tree[], fields: Field[], farms: Farm[]): LatLngBoundsExpression | null {
  const treePoints = trees.filter((tree) => tree.geoQuality === "valid").map((tree) => [tree.latitude, tree.longitude] as [number, number]);
  const fieldPoints = fields.flatMap((field) => field.boundary.map(([lng, lat]) => [lat, lng] as [number, number]));
  const farmPoints = farms.flatMap((farm) => farm.boundary.map(([lng, lat]) => [lat, lng] as [number, number]));
  const points = treePoints.length ? treePoints : fieldPoints.length ? fieldPoints : farmPoints;
  return points.length ? points : null;
}

function summarizeTrees(sourceTrees: Tree[]) {
  return {
    total: sourceTrees.length,
    affected: sourceTrees.filter((tree) => tree.currentHealthStatus === "affected").length,
    severe: sourceTrees.filter((tree) => tree.currentDiseaseStage === "stage_2" || tree.currentDiseaseStage === "stage_3").length
  };
}
