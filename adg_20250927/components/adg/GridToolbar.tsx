"use client";

import { TreasuryDealTicket } from "@/business/treasury/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useReactTable } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

/**
 * Grid Toolbar
 */
export default function GridToolbar(props: {
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  table: ReturnType<typeof useReactTable<TreasuryDealTicket>>;
}) {
  const { globalFilter, setGlobalFilter, table } = props;
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter across columns..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 w-[240px]"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Page size */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Rows:</span>
          <select
            className="h-9 rounded-md border bg-background px-2"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((ps) => (
              <option key={ps} value={ps}>
                {ps}
              </option>
            ))}
          </select>
        </div>

        {/* Column toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              Columns <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllLeafColumns()
              .filter((c) => c.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                  >
                    {column.columnDef.header as string}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
