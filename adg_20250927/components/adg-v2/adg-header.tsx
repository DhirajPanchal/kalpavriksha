"use client";

import * as React from "react";
import { Table, flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { FilterButton } from "./adg-filters-adv";
import { Filter, SortAsc } from "lucide-react";

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
    wrap === "multi"
      ? "whitespace-normal break-words"
      : "truncate whitespace-nowrap";

  const textAlign = (a?: Align) =>
    a === "left" ? "text-left" : a === "right" ? "text-right" : "text-center";

  const justify = (a?: Align) =>
    a === "left"
      ? "justify-start"
      : a === "right"
      ? "justify-end"
      : "justify-center";

  // sensible fallback if var(--adg-head-bg) is not defined by wrapper
  const headBgFallback =
    "color-mix(in srgb, rgb(156 163 175) 16%, var(--background, white))";
  const MASK_W = 2; // px width to hide underlying borders/seams

  return (
    <thead
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100, // ensure header is above body
        height: headerHeightPx,
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
                  height: headerHeightPx,
                }}
                className={cn("relative h-full bg-gray-100")}
              >
                <div className="h-full flex flex-row items-stretch border-none border-blue-500">
                  <div className="h-full flex flex-1 items-center border-none border-red-500">
                    {/* This is some text that can wrap and make the row taller. This is some text that can wrap and make the row taller. */}
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>

                  <div className="h-full flex items-center border-none border-red-500">
                    <SortAsc
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    />
                  </div>

                  <div className="h-full flex items-center border-none border-red-500">
                    <Filter />
                  </div>
                </div>
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
