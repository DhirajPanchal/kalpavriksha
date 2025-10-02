"use client";

import { cn } from "@/lib/utils";
import { flexRender, Table } from "@tanstack/react-table";

interface AdgGridProps<T> {
  grid: Table<T>;
}

export default function AdgGrid<T>(props: AdgGridProps<T>) {
  const { grid } = props;

  const headStyle = (column: string) => {
    let compose: string = "bg-gray-100 dark:bg-gray-900";
    return compose;
  };

  const cellStyle = (index: number) => {
    let compose: string =
      index % 2 ? "bg-gray-100 dark:bg-gray-700" : "bg-white dark:bg-gray-600";
    return compose;
  };

  return (
    <div className="relative overflow-auto max-h-[556px]">
      <table className="w-full border-separate border-spacing-0">
        <thead className="sticky top-0 z-10 bg-card">
          {grid.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className={cn(
                    "h-14 font-semibold align-middle",
                    headStyle(header.column.id)
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {grid.getRowModel().rows.length ? (
            grid.getRowModel().rows.map((row) => (
              <tr key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className={cn(
                      "p-2 text-sm text-right",
                      cellStyle(row.index)
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <th
                colSpan={grid.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </th>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
