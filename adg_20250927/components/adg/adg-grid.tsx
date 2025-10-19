"use client";

import { cn } from "@/lib/utils";
import { Row, Table, flexRender } from "@tanstack/react-table";
import AdgHeaderRow from "./adg-header";
import { AdgColorConfig, GridSettingsSnapshot } from "./adg-types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useState } from "react";
type Align = "left" | "center" | "right";

interface AdgGridProps<T> {
  table: Table<T>;
  heightPx?: number;
  rowHeightPx: number;
  headerHeightPx?: number;
  defaultCellWrap?: string;
  visibleRows?: number;
  settings?: GridSettingsSnapshot;
  rowContextMenu?: (
    row: ReturnType<Table<T>["getRowModel"]>["rows"][number]
  ) => React.ReactNode;
  onRowDoubleClickRow?: (row: Row<T>) => void;
  colors: AdgColorConfig;
}

export default function AdgGrid<T>({
  table,
  rowHeightPx,
  headerHeightPx = 56,
  defaultCellWrap = "single",
  visibleRows,
  settings,
  rowContextMenu,
  onRowDoubleClickRow,
  colors,
}: AdgGridProps<T>) {
  // console.log("settings :: ");
  // console.log(settings);
  const [hoverColId, setHoverColId] = useState<string | null>(null);
  const rows = table.getRowModel().rows;

  const tableWidth = table.getTotalSize();

  const textAlignClass = (a?: Align) =>
    a === "left" ? "text-left" : a === "right" ? "text-right" : "text-center";

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

  const cellStyle = (index: number, selected = false, pinned = false) => {
    let compose = "";
    // OPAQUE base to avoid bleed-through on pinned
    if (settings?.rowZebra)
      compose +=
        index % 2 ? ` ${colors.row.zebraEven}` : ` ${colors.row.zebraOdd}`;
    else compose += ` ${colors.row.base}`;
    // Hover & selection tints
    compose += ` ${colors.row.hover}`;
    if (selected) compose += ` ${colors.row.selected}`;
    // Row separators
    if (settings?.rowLines) compose += ` border-b ${colors.row.border}`;
    return compose;
  };

  const initialHeight = visibleRows
    ? visibleRows * rowHeightPx + 2
    : rows.length * rowHeightPx;

  const MASK_W = 2;

  return (
    <div
      className="relative overflow-auto scrollbar-custom"
      style={{ isolation: "isolate" }}
    >
      <table
        className="table-fixed border-separate border-spacing-0 w-max"
        style={{ width: tableWidth }}
      >
        <AdgHeaderRow
          table={table}
          headerHeightPx={headerHeightPx}
          defaultHeaderWrap={settings?.headerWrap}
          colors={colors}
        />

        <tbody
          suppressHydrationWarning
          style={{
            position: "relative",
            display: "block",
            height: initialHeight,
          }}
        >
          {table.getRowModel().rows.map((row, index) => {
            const vi = { index, key: row.id, start: index * rowHeightPx };
            const cellWrap = !(defaultCellWrap === "single");
            return (
              <ContextMenu key={vi.key ?? row.id ?? `${row.id}-${vi.index}`}>
                <ContextMenuTrigger asChild>
                  <tr
                    key={vi.key}
                    data-index={vi.index}
                    style={{
                      display: "table",
                      width: tableWidth,
                      tableLayout: "fixed",
                      height: rowHeightPx,
                      zIndex: 0,
                      willChange: "transform",
                      ...(!cellWrap && {
                        position: "absolute",
                        top: 0,
                        transform: `translateY(${vi.start}px)`,
                      }),
                    }}
                    className="group"
                    onDoubleClick={() => onRowDoubleClickRow?.(row)}
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

                      const content = (isPinned: any) => (
                        <div
                          className={cn(
                            "h-full w-full flex items-center min-w-0 overflow-hidden ",
                            cellStyle(vi.index, row.getIsSelected(), isPinned)
                          )}
                        >
                          {/* cellStyle(vi.index, row.getIsSelected()) */}
                          <div
                            className={cn(
                              "flex-1 min-w-0 max-w-full overflow-hidden px-1",
                              textAlignClass(align),
                              wrapClass(wrap)
                            )}
                          >
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
                          title={text}
                          data-pinned={pinned ? "true" : "false"}
                          style={{
                            width: cell.column.getSize(),
                            position: pinned ? ("sticky" as const) : undefined,
                            left: pinned
                              ? cell.column.getStart("left")
                              : undefined,
                            zIndex: pinned ? 140 : 10,
                            height: rowHeightPx,
                          }}
                          className={cn("relative align-middle p-0")}
                          onMouseEnter={() => {
                            if (settings?.enableColumnHover)
                              setHoverColId(cell.column.id);
                          }}
                          onMouseLeave={() => {
                            if (settings?.enableColumnHover)
                              setHoverColId(null);
                          }}
                        >
                          {settings?.enableColumnHover &&
                            hoverColId === cell.column.id && (
                              <div
                                aria-hidden
                                className={cn(
                                  "pointer-events-none absolute inset-0 z-20 transition-[background,box-shadow] duration-150",
                                  colors.columnHover.overlay
                                )}
                              />
                            )}
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
                                zIndex: 150,
                              }}
                            />
                          )}
                          {content(pinned)}
                        </td>
                      );
                    })}
                  </tr>
                </ContextMenuTrigger>
                <ContextMenuContent className="min-w-[220px]">
                  <ContextMenuItem
                    onClick={() => {
                      console.log("Row data:", row.original);
                    }}
                  >
                    Show Data
                  </ContextMenuItem>
                  {typeof rowContextMenu === "function"
                    ? rowContextMenu(row)
                    : null}
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
