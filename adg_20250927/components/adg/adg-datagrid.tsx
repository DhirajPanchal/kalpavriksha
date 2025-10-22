"use client";

import * as React from "react";
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
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode } from "react";
import {
  applySettingsToTable,
  deriveInitialSettings,
} from "@/components/adg/adg-auxiliary";
import type {
  AdgColumnDef,
  GridSettingsSnapshot,
  AdgColorConfig,
} from "@/components/adg/adg-types";
import AdgSettingsDnd from "@/components/adg/adg-settings";
import AdgToolbar from "@/components/adg/adg-toolbar";
import AdgPagination from "@/components/adg/adg-pagination";

import {
  saveSettingsToStorage,
  loadSettingsFromStorage,
} from "@/components/adg/adg-persist";
import AdgGrid from "@/components/adg/adg-grid";
import { buildFilterFns } from "@/components/adg/adg-filters";
import { DEFAULT_ADG_COLORS } from "@/components/adg/adg-constants";

interface AdgDataGridConfig {
  storageKey?: string;
  toolbarLeft?: ReactNode;
  toolbarCenter?: ReactNode;
  toolbarRight?: ReactNode;
  heightPx?: number;
}

interface AdgDataGridProps<T> {
  data: T[];
  columns: AdgColumnDef<T>[];
  initialSettings?: Partial<GridSettingsSnapshot>;
  onSettingsChange?: (s: GridSettingsSnapshot) => void;
  config?: AdgDataGridConfig;
  rowContextMenu?: (row: Row<T>) => ReactNode;
  onRowDoubleClick?: (data: T) => void;
  colorConfig?: Partial<AdgColorConfig>;
  busy?: {
    loading: boolean;
    error: boolean;
    success: boolean;
  };
  /** Task 3: client (default) vs server mode */
  dataMode?: "client" | "server";
  /** When in server mode, total row count returned by API */
  externalTotalRows?: number;
  /** Emits an external query payload whenever the user interacts (filter/sort/search/paging) */
  onExternalQueryChange?: (q: {
    index: number;
    size: number;
    global: string | null;
    sort: { field: string; order: "asc" | "desc" }[];
    filters: Array<
      | { field: string; operator: "LIKE"; value: string }
      | { field: string; operator: "IN"; value: string[] }
      | { field: string; operator: "GT" | "LT" | "EQ"; value: number | string }
      | {
          field: string;
          operator: "RANGE";
          from?: number | string;
          to?: number | string;
        }
    >;
  }) => void;
}

const DENSITY_PX_MAP: Record<
  "compact" | "medium" | "large" | "extralarge",
  number
> = {
  compact: 36,
  medium: 44,
  large: 56,
  extralarge: 68,
};

export default function AdgDataGrid<T>({
  data,
  columns,
  initialSettings,
  onSettingsChange,
  config,
  rowContextMenu,
  onRowDoubleClick,
  colorConfig,
  busy,
  dataMode = "client",
  externalTotalRows,
  onExternalQueryChange,
}: AdgDataGridProps<T>) {
  const storageKey = config?.storageKey;
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
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

  const baseSettings: GridSettingsSnapshot = React.useMemo(
    () => ({
      columns: deriveInitialSettings(columns),
      density: initialSettings?.density ?? "medium",
      headerWrap: initialSettings?.headerWrap ?? "single",
      wrap: initialSettings?.wrap ?? "single",
      rowsVisible: initialSettings?.rowsVisible ?? 10,
      rowZebra: initialSettings?.rowZebra ?? true,
      rowLines: initialSettings?.rowLines ?? false,
      enableColumnHover: initialSettings?.enableColumnHover ?? false,
    }),
    [
      columns,
      initialSettings?.density,
      initialSettings?.headerWrap,
      initialSettings?.wrap,
      initialSettings?.rowsVisible,
      initialSettings?.rowZebra,
      initialSettings?.rowLines,
      initialSettings?.enableColumnHover,
    ]
  );

  const [settings, setSettings] =
    React.useState<GridSettingsSnapshot>(baseSettings);
  const [draft, setDraft] = React.useState<GridSettingsSnapshot>(baseSettings);
  const [openSettings, setOpenSettings] = React.useState(false);

  React.useEffect(() => {
    if (!storageKey) return;
    try {
      const persisted = loadSettingsFromStorage(storageKey);
      if (persisted) {
        setSettings(persisted);
        setDraft(persisted);
      }
    } catch {}
  }, [storageKey]);

  const filterFns = React.useMemo(() => buildFilterFns<T>(), []);

  // const globalFilterFn = (
  //   row: Row<T>,
  //   _columnId: string,
  //   filterValue: string
  // ) => {
  //   if (!filterValue) return true;
  //   const v = filterValue.toLowerCase();
  //   return Object.values(row.original as any).some((val) =>
  //     String(val ?? "")
  //       .toLowerCase()
  //       .includes(v)
  //   );
  // };
  const isServer = dataMode === "server";

  const table: any = useReactTable({
    data,
    columns: columns.map((c, i) => {
      const id =
        ((c as any).accessorKey as string) || ((c.id as string) ?? `col_${i}`);
      const meta: any = (c as any).meta;
      let filterFn = (c as any).filterFn;
      if (meta?.filter?.kind === "text") filterFn = "text";
      if (meta?.filter?.kind === "number") filterFn = "number";
      if (meta?.filter?.kind === "enum") filterFn = "enum";
      if (meta?.filter?.kind === "date") filterFn = "date";
      return { ...c, id, filterFn };
    }),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      columnPinning,
      columnSizing,
      columnOrder,
      pagination,
    },
    enableMultiSort: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    columnResizeMode: "onChange",

    getCoreRowModel: getCoreRowModel(),
    // In server mode, DO NOT let TanStack compute; we’ll request from API.
    ...(isServer
      ? {}
      : {
          getSortedRowModel: getSortedRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
        }),
    manualSorting: isServer,
    manualFiltering: isServer,
    manualPagination: isServer,

    pageCount: isServer
      ? Math.max(
          1,
          Math.ceil(
            (externalTotalRows ?? data.length) / (pagination.pageSize || 10)
          )
        )
      : undefined,
    // Pass totalRows via meta so pagination can display it
    meta: {
      totalRows: isServer ? externalTotalRows ?? data.length : undefined,
    },

    enableRowSelection: true,
    filterFns,
  });

  React.useEffect(() => {
    applySettingsToTable(table, settings);
    const left = settings.columns
      .filter((c) => c.pin === true)
      .sort((a, b) => a.order - b.order)
      .map((c) => c.id);
    setColumnPinning({ left, right: [] });
    onSettingsChange?.(settings);
    if (storageKey) saveSettingsToStorage(storageKey, settings);
  }, [JSON.stringify(settings), storageKey]);

  const rowHeightPx = DENSITY_PX_MAP[settings.density];
  const headerHeightPx = 56;
  const heightPx = config?.heightPx ?? rowHeightPx * 10 + headerHeightPx + 44;

  const colors: AdgColorConfig = React.useMemo(() => {
    // shallow merge at sub-section level
    return {
      header: { ...DEFAULT_ADG_COLORS.header, ...(colorConfig?.header ?? {}) },
      row: { ...DEFAULT_ADG_COLORS.row, ...(colorConfig?.row ?? {}) },
      columnHover: {
        ...DEFAULT_ADG_COLORS.columnHover,
        ...(colorConfig?.columnHover ?? {}),
      },
      popover: {
        ...DEFAULT_ADG_COLORS.popover,
        ...(colorConfig?.popover ?? {}),
      },
    };
  }, [colorConfig]);

  // Build & emit an external query (server mode)
  React.useEffect(() => {
    if (!isServer || !onExternalQueryChange) return;
    const s = table.getState();
    const pageIndex = pagination.pageIndex ?? 0;
    const pageSize = pagination.pageSize ?? 10;

    // map sorting
    const sort =
      (s.sorting ?? []).map((x: any) => {
        const col = table.getAllColumns().find((c: any) => c.id === x.id);
        const field =
          (col?.columnDef as any)?.accessorKey != null
            ? (col?.columnDef as any).accessorKey
            : x.id;
        return { field, order: x.desc ? "desc" : "asc" } as const;
      }) ?? [];

    // map filters
    const filters = (s.columnFilters ?? [])
      .map((f: any) => {
        const colDef = table.getAllColumns().find((c:any) => c.id === f.id);
        const id = (colDef?.columnDef as any)?.accessorKey ?? f.id;

        const v = f.value as any;
        if (v == null) return null;
        if (typeof v === "string") {
          if (v.trim().length === 0) return null;
          return { field: id, operator: "LIKE", value: v } as const;
        }
        if (Array.isArray(v)) {
          if (!v.length) return null;
          return { field: id, operator: "IN", value: v } as const;
        }
        if (typeof v === "object") {
          if (v.mode === "range") {
            // number/date range
            const from = v.min ?? v.from;
            const to = v.max ?? v.to;
            if (from == null && to == null) return null;
            return { field: id, operator: "RANGE", from, to } as const;
          } else {
            // number/date single
            const op = v.op ?? "==";
            const val = v.value;
            if (val == null || val === "") return null;
            const operator = op === ">" ? "GT" : op === "<" ? "LT" : "EQ";
            return { field: id, operator, value: val } as const;
          }
        }
        return null;
      })
      .filter(Boolean) as any[];

    onExternalQueryChange({
      index: pageIndex,
      size: pageSize,
      global: (s.globalFilter as string) || null,
      sort,
      filters,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataMode,
    sorting,
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  return (
    <div className="w-full">
      <div className="rounded-md border shadow-sm">
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

        <AdgGrid
          table={table}
          rowHeightPx={rowHeightPx}
          heightPx={heightPx}
          headerHeightPx={headerHeightPx}
          defaultCellWrap={settings.wrap ?? "single"}
          visibleRows={settings.rowsVisible ?? 10}
          settings={settings}
          rowContextMenu={rowContextMenu}
          onRowDoubleClickRow={(row) => onRowDoubleClick?.(row.original)}
          colors={colors}
        />

        <AdgPagination table={table} />
      </div>
    </div>
  );
}
