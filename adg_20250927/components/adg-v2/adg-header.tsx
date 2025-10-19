import * as React from "react"
import { Table } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown, X } from "lucide-react"
import { AdgFilterButton } from "./adg-filters-adv"

type WrapMode = "single" | "multi"

export function AdgHeaderRow<T>({
  table,
  headerHeightPx,
  defaultHeaderWrap = "single",
}: {
  table: Table<T>
  headerHeightPx: number
  defaultHeaderWrap?: WrapMode
}) {
  const headerGroup = table.getHeaderGroups()[0]
  const sortingState = table.getState().sorting // <- array of {id, desc}

  return (
    <thead>
      <tr className="group" style={{ height: headerHeightPx }}>
        {headerGroup.headers.map((header) => {
          if (header.isPlaceholder) return <th key={header.id} className="p-0" />

          const col = header.column
          const sorted = col.getIsSorted() as false | "asc" | "desc"
          const filtered = col.getIsFiltered()
          const canSort = col.getCanSort()
          const active = !!sorted || !!filtered

          // order number (1-based) shown only when multi-sorted
          const orderIndex = sortingState.findIndex((s) => s.id === col.id)
          const showOrderNum = sortingState.length > 1 && orderIndex >= 0
          const orderNum = orderIndex + 1

          const setAscKeepOthers = () => col.toggleSorting(false, true) // desc=false, multi=true
          const setDescKeepOthers = () => col.toggleSorting(true,  true) // desc=true,  multi=true
          const clearOnlyThis   = () => col.clearSorting()               // remove this col only

          return (
            <th
              key={header.id}
              className={cn(
                "p-0 border-b",
                active ? "bg-primary/5" : "bg-transparent"
              )}
              style={{ height: headerHeightPx }}
            >
              <div className="h-full w-full flex items-stretch">
                {/* Title */}
                <div className={cn("flex-1 min-w-0 flex items-center font-medium px-2", "text-center")}>
                  <span className="truncate">{header.column.columnDef.header as React.ReactNode}</span>
                </div>

                {/* Sort buttons + order badge + filter */}
                <div className="h-full flex items-center gap-1 px-1">
                  {canSort && (
                    <>
                      <button
                        aria-label="Sort ascending (keep others)"
                        className={cn(
                          "h-6 w-6 inline-flex items-center justify-center rounded",
                          sorted === "asc" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                        )}
                        onClick={(e) => { e.stopPropagation(); setAscKeepOthers(); table.resetPageIndex(); }}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>

                      {sorted && (
                        <button
                          aria-label="Clear sort for this column"
                          className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-accent"
                          onClick={(e) => { e.stopPropagation(); clearOnlyThis(); table.resetPageIndex(); }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        aria-label="Sort descending (keep others)"
                        className={cn(
                          "h-6 w-6 inline-flex items-center justify-center rounded",
                          sorted === "desc" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                        )}
                        onClick={(e) => { e.stopPropagation(); setDescKeepOthers(); table.resetPageIndex(); }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>

                      {/* Sort order badge (1..N) only when multi-sort is active */}
                      {showOrderNum && (
                        <span className="ml-1 inline-flex items-center justify-center
                                         h-5 min-w-[1.0rem] rounded-full bg-primary/10
                                         text-primary text-[10px] leading-none px-1">
                          {orderNum}
                        </span>
                      )}
                    </>
                  )}

                  {/* Filter trigger */}
                  <AdgFilterButton column={col} table={table} />
                </div>
              </div>
            </th>
          )
        })}
      </tr>
    </thead>
  )
}

export default AdgHeaderRow
