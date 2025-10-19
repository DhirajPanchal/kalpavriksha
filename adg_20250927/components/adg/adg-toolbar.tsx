import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings } from "lucide-react"

export function AdgToolbar<T>({
  table,
  globalFilter,
  setGlobalFilter,
  openSettings,
  setOpenSettings,
  injectLeft,
  injectCenter,
  injectRight,
}: {
  table: Table<T>
  globalFilter: string
  setGlobalFilter: (v: string) => void
  openSettings: boolean
  setOpenSettings: (v: boolean) => void
  injectLeft?: React.ReactNode
  injectCenter?: React.ReactNode
  injectRight?: React.ReactNode
}) {
  const hasAnyFilters =
    (table.getState().columnFilters?.length ?? 0) > 0 ||
    (table.getState().sorting?.length ?? 0) > 0 ||
    (globalFilter?.length ?? 0) > 0

  const clearAll = () => {
    table.resetSorting()
    table.resetColumnFilters()
    setGlobalFilter("")
    table.resetPageIndex()
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2">
      {injectLeft}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter across columns..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 w-[240px]"
        />
      </div>
      {injectCenter}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Rows:</span>
          <select
            className="h-9 rounded-md border bg-background px-2"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((ps) => (
              <option key={ps} value={ps}>
                {ps}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant={hasAnyFilters ? "destructive" : "outline"}
          className="h-9"
          onClick={clearAll}
          title="Clear all filters, sorts and search"
        >
          Clear&nbsp;All
        </Button>
        <Button
          variant="outline"
          className="h-9"
          onClick={() => setOpenSettings(true)}
          aria-pressed={openSettings}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      {injectRight}
    </div>
  )
}

export default AdgToolbar
