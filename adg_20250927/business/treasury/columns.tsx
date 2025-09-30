"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    ColumnDef
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { fmtDate, fmtNum, statusClass } from "./helper";
import { TreasuryDealTicket } from "./types";


/**
 * Column Definitions
 */
export const treasuryDealColumns: ColumnDef<TreasuryDealTicket>[] = [
  {
    accessorKey: "dealId",
    header: () => <span className="whitespace-nowrap">Deal ID</span>,
    size: 120,
    cell: ({ row }) => (
      <span className="font-medium tabular-nums tracking-tight">
        {row.original.dealId}
      </span>
    ),
  },
  {
    accessorKey: "product",
    header: "Product",
    size: 110,
  },
  {
    accessorKey: "side",
    header: "Side",
    size: 90,
    cell: ({ row }) => (
      <Badge variant={row.original.side === "Buy" ? "default" : "secondary"}>
        {row.original.side}
      </Badge>
    ),
  },
  {
    accessorKey: "ccyPair",
    header: () => <span className="whitespace-nowrap">CCY Pair</span>,
    size: 110,
  },
  {
    accessorKey: "notional",
    header: "Notional",
    size: 140,
    cell: ({ row }) => (
      <span className="font-mono tabular-nums">{fmtNum(row.original.notional)}</span>
    ),
    sortingFn: "basic",
  },
  {
    accessorKey: "rate",
    header: "Rate",
    size: 90,
    cell: ({ row }) => (
      <span className="font-mono tabular-nums">{row.original.rate.toFixed(4)}</span>
    ),
  },
  {
    accessorKey: "tradeDate",
    header: () => <span className="whitespace-nowrap">Trade Date</span>,
    size: 140,
    cell: ({ row }) => fmtDate(row.original.tradeDate),
  },
  {
    accessorKey: "valueDate",
    header: () => <span className="whitespace-nowrap">Value Date</span>,
    size: 140,
    cell: ({ row }) => fmtDate(row.original.valueDate),
  },
  {
    accessorKey: "desk",
    header: "Desk",
    size: 120,
  },
  {
    accessorKey: "legalEntity",
    header: () => <span className="whitespace-nowrap">Legal Entity</span>,
    size: 220,
  },
  {
    accessorKey: "region",
    header: "Region",
    size: 110,
  },
  {
    accessorKey: "site",
    header: "Site",
    size: 140,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 130,
    cell: ({ row }) => (
      <Badge className={statusClass[row.original.status]}>{row.original.status}</Badge>
    ),
  },
  {
    id: "actions",
    header: "",
    size: 60,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const deal = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open row actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <button
              className="px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground w-full rounded-md"
              onClick={() => alert(`View ${deal.dealId}`)}
            >
              View
            </button>
            <button
              className="px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground w-full rounded-md"
              onClick={() => alert(`Amend ${deal.dealId}`)}
            >
              Amend
            </button>
            <button
              className="px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground w-full rounded-md"
              onClick={() => alert(`Cancel ${deal.dealId}`)}
            >
              Cancel
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
