"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import type { Tree } from "@/lib/types";
import { downloadCsv, formatPercent } from "@/lib/utils";
import { DiseaseStageBadge, HealthStatusBadge, InspectionStatusBadge } from "./badges";

const columnHelper = createColumnHelper<Tree>();
const stageHeat = {
  none: "bg-emerald-50/30",
  early_stage: "bg-yellow-50/60",
  stage_1: "bg-orange-50/70",
  stage_2: "bg-orange-100/80",
  stage_3: "bg-red-50/90"
};

export function TreeGridTable({ trees, selectedTreeId, onSelectTree, exportFilename = "tree-grid.csv", testId = "tree-grid-table" }: { trees: Tree[]; selectedTreeId?: string; onSelectTree?: (tree: Tree) => void; exportFilename?: string; testId?: string }) {
  const [query, setQuery] = useState("");
  const columns = useMemo(() => [
    columnHelper.accessor("treeCode", { header: "Tree ID", cell: (info) => <Link className="font-medium text-primary underline" href={`/trees/${info.row.original.id}`}>{info.getValue()}</Link> }),
    columnHelper.accessor("latitude", { header: "Latitude", cell: (info) => info.getValue().toFixed(6) }),
    columnHelper.accessor("longitude", { header: "Longitude", cell: (info) => info.getValue().toFixed(6) }),
    columnHelper.accessor("currentHealthStatus", { header: "Health", cell: (info) => <HealthStatusBadge value={info.getValue()} /> }),
    columnHelper.accessor("currentDiseaseStage", { header: "Stage", cell: (info) => <DiseaseStageBadge value={info.getValue()} /> }),
    columnHelper.accessor("currentConfidence", { header: "Probability", cell: (info) => <ProbabilityCell value={info.getValue()} /> }),
    columnHelper.accessor("latestScanDate", { header: "Latest scan" }),
    columnHelper.accessor("inspectionStatus", { header: "Inspection", cell: (info) => <InspectionStatusBadge value={info.getValue()} /> }),
    columnHelper.accessor("riskScore", { header: "Risk", cell: (info) => info.getValue() }),
    columnHelper.display({ id: "actions", header: "Actions", cell: (info) => <div className="flex gap-2 text-xs"><Link className="underline" href={`/trees/${info.row.original.id}/map`}>Map</Link><Link className="underline" href={`/manager/inspections/assign?tree=${info.row.original.id}`}>Assign</Link></div> })
  ], []);
  const table = useReactTable({
    data: trees,
    columns,
    state: { globalFilter: query },
    onGlobalFilterChange: setQuery,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel()
  });
  const visibleRows = table.getFilteredRowModel().rows.map((row) => row.original);
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs sm:max-w-sm" placeholder="Search tree ID, status, stage..." value={query} onChange={(event) => setQuery(event.target.value)} />
        <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90" onClick={() => downloadCsv(exportFilename, visibleRows)}>Export CSV</button>
      </div>
      <div className="overflow-auto rounded-lg border border-border bg-card shadow-sm" data-testid={testId}>
        <table className="min-w-full text-sm">
          <thead className="text-left">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th key={header.id} className="whitespace-nowrap px-3 py-3">
                    <button className="font-semibold hover:text-foreground" onClick={header.column.getToggleSortingHandler()}>{flexRender(header.column.columnDef.header, header.getContext())}</button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`border-t border-border ${stageHeat[row.original.currentDiseaseStage]} ${onSelectTree ? "cursor-pointer hover:bg-secondary/70 focus-within:bg-secondary/70" : ""} ${selectedTreeId === row.original.id ? "outline outline-2 outline-primary/60" : ""}`}
                onClick={() => onSelectTree?.(row.original)}
                onKeyDown={(event) => {
                  if (!onSelectTree) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectTree(row.original);
                  }
                }}
                tabIndex={onSelectTree ? 0 : undefined}
                aria-selected={selectedTreeId === row.original.id}
                data-testid="tree-grid-row"
                data-tree-id={row.original.id}
              >
                {row.getVisibleCells().map((cell) => <td key={cell.id} className="whitespace-nowrap px-3 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {visibleRows.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No trees match the current filters.</p> : null}
      </div>
    </div>
  );
}

function ProbabilityCell({ value }: { value: number }) {
  const percent = Math.round(value * 100);
  const fill = percent >= 85 ? "bg-red-500" : percent >= 70 ? "bg-orange-500" : percent >= 55 ? "bg-amber-400" : "bg-emerald-500";
  return (
    <div className="min-w-28">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold tabular-nums">{formatPercent(value)}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${fill}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
