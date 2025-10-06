
"use client";

import * as React from "react";
import { Table, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import AdgHeaderRow from "./adg-header";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const wrapClass = (wrap?: string) =>
    wrap === "multi" ? "whitespace-normal break-words" : "truncate whitespace-nowrap";

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

  const initialHeight = rows.length * rowHeightPx;
  const totalSize = mounted ? rowVirtualizer.getTotalSize() : initialHeight;

  return (
    <div ref={parentRef} className="relative overflow-auto" style={{ maxHeight: heightPx }}>
      <table className="table-fixed border-separate border-spacing-0 w-max" style={{ width: tableWidth }}>
        <AdgHeaderRow table={table} headerHeightPx={headerHeightPx} defaultHeaderWrap={defaultCellWrap} />

        <tbody suppressHydrationWarning style={{ position: "relative", display: "block", height: totalSize }}>
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
                  const align: Align = meta.align ?? defaultAlignForType(meta.type);
                  const wrap: string = meta.wrap ?? defaultCellWrap;

                  const rawValue = row.getValue(cell.column.id) as any;
                  const text = typeof rawValue === "string" ? rawValue : String(rawValue ?? "");

                  const content = (
                    <div className={wrapClass(wrap)} style={{ height: rowHeightPx, lineHeight: `${rowHeightPx - 10}px` }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  );

                  return (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        position: cell.column.getIsPinned() ? ("sticky" as const) : undefined,
                        left: cell.column.getIsPinned() ? cell.column.getStart("left") : undefined,
                        zIndex: cell.column.getIsPinned() ? 30 : undefined,
                        background: cell.column.getIsPinned() ? "var(--adg-pin-bg)" : undefined,
                        height: rowHeightPx,
                      }}
                      className={alignClass(align)}
                    >
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
