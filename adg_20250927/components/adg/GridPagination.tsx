"use client";

import { TreasuryDealTicket } from "@/business/treasury/types";
import { Button } from "@/components/ui/button";
import { useReactTable } from "@tanstack/react-table";

/**
 * Pagination Controls
 */
export default function GridPagination(props: {
  table: ReturnType<typeof useReactTable<TreasuryDealTicket>>;
}) {
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
          First
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
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
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            table.setPageIndex(Math.max(table.getPageCount() - 1, 0))
          }
          disabled={!table.getCanNextPage()}
        >
          Last
        </Button>
      </div>
    </div>
  );
}
