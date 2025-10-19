"use client";
import { GridSettingsSnapshot, AdgColorConfig } from "./adg-types";
import * as React from "react";
import { Column, Row, Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ColumnFilterMeta } from "./adg-types";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export function buildFilterFns<T>() {
  return {
    text: (row: Row<T>, columnId: string, filterValue: string) => {
      if (!filterValue) return true;
      const v = String(row.getValue(columnId) ?? "").toLowerCase();
      return v.includes(String(filterValue).toLowerCase());
    },
    number: (row: Row<T>, columnId: string, filterValue: any) => {
      const v = Number(row.getValue(columnId));
      if (Number.isNaN(v)) return false;
      if (!filterValue) return true;
      if (filterValue.mode === "range") {
        const min = filterValue.min;
        const max = filterValue.max;
        if (min !== undefined && v < Number(min)) return false;
        if (max !== undefined && v > Number(max)) return false;
        return true;
      } else {
        const op = filterValue.op ?? "==";
        const val = filterValue.value;
        if (val === undefined || val === null || val === "") return true;
        if (op === ">") return v > Number(val);
        if (op === "<") return v < Number(val);
        return v === Number(val);
      }
    },
    enum: (row: Row<T>, columnId: string, filterValue: string[]) => {
      if (!filterValue?.length) return true;
      const v = String(row.getValue(columnId));
      return filterValue.includes(v);
    },
    date: (row: Row<T>, columnId: string, filterValue: any) => {
      const raw = row.getValue(columnId);
      if (!raw) return false;
      const d = new Date(String(raw)).getTime();
      if (!filterValue) return true;
      if (filterValue.mode === "range") {
        const from = filterValue.from
          ? new Date(String(filterValue.from)).getTime()
          : undefined;
        const to = filterValue.to
          ? new Date(String(filterValue.to)).getTime()
          : undefined;
        if (from !== undefined && d < from) return false;
        if (to !== undefined && d > to) return false;
        return true;
      } else {
        const op = filterValue.op ?? "==";
        const val = filterValue.value
          ? new Date(String(filterValue.value)).getTime()
          : undefined;
        if (val === undefined) return true;
        if (op === ">") return d > val;
        if (op === "<") return d < val;
        return d === val;
      }
    },
  };
}

export function AdgFilter<T>({
  table,
  column,
  meta,
  colors,
}: {
  table: Table<T>;
  column: Column<T, unknown>;
  meta?: ColumnFilterMeta;
  colors: AdgColorConfig
}) {
  const [open, setOpen] = React.useState(false);
  const kind = meta?.kind ?? "text";

  const current = column.getFilterValue() as any;
  const initialDraft =
    kind === "enum"
      ? current ?? []
      : kind === "number" || kind === "date"
      ? current ?? { mode: "range" }
      : current ?? "";

  const [draft, setDraft] = React.useState<any>(initialDraft);

  React.useEffect(() => {
    if (!open) setDraft(initialDraft);
  }, [open]); // keep in sync

  const apply = () => {
    column.setFilterValue(draft);
    table.resetPageIndex();
    setOpen(false);
  };
  const clear = () => {
    const cleared =
      kind === "enum"
        ? []
        : kind === "number" || kind === "date"
        ? { mode: "range" }
        : "";
    setDraft(cleared);
    column.setFilterValue(undefined);
    table.resetPageIndex();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
        className={cn("h-full w-full p-0", colors.header.filterHover)}
          aria-label="Filter column"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        >
         <Filter size={16} className={cn(colors.header.filterIconIdle)} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("w-full shadow-md rounded-lg ring-1", colors.popover.border, colors.popover.bg)}
        style={{ minWidth: "320px" }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {kind === "text" && (
          <div className="space-y-2">
            <Input
              placeholder={meta?.placeholder ?? "contains..."}
              value={draft as string}
              onChange={(e) => setDraft(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={apply}>Go</Button>
              <Button variant="outline" onClick={clear}>
                Clear
              </Button>
            </div>
          </div>
        )}

        {kind === "enum" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {meta?.enumValues?.map((val) => {
                const active = (draft as string[]).includes(val);
                return (
                  <button
                    key={val}
                    onClick={() => {
                      const set = new Set(draft as string[]);
                      if (active) set.delete(val);
                      else set.add(val);
                      setDraft(Array.from(set));
                    }}
                    className={`h-8 rounded border ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button onClick={apply}>Go</Button>
              <Button variant="outline" onClick={clear}>
                Clear
              </Button>
            </div>
          </div>
        )}

        {kind === "number" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <button
                className={`px-2 py-1 rounded ${
                  draft?.mode === "range"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
                onClick={() => setDraft({ ...draft, mode: "range" })}
              >
                Range
              </button>
              <button
                className={`px-2 py-1 rounded ${
                  draft?.mode === "single"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
                onClick={() => setDraft({ ...draft, mode: "single" })}
              >
                Single
              </button>
            </div>
            {draft?.mode === "range" ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="min"
                  value={draft.min ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      min:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="max"
                  value={draft.max ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      max:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    })
                  }
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  className="h-9 rounded-md border px-2"
                  value={draft.op ?? "=="}
                  onChange={(e) => setDraft({ ...draft, op: e.target.value })}
                >
                  <option value=">">&gt;</option>
                  <option value="==">=</option>
                  <option value="<">&lt;</option>
                </select>
                <Input
                  type="number"
                  placeholder="value"
                  value={draft.value ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      value:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    })
                  }
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={apply}>Go</Button>
              <Button variant="outline" onClick={clear}>
                Clear
              </Button>
            </div>
          </div>
        )}

        {kind === "date" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <button
                className={`px-2 py-1 rounded ${
                  draft?.mode === "range"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
                onClick={() => setDraft({ ...draft, mode: "range" })}
              >
                Range
              </button>
              <button
                className={`px-2 py-1 rounded ${
                  draft?.mode === "single"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
                onClick={() => setDraft({ ...draft, mode: "single" })}
              >
                Single
              </button>
            </div>
            {draft?.mode === "range" ? (
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={draft.from ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, from: e.target.value || undefined })
                  }
                />
                <span>to</span>
                <Input
                  type="date"
                  value={draft.to ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, to: e.target.value || undefined })
                  }
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  className="h-9 rounded-md border px-2"
                  value={draft.op ?? "=="}
                  onChange={(e) => setDraft({ ...draft, op: e.target.value })}
                >
                  <option value=">">&gt;</option>
                  <option value="==">=</option>
                  <option value="<">&lt;</option>
                </select>
                <Input
                  type="date"
                  value={draft.value ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, value: e.target.value || undefined })
                  }
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={apply}>Go</Button>
              <Button variant="outline" onClick={clear}>
                Clear
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
