"use client";

import * as React from "react";
import { Table, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";

import AdgHeaderRow from "@/components/adg-v2/adg-header";

interface AdgGridVirtualProps<T> {
  table: Table<T>;
  heightPx?: number; // viewport height
  rowHeightPx: number; // estimated row height from density
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
    <div
      ref={parentRef}
      className="relative overflow-auto"
      style={{ maxHeight: heightPx }}
    >
      <table
        className="table-fixed border-separate border-spacing-0 w-max"
        style={{ width: tableWidth }}
      >
        <AdgHeaderRow table={table} headerHeightPx={56} />

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
                      position: cell.column.getIsPinned()
                        ? ("sticky" as const)
                        : undefined,
                      left: cell.column.getIsPinned()
                        ? cell.column.getStart("left")
                        : undefined,
                      zIndex: cell.column.getIsPinned() ? 30 : undefined,
                      background: cell.column.getIsPinned()
                        ? "var(--background)"
                        : undefined,
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
