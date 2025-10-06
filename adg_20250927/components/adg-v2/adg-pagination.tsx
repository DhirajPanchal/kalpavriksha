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
  table: Table<T>;
}

export default function AdgPagination<T>(props: AdgPaginationProps<T>) {
  const { table } = props;
  const page = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const totalRows = table.getPrePaginationRowModel().rows.length;
  const pageSize = table.getState().pagination.pageSize;
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
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <LucideChevronFirst />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <LucideChevronLeft />
        </Button>
        <span>
          Page {page} / {pageCount || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <LucideChevronRight />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            table.setPageIndex(Math.max(table.getPageCount() - 1, 0))
          }
          disabled={!table.getCanNextPage()}
        >
          <LucideChevronLast />
        </Button>
      </div>
    </div>
  );
}
