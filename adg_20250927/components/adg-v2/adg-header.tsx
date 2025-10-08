
"use client";

import * as React from "react";
import { Table, flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { FilterButton } from "./adg-filters-adv";

type Align = "left" | "center" | "right";

/**
 * AdgHeaderRow (pinned seam-hardened)
 * - Header text CENTER by default
 * - Pin-aware layering with higher z-index
 * - Fallback background if CSS vars are missing
 * - Overlay layer defeats host apps that force white backgrounds on <th>
 * - Right-edge mask hides underlying unpinned column borders on left scroll
 */
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

  const textAlign = (a?: Align) =>
    a === "left" ? "text-left" : a === "right" ? "text-right" : "text-center";

  const justify = (a?: Align) =>
    a === "left" ? "justify-start" : a === "right" ? "justify-end" : "justify-center";

  // sensible fallback if var(--adg-head-bg) is not defined by wrapper
  const headBgFallback = "color-mix(in srgb, rgb(156 163 175) 16%, var(--background, white))";
  const MASK_W = 2; // px width to hide underlying borders/seams

  return (
    <thead
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100, // ensure header is above body
        height: headerHeightPx,
        background: "var(--adg-head-bg, " + headBgFallback + ")",
      }}
    >
      {table.getHeaderGroups().map((hg) => (
        <tr key={hg.id} style={{ height: headerHeightPx }}>
          {hg.headers.map((header) => {
            const meta: any = header.column.columnDef.meta ?? {};
            const headerAlign: Align = meta.headerAlign ?? "center";
            const headerWrap: string = meta.headerWrap ?? defaultHeaderWrap;
            const pinned = header.column.getIsPinned();

            return (
              <th
                key={header.id}
                data-pinned={pinned ? "true" : "false"}
                style={{
                  width: header.getSize(),
                  position: pinned ? ("sticky" as const) : undefined,
                  left: pinned ? header.column.getStart("left") : undefined,
                  zIndex: pinned ? 200 : 120, // pinned header above everything
                  background: pinned
                    ? "var(--adg-pin-bg, var(--adg-head-bg, " + headBgFallback + "))"
                    : "var(--adg-head-bg, " + headBgFallback + ")",
                }}
                className={cn("relative align-middle border-b", textAlign(headerAlign))}
              >
                {/* overlay to defeat host CSS like th{ background:white !important } */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "var(--adg-head-bg, " + headBgFallback + ")",
                    zIndex: 0,
                  }}
                />

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
                      background: "var(--adg-pin-bg, var(--adg-head-bg, " + headBgFallback + "))",
                      zIndex: 210, // above this th background
                    }}
                  />
                )}

                {header.isPlaceholder ? null : (
                  <div
                    className="relative grid grid-cols-[1fr_auto] items-center gap-1"
                    style={{ height: headerHeightPx }}
                  >
                    <button
                      type="button"
                      className={cn(
                        "inline-flex w-full items-center gap-1",
                        justify(headerAlign),
                        textAlign(headerAlign),
                        wrapClass(headerWrap),
                        header.column.getCanSort() ? "cursor-pointer select-none" : undefined
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
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {({ asc: " ▲", desc: " ▼" } as any)[header.column.getIsSorted() as string] ?? null}
                    </button>

                    {/* Filter trigger; stopPropagation so it doesn't toggle sort */}
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
