import * as React from "react"
import { Column, Table } from "@tanstack/react-table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter as FilterIcon, X } from "lucide-react"

export function AdgFilterButton<T>({
  column,
  table
}: {
  column: Column<T, unknown>
  table: Table<T>
}) {
  const [open, setOpen] = React.useState(false)
  const active = column.getIsFiltered()
  const filterValue = (column.getFilterValue() ?? "") as string
  const setFilter = (v: string) => column.setFilterValue(v)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={active ? "secondary" : "ghost"}
          size="sm"
          className={`h-7 px-2 ${active ? "text-primary" : ""}`}
          aria-label={active ? "Edit filter (active)" : "Add filter"}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <FilterIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64"
        side="bottom"
        align="start"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <Input
            className="h-8"
            placeholder="Filter value…"
            value={filterValue}
            onChange={(e) => setFilter(e.target.value)}
          />
          {active && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                column.setFilterValue(undefined)
                table.resetPageIndex()
              }}
              title="Clear filter"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            className="h-8"
            onClick={() => {
              setOpen(false)
              table.resetPageIndex()
            }}
          >
            Go
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
