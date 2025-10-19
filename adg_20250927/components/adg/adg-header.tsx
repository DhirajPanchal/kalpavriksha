import * as React from "react";
import { flexRender, Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import { AdgFilter } from "./adg-filters";

type WrapMode = "single" | "multi";

export function AdgHeaderRow<T>({
  table,
  headerHeightPx = 64,
  defaultHeaderWrap = "single",
}: {
  table: Table<T>;
  headerHeightPx: number;
  defaultHeaderWrap?: string;
}) {

  const wrapClass = (wrap?: string) =>
    wrap === "multi"
      ? "whitespace-normal break-words"
      : "truncate whitespace-nowwrap";

  const cellStyle = (pinned: any) =>
    pinned
      ? "border-b border-b-4 border-b-sky-600 "
      : "border-b border-b-gray-200";

  const sortingState = table.getState().sorting;

  return (
    <thead
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: headerHeightPx,
      }}
    >
      {table.getHeaderGroups().map((hg) => (
        <tr key={hg.id} style={{ height: headerHeightPx }}>
          {hg.headers.map((header) => {
            if (header.isPlaceholder)
              return <th key={header.id} className="p-0" />;

            const meta: any = header.column.columnDef.meta ?? {};
            const headerWrap: string = meta.headerWrap ?? defaultHeaderWrap;
            const pinned = header.column.getIsPinned();

            const col = header.column;
            const canSort = col.getCanSort();
            const sorted = col.getIsSorted() as false | "asc" | "desc";
            const filtered = col.getIsFiltered();
            const active = !!sorted || !!filtered;

            const orderIndex = sortingState.findIndex((s) => s.id === col.id);
            const showOrderNum = sortingState.length > 1 && orderIndex >= 0;
            const orderNum = orderIndex + 1;

            return (
              <th
                key={header.id}
                data-pinned={pinned ? "true" : "false"}
                style={{
                  width: header.getSize(),
                  height: headerHeightPx,
                  position: pinned ? ("sticky" as const) : undefined,
                  left: pinned ? header.column.getStart("left") : undefined,
                  zIndex: pinned ? 200 : 120,
                }}
                title={String(
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  ) || ""
                )}
                className={cn(
                  "relative h-full font-semibold border-r border-r-gray-100",
                  cellStyle(pinned),
                  active
                    ? "bg-gradient-to-l from-gray-50 via-yellow-50 to-yellow-50"
                    : "bg-gradient-to-l from-gray-50 via-gray-50 to-gray-100"
                )}
              >
                <div className="h-full w-full flex flex-row items-stretch">
                  <div
                    className={cn(
                      "flex flex-1 items-center justify-center hover:bg-white text-gray-800",
                      wrapClass(headerWrap)
                    )}
                    style={
                      headerWrap === "single"
                        ? {
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            direction: "ltr",
                          }
                        : {
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }
                    }
                  >
                    <span
                      style={
                        headerWrap === "single"
                          ? {
                              display: "inline-block",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }
                          : {}
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                  </div>

                  {canSort && (
                    <div className="flex flex-col justify-center items-center min-w-[24px]">
                      <div
                        className={cn(
                          "w-full flex items-end justify-center grow hover:bg-sky-100 cursor-pointer",
                          sorted === "asc" ? "bg-sky-100" : ""
                        )}
                        onClick={() => {
                          col.toggleSorting(false, true);
                          table.resetPageIndex();
                        }}
                      >
                        <ChevronUp size={16} className="text-sky-600" />
                      </div>
                      {sorted && (
                        <div
                          className={cn(
                            "w-full flex items-end justify-center grow hover:bg-sky-100 cursor-pointer"
                          )}
                          onClick={() => {
                            col.clearSorting();
                            table.resetPageIndex();
                          }}
                        >
                          {showOrderNum && (
                            <span className="text-sky-600 text-xs">
                              {orderNum}
                            </span>
                          )}
                          <X size={16} className="text-sky-600" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "w-full flex items-end justify-center grow hover:bg-sky-100 cursor-pointer",
                          sorted === "desc" ? "bg-gary-100" : ""
                        )}
                        onClick={() => {
                          col.toggleSorting(true, true);
                          table.resetPageIndex();
                        }}
                      >
                        <ChevronDown size={16} className="text-sky-600" />
                      </div>
                    </div>
                  )}

                  {(() => {
                    const m: any = header.column.columnDef.meta;
                    if (!m?.filter) return null;
                    return (
                      <div
                        className={cn(
                          "flex px-0.5 hover:bg-sky-100 cursor-pointer min-w-[24px]",
                          filtered ? "bg-sky-100" : ""
                        )}
                      >
                        <AdgFilter
                          meta={m.filter}
                          column={header.column}
                          table={table}
                        />
                      </div>
                    );
                  })()}
                </div>
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}

export default AdgHeaderRow;
