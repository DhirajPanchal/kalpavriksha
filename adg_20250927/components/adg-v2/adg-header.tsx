
"use client";

import * as React from "react";
import { Table, flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { FilterButton } from "./adg-filters-adv";

/** A clean header row component.
 * - Sort toggles only when you click the label area
 * - Filter button stops event propagation so it doesn't sort
 * - Supports left-pinned columns (sticky + left offset)
 */
export default function AdgHeaderRow<T>({
  table,
  headerHeightPx = 56,
}: {
  table: Table<T>;
  headerHeightPx?: number;
}) {
  return (
    <thead className="bg-card" style={{ position: "sticky", top: 0, zIndex: 40, height: headerHeightPx }}>
      {table.getHeaderGroups().map((hg) => (
        <tr key={hg.id} style={{ height: headerHeightPx }}>
          {hg.headers.map((header) => (
            <th
              key={header.id}
              style={{
                width: header.getSize(),
                position: header.column.getIsPinned() ? ("sticky" as const) : undefined,
                left: header.column.getIsPinned() ? header.column.getStart("left") : undefined,
                zIndex: header.column.getIsPinned() ? 50 : undefined,
                background: header.column.getIsPinned() ? "var(--background)" : undefined,
              }}
              className={cn("font-semibold align-middle border-b")}
            >
              {header.isPlaceholder ? null : (
                <div className="flex items-center gap-1" style={{ height: headerHeightPx }}>
                  <button
                    type="button"
                    className={header.column.getCanSort() ? "cursor-pointer select-none inline-flex items-center gap-1" : "inline-flex items-center gap-1"}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: " ▲", desc: " ▼" }[header.column.getIsSorted() as string] ?? null}
                  </button>

                  {/* Filter icon if column has meta.filter */}
                  {(() => {
                    const m: any = header.column.columnDef.meta;
                    if (!m?.filter) return null;
                    return (
                      <span
                        className="ml-1 inline-flex"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <FilterButton table={table} column={header.column} meta={m.filter} />
                      </span>
                    );
                  })()}
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}
