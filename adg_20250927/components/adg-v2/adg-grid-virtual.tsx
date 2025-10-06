
"use client";

import * as React from "react";
import { Table, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { FilterButton } from "./adg-filters";

interface AdgGridVirtualProps<T> {
  table: Table<T>;
  heightPx?: number;          // viewport height
  rowHeightPx: number;        // estimated row height from density
}

/**
 * Virtualized body with a single TABLE element to keep column widths aligned.
 * - Sticky THEAD with high z-index so rows never paint over it
 * - Left-pin only via position: sticky left + high z-index and background
 * - Widths come from tanstack sizes; table uses table-fixed + w-max so a real h-scroll appears
 */
export default function AdgGridVirtual<T>(props: AdgGridVirtualProps<T>) {
  const { table, heightPx = 556, rowHeightPx } = props;
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rows = table.getRowModel().rows;
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeightPx,
    overscan: 8,
  });

  const tableWidth = table.getTotalSize(); // sum of sizes -> guarantees header/body share exact width

  return (
    <div ref={parentRef} className="relative overflow-auto" style={{ maxHeight: heightPx }}>
      <table className="table-fixed border-separate border-spacing-0 w-max" style={{ width: tableWidth }}>
        <thead
          className="bg-card"
          style={{ position: "sticky", top: 0, zIndex: 40 }}
        >
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
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
                  className={cn("h-14 font-semibold align-middle border-b")}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={header.column.getCanSort() ? "cursor-pointer select-none" : undefined}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: " ▲", desc: " ▼" }[header.column.getIsSorted() as string] ?? null}
                      {/* Filter button if meta.filter exists */}
                      {(() => {
                        const m: any = header.column.columnDef.meta;
                        return m?.filter ? (
                          <span className="ml-1 inline-block align-middle">
                            <FilterButton table={table} column={header.column} meta={m.filter} />
                          </span>
                        ) : null;
                      })()}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* Virtual body */}
        <tbody
          style={{
            position: "relative",
            display: "block",
            height: rowVirtualizer.getTotalSize(),
          }}
        >
          {rowVirtualizer.getVirtualItems().map((vi) => {
            const row = rows[vi.index];
            return (
              <tr
                key={row.id}
                data-index={vi.index}
                style={{
                  position: "absolute",
                  top: 0,
                  transform: `translateY(${vi.start}px)`,
                  display: "table",
                  width: tableWidth,
                  tableLayout: "fixed",
                  zIndex: 0,
                  willChange: "transform",
                }}
                className="group"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                      position: cell.column.getIsPinned() ? ("sticky" as const) : undefined,
                      left: cell.column.getIsPinned() ? cell.column.getStart("left") : undefined,
                      zIndex: cell.column.getIsPinned() ? 30 : undefined,
                      background: cell.column.getIsPinned() ? "var(--background)" : undefined,
                    }}
                    className="p-2 text-sm text-right border-b"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
