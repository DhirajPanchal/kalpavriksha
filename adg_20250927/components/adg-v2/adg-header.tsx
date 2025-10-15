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

          return (
            <th
              key={header.id}
              className={cn("border border-r border-r-red-400 p-0 border-b", active ? "bg-primary/5" : "bg-transparent")}
              style={{ height: headerHeightPx }}
            >
              <div className="h-full w-full flex items-stretch">
                {/* Title */}
                <div className={cn("flex-1 min-w-0 flex items-center font-medium px-2", "text-center")}>
                  {header.column.columnDef.header as React.ReactNode}
                </div>

                {/* Sort buttons + clear */}
                <div className="h-full flex items-center gap-1 px-1">
                  {canSort && (
                    <>
                      <button
                        aria-label="Sort ascending"
                        className={cn(
                          "h-6 w-6 inline-flex items-center justify-center rounded",
                          sorted === "asc" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          col.toggleSorting(false)
                          table.resetPageIndex()
                        }}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>

                      {sorted && (
                        <button
                          aria-label="Clear sort"
                          className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-accent"
                          onClick={(e) => {
                            e.stopPropagation()
                            col.clearSorting()
                            table.resetPageIndex()
                          }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        aria-label="Sort descending"
                        className={cn(
                          "h-6 w-6 inline-flex items-center justify-center rounded",
                          sorted === "desc" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          col.toggleSorting(true)
                          table.resetPageIndex()
                        }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
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
