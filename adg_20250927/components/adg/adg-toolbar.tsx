"use client";

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
import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

interface AdgToolbarProps<T> {
  grid: Table<T>;
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  injectLeft?: ReactNode;
  injectCenter?: ReactNode;
  injectRight?: ReactNode;
}

export default function AdgToolbar<T>(props: AdgToolbarProps<T>) {
  const {
    grid,
    globalFilter,
    setGlobalFilter,
    injectLeft,
    injectCenter,
    injectRight,
  } = props;  
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2">
      {injectLeft}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter across columns..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 w-[240px]"
        />
      </div>
      {injectCenter}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Rows:</span>
          <select
            className="h-9 rounded-md border bg-background px-2"
            value={grid.getState().pagination.pageSize}
            onChange={(e) => grid.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((ps) => (
              <option key={ps} value={ps}>
                {ps}
              </option>
            ))}
          </select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              Columns <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {grid
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
      {injectRight}
    </div>
  );
}
