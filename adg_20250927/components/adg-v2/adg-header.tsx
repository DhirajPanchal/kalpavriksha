
"use client";

import * as React from "react";
import { Table, flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { FilterButton } from "./adg-filters-adv";

type Align = "left" | "center" | "right";

/**
 * AdgHeaderRow
 * - Sticky header with pin-aware cells (left pin)
 * - Header text is CENTER aligned by default
 * - Filter button does not trigger sort (stops event propagation)
 * - Uses a 2-column CSS grid (1fr for title/sort, auto for filter icon) so the title remains centered
 */
export default function AdgHeaderRow<T>({
  table,
  headerHeightPx = 56,
  defaultHeaderWrap = "single", // accepts "single" | "multi" but typed as string to match your snapshot
}: {
  table: Table<T>;
  headerHeightPx?: number;
  defaultHeaderWrap?: string;
}) {
  const wrapClass = (wrap?: string) =>
    wrap === "multi" ? "whitespace-normal break-words" : "truncate whitespace-nowrap";

  const textAlign = (a?: Align) =>
    a === "left" ? "text-left" : a === "right" ? "text-right" : "text-center";

  const justify = (a?: Align) =>
    a === "left" ? "justify-start" : a === "right" ? "justify-end" : "justify-center";

  return (
    <thead
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        height: headerHeightPx,
        background: "var(--adg-head-bg)",
      }}
    >
      {table.getHeaderGroups().map((hg) => (
        <tr key={hg.id} style={{ height: headerHeightPx }}>
          {hg.headers.map((header) => {
            const meta: any = header.column.columnDef.meta ?? {};
            // Default header alignment is CENTER
            const headerAlign: Align = meta.headerAlign ?? "center";
            const headerWrap: string = meta.headerWrap ?? defaultHeaderWrap;

            return (
              <th
                key={header.id}
                style={{
                  width: header.getSize(),
                  position: header.column.getIsPinned() ? ("sticky" as const) : undefined,
                  left: header.column.getIsPinned()
                    ? header.column.getStart("left")
                    : undefined,
                  zIndex: header.column.getIsPinned() ? 50 : undefined,
                  background: header.column.getIsPinned()
                    ? "var(--adg-pin-bg)"
                    : undefined,
                }}
                className={cn("align-middle border-b", textAlign(headerAlign))}
              >
                {header.isPlaceholder ? null : (
                  <div
                    className="grid grid-cols-[1fr_auto] items-center gap-1"
                    style={{ height: headerHeightPx }}
                  >
                    {/* Title + sort lives in the 1fr track and is centered by headerAlign */}
                    <button
                      type="button"
                      className={cn(
                        "inline-flex w-full items-center gap-1",
                        justify(headerAlign),
                        textAlign(headerAlign),
                        wrapClass(headerWrap),
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : undefined
                      )}
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      title={
                        typeof header.column.columnDef.header === "string"
                          ? String(header.column.columnDef.header)
                          : undefined
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {({ asc: " ▲", desc: " ▼" } as any)[
                        header.column.getIsSorted() as string
                      ] ?? null}
                    </button>

                    {/* Filter trigger in the auto track; stops propagation so sort doesn't toggle */}
                    {(() => {
                      const m: any = header.column.columnDef.meta;
                      if (!m?.filter) return null;
                      return (
                        <span
                          className="ml-1 inline-flex"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <FilterButton
                            table={table}
                            column={header.column}
                            meta={m.filter}
                          />
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
