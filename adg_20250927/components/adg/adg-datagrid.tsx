"use client";

import { treasuryDealColumns } from "@/business/treasury/columns";
import { sampleTreasuryDeals } from "@/business/treasury/data";
import { TreasuryDealTicket } from "@/business/treasury/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { ReactNode } from "react";
import AdgToolbar from "./adg-toolbar";
import AdgPagination from "./adg-pagination";
import AdgGrid from "./adg-grid";

interface AdgDataGridConfig {
  toolbarLeft?: ReactNode;
  toolbarCenter?: ReactNode;
  toolbarRight?: ReactNode;
}

interface AdgDataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  config?: AdgDataGridConfig;
}

export default function AdgDataGrid<T>({
  data,
  columns,
  config,
}: AdgDataGridProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
    left: ["dealId", "product", "ccyPair", "notional"],
    right: ["actions"],
  });

  const grid = useReactTable({
    data,
    columns: columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      columnPinning,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnPinningChange: setColumnPinning,
    globalFilterFn: (row, _columnId, filterValue: string) => {
      if (!filterValue) return true;
      const v = filterValue.toLowerCase();
      // Simple contains across key fields
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
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    enableRowSelection: true,
    debugTable: false,
  });

  return (
    <div className="w-full">

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">

        {/* Toolbar */}
        <AdgToolbar
          grid={grid}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          injectLeft={config?.toolbarLeft}
          injectCenter={config?.toolbarCenter}
          injectRight={config?.toolbarRight}
        />

        {/* Table */}
        <AdgGrid grid={grid}/>


        {/* Pagination */}
        <AdgPagination grid={grid} />
      </div>
    </div>
  );
}
