"use client";

import {
  ColumnDef,
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
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { ReactNode } from "react";
import AdgGrid from "./adg-grid";
import AdgPagination from "./adg-pagination";
import AdgToolbar from "./adg-toolbar";
import AdgSettings from "./adg-settings";
import { AdgColumnDef, GridSettingsSnapshot } from "./adg-types";
import { applySettingsToTable, deriveInitialSettings } from "./adg-auxiliary";
import { DENSITY_ROW_CLASS } from "./adg-constants";

interface AdgDataGridConfig {
  toolbarLeft?: ReactNode;
  toolbarCenter?: ReactNode;
  toolbarRight?: ReactNode;
}

interface AdgDataGridProps<T> {
  data: T[];
  columns: AdgColumnDef<T>[];
  initialSettings?: Partial<GridSettingsSnapshot>;
  onSettingsChange?: (s: GridSettingsSnapshot) => void;
  config?: AdgDataGridConfig;
}

export default function AdgDataGrid<T>({
  data,
  columns,
  initialSettings,
  onSettingsChange,
  config,
}: AdgDataGridProps<T>) {
  // table states
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
    left: [],
    right: [],
  });
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({});
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);

  // settings state (draft in dialog)
  const baseSettings: GridSettingsSnapshot = React.useMemo(
    () => ({
      columns: deriveInitialSettings(columns),
      density: initialSettings?.density ?? "medium",
      palette: initialSettings?.palette ?? "blue",
    }),
    [columns]
  );

  const [settings, setSettings] =
    React.useState<GridSettingsSnapshot>(baseSettings);
  const [draft, setDraft] = React.useState<GridSettingsSnapshot>(settings);
  const [openSettings, setOpenSettings] = React.useState(false);

  const globalFilterFn = (
    row: Row<T>,
    _columnId: string,
    filterValue: string
  ) => {
    if (!filterValue) return true;
    const v = filterValue.toLowerCase();
    return [
      "dealId",
      "product",
      "side",
      "ccyPair",
      "desk",
      "legalEntity",
      "region",
      "site",
      "status",
    ].some((k) =>
      String(row.original[k as keyof T])
        .toLowerCase()
        .includes(v)
    );
  };

  const table = useReactTable({
    data,
    //columns: columns.map((c, i) => ({ ...c, id: (c.id as string) || (c.accessorKey as string) || `col_${i}` })),
    columns: columns.map((c, i) => ({
      ...c,
      id: (c.id as string) || `col_${i}`,
    })),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      columnPinning,
      columnSizing,
      columnOrder,
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
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    enableRowSelection: true,
    globalFilterFn: globalFilterFn,
  });

  // Apply current settings to the table on mount & when settings change
  React.useEffect(() => {
    applySettingsToTable(table, settings);
    // derive pinning arrays from settings
    const left = settings.columns
      .filter((c) => c.pin === "left")
      .sort((a, b) => a.order - b.order)
      .map((c) => c.id);
    const right = settings.columns
      .filter((c) => c.pin === "right")
      .sort((a, b) => a.order - b.order)
      .map((c) => c.id);
    setColumnPinning({ left, right });
    // let parent know
    onSettingsChange?.(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(settings)]);

  const paletteClass =
    settings.palette === "blue"
      ? "[--adg-head:bg:theme(colors.blue.50)] dark:[--adg-head:bg:theme(colors.blue.950)]"
      : "[--adg-head:bg:theme(colors.gray.50)] dark:[--adg-head:bg:theme(colors.gray.900)]";

  const densityRow = DENSITY_ROW_CLASS[settings.density];

  return (
    <div className="w-full">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        {/* Toolbar */}
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

        <AdgSettings
          open={openSettings}
          onOpenChange={(v) => {
            setOpenSettings(v);
            if (!v) setDraft(settings);
          }}
          table={table}
          draft={draft}
          setDraft={setDraft}
          onApply={() => {
            setSettings(draft);
            setOpenSettings(false);
          }}
        />

        {/* Table */}
        <AdgGrid table={table} />

        {/* Pagination */}
        <AdgPagination table={table} />
      </div>
    </div>
  );
}
