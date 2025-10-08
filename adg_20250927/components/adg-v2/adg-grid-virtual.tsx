"use client";

import * as React from "react";
import { Table, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import AdgHeaderRow from "./adg-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Align = "left" | "center" | "right";

interface AdgGridVirtualProps<T> {
  table: Table<T>;
  heightPx?: number;
  rowHeightPx: number;
  headerHeightPx?: number;
  defaultCellWrap?: string; // "single" | "multi"
}

export default function AdgGridVirtual<T>({
  table,
  heightPx = 556,
  rowHeightPx,
  headerHeightPx = 56,
  defaultCellWrap = "single",
}: AdgGridVirtualProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeightPx,
    overscan: 8,
  });

  const tableWidth = table.getTotalSize();

  const alignClass = (a?: Align) =>
    a === "left" ? "text-left" : a === "right" ? "text-right" : "text-center";

  const textAlignClass = (a?: Align) =>
    a === "left" ? "text-left" : a === "right" ? "text-right" : "text-center";

  const justifyClass = (a?: Align) =>
    a === "left"
      ? "justify-start"
      : a === "right"
      ? "justify-end"
      : "justify-center";

  const wrapClass = (wrap?: string) =>
    wrap === "multi"
      ? "whitespace-normal break-words"
      : "truncate whitespace-nowrap";

  const defaultAlignForType = (typ?: string): Align => {
    switch (typ) {
      case "number":
        return "right";
      case "enum":
      case "date":
        return "center";
      default:
        return "left";
    }
  };

  const cellStyle = (index: number) => {
    let compose: string =
      index % 2 ? "bg-gray-100 dark:bg-gray-700" : "bg-white dark:bg-gray-600";
    return compose;
  };

  const initialHeight = rows.length * rowHeightPx;
  const totalSize = mounted ? rowVirtualizer.getTotalSize() : initialHeight;

  const MASK_W = 2; // px width to hide underlying borders/seams for pinned cells

  return (
    <div
      ref={parentRef}
      className="relative overflow-auto"
      style={{ maxHeight: heightPx, isolation: "isolate" }}
    >
      <table
        className="table-fixed border-separate border-spacing-0 w-max"
        style={{ width: tableWidth }}
      >
        <AdgHeaderRow
          table={table}
          headerHeightPx={headerHeightPx}
          defaultHeaderWrap={defaultCellWrap}
        />

        <tbody
          suppressHydrationWarning
          style={{ position: "relative", display: "block", height: totalSize }}
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
                  height: rowHeightPx,
                  zIndex: 0,
                  willChange: "transform",
                }}
                className="group"
              >
                {row.getVisibleCells().map((cell) => {
                  const meta: any = cell.column.columnDef.meta ?? {};
                  const align: Align =
                    meta.align ?? defaultAlignForType(meta.type);
                  const wrap: string = meta.wrap ?? defaultCellWrap;
                  const pinned = cell.column.getIsPinned();

                  const rawValue = row.getValue(cell.column.id) as any;
                  const text =
                    typeof rawValue === "string"
                      ? rawValue
                      : String(rawValue ?? "");

                  const content = (
                    <div
                      className={cn(
                        "h-full w-full flex items-center", // vertical center
                        justifyClass(align), // flex-item horizontal
                        textAlignClass(align), // text-node horizontal
                        wrapClass(wrap),
                        cellStyle(row.index)
                      )}
                    >
                      {/* make the “thing” inside a single flex item so justify-* always works */}
                      <div className="inline-flex items-center max-w-full">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </div>
                  );

                  return (
                    <td
                      key={cell.id}
                      data-pinned={pinned ? "true" : "false"}
                      style={{
                        width: cell.column.getSize(),
                        position: pinned ? ("sticky" as const) : undefined,
                        left: pinned ? cell.column.getStart("left") : undefined,
                        zIndex: pinned ? 140 : 10,
                        background: pinned
                          ? "var(--adg-pin-bg, var(--adg-head-bg, var(--background)))"
                          : "var(--background)",
                        height: rowHeightPx,
                      }}
                      className="relative align-middle p-0"
                    >
                      {/* right-edge mask to hide underlying unpinned borders when scrolled left */}
                      {pinned && (
                        <div
                          aria-hidden
                          className="pointer-events-none"
                          style={{
                            position: "absolute",
                            top: 0,
                            right: -MASK_W,
                            width: MASK_W,
                            height: "100%",
                            background: "inherit",
                            zIndex: 150, // above cell content, hides any seam
                          }}
                        />
                      )}

                      {wrap === "single" ? (
                        <TooltipProvider>
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>{content}</TooltipTrigger>
                            <TooltipContent>{text}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        content
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
