
"use client";

import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  Row,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import * as React from "react";
import { ReactNode } from "react";
import { applySettingsToTable, deriveInitialSettings } from "./adg-auxiliary";
import { DENSITY_ROW_CLASS } from "./adg-constants";
import { buildFilterFns } from "./adg-filters";
import AdgGridVirtual from "./adg-grid-virtual";
import AdgPagination from "./adg-pagination";
import { loadSettingsFromStorage, saveSettingsToStorage } from "./adg-persist";
import AdgSettingsDnd from "./adg-settings-dnd";
import AdgToolbar from "./adg-toolbar";
import type { AdgColumnDef, GridSettingsSnapshot } from "./adg-types";

interface AdgDataGridConfig {
  storageKey?: string;             // used for persistence
  toolbarLeft?: ReactNode;
  toolbarCenter?: ReactNode;
  toolbarRight?: ReactNode;
  heightPx?: number;               // viewport height; default ~10 medium rows
}

interface AdgDataGridProps<T> {
  data: T[];
  columns: AdgColumnDef<T>[];
  initialSettings?: Partial<GridSettingsSnapshot>;
  onSettingsChange?: (s: GridSettingsSnapshot) => void;
  config?: AdgDataGridConfig;
}

const DENSITY_PX_MAP: Record<"compact"|"medium"|"large", number> = {
  compact: 36,
  medium: 44,
  large: 56,
};

export default function AdgDataGridV2<T>({
  data,
  columns,
  initialSettings,
  onSettingsChange,
  config,
}: AdgDataGridProps<T>) {
  const storageKey = config?.storageKey;

  // table states
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({ left: [], right: [] });
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({});
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);

  // settings (draft in dialog)
  const baseSettings: GridSettingsSnapshot = React.useMemo(() => ({
    columns: deriveInitialSettings(columns),
    density: initialSettings?.density ?? "medium",
    palette: initialSettings?.palette ?? "blue",
  }), [columns]);

  const persisted = typeof window !== "undefined" && storageKey ? loadSettingsFromStorage(storageKey) : undefined;
  const [settings, setSettings] = React.useState<GridSettingsSnapshot>(persisted ?? baseSettings);
  const [draft, setDraft] = React.useState<GridSettingsSnapshot>(settings);
  const [openSettings, setOpenSettings] = React.useState(false);

  const filterFns = React.useMemo(() => buildFilterFns<T>(), []);

  const globalFilterFn = (
    row: Row<T>,
    _columnId: string,
    filterValue: string
  ) => {
    if (!filterValue) return true;
    const v = filterValue.toLowerCase();
    // naive cross-column search
    return Object.values(row.original as any).some((val) => String(val ?? "").toLowerCase().includes(v));
  };

  const table = useReactTable({
    data,
    
    columns: columns.map((c, i) => {
      const id = (c.id as string) || `col_${i}`;
      const meta: any = (c as any).meta;
      let filterFn = (c as any).filterFn;
      if (meta?.filter?.kind === "text") filterFn = "text";
      if (meta?.filter?.kind === "number") filterFn = "number";
      if (meta?.filter?.kind === "enum") filterFn = "enum";
      if (meta?.filter?.kind === "date") filterFn = "date";
      return { ...c, id, filterFn };
    }),

    state: {
      sorting, columnFilters, columnVisibility, rowSelection,
      globalFilter, columnPinning, columnSizing, columnOrder,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    globalFilterFn,
    filterFns, // register our filterFns
  });

  // Apply settings on mount & when they change
  React.useEffect(() => {
    applySettingsToTable(table, settings);
    const left = settings.columns.filter(c=>c.pin==="left").sort((a,b)=>a.order-b.order).map(c=>c.id);
    const right = settings.columns.filter(c=>c.pin==="right").sort((a,b)=>a.order-b.order).map(c=>c.id);
    setColumnPinning({ left, right });
    onSettingsChange?.(settings);
    if (storageKey) saveSettingsToStorage(storageKey, settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(settings), storageKey]);

  // derive view props
  const densityRowClass = DENSITY_ROW_CLASS[settings.density];
  const rowHeightPx = DENSITY_PX_MAP[settings.density];
  const heightPx = config?.heightPx ?? rowHeightPx * 10 + 116; // ~10 rows + header & paddings

  return (
    <div className="w-full">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <AdgToolbar
          table={table}
          openSettings={openSettings}
          setOpenSettings={setOpenSettings}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          injectLeft={config?.toolbarLeft}
          injectCenter={config?.toolbarCenter}
          injectRight={config?.toolbarRight}
        />

        <AdgSettingsDnd
          open={openSettings}
          onOpenChange={(v) => { setOpenSettings(v); if (!v) setDraft(settings); }}
          table={table}
          draft={draft}
          setDraft={setDraft}
          onApply={() => { setSettings(draft); setOpenSettings(false); }}
        />

        {/* Virtualized grid (sticky header) */}
        <AdgGridVirtual table={table} rowHeightPx={rowHeightPx} heightPx={heightPx} />

        <AdgPagination table={table} />
      </div>
    </div>
  );
}
