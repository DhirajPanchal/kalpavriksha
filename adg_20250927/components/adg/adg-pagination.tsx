"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import {
  LucideChevronFirst,
  LucideChevronLast,
  LucideChevronLeft,
  LucideChevronRight,
} from "lucide-react";

interface AdgPaginationProps<T> {
  grid: Table<T>;
}

export default function AdgPagination<T>(props: AdgPaginationProps<T>) {
  const { grid } = props;
  const page = grid.getState().pagination.pageIndex + 1;
  const pageCount = grid.getPageCount();
  const totalRows = grid.getPrePaginationRowModel().rows.length;
  const pageSize = grid.getState().pagination.pageSize;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, totalRows);

  return (
    <div className="flex items-center justify-between p-2 text-sm">
      <div className="text-muted-foreground">
        {first}–{last} of {totalRows}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => grid.setPageIndex(0)}
          disabled={!grid.getCanPreviousPage()}
        >
          <LucideChevronFirst />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => grid.previousPage()}
          disabled={!grid.getCanPreviousPage()}
        >
          <LucideChevronLeft />
        </Button>
        <span>
          Page {page} / {pageCount || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => grid.nextPage()}
          disabled={!grid.getCanNextPage()}
        >
          <LucideChevronRight />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            grid.setPageIndex(Math.max(grid.getPageCount() - 1, 0))
          }
          disabled={!grid.getCanNextPage()}
        >
          <LucideChevronLast />
        </Button>
      </div>
    </div>
  );
}
