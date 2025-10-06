
"use client";

import * as React from "react";
import { Table, flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { FilterButton } from "./adg-filters-adv";

type Align = "left" | "center" | "right";

export default function AdgHeaderRow<T>({
  table,
  headerHeightPx = 56,
  defaultHeaderWrap = "single",
}: {
  table: Table<T>;
  headerHeightPx?: number;
  defaultHeaderWrap?: string;
}) {
  const wrapClass = (wrap?: string) =>
    wrap === "multi" ? "whitespace-normal break-words" : "truncate whitespace-nowrap";
  const alignClass = (a?: Align) =>
    a === "left" ? "text-left" : a === "right" ? "text-right" : "text-center";

  return (
    <thead style={{ position: "sticky", top: 0, zIndex: 40, height: headerHeightPx, background: "var(--adg-head-bg)" }}>
      {table.getHeaderGroups().map((hg) => (
        <tr key={hg.id} style={{ height: headerHeightPx }}>
          {hg.headers.map((header) => {
            const meta: any = header.column.columnDef.meta ?? {};
            const headerAlign: Align = meta.headerAlign ?? "center";
            const headerWrap: string = meta.headerWrap ?? defaultHeaderWrap;

            return (
              <th
                key={header.id}
                style={{ width: header.getSize(), position: header.column.getIsPinned() ? ("sticky" as const) : undefined, left: header.column.getIsPinned() ? header.column.getStart("left") : undefined, zIndex: header.column.getIsPinned() ? 50 : undefined, background: header.column.getIsPinned() ? "var(--adg-pin-bg)" : undefined }}
                className={cn("align-middle border-b", alignClass(headerAlign))}
              >
                {header.isPlaceholder ? null : (
                  <div className="flex items-center gap-1" style={{ height: headerHeightPx }}>
                    <button type="button" className={cn("inline-flex items-center gap-1 w-full", wrapClass(headerWrap), alignClass(headerAlign), header.column.getCanSort() ? "cursor-pointer select-none" : undefined)} onClick={header.column.getToggleSortingHandler()} title={typeof header.column.columnDef.header === "string" ? String(header.column.columnDef.header) : undefined}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: " ▲", desc: " ▼" }[header.column.getIsSorted() as string] ?? null}
                    </button>
                    {(() => {
                      const m: any = header.column.columnDef.meta;
                      if (!m?.filter) return null;
                      return (
                        <span className="ml-1 inline-flex" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                          <FilterButton table={table} column={header.column} meta={m.filter} />
                        </span>
                      );
                    })()}
                  </div>
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
