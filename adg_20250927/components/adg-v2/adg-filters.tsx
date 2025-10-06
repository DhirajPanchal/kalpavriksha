
"use client";

import * as React from "react";
import { Column, Table, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "lucide-react";

// Types for filters
export type FilterKind = "text" | "number" | "enum" | "date";
export interface ColumnFilterMeta {
  kind: FilterKind;
  enumValues?: string[];              // for enum
  placeholder?: string;
}

export function buildFilterFns<T>() {
  return {
    text: (row: Row<T>, columnId: string, filterValue: string) => {
      if (!filterValue) return true;
      const v = String(row.getValue(columnId) ?? "").toLowerCase();
      return v.includes(String(filterValue).toLowerCase());
    },
    number: (row: Row<T>, columnId: string, filterValue: { min?: number; max?: number }) => {
      const v = Number(row.getValue(columnId));
      if (Number.isNaN(v)) return false;
      if (filterValue?.min !== undefined && v < filterValue.min) return false;
      if (filterValue?.max !== undefined && v > filterValue.max) return false;
      return true;
    },
    enum: (row: Row<T>, columnId: string, filterValue: string[]) => {
      if (!filterValue?.length) return true;
      const v = String(row.getValue(columnId));
      return filterValue.includes(v);
    },
    date: (row: Row<T>, columnId: string, filterValue: { from?: string; to?: string }) => {
      const raw = row.getValue(columnId);
      if (!raw) return false;
      const d = new Date(raw as string).getTime();
      const from = filterValue?.from ? new Date(filterValue.from).getTime() : undefined;
      const to = filterValue?.to ? new Date(filterValue.to).getTime() : undefined;
      if (from !== undefined && d < from) return false;
      if (to !== undefined && d > to) return false;
      return true;
    },
  };
}

export function FilterButton<T>({
  table,
  column,
  meta,
}: {
  table: Table<T>;
  column: Column<T, unknown>;
  meta?: ColumnFilterMeta;
}) {
  const [open, setOpen] = React.useState(false);
  const id = column.id;
  const kind = meta?.kind ?? "text";

  // controlled filter state lives in table.getColumn(id).getFilterValue()
  const filterValue = (column.getFilterValue() as any) ?? (kind === "number" ? {} : kind === "date" ? {} : kind === "enum" ? [] : "");

  const setValue = (v: any) => {
    column.setFilterValue(v);
    table.resetPageIndex();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2" aria-label="Filter column">🔎</Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        {kind === "text" && (
          <div className="space-y-2">
            <Input placeholder={meta?.placeholder ?? "contains..."}
                   value={filterValue as string}
                   onChange={(e) => setValue(e.target.value)} />
            <Button variant="outline" onClick={() => setValue("")}>Clear</Button>
          </div>
        )}

        {kind === "number" && (
          <div className="flex items-center gap-2">
            <Input type="number" placeholder="min" value={filterValue.min ?? ""}
                   onChange={(e) => setValue({...filterValue, min: e.target.value === "" ? undefined : Number(e.target.value)})} />
            <Input type="number" placeholder="max" value={filterValue.max ?? ""}
                   onChange={(e) => setValue({...filterValue, max: e.target.value === "" ? undefined : Number(e.target.value)})} />
            <Button variant="outline" onClick={() => setValue({})}>Clear</Button>
          </div>
        )}

        {kind === "enum" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {meta?.enumValues?.map((val) => {
                const active = (filterValue as string[]).includes(val);
                return (
                  <button key={val}
                          onClick={() => {
                            const set = new Set(filterValue as string[]);
                            if (active) set.delete(val); else set.add(val);
                            setValue(Array.from(set));
                          }}
                          className={`h-8 rounded border ${active ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                    {val}
                  </button>
                );
              })}
            </div>
            <Button variant="outline" onClick={() => setValue([])}>Clear</Button>
          </div>
        )}

        {kind === "date" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input type="date" value={filterValue.from ?? ""}
                     onChange={(e) => setValue({ ...filterValue, from: e.target.value || undefined })} />
              <span>to</span>
              <Input type="date" value={filterValue.to ?? ""}
                     onChange={(e) => setValue({ ...filterValue, to: e.target.value || undefined })} />
            </div>
            <Button variant="outline" onClick={() => setValue({})}>Clear</Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
