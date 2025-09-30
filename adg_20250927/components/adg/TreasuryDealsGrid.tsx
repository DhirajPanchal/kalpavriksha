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
import GridPagination from "./GridPagination";
import GridToolbar from "./GridToolbar";

/**
 * Main Grid Component
 */
export default function TreasuryDealsGrid({
  data = sampleTreasuryDeals,
}: {
  data?: TreasuryDealTicket[];
}) {
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

  const table = useReactTable({
    data,
    columns: treasuryDealColumns,
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
        String(row.original[k as keyof TreasuryDealTicket])
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
        <GridToolbar
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          table={table}
        />

        {/* Table */}
        <div className="overflow-auto">
          {/* scroll container */}
          <Table className="min-w-[980px]">
            <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/30">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : undefined
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{ asc: " ▲", desc: " ▼" }[
                            header.column.getIsSorted() as string
                          ] ?? null}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={
                      row.original.status === "Cancelled"
                        ? "bg-destructive/5 hover:bg-destructive/10"
                        : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <GridPagination table={table} />
      </div>
    </div>
  );
}
